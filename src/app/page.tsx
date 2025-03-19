'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Check if user is authenticated
    if (auth.isAuthenticated()) {
      // Redirect to chat page
      console.log('User is authenticated, redirecting to chat from root page');
      router.push('/chat');
    }
  }, [router]);
  
  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Welcome to Sendr</h1>
        <p className="text-gray-600 mb-8">
          Your smart assistant for forex trading, international payments, and currency exchange.
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/login"
            className="block w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
          
          <Link 
            href="/register"
            className="block w-full bg-gray-100 text-gray-800 rounded-lg px-4 py-3 font-medium hover:bg-gray-200 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    </main>
  );
}
