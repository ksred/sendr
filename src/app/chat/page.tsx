'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AccountOverview from '@/components/account/account-overview';
import BottomNav from '@/components/navigation/bottom-nav';
import { Send } from 'lucide-react';

interface Message {
  text: string;
  sender: 'user' | 'system';
  timestamp: string;
}

export default function ChatPage() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const initialMessage = searchParams.get('message');
    if (initialMessage) {
      setMessages([
        {
          text: initialMessage,
          sender: 'user',
          timestamp: new Date().toISOString(),
        },
      ]);
      
      // Show loading state
      setIsLoading(true);
      
      // Simulate system response after 3 seconds
      setTimeout(() => {
        setIsLoading(false);
        setMessages(prev => [...prev, {
          text: "Thank you for your message. I'm processing your request.",
          sender: 'system',
          timestamp: new Date().toISOString(),
        }]);
      }, 3000);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    setMessages(prev => [...prev, {
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
    }]);

    // Clear input
    setNewMessage('');
    
    // Show loading state
    setIsLoading(true);

    // Simulate system response with 3 second delay
    setTimeout(() => {
      setIsLoading(false);
      setMessages(prev => [...prev, {
        text: "I've received your message and I'm processing it.",
        sender: 'system',
        timestamp: new Date().toISOString(),
      }]);
    }, 3000);
  };

  return (
    <main className="flex flex-col min-h-screen pb-16">
      <AccountOverview />
      
      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-4 ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {message.text}
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
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
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
