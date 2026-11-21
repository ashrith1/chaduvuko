import React from 'react';
import {
  CheckSquare,
  Calendar as CalendarIcon,
  Clock,
  BookOpen,
  Users,
  Shield
} from 'lucide-react';
import type { User } from '../types';

interface BottomNavProps {
  currentTab: 'daily' | 'group' | 'syllabus' | 'timer' | 'calendar' | 'admin';
  onTabChange: (tab: 'daily' | 'group' | 'syllabus' | 'timer' | 'calendar' | 'admin') => void;
  currentUser: User | null;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  currentUser
}) => {
  const isAdmin = currentUser?.role === 'admin' || currentUser?.id === 'u-1';

  const navItems = [
    {
      id: 'daily' as const,
      label: 'Daily',
      icon: CheckSquare,
      color: 'text-violet-400',
      activeBg: 'bg-violet-500/15 border-violet-500/30'
    },
    {
      id: 'calendar' as const,
      label: 'Calendar',
      icon: CalendarIcon,
      color: 'text-indigo-400',
      activeBg: 'bg-indigo-500/15 border-indigo-500/30'
    },
    {
      id: 'timer' as const,
      label: 'Timer',
      icon: Clock,
      color: 'text-emerald-400',
      activeBg: 'bg-emerald-500/15 border-emerald-500/30'
    },
    {
      id: 'syllabus' as const,
      label: 'Syllabus',
      icon: BookOpen,
      color: 'text-sky-400',
      activeBg: 'bg-sky-500/15 border-sky-500/30'
    },
    {
      id: 'group' as const,
      label: 'Friends',
      icon: Users,
      color: 'text-rose-400',
      activeBg: 'bg-rose-500/15 border-rose-500/30'
    },
    ...(isAdmin
      ? [
          {
            id: 'admin' as const,
            label: 'Admin',
            icon: Shield,
            color: 'text-amber-400',
            activeBg: 'bg-amber-500/15 border-amber-500/30'
          }
        ]
      : [])
  ];

  return (
    <div className="md:hidden fixed bottom-3 inset-x-3 z-40 max-w-lg mx-auto">
      <nav className="glass-panel rounded-2xl p-1.5 shadow-2xl border border-white/10 backdrop-blur-2xl flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 active:scale-90 ${
                isActive
                  ? `${item.activeBg} border text-zinc-100 shadow-sm`
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-transform duration-200 ${
                  isActive ? `${item.color} scale-110` : 'text-zinc-400'
                }`}
              />
              <span
                className={`text-[10px] font-medium tracking-tight mt-0.5 ${
                  isActive ? 'text-zinc-100 font-semibold' : 'text-zinc-400'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-zinc-200" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
