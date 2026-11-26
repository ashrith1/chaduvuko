import React, { useState, useEffect } from 'react';
import type { User } from '../types';
import { Lock, User as UserIcon, ArrowRight, Eye, EyeOff, AlertCircle, Sparkles, UserPlus, LogIn, Check } from 'lucide-react';
import { api } from '../services/api';

interface LoginPageProps {
  users?: User[];
  onLogin: (user: User) => void;
  appTitle?: string;
  appBadge?: string;
}

const AVATAR_OPTIONS = ['🚀', '⚡', '📚', '🎯', '🧠', '🌟', '🏆', '💎', '💡', '🦁'];

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  appTitle = 'Chaduvuko',
  appBadge = 'BIEAP 12th'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [identifier, setIdentifier] = useState(() => localStorage.getItem('chaduvuko_saved_identifier') || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAvatar, setRegAvatar] = useState('🚀');
  const [regTargetScore, setRegTargetScore] = useState('95%+');

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Clear errors on mode switch
  useEffect(() => {
    setError(null);
    setSuccessMsg(null);
  }, [mode]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = identifier.trim();
    const cleanPass = password.trim();

    if (!cleanId) {
      setError('Please enter your User ID or Username');
      return;
    }
    if (!cleanPass) {
      setError('Please enter your Password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const user = await api.login(cleanId, cleanPass);
      if (rememberMe) {
        localStorage.setItem('chaduvuko_saved_identifier', cleanId);
      } else {
        localStorage.removeItem('chaduvuko_saved_identifier');
      }
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your User ID and Password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setError('Please enter your full name');
      return;
    }
    const cleanUser = regUsername.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (cleanUser.length < 3) {
      setError('User ID must be at least 3 characters (letters, numbers, underscores)');
      return;
    }
    if (regPassword.trim().length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const created = await api.register({
        name: regName.trim(),
        username: cleanUser,
        password: regPassword.trim(),
        avatar: regAvatar,
        targetScore: regTargetScore
      });
      setSuccessMsg(`🎉 Account created for ${created.name}! Logging in...`);
      setTimeout(() => {
        onLogin(created);
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Registration failed. That User ID might already be in use.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-center items-center p-4 selection:bg-zinc-700 selection:text-white">
      {/* Background Accent Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md space-y-6 z-10 animate-fade-in">
        {/* App Branding Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {appBadge}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            <span>🎯</span> {appTitle}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto">
            Class 12 Intermediate Board Prep & Official Chapter Weightage Tracker
          </p>
        </div>

        {/* Glassmorphic Auth Box */}
        <div className="glass-panel border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-44 h-44 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Mode Switcher Tabs */}
          <div className="flex bg-zinc-950/80 p-1 rounded-xl border border-white/10 relative z-10">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
                mode === 'login'
                  ? 'bg-white/15 text-white border border-white/15 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
                mode === 'register'
                  ? 'bg-white/15 text-white border border-white/15 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {/* Error & Success Alerts */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-shake relative z-10">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 relative z-10">
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 relative z-10">
              {/* User ID / Username Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-violet-400" /> Custom User ID / Username:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter your User ID (e.g. ashrith)"
                    autoCapitalize="none"
                    autoComplete="username"
                    className="w-full bg-zinc-950/80 border border-white/10 hover:border-white/20 focus:border-violet-400/80 focus:ring-1 focus:ring-violet-400/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-violet-400" /> Password:
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full bg-zinc-950/80 border border-white/10 hover:border-white/20 focus:border-violet-400/80 focus:ring-1 focus:ring-violet-400/80 rounded-xl px-3.5 py-2.5 pr-10 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Option */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-zinc-950 border-white/20 text-violet-500 focus:ring-0"
                  />
                  <span>Remember my User ID</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-white text-zinc-950 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-white/5 transition active-press flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Chaduvuko</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* CREATE ACCOUNT / SIGN UP FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 relative z-10">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Full Name:</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Teja Swaroop"
                  className="w-full bg-zinc-950/80 border border-white/10 hover:border-white/20 focus:border-violet-400/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Custom User ID (Login Username):</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-mono">@</span>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    placeholder="choose_your_id"
                    autoCapitalize="none"
                    className="w-full bg-zinc-950/80 border border-white/10 hover:border-white/20 focus:border-violet-400/80 rounded-xl pl-8 pr-3.5 py-2 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 outline-none transition font-mono"
                  />
                </div>
                <p className="text-[10px] text-zinc-500">Only letters, numbers, and underscores.</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Password:</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Minimum 4 characters"
                  className="w-full bg-zinc-950/80 border border-white/10 hover:border-white/20 focus:border-violet-400/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 outline-none transition"
                />
              </div>

              {/* Avatar Picker */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Choose Student Avatar:</label>
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setRegAvatar(av)}
                      className={`text-lg p-1.5 rounded-xl border transition ${
                        regAvatar === av
                          ? 'bg-white/20 border-white/40 scale-110'
                          : 'bg-zinc-950/60 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Score */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Target Board Exam Score:</label>
                <select
                  value={regTargetScore}
                  onChange={(e) => setRegTargetScore(e.target.value)}
                  className="w-full bg-zinc-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none"
                >
                  <option value="98%+">98%+ (State Rank Track)</option>
                  <option value="95%+">95%+ (Distinction)</option>
                  <option value="90%+">90%+ (First Class)</option>
                  <option value="85%+">85%+</option>
                </select>
              </div>

              {/* Submit Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 text-white shadow-xl shadow-violet-500/20 transition active-press flex items-center justify-center gap-2 mt-3"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Create Account & Start</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footnote */}
        <p className="text-center text-[11px] text-zinc-500">
          🔒 Private & isolated accounts. Other user accounts are never exposed on this device.
        </p>
      </div>
    </div>
  );
};
