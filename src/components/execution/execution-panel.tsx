'use client';

import { useState } from 'react';
import { ArrowRightLeft, MessageSquare } from 'lucide-react';
import { tradingApi } from '@/lib/api/mock-trading-api';
import { TradeIntent } from '@/types/trading';

export default function ExecutionPanel() {
  const [showInput, setShowInput] = useState(false);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      // Mock intent creation - in reality, this would be processed by the LLM
      const intent: TradeIntent = {
        goal: 'SINGLE_EXECUTION',
        constraints: {
          amount: 500000,
          riskTolerance: 'MEDIUM',
        },
        context: {
          marketConditions: {
            volatility: 0.15,
            trend: 'NEUTRAL',
            liquidity: 0.8,
          },
          userHistory: {
            recentTrades: [],
            preferredPairs: ['EUR/USD', 'GBP/USD'],
            riskProfile: 'MEDIUM',
          },
          positionContext: {
            currentPositions: [],
            exposureLimit: 2000000,
            utilizationRate: 0.4,
          },
        },
      };

      await tradingApi.submitTradeIntent(intent);
      setInput('');
      setShowInput(false);
    } catch (error) {
      console.error('Failed to submit trade intent:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="card space-y-4">
      <h2 className="font-semibold">Smart Execution</h2>
      
      {!showInput ? (
        <button
          onClick={() => setShowInput(true)}
          className="w-full bg-blue-50 p-4 rounded-lg text-left hover:bg-blue-100 transition-colors"
        >
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <ArrowRightLeft className="text-blue-600" size={18} />
            </div>
            <div>
              <p className="font-medium text-blue-900">Create New Order</p>
              <p className="text-sm text-slate-600">
                Describe your trading needs naturally
              </p>
            </div>
          </div>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., Buy €500k for end of month supplier payments"
              className="w-full h-24 p-3 pr-12 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
              disabled={isProcessing}
            />
            <MessageSquare 
              size={20} 
              className="absolute right-3 top-3 text-slate-400"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowInput(false)}
              className="flex-1 py-2 px-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Submit'}
            </button>
          </div>
        </form>
      )}

      {/* Quick Templates */}
      <div className="grid grid-cols-2 gap-3">
        <button className="p-3 border rounded-lg text-left hover:bg-slate-50 transition-colors">
          <p className="font-medium text-sm">Regular EUR Buy</p>
          <p className="text-xs text-slate-500">Monthly €50k</p>
        </button>
        <button className="p-3 border rounded-lg text-left hover:bg-slate-50 transition-colors">
          <p className="font-medium text-sm">USD Conversion</p>
          <p className="text-xs text-slate-500">Quarter-end</p>
        </button>
      </div>
    </div>
  );
}
