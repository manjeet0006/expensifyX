"use client"
import { updateBudget } from '@/actions/budget';
import formatINR from '@/app/lib/currency';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import useFetch from '@/hooks/use-fetch';
import { Check, Pencil, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

const BudgetProgress = ({ initialBudget, currentExpenses }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [newBudget, setNewBudget] = useState(
        initialBudget?.amount?.toString() || ""
    )

    const percentUsed = initialBudget
        ? (currentExpenses / initialBudget.amount) * 100
        : 0;


    const {
        loading: isLoading,
        fn: updateBudgetFn,
        data: updateBudgetData,
        error

    } = useFetch(updateBudget)


    const handleCancel = () => {
        setNewBudget(initialBudget?.amount?.toString() || "")
        setIsEditing(false)
    }

    const handleUpdateBudget = async () => {
        const amount = parseFloat(newBudget)
        if (isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid amount")
            return;
        }
        await updateBudgetFn(amount)

    }

    useEffect(() => {
        if (updateBudgetData?.success) {
            setIsEditing(false)
            toast.success("Budget updated successfully")
        }
    }, [updateBudgetData])

    useEffect(() => {
        if (error) {
            toast.error("Failed to update budget")
        }
    }, [error])




    return (
        <Card>
            <CardHeader className='flex flex-row' >
                <div>
                    <CardTitle>Monthly Budget  </CardTitle>

                    <div className='flex items-center gap-2 mt-2 ' >

                        {isEditing
                            ? <div className='flex items-center gap-2 ' >
                                <Input
                                    type='number'
                                    value={newBudget}
                                    className='w-32'
                                    placeholder='Enter amount'
                                    autoFocus
                                    onChange={(e) => setNewBudget(e.target.value)}
                                    disabled={isLoading}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleUpdateBudget();
                                        }
                                    }}
                                />
                                <Button variant="ghost" size={"icon"}
                                    onClick={handleUpdateBudget}
                                    disabled={isLoading}
                                >
                                    <Check className='h-4 w-4 text-green-500' />
                                </Button>
                                <Button variant="ghost" size={"icon"}
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                >
                                    <X className='h-4 w-4 text-red-500' />
                                </Button>
                            </div>
                            : <>
                                <CardDescription>
                                    {initialBudget
                                        ? `${formatINR(currentExpenses)} of ${formatINR(initialBudget.amount)} spent`
                                        : "No budget set"
                                    }
                                </CardDescription>
                                <Button
                                    variant={"ghost"}
                                    size="icon"
                                    onClick={() => setIsEditing(true)}
                                    className='h-6 w-6 cursor-pointer'
                                >
                                    <Pencil className='h-3 w-3 ' />

                                </Button>
                            </>
                        }
                    </div>
                </div>

            </CardHeader>
            <CardContent>
                {initialBudget &&
                    <div className='space-y-0' >
                        <Progress value={percentUsed}
                            extraStyles={
                                `${percentUsed >= 90
                                    ? "bg-red-500"
                                    : percentUsed >= 75
                                        ? "bg-yellow-500"
                                        : "bg-green-500"
                                }`
                            }
                        />
                        <p className='text-xs text-muted-foreground text-right ' >
                            {percentUsed.toFixed(1)}% used
                        </p>
                    </div>
                }
            </CardContent>
        </Card>
    )
}

export default BudgetProgress