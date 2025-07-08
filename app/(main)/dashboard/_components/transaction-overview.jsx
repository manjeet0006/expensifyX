"use client"
import formatINR from '@/app/lib/currency';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import React, { useState } from 'react'
import { Legend, Pie, Cell, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = [
  "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
  "#FF9F40", "#00C49F", "#FF6B6B", "#845EC2", "#FFC75F",
  "#0081CF", "#C34A36"
];

const DashboardOveriew = ({ accounts, transactions }) => {

    const [selectedAccountId, setSelectedAccountId] = useState(
        accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
    );

    //filer transactions based on selected account
    const accountTransactions = transactions.filter(
        (t) => t.accountId === selectedAccountId
    );

    const recentTransactions = accountTransactions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);


    const currentDate = new Date();
    const currentMonthExpenses = accountTransactions.filter((t) => {
        const transactionDate = new Date(t.date);
        return (
            t.type === "EXPENSE" &&
            transactionDate.getMonth() === currentDate.getMonth() &&
            transactionDate.getFullYear() === currentDate.getFullYear()
        );
    });


    const expensesByCategory = currentMonthExpenses.reduce((acc, transaction) => {
        const category = transaction.category;
        if (!acc[category]) {
            acc[category] = 0;
        }

        acc[category] += transaction.amount;

        return acc;
    }, {});

    const pieChartData = Object.entries(expensesByCategory).map(
        ([category, value]) => ({
            name: category,
            value,
        })
    );

    const threshold = 0.05;
    const total = pieChartData.reduce((sum, d) => sum + d.value, 0);

    const groupedData = [
        ...pieChartData.filter((d) => d.value / total >= threshold),
        {
            name: "Other",
            value: pieChartData
                .filter((d) => d.value / total < threshold)
                .reduce((sum, d) => sum + d.value, 0),
        },
    ].filter((d) => d.value > 0); // filter zero-values


    return (
        <div className="grid gap-4 md:grid-cols-2">
            {/* Recent Transactions Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-base font-normal">
                        Recent Transactions
                    </CardTitle>
                    <Select
                        value={selectedAccountId}
                        onValueChange={setSelectedAccountId}
                    >
                        <SelectTrigger className="w-[150px] cursor-pointer ">
                            <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent className={"cursor-pointer"} >
                            {accounts.map((account) => (
                                <SelectItem className={"cursor-pointer"} key={account.id} value={account.id}>
                                    {account.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent>
                    <div className="space-y-5">
                        {recentTransactions.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">
                                No recent transactions
                            </p>
                        ) : (
                            recentTransactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="flex items-center justify-between"
                                >
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {transaction.description || "Untitled Transaction"}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(transaction.date), "PP")}
                                        </p>
                                    </div>
                                    <div
                                        className={cn(
                                            "flex items-center",
                                            transaction.type === "EXPENSE"
                                                ? "text-red-500"
                                                : "text-green-500"
                                        )}
                                    >
                                        {transaction.type === "EXPENSE" ? (
                                            <ArrowDownRight className="mr-1 h-4 w-4" />
                                        ) : (
                                            <ArrowUpRight className="mr-1 h-4 w-4" />
                                        )}
                                        {formatINR(transaction.amount)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Pie Chart Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-normal">
                        Monthly Expense Breakdown
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 pb-5">
                    {pieChartData.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                            No expenses this month
                        </p>
                    ) : (
                        <div className="h-[300px] ">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={groupedData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        dataKey="value"
                                        labelLine={false}
                                        label={({ name, percent }) => // Fixed percentage calculation
                                            `${name} (${((percent || 0) * 100).toFixed(0)}%)`
                                        }
                                    >
                                        {groupedData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) => formatINR(value)}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default DashboardOveriew