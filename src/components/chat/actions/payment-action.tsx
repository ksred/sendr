import React from 'react';
import { ChatPaymentIntent } from '@/types/payment';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/format';
import { Check, X } from 'lucide-react';

interface PaymentActionProps {
  intent: ChatPaymentIntent;
  onConfirm: (intent: ChatPaymentIntent) => void;
  onReject: (intent: ChatPaymentIntent) => void;
}

export function PaymentAction({ intent, onConfirm, onReject }: PaymentActionProps) {
  const renderPaymentDetails = () => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Amount:</span>
        <span className="font-medium">
          {formatCurrency(parseFloat(intent.amount), intent.sourceCurrency)}
        </span>
      </div>

      {intent.sourceCurrency !== intent.targetCurrency && (
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Converted Amount:</span>
          <span className="font-medium">
            {formatCurrency(parseFloat(intent.amount), intent.targetCurrency)}
          </span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <span className="text-gray-600">Recipient:</span>
        <span className="font-medium">{intent.payee.name}</span>
      </div>

      {intent.payee.bankName && (
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Bank:</span>
          <span className="font-medium">{intent.payee.bankName}</span>
        </div>
      )}

      {intent.fees && (
        <>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Fees:</span>
            <span className="font-medium">
              {formatCurrency(parseFloat(intent.fees.total), intent.sourceCurrency)}
            </span>
          </div>

          {intent.fees.breakdown && (
            <div className="text-sm space-y-1">
              {intent.fees.breakdown.transfer && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Transfer Fee:</span>
                  <span>
                    {formatCurrency(parseFloat(intent.fees.breakdown.transfer), intent.sourceCurrency)}
                  </span>
                </div>
              )}
              {intent.fees.breakdown.exchange && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Exchange Fee:</span>
                  <span>
                    {formatCurrency(parseFloat(intent.fees.breakdown.exchange), intent.sourceCurrency)}
                  </span>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {intent.purpose && (
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Purpose:</span>
          <span className="font-medium">{intent.purpose}</span>
        </div>
      )}
    </div>
  );

  const renderActions = () => (
    <div className="flex justify-end space-x-2 mt-4">
      <Button
        onClick={() => onReject(intent)}
        variant="outline"
        className="flex items-center"
      >
        <X className="w-4 h-4 mr-2" />
        Cancel
      </Button>
      <Button
        onClick={() => onConfirm(intent)}
        variant="default"
        className="flex items-center"
      >
        <Check className="w-4 h-4 mr-2" />
        Confirm
      </Button>
    </div>
  );

  const renderStatus = () => {
    if (intent.status === 'processing') {
      return (
        <div className="mt-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '100%' }} />
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">Processing payment...</p>
        </div>
      );
    }

    if (intent.status === 'completed') {
      return (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-500 mb-2">
            <Check className="w-6 h-6" />
          </div>
          <p className="text-green-600">Payment completed successfully</p>
        </div>
      );
    }

    if (intent.status === 'failed') {
      return (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-500 mb-2">
            <X className="w-6 h-6" />
          </div>
          <p className="text-red-600">Payment failed</p>
          {intent.error && <p className="text-sm text-red-500 mt-1">{intent.error}</p>}
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
      {renderPaymentDetails()}
      {renderStatus()}
      {intent.status === 'draft' && renderActions()}
    </Card>
  );
}
