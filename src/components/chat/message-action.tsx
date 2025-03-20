'use client';

import { Check, Loader2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import api from '@/lib/api';
import { PaymentIntentList } from '@/components/payments/payment-intent-list';

import { ActionType, ActionData } from '@/types/chat';

interface MessageActionProps {
  action: {
    type: ActionType;
    data: ActionData;
  };
  onConfirm?: (paymentId: string) => void;
  onModify?: (paymentId: string) => void;
  onCancel?: (paymentId: string) => void;
  onProcessMessage?: (message: string) => void; // Function to process new messages
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function MessageAction({ action, onConfirm, onModify, onCancel, onProcessMessage }: MessageActionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // We'll keep action validation but remove excessive logging
  if (!action || !action.type) {
    return null;
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleConfirm = async () => {
    if (!action.data.intent?.payment_id) {
      setErrorMessage('Payment ID is missing, cannot confirm this payment');
      return;
    }

    setStatus('loading');
    setErrorMessage(null);
    try {
      await api.paymentIntents.confirm(action.data.intent.payment_id);
      
      // Update the local state with the confirmed status
      if (action.data.intent && action.data.intent.details) {
        action.data.intent.details.status = 'completed';
      }
      
      setStatus('success');
      onConfirm?.(action.data.intent.payment_id);
    } catch (error: any) {
      setStatus('error');
      if (error.name === 'ApiClientError') {
        // Use the formatted message from our ApiClientError
        setErrorMessage(error.getFormattedMessage?.() || error.message);
      } else {
        setErrorMessage(error.message || 'Failed to confirm payment. Please try again.');
      }
    }
  };

  const handleReject = async () => {
    if (!action.data.intent?.payment_id) {
      setErrorMessage('Payment ID is missing, cannot reject this payment');
      return;
    }

    setStatus('loading');
    setErrorMessage(null);
    try {
      await api.paymentIntents.reject(action.data.intent.payment_id);
      
      // Update the local state with the rejected status
      if (action.data.intent && action.data.intent.details) {
        action.data.intent.details.status = 'rejected';
      }
      
      setStatus('success');
      onCancel?.(action.data.intent.payment_id);
    } catch (error: any) {
      setStatus('error');
      if (error.name === 'ApiClientError') {
        // Use the formatted message from our ApiClientError
        setErrorMessage(error.getFormattedMessage?.() || error.message);
      } else {
        setErrorMessage(error.message || 'Failed to reject payment. Please try again.');
      }
    }
  };

  const renderIntentAnalysis = () => {
    const intent = action.data.intent;
    if (!intent || !intent.details) return null;

    // Use default values to prevent destructuring errors
    const {
      amount = '0',
      converted_amount = '0',
      from_currency = 'USD',
      to_currency = 'USD',
      exchange_rate = '1',
      fees = '0',
      total_cost = '0'
    } = intent.details || {};

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
        {status !== 'success' && (
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
        )}
        {status === 'success' && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span className="font-medium">
              {intent.details.status === 'rejected' 
                ? 'Payment rejected successfully' 
                : 'Payment confirmed successfully'}
            </span>
          </div>
        )}
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

  const renderBeneficiaries = () => {
    const beneficiaries = action.data.beneficiaries || [];
    return (
      <div className="mt-4 space-y-4">
        <div className="bg-slate-800 text-white p-4 rounded-lg space-y-4 w-full max-w-2xl mx-auto">
          <h3 className="font-semibold text-lg mb-2">Beneficiaries</h3>
          {beneficiaries.length === 0 ? (
            <p className="text-gray-400">No beneficiaries found.</p>
          ) : (
            <div className="grid gap-3 w-full">
              {beneficiaries.map((beneficiary, index) => (
                <div 
                  key={beneficiary.id || `beneficiary-${index}`} 
                  className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors"
                >
                  <div className="font-medium text-lg mb-2">{beneficiary.name || 'Unnamed Beneficiary'}</div>
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-300">
                      <span className="text-gray-400">Account:</span> {beneficiary.bank_info || 'No bank information'}
                    </div>
                    {beneficiary.currency && beneficiary.currency !== 'Unknown currency' && (
                      <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-900/50 text-blue-400">
                        {beneficiary.currency}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTransactions = () => {
    const transactions = action.data.transactions || [];
    
    return (
      <div className="mt-4 space-y-4">
        <div className="bg-slate-800 text-white p-4 rounded-lg space-y-4 w-full max-w-2xl mx-auto">
          <h3 className="font-semibold text-lg mb-2">Transactions</h3>
          {transactions.length === 0 ? (
            <p className="text-gray-400">No transactions found.</p>
          ) : (
            <div className="w-full">
              {transactions.map((transaction, index) => {
                return (
                  <div 
                    key={transaction.id || `transaction-${index}`} 
                    className="bg-slate-700 rounded-lg p-4 mb-3 hover:bg-slate-600 transition-colors"
                  >
                    <div className="flex flex-col mb-3">
                      <div className="font-medium text-base mb-1">
                        {transaction.beneficiary || 'Unknown recipient'}
                      </div>
                      <div className="font-bold text-lg text-green-400">
                        {formatCurrency(parseFloat(transaction.amount || '0'), transaction.currency || 'USD')}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="bg-slate-600 text-xs px-2 py-1 rounded-full">
                          {transaction.type ? transaction.type.toUpperCase() : 'PAYMENT'}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {transaction.date ? new Date(transaction.date).toLocaleDateString() : 'Unknown date'}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'completed' ? 'bg-green-900/50 text-green-400' : 
                        transaction.status === 'failed' ? 'bg-red-900/50 text-red-400' : 
                        'bg-yellow-900/50 text-yellow-400'
                      }`}>
                        {transaction.status 
                          ? transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)
                          : 'Unknown status'
                        }
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCurrencyExchange = () => {
    const intent = action.data.intent;
    if (!intent || !intent.details) return null;

    // Use default values to prevent destructuring errors
    const {
      amount = '0',
      converted_amount = '0',
      from_currency = 'USD',
      to_currency = 'USD',
      exchange_rate = '1',
      fees = '0',
      total_cost = '0'
    } = intent.details || {};

    return (
      <div className="mt-4 space-y-4">
        <div className="bg-slate-800 text-white p-4 rounded-lg space-y-3">
          <h3 className="font-semibold">Currency Exchange</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-400">Amount:</span>
              <span className="ml-2">{formatCurrency(parseFloat(amount), from_currency)}</span>
            </div>
            <div>
              <span className="text-gray-400">Exchange Rate:</span>
              <span className="ml-2">1 {from_currency} = {exchange_rate} {to_currency}</span>
            </div>
            <div>
              <span className="text-gray-400">Converted Amount:</span>
              <span className="ml-2">{formatCurrency(parseFloat(converted_amount), to_currency)}</span>
            </div>
            <div>
              <span className="text-gray-400">Fee:</span>
              <span className="ml-2">{formatCurrency(parseFloat(fees), from_currency)}</span>
            </div>
            <div className="col-span-2 pt-2 border-t border-gray-700">
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>{formatCurrency(parseFloat(total_cost), from_currency)}</span>
              </div>
            </div>
          </div>
        </div>
        {status !== 'success' && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleConfirm}
              disabled={status === 'loading' || status === 'success'}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                  <span>Processing...</span>
                </>
              ) : (
                'Confirm Exchange'
              )}
            </button>
            <button
              onClick={handleReject}
              disabled={status === 'loading' || status === 'success'}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                  <span>Processing...</span>
                </>
              ) : (
                'Cancel'
              )}
            </button>
          </div>
        )}
        {status === 'success' && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span className="font-medium">
              {action.data.intent?.details?.status === 'rejected' 
                ? 'Exchange cancelled successfully' 
                : 'Exchange confirmed successfully'}
            </span>
          </div>
        )}
        {errorMessage && status === 'error' && (
          <div className="mt-3 text-sm text-red-400 bg-red-400/10 p-2 rounded flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    );
  };

  const renderRates = () => {
    const rates = action.data.rates || [];
    return (
      <div className="mt-4 space-y-4">
        <div className="bg-slate-800 text-white p-4 rounded-lg space-y-4 w-full max-w-2xl mx-auto">
          <h3 className="font-semibold text-lg mb-2">Live Market Rates</h3>
          {rates.length === 0 ? (
            <p className="text-gray-400">No rates available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {rates.map((rate, index) => (
                <div 
                  key={rate.pair || `rate-${index}`} 
                  className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium text-lg">{rate.pair}</div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      rate.change.startsWith('+') 
                        ? 'bg-green-900/50 text-green-400' 
                        : 'bg-red-900/50 text-red-400'
                    }`}>
                      {rate.change}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {rate.rate}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderOrders = () => {
    const orders = action.data.orders || [];
    return (
      <div className="mt-4 space-y-4">
        <div className="bg-slate-800 text-white p-4 rounded-lg space-y-4 w-full max-w-2xl mx-auto">
          <h3 className="font-semibold text-lg mb-2">Active Forex Orders</h3>
          {orders.length === 0 ? (
            <p className="text-gray-400">No active orders.</p>
          ) : (
            <div className="grid gap-3 w-full">
              {orders.map((order, index) => (
                <div 
                  key={order.id || `order-${index}`} 
                  className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium text-lg">{order.description}</div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'COMPLETED' 
                        ? 'bg-green-900/50 text-green-400'
                        : order.status === 'FAILED'
                        ? 'bg-red-900/50 text-red-400'
                        : 'bg-blue-900/50 text-blue-400'
                    }`}>
                      {order.type} {order.status}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xl font-bold text-white">
                      {formatCurrency(parseFloat(order.amount), order.currency)}
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Rate:</span> {order.rate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMultipleBeneficiaries = () => {
    if (!action.data.multipleBeneficiaries) return null;
    
    const { amount, currency, beneficiaries } = action.data.multipleBeneficiaries;
    
    return (
      <div className="space-y-3 mt-3">
        {beneficiaries.map((beneficiary) => (
          <button
            key={beneficiary.id}
            className="w-full bg-white border border-gray-300 shadow-sm rounded-lg p-3 text-left hover:bg-blue-50 hover:border-blue-300 transition-colors"
            onClick={() => {
              // Create a formatted payment command with the selected beneficiary
              const paymentCommand = `pay ${beneficiary.name} ${amount} ${currency}`;
              
              // Submit the payment command via the parent component's handler
              if (onProcessMessage) {
                onProcessMessage(paymentCommand);
              } else {
                // Fallback if onProcessMessage is not provided
                alert(`Please type: ${paymentCommand}`);
              }
            }}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-gray-900">{beneficiary.name}</div>
                <div className="text-sm text-gray-500">{beneficiary.bankInfo}</div>
              </div>
              <div className="text-blue-600 font-medium">
                {amount} {currency}
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  };

  switch (action.type) {
    case 'PAYMENT_INITIATION':
    case 'ENTITY_EXTRACTION':
      return renderIntentAnalysis();
    case 'CURRENCY_EXCHANGE':
      return renderCurrencyExchange();
    case 'PROCESSING':
    case 'COMPLETED':
    case 'FAILED':
      return renderProgress();
    case 'MULTIPLE_BENEFICIARIES':
      return renderMultipleBeneficiaries();
    case 'UNKNOWN':
      // For unknown intent, render the formatted message with proper HTML
      if (!action.data.rawMessage) return null;
      
      // Extract example queries that are in quotes for making them clickable
      const extractQuotedText = (line) => {
        const matches = line.match(/"([^"]+)"/);
        return matches ? matches[1] : null;
      };
      
      return (
        <div className="mt-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
          {/* Split by newlines and create paragraphs for each line */}
          {action.data.rawMessage.split('\n').map((line, index) => {
            const quotedExample = extractQuotedText(line);
            
            return (
              <p key={index} className={line.trim() === '' ? 'h-4' : 'mb-2'}>
                {/* Handle bullet points with clickable examples */}
                {line.trim().startsWith('•') || line.trim().startsWith('-') ? (
                  <span className="flex">
                    <span className="text-blue-500 mr-2">
                      {line.trim().startsWith('•') ? '•' : '-'}
                    </span>
                    <span>
                      {quotedExample ? (
                        <>
                          {line.substring(0, line.indexOf('"'))}
                          <span 
                            className="text-blue-500 cursor-pointer hover:underline"
                            onClick={() => {
                              // Find the input field and set its value
                              const input = document.querySelector('input[type="text"]');
                              if (input) {
                                // Set the input value
                                input.value = quotedExample;
                                // Dispatch an input event to trigger React's onChange
                                const event = new Event('input', { bubbles: true });
                                input.dispatchEvent(event);
                                // Focus the input
                                input.focus();
                              }
                            }}
                          >
                            "{quotedExample}"
                          </span>
                          {line.substring(line.indexOf('"') + quotedExample.length + 2)}
                        </>
                      ) : (
                        line.trim().substring(1).trim()
                      )}
                    </span>
                  </span>
                ) : quotedExample ? (
                  // Handle lines with quotes but no bullet points
                  <>
                    {line.substring(0, line.indexOf('"'))}
                    <span 
                      className="text-blue-500 cursor-pointer hover:underline"
                      onClick={() => {
                        // Find the input field and set its value
                        const input = document.querySelector('input[type="text"]');
                        if (input) {
                          // Set the input value
                          input.value = quotedExample;
                          // Dispatch an input event to trigger React's onChange
                          const event = new Event('input', { bubbles: true });
                          input.dispatchEvent(event);
                          // Focus the input
                          input.focus();
                        }
                      }}
                    >
                      "{quotedExample}"
                    </span>
                    {line.substring(line.indexOf('"') + quotedExample.length + 2)}
                  </>
                ) : (
                  // Regular line
                  line
                )}
              </p>
            );
          })}
        </div>
      );
    case 'SHOW_PAYMENT_INTENTS':
      return (
        <div className="w-full max-w-2xl mx-auto">
          <PaymentIntentList intents={action.data.paymentIntents} />
        </div>
      );
    case 'SHOW_BENEFICIARIES':
      return renderBeneficiaries();
    case 'SHOW_TRANSACTIONS':
      return renderTransactions();
    case 'SHOW_RATES':
      return renderRates();
    case 'SHOW_ORDERS':
      return renderOrders();
    default:
      return null;
  }
}
