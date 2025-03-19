'use client';

import { useState, useEffect } from 'react';
import { Payment } from '@/types/api/payment';
import api from '@/lib/api';

export default function ActiveOrders() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock orders for forex trading
    const mockOrders = [
      {
        id: 'ord-123456',
        description: 'Buy EUR/USD',
        amount: '10000',
        currency: 'USD',
        status: 'PENDING',
        type: 'LIMIT',
        rate: '1.0940',
        beneficiary: { name: 'Trading Account' },
        createdAt: new Date().toISOString()
      },
      {
        id: 'ord-123457',
        description: 'Sell GBP/USD',
        amount: '5000',
        currency: 'GBP',
        status: 'ACTIVE',
        type: 'STOP',
        rate: '1.2650',
        beneficiary: { name: 'Trading Account' },
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
    
    // Simulate API call
    setTimeout(() => {
      setPayments(mockOrders as any);
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="animate-pulse space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {payments.length === 0 ? (
        <div className="text-center py-2 text-gray-500 text-sm">
          <p>No active orders</p>
        </div>
      ) : (
        <div className="space-y-2">
          {payments.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-md p-2 text-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{order.description}</p>
                  <p className="text-xs text-gray-500">
                    {order.amount} {order.currency} @ {order.rate}
                  </p>
                </div>
                <div className="px-2 py-0.5 rounded-full text-xs" 
                  style={{ 
                    backgroundColor: order.status === 'COMPLETED' ? '#dcfce7' : '#e0f2fe',
                    color: order.status === 'COMPLETED' ? '#166534' : '#0369a1'
                  }}>
                  {order.type} {order.status}
                </div>
              </div>
              
              <div className="text-xs text-gray-500 mt-1">
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
