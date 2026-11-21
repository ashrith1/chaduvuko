import React, { useState, useEffect } from 'react';
import type { User } from '../types';
import {
  Flame,
  Users,
  Calendar as CalendarIcon,
  Plus,
  BookOpen,
  CheckSquare,
  Clock,
  Settings,
  Download,
  Check,
  X,
  Info,
  Shield,
  Share2,
  Lock,
  LogOut
} from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  users: User[];
  currentTab: 'daily' | 'group' | 'syllabus' | 'timer' | 'calendar' | 'admin';
  appTitle?: string;
  appBadge?: string;
  onTabChange: (tab: 'daily' | 'group' | 'syllabus' | 'timer' | 'calendar' | 'admin') => void;
  onSelectUser: (user: User) => void;
  onOpenNewUserModal: () => void;
  onOpenManageUsersModal: () => void;
  onOpenAboutModal?: () => void;
  onOpenLoginModal?: (targetUser?: User | null) => void;
  onOpenShareModal?: () => void;
  onLogout?: () => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  users,
  currentTab,
  appTitle = 'Chaduvuko',
  appBadge = 'BIEAP 12th',
  onTabChange,
  onSelectUser,
  onOpenNewUserModal,
  onOpenManageUsersModal,
  onOpenAboutModal,
  onOpenLoginModal,
  onOpenShareModal,
  onLogout,
  selectedDate,
  onDateChange
}) => {
  const [userDrawerOpen, setUserDrawerOpen] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
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
    if ('vibrate' in navigator) navigator.vibrate(25);
    setUserDrawerOpen(false);
    if (onOpenLoginModal && user.id !== currentUser?.id) {
      onOpenLoginModal(user);
    } else {
      onSelectUser(user);
    }
  };

  const isAdmin = currentUser?.role === 'admin' || currentUser?.id === 'u-1';

  // Format date display (e.g. "Today" or "Nov 19")
  const todayStr = new Date().toISOString().split('T')[0];
  const isToday = selectedDate === todayStr;
  const formattedDate = isToday
    ? 'Today'
    : new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });

  return (
    <>
      {/* Sleek Minimal Top Bar */}
      <header className="border-b border-zinc-800/80 bg-[#09090b]/90 backdrop-blur-xl sticky top-0 z-30 transition-all">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          {/* Brand Title (Minimalist) */}
          <button
            onClick={onOpenManageUsersModal}
            className="flex items-center gap-2 text-left group transition active:opacity-75 focus:outline-none"
            title="Manage website name & friends"
          >
            <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-xs font-bold text-zinc-100 group-hover:border-zinc-500 transition">
              C
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-100 tracking-tight text-sm group-hover:text-white transition">
                {appTitle}
              </span>
              <span className="hidden sm:inline-block text-[10px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
                {appBadge}
              </span>
            </div>
          </button>

          {/* Desktop Minimal Segmented Nav */}
          <div className="hidden md:flex items-center bg-zinc-900/90 p-1 rounded-xl border border-zinc-800/80 shadow-inner">
            <button
              onClick={() => onTabChange('daily')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                currentTab === 'daily'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Targets</span>
            </button>

            <button
              onClick={() => onTabChange('timer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                currentTab === 'timer'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Timer</span>
            </button>

            <button
              onClick={() => onTabChange('group')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                currentTab === 'group'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Friends</span>
            </button>

            <button
              onClick={() => onTabChange('syllabus')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                currentTab === 'syllabus'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Syllabus</span>
            </button>

            <button
              onClick={() => onTabChange('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                currentTab === 'calendar'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Calendar</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => onTabChange('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  currentTab === 'admin'
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-sm'
                    : 'text-amber-400/80 hover:text-amber-300'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin</span>
              </button>
            )}
          </div>

          {/* Right Section: Date & User Profile */}
          <div className="flex items-center gap-2">
            {/* Minimal Date Pill */}
            <label className="flex items-center gap-1.5 bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 px-2.5 py-1.5 rounded-lg text-xs text-zinc-300 cursor-pointer transition">
              <CalendarIcon className="w-3 h-3 text-zinc-400 shrink-0" />
              <span className="font-medium text-[11px] sm:text-xs">{formattedDate}</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="opacity-0 absolute w-0 h-0 pointer-events-none"
              />
            </label>

            {/* Quick Share Report Icon */}
            {onOpenShareModal && (
              <button
                onClick={onOpenShareModal}
                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
                title="Share Today's Study Report (WhatsApp)"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            )}

            {/* User Profile Pill / Button */}
            <button
              onClick={() => setUserDrawerOpen(true)}
              className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 px-2.5 py-1.5 rounded-lg text-xs text-zinc-200 transition active:scale-95"
              title="Switch user or open settings"
            >
              <span>{currentUser?.avatar || '👤'}</span>
              <span className="font-medium max-w-[65px] sm:max-w-[100px] truncate">
                {currentUser?.name || 'User'}
              </span>
              {currentUser?.streak ? (
                <span className="flex items-center text-amber-400 font-medium text-[11px] ml-0.5">
                  <Flame className="w-3 h-3 fill-amber-400" />
                  {currentUser.streak}
                </span>
              ) : null}
            </button>

            {/* Log Out Button */}
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-red-400 transition"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Quick About & Settings Icons (Desktop) */}
            {onOpenAboutModal && (
              <button
                onClick={onOpenAboutModal}
                className="hidden sm:flex p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
                title="About Chaduvuko & Blueprint"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onOpenManageUsersModal}
              className="hidden sm:flex p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
              title="Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE FLOATING DOCK (Ultra-Minimal Pill Bar) */}
      <nav className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-zinc-900/90 backdrop-blur-2xl border border-zinc-800/90 rounded-full p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.7)] flex items-center gap-1 transition-all">
        <button
          onClick={() => {
            if ('vibrate' in navigator) navigator.vibrate(15);
            onTabChange('daily');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all duration-200 ${
            currentTab === 'daily'
              ? 'bg-zinc-800 text-zinc-100 font-medium shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          {currentTab === 'daily' && <span>Tasks</span>}
        </button>

        <button
          onClick={() => {
            if ('vibrate' in navigator) navigator.vibrate(15);
            onTabChange('timer');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all duration-200 ${
            currentTab === 'timer'
              ? 'bg-zinc-800 text-zinc-100 font-medium shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          {currentTab === 'timer' && <span>Timer</span>}
        </button>

        <button
          onClick={() => {
            if ('vibrate' in navigator) navigator.vibrate(15);
            onTabChange('group');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all duration-200 ${
            currentTab === 'group'
              ? 'bg-zinc-800 text-zinc-100 font-medium shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Users className="w-4 h-4" />
          {currentTab === 'group' && <span>Friends</span>}
        </button>

        <button
          onClick={() => {
            if ('vibrate' in navigator) navigator.vibrate(15);
            onTabChange('syllabus');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all duration-200 ${
            currentTab === 'syllabus'
              ? 'bg-zinc-800 text-zinc-100 font-medium shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          {currentTab === 'syllabus' && <span>Syllabus</span>}
        </button>

        <button
          onClick={() => {
            if ('vibrate' in navigator) navigator.vibrate(15);
            onTabChange('calendar');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all duration-200 ${
            currentTab === 'calendar'
              ? 'bg-zinc-800 text-zinc-100 font-medium shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <CalendarIcon className="w-4 h-4 text-indigo-400" />
          {currentTab === 'calendar' && <span>Calendar</span>}
        </button>

        {isAdmin && (
          <button
            onClick={() => {
              if ('vibrate' in navigator) navigator.vibrate(15);
              onTabChange('admin');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all duration-200 ${
              currentTab === 'admin'
                ? 'bg-amber-500/20 text-amber-200 font-medium shadow-sm border border-amber-500/30'
                : 'text-amber-400/80 hover:text-amber-300'
            }`}
          >
            <Shield className="w-4 h-4 text-amber-400" />
            {currentTab === 'admin' && <span>Admin</span>}
          </button>
        )}
      </nav>

      {/* MINIMAL USER DRAWER / BOTTOM SHEET */}
      {userDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setUserDrawerOpen(false)}
          />

          {/* Modal / Sheet Card */}
          <div className="relative w-full sm:max-w-md bg-zinc-900 border-t sm:border border-zinc-800 rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl z-50 max-h-[85vh] overflow-y-auto space-y-4 pb-8 sm:pb-5 animate-slide-up">
            <div className="w-10 h-1 bg-zinc-700/60 rounded-full mx-auto sm:hidden" />

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">Student Profile</h3>
                <p className="text-xs text-zinc-400">Switch profile or manage study group</p>
              </div>
              <button
                type="button"
                onClick={() => setUserDrawerOpen(false)}
                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Students List */}
            <div className="space-y-1.5 pt-1">
              {users.map((u) => {
                const isSelected = currentUser?.id === u.id;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSwitchUser(u)}
                    className={`w-full p-3 rounded-xl flex items-center justify-between border transition text-left active:scale-[0.99] ${
                      isSelected
                        ? 'bg-zinc-800/90 border-zinc-700 text-zinc-100 font-medium'
                        : 'bg-zinc-900/50 border-zinc-800/70 text-zinc-300 hover:bg-zinc-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl p-1.5 rounded-lg bg-zinc-950 border border-zinc-800">
                        {u.avatar}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs sm:text-sm text-zinc-100">{u.name}</span>
                          {(u.role === 'admin' || u.id === 'u-1') && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5">
                              <Shield className="w-2.5 h-2.5" /> Admin
                            </span>
                          )}
                          {isSelected && (
                            <span className="text-[10px] bg-zinc-700 text-zinc-200 px-1.5 py-0.2 rounded font-medium">
                              Active
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-zinc-400">
                          {u.streak ? `${u.streak} day streak` : 'Ready to study'}
                        </span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-zinc-200" />}
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-zinc-800/80 grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setUserDrawerOpen(false);
                  onOpenNewUserModal();
                }}
                className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-750 border border-zinc-700/80 text-zinc-200 font-medium flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Friend</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUserDrawerOpen(false);
                  onOpenManageUsersModal();
                }}
                className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-750 border border-zinc-700/80 text-zinc-200 font-medium flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Settings</span>
              </button>
            </div>

            {/* Quick Share & Lock Buttons */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {onOpenShareModal && (
                <button
                  type="button"
                  onClick={() => {
                    setUserDrawerOpen(false);
                    onOpenShareModal();
                  }}
                  className="py-2 px-3 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-750 text-emerald-300 font-medium flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Report</span>
                </button>
              )}

              {onOpenLoginModal && (
                <button
                  type="button"
                  onClick={() => {
                    setUserDrawerOpen(false);
                    onOpenLoginModal(null);
                  }}
                  className="py-2 px-3 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 font-medium flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <Lock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Switch / PIN</span>
                </button>
              )}
            </div>

            {/* About & Info Button */}
            {onOpenAboutModal && (
              <button
                type="button"
                onClick={() => {
                  setUserDrawerOpen(false);
                  onOpenAboutModal();
                }}
                className="w-full py-2 px-3 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 text-xs font-medium flex items-center justify-center gap-2 transition"
              >
                <Info className="w-3.5 h-3.5 text-indigo-400" />
                <span>About Chaduvuko & Blueprint</span>
              </button>
            )}

            {/* Log Out Button */}
            {onLogout && (
              <button
                type="button"
                onClick={() => {
                  setUserDrawerOpen(false);
                  onLogout();
                }}
                className="w-full py-2 px-3 rounded-xl bg-red-950/30 hover:bg-red-950/50 border border-red-900/40 text-red-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out of {currentUser?.name || 'Account'}</span>
              </button>
            )}

            {/* Install App Link */}
            {!isInstalled && (
              <button
                onClick={() => {
                  setUserDrawerOpen(false);
                  handleInstallClick();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 text-xs font-medium flex items-center justify-center gap-2 transition"
              >
                <Download className="w-3.5 h-3.5 text-zinc-400" />
                <span>Install Chaduvuko on Phone</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* PWA INSTALL GUIDE */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-200 flex items-center justify-center">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-100 text-sm">Install App</h3>
                  <p className="text-[11px] text-zinc-400">Launch directly from home screen</p>
                </div>
              </div>
              <button
                onClick={() => setShowInstallGuide(false)}
                className="text-zinc-500 hover:text-zinc-300 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 space-y-2.5 text-xs text-zinc-300">
              <p className="font-medium text-zinc-200">On Android Chrome:</p>
              <ol className="list-decimal list-inside space-y-1.5 text-zinc-400 text-[11px]">
                <li>Tap the <strong>three dots (⋮)</strong> at top right.</li>
                <li>Tap <strong>"Install app"</strong>.</li>
                <li>Tap <strong>"Install"</strong> to confirm.</li>
              </ol>
            </div>

            <button
              onClick={() => setShowInstallGuide(false)}
              className="w-full py-2 bg-zinc-100 hover:bg-white text-zinc-900 rounded-xl text-xs font-semibold shadow-sm active:scale-95 transition"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};
