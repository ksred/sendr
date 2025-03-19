'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AccountOverview from '@/components/account/account-overview';
import BottomNav from '@/components/navigation/bottom-nav';
import MessageAction from '@/components/chat/message-action';
import LoadingDots from '@/components/ui/loading-dots';
import { Send, Info, ArrowLeft, TrendingUp, Clock, Wallet, Users } from 'lucide-react';
import { PaymentOrder, PaymentConfirmation, PaymentIntent } from '@/types/payment';
import { Message, MessageAction as MessageActionType, ActionType, ActionData } from '@/types/chat';
import api from '@/lib/api';
import { ApiClientError } from '@/lib/api/client';
import MarketChart from '@/components/markets/market-chart';
import ActiveOrders from '@/components/orders/active-orders';

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
  { command: "send 500 eur to john", description: "Start a new payment" },
  { command: "transfer €1000 to alice", description: "Make a transfer in EUR" },
  { command: "pay $500 to bob", description: "Make a payment in USD" },
  { command: "what's the EUR/USD rate?", description: "Check forex rates" },
  { command: "show my last 5 transactions", description: "View recent activity" },
  { command: "buy 100 eur with usd", description: "Exchange currency" },
  { command: "set market alert when EUR/USD > 1.10", description: "Set rate alert" },
  { command: "show me my pending orders", description: "View forex orders" }
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
    // Check if there are any URL parameters that might indicate we should switch to bottom input
    const hasSearchParam = window.location.search.length > 1;
    
    // Add empty welcome message for state management, but don't display it
    // until the user sends their first message
    setMessages([
      {
        text: "Welcome! I'm your finance assistant. How can I help you today?",
        sender: 'system',
        timestamp: new Date().toISOString(),
        status: 'completed'
      }
    ]);
    
    // If there are URL parameters, mark user as having sent a message
    // and switch to bottom input
    if (hasSearchParam) {
      setHasUserSentMessage(true);
      setShowCenteredInput(false);
    }
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

  const handleShowRates = () => {
    setMessages(prev => [...prev, {
      text: "Here are the current forex rates:",
      sender: 'system',
      timestamp: new Date().toISOString(),
      status: 'completed',
      action: {
        type: 'SHOW_RATES',
        data: {
          rates: [
            { pair: 'EUR/USD', rate: '1.0940', change: '+0.0012' },
            { pair: 'GBP/USD', rate: '1.2650', change: '-0.0008' },
            { pair: 'USD/JPY', rate: '151.40', change: '+0.2300' },
            { pair: 'AUD/USD', rate: '0.6580', change: '+0.0005' }
          ]
        }
      }
    }]);
  };
  
  const handleShowOrders = () => {
    setMessages(prev => [...prev, {
      text: "Here are your pending orders:",
      sender: 'system',
      timestamp: new Date().toISOString(),
      status: 'completed',
      action: {
        type: 'SHOW_ORDERS',
        data: {
          orders: [
            {
              id: 'ord-123456',
              description: 'Buy EUR/USD',
              amount: '10000',
              currency: 'USD',
              status: 'PENDING',
              type: 'LIMIT',
              rate: '1.0940'
            },
            {
              id: 'ord-123457',
              description: 'Sell GBP/USD',
              amount: '5000',
              currency: 'GBP',
              status: 'ACTIVE',
              type: 'STOP',
              rate: '1.2650'
            }
          ]
        }
      }
    }]);
  };

  const findMatchingCommand = (input: string): string | null => {
    const normalizedInput = input.toLowerCase().trim();
    
    // Payment intents
    if (normalizedInput === 'show payment intents' || normalizedInput === 'show my payment intents') {
      handleShowPaymentIntents();
      return 'show payment intents';
    }
    
    // Forex rates
    if (normalizedInput.includes('rate') || 
        (normalizedInput.includes('eur') && normalizedInput.includes('usd')) ||
        normalizedInput.includes('exchange rate')) {
      handleShowRates();
      return 'show rates';
    }
    
    // Forex orders
    if (normalizedInput.includes('pending order') || 
        normalizedInput.includes('my order') || 
        normalizedInput.includes('active order')) {
      handleShowOrders();
      return 'show orders';
    }
    
    return null;
  };

  // Function to scroll to bottom of chat
  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100); // Small delay to ensure DOM is updated
  };

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processMessage = async (messageText: string) => {
    try {
      // Don't process empty messages
      if (!messageText.trim()) return;
      
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
          console.log('Payment intent result:', result);
          // Extract payment_id from result or from top-level field
          const paymentId = result.payment_id || processedIntent.payment_id || result.id || '';
          
          actionData = {
            intent: {
              payment_id: paymentId,
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
          console.log('Currency exchange result:', result);
          // Extract payment_id from result or from top-level field
          const paymentId = result.payment_id || processedIntent.payment_id || result.id || '';
          
          actionType = 'CURRENCY_EXCHANGE';
          actionData = {
            intent: {
              payment_id: paymentId,
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
      // If there's an initial message from URL, mark that the user has sent a message
      setHasUserSentMessage(true);
      // Also hide the centered input right away
      setShowCenteredInput(false);
      // Process the message
      processMessage(initialMessage);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    // Store the input and immediately clear it for better UX
    const messageText = input;
    setInput('');
    
    // Set loading state
    setIsLoading(true);
    
    // Mark that user has sent at least one message
    setHasUserSentMessage(true);
    
    try {
      await processMessage(messageText);
      
      // Always switch to bottom input after the first message is processed
      if (showCenteredInput) {
        switchToBottomInput();
      }
    } catch (error) {
      console.error('Error processing message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = (paymentId: string) => {
    console.log('Payment confirmed:', paymentId);
    
    // Update the message status in the messages array
    setMessages(prev => {
      return prev.map(msg => {
        if (msg.action?.data?.intent?.payment_id === paymentId) {
          // Create a deep copy to avoid modifying existing state directly
          const updatedMsg = { ...msg };
          
          if (updatedMsg.action && updatedMsg.action.data && updatedMsg.action.data.intent && updatedMsg.action.data.intent.details) {
            updatedMsg.action.data.intent.details.status = 'completed';
          }
          
          return updatedMsg;
        }
        return msg;
      });
    });
    
    // Add a confirmation message
    setMessages(prev => [...prev, {
      text: "Your payment has been confirmed successfully!",
      sender: 'system',
      timestamp: new Date().toISOString(),
      status: 'completed'
    }]);
  };

  const handleModify = (paymentId: string) => {
    console.log('Payment modification requested:', paymentId);
    // Implement payment modification if needed
  };

  const handleCancel = (paymentId: string) => {
    console.log('Payment cancelled:', paymentId);
    
    // Update the message status in the messages array
    setMessages(prev => {
      return prev.map(msg => {
        if (msg.action?.data?.intent?.payment_id === paymentId) {
          // Create a deep copy to avoid modifying existing state directly
          const updatedMsg = { ...msg };
          
          if (updatedMsg.action && updatedMsg.action.data && updatedMsg.action.data.intent && updatedMsg.action.data.intent.details) {
            updatedMsg.action.data.intent.details.status = 'rejected';
          }
          
          return updatedMsg;
        }
        return msg;
      });
    });
    
    // Add a rejection message
    setMessages(prev => [...prev, {
      text: "Your payment has been cancelled.",
      sender: 'system',
      timestamp: new Date().toISOString(),
      status: 'completed'
    }]);
  };

  const [showMarketPanel, setShowMarketPanel] = useState(false); // Hide market panel by default
  const [showCenteredInput, setShowCenteredInput] = useState(true);
  const [hasUserSentMessage, setHasUserSentMessage] = useState(false);
  
  // Function to switch from centered to bottom input
  const switchToBottomInput = () => {
    // Always hide the centered input when this is called
    setShowCenteredInput(false);
  };
  
  return (
    <main className="flex flex-col min-h-screen">
      <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between">
        <div className="text-lg font-medium">Sendr</div>
        <div className="flex space-x-4">
          <button 
            onClick={() => setShowMarketPanel(!showMarketPanel)}
            className="flex items-center gap-1 hover:text-blue-400 transition-colors text-sm"
          >
            <TrendingUp size={16} />
            <span>{showMarketPanel ? 'Hide' : 'Show'} Markets</span>
          </button>
        </div>
      </div>

      <AccountOverview />
      
      {showMarketPanel && (
        <div className="bg-slate-50 p-4 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-3">
                <TrendingUp size={16} />
                <span>Market Rates</span>
              </h3>
              <MarketChart />
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-3">
                <Clock size={16} />
                <span>Active Orders</span>
              </h3>
              <ActiveOrders />
            </div>
          </div>
        </div>
      )}

      <div
        className="flex-1 overflow-y-auto"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E1 #F1F5F9'
        }}
      >
        {/* Only show messages if user has sent at least one message */}
        {hasUserSentMessage && (
          <div className="p-4 space-y-4">
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
                      } ${!message.isLoading && 'p-4'} rounded-lg max-w-[80%] shadow-sm`}
                  >
                    <div className={`break-words ${message.isLoading ? 'text-gray-500' : ''}`}>
                      {message.text}
                      {message.isLoading && <LoadingDots />}
                    </div>
                    
                    {!message.isLoading && message.timestamp && (
                      <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                    
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
              <div ref={messagesEndRef} className="h-1" />
            </div>
          </div>
        )}
        
        {/* Centered input - always shown until user sends a message */}
        {showCenteredInput && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full max-w-2xl px-4 pointer-events-auto">
              <form onSubmit={(e) => {
                handleSubmit(e);
                // Don't call switchToBottomInput() here - we'll let the submit handler control this
              }} className="flex flex-col items-center gap-6">
                <div className="text-center mb-2">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">How can I help with your finances?</h2>
                  <p className="text-gray-500">Ask about payments, transfers, exchange rates, or market orders</p>
                </div>
                
                <div className="flex w-full items-center gap-2 shadow-lg rounded-lg border border-gray-200 bg-white p-1">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      // Don't switch to bottom on change
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                        // Don't switch to bottom input here
                      }
                    }}
                    onFocus={() => {
                      // Don't switch to bottom on focus
                    }}
                    placeholder="Ask about payments, transfers, beneficiaries, or transactions..."
                    className="flex-1 rounded-lg border-0 px-4 py-3 focus:outline-none focus:ring-0"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className={`${
                      isLoading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : input.trim() 
                          ? 'bg-blue-500 hover:bg-blue-600' 
                          : 'bg-blue-400 cursor-not-allowed'
                    } text-white rounded-lg p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    disabled={isLoading || !input.trim()}
                  >
                    {isLoading ? 
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : 
                      <Send size={20} />
                    }
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center">
                  {DEMO_COMMANDS.slice(0, 5).map(({ command }) => (
                    <span 
                      key={command}
                      className="bg-gray-100 px-2.5 py-1.5 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => {
                        setInput(command);
                        // No switching to bottom input
                        // Focus the input field
                        const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
                        if (inputElement) inputElement.focus();
                      }}
                    >
                      {command}
                    </span>
                  ))}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Bottom input - only shown after user has sent a message and centered input is hidden */}
      {hasUserSentMessage && !showCenteredInput && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              switchToBottomInput();
            }}
            onKeyDown={(e) => {
              switchToBottomInput();
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            onFocus={() => switchToBottomInput()}
            placeholder="Ask about payments, transfers, beneficiaries, or transactions..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : input.trim() 
                  ? 'bg-blue-500 hover:bg-blue-600' 
                  : 'bg-blue-400 cursor-not-allowed'
            } text-white rounded-lg p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Send size={20} />}
          </button>
        </form>
        <div className="mt-2 text-xs text-gray-500 flex flex-wrap gap-2">
          <span>Try:</span>
          {DEMO_COMMANDS.slice(0, 5).map(({ command }) => (
            <span 
              key={command}
              className="bg-gray-100 px-1.5 py-0.5 rounded cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => {
                setInput(command);
                switchToBottomInput();
                // Focus the input field
                const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
                if (inputElement) inputElement.focus();
              }}
            >
              {command}
            </span>
          ))}
          <button 
            className="text-blue-500 hover:underline"
            onClick={() => {
              // Show more suggestions as a system message
              setMessages(prev => [...prev, {
                text: "Here are some things you can ask me:",
                sender: 'system',
                timestamp: new Date().toISOString(),
                status: 'completed'
              }, {
                text: DEMO_COMMANDS.map(c => `• ${c.command} - ${c.description}`).join('\n'),
                sender: 'system',
                timestamp: new Date().toISOString(),
                status: 'completed'
              }]);
              switchToBottomInput();
              setTimeout(scrollToBottom, 100);
            }}
          >
            More options
          </button>
        </div>
      </div>
      )}

      <BottomNav />
    </main>
  );
}
