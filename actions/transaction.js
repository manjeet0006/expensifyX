"use server"
import aj from "@/lib/arcjet";
import { db } from "@/lib/prisma";
import { request } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./helper";


const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)


function serializeAmount(obj) {
  return {
    ...obj,
    ...(obj.balance && { balance: Number(obj.balance) }),
    ...(obj.amount && { amount: Number(obj.amount) }),
  };
}


export async function createTransaction(data) {
    try {
        const user = await getCurrentUser();

        //Arcjet to add rate limiting

        // Get request data for arcjet
        const req = await request();
        //check rate limit
        const decision = await aj.protect(req, {
            userId: user.clerkUserId,
            requested: 1, //specify how many token to consume
        })

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                const { reset } = decision.reason
                console.error({
                    code: "RATE_LIMIT_EXCEEDED",
                    details: {
                        resetInSecond: reset,
                    },
                })
                throw new Error("To many requests. Please Try again Later.")
            }
            throw new Error("Request Block")

        }

        const account = await db.account.findUnique({
            where: {
                id: data.accountId,
                userId: user.id
            }
        })

        if (!account) {
            throw new Error("Account not found")
        }


        const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;

        const newBalance = account.balance.toNumber() + balanceChange


        const transaction = await db.$transaction(async (tx) => {
            const newTransaction = await tx.transaction.create({
                data: {
                    ...data,
                    userId: user.id,
                    nextRecurringDate: data.isRecurring && data.recurringInterval ? calculateNextRecurringDate(data.date, data.recurringInterval) : null,
                }
            })

            await tx.account.update({
                where: { id: data.accountId },
                data: { balance: newBalance },
            })

            return newTransaction;

        })

        revalidatePath("/dashboard")
        revalidatePath(`/account/${transaction.accountId}`)

        return { success: true, data: serializeAmount(transaction) }

    } catch (error) {
        throw new Error(error.message )
    }
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


export async function scanReceipt(file) {

    try {
        const model = genAi.getGenerativeModel({ model: "gemini-2.5-pro" });

        //convert file to arrayBuffer => give file content in binary form
        const arrayBuffer = await file.arrayBuffer();

        //convert arrayBuffer to base64
        const base64String = Buffer.from(arrayBuffer).toString('base64');

        const prompt = `Analyze this receipt image and extract the following information in JSON format:
            - Total amount (just the number)
            - Date (in ISO format)
            - Description: A short summary of the items or service (keep it brief — 10 to 20 words max)
            - Merchant/store name
            - Type — either "INCOME" or "EXPENSE", based on the category
            - Suggested category (one of: salary, freelance, investments, business, rental, other-income, housing, transportation, groceries, utilities, entertainment, food, shopping, healthcare, education, personal, travel, insurance, gifts, bills, other-expense)

            The "type" should be:
            - "INCOME" if the category is one of: salary, freelance, investments, business, rental, other-income
            - "EXPENSE" if the category is one of: housing, transportation, groceries, utilities, entertainment, food, shopping, healthcare, education, personal, travel, insurance, gifts, bills, other-expense

            Only respond with valid JSON in this exact format:

            {
            "amount": number,
            "date": "ISO date string",
            description": "string (max 20 words)",
            "merchantName": "string",
            "category": "string",
            "type": "INCOME" | "EXPENSE"
            }

            If it's not a receipt, return an empty object: {}
            `

        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64String,
                    mimeType: file.type,
                }
            },
            prompt
        ])

        const response = await result.response
        const text = response.text();

        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim()


        try {
            const data = JSON.parse(cleanedText)

            // Handle cases where Gemini returns an empty object or not a receipt
            if (!data || Object.keys(data).length === 0 || !data.amount) {
                throw new Error("Could not extract valid receipt data from the image.");
            }



            return {
                amount: parseFloat(data.amount),
                // date: data.date || null,
                date: new Date(data.date),
                description: data.description,
                category: data.category,
                merchantName: data.merchantName,
                type: data.type
            }

        } catch (parseError) {
            console.error("Error parsing JSON response: ", parseError)
            throw new Error("invalid response format from Gemini")
        }



    } catch (error) {
        console.error("Error scanning receipt: ", error.message)
        throw new Error("Failed to scan the receipt" );
    }


}


export async function getTransaction(id) {

    const user = await getCurrentUser();


    if (!user) {
        throw new Error("User not Found")
    }


    const transaction = await db.transaction.findUnique({
        where: {
            id,
            userId: user.id
        }
    })

    if (!transaction) throw new Error("Transaction not found");

    return serializeAmount(transaction);

}


export async function updateTransaction(id, data) {
    try {
        const user = await getCurrentUser();


        if (!user) {
            throw new Error("User not Found")
        }

        //Get original transaction to calculate balance change
        const originalTransaction = await db.transaction.findUnique({
            where: {
                id,
                userId: user.id,
            },
            include: {
                account: true
            },
        });

        if (!originalTransaction) throw new Error("Transaction not found");

        //calculate balance change
        const oldBalanceChange =
            originalTransaction.type === "EXPENSE"
                ? -originalTransaction.amount.toNumber()
                : originalTransaction.amount.toNumber()

        const newBalanceChange =
            data.type === "EXPENSE" ? -data.amount : data.amount

        const netBalanceChange = newBalanceChange - oldBalanceChange;

        //Update transaction and account balance in a transaction
        const transaction = await db.$transaction(async (tx) => {
            const updated = await tx.transaction.update({
                where: {
                    id,
                    userId: user.id
                },
                data: {
                    ...data,
                    nextRecurringDate:
                        data.isRecurring && data.recurringInterval
                            ? calculateNextRecurringDate(data.date, data.recurringInterval)
                            : null,
                }
            })

            //update Account balance
            await tx.account.update({
                where: { id: data.accountId },
                data: {
                    balance: {
                        increment: netBalanceChange,
                    }
                }
            })

            return updated
        })

        revalidatePath('/dashboard')
        revalidatePath(`/account/${data.accountId}`)

        return { success: true , data: serializeAmount(transaction)};

    } catch (error) {
        throw new Error(error.message);
    }

}
