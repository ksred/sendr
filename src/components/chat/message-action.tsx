'use client';

import { ActionData } from '@/types/chat';
import { PaymentAction } from './actions/payment-action';
import { TransactionList } from './actions/transaction-list';
import { BeneficiaryForm } from './actions/beneficiary-form';

interface MessageActionProps {
  action: ActionData;
  onConfirm?: () => void;
  onModify?: () => void;
  onCancel?: () => void;
}

export default function MessageAction({ action, onConfirm, onModify, onCancel }: MessageActionProps) {
  const renderActionContent = () => {
    switch (action.type) {
      case 'PAYMENT_INITIATION':
      case 'PAYMENT_CONFIRMATION':
        if (!action.data.intent) return null;
        return (
          <PaymentAction
            intent={action.data.intent}
            onConfirm={onConfirm}
            onCancel={onCancel}
          />
        );

      case 'TRANSACTION_LIST':
        if (!action.data.transactions) return null;
        return (
          <TransactionList
            transactions={action.data.transactions}
            onSelect={(transaction) => {
              // Handle transaction selection
              console.log('Selected transaction:', transaction);
            }}
          />
        );

      case 'BENEFICIARY_ADD':
      case 'BENEFICIARY_EDIT':
        return (
          <BeneficiaryForm
            beneficiary={action.data.beneficiary}
            onSubmit={async (beneficiary) => {
              // Handle beneficiary save
              console.log('Save beneficiary:', beneficiary);
              onConfirm?.();
            }}
            onCancel={onCancel}
          />
        );

      default:
        return null;
    }
  };

  return renderActionContent();
}
