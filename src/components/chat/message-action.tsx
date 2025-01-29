'use client';

import { Check, X, Edit2, ArrowRight } from 'lucide-react';
import { ActionData } from '@/types/chat';

interface MessageActionProps {
  action: ActionData;
  onConfirm?: () => void;
  onModify?: () => void;
  onCancel?: () => void;
}

export default function MessageAction({ action, onConfirm, onModify, onCancel }: MessageActionProps) {
  const renderIntentAnalysis = () => (
    <div className="mt-4 space-y-4">
      <div className="bg-slate-800 text-white p-4 rounded-lg space-y-2">
        <h3 className="font-semibold">Trade Intent Analysis</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-400">Goal:</span>
            <span className="ml-2">{action.data.intent?.goal}</span>
          </div>
          <div>
            <span className="text-gray-400">Amount:</span>
            <span className="ml-2">{action.data.intent?.constraints.amount}</span>
          </div>
          <div>
            <span className="text-gray-400">Risk:</span>
            <span className="ml-2">{action.data.intent?.constraints.riskTolerance}</span>
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

  const renderStrategy = () => (
    <div className="mt-4 space-y-4">
      <div className="bg-slate-800 text-white p-4 rounded-lg space-y-2">
        <h3 className="font-semibold">Execution Strategy</h3>
        <div className="space-y-2 text-sm">
          {action.data.strategy && (
            <>
              <div className="flex items-center gap-2">
                <ArrowRight size={16} className="text-blue-400" />
                <span>{action.data.strategy.description}</span>
              </div>
              <div className="pl-6 text-gray-400">
                Expected completion: {action.data.strategy.estimatedCompletion}
              </div>
            </>
          )}
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
              Execute
            </button>
          )}
          {action.options.modify && (
            <button
              onClick={onModify}
              className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Edit2 size={16} />
              Adjust
            </button>
          )}
        </div>
      )}
    </div>
  );

  const renderProgress = () => (
    <div className="mt-4 space-y-4">
      <div className="bg-slate-800 text-white p-4 rounded-lg space-y-2">
        <h3 className="font-semibold">Execution Progress</h3>
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
    case 'INTENT_ANALYSIS':
      return renderIntentAnalysis();
    case 'STRATEGY_CREATION':
      return renderStrategy();
    case 'EXECUTION':
    case 'MONITORING':
      return renderProgress();
    default:
      return null;
  }
}
