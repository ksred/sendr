'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AccountOverview from '@/components/account/account-overview';
import BottomNav from '@/components/navigation/bottom-nav';
import MessageAction from '@/components/chat/message-action';
import LoadingDots from '@/components/ui/loading-dots';
import { Send, Info, ArrowLeft } from 'lucide-react';
import { Message } from '@/types/chat';
import api from '@/lib/api';

export default function ChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const initialMessage = searchParams.get('message');
    if (initialMessage) {
      processMessage(initialMessage);
    }
  }, [searchParams]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processMessage = async (text: string) => {
    try {
      setIsProcessing(true);
      setErrorMessage(null);

      // Add user message
      setMessages(prev => [...prev, {
        text,
        sender: 'user',
        timestamp: new Date().toISOString(),
        status: 'completed'
      }]);

      // Add system processing message
      setMessages(prev => [...prev, {
        text: 'Processing your request...',
        sender: 'system',
        timestamp: new Date().toISOString(),
        status: 'loading'
      }]);

      // Call API to process payment intent
      const intent = await api.paymentIntents.create(text);

      // Update system message with result
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.sender === 'system') {
          lastMessage.text = "I'll help you with that payment. Here's what I understand:";
          lastMessage.status = 'completed';
          lastMessage.action = {
            type: 'PAYMENT_INITIATION',
            data: {
              intent,
              fees: intent.context.fees
            }
          };
        }
        return newMessages;
      });

    } catch (error: any) {
      console.error('Error processing message:', error);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.sender === 'system') {
          lastMessage.text = `Sorry, I encountered an error: ${error.message}`;
          lastMessage.status = 'error';
        }
        return newMessages;
      });
      setErrorMessage(error.message);
    } finally {
      setIsProcessing(false);
      setInputValue('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;
    await processMessage(inputValue.trim());
  };

  const handleConfirmPayment = async (intent: any) => {
    try {
      setIsProcessing(true);
      const result = await api.paymentIntents.confirm(intent.id);

      setMessages(prev => [...prev, {
        text: 'Payment confirmed! Processing your transaction...',
        sender: 'system',
        timestamp: new Date().toISOString(),
        status: 'completed',
        action: {
          type: 'PAYMENT_CONFIRMATION',
          data: {
            intent: result,
            progress: 0
          }
        }
      }]);

    } catch (error: any) {
      setMessages(prev => [...prev, {
        text: `Sorry, I couldn't confirm the payment: ${error.message}`,
        sender: 'system',
        timestamp: new Date().toISOString(),
        status: 'error'
      }]);
      setErrorMessage(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectPayment = async (intent: any) => {
    try {
      setIsProcessing(true);
      await api.paymentIntents.reject(intent.id);

      setMessages(prev => [...prev, {
        text: 'Payment cancelled.',
        sender: 'system',
        timestamp: new Date().toISOString(),
        status: 'completed',
        action: {
          type: 'CANCELLATION',
          data: {
            intent
          }
        }
      }]);

    } catch (error: any) {
      setMessages(prev => [...prev, {
        text: `Sorry, I couldn't cancel the payment: ${error.message}`,
        sender: 'system',
        timestamp: new Date().toISOString(),
        status: 'error'
      }]);
      setErrorMessage(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold">Send Money</h1>
          <button
            onClick={() => router.push('/help')}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <Info className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Account Overview */}
      <div className="border-b bg-white px-4 py-3">
        <AccountOverview />
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <MessageAction
                key={index}
                message={message}
                onConfirm={handleConfirmPayment}
                onReject={handleRejectPayment}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-white px-4 py-3">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="flex space-x-4">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isProcessing}
            />
            <button
              type="submit"
              disabled={isProcessing || !inputValue.trim()}
              className="flex items-center space-x-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
            >
              {isProcessing ? (
                <LoadingDots />
              ) : (
                <>
                  <span>Send</span>
                  <Send className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
          {errorMessage && (
            <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
          )}
        </form>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
