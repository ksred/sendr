import { useState } from 'react';
import { PaymentIntent } from '@/types/payment';
import api from '@/lib/api';

export type Status = 'idle' | 'loading' | 'success' | 'error';

interface UsePaymentStatusReturn {
  status: Status;
  errorMessage: string | null;
  handleConfirm: (paymentId: string) => Promise<void>;
  handleReject: (paymentId: string, onSuccess?: () => void) => Promise<void>;
  getStatusStyles: () => string;
}

export function usePaymentStatus(onConfirmSuccess?: () => void): UsePaymentStatusReturn {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirm = async (paymentId: string) => {
    setStatus('loading');
    setErrorMessage(null);
    try {
      await api.paymentIntents.confirm(paymentId);
      setStatus('success');
      onConfirmSuccess?.();
    } catch (error: any) {
      console.error('Failed to confirm payment intent:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Failed to confirm payment. Please try again.');
    }
  };

  const handleReject = async (paymentId: string, onSuccess?: () => void) => {
    setStatus('loading');
    setErrorMessage(null);
    try {
      const response = await api.paymentIntents.reject(paymentId);
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
