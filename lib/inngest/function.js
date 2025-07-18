import { sendEmail } from "@/actions/send-email";
import { db } from "../prisma";
import { inngest } from "./client";
import EmailTemplate, { EmailForRecurring, WelcomeTemplate } from "@/emails/template";
import { GoogleGenerativeAI } from "@google/generative-ai";

  

export const checkBudgetAlerts = inngest.createFunction(
  { id: "check-budget-alert", name: "Check Budget Alert" },
  { cron: "0 */6 * * *" },
  async ({ step }) => {
    const budgets = await step.run("fetch-budget", async () => {

      return await db.budget.findMany({
        include: {
          user: {
            include: {
              accounts: {
                where: {
                  isDefault: true,
                }
              }
            }
          }
        }
      })
    })

    for (const budget of budgets) {
      // const defaultAccount = budget.user.accounts[0]
      // if (!defaultAccount) continue; // skip if no default account




      await step.run(`check-budget-${budget.id}`, async () => {

        const currentDate = new Date();

        const startOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        )
        const endOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        )

        const expenses = await db.transaction.aggregate({
          where: {
            userId: budget.userId,
            // accountId: defaultAccount.id,
            type: "EXPENSE",
            date: {
              gte: startOfMonth,
              lte: endOfMonth
            },
          },
          _sum: {
            amount: true,
          }
        })

        const totalExpenses = expenses._sum.amount?.toNumber() || 0;
        const budgetAmount = typeof budget.amount === "number" ? budget.amount : Number(budget.amount) || 0;
        const percentageUsed = (totalExpenses / budgetAmount) * 100



        if (percentageUsed >= 80 && (!budget.lastAlertSent || isNewMonth(new Date(budget.lastAlertSent), new Date()))) {

          //send Email
          await sendEmail({
            to: budget.user.email,
            subject: `Budget Alert from ExpensifyX`,
            react: EmailTemplate({
              userName: budget.user.name ?? undefined,
              type: "budget-alert",
              data: {
                percentageUsed: percentageUsed,
                budgetAmount: budgetAmount,
                totalExpenses: totalExpenses,

              }
            }) 
          })


          //upadet Last Alert
          await db.budget.update({
            where: { id: budget.id },
            data: { lastAlertSent: new Date() }
          })
        }
      })
    }

  },
);


function isNewMonth(lastAlertDate, currentDate) {
  return (
    lastAlertDate.getMonth() !== currentDate.getMonth() ||
    lastAlertDate.getFullYear() !== currentDate.getFullYear()
  );
}


export const sendWelcomeEmail = inngest.createFunction(
  { id: "send-welcome-email" },
  { event: "user/signed-up" },
  async ({ event, step }) => {
    // delay 1 min

    await step.run("send-welcome-email", async () => {
      await sendEmail({
        to: event.data.email,
        subject: "Welcome to ExpensifyX 🎉",
        react: WelcomeTemplate({ name: event.data.name }),
      });
    });
  }
);


export const triggerRecurringTransaction = inngest.createFunction({
  id: "trigger-recurring-transaction",
  name: "Trigger Recurring Transactions",
},
  { cron: "0 0 * * *" },
  async ({ step }) => {
    //1. Fetch all due recurring transactions

    const recurringTransactions = await step.run(
      "fetch-recurring-transaction",
      async () => {
        return await db.transaction.findMany({
          where: {
            isRecurring: true,
            status: "COMPLETED",
            OR: [
              { lastProccessed: null }, // New processed
              { nextRecurringDate: { lte: new Date() } },  //due date passed
            ]
          }
        })
      }
    )

    //2. Create events for each transaction

    if (recurringTransactions.length > 0) {
      const events = recurringTransactions.map((transaction) => ({
        name: "transaction.recurring.process",
        data: { transactionId: transaction.id, userId: transaction.userId }
      }))


      //3. send events to be processed
      await inngest.send(events);

    }
    return { triggered: recurringTransactions.length }

  }
);

