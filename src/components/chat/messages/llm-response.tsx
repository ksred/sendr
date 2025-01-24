'use client';

import { ChatMessage } from "@/stores/chat-store";

interface LLMResponseProps {
  message: ChatMessage;
}

export function LLMResponse({ message }: LLMResponseProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-sm text-foreground-secondary mb-2">ASSISTANT</p>
      <p className="text-foreground whitespace-pre-wrap">{message.content}</p>
      {message.metadata?.status && (
        <p className="text-xs text-foreground-secondary mt-1">
          Status: {message.metadata.status}
        </p>
      )}
    </div>
  );
}
