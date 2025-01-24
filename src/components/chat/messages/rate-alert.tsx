'use client';

import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/stores/chat-store";

interface RateAlertProps {
  message: ChatMessage;
}

export function RateAlert({ message }: RateAlertProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-sm text-foreground-secondary mb-2">RATE_ALERT</p>
      <p className="text-foreground mb-2">{message.content}</p>
      {message.metadata?.rateSnapshot && (
        <p className="text-lg font-semibold text-success mb-4">
          {message.metadata.rateSnapshot}
        </p>
      )}
      {message.metadata?.actions && (
        <div className="flex flex-wrap gap-2">
          {message.metadata.actions.map((action) => (
            <Button
              key={action.id}
              variant={action.style === 'PRIMARY' ? 'default' : 'secondary'}
              size="sm"
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
