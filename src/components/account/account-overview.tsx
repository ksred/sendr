'use client';

import { ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { Position } from '@/types/trading';
import { formatCurrency } from '@/lib/utils/format';
import { useAccount } from '@/contexts/account-context';

export default function AccountOverview() {
  const { positions, isLoading, error, defaultAccount, getAccountBalance, getAccountCurrency } = useAccount();
  
  // Format the account balance with the correct currency
  const formattedBalance = () => {
    const balance = getAccountBalance();
    const currency = getAccountCurrency();
    return formatCurrency(parseFloat(balance), currency);
  };

  return (
    <div className="bg-slate-900 text-white px-4 py-6 space-y-4">
      {/* Main Balance */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-sm text-slate-400">
            {defaultAccount ? `${defaultAccount.name}` : 'Available Balance'}
          </p>
          <div className="text-2xl font-bold tracking-tight">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                <span className="text-slate-400">Loading...</span>
              </div>
            ) : error ? (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle size={16} />
                <span>Error loading account</span>
              </div>
            ) : (
              formattedBalance()
            )}
          </div>
        </div>
        <button className="flex items-center gap-1 bg-slate-800 px-3 py-1.5 rounded-lg text-sm hover:bg-slate-700 transition-colors">
          <AlertCircle size={16} className="text-slate-400" />
          <span>Limits</span>
        </button>
      </div>

      {/* Position Summary */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
        {isLoading ? (
          <div className="animate-pulse flex gap-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-slate-800 rounded-lg w-36 h-20 flex-shrink-0"
              />
            ))}
          </div>
        ) : positions.length > 0 ? (
          positions.map((position) => (
            <div
              key={position.id}
              className="bg-slate-800 rounded-lg p-3 w-36 flex-shrink-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">{position.symbol}</p>
                  <p className="text-xs text-slate-400">
                    {formatCurrency(position.quantity, position.currency)}
                  </p>
                </div>
                <ChevronRight size={16} className="text-slate-400" />
              </div>
              <p
                className={`text-sm mt-2 ${
                  position.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {formatCurrency(position.pnl)}
              </p>
            </div>
          ))
        ) : (
          <div className="text-slate-400 text-sm">No open positions</div>
        )}
      </div>
    </div>
  );
}