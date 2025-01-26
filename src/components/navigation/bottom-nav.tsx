'use client';

import { Home, BarChart2, ArrowRightLeft, Wallet, Settings } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Home', active: true },
  { icon: BarChart2, label: 'Markets' },
  { icon: ArrowRightLeft, label: 'Orders' },
  { icon: Wallet, label: 'Positions' },
  { icon: Settings, label: 'Settings' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t px-2 pb-safe">
      <div className="flex justify-between items-center">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`flex flex-col items-center py-2 px-3 ${
              item.active
                ? 'text-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <item.icon size={24} />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
