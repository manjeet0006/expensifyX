
import { getUserAccounts } from '@/actions/dashboard'
import { defaultCategories } from '@/data/catogories'
import React from 'react'
import AddTransactionForm from '../_components/transaction-form'

import { getTransaction } from '@/actions/transaction'

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
        {editId? "Edit Transaction" : "Add Transaction"}
      </h1>
      <AddTransactionForm
        accounts={accounts}
        category={defaultCategories}
        editMode = {!!editId}
        initialData = {initialData}
      />
    </div>
  )
}

export default AddTransactionPage