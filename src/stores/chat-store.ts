'use client';

import { create } from 'zustand';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890abcdef', 10);

export type MessageType = 
  | 'SYSTEM_MESSAGE'
  | 'ACTION_PROMPT'
  | 'RATE_ALERT'
  | 'TRADE_UPDATE'
  | 'USER_INPUT'
  | 'LLM_RESPONSE';

export interface ActionButton {
  id: string;
  label: string;
  action: string;
  style: 'PRIMARY' | 'SECONDARY' | 'DESTRUCTIVE';
}

export interface ChatMessage {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  metadata?: {
    status?: 'PENDING' | 'DELIVERED' | 'ERROR';
    actions?: ActionButton[];
    tradeId?: string;
    rateSnapshot?: number;
  };
}

interface ChatState {
  messages: ChatMessage[];
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  addSystemMessage: (content: string) => void;
  addActionPrompt: (content: string, actions: ActionButton[]) => void;
  addTradeUpdate: (content: string, tradeId: string, rate?: number) => void;
  addRateAlert: (content: string, rate: number, actions: ActionButton[]) => void;
  addUserInput: (content: string) => void;
  addLLMResponse: (content: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      ...message,
      id: nanoid(),
      timestamp: new Date(),
    }]
  })),

  addSystemMessage: (content) => set((state) => ({
    messages: [...state.messages, {
      id: nanoid(),
      type: 'SYSTEM_MESSAGE',
      content,
      timestamp: new Date(),
      metadata: { status: 'DELIVERED' }
    }]
  })),

  addActionPrompt: (content, actions) => set((state) => ({
    messages: [...state.messages, {
      id: nanoid(),
      type: 'ACTION_PROMPT',
      content,
      timestamp: new Date(),
      metadata: { 
        status: 'DELIVERED',
        actions 
      }
    }]
  })),

  addTradeUpdate: (content, tradeId, rate) => set((state) => ({
    messages: [...state.messages, {
      id: nanoid(),
      type: 'TRADE_UPDATE',
      content,
      timestamp: new Date(),
      metadata: { 
        status: 'DELIVERED',
        tradeId,
        rateSnapshot: rate
      }
    }]
  })),

  addRateAlert: (content, rate, actions) => set((state) => ({
    messages: [...state.messages, {
      id: nanoid(),
      type: 'RATE_ALERT',
      content,
      timestamp: new Date(),
      metadata: { 
        status: 'DELIVERED',
        rateSnapshot: rate,
        actions
      }
    }]
  })),

  addUserInput: (content) => set((state) => ({
    messages: [...state.messages, {
      id: nanoid(),
      type: 'USER_INPUT',
      content,
      timestamp: new Date(),
      metadata: { status: 'DELIVERED' }
    }]
  })),

  addLLMResponse: (content) => set((state) => ({
    messages: [...state.messages, {
      id: nanoid(),
      type: 'LLM_RESPONSE',
      content,
      timestamp: new Date(),
      metadata: { status: 'DELIVERED' }
    }]
  })),
}));
