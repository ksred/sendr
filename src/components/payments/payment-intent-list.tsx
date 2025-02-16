import { PaymentIntent } from '@/types/api/payment-intent';
import { PaymentIntentCard } from './payment-intent-card';

interface PaymentIntentListProps {
  intents: PaymentIntent[];
  className?: string;
}

export function PaymentIntentList({ intents, className = '' }: PaymentIntentListProps) {
  if (!intents || intents.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No payment intents found
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {intents.map((intent) => (
        <PaymentIntentCard key={intent.paymentId} intent={intent} />
      ))}
    </div>
  );
}
