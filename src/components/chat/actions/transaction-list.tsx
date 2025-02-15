import { Transaction } from '@/types/chat';
import { formatCurrency } from '@/lib/utils/format';

interface TransactionListProps {
  transactions: Transaction[];
  onSelect?: (transaction: Transaction) => void;
}

export function TransactionList({ transactions, onSelect }: TransactionListProps) {
  return (
    <div className="mt-4 space-y-4">
      <div className="bg-slate-800 text-white p-4 rounded-lg">
        <h3 className="font-semibold mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <button
              key={transaction.id}
              onClick={() => onSelect?.(transaction)}
              className="w-full text-left p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{transaction.beneficiary.name}</div>
                  <div className="text-sm text-gray-400">{transaction.date}</div>
                </div>
                <div className="text-right">
                  <div className={transaction.type === 'send' ? 'text-red-400' : 'text-green-400'}>
                    {transaction.type === 'send' ? '-' : '+'}{formatCurrency(transaction.amount, transaction.currency)}
                  </div>
                  <div className="text-sm text-gray-400">{transaction.status}</div>
                </div>
              </div>
              {transaction.description && (
                <div className="mt-2 text-sm text-gray-400">{transaction.description}</div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
