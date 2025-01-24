import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/types/chat";

interface ActionPromptProps {
  message: ChatMessage;
}

export function ActionPrompt({ message }: ActionPromptProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-sm text-foreground-secondary mb-2">ACTION_PROMPT</p>
      <p className="text-foreground">{message.content}</p>
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
