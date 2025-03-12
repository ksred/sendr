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
  { command: "show my recent payments", description: "View payment history" },
  { command: "show payment intents", description: "View all payment intents" }
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentIntents, setPaymentIntents] = useState<PaymentIntent[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const loadPaymentIntents = async () => {
      try {
        const intents = await api.paymentIntents.list();
        setPaymentIntents(intents);
        setMessages([
          {
            text: "Welcome! I'm here to help you with payments. Here are your current payment intents:",
            sender: 'system',
            timestamp: new Date().toISOString(),
            status: 'completed',
            action: {
              type: 'SHOW_PAYMENT_INTENTS',
              data: {
                paymentIntents: intents
              }
            }
          }
        ]);
      } catch (error) {
        console.error('Failed to load payment intents:', error);
        setMessages([
          {
            text: "Welcome! I'm here to help you with payments.",
            sender: 'system',
            timestamp: new Date().toISOString(),
            status: 'completed'
          }
        ]);
      }
    };

    loadPaymentIntents();
  }, []);

  // Handle showing payment intents in chat
  const handleShowPaymentIntents = async () => {
    try {
      const intents = await api.paymentIntents.list();
      setPaymentIntents(intents);
      setMessages(prev => [...prev, {
        text: "Here are your current payment intents:",
        sender: 'system',
        timestamp: new Date().toISOString(),
        status: 'completed',
        action: {
          type: 'SHOW_PAYMENT_INTENTS',
          data: {
            paymentIntents: intents
          }
        }
      }]);
    } catch (error) {
      console.error('Failed to load payment intents:', error);
      setMessages(prev => [...prev, {
        text: "Sorry, I couldn't load your payment intents at this time.",
        sender: 'system',
        timestamp: new Date().toISOString(),
        status: 'completed'
      }]);
    }
  };

  const findMatchingCommand = (input: string): string | null => {
    const normalizedInput = input.toLowerCase().trim();
    if (normalizedInput === 'show payment intents' || normalizedInput === 'show my payment intents') {
      handleShowPaymentIntents();
      return 'show payment intents';
    }
    return null;
  };

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

      // Use the process endpoint instead of create
      const processedIntent = await api.paymentIntents.process(messageText);
      console.log('Chat processMessage - Received response:', processedIntent);

      if (processedIntent.error) {
        setMessages(prev => {
          const withoutLoading = prev.filter(msg => !msg.isLoading);
          return [...withoutLoading, {
            text: `Sorry, I couldn't process your request: ${processedIntent.error}`,
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

        // Handle different intent types based on the API response
        const intentType = processedIntent.intent_type;
        let responseText = "Here's what I found based on your request:";
        let actionType: ActionType = 'PAYMENT_INITIATION';
        let actionData: ActionData = { intent: {} };

        // Handle different intent types from api.md specs
        if (intentType === 'payment') {
          const result = processedIntent.result || {};
          actionData = {
            intent: {
              payment_id: result.id || '',
              details: {
                amount: result.amount || '0',
                status: 'pending',
                from_currency: result.currency || 'USD',
                to_currency: result.currency || 'USD',
                converted_amount: result.amount || '0',
                exchange_rate: result.exchange_rate || '1',
                fees: result.fee || '0',
                total_cost: result.amount || '0',
                payeeDetails: {
                  name: result.beneficiary_name || '',
                  bankInfo: '',
                  matchConfidence: result.confidence?.beneficiary || 0
                }
              },
              confidence: result.confidence || {},
            }
          };
        } else if (intentType === 'buy_foreign_currency') {
          const result = processedIntent.result || {};
          actionType = 'CURRENCY_EXCHANGE';
          actionData = {
            intent: {
              payment_id: '',
              details: {
                amount: result.amount || '0',
                status: 'pending',
                from_currency: result.from_currency || 'USD',
                to_currency: result.to_currency || 'EUR',
                converted_amount: result.converted_amount || '0',
                exchange_rate: result.rate || '1',
                fees: result.fee || '0',
                total_cost: result.total_cost || '0',
              },
              confidence: result.confidence || {},
            }
          };
        } else if (intentType === 'show_beneficiary') {
          actionType = 'SHOW_BENEFICIARIES';
          responseText = "Here are the beneficiaries I found:";
          
          // Debug the result to understand structure
          console.log('show_beneficiary raw result:', processedIntent.result);
          
          actionData = {
            beneficiaries: Array.isArray(processedIntent.result) 
              ? processedIntent.result.map((item: any) => {
                  // Handle different casing in the API response (Beneficiary vs beneficiary)
                  const ben = item.Beneficiary || item.beneficiary || item;
                  console.log('Extracted beneficiary:', ben);
                  return {
                    id: ben.id || 0,
                    name: ben.name || 'Unknown',
                    bank_info: ben.bank_info || 'No bank information',
                    currency: ben.currency || 'Unknown currency'
                  };
                }) 
              : []
          };
        } else if (intentType === 'create_beneficiary') {
          actionType = 'SHOW_BENEFICIARIES';
          responseText = "I've created a new beneficiary:";
          // For create_beneficiary, the result is a single beneficiary object, not an array
          const beneficiary = processedIntent.result || {};
          actionData = {
            beneficiaries: [{
              id: beneficiary.id || 0,
              name: beneficiary.name || 'Unknown',
              bank_info: `${beneficiary.bank_name || ''} - ${beneficiary.account_number || ''}`,
              currency: beneficiary.currency || 'USD'
            }]
          };
        } else if (intentType === 'list_transactions') {
          actionType = 'SHOW_TRANSACTIONS';
          responseText = "Here are the transactions I found:";
          
          // Debug the result to understand structure
          console.log('list_transactions raw result:', processedIntent.result);
          
          // The result is either an array of transactions directly or nested in a 'transactions' property
          let transactions = [];
          
          if (Array.isArray(processedIntent.result)) {
            // Result is directly an array of transactions
            transactions = processedIntent.result;
          } else if (processedIntent.result && processedIntent.result.transactions) {
            // Result has a 'transactions' property
            transactions = processedIntent.result.transactions;
          }
          
          // Map the transactions to a consistent format
          actionData = {
            transactions: transactions.map((tx: any) => ({
              id: tx.id || `tx-${Math.random().toString(36).substr(2, 9)}`,
              date: tx.created_at || tx.date || new Date().toISOString(),
              amount: tx.amount || '0',
              currency: tx.currency || 'USD',
              beneficiary: tx.description || tx.beneficiary || 'Unknown recipient',
              type: tx.type || 'payment',
              status: tx.status || 'completed'
            }))
          };
          
          console.log('Processed transactions:', actionData.transactions);
        }

        const response: ChatMessage = {
          text: responseText,
          sender: 'system',
          timestamp: new Date().toISOString(),
          status: 'completed',
          action: {
            type: actionType,
            data: actionData
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
    if (initialMessage) {
      processMessage(initialMessage);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    await processMessage(input);
    setInput('');
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
        ref={messagesEndRef}
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
            value={input}
            onChange={(e) => setInput(e.target.value)}
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
