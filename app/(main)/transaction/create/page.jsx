
import { getUserAccounts } from '@/actions/dashboard'
import { defaultCategories } from '@/data/catogories'
import React, { Suspense } from 'react'
import AddTransactionForm from '../_components/transaction-form'

import { getTransaction } from '@/actions/transaction'
import { BarLoader } from 'react-spinners'

const AddTransactionPage = async ({ searchParams }) => {
  const params = await searchParams;

  const accounts = await getUserAccounts()


  const editId = params?.edit

  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId)
    initialData = transaction
  }


  return (
    <div className='max-w-3xl mx-auto px-5' >
      <h1 className='text-5xl font-extrabold gradient-text mb-8 '>
        {editId ? "Edit Transaction" : "Add Transaction"}
      </h1>
      <Suspense fallback={<BarLoader className='mt-4 ' width={"100%"} color='#9333ea' />} >

        <AddTransactionForm
          accounts={accounts}
          category={defaultCategories}
          editMode={!!editId}
          initialData={initialData}
        />
      </Suspense>
    </div>
  )
}

export default AddTransactionPage