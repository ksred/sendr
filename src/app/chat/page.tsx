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
}

const DEMO_COMMANDS = [
  { command: "send 500k eur to john", description: "Start a new payment" },
  { command: "transfer €1000 to alice", description: "Make a transfer in EUR" },
  { command: "pay $500 to bob", description: "Make a payment in USD" },
  { command: "show my recent payments", description: "View payment history" }
];

const DEMO_RESPONSES: Record<string, ChatMessage> = {
  "send 500k eur to john": {
    text: "I'll help you send €500,000 to John. Here's the payment analysis:",
    sender: 'system',
    timestamp: new Date().toISOString(),
    status: 'completed',
    action: {
      type: 'PAYMENT_INITIATION',
      data: {
        intent: {
          type: 'PAYMENT_TO_PAYEE',
          details: {
            amount: 500000,
            sourceCurrency: 'USD',
            targetCurrency: 'EUR',
            payeeDetails: {
              name: 'John Smith',
              accountNumber: 'DE89370400440532013000',
              bankCode: 'DEUTDEFF'
            }
          },
          context: {
            marketRates: {
              USDEUR: {
                fromCurrency: 'USD',
                toCurrency: 'EUR',
                rate: 0.92,
                timestamp: new Date(),
                spread: 0.001
              },
              EURUSD: {
                fromCurrency: 'EUR',
                toCurrency: 'USD',
                rate: 1.09,
                timestamp: new Date(),
                spread: 0.001
              }
            },
            userHistory: {
              recentTransactions: [],
              preferredCurrencies: ['USD', 'EUR'],
              riskProfile: 'MEDIUM',
              paymentFrequency: 0,
              averagePaymentSize: 0
            },
            accountContext: {
              balances: {},
              limits: {
                daily: 1000000,
                monthly: 5000000,
                perTransaction: 1000000
              },
              utilizationRate: 0,
              status: 'ACTIVE'
            }
          }
        },
        fees: {
          baseFee: 0,
          feePercentage: 0.5,
          minimumFee: 10,
          estimatedTotal: 2500,
          breakdown: {
            exchangeFee: 1500,
            networkFee: 500,
            processingFee: 500
          }
        }
      },
      options: {
        confirm: true,
        modify: true
      }
    }
  },
  "transfer €1000 to alice": {
    text: "I'll help you transfer €1,000 to Alice. Here's the payment analysis:",
    sender: 'system',
    timestamp: new Date().toISOString(),
    status: 'completed',
    action: {
      type: 'PAYMENT_INITIATION',
      data: {
        intent: {
          type: 'PAYMENT_TO_PAYEE',
          details: {
            amount: 1000,
            sourceCurrency: 'USD',
            targetCurrency: 'EUR',
            payeeDetails: {
              name: 'Alice Johnson',
              accountNumber: 'FR7630006000011234567890189',
              bankCode: 'BNPAFRPP'
            }
          },
          context: {
            marketRates: {
              USDEUR: {
                fromCurrency: 'USD',
                toCurrency: 'EUR',
                rate: 0.92,
                timestamp: new Date(),
                spread: 0.001
              },
              EURUSD: {
                fromCurrency: 'EUR',
                toCurrency: 'USD',
                rate: 1.09,
                timestamp: new Date(),
                spread: 0.001
              }
            },
            userHistory: {
              recentTransactions: [],
              preferredCurrencies: ['USD', 'EUR'],
              riskProfile: 'MEDIUM',
              paymentFrequency: 0,
              averagePaymentSize: 0
            },
            accountContext: {
              balances: {},
              limits: {
                daily: 1000000,
                monthly: 5000000,
                perTransaction: 1000000
              },
              utilizationRate: 0,
              status: 'ACTIVE'
            }
          }
        },
        fees: {
          baseFee: 0,
          feePercentage: 0.5,
          minimumFee: 10,
          estimatedTotal: 5,
          breakdown: {
            exchangeFee: 3,
            networkFee: 1,
            processingFee: 1
          }
        }
      },
      options: {
        confirm: true,
        modify: true
      }
    }
  },
  "pay $500 to bob": {
    text: "I'll help you send $500 to Bob. Here's the payment analysis:",
    sender: 'system',
    timestamp: new Date().toISOString(),
    status: 'completed',
    action: {
      type: 'PAYMENT_INITIATION',
      data: {
        intent: {
          type: 'PAYMENT_TO_PAYEE',
          details: {
            amount: 500,
            sourceCurrency: 'USD',
            targetCurrency: 'USD',
            payeeDetails: {
              name: 'Bob Williams',
              accountNumber: '8529147036',
              bankCode: 'CHASUS33'
            }
          },
          context: {
            marketRates: {
              USDUSD: {
                fromCurrency: 'USD',
                toCurrency: 'USD',
                rate: 1,
                timestamp: new Date(),
                spread: 0
              }
            },
            userHistory: {
              recentTransactions: [],
              preferredCurrencies: ['USD'],
              riskProfile: 'MEDIUM',
              paymentFrequency: 0,
              averagePaymentSize: 0
            },
            accountContext: {
              balances: {},
              limits: {
                daily: 1000000,
                monthly: 5000000,
                perTransaction: 1000000
              },
              utilizationRate: 0,
              status: 'ACTIVE'
            }
          }
        },
        fees: {
          baseFee: 0,
          feePercentage: 0.5,
          minimumFee: 10,
          estimatedTotal: 10,
          breakdown: {
            exchangeFee: 0,
            networkFee: 5,
            processingFee: 5
          }
        }
      },
      options: {
        confirm: true,
        modify: true
      }
    }
  }
};

