'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRightCircle, MessageSquare, Sparkles, CreditCard, Plus } from 'lucide-react';

export default function ExecutionPanel() {
  const [showInput, setShowInput] = useState(false);
  const [input, setInput] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    router.push(`/chat?message=${encodeURIComponent(input)}`);
    setInput('');
    setShowInput(false);
  };

  const onStart = () => {
    setShowInput(true);
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg text-white">
      {showInput ? (
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <span>Smart Payment Processing</span>
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., Pay 500k to John Doe"
              className="w-full px-4 py-3 bg-white/5 text-white placeholder-slate-400 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              autoFocus
            />
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-300">
                Describe your payment naturally - our AI will handle the details
              </p>
              <button
                type="submit"
                disabled={!input.trim()}
                className="px-6 py-2.5 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Execute
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-6 text-center">
          <div className="space-y-2 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <span>Smart Payment Processing</span>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Make a Payment</h2>
              <p className="text-gray-600">
                Start a new payment with natural language
              </p>
              <button
                onClick={onStart}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus size={20} />
                <span>Start Payment</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
