import React, { useState } from 'react';
import type { User } from '../types';
import { Flame, Users, Calendar, Plus, BookOpen, CheckSquare, Sparkles, Clock, Settings } from 'lucide-react';

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

  return (
    <>
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-950/85 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-3.5 sm:px-4 py-3 flex items-center justify-between gap-3">
          {/* App Title & Board Badge (Clickable to change website name & settings) */}
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

          {/* Right Controls: Date, Profile Switcher & Settings */}
          <div className="flex items-center gap-2">
            {/* Date Selector */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-slate-300">
              <Calendar className="w-3 h-3 text-indigo-400 shrink-0" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs w-[110px]"
              />
            </div>

            {/* Current User Switcher */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition text-xs text-slate-200 active:scale-95"
              >
                <span>{currentUser?.avatar || '👤'}</span>
                <span className="font-semibold max-w-[70px] sm:max-w-[100px] truncate">{currentUser?.name || 'User'}</span>
                {currentUser?.streak ? (
                  <span className="flex items-center text-amber-400 font-bold gap-0.5 ml-0.5">
                    <Flame className="w-3 h-3 fill-amber-400" />
                    {currentUser.streak}d
                  </span>
                ) : null}
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 animate-fade-in">
                  <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Switch Active Student
                  </div>
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSelectUser(u);
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 flex items-center justify-between text-xs hover:bg-slate-800 transition ${
                        currentUser?.id === u.id ? 'bg-indigo-950/60 text-indigo-300 font-semibold' : 'text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span>{u.avatar}</span>
                        <span className="truncate">{u.name}</span>
                      </div>
                      {u.streak ? (
                        <span className="text-amber-400 text-[11px] flex items-center gap-0.5 font-bold">
                          <Flame className="w-2.5 h-2.5 fill-amber-400" />
                          {u.streak}d
                        </span>
                      ) : null}
                    </button>
                  ))}

                  <div className="border-t border-slate-800 my-1"></div>

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

        {/* Dropdown Backdrop */}
        {userDropdownOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setUserDropdownOpen(false)}
          />
        )}
      </header>

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
    </>
  );
};
