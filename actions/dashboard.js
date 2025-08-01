"use server"
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./helper";




const serializeTransaction = (obj) => {
    const serialized = { ...obj };

    if (obj.balance) {
        serialized.balance = obj.balance.toNumber()
    }

    if (obj.amount) {
        serialized.amount = obj.amount.toNumber()
    }
    return serialized
}

export async function createAccount(data) {

    try {
        const user = await getCurrentUser();


        // Convert balance to float before saving
        const balanceFloat = parseFloat(data.balance)

        if (isNaN(balanceFloat)) {
            throw new Error("Invalid balance amount")
        }


        // 💡 Check if account name already exists for this user
        const nameExists = await db.account.findFirst({
            where: {
                userId: user.id,
                name: data.name,
            },
        });

        if (nameExists) {
            throw new Error("Account name already exists");
        }
        //check if this is the user's first account
        const existingAccounts = await db.account.findMany({
            where: {
                userId: user.id,
            }
        })

        // If it's the first account, make it default regardless of user input
        // If not, use the user's preference
        const shouldBeDefault = existingAccounts.length === 0 ? true : data.isDefault

        // If this account should be default, unset other default accounts
        if (shouldBeDefault) {
            await db.account.updateMany({
                where: { userId: user.id, isDefault: true },
                data: { isDefault: false }
            })
        }



        const account = await db.account.create({
            data: {
                ...data,
                balance: balanceFloat,
                userId: user.id,
                isDefault: shouldBeDefault
            }
        })

        const serializedAccount = serializeTransaction(account)

        revalidatePath("/dashboard")
        return { success: true, data: serializedAccount }

    } catch (error) {
        throw new Error(error.message)
    }
}


// export async function getUserAccounts() {
//    const user = await getCurrentUser();

//     const accounts = await db.account.findMany({
//         where: {
//             userId: user.id
//         },
//         orderBy: { createdAt: "desc" },
//         include: {
//             _count: {
//                 select: {
//                     transactions: true,
//                 }
//             }
//         }
//     })

//     const serializedAccount = accounts.map(serializeTransaction)

//     return serializedAccount

// }




// export async function getDashboardData() {

//     const user = await getCurrentUser();


//     const transactions = await db.transaction.findMany({
//         where: { userId: user.id },
//         orderBy: { date: "desc" },
//     });

//     return transactions.map(serializeTransaction);
// }





export async function getDashboardFullData() {
    const user = await getCurrentUser();

    const [accounts, transactions] = await Promise.all([
        db.account.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                balance: true,
                type: true,
                isDefault: true,
                _count: {
                    select: {
                        transactions: true,
                    },
                },
            },
        }),

        db.transaction.findMany({
            where: { userId: user.id },
            orderBy: { date: "desc" },
            take: 10,
            select: {
                id: true,
                amount: true,
                date: true,
                category: true,
                accountId: true,
                type: true,
            }
        })

    ]);

    return {
        accounts: accounts.map(serializeTransaction),
        transactions: transactions.map(serializeTransaction)
    }
}

