import React, { useState } from 'react';
import { ArrowRightLeft, ChevronRight, Clock, AlertCircle, Plus, BarChart3, Wallet } from 'lucide-react';

const ForexInterface = () => {
    const [activeView, setActiveView] = useState('main');
    const [showExecutionPanel, setShowExecutionPanel] = useState(false);

    return (
        <div className="flex flex-col h-screen bg-slate-50">
            {/* Account Overview Panel */}
            <div className="bg-slate-900 text-white p-4">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-sm text-slate-400">Available for Trading</p>
                        <p className="text-2xl font-bold">$1,250,000.00</p>
                    </div>
                    <button className="bg-slate-800 px-3 py-1 rounded-lg text-sm">
                        View Limits
                    </button>
                </div>

                {/* Quick Position Summary */}
                <div className="flex space-x-3 overflow-x-auto py-2">
                    <div className="bg-slate-800 rounded-lg px-3 py-2 flex-shrink-0">
                        <p className="text-slate-400 text-sm">EUR Position</p>
                        <p className="font-medium">€825,000</p>
                    </div>
                    <div className="bg-slate-800 rounded-lg px-3 py-2 flex-shrink-0">
                        <p className="text-slate-400 text-sm">GBP Position</p>
                        <p className="font-medium">£420,000</p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-auto">
                <div className="p-4 space-y-6">
                    {/* Execution Intent Panel */}
                    <div className="bg-white rounded-xl border p-4">
                        <h2 className="font-semibold mb-4">Smart Execution</h2>
                        <div className="space-y-3">
                            <button
                                onClick={() => setShowExecutionPanel(true)}
                                className="w-full bg-blue-50 p-4 rounded-lg text-left hover:bg-blue-100 transition-colors"
                            >
                                <div className="flex items-start space-x-3">
                                    <div className="bg-blue-100 p-2 rounded-lg mt-1">
                                        <ArrowRightLeft className="text-blue-600" size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-blue-900">Create New Order</p>
                                        <p className="text-sm text-slate-600">Describe your trading needs naturally</p>
                                    </div>
                                </div>
                            </button>

                            {/* Quick Templates */}
                            <div className="grid grid-cols-2 gap-3">
                                <button className="p-3 border rounded-lg text-left">
                                    <p className="font-medium text-sm">Regular EUR Buy</p>
                                    <p className="text-xs text-slate-500">Monthly €50k</p>
                                </button>
                                <button className="p-3 border rounded-lg text-left">
                                    <p className="font-medium text-sm">USD Conversion</p>
                                    <p className="text-xs text-slate-500">Quarter-end</p>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Active Orders */}
                    <div className="space-y-3">
                        <h2 className="font-semibold">Active Orders</h2>
                        <div className="bg-white rounded-xl border p-4 space-y-4">
                            <div className="flex items-center justify-between pb-4 border-b">
                                <div>
                                    <p className="font-medium">EUR/USD Split Order</p>
                                    <p className="text-sm text-slate-500">3 tranches • 2 remaining</p>
                                </div>
                                <span className="text-amber-500 text-sm font-medium">In Progress</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600">Tranche 2/3</span>
                                    <span>$333,000 @ 1.0840</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600">Tranche 3/3</span>
                                    <span>$334,000 @ 1.0860</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Market Overview */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <h2 className="font-semibold">Market Overview</h2>
                            <button className="text-blue-500 text-sm">Expand</button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { pair: 'EUR/USD', rate: '1.0823', change: '+0.05%' },
                                { pair: 'GBP/USD', rate: '1.2654', change: '-0.12%' }
                            ].map(item => (
                                <div key={item.pair} className="bg-white p-3 rounded-xl border">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-medium">{item.pair}</span>
                                        <span className={item.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                                            {item.change}
                                        </span>
                                    </div>
                                    <p className="text-lg font-semibold">{item.rate}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Execution Panel - Bottom Sheet */}
            {showExecutionPanel && (
                <div className="absolute inset-0 bg-white flex flex-col">
                    <div className="p-4 border-b flex justify-between items-center">
                        <h2 className="font-semibold">New Execution</h2>
                        <button
                            onClick={() => setShowExecutionPanel(false)}
                            className="text-slate-400"
                        >
                            Cancel
                        </button>
                    </div>

                    <div className="flex-1 p-4">
                        <div className="bg-blue-50 rounded-lg p-4 mb-4">
                            <p className="text-sm text-blue-700">
                                Describe your trading need in natural language. For example:
                            </p>
                            <p className="text-sm text-blue-900 font-medium mt-2">
                                "I need to buy €500k for end of month supplier payments, but want to catch better rates if possible"
                            </p>
                        </div>

                        <textarea
                            className="w-full border rounded-lg p-3 h-32 mb-4"
                            placeholder="Describe your trading needs..."
                        />

                        <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium">
                            Analyse & Structure Trade
                        </button>
                    </div>
                </div>
            )}

            {/* Bottom Navigation */}
            <div className="bg-white border-t flex justify-around">
                <button className="flex-1 py-3 px-4 flex flex-col items-center text-blue-500">
                    <BarChart3 size={20} />
                    <span className="text-xs mt-1">Execute</span>
                </button>
                <button className="flex-1 py-3 px-4 flex flex-col items-center text-slate-600">
                    <Clock size={20} />
                    <span className="text-xs mt-1">Orders</span>
                </button>
                <button className="flex-1 py-3 px-4 flex flex-col items-center text-slate-600">
                    <Wallet size={20} />
                    <span className="text-xs mt-1">Positions</span>
                </button>
            </div>
        </div>
    );
};

export default ForexInterface;