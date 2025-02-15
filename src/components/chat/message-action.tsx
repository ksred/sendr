import React from 'react';
import { Message } from '@/types/chat';
import { ChatPaymentIntent } from '@/types/payment';
import { formatCurrency } from '@/lib/utils/format';

interface MessageActionProps {
  message: Message;
  onConfirm: (intent: ChatPaymentIntent) => void;
  onReject: (intent: ChatPaymentIntent) => void;
}

export function MessageAction({ message, onConfirm, onReject }: MessageActionProps) {
  if (!message.action) {
    return (
      <div className={`p-4 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-100'}`}>
        {message.text}
      </div>
    );
  }

  const { type, data } = message.action;
  const intent = data?.intent;

  if (!intent) return null;

  const renderPaymentDetails = () => (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Amount:</span>
        <span className="font-medium">{formatCurrency(parseFloat(intent.amount), intent.sourceCurrency)}</span>
      </div>
      {intent.sourceCurrency !== intent.targetCurrency && (
        <div className="flex justify-between">
          <span>Converted Amount:</span>
          <span className="font-medium">{formatCurrency(parseFloat(intent.amount), intent.targetCurrency)}</span>
        </div>
      )}
      <div className="flex justify-between">
        <span>Recipient:</span>
        <span className="font-medium">{intent.payee?.name}</span>
      </div>
      {intent.purpose && (
        <div className="flex justify-between">
          <span>Purpose:</span>
          <span className="font-medium">{intent.purpose}</span>
        </div>
      )}
    </div>
  );

  const renderActions = () => (
    <div className="flex justify-end space-x-2 mt-4">
      <button
        onClick={() => onReject(intent)}
        className="px-4 py-2 text-red-500 border border-red-500 rounded hover:bg-red-50"
      >
        Cancel
      </button>
      <button
        onClick={() => onConfirm(intent)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Confirm
      </button>
    </div>
  );

  return (
    <div className={`p-4 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-100'}`}>
      <div className="mb-2">{message.text}</div>
      {type === 'PAYMENT_INITIATION' && (
        <div className="bg-white rounded-lg p-4 mt-4">
          {renderPaymentDetails()}
          {renderActions()}
        </div>
      )}
      {type === 'PAYMENT_CONFIRMATION' && (
        <div className="bg-white rounded-lg p-4 mt-4">
          {renderPaymentDetails()}
          <div className="mt-4 text-center text-green-500">✓ Payment Confirmed</div>
        </div>
      )}
      {type === 'CANCELLATION' && (
        <div className="bg-white rounded-lg p-4 mt-4">
          {renderPaymentDetails()}
          <div className="mt-4 text-center text-red-500">Payment Cancelled</div>
        </div>
      )}
    </div>
  );
}
