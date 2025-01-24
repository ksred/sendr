'use client';

import { ChatMessage as ChatMessageType } from "@/stores/chat-store";
import { SystemMessage } from "./messages/system-message";
import { RateAlert } from "./messages/rate-alert";
import { ActionPrompt } from "./messages/action-prompt";
import { TradeUpdate } from "./messages/trade-update";
import { UserInput } from "./messages/user-input";
import { LLMResponse } from "./messages/llm-response";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  switch (message.type) {
    case 'SYSTEM_MESSAGE':
      return <SystemMessage message={message} />;
    case 'RATE_ALERT':
      return <RateAlert message={message} />;
    case 'ACTION_PROMPT':
      return <ActionPrompt message={message} />;
    case 'TRADE_UPDATE':
      return <TradeUpdate message={message} />;
    case 'USER_INPUT':
      return <UserInput message={message} />;
    case 'LLM_RESPONSE':
      return <LLMResponse message={message} />;
    default:
      return null;
  }
}
