"use client"

import formatINR from '@/app/lib/currency';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { endOfDay, format, startOfDay, subDays } from 'date-fns';
import React, { useMemo, useState } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';



const DATE_RANGES= {
    "7D": { label: "Last 7 Days", days: 7 },
    "1M": { label: "Last Months", days: 30 },
    "3M": { label: "Last 3 Months", days: 90 },
    "6M": { label: "Last 6 Months", days: 180 },
    ALL: { label: "All Time", days: null },
}

const AccountChart = ({transactions}) => {

    const [dateRange, setDateRange] = useState("7D");

    const filterData = useMemo(() => {
        const range = DATE_RANGES[dateRange];

        const now = new Date()

        const startDate = range.days
            ? startOfDay(subDays(now, range.days))
            : startOfDay(new Date(0))


        // Filter transaction within the date ranges
        const filtered = transactions.filter(
            (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
        );

        const group = filtered.reduce((acc, transaction) => {
            const date = format(new Date(transaction.date), "MMM dd");

            if (!acc[date]) {
                acc[date] = { date, income: 0, expense: 0 };
            }

            if (transaction.type === "INCOME") {
                acc[date].income += transaction.amount;
            } else if (transaction.type === "EXPENSE") {
                acc[date].expense += transaction.amount;
            }

            return acc;
        }, {});

        return Object.values(group).sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
    }, [transactions, dateRange])


    const totals = useMemo(() => {
        return filterData.reduce(
            (acc, day) => ({
                income: acc.income + day.income,
                expense: acc.expense + day.expense,
            }),
            { income: 0, expense: 0 }
        )
    }, [filterData])


    return (
        <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-7' >
                <CardTitle className='text-base font-normal' >Transaction Overwise</CardTitle>
                <Select defaultValue={dateRange} onValueChange={(value) => setDateRange(value)} >
                    <SelectTrigger className="w-[140px] cursor-pointer ">
                        <SelectValue placeholder="Select Range" />
                    </SelectTrigger>
                        <SelectContent className={"cursor-pointer"} >
                            {Object.entries(DATE_RANGES).map(([key, { label }]) => (
                                <SelectItem className={"cursor-pointer"} key={key} value={key}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                </Select>

            </CardHeader>
            <CardContent>
                <div className='grid md:grid-cols-3 justify-around gap-4 mb-2 text-xs' >
                    <div className='text-center' >
                        <p className='text-muted-foreground' >Total Income</p>
                        <p className='text-lg font-bold text-green-500' > {formatINR(totals.income)} </p>
                    </div>
                    <div className='text-center' >
                        <p className='text-muted-foreground' >Total Expenses</p>
                        <p className='text-lg font-bold text-red-500' > {formatINR(totals.expense)} </p>
                    </div>
                    <div className='text-center' >
                        <p className='text-muted-foreground' >Net</p>
                        <p className={`text-lg font-bold ${totals.income - totals.expense >= 0

                            ? "text-green-500"
                            : "text-red-500"
                            }`}>
                            {formatINR(totals.income - totals.expense)}
                        </p>
                    </div>

                </div>

                <div className='h-[300px]' >


                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart

                            data={filterData}
                            margin={{
                                top: 10,
                                right: 10,
                                left: 10,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" />
                            <YAxis
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${formatINR(value)}`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px' }}
                                labelFormatter={(label) => `Date: ${label}`}
                                formatter={(value, name) => [`${formatINR(value)}`, name]}
                                cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                                itemStyle={{ color: '#000' }}
                                labelStyle={{ color: '#000', fontWeight: 'bold' }}      
                            />
                            <Legend />
                            <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export default AccountChart