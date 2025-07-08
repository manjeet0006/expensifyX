"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";

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



export async function updateDefaultAccount(accountId) {



    try {
        const { userId } = await auth()
        if (!userId) throw new Error("Unauthorized")


        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })


        if (!user) {
            throw new Error("User not Found")
        }


        const data = await db.account.updateMany({
            where: { userId: user.id, isDefault: true },
            data: { isDefault: false }
        })

        const account = await db.account.update({
            where: {
                id: accountId,
                userId: user.id
            },
            data: {
                isDefault: true
            }
        })

        revalidatePath("/dashboard");
        return { success: true, data: serializeTransaction(account) }

    } catch (error) {
        return { success: false, error: error.message }

    }

}



export async function getAccountWithTransactions(accountId) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")


    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        }
    })


    if (!user) {
        throw new Error("User not Found")
    }

    const account = await db.account.findUnique({
        where: { id: accountId, userId: user.id },
        include: {
            transactions: {
                orderBy: { date: "desc" }
            },
            _count: {
                select: { transactions: true }
            }
        },
    })

    if (!account) return null;
    return {
        ...serializeTransaction(account),
        transactions: account.transactions.map(serializeTransaction)
    }


}




export async function bulkDeleteTransactions(transactionIds) {

    try {
        const { userId } = await auth()
        if (!userId) throw new Error("Unauthorized")

        const user = await db.user.findUnique({
            where: { clerkUserId: userId }
        })

        if (!user) throw new Error("User not Found")

        const transactions = await db.transaction.findMany({
            where: {
                id: { in: transactionIds },
                userId: user.id
            }
        })


        const accountbalanceChanges = transactions.reduce((acc, transaction) => {
            const amount = transaction.amount.toNumber();
            // // If the transaction is an EXPANSE, we subtract the amount from the account balance
            // // If it's INCOME, we add the amount to the account balance
            // // This is because EXPANSE reduces the balance, while INCOME increases it
            // // Adjust the sign based on the transaction type
            // // Assuming transaction.type is either "EXPANSE" or "INCOME"
            if (!transaction.type || (transaction.type !== "EXPENSE" && transaction.type !== "INCOME")) {
                throw new Error("Invalid transaction type");
            }
            const change =
                transaction.type === "EXPENSE"
                    ? amount
                    : -amount;

            acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
            return acc;
        }, {})

        // Delete the transaction and update account balance in a transaction
        await db.$transaction(async (tx) => {
            //Delete transaction
            await tx.transaction.deleteMany({
                where: {
                    id: { in: transactionIds },
                    userId: user.id
                }
            })

            for (const [accountId, balanceChange] of Object.entries(
                accountbalanceChanges
            )) {
                await tx.account.update({
                    where: { id: accountId },
                    data: {
                        balance: {
                            increment: balanceChange
                        }
                    }
                })
            }
        })
        revalidatePath("/dashboard")
        for (const accountId of Object.keys(accountbalanceChanges)) {
            revalidatePath(`/account/${accountId}`, "page");
        }

        return { success: true }
    } catch (error) {
        return { success: false, error: error.message }

    }

}


export async function deleteUserAccount(accountId) {

    try {
        const { userId } = await auth()
        if (!userId) throw new Error("Unauthorized")

        const user = await db.user.findUnique({
            where: { clerkUserId: userId }
        })

        if (!user) throw new Error("User not Found")


        const deleted = await db.account.deleteMany({
            where: {
                id: accountId,
                userId: user.id,
            }
        })

        if (deleted.count === 0) {
            throw new Error("Account not found or unauthorized")
        }

        revalidatePath("/dashboard")
        return { success: true }


    } catch (error) {
        console.error("Delete account error:", error)
        throw new Error(error.message || "Failed to delete account")

    }

}