"use client"
import React, { useEffect, useState } from 'react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from './ui/drawer'
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Switch } from './ui/switch'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { accountSchema } from '@/app/lib/schema'
import useFetch from '@/hooks/use-fetch'
import { createAccount } from '@/actions/dashboard'
import { toast } from 'sonner'

const CreateAccountDrawer = ({ children }) => {

    const [open, setOpen] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset

    } = useForm({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            name: "",
            type: "CURRENT",
            balance: "",
            isDefault: false,
        }
    })

    const onSubmit = async (data) => {
        await createAccountFn(data)

    }

    const {
        data: newAccount,
        error,
        fn: createAccountFn,
        loading: createAccountLoading
    } = useFetch(createAccount)

    useEffect(() => {
        if (newAccount && !createAccountLoading) {
            toast.success("Account created successfully")
            reset()
            setOpen(false)
        }

    }, [createAccountLoading, reset, newAccount])


    useEffect(() => {
        if (error) {
            toast.error("Failed to create account")
        }
    }, [error])


    return (
        <Drawer open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
                reset();
            }
        }}>
            <DrawerTrigger asChild >{children}</DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Create New Account</DrawerTitle>
                </DrawerHeader>
                <div className='px-4 pb-4' >
                    <form className='space-y-4' onSubmit={handleSubmit(onSubmit)} >
                        <div className='space-y-4'>
                            <label htmlFor='name' className='text-sm font-medium' >Account Name</label>
                            <Input
                                id='name'
                                placeholder='e.g., Main Checking'
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className='text-sm text-red-500' > {errors.name.message} </p>
                            )}
                        </div>

                        <div className='space-y-4'>
                            <label htmlFor='type' className='text-sm font-medium' >Account Type</label>
                            <Select onValueChange={(value) => setValue("type", value)}
                                defaultValue={watch("type")}
                            >
                                <SelectTrigger id='type' className=' w-full cursor-pointer ' >
                                    <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                                <SelectContent className={"cursor-pointer"}>
                                    <SelectItem className={"cursor-pointer"} value="CURRENT">Current</SelectItem>
                                    <SelectItem className={"cursor-pointer"} value="SAVING">Saving</SelectItem>

                                </SelectContent>
                            </Select>
                            {errors.type && (
                                <p className='text-sm text-red-500' > {errors.type.message} </p>
                            )}
                        </div>
                        <div className='space-y-4'>
                            <label htmlFor='balance' className='text-sm font-medium' >Initial Balance</label>
                            <Input
                                id='balance'
                                type='number'
                                step="0.01"
                                placeholder='0.00'
                                {...register("balance")}
                            />
                            {errors.balance && (
                                <p className='text-sm text-red-500' > {errors.balance.message} </p>
                            )}
                        </div>

                        <div className='flex items-center justify-between rounded-lg border p-3 '>
                            <div className=' space-y-0.5 ' >
                                <label htmlFor='isDefault' className='text-sm font-medium cursor-pointer ' >
                                    Set as Default
                                </label>
                                <div className='text-sm text-muted-foreground ' >This account will be selected by default for transaction</div>
                            </div>
                            <Switch id='isDefault'
                                onCheckedChange={(checked) => setValue("isDefault", checked)}
                                checked={watch('isDefault')}
                                className={"cursor-pointer"}
                            />

                        </div>


                        <div className=' flex gap-4 pt-4' >
                            <DrawerClose asChild >
                                <Button type='button' variant={"outline"} className='flex-1 cursor-pointer' >Cancel</Button>
                            </DrawerClose>
                            <Button type='submit' className='flex-1 cursor-pointer'
                                disabled={createAccountLoading}
                            >
                                {createAccountLoading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />Creating...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default CreateAccountDrawer