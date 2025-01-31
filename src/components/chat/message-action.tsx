'use client';

import { Check, X, Edit2 } from 'lucide-react';
import { ActionData } from '@/types/chat';

interface MessageActionProps {
  action: ActionData;
  onConfirm?: () => void;
  onModify?: () => void;
  onCancel?: () => void;
}

export default function MessageAction({ action, onConfirm, onModify, onCancel }: MessageActionProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const renderIntentAnalysis = () => {
    const intent = action.data.intent;
    if (!intent) return null;

    const exchangeRate = intent.context.marketRates[`${intent.details.sourceCurrency}${intent.details.targetCurrency}`];
    const targetAmount = intent.details.amount * exchangeRate.rate;
    const fees = action.data.fees || {
      estimatedTotal: intent.details.amount * 0.005, // 0.5% default fee
      breakdown: {
        exchangeFee: intent.details.amount * 0.003,
        networkFee: intent.details.amount * 0.001,
        processingFee: intent.details.amount * 0.001
      }
    };
    const totalAmount = intent.details.amount + fees.estimatedTotal;

    return (
      <div className="mt-4 space-y-4">
        <div className="bg-slate-800 text-white p-4 rounded-lg space-y-3">
          <h3 className="font-semibold">Payment Intent Analysis</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-400">Type:</span>
              <span className="ml-2">{intent.type}</span>
            </div>
            <div>
              <span className="text-gray-400">Send Amount:</span>
              <span className="ml-2">{formatCurrency(intent.details.amount, intent.details.sourceCurrency)}</span>
            </div>
            <div>
              <span className="text-gray-400">Exchange Rate:</span>
              <span className="ml-2">1 {intent.details.sourceCurrency} = {exchangeRate.rate.toFixed(4)} {intent.details.targetCurrency}</span>
            </div>
            <div>
              <span className="text-gray-400">Receive Amount:</span>
              <span className="ml-2">{formatCurrency(targetAmount, intent.details.targetCurrency)}</span>
            </div>
            <div className="col-span-2 pt-2 border-t border-gray-700">
              <div className="text-gray-400 mb-1">Fees:</div>
              <div className="pl-4 text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Exchange Fee:</span>
                  <span>{formatCurrency(fees.breakdown.exchangeFee, intent.details.sourceCurrency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Network Fee:</span>
                  <span>{formatCurrency(fees.breakdown.networkFee, intent.details.sourceCurrency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span>{formatCurrency(fees.breakdown.processingFee, intent.details.sourceCurrency)}</span>
                </div>
              </div>
            </div>
            <div className="col-span-2 pt-2 border-t border-gray-700">
              <div className="flex justify-between font-medium">
                <span>Total to Pay:</span>
                <span>{formatCurrency(totalAmount, intent.details.sourceCurrency)}</span>
              </div>
            </div>
          </div>
        </div>
        {action.options && (
          <div className="flex gap-2">
            {action.options.confirm && (
              <button
                onClick={onConfirm}
                className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <Check size={16} />
                Confirm
              </button>
            )}
            {action.options.modify && (
              <button
                onClick={onModify}
                className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Edit2 size={16} />
                Modify
              </button>
            )}
            {action.options.cancel && (
              <button
                onClick={onCancel}
                className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <X size={16} />
                Cancel
              </button>
            )}
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
