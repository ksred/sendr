'use client';

import { ChatMessage } from "@/stores/chat-store";

interface TradeUpdateProps {
  message: ChatMessage;
}

export function TradeUpdate({ message }: TradeUpdateProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-sm text-foreground-secondary mb-2">TRADE_UPDATE</p>
      <p className="text-foreground mb-2">{message.content}</p>
      {message.metadata?.tradeId && (
        <p className="text-sm text-foreground-secondary">
          Trade ID: {message.metadata.tradeId}
        </p>
      )}
      {message.metadata?.rateSnapshot && (
        <p className="text-sm text-success">
          Rate: {message.metadata.rateSnapshot}
        </p>
      )}
    </div>
  );
}
