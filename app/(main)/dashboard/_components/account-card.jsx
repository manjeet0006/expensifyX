"use client"
import { updateDefaultAccount } from '@/actions/accounts'
import formatINR from '@/app/lib/currency'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import useFetch from '@/hooks/use-fetch'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, Loader } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { toast } from 'sonner';


const AccountCard = ({ account }) => {


    


    const { name, type, balance, id, isDefault } = account;

    const {
        loading: updateDefaultLoading,
        fn: updateDefaultFn,
        data: updatedAccount,
        error
    } = useFetch(updateDefaultAccount);

    const handleDefaultChange = async (event) => {
        // Stop the click from propagating to the parent <Link> component
        event.stopPropagation();
        event.preventDefault();

        if (isDefault) {
            toast.warning('You need at least 1 default account');
            return;
        }
        await updateDefaultFn(id);
    };

    // Effect to show toast notifications on success or error
    useEffect(() => {
        if (error) {
            toast.error(error.message || "Failed to update default account");
        } else if (updatedAccount?.success) {
            toast.success('Default account updated successfully');
        }
    }, [error, updatedAccount]);


    return (
        <Card className="hover:shadow-md transition-shadow group relative">
            <Link href={`/account/${id}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium capitalize">
                        {name}
                    </CardTitle>
                    <AnimatePresence mode="wait">
                        {updateDefaultLoading ? (
                            <motion.div
                                key="loader"
                                initial={{ opacity: 0, scale: 0.2 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.2 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Loader className="animate-spin w-5 h-5 text-muted-foreground" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="switch"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 4 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Switch
                                    checked={isDefault}
                                    onClick={handleDefaultChange}
                                    disabled={updateDefaultLoading}

                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardHeader>

                <CardContent>
                    <div className={`text-2xl font-bold ${balance < 0 ? "text-red-500" : ""}`}>
                        {formatINR(balance)}
                    </div>
                    <p className="text-xs pt-3 text-muted-foreground">
                        {type.charAt(0) + type.slice(1).toLowerCase()} Account
                    </p>
                </CardContent>

                <CardFooter className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                        <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                        Income
                    </div>
                    <div className="flex items-center">
                        <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                        Expense
                    </div>
                </CardFooter>
            </Link>
        </Card>
    )
}

export default AccountCard