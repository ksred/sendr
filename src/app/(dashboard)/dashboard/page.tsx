'use client';

import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/chat/message";
import { QuickActions } from "@/components/chat/quick-actions";
import { useChatStore } from "@/stores/chat-store";
import { useEffect } from "react";

export default function DashboardPage() {
  const { messages, addSystemMessage } = useChatStore();

  useEffect(() => {
    // Only add welcome message if there are no messages
    if (messages.length === 0) {
      addSystemMessage('Welcome to Sendr! Select an action or type a command to get started.');
    }
  }, []);

  return (
    <div className="flex h-full">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Message List */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4 p-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        </div>

        {/* Quick Actions and Input Area */}
        <div className="border-t border-border bg-background relative z-40">
          <QuickActions />
          <div className="border-t border-border p-4">
            <div className="flex space-x-3">
              <input
                type="text"
                placeholder="Type a message or command (e.g., 'trade EUR/USD' or 'set alert')"
                className="flex-1 rounded-md bg-card px-3 py-2 text-foreground placeholder:text-foreground-secondary border border-border focus:border-primary focus:outline-none"
              />
              <Button>Send</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Rates & Balance */}
      <div className="w-80 border-l border-border bg-background p-4">
        {/* Balance Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-foreground-secondary mb-3">Your Balance</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-foreground-secondary">USD</span>
              <span className="text-foreground font-medium">50,000.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-secondary">EUR</span>
              <span className="text-foreground font-medium">42,500.00</span>
            </div>
          </div>
        </div>

        {/* Rate Ticker */}
        <div>
          <h3 className="text-sm font-medium text-foreground-secondary mb-3">Live Rates</h3>
          <div className="space-y-3">
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="flex justify-between mb-1">
                <span className="text-foreground font-medium">EUR/USD</span>
                <span className="text-success">1.0950</span>
              </div>
              <div className="text-xs text-foreground-secondary">
                +0.0015 (+0.14%)
              </div>
            </div>
            
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="flex justify-between mb-1">
                <span className="text-foreground font-medium">GBP/USD</span>
                <span className="text-success">1.2750</span>
              </div>
              <div className="text-xs text-foreground-secondary">
                +0.0025 (+0.20%)
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-3">
              <div className="flex justify-between mb-1">
                <span className="text-foreground font-medium">USD/JPY</span>
                <span className="text-foreground">148.25</span>
              </div>
              <div className="text-xs text-foreground-secondary">
                -0.15 (-0.10%)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
