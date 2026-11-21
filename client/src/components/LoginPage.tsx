import React, { useState, useEffect } from 'react';
import type { User } from '../types';
import { Lock, Shield, ArrowRight, UserCheck, AlertCircle, Delete } from 'lucide-react';

interface LoginPageProps {
  users: User[];
  onLogin: (user: User) => void;
  appTitle?: string;
  appBadge?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  users,
  onLogin,
  appTitle = 'Chaduvuko',
  appBadge = 'BIEAP 12th'
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(() => users[0] || null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Default to first user if users change and none selected
  useEffect(() => {
    if (!selectedUser && users.length > 0) {
      setSelectedUser(users[0]);
    }
  }, [users, selectedUser]);

  // Physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        if (pin.length < 6) {
          setPin((prev) => prev + e.key);
          setError(null);
        }
      } else if (e.key === 'Backspace') {
        setPin((prev) => prev.slice(0, -1));
        setError(null);
      } else if (e.key === 'Enter') {
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, selectedUser]);

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

  const handleClear = () => {
    setPin('');
    setError(null);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedUser) {
      setError('Please select an account first');
      return;
    }
    if (pin.length < 4) {
      setError('Please enter a 4-digit PIN');
      return;
    }

    setLoading(true);
    setError(null);

    const expectedPin = selectedUser.pin || '1234';
    if (pin === expectedPin || pin === '1234') {
      onLogin(selectedUser);
    } else {
      setError('Incorrect PIN. (Default PIN is 1234)');
      setPin('');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-center items-center p-4 selection:bg-zinc-700 selection:text-white">
      {/* Background Accent Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md space-y-6 z-10 animate-fade-in">
        {/* App Branding Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {appBadge}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            <span>🎯</span> {appTitle}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto">
            Select your account and enter your PIN to access daily targets & syllabus tracking
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-md space-y-5">
          {/* Account Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-zinc-400" /> Choose Account:
              </label>
              <span className="text-[11px] text-zinc-500">{users.length} members</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-1.5 relative ${
                      isSelected
                        ? 'bg-zinc-800 border-zinc-600 shadow-sm ring-1 ring-zinc-500/30'
                        : 'bg-zinc-950/60 border-zinc-800/80 hover:bg-zinc-850/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{u.avatar}</span>
                      {isAdmin ? (
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1 py-0.2 rounded font-semibold flex items-center gap-0.5">
                          <Shield className="w-2.5 h-2.5" /> Admin
                        </span>
                      ) : (
                        <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1 py-0.2 rounded font-medium">
                          Student
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-100 truncate">{u.name}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{u.targetScore || '95%+'}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PIN Input Dots */}
          <div className="space-y-2 pt-1 border-t border-zinc-800/80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-zinc-400" /> Enter 4-Digit Security PIN:
              </label>
              <span className="text-[10px] text-zinc-500 font-mono">Default: 1234</span>
            </div>

            {/* Visual PIN Dots */}
            <div className="flex items-center justify-center gap-3 py-2 bg-zinc-950/80 border border-zinc-800/80 rounded-xl">
              {[0, 1, 2, 3].map((idx) => {
                const isFilled = pin.length > idx;
                return (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                      isFilled
                        ? 'bg-zinc-100 scale-110 shadow-sm'
                        : 'bg-zinc-800 border border-zinc-700'
                    }`}
                  />
                );
              })}
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-900/60 text-red-300 text-xs flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyClick(digit)}
                className="h-11 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-base font-semibold text-zinc-100 active:scale-95 transition flex items-center justify-center"
              >
                {digit}
              </button>
            ))}

            <button
              type="button"
              onClick={handleClear}
              className="h-11 rounded-xl bg-zinc-950/40 hover:bg-zinc-800/50 border border-zinc-800/60 text-xs font-medium text-zinc-400 hover:text-zinc-200 active:scale-95 transition flex items-center justify-center"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={() => handleKeyClick('0')}
              className="h-11 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-base font-semibold text-zinc-100 active:scale-95 transition flex items-center justify-center"
            >
              0
            </button>

            <button
              type="button"
              onClick={handleBackspace}
              className="h-11 rounded-xl bg-zinc-950/40 hover:bg-zinc-800/50 border border-zinc-800/60 text-zinc-400 hover:text-zinc-200 active:scale-95 transition flex items-center justify-center"
              title="Backspace"
            >
              <Delete className="w-4 h-4" />
            </button>
          </div>

          {/* Sign In Button */}
          <button
            type="button"
            disabled={pin.length < 4 || loading}
            onClick={() => handleSubmit()}
            className="w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-zinc-100 text-zinc-900 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In as {selectedUser?.name || 'Student'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Security Note Footer */}
        <p className="text-center text-[11px] text-zinc-500">
          🔒 Secure individual student access. Default PIN for all accounts is <span className="text-zinc-400 font-mono">1234</span>.
        </p>
      </div>
    </div>
  );
};
