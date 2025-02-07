'use client';

import { useState, useEffect } from 'react';
import { Payment } from '@/types/api/payment';
import api from '@/lib/api';

export default function ActivePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const response = await api.payments.list({
          status: 'active'
        });
        setPayments(response.data);
      } catch (error) {
        console.error('Failed to load payments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPayments();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h2 className="font-semibold">Active Payments</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="card h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Active Payments</h2>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No active payments</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="card space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{payment.description}</p>
                  <p className="text-sm text-gray-500">
                    Amount: {payment.amount} {payment.currency}
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full text-sm" 
                  style={{ 
                    backgroundColor: payment.status === 'COMPLETED' ? '#dcfce7' : '#fee2e2',
                    color: payment.status === 'COMPLETED' ? '#166534' : '#991b1b'
                  }}>
                  {payment.status}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Beneficiary: {payment.beneficiary.name}</span>
                  <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
