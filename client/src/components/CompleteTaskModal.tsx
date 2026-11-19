import React, { useState } from 'react';
import type { Target } from '../types';
import { X, CheckCircle2, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CompleteTaskModalProps {
  isOpen: boolean;
  target: Target | null;
  onClose: () => void;
  onConfirmComplete: (targetId: string, completedQuestionsType: 'all' | 'custom', count?: number) => void;
}

export const CompleteTaskModal: React.FC<CompleteTaskModalProps> = ({
  isOpen,
  target,
  onClose,
  onConfirmComplete
}) => {
  if (!isOpen || !target) return null;

  const [completionType, setCompletionType] = useState<'all' | 'custom'>('all');
  const [customCount, setCustomCount] = useState<number>(5);

  const handleConfirm = () => {
    // Android haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([40, 60, 40]);
    }

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });

    onConfirmComplete(
      target.id,
      completionType,
      completionType === 'custom' ? customCount : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-800/80 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">End & Complete Task</h3>
              <p className="text-[11px] text-slate-400">Log questions solved today</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 p-2 rounded-xl hover:bg-slate-800 transition active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task Summary */}
        <div className="p-4 sm:p-5 space-y-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-400 mb-1">
              <span>{target.subject}</span>
              {target.chapterName && <span>• {target.chapterName}</span>}
              {target.exercise && <span>• {target.exercise}</span>}
              {target.questionCategory && <span>• {target.questionCategory}</span>}
            </div>
            <p className="text-xs text-slate-200 font-medium leading-relaxed">
              {target.task}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              How many questions did you complete?
            </label>

            {/* Completion Options */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Option A: All Questions */}
              <button
                type="button"
                onClick={() => setCompletionType('all')}
                className={`p-3.5 rounded-2xl border text-left transition active:scale-95 flex flex-col justify-between ${
                  completionType === 'all'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold">All Questions</span>
                  {completionType === 'all' && (
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p className="text-[10px] opacity-75 mt-1 leading-tight">
                  Completed the entire set or exercise
                </p>
              </button>

              {/* Option B: Custom Number */}
              <button
                type="button"
                onClick={() => setCompletionType('custom')}
                className={`p-3.5 rounded-2xl border text-left transition active:scale-95 flex flex-col justify-between ${
                  completionType === 'custom'
                    ? 'bg-indigo-950/60 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-950/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold">Custom Number</span>
                  {completionType === 'custom' && (
                    <span className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p className="text-[10px] opacity-75 mt-1 leading-tight">
                  Enter exact count of questions solved
                </p>
              </button>
            </div>
          </div>

          {/* Custom Number Input & Quick Increments */}
          {completionType === 'custom' && (
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 space-y-2.5 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Questions Solved:</span>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={customCount}
                  onChange={(e) => setCustomCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-20 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-center text-sm font-bold text-slate-100 focus:outline-none focus:border-indigo-500"
                  autoFocus
                />
              </div>

              {/* Quick Pills */}
              <div className="flex items-center gap-1.5">
                {[3, 5, 8, 10, 15, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCustomCount(num)}
                    className={`flex-1 py-1 rounded-lg text-xs font-bold border transition ${
                      customCount === num
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 pb-safe">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & End Task</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
