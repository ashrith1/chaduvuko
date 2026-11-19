import React, { useState, useEffect } from 'react';
import type { User } from '../types';
import { Flame, Users, Calendar, Plus, BookOpen, CheckSquare, Sparkles, Clock, Settings, Download, Check, X } from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  users: User[];
  currentTab: 'daily' | 'group' | 'syllabus' | 'timer';
  appTitle?: string;
  appBadge?: string;
  onTabChange: (tab: 'daily' | 'group' | 'syllabus' | 'timer') => void;
  onSelectUser: (user: User) => void;
  onOpenNewUserModal: () => void;
  onOpenManageUsersModal: () => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  users,
  currentTab,
  appTitle = '12th Prep',
  appBadge = 'BIEAP State Board',
  onTabChange,
  onSelectUser,
  onOpenNewUserModal,
  onOpenManageUsersModal,
  selectedDate,
  onDateChange
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // Detect PWA installability and installed state
  useEffect(() => {
    // Check if already running in standalone PWA mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowInstallGuide(true);
    }
  };

  const handleSwitchUser = (user: User) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
    onSelectUser(user);
    setUserDropdownOpen(false);
  };

  return (
    <>
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-950/85 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-3.5 sm:px-4 py-3 flex items-center justify-between gap-3">
          {/* App Title & Board Badge */}
          <button
            onClick={onOpenManageUsersModal}
            className="flex items-center gap-2.5 text-left group hover:opacity-90 transition active:scale-95"
            title="Click to change website name or manage friends"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-100 tracking-tight text-sm sm:text-base group-hover:text-indigo-300 transition">
                  {appTitle}
                </span>
                <span className="text-[10px] font-semibold bg-indigo-950 text-indigo-300 px-1.5 py-0.2 rounded-md border border-indigo-800/60 truncate max-w-[120px]">
                  {appBadge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Maths • Physics • Chemistry Target Tracker</p>
            </div>
          </button>

          {/* Desktop Navigation Tabs */}
          <div className="hidden md:flex items-center bg-slate-900/90 p-1 rounded-2xl border border-slate-800/80">
            <button
              onClick={() => onTabChange('daily')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                currentTab === 'daily'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Daily Tasks</span>
            </button>

            <button
              onClick={() => onTabChange('timer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                currentTab === 'timer'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Study Timer</span>
            </button>

            <button
              onClick={() => onTabChange('group')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                currentTab === 'group'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Friends Hub</span>
            </button>

            <button
              onClick={() => onTabChange('syllabus')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                currentTab === 'syllabus'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Syllabus & Weightage</span>
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Install App Quick Button (Visible if not in standalone) */}
            {!isInstalled && (
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600/20 to-teal-600/20 hover:from-emerald-600/30 hover:to-teal-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition active:scale-95"
                title="Install Chaduvuko on your phone as an App"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Install App</span>
              </button>
            )}

            {/* Date Selector */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-slate-300">
              <Calendar className="w-3 h-3 text-indigo-400 shrink-0" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs w-[100px] sm:w-[110px]"
              />
            </div>

            {/* Current User Switcher Trigger Button */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition text-xs text-slate-200 active:scale-95 shadow-sm"
                aria-label="Switch Profile"
              >
                <span className="text-sm">{currentUser?.avatar || '👤'}</span>
                <span className="font-semibold max-w-[65px] sm:max-w-[100px] truncate">{currentUser?.name || 'User'}</span>
                {currentUser?.streak ? (
                  <span className="flex items-center text-amber-400 font-bold gap-0.5 ml-0.5">
                    <Flame className="w-3 h-3 fill-amber-400" />
                    {currentUser.streak}d
                  </span>
                ) : null}
              </button>

              {/* DESKTOP Dropdown Menu (hidden on mobile, uses bottom sheet instead) */}
              {userDropdownOpen && (
                <div className="hidden sm:block absolute right-0 mt-2 w-60 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 animate-fade-in">
                  <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Switch Active Student
                  </div>
                  {users.map((u) => {
                    const isSelected = currentUser?.id === u.id;
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleSwitchUser(u)}
                        className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between text-xs transition ${
                          isSelected
                            ? 'bg-indigo-950/70 text-indigo-300 font-semibold border-l-2 border-indigo-500'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-base">{u.avatar}</span>
                          <span className="truncate">{u.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                          {u.streak ? (
                            <span className="text-amber-400 text-[11px] flex items-center gap-0.5 font-bold">
                              <Flame className="w-2.5 h-2.5 fill-amber-400" />
                              {u.streak}d
                            </span>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}

                  <div className="border-t border-slate-800 my-1.5"></div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenNewUserModal();
                    }}
                    className="w-full text-left px-3.5 py-2 flex items-center gap-2 text-xs text-indigo-400 hover:bg-slate-800 hover:text-indigo-300 transition font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Friend to Group</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenManageUsersModal();
                    }}
                    className="w-full text-left px-3.5 py-2 flex items-center gap-2 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                    <span>Manage Friends & Settings</span>
                  </button>

                  {!isInstalled && (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleInstallClick();
                      }}
                      className="w-full text-left px-3.5 py-2 flex items-center gap-2 text-xs text-emerald-400 hover:bg-slate-800 hover:text-emerald-300 transition"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Install App on Phone</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Quick Settings Icon Button */}
            <button
              onClick={onOpenManageUsersModal}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-indigo-300 transition active:scale-95"
              title="Manage Friends & Change Website Name"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Desktop Dropdown Backdrop */}
        {userDropdownOpen && (
          <div
            className="hidden sm:block fixed inset-0 z-40 bg-black/40"
            onClick={() => setUserDropdownOpen(false)}
          />
        )}
      </header>

      {/* MOBILE BOTTOM SHEET FOR SWITCHING STUDENT PROFILE */}
      {userDropdownOpen && (
        <div className="sm:hidden fixed inset-0 z-50 flex items-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setUserDropdownOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 shadow-2xl z-50 max-h-[85vh] overflow-y-auto space-y-4 animate-slide-up pb-8">
            <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto" />
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100">Switch Student Profile</h3>
                <p className="text-xs text-slate-400">Tap your name to load your targets</p>
              </div>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Students List */}
            <div className="space-y-2 pt-1">
              {users.map((u) => {
                const isSelected = currentUser?.id === u.id;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSwitchUser(u)}
                    className={`w-full p-3.5 rounded-2xl flex items-center justify-between border transition text-left active:scale-[0.98] ${
                      isSelected
                        ? 'bg-indigo-950/80 border-indigo-500 text-indigo-100 ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-950'
                        : 'bg-slate-850 border-slate-800 text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2 rounded-xl bg-slate-950 border border-slate-800">
                        {u.avatar}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-100">{u.name}</span>
                          {isSelected && (
                            <span className="text-[10px] font-bold bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/50">
                              Active
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400">
                          {u.streak ? `${u.streak} day streak` : 'Ready to study'}
                        </span>
                      </div>
                    </div>
                    {isSelected ? (
                      <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-indigo-600/30">
                        <Check className="w-4 h-4" />
                      </div>
                    ) : (
                      <span className="text-xs text-indigo-400 font-semibold px-2.5 py-1 rounded-xl bg-indigo-950/50 border border-indigo-900/60">
                        Switch
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setUserDropdownOpen(false);
                  onOpenNewUserModal();
                }}
                className="py-2.5 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Friend</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setUserDropdownOpen(false);
                  onOpenManageUsersModal();
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800/90 backdrop-blur-lg px-2 py-1.5 pb-safe flex items-center justify-around shadow-2xl">
        <button
          onClick={() => onTabChange('daily')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition active:scale-90 ${
            currentTab === 'daily'
              ? 'text-indigo-400 font-bold'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <CheckSquare className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Tasks</span>
        </button>

        <button
          onClick={() => onTabChange('timer')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition active:scale-90 ${
            currentTab === 'timer'
              ? 'text-indigo-400 font-bold'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Clock className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Timer</span>
        </button>

        <button
          onClick={() => onTabChange('group')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition active:scale-90 ${
            currentTab === 'group'
              ? 'text-indigo-400 font-bold'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Friends</span>
        </button>

        <button
          onClick={() => onTabChange('syllabus')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition active:scale-90 ${
            currentTab === 'syllabus'
              ? 'text-indigo-400 font-bold'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Syllabus</span>
        </button>
      </nav>

      {/* PWA INSTALLATION GUIDE MODAL (IF AUTOMATIC PROMPT IS NOT FIRED YET) */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">Install Chaduvuko App</h3>
                  <p className="text-[11px] text-slate-400">Install as a native full-screen app</p>
                </div>
              </div>
              <button
                onClick={() => setShowInstallGuide(false)}
                className="text-slate-500 hover:text-slate-300 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-3 text-xs text-slate-300">
              <p className="font-semibold text-slate-200">How to install on Android Chrome:</p>
              <ol className="list-decimal list-inside space-y-2 text-slate-400">
                <li>
                  Tap the <strong className="text-slate-200">three dots (⋮)</strong> in Chrome’s top right corner.
                </li>
                <li>
                  Tap <strong className="text-emerald-400">"Install app"</strong> (or "Add to Home screen").
                </li>
                <li>
                  Confirm <strong className="text-slate-200">"Install"</strong> when prompted.
                </li>
              </ol>
              <div className="text-[11px] text-indigo-300 bg-indigo-950/50 p-2.5 rounded-xl border border-indigo-900/50">
                ⚡ Once installed, Chaduvuko opens instantly in full-screen without the browser URL bar!
              </div>
            </div>

            <button
              onClick={() => setShowInstallGuide(false)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md active:scale-95 transition"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
