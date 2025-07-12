"use client"
import { deleteUserAccount, updateDefaultAccount } from '@/actions/accounts'
import formatINR from '@/app/lib/currency'
import {  Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import useFetch from '@/hooks/use-fetch'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, Loader, TrashIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"



const AccountCard = ({ account }) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);





    const { name, type, balance, id, isDefault } = account;

    const {
        loading: updateDefaultLoading,
        fn: updateDefaultFn,
        data: updatedAccount,
        error
    } = useFetch(updateDefaultAccount);

    const {
        loading: deleteLoading,
        fn: deleteFn,
        data: deleteAccount,
        error: deleteError
    } = useFetch(deleteUserAccount);


    const handleDeleteAccount = async () => {

        if (isDefault) {
            toast.warning("You can't delete the default account");
            return;
        }

        // const confirmed = window.confirm("Are you sure you want to delete this account?");
        // if (!confirmed) return;

        await deleteFn(id);
    };

    useEffect(() => {
        if (deleteError) {
            toast.error(deleteError.message || "Failed to delete account");
        } else if (deleteAccount?.success) {
            toast.success(`The "${name}" account was deleted successfully.`);
        }
    }, [deleteError, deleteAccount, name]);


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

            <Link
                href={`/account/${id}`}
                className="absolute inset-0 z-0"
                aria-label={`Go to ${name} account`}
            />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium capitalize">
                    {name}
                </CardTitle>
                <AnimatePresence mode="wait">
                    <div className='flex gap-2' >

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
                                    className={"cursor-pointer "}
                                    checked={isDefault}
                                    onClick={handleDefaultChange}
                                    disabled={updateDefaultLoading}

                                />
                            </motion.div>
                        )}

                        {!isDefault && (



                            < AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} >
                                <AlertDialogTrigger asChild>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setIsDeleteDialogOpen(true);

                                        }}
                                        className="text-red-500 hover:text-red-700 cursor-pointer disabled:opacity-50"
                                        disabled={deleteLoading}
                                    >
                                        <TrashIcon className={`h-5 w-5 ${deleteLoading ? 'opacity-50 animate-pulse' : ''}`} />
                                    </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription >
                                            This action cannot be undone. This will permanently delete the<span className='text-xl text-red-500' >"{name}"</span>  account.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setIsDeleteDialogOpen(false);

                                        }}  >Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleDeleteAccount();
                                            setIsDeleteDialogOpen(false);

                                        }}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
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
        </Card >


    )
}

export default AccountCard