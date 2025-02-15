import { useState } from 'react';
import { PaymentIntent } from '@/types/payment';
import api from '@/lib/api';

export type Status = 'idle' | 'loading' | 'success' | 'error';

interface UsePaymentStatusReturn {
  status: Status;
  errorMessage: string | null;
  handleConfirm: (intent: PaymentIntent) => Promise<void>;
  handleReject: (intent: PaymentIntent, onSuccess?: () => void) => Promise<void>;
  getStatusStyles: () => string;
}

export function usePaymentStatus(onConfirmSuccess?: () => void): UsePaymentStatusReturn {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirm = async (intent: PaymentIntent) => {
    if (!intent?.payment_id) return;
    
    setStatus('loading');
    setErrorMessage(null);
    try {
      const response = await api.paymentIntents.confirm(intent.payment_id);
      intent.status = response.status; // Update the intent status
      setStatus('success');
      onConfirmSuccess?.();
    } catch (error: any) {
      console.error('Failed to confirm payment intent:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Failed to confirm payment. Please try again.');
    }
  };

  const handleReject = async (intent: PaymentIntent, onSuccess?: () => void) => {
    if (!intent?.payment_id) return;

    setStatus('loading');
    setErrorMessage(null);
    try {
      const response = await api.paymentIntents.reject(intent.payment_id);
      intent.status = response.status; // Update the intent status
      setStatus('success');
      onSuccess?.();
    } catch (error: any) {
      console.error('Failed to cancel payment intent:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Failed to cancel payment. Please try again.');
    }
  };

  const getStatusStyles = () => {
    switch (status) {
      case 'loading':
        return 'opacity-50';
      case 'success':
        return 'border border-green-400/30';
      case 'error':
        return 'border border-red-400/30';
      default:
        return '';
    }
  };

  return {
    status,
    errorMessage,
    handleConfirm,
    handleReject,
    getStatusStyles,
  };
}
