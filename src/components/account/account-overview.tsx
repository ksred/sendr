'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { tradingApi } from '@/lib/api/mock-trading-api';
import { Position } from '@/types/trading';
import { formatCurrency } from '@/lib/utils/format';

export default function AccountOverview() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPositions = async () => {
      try {
        const data = await tradingApi.getPositions();
        setPositions(data);
      } catch (error) {
        console.error('Failed to load positions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPositions();
  }, []);

  return (
    <div className="bg-slate-900 text-white px-4 py-6 space-y-4">
      {/* Main Balance */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-sm text-slate-400">Available for Trading</p>
          <p className="text-2xl font-bold tracking-tight">
            {isLoading ? '...' : '$1,250,000.00'}
          </p>
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
        ) : (
          positions.map((position) => (
            <div
              key={position.currency}
              className="bg-slate-800 rounded-lg px-4 py-3 flex-shrink-0 min-w-[144px]"
            >
              <div className="flex justify-between items-start mb-1">
                <p className="text-slate-400 text-sm">{position.currency} Position</p>
                <ChevronRight size={16} className="text-slate-500" />
              </div>
              <p className="font-medium">
                {formatCurrency(position.amount, position.currency)}
              </p>
              <p className={`text-xs ${position.unrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {position.unrealizedPnL >= 0 ? '+' : ''}
                {formatCurrency(position.unrealizedPnL, 'USD')}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
