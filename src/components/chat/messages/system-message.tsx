import { ChatMessage } from "@/types/chat";

interface SystemMessageProps {
  message: ChatMessage;
}

export function SystemMessage({ message }: SystemMessageProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-sm text-foreground-secondary mb-2">SYSTEM_MESSAGE</p>
      <p className="text-foreground">{message.content}</p>
    </div>
  );
}