export const processRecurringTransaction = inngest.createFunction({
  id: "process-recurring-transaction",
  throttle: {
    limit: 10, // Only process 10 transactions
    period: "1m", // per minute
    key: "event.data.userId", // per user
  },
},
  { event: "transaction.recurring.process" },

  async ({ event, step }) => {
    // validate event data
    if (!event?.data?.transactionId || !event?.data?.userId) {
      console.error("Invalid event data:", event);
      return { error: "Missing required event data" }
    }

    await step.run("process-transaction", async () => {
      const transaction = await db.transaction.findUnique({
        where: {
          id: event.data.transactionId,
          userId: event.data.userId,
        },
        include: {
          account: true,
          user: true,
        },
      })



      if (!transaction || !isTransactionDue(transaction)) return

      const newNextRecurringDate = transaction.recurringInterval
        ? calculateNextRecurringDate(
          new Date(),
          transaction.recurringInterval
        )
        : null;


      await db.$transaction(async (tx) => {
        await tx.transaction.create({
          data: {
            type: transaction.type,
            amount: transaction.amount,
            description: ` ${transaction.description} (Recurring)`,
            date: new Date(),
            category: transaction.category,
            userId: transaction.userId,
            accountId: transaction.accountId,
            isRecurring: false,
          }
        })

        const balanceChange =
          transaction.type === "EXPENSE"
            ? -transaction.amount.toNumber()
            : transaction.amount.toNumber()

        await tx.account.update({
          where: { id: transaction.accountId },
          data: { balance: { increment: balanceChange } }
        })

        //update last processed date and next recurring date

        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            lastProccessed: new Date(),
            nextRecurringDate: newNextRecurringDate
          }
        })

      })

      await sendEmail({
        to: transaction.user.email,
        subject: "Recurring Transaction Processed",
        react: EmailForRecurring({
          transaction: {
            ...transaction,
            nextRecurringDate: newNextRecurringDate,
            amount: transaction.amount.toNumber(),
            account: {
              ...transaction.account,
              balance: transaction.account.balance.toNumber(),
            },
          }
        })
      })


    })
  }
)


function isTransactionDue(transaction) {
  // If no lastProccessed date, the transaction is new and due.
  if (!transaction.lastProccessed) return true;

  if (!transaction.nextRecurringDate) return false;

  const today = new Date();
  const nextDue = new Date(transaction.nextRecurringDate);

  return nextDue <= today;
}




function calculateNextRecurringDate(startDate,interval){
    const date = new Date(startDate);

    switch (interval) {
        case "DAILY":
            date.setDate(date.getDate() + 1);
            break;
        case "WEEKLY":
            date.setDate(date.getDate() + 7);
            break;
        case "MONTHLY":
            date.setMonth(date.getMonth() + 1);
            break;
        case "YEARLY":
            date.setFullYear(date.getFullYear() + 1);
            break;
    }

    return date;
}



export const generateMonthlyReports = inngest.createFunction({
  id: "generate-monthly-reports",
  name: "Generate Monthly Reports",

},
  { cron: "0 0 1 * *" },
  async ({ step }) => {

    const users = await step.run("fetch-users", async () => {
      return await db.user.findMany({
        include: { accounts: true }
      })
    });

    for (const user of users) {
      await step.run(`generate-report-${user.id}`, async () => {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1)

        const stats = await getMonthlyStats(user.id, lastMonth);
        const monthName = lastMonth.toLocaleDateString("default", {
          month: "long"
        })

        const insights = await generateFinancialInsights(stats, monthName)

        await sendEmail({
          to: user.email,
          subject: `Your Monthly Financial Report - ${monthName} `,
          react: EmailTemplate({
            userName: user.name ?? undefined,
            type: "monthly-report",
            data: {
              stats,
              month: monthName,
              insights,

            }
          }) 
        })

      })
    }
    return { processed: users.length }
  }
);


async function generateFinancialInsights(stats, month) {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }

  const genAi = new GoogleGenerativeAI(geminiApiKey)

  const model = genAi.getGenerativeModel({ model: "gemini-2.5-pro" });

  const prompt = `
    Analyze this financial summary and give 3 short, helpful tips.

    Look at how the money was earned and spent. Suggest practical ways to save or manage money better.

    Be friendly and use simple, everyday language.

    Here’s the data for ${month}:
    - Total Income: ₹${stats.totalIncome}
    - Total Expenses: ₹${stats.totalExpenses}
    - Net Income: ₹${stats.totalIncome - stats.totalExpenses}
    - Expenses by Category: ${Object.entries(stats.byCategory)
          .map(([category, amount]) => `${category}: ₹${amount}`)
          .join(", ")}

    Please reply as a JSON array of 3 tips. Example:
    ["tip 1", "tip 2", "tip 3"]
  `


  try {
    const result = await model.generateContent(prompt)

    const response = await result.response
    const text = response.text();

    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim()

    return JSON.parse(cleanedText)
  } catch (error) {

    console.error("Error generating insights:", error)
    return [
      "Your highest expense category this month might need attention.",
      "Consider setting up a budget for better financial management.",
      "Track your recurring expenses to identify potential savings.",
    ]

  }

}



const getMonthlyStats = async (userId, month) => {
  const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
  const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      }
    }
  })

  return transactions.reduce(
    (stats , t) => {
      const amount = t.amount.toNumber();
      if (t.type === "EXPENSE") {
        stats.totalExpenses += amount;
        stats.byCategory[t.category] =
          (stats.byCategory[t.category] || 0) + amount;
      } else {
        stats.totalIncome += amount;
      }

      return stats;
    },
    {
      totalExpenses: 0,
      totalIncome: 0,
      byCategory: {},
      transactionCount: transactions.length,
    } 
  );

}

