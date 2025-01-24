'use client';

import { ChatMessage } from "@/stores/chat-store";

interface UserInputProps {
  message: ChatMessage;
}

export function UserInput({ message }: UserInputProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-sm text-foreground-secondary mb-2">USER_INPUT</p>
      <p className="text-foreground">{message.content}</p>
      {message.metadata?.status && (
        <p className="text-xs text-foreground-secondary mt-1">
          Status: {message.metadata.status}
        </p>
      )}
    </div>
  );
}
