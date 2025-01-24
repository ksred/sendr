import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/types/chat";

interface TradeUpdateProps {
  message: ChatMessage;
}

export function TradeUpdate({ message }: TradeUpdateProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-sm text-foreground-secondary mb-2">TRADE_UPDATE</p>
      <p className="text-foreground">{message.content}</p>
      {message.metadata.tradeId && (
        <p className="text-xs text-foreground-secondary mt-1">
          Trade ID: {message.metadata.tradeId}
        </p>
      )}
      {message.metadata.rateSnapshot && (
        <p className="text-xs text-foreground-secondary">
          Rate: {message.metadata.rateSnapshot}
        </p>
      )}
      {message.metadata.actions && (
        <div className="mt-3 flex space-x-3">
          {message.metadata.actions.map((action) => (
            <Button
              key={action.id}
              size="sm"
              variant={action.style === 'PRIMARY' ? 'default' : 'secondary'}
              disabled={action.disabled}
              className={action.loading ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
