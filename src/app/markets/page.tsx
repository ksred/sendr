'use client';

import AccountOverview from '@/components/account/account-overview'
import BottomNav from '@/components/navigation/bottom-nav'
import MarketChart from '@/components/markets/market-chart'

const MARKET_PAIRS = [
  { symbol: 'EUR/USD', currency: 'EUR' },
  { symbol: 'GBP/USD', currency: 'GBP' },
  { symbol: 'USD/JPY', currency: 'JPY' },
];

export default function Markets() {
  return (
    <main className="flex flex-col min-h-screen pb-16">
      <AccountOverview />
      
      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-6">
          {MARKET_PAIRS.map((pair) => (
            <MarketChart
              key={pair.symbol}
              symbol={pair.symbol}
              currency={pair.currency}
            />
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  )
}
