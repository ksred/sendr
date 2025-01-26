'use client';

import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { tradingApi } from '@/lib/api/mock-trading-api';
import { Trade } from '@/types/trading';

export default function ActiveOrders() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTrades = async () => {
      try {
        const data = await tradingApi.getActiveTrades();
        setTrades(data);
      } catch (error) {
        console.error('Failed to load trades:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrades();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h2 className="font-semibold">Active Orders</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="card h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="font-semibold">Active Orders</h2>
      {trades.length === 0 ? (
        <div className="card text-center py-8 text-slate-500">
          <p>No active orders</p>
        </div>
      ) : (
        <div className="space-y-3">
          {trades.map((trade) => (
            <div key={trade.id} className="card space-y-4">
              {/* Order Header */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <p className="font-medium">{trade.intent.description}</p>
                  <p className="text-sm text-slate-500">
                    {trade.execution.tranches.length} tranches • {
                      trade.execution.tranches.filter(t => t.status === 'PENDING').length
                    } remaining
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 text-sm font-medium">
                    {trade.execution.status.replace('_', ' ')}
                  </span>
                  <ChevronRight size={16} className="text-slate-400" />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${trade.execution.progress}%` }}
                />
              </div>

              {/* Tranches */}
              <div className="space-y-3">
                {trade.execution.tranches.map((tranche, index) => (
                  <div 
                    key={tranche.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-slate-600">
                      Tranche {index + 1}/{trade.execution.tranches.length}
                    </span>
                    <span>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      }).format(tranche.amount)}
                      {tranche.rate ? ` @ ${tranche.rate}` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
