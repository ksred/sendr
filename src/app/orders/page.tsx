'use client';

import AccountOverview from '@/components/account/account-overview'
import BottomNav from '@/components/navigation/bottom-nav'

export default function Orders() {
  return (
    <main className="flex flex-col min-h-screen pb-16">
      <AccountOverview />
      
      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold text-gray-900">Orders</h2>
            <p className="text-gray-500">Order history and active orders will be displayed here</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  )
}
