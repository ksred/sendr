export type MessageType =
  | 'USER_INPUT'        // Plain text from user
  | 'SYSTEM_MESSAGE'    // System notifications
  | 'LLM_RESPONSE'      // AI responses
  | 'TRADE_UPDATE'      // Trade status changes
  | 'RATE_ALERT'        // Price notifications
  | 'ACTION_PROMPT';    // Interactive elements

export interface ActionButton {
  id: string;
  label: string;
  action: 'TRADE' | 'CONFIRM' | 'CANCEL' | 'VIEW_DETAILS';
  style: 'PRIMARY' | 'SECONDARY' | 'DANGER';
  disabled?: boolean;
  loading?: boolean;
}

export interface ChatMessage {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  metadata: {
    tradeId?: string;
    rateSnapshot?: number;
    actions?: ActionButton[];
    attachments?: Attachment[];
    status: 'SENT' | 'DELIVERED' | 'READ';
    error?: ErrorDetails;
  };
}

interface Attachment {
  type: string;
  url: string;
}

interface ErrorDetails {
  code: string;
  message: string;
}
