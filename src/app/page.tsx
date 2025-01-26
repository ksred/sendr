import AccountOverview from '@/components/account/account-overview'
import ExecutionPanel from '@/components/execution/execution-panel'
import ActiveOrders from '@/components/orders/active-orders'
import BottomNav from '@/components/navigation/bottom-nav'

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen pb-16">
      <AccountOverview />
      
      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-6">
          <ExecutionPanel />
          <ActiveOrders />
        </div>
      </div>

      <BottomNav />
    </main>
  )
}
