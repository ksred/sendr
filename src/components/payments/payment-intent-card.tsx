import { PaymentIntent } from '@/types/api/payment-intent';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface PaymentIntentCardProps {
  intent: PaymentIntent;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-500';
    case 'pending':
      return 'bg-yellow-500';
    case 'error':
    case 'failed':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function PaymentIntentCard({ intent }: PaymentIntentCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const hasExchangeInfo = intent.exchangeRate !== "0" && intent.fromCurrency && intent.toCurrency;
  const hasFees = intent.fee !== "0";

  return (
    <div className="w-full mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-row items-center justify-between p-4 pb-2">
        <div className="flex flex-col">
          <div className="text-xl font-bold">
            {intent.currency} {intent.amount}
          </div>
          <div className="text-sm text-gray-500">
            {formatDate(intent.CreatedAt)}
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-sm font-medium text-white ${getStatusColor(intent.status)}`}>
          {intent.status}
        </span>
      </div>
      <div className="p-4 pt-2">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">To:</span>
            <span className="font-medium">{intent.beneficiaryName}</span>
          </div>
          
          {hasExchangeInfo && (
            <div className="flex justify-between">
              <span className="text-gray-600">Exchange:</span>
              <span className="font-medium">
                {intent.fromCurrency} → {intent.toCurrency} @ {intent.exchangeRate}
              </span>
            </div>
          )}

          {hasFees && (
            <div className="flex justify-between">
              <span className="text-gray-600">Fee:</span>
              <span className="font-medium">{intent.currency} {intent.fee}</span>
            </div>
          )}

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            {isOpen ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show more
              </>
            )}
          </button>
          
          {isOpen && (
            <div className="space-y-2 mt-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-mono text-sm">{intent.paymentId}</span>
              </div>
              {intent.errorDetails && (
                <div className="flex justify-between text-red-600">
                  <span>Error:</span>
                  <span>{intent.errorDetails}</span>
                </div>
              )}
              {intent.suggestions && intent.suggestions.length > 0 && (
                <div className="mt-2">
                  <span className="text-gray-600">Suggestions:</span>
                  <ul className="list-disc list-inside mt-1">
                    {intent.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {suggestion.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
