'use client';

import { Check, X, Edit2 } from 'lucide-react';
import { ActionData } from '@/types/chat';
import { useState } from 'react';
import api from '@/lib/api';

interface MessageActionProps {
  action: ActionData;
  onConfirm?: () => void;
  onModify?: () => void;
  onCancel?: () => void;
}

export default function MessageAction({ action, onConfirm, onModify, onCancel }: MessageActionProps) {
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleConfirm = async () => {
    console.log('handleConfirm', action.data.intent);
    if (!action.data.intent?.payment_id) return;

    setIsLoading(true);
    try {
      await api.paymentIntents.confirm(action.data.intent.payment_id);
      onConfirm?.();
    } catch (error) {
      console.error('Failed to confirm payment intent:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!action.data.intent?.id) return;

    setIsLoading(true);
    try {
      await api.paymentIntents.cancel(action.data.intent.id);
      onCancel?.();
    } catch (error) {
      console.error('Failed to cancel payment intent:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderIntentAnalysis = () => {
    const intent = action.data.intent;
    if (!intent) return null;

    const {
      amount,
      converted_amount,
      from_currency,
      to_currency,
      exchange_rate,
      fees,
      total_cost
    } = intent.details;

    return (
      <div className="mt-4 space-y-4">
        <div className="bg-slate-800 text-white p-4 rounded-lg space-y-3">
          <h3 className="font-semibold">Payment Details</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-400">Send Amount:</span>
              <span className="ml-2">{formatCurrency(parseFloat(amount), from_currency)}</span>
            </div>
            {from_currency !== to_currency && (
              <>
                <div>
                  <span className="text-gray-400">Exchange Rate:</span>
                  <span className="ml-2">1 {from_currency} = {exchange_rate} {to_currency}</span>
                </div>
                <div>
                  <span className="text-gray-400">Receive Amount:</span>
                  <span className="ml-2">{formatCurrency(parseFloat(converted_amount), to_currency)}</span>
                </div>
              </>
            )}
            <div className="col-span-2 pt-2 border-t border-gray-700">
              <div className="text-gray-400 mb-1">Fees:</div>
              <div className="pl-4 text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Total Fees:</span>
                  <span>{formatCurrency(parseFloat(fees), from_currency)}</span>
                </div>
              </div>
            </div>
            <div className="col-span-2 pt-2 border-t border-gray-700">
              <div className="flex justify-between font-medium">
                <span>Total to Pay:</span>
                <span>{formatCurrency(parseFloat(total_cost), from_currency)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Confirm'}
          </button>
          <button
            onClick={onModify}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Modify
          </button>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Cancel'}
          </button>
        </div>
      </div>
    );
  };

  const renderProgress = () => (
    <div className="mt-4 space-y-4">
      <div className="bg-slate-800 text-white p-4 rounded-lg space-y-2">
        <h3 className="font-semibold">Payment Progress</h3>
        <div className="space-y-2">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${action.data.progress}%` }}
            />
          </div>
          <div className="text-sm text-gray-400">
            {action.data.progress}% Complete
          </div>
        </div>
      </div>
    </div>
  );

  switch (action.type) {
    case 'PAYMENT_INITIATION':
    case 'ENTITY_EXTRACTION':
      return renderIntentAnalysis();
    case 'PROCESSING':
    case 'COMPLETED':
    case 'FAILED':
      return renderProgress();
    default:
      return null;
  }
}
