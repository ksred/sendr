'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRightCircle, MessageSquare, Sparkles } from 'lucide-react';

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

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg text-white">
      {showInput ? (
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Sparkles size={16} className="text-blue-400" />
              <span>AI-Powered Trade Execution</span>
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., Buy 500k EUR/USD at market"
              className="w-full px-4 py-3 bg-white/5 text-white placeholder-slate-400 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              autoFocus
            />
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-300">
                Describe your trade naturally - our AI will handle the details
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
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-300">
              <Sparkles size={16} className="text-blue-400" />
              <span>AI-Powered Trade Execution</span>
            </div>
            <h2 className="text-2xl font-semibold">Execute a Trade</h2>
            <p className="text-slate-300">
              Start a new trade with natural language
            </p>
          </div>

          <button
            onClick={() => setShowInput(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg font-medium transition-colors group"
          >
            <MessageSquare className="w-5 h-5 text-blue-400" />
            <span>Start Trade</span>
            <ArrowRightCircle className="w-5 h-5 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}
