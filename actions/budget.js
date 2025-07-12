"use server"

import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "./helper";

export async function getCurrentBudget() {
    try {
        const user = await getCurrentUser();


        const budget = await db.budget.findFirst({
            where: {
                userId: user.id,
            }
        })

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
                userId: user.id,
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

        return {
            budget: budget ? { ...budget, amount: budget.amount.toNumber() } : null,
            currentExpenses: expenses._sum.amount
                ? expenses._sum.amount.toNumber()
                : 0,

        }

    } catch (error) {
        console.error("Error fetching budgest", error)
        throw error
    }

}


export async function updateBudget(amount) {
    try {
        const user = await getCurrentUser();


        const budgest = await db.budget.upsert({
            where: {
                userId: user.id
            },
            update: {
                amount,
            },
            create: {
                userId: user.id,
                amount,
            }
        })

        revalidatePath("/dashboard")
        return {
            success: true,
            data: { ...budgest, amount: budgest.amount.toNumber() }
        }
    } catch (error) {
        console.error("Error fetching updateBudget", error)
        return {
            success: false,
            error: error.message
        }

    }


}

