'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/chat-store";
import { 
  ArrowRightLeft, 
  Search, 
  Star, 
  Bell, 
  BarChart2, 
  History, 
  TrendingUp 
} from "lucide-react";

export function QuickActions() {
  const { addActionPrompt, addSystemMessage } = useChatStore();

  const handleNewTrade = () => {
    addActionPrompt('Select a currency pair to trade:', [
      { id: '1', label: 'EUR/USD', action: 'trade', style: 'PRIMARY' },
      { id: '2', label: 'GBP/USD', action: 'trade', style: 'PRIMARY' },
      { id: '3', label: 'USD/JPY', action: 'trade', style: 'PRIMARY' },
    ]);
  };

  const handlePopularPairs = () => {
    addSystemMessage(`Current rates for popular pairs:
EUR/USD: 1.0950 (+0.14%)
GBP/USD: 1.2750 (+0.20%)
USD/JPY: 148.25 (-0.10%)`);
  };

  const handleSearchPairs = () => {
    addSystemMessage('Type a currency pair to search (e.g., "EUR/USD" or "Bitcoin")');
  };

  const handleFavorites = () => {
    addSystemMessage('Your favorite pairs will appear here. Add pairs to your favorites to track them easily.');
  };

  const handleSetAlert = () => {
    addActionPrompt('Choose a pair to set an alert for:', [
      { id: '1', label: 'EUR/USD', action: 'alert', style: 'PRIMARY' },
      { id: '2', label: 'GBP/USD', action: 'alert', style: 'PRIMARY' },
      { id: '3', label: 'USD/JPY', action: 'alert', style: 'PRIMARY' },
    ]);
  };

  const handleActiveTrades = () => {
    addSystemMessage('You have no active trades. Use the "New Trade" button to start trading.');
  };

  const handleHistory = () => {
    addSystemMessage('Your trading history will appear here once you start making trades.');
  };

  const actions = [
    { icon: ArrowRightLeft, label: 'New Trade', onClick: handleNewTrade },
    { icon: TrendingUp, label: 'Popular Pairs', onClick: handlePopularPairs },
    { icon: Search, label: 'Search Pairs', onClick: handleSearchPairs },
    { icon: Star, label: 'Favorites', onClick: handleFavorites },
    { icon: Bell, label: 'Set Alert', onClick: handleSetAlert },
    { icon: BarChart2, label: 'Active Trades', onClick: handleActiveTrades },
    { icon: History, label: 'History', onClick: handleHistory },
  ];

  return (
    <div className="w-full bg-background px-4 py-2">
      <div className="flex flex-col space-y-1.5">
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            className="w-fit"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Button
              variant="outline"
              onClick={action.onClick}
              className="justify-start space-x-2 hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all duration-200"
            >
              <action.icon className="h-4 w-4" />
              <span>{action.label}</span>
            </Button>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
