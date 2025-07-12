
import { getDashboardFullData } from '@/actions/dashboard'
import { defaultCategories } from '@/data/catogories'
import React, { Suspense } from 'react'
import AddTransactionForm from '../_components/transaction-form'

import { getTransaction } from '@/actions/transaction'
import { BarLoader } from 'react-spinners'

const AddTransactionPage = async ({ searchParams }) => {
  const params = await searchParams;

  const editId = params?.edit

  // Fetch accounts and existing transaction data in parallel
  const [accountData, initialData] = await Promise.all([
    getDashboardFullData(),
    editId ? getTransaction(editId) : Promise.resolve(null)
  ]);

  const { accounts } = accountData;




  return (
    <div className='max-w-3xl mx-auto px-5' >
      <h1 className='text-5xl font-extrabold gradient-text mb-8 '>
        {editId ? "Edit Transaction" : "Add Transaction"}
      </h1>
      <Suspense fallback={<BarLoader className='mt-4 ' width={"100%"} color='#9333ea' />} >

        <AddTransactionForm
          accounts={accounts || []}
          category={defaultCategories}
          editMode={!!editId}
          initialData={initialData}
        />
      </Suspense>
    </div>
  )
}

export default AddTransactionPage