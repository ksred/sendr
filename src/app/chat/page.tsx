'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AccountOverview from '@/components/account/account-overview';
import BottomNav from '@/components/navigation/bottom-nav';
import MessageAction from '@/components/chat/message-action';
import LoadingDots from '@/components/ui/loading-dots';
import { Send, Info, ArrowLeft } from 'lucide-react';
import { PaymentOrder, PaymentConfirmation, PaymentIntent } from '@/types/payment';
import { Message, MessageAction as MessageActionType, ActionType, ActionData } from '@/types/chat';
import api from '@/lib/api';
import { ApiClientError } from '@/lib/api/client';

interface ChatMessage extends Message {
  paymentDetails?: {
    sourceCurrency: string;
    targetCurrency: string;
    beneficiary: {
      name: string;
      accountNumber: string;
      bankCode: string;
    };
  };
  isLoading?: boolean;
  sender: 'user' | 'system';
}

const DEMO_COMMANDS = [
  { command: "send 500k eur to john", description: "Start a new payment" },
  { command: "transfer €1000 to alice", description: "Make a transfer in EUR" },
  { command: "pay $500 to bob", description: "Make a payment in USD" },
  { command: "show my recent payments", description: "View payment history" }
];


export default function ChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const initialMessageProcessed = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const processMessage = async (messageText: string) => {
    try {
      setMessages(prev => [
        ...prev,
        {
          text: messageText,
          sender: 'user',
          timestamp: new Date().toISOString(),
          status: 'completed'
        },
        {
          text: '',
          sender: 'system',
          timestamp: new Date().toISOString(),
          status: 'loading',
          isLoading: true
        }
      ]);

      const processedIntent = await api.paymentIntents.create(messageText);
      console.log('Chat processMessage - Received response:', processedIntent);

      if (processedIntent.error) {
        setMessages(prev => {
          const withoutLoading = prev.filter(msg => !msg.isLoading);
          return [...withoutLoading, {
            text: `Sorry, I couldn't process your payment request: ${processedIntent.error}`,
            sender: 'system',
            timestamp: new Date().toISOString(),
            status: 'error'
          }];
        });
        return;
      }

      setMessages(prev => {
        const withoutLoading = prev.filter(msg => !msg.isLoading);
        console.log('Chat processMessage - Creating response message with intent:', processedIntent);
        const response: ChatMessage = {
          text: "Here's what I found based on your payment request:",
          sender: 'system',
          timestamp: new Date().toISOString(),
          status: 'completed',
          action: {
            type: 'PAYMENT_INITIATION',
            data: {
              intent: {
                payment_id: processedIntent.paymentId,
                details: {
                  amount: processedIntent.amount,
                  status: processedIntent.status,
                  from_currency: String(processedIntent.fromCurrency),
                  to_currency: String(processedIntent.toCurrency),
                  converted_amount: processedIntent.convertedAmount,
                  exchange_rate: processedIntent.exchangeRate,
                  fees: processedIntent.fee,
                  total_cost: processedIntent.totalCost,
                  payeeDetails: {
                    name: processedIntent.beneficiaryName || '',
                    bankInfo: processedIntent.beneficiaryBankInfo || '',
                    matchConfidence: processedIntent.confidence?.beneficiary || 0
                  }
                },
                confidence: processedIntent.confidence,
              }
            }
          }
        };
        console.log('Chat processMessage - Created response message:', response);
        return [...withoutLoading, response];
      });
    } catch (error: any) {
      console.error('Chat processMessage - Error:', error);
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => !msg.isLoading);
        const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred';
        return [...withoutLoading, {
          text: `Sorry, I couldn't process your payment request: ${errorMessage}`,
          sender: 'system',
          timestamp: new Date().toISOString(),
          status: 'error'
        }];
      });
    }
  };

  useEffect(() => {
    const initialMessage = searchParams.get('message');
    if (initialMessage && !initialMessageProcessed.current) {
      initialMessageProcessed.current = true;
      processMessage(initialMessage);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isProcessing) return;

    await processMessage(newMessage);
    setNewMessage('');
  };

  const handleConfirm = () => {
    console.log('Payment confirmed');
    // TODO: Implement payment confirmation
  };

  const handleModify = () => {
    console.log('Payment modification requested');
    // TODO: Implement payment modification
  };

  const handleCancel = () => {
    console.log('Payment cancelled');
    // TODO: Implement payment cancellation
  };

  return (
    <main className="flex flex-col min-h-screen">
      <div className="bg-slate-900 text-white px-4 py-2 flex items-center">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 hover:text-blue-400 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <AccountOverview />

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E1 #F1F5F9'
        }}
      >
        <div className="p-4 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-2 text-blue-700 font-semibold mb-2">
              <Info size={16} />
              <span>Demo Commands:</span>
            </div>
            <div className="space-y-1 text-sm text-blue-600">
              {DEMO_COMMANDS.map(({ command, description }) => (
                <div key={command}>
                  <code className="bg-blue-100 px-1 rounded">{command}</code>
                  <span className="ml-2 text-blue-500">{description}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pb-36">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
              >
                <div
                  className={`${message.isLoading
                    ? 'bg-transparent p-2'
                    : message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                    } ${!message.isLoading && 'p-4'} rounded-lg max-w-[80%]`}
                >
                  <div className={`break-words ${message.isLoading ? 'text-gray-500' : ''}`}>
                    {message.text}
                    {message.isLoading && <LoadingDots />}
                  </div>
                  {message.action && (
                    <MessageAction
                      action={message.action}
                      onConfirm={handleConfirm}
                      onModify={handleModify}
                      onCancel={handleCancel}
                    />
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 shadow-lg">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 focus:outline-none"
          >
            <Send size={20} />
          </button>
        </form>
      </div>

      <BottomNav />
    </main>
  );
}
