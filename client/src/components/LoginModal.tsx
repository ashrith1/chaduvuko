import React, { useState } from 'react';
import type { User } from '../types';
import { Lock, User as UserIcon, ArrowRight, X, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { api } from '../services/api';

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
  onLoginSuccess,
  targetUser
}) => {
  if (!isOpen) return null;

  const [usernameInput, setUsernameInput] = useState(() => targetUser?.username || targetUser?.name || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const idToUse = targetUser ? (targetUser.username || targetUser.id) : usernameInput.trim();
    const passToUse = password.trim();

    if (!idToUse) {
      setError('Please enter your User ID or Username');
      return;
    }
    if (!passToUse) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const user = await api.login(idToUse, passToUse);
      onLoginSuccess(user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Incorrect User ID or Password.');
    } finally {
      setLoading(false);
    }
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
              <h3 className="text-sm font-semibold text-zinc-100">
                {targetUser ? `Switch to ${targetUser.name}` : 'Account Sign In'}
              </h3>
              <p className="text-[11px] text-zinc-400">Enter credentials to authenticate</p>
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

        {error && (
          <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!targetUser ? (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-violet-400" /> User ID / Username:
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Enter User ID (e.g. ashrith)"
                autoCapitalize="none"
                className="w-full bg-zinc-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-violet-400/80"
              />
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-white/10 flex items-center gap-3">
              <span className="text-2xl">{targetUser.avatar}</span>
              <div>
                <p className="text-xs font-bold text-zinc-100">{targetUser.name}</p>
                <p className="text-[10px] text-zinc-400 font-mono">@{targetUser.username || targetUser.id}</p>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-violet-400" /> Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-zinc-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 pr-10 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-violet-400/80"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-white text-zinc-950 hover:bg-zinc-100 disabled:opacity-40 transition active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