const findMatchingCommand = (input: string): string | null => {
  const normalizedInput = input.toLowerCase().replace(/[€$]/g, '');
  
  if (DEMO_RESPONSES[input]) {
    return input;
  }

  for (const key of Object.keys(DEMO_RESPONSES)) {
    if (key.toLowerCase().replace(/[€$]/g, '') === normalizedInput) {
      return key;
    }
  }

  return null;
};

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
    const userMessage: ChatMessage = {
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString(),
      status: 'completed'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    const loadingMessage: ChatMessage = {
      text: '',
      sender: 'system',
      timestamp: new Date().toISOString(),
      status: 'pending',
      isLoading: true
    };
    setMessages(prev => [...prev, loadingMessage]);

    await new Promise(resolve => setTimeout(resolve, 1000));

    setMessages(prev => {
      const withoutLoading = prev.filter(msg => !msg.isLoading);
      const matchedCommand = findMatchingCommand(messageText);
      const response = matchedCommand ? DEMO_RESPONSES[matchedCommand] : {
        text: "I'm not sure how to handle that request. Please try one of the example commands.",
        sender: 'system',
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      return [...withoutLoading, response];
    });
    
    setIsProcessing(false);
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

  const handleConfirmAction = (message: ChatMessage) => {
    if (!message.action) return;

    setMessages(prev => {
      const messageIndex = prev.indexOf(message);
      if (messageIndex === -1) return prev;

      const updated = [...prev];
      updated[messageIndex] = { ...message, status: 'completed' };

      const paymentOrder: PaymentOrder = {
        sourceCurrency: message.paymentDetails?.sourceCurrency || 'USD',
        targetCurrency: message.paymentDetails?.targetCurrency || 'EUR',
        amount: message.amount || 0,
        beneficiary: {
          name: message.paymentDetails?.beneficiary?.name || '',
          accountNumber: message.paymentDetails?.beneficiary?.accountNumber || '',
          bankCode: message.paymentDetails?.beneficiary?.bankCode || ''
        }
      };

      const paymentIntent: PaymentIntent = {
        type: 'PAYMENT_TO_PAYEE',
        details: {
          amount: paymentOrder.amount,
          sourceCurrency: paymentOrder.sourceCurrency,
          targetCurrency: paymentOrder.targetCurrency,
          payeeDetails: {
            name: paymentOrder.beneficiary.name,
            accountNumber: paymentOrder.beneficiary.accountNumber,
            bankCode: paymentOrder.beneficiary.bankCode
          },
          purpose: message.purpose
        },
        context: {
          marketRates: {
            USDEUR: {
              fromCurrency: 'USD',
              toCurrency: 'EUR',
              rate: 0.92,
              timestamp: new Date(),
              spread: 0.001
            },
            EURUSD: {
              fromCurrency: 'EUR',
              toCurrency: 'USD',
              rate: 1.09,
              timestamp: new Date(),
              spread: 0.001
            }
          },
          userHistory: {
            recentTransactions: [],
            preferredCurrencies: [paymentOrder.sourceCurrency, paymentOrder.targetCurrency],
            riskProfile: 'MEDIUM',
            paymentFrequency: 0,
            averagePaymentSize: 0
          },
          accountContext: {
            balances: {},
            limits: {
              daily: 1000000,
              monthly: 5000000,
              perTransaction: 1000000
            },
            utilizationRate: 0,
            status: 'ACTIVE'
          }
        }
      };

      const actionData: MessageActionType = {
        type: 'PAYMENT_CONFIRMATION',
        data: {
          intent: paymentIntent,
          progress: 100
        },
        options: {
          cancel: true
        }
      };

      const newMessage: ChatMessage = {
        text: "Payment confirmed successfully.",
        sender: 'system',
        timestamp: new Date().toISOString(),
        status: 'completed',
        action: actionData
      };

      return [...updated, newMessage];
    });
  };

  const handleModifyAction = (messageIndex: number) => {
    console.log('Modify action for message:', messageIndex);
  };

  const handleCancelAction = (messageIndex: number) => {
    console.log('Cancel action for message:', messageIndex);
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
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`${
                    message.isLoading 
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
                      onConfirm={handleConfirmAction}
                      onModify={handleModifyAction}
                      onCancel={handleCancelAction}
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
