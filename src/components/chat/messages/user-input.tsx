import { ChatMessage } from "@/types/chat";

interface UserInputProps {
  message: ChatMessage;
}

export function UserInput({ message }: UserInputProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 ml-auto max-w-[80%]">
      <p className="text-sm text-foreground-secondary mb-2">YOU</p>
      <p className="text-foreground">{message.content}</p>
      <p className="text-xs text-foreground-secondary mt-2">
        {message.metadata.status}
      </p>
    </div>
  );
}
