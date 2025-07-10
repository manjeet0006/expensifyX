"use client"
import { createTransaction, updateTransaction } from '@/actions/transaction'
import formatINR from '@/app/lib/currency'
import { transactionSchema } from '@/app/lib/schema'
import CreateAccountDrawer from '@/components/create-account-drawer'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import useFetch from '@/hooks/use-fetch'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'

import { CalendarIcon, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import ReciptScanner from './recipt-scanner'
import { toast } from 'sonner'

const AddTransactionForm = ({
  accounts,
  category,
  editMode = false,
  initialData = null,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const editId = searchParams.get("edit")

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    reset,
    // getValues
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues:
      editMode && initialData
        ? {
          type: initialData.type,
          amount: initialData.amount.toString(),
          description: initialData.description,
          accountId: initialData.accountId,
          category: initialData.category,
          date: new Date(initialData.date),
          isRecurring: initialData.isRecurring,
          ...(initialData.recurringInterval && {
            recurringInterval: initialData.recurringInterval,
          }),
        }
        : {
          type: "EXPENSE",
          amount: "",
          description: "",
          accountId: accounts.find((ac) => ac.isDefault)?.id,
          date: new Date(),
          isRecurring: false,
        }
  })


  const { loading: createLoading, fn: createFn, data: createResult } =
    useFetch(createTransaction);
  const { loading: updateLoading, fn: updateFn, data: updateResult } =
    useFetch(updateTransaction);

  const transactionLoading = createLoading || updateLoading;
  const transactionResult = createResult || updateResult;

  const type = watch("type")
  const isRecurring = watch("isRecurring")
  const date = watch("date")
  const accountId = watch("accountId")

  const categoryValue = watch("category")

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount)
    }

    if (editMode) {
      updateFn(editId, formData); // Use the editId from props
    } else {
      createFn(formData);
    }

  }

  // useEffect(() => {
  //   if (transactionResult?.success && !transactionLoading && transactionResult.data.accountId) {
  //     toast.success(editMode ? "Transaction Updated successfully" : "Transaction Created successfully");
  //     reset();
  //     router.push(`/account/${transactionResult.data.accountId}`)
  //   }
  // }, [transactionResult, transactionLoading, editMode, reset])

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading && transactionResult.data?.accountId) {
      toast.success(editMode ? "Transaction updated successfully!" : "Transaction created successfully!")
      reset()
      router.push(`/account/${transactionResult.data.accountId}`)
    }
  }, [transactionResult, transactionLoading, editMode, reset, router]);





  const handleScanComplete = (scanData) => {
    if (scanData) {
      setValue("amount", scanData.amount.toString());
      // Use current date if scanData.date is null/invalid
      let parsedDate = new Date();
      if (scanData.date) {
        const tempDate = new Date(scanData.date);
        if (!isNaN(tempDate.getTime()) && tempDate.getFullYear() > 1990) {
          parsedDate = tempDate;
        }
      }
      setValue("date", parsedDate);

      if (scanData.description) {
        setValue("description", scanData.description);
      }

      if (scanData.category && typeof scanData.category === 'string') {
        // Normalize both for comparison
        const scannedCategory = category.find(
          (cat) => cat.name.toLowerCase().trim() === scanData.category.toLowerCase().trim()
        );
        if (scannedCategory) {
          setValue("type", scannedCategory.type);
          setTimeout(() => {
            setValue("category", scannedCategory.id);
          }, 0);
        } else {
          toast.error(`Category "${scanData.category}" not found in category list.`);
          setValue("category", "");
        }
      }
    }
  }



  const filteredCategories = useMemo(() => category.filter(
    (category) => category.type === type
  ), [category, type])

  return (
    <form className='space-y-7 ' onSubmit={handleSubmit(onSubmit)} >
      {/* AI Recipt scanner */}

      {!editMode && <ReciptScanner onScanComplete={handleScanComplete} />}

      <div className='space-y-2' >
        <label className='text-sm font-medium '>Type</label>
        <Select
          value={type} // ✅ controlled
          onValueChange={(value) => {
            setValue("type", value);
            setValue("category", "");
          }}
        // onValueChange={(value) => setValue("type", value)}
        // defaultValues={{ type }}
        >
          <SelectTrigger className="w-full cursor-pointer ">
            <SelectValue placeholder={"Select type"} />
          </SelectTrigger>
          <SelectContent className={"cursor-pointer"} >
            <SelectItem className={"cursor-pointer"} value="EXPENSE">Expense</SelectItem>
            <SelectItem className={"cursor-pointer"} value="INCOME">Income</SelectItem>
          </SelectContent>
        </Select>

        {errors.type && (
          <p className='text-sm text-red-500' >{errors.type.message}</p>
        )}
      </div>

      <div className='grid gap-6 md:grid-cols-2' >

        <div className='space-y-2 ' >
          <label htmlFor='amount' className='text-sm font-medium'>Amount</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              className="pl-7 cursor-pointer "
              {...register("amount")}
            />
          </div>


          {errors.amount && (
            <p className='text-sm text-red-500' >{errors.amount.message}</p>
          )}
        </div>

        <div className='space-y-2' >
          <label className='text-sm font-medium'>Account</label>
          <Select
            onValueChange={(value) => setValue("accountId", value)}
            value={accountId}
          // defaultValues={getValues("accountId")}
          >
            <SelectTrigger className='w-full cursor-pointer' >
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent className={"cursor-pointer"} >
              {accounts.length > 0 ?
                (
                  accounts.map((account) => (
                    <SelectItem className={"cursor-pointer"} key={account.id} value={account.id} >
                      {account.name} ({formatINR(Number(account.balance))})

                    </SelectItem>
                  ))
                ) : (<SelectItem value='none' disabled>No accounts found</SelectItem>)
              }
              <CreateAccountDrawer asChild>
                <Button
                  variant={'ghost'}
                  className='w-full select-none items-center text-sm cursor-pointer outline-none'
                >
                  Create Account
                </Button>
              </CreateAccountDrawer>

            </SelectContent>
          </Select>

          {errors.accountId && (
            <p className='text-sm text-red-500' >{errors.accountId.message}</p>
          )}
        </div>

      </div>

      <div className='space-y-2' >
        <label htmlFor='category' className='text-sm font-medium'>Category</label>
        <Select
          onValueChange={(value) => setValue("category", value)}
          value={categoryValue}
        // defaultValues={getValues("category")}
        >
          <SelectTrigger className='w-full cursor-pointer' >
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className={"cursor-pointer"} >
            {filteredCategories.map((category) => (
              <SelectItem className={"cursor-pointer"} key={category.id} value={category.id} >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.category && (
          <p className='text-sm text-red-500' >{errors.category.message}</p>
        )}
      </div>

      <div className='space-y-2' >
        <label htmlFor='date' className='text-sm font-medium'>Date</label>
        <Popover>
          <PopoverTrigger asChild >
            <Button id='date' variant={'outline'}
              className=' w-full  pl-3 text-left cursor-pointer font-normal '
            >
              {date ? format(date, "PPP") : <span>Pick a date</span>}
              <CalendarIcon className='w-4 h-4 ml-auto opacity-50 ' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0 ' align='start' >
            <Calendar
              mode='single'
              selected={date}
              onSelect={(date) => setValue("date", date)}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />

          </PopoverContent>
        </Popover>
        {errors.date && (
          <p className='text-sm text-red-500' >{errors.date.message}</p>
        )}
      </div>



      <div>
        <label htmlFor='description' className='text-sm font-medium ' >Description</label>
        <Input className={"cursor-pointer"} id='description' placeholder='Enter description' {...register("description")} />
        {errors.description && (
          <p className='text-sm text-red-500  '>{errors.description.message}</p>
        )}
      </div>

      <div className='flex items-center justify-between rounded-lg border p-3 '>
        <div className=' space-y-0.5 ' >
          <label htmlFor='recurring' className='text-sm font-medium cursor-pointer ' >
            Recurring Transaction
          </label>
          <p className='text-sm text-muted-foreground ' >Set up a recurring schedule for this transaction</p>
        </div>
        <Switch id='recurring'
          className={"cursor-pointer"}
          checked={isRecurring}
          onCheckedChange={(checked) => setValue("isRecurring", checked)}
        />

      </div>
      {isRecurring && (
        <div className='space-y-2' >
          <label className='text-sm font-medium'>Recurring Interval</label>
          <Select
            onValueChange={(value) =>
              setValue(
                "recurringInterval", value
              )
            }
            // onValueChange={(value) => setValue("recurringInterval", value)}
            // defaultValues={getValues("recurringInterval")}
            value={watch("recurringInterval") || ""}
          >
            <SelectTrigger className='w-full cursor-pointer ' >
              <SelectValue placeholder="Select Interval" />
            </SelectTrigger>
            <SelectContent className={"cursor-pointer"} >
              <SelectItem className={"cursor-pointer"} value='DAILY' >Daily</SelectItem>
              <SelectItem className={"cursor-pointer"} value='WEEKLY' >Weekly</SelectItem>
              <SelectItem className={"cursor-pointer"} value='MONTHLY' >Monthly</SelectItem>
              <SelectItem className={"cursor-pointer"} value='YEARLY' >Yearly</SelectItem>
            </SelectContent>
          </Select>

          {errors.recurringInterval && (
            <p className='text-sm text-red-500' >{errors.recurringInterval.message}</p>
          )}
        </div>
      )}


      <div className='gap-4 grid sm:grid-cols-2' >
        <Button
          type='button'
          variant={'outline'}
          className='flex-1 cursor-pointer '
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          disabled={transactionLoading}
          className='flex-1 cursor-pointer '
        >
          {transactionLoading ?
            <>
              <Loader2 className='w-4 h-4 mr-2 animate-spin' />
              {editMode ? "Updating..." : "Creating..."}
            </>
            : editMode ?
              (
                "Update Transaction"
              ) : (
                "Create Transaction"
              )}
        </Button>
      </div>
    </form>



  )
}

export default AddTransactionForm