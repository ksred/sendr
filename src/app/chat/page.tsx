'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AccountOverview from '@/components/account/account-overview';
import BottomNav from '@/components/navigation/bottom-nav';
import MessageAction from '@/components/chat/message-action';
import { Send, Info, ArrowLeft } from 'lucide-react';
import { TradeIntent, ExecutionStrategy, MarketConditions } from '@/types/trading';

type ActionType = 
  | 'INTENT_ANALYSIS'
  | 'STRATEGY_CREATION'
  | 'RISK_ASSESSMENT'
  | 'ORDER_SPLITTING'
  | 'EXECUTION'
  | 'MONITORING'
  | 'COMPLETED'
  | 'CANCELLED';

interface ActionData {
  type: ActionType;
  data: {
    intent?: TradeIntent;
    strategy?: ExecutionStrategy;
    marketConditions?: MarketConditions;
    progress?: number;
    error?: string;
  };
  options?: {
    confirm?: boolean;
    modify?: boolean;
    cancel?: boolean;
  };
}

interface Message {
  text: string;
  sender: 'user' | 'system';
  timestamp: string;
  action?: ActionData;
  status?: 'pending' | 'processing' | 'completed' | 'error';
}

const DEMO_COMMANDS = [
  { command: "buy 500k eur", description: "Start a new trade intent" },
  { command: "show market analysis", description: "View market conditions" },
  { command: "execute strategy", description: "See execution progress" },
  { command: "cancel trade", description: "Cancel current execution" },
];

const DEMO_RESPONSES: Record<string, Message> = {
  "buy 500k eur": {
    text: "I'll help you execute your EUR purchase. Let me analyze the parameters.",
    sender: 'system',
    timestamp: new Date().toISOString(),
    status: 'completed',
    action: {
      type: 'INTENT_ANALYSIS',
      data: {
        intent: {
          goal: 'SINGLE_EXECUTION',
          constraints: {
            amount: 500000,
            riskTolerance: 'MEDIUM'
          },
          context: {
            marketConditions: {
              volatility: 0.15,
              trend: 'NEUTRAL',
              liquidity: 0.8
            },
            userHistory: {
              recentTrades: [],
              preferredPairs: ['EUR/USD'],
              riskProfile: 'MEDIUM'
            },
            positionContext: {
              currentPositions: [],
              exposureLimit: 1000000,
              utilizationRate: 0.5
            }
          }
        }
      },
      options: {
        confirm: true,
        modify: true,
        cancel: true
      }
    }
  },
  "show market analysis": {
    text: "Here's the current market analysis for EUR/USD:",
    sender: 'system',
    timestamp: new Date().toISOString(),
    status: 'completed',
    action: {
      type: 'STRATEGY_CREATION',
      data: {
        strategy: {
          description: 'Market shows favorable conditions with tight spreads. Recommended approach: Split into 2 tranches over 1 hour.',
          estimatedCompletion: '1 hour',
          tranches: []
        },
        marketConditions: {
          volatility: 0.15,
          trend: 'POSITIVE',
          liquidity: 0.9
        }
      },
      options: {
        confirm: true,
        modify: true
      }
    }
  },
  "execute strategy": {
    text: "Executing your trade strategy...",
    sender: 'system',
    timestamp: new Date().toISOString(),
    status: 'completed',
    action: {
      type: 'EXECUTION',
      data: {
        progress: 45,
        strategy: {
          description: 'First tranche executed successfully. Second tranche in progress.',
          estimatedCompletion: '30 minutes',
          tranches: []
        }
      },
      options: {
        cancel: true
      }
    }
  },
  "cancel trade": {
    text: "Trade execution has been cancelled.",
    sender: 'system',
    timestamp: new Date().toISOString(),
    status: 'completed',
    action: {
      type: 'CANCELLED',
      data: {
        error: 'Execution cancelled by user'
      }
    }
  }
};

export default function ChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const initialMessageProcessed = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const processMessage = (messageText: string) => {
    const userMessage: Message = {
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString(),
      status: 'completed'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Check for demo commands
    const demoResponse = DEMO_RESPONSES[messageText.toLowerCase().trim()];
    
    setTimeout(() => {
      setIsLoading(false);
      if (demoResponse) {
        setMessages(prev => [...prev, {
          ...demoResponse,
          timestamp: new Date().toISOString()
        }]);
      } else {
        setMessages(prev => [...prev, {
          text: "I'll help you with your trade execution. Let me analyze your request.",
          sender: 'system',
          timestamp: new Date().toISOString(),
          status: 'completed',
          action: {
            type: 'INTENT_ANALYSIS',
            data: {
              intent: {
                goal: 'SINGLE_EXECUTION',
                constraints: {
                  amount: 0,
                  riskTolerance: 'MEDIUM'
                },
                context: {
                  marketConditions: {
                    volatility: 0,
                    trend: 'NEUTRAL',
                    liquidity: 0
                  },
                  userHistory: {
                    recentTrades: [],
                    preferredPairs: [],
                    riskProfile: 'MEDIUM'
                  },
                  positionContext: {
                    currentPositions: [],
                    exposureLimit: 0,
                    utilizationRate: 0
                  }
                }
              }
            },
            options: {
              confirm: true,
              modify: true
            }
          }
        }]);
      }
    }, 1000);
  };

  useEffect(() => {
    const initialMessage = searchParams.get('message');
    if (initialMessage && !initialMessageProcessed.current) {
      initialMessageProcessed.current = true;
      processMessage(initialMessage);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    processMessage(newMessage);
    setNewMessage('');
  };

  const handleConfirmAction = (messageIndex: number) => {
    const message = messages[messageIndex];
    if (!message.action) return;

    setMessages(prev => {
      const updated = [...prev];
      updated[messageIndex] = { ...message, status: 'processing' };
      return updated;
    });

    // Simulate next step
    setTimeout(() => {
      setIsLoading(false);
      setMessages(prev => {
        const updated = [...prev];
        updated[messageIndex] = { ...message, status: 'completed' };
        
        // Add next step message
        return [...updated, {
          text: "I've created an execution strategy based on your requirements.",
          sender: 'system',
          timestamp: new Date().toISOString(),
          status: 'completed',
          action: {
            type: 'STRATEGY_CREATION',
            data: {
              strategy: {
                description: 'Split order into 3 tranches over 2 hours',
                estimatedCompletion: '2 hours',
                tranches: []
              }
            },
            options: {
              confirm: true,
              modify: true
            }
          }
        }];
      });
    }, 2000);
  };

  const handleModifyAction = (messageIndex: number) => {
    // Implementation for modification
    console.log('Modify action for message:', messageIndex);
  };

  const handleCancelAction = (messageIndex: number) => {
    // Implementation for cancellation
    console.log('Cancel action for message:', messageIndex);
  };

  return (
    <main className="flex flex-col min-h-screen">
      {/* Back Button */}
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
          {/* Demo Commands Info */}
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

          {/* Messages */}
          <div className="space-y-4 pb-36">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  } rounded-lg p-4`}
                >
                  <div>{message.text}</div>
                  {message.action && (
                    <MessageAction
                      action={message.action}
                      onConfirm={() => handleConfirmAction(index)}
                      onModify={() => handleModifyAction(index)}
                      onCancel={() => handleCancelAction(index)}
                    />
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 rounded-lg p-4 max-w-[70%]">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                  </div>
                </div>
              </div>
            )}
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
