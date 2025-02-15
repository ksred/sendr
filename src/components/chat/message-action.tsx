'use client';

import { Check, X, Edit2, Loader2, AlertCircle } from 'lucide-react';
import { ActionData } from '@/types/chat';
import { useState } from 'react';
import api, { ApiClientError } from '@/lib/api';
import { usePaymentStatus } from '@/hooks/usePaymentStatus';

interface MessageActionProps {
  action: ActionData;
  onConfirm?: () => void;
  onModify?: () => void;
  onCancel?: () => void;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function MessageAction({ action, onConfirm, onModify, onCancel }: MessageActionProps) {
  const {
    status,
    errorMessage,
    handleConfirm: confirmPayment,
    handleReject: rejectPayment,
    getStatusStyles
  } = usePaymentStatus(onConfirm);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleConfirm = async () => {
    if (!action.data.intent?.payment_id) return;
    await confirmPayment(action.data.intent.payment_id);
  };

  const handleReject = async () => {
    if (!action.data.intent?.payment_id) return;
    await rejectPayment(action.data.intent.payment_id, onCancel);
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
        <div className={`bg-slate-800 text-white p-4 rounded-lg space-y-3 relative transition-all duration-200 ${getStatusStyles()}`}>
          {status === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800/20 rounded-lg">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          )}
          <div className="flex items-center justify-between">
            <h3 className={`font-semibold ${status === 'success' ? 'text-gray-400' : 'text-white'}`}>Payment Details</h3>
            {status === 'success' && (
              <div className="flex items-center text-green-400 gap-1.5">
                <Check className="w-5 h-5" />
                <span className="text-green-400 font-medium">
                  {action.data.intent?.status === 'rejected' ? 'Payment Rejected' : 'Payment Confirmed'}
                </span>
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center text-red-400 gap-1.5">
                <AlertCircle className="w-5 h-5" />
                <span className="text-red-400 font-medium">Payment Failed</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className={`${status === 'success' ? 'text-gray-500' : 'text-gray-400'}`}>Send Amount:</span>
              <span className="ml-2">{formatCurrency(parseFloat(amount), from_currency)}</span>
            </div>
            {from_currency !== to_currency && (
              <>
                <div>
                  <span className={`${status === 'success' ? 'text-gray-500' : 'text-gray-400'}`}>Exchange Rate:</span>
                  <span className="ml-2">1 {from_currency} = {exchange_rate} {to_currency}</span>
                </div>
                <div>
                  <span className={`${status === 'success' ? 'text-gray-500' : 'text-gray-400'}`}>Receive Amount:</span>
                  <span className="ml-2">{formatCurrency(parseFloat(converted_amount), to_currency)}</span>
                </div>
              </>
            )}
            <div className="col-span-2 pt-2 border-t border-gray-700">
              <div className={`${status === 'success' ? 'text-gray-500' : 'text-gray-400'} mb-1`}>Fees:</div>
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
            disabled={status === 'loading' || status === 'success'}
            className={`flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 ${status === 'error' ? 'opacity-100 hover:bg-green-500' : ''}`}
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : status === 'error' ? (
              'Try Again'
            ) : (
              'Confirm'
            )}
          </button>
          {/* <button
            onClick={onModify}
            disabled={status === 'loading' || status === 'success'}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Modify
          </button> */}
          <button
            onClick={handleReject}
            disabled={status === 'loading' || status === 'success'}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              'Reject'
            )}
          </button>
        </div>
        {errorMessage && status === 'error' && (
          <div className="mt-3 text-sm text-red-400 bg-red-400/10 p-2 rounded flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
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
