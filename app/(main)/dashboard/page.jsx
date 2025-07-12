
import CreateAccountDrawer from '@/components/create-account-drawer'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import React  from 'react'
import AccountCard from './_components/account-card'
import { getCurrentBudget } from '@/actions/budget'
import BudgetProgress from './_components/budget-progress'
import DashboardOveriew from './_components/transaction-overview'
import { getDashboardFullData } from '@/actions/dashboard'

async function DashboardPage() {

  const { accounts, transactions } = await getDashboardFullData();



  const defaultAccount = accounts?.find((account) => account.isDefault);

  // Fetch budget data only if a default account exists. This depends on the accounts fetch.
  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget();
  }



  return (
    <div className="flex flex-col gap-8"  >
      {/* Budget Progress */}
      {defaultAccount && budgetData && (
        <BudgetProgress
          initialBudget={budgetData?.budget}
          currentExpenses={budgetData?.currentExpenses || 0}
        />
      )}




      {/* Overiew */}

        <DashboardOveriew
          accounts={accounts}
          transactions={transactions || []}
        />




      {/* Account Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CreateAccountDrawer>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
            <CardContent className="flex h-full flex-col items-center justify-center text-muted-foreground">
              <Plus className="mb-2 h-10 w-10" />
              <p className="text-sm font-medium">Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>
        {accounts.length > 0 &&
          accounts.map((account) => {
            return <AccountCard key={account.id} account={account} />
          })
        }
      </div>

    </div>


  )
}

export default DashboardPage