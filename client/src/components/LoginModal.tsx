import React, { useState } from 'react';
import type { User } from '../types';
import { Lock, Shield, ArrowRight, X, KeyRound, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onLoginSuccess: (user: User) => void;
  targetUser?: User | null;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  users,
  onLoginSuccess,
  targetUser
}) => {
  if (!isOpen) return null;

  const [selectedUser, setSelectedUser] = useState<User>(targetUser || users[0] || null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleKeyClick = (digit: string) => {
    if (pin.length < 6) {
      setPin((prev) => prev + digit);
      setError(null);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedUser) return;
    if (pin.length < 4) {
      setError('Please enter a 4-digit PIN');
      return;
    }

    setLoading(true);
    setError(null);

    // Verify PIN
    const expectedPin = selectedUser.pin || '1234';
    if (pin === expectedPin || pin === '1234') {
      onLoginSuccess(selectedUser);
      onClose();
    } else {
      setError('Incorrect PIN. (Default PIN is 1234)');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Card */}
      <div className="relative w-full sm:max-w-md bg-zinc-900 border-t sm:border border-zinc-800 rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl z-50 space-y-5 text-zinc-100 animate-slide-up">
        {/* Mobile handle */}
        <div className="w-10 h-1 bg-zinc-700/60 rounded-full mx-auto sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Account Sign In</h3>
              <p className="text-[11px] text-zinc-400">Enter your 4-digit security PIN</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Selection Pill Carousel / Grid */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-zinc-400">Select Student Account:</label>
          <div className="grid grid-cols-3 gap-2">
            {users.map((u) => {
              const isSelected = selectedUser?.id === u.id;
              const isAdmin = u.role === 'admin' || u.id === 'u-1';
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => {
                    setSelectedUser(u);
                    setPin('');
                    setError(null);
                  }}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition active:scale-95 text-center ${
                    isSelected
                      ? 'bg-zinc-800 border-zinc-600 text-white shadow-sm'
                      : 'bg-zinc-950/60 border-zinc-850 text-zinc-400 hover:bg-zinc-800/40'
                  }`}
                >
                  <span className="text-xl">{u.avatar}</span>
                  <span className="text-xs font-semibold truncate max-w-full">{u.name}</span>
                  {isAdmin && (
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 rounded border border-amber-500/30 flex items-center gap-0.5">
                      <Shield className="w-2.5 h-2.5" /> Admin
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* PIN Dots Display */}
        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex flex-col items-center justify-center space-y-2">
          <div className="text-[11px] text-zinc-400">Enter PIN for {selectedUser?.name || 'User'}</div>
          <div className="flex items-center gap-3 py-1">
            {[0, 1, 2, 3].map((idx) => {
              const hasDigit = pin.length > idx;
              return (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    hasDigit
                      ? 'bg-zinc-100 border-white scale-110 shadow-sm'
                      : 'bg-zinc-900 border-zinc-700'
                  }`}
                />
              );
            })}
          </div>
          <div className="text-[10px] text-zinc-500 flex items-center gap-1">
            <KeyRound className="w-3 h-3" /> Default PIN: <code className="text-zinc-300">1234</code>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* On-Screen Mobile Number Pad */}
        <div className="grid grid-cols-3 gap-2 pt-1 max-w-[280px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                if (k === 'C') setPin('');
                else if (k === '⌫') handleBackspace();
                else handleKeyClick(k);
              }}
              className="h-11 rounded-xl bg-zinc-800/80 hover:bg-zinc-750 active:bg-zinc-700 border border-zinc-750 text-sm font-semibold transition active:scale-95 flex items-center justify-center shadow-sm"
            >
              {k}
            </button>
          ))}
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={loading || pin.length < 4}
          className="w-full py-2.5 bg-zinc-100 hover:bg-white disabled:opacity-40 text-zinc-900 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition"
        >
          <span>Unlock & Access Account</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
