import { getAccountWithTransactions } from '@/actions/accounts';
import formatINR from '@/app/lib/currency';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'
import TransactionTable from '../_components/transaction-table';
import { BarLoader } from 'react-spinners';
import AccountChart from '../_components/account-chart';

const AccountPage = async ({ params }) => {
  const { id } = await params
  const accountData = await getAccountWithTransactions(id)

  if (!accountData) {
    notFound();
  }

  const { transactions, ...account } = accountData

  return (
    <>
      <div className='space-y-8 ' >
        <div className='flex  gap-4  justify-between items-end'>
          <div>
            <h1 className='text-3xl sm:text-6xl font-bold gradient-text capitalize' >{account.name} </h1>
            <p className='text-muted-foreground' >{account.type.charAt(0) + account.type.slice(1).toLowerCase()} </p>
          </div>
          <div className='text-right pb-2'>
            <div className={`text-xl sm:text-2xl font-bold ${account.balance < 0 ? "text-red-500" : ""} `}>
              {formatINR(account.balance)}
            </div>
            <p className='text-sm text-muted-foreground ' >{account._count.transactions} Transaction </p>
          </div>
        </div>
        {/* Chart Section */}

        <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color='#9333ea' />} >
          <AccountChart transactions={transactions} />
        </Suspense>



        {/* Transaction Tavle */}

        <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color='#9333ea' />} >
          <TransactionTable accountData={accountData} transactions={transactions} />

        </Suspense>
      </div>




    </>
  )
}

export default AccountPage