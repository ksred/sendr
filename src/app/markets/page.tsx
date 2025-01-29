'use client';

import AccountOverview from '@/components/account/account-overview'
import BottomNav from '@/components/navigation/bottom-nav'

export default function Markets() {
  return (
    <main className="flex flex-col min-h-screen pb-16">
      <AccountOverview />
      
      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold text-gray-900">Markets</h2>
            <p className="text-gray-500">Market information will be displayed here</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  )
}
