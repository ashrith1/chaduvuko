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
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 40, 30]);
    }

    confetti({
      particleCount: 50,
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
      <div className="bg-zinc-900 border-t sm:border border-zinc-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">End & Complete Task</h3>
              <p className="text-[11px] text-zinc-400">Record completed questions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 p-1.5 rounded-lg hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Task Summary */}
        <div className="p-4 space-y-3.5">
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400 mb-0.5">
              <span>{target.subject}</span>
              {target.chapterName && <span>• {target.chapterName}</span>}
              {target.exercise && <span>• {target.exercise}</span>}
            </div>
            <p className="text-xs text-zinc-200 font-medium">
              {target.task}
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-2">
              Questions completed:
            </label>

            {/* Options */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCompletionType('all')}
                className={`p-3 rounded-xl border text-left transition active:scale-95 flex flex-col justify-between ${
                  completionType === 'all'
                    ? 'bg-zinc-800 border-zinc-600 text-zinc-100 font-medium'
                    : 'bg-zinc-950/50 border-zinc-850 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-semibold">All Questions</span>
                  {completionType === 'all' && (
                    <span className="w-4 h-4 rounded-full bg-zinc-100 text-zinc-900 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-zinc-400 mt-1">
                  Finished whole set or exercise
                </p>
              </button>

              <button
                type="button"
                onClick={() => setCompletionType('custom')}
                className={`p-3 rounded-xl border text-left transition active:scale-95 flex flex-col justify-between ${
                  completionType === 'custom'
                    ? 'bg-zinc-800 border-zinc-600 text-zinc-100 font-medium'
                    : 'bg-zinc-950/50 border-zinc-850 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-semibold">Custom Number</span>
                  {completionType === 'custom' && (
                    <span className="w-4 h-4 rounded-full bg-zinc-100 text-zinc-900 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-zinc-400 mt-1">
                  Enter exact count solved
                </p>
              </button>
            </div>
          </div>

          {/* Custom Number Input */}
          {completionType === 'custom' && (
            <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-3 space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">Questions Solved:</span>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={customCount}
                  onChange={(e) => setCustomCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-16 bg-zinc-900 border border-zinc-750 rounded-lg px-2 py-1 text-center text-xs font-semibold text-zinc-100 focus:outline-none focus:border-zinc-500"
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-1.5">
                {[3, 5, 8, 10, 15, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCustomCount(num)}
                    className={`flex-1 py-1 rounded-md text-xs font-medium border transition ${
                      customCount === num
                        ? 'bg-zinc-100 text-zinc-900 border-white font-semibold'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 pb-safe">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs text-zinc-400 hover:text-zinc-200 transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-900 rounded-xl text-xs font-semibold shadow-sm flex items-center justify-center gap-1.5 active:scale-95 transition"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm Completion</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
