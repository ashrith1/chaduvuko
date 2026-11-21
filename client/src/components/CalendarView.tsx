import React, { useState, useMemo } from 'react';
import type { Target, User } from '../types';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, Clock, BookOpen, Flame, Award, ArrowRight } from 'lucide-react';

interface CalendarViewProps {
  currentUser: User | null;
  targets: Target[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onNavigateToDaily: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  currentUser,
  targets,
  selectedDate,
  onSelectDate,
  onNavigateToDaily
}) => {
  // Current viewing month state (default to current year & month)
  const [viewDate, setViewDate] = useState(() => new Date(selectedDate || new Date().toISOString()));
  const [activeInspectorDate, setActiveInspectorDate] = useState<string>(selectedDate);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0 - 11

  const monthName = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Filter targets for current user
  const userTargets = useMemo(() => {
    return targets.filter((t) => t.userId === currentUser?.id);
  }, [targets, currentUser?.id]);

  // Aggregate targets by date: { "YYYY-MM-DD": { total, completed, timeSpent, list } }
  const targetsByDate = useMemo(() => {
    const map: Record<string, { total: number; completed: number; timeSpent: number; list: Target[] }> = {};
    for (const t of userTargets) {
      if (!map[t.date]) {
        map[t.date] = { total: 0, completed: 0, timeSpent: 0, list: [] };
      }
      map[t.date].total += 1;
      if (t.completed) map[t.date].completed += 1;
      map[t.date].timeSpent += t.timeSpentSeconds || 0;
      map[t.date].list.push(t);
    }
    return map;
  }, [userTargets]);

  // Calendar Grid Calculation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: Array<{ dayNumber: number; dateString: string; isCurrentMonth: boolean }> = [];

    // Previous month padding
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const prevM = month === 0 ? 12 : month;
      const prevY = month === 0 ? year - 1 : year;
      const dateString = `${prevY}-${String(prevM).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dayNumber: d, dateString, isCurrentMonth: false });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dayNumber: d, dateString, isCurrentMonth: true });
    }

    // Next month padding to fill grid to multiple of 7
    const remaining = 35 - days.length > 0 ? 35 - days.length : (42 - days.length > 0 ? 42 - days.length : 0);
    for (let d = 1; d <= remaining; d++) {
      const nextM = month === 11 ? 1 : month + 2;
      const nextY = month === 11 ? year + 1 : year;
      const dateString = `${nextY}-${String(nextM).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dayNumber: d, dateString, isCurrentMonth: false });
    }

    return days;
  }, [year, month]);

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  // Monthly stats
  const monthlyStats = useMemo(() => {
    const currentMonthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    let daysActive = 0;
    let completedGoals = 0;
    let totalSeconds = 0;

    for (const [dStr, info] of Object.entries(targetsByDate)) {
      if (dStr.startsWith(currentMonthPrefix)) {
        if (info.completed > 0 || info.timeSpent > 0) daysActive++;
        completedGoals += info.completed;
        totalSeconds += info.timeSpent;
      }
    }

    return {
      daysActive,
      completedGoals,
      totalHours: (totalSeconds / 3600).toFixed(1)
    };
  }, [year, month, targetsByDate]);

  const inspectedData = targetsByDate[activeInspectorDate] || { total: 0, completed: 0, timeSpent: 0, list: [] };
  const inspectedDateFormatted = new Date(activeInspectorDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Header Card */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur-sm shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-zinc-200">
              <CalendarIcon className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-zinc-100 tracking-tight">
                Activity Calendar & History
              </h2>
              <p className="text-[11px] text-zinc-400">
                Track your study habits, solved goals, and consistency across days
              </p>
            </div>
          </div>

          {/* Month Switcher */}
          <div className="flex items-center bg-zinc-950/80 border border-zinc-800 rounded-xl p-1 gap-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold px-2 text-zinc-200 min-w-[120px] text-center">
              {monthName}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3 Monthly Metric Pills */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-zinc-800/60 text-xs">
          <div className="bg-zinc-950/60 border border-zinc-850 p-2.5 rounded-xl text-center">
            <div className="text-[10px] text-zinc-500 font-medium">Days Active</div>
            <div className="text-sm font-bold text-zinc-100 mt-0.5">{monthlyStats.daysActive} days</div>
          </div>
          <div className="bg-zinc-950/60 border border-zinc-850 p-2.5 rounded-xl text-center">
            <div className="text-[10px] text-zinc-500 font-medium">Goals Solved</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">{monthlyStats.completedGoals}</div>
          </div>
          <div className="bg-zinc-950/60 border border-zinc-850 p-2.5 rounded-xl text-center">
            <div className="text-[10px] text-zinc-500 font-medium">Study Hours</div>
            <div className="text-sm font-bold text-indigo-400 mt-0.5">{monthlyStats.totalHours} hrs</div>
          </div>
        </div>
      </div>

      {/* Main Grid + Day Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Calendar Grid (7 cols) */}
        <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 sm:p-4 backdrop-blur-sm shadow-sm space-y-2">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-zinc-400 pb-1 border-b border-zinc-800/80">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {calendarDays.map((item, idx) => {
              const data = targetsByDate[item.dateString];
              const isSelected = activeInspectorDate === item.dateString;
              const isToday = item.dateString === todayStr;
              const hasCompleted = data && data.completed > 0;
              const hasPartial = data && data.total > 0 && data.completed === 0;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveInspectorDate(item.dateString)}
                  className={`min-h-[52px] sm:min-h-[62px] p-1.5 rounded-xl border flex flex-col justify-between transition-all active:scale-95 text-left relative ${
                    isSelected
                      ? 'bg-zinc-800 border-zinc-500 shadow-md ring-1 ring-zinc-500'
                      : item.isCurrentMonth
                      ? 'bg-zinc-950/60 border-zinc-850 hover:bg-zinc-850/60 text-zinc-300'
                      : 'bg-zinc-950/20 border-zinc-900 text-zinc-650 opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-[11px] font-medium ${
                        isToday
                          ? 'w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold'
                          : isSelected
                          ? 'text-white font-bold'
                          : 'text-zinc-400'
                      }`}
                    >
                      {item.dayNumber}
                    </span>
                    {hasCompleted && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-950 shadow-sm" />
                    )}
                    {hasPartial && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 ring-2 ring-amber-950" />
                    )}
                  </div>

                  {data && data.total > 0 && (
                    <div className="text-[10px] text-zinc-400 font-mono mt-1 truncate">
                      {data.completed > 0 ? (
                        <span className="text-emerald-400 font-semibold">{data.completed}/{data.total}✓</span>
                      ) : (
                        <span className="text-zinc-500">{data.total} goals</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 pt-2 text-[10px] text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Completed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> In Progress
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" /> Today
            </span>
          </div>
        </div>

        {/* Day Detail Inspector (5 cols) */}
        <div className="lg:col-span-5 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 backdrop-blur-sm shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
              <div>
                <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Day Inspector
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-zinc-100">
                  {inspectedDateFormatted}
                </h3>
              </div>
              {inspectedData.timeSpent > 0 && (
                <div className="flex items-center gap-1 text-[11px] font-mono text-indigo-400 bg-indigo-950/50 border border-indigo-800/60 px-2 py-0.5 rounded-md">
                  <Clock className="w-3 h-3" />
                  <span>{Math.round(inspectedData.timeSpent / 60)} mins</span>
                </div>
              )}
            </div>

            {/* Day Goals List */}
            {inspectedData.list.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-zinc-950/40 border border-zinc-850/80 text-zinc-500 space-y-1">
                <p className="text-xs">No goals logged on this date</p>
                <p className="text-[10px] text-zinc-600">Select another day or add goals to today</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {inspectedData.list.map((target) => (
                  <div
                    key={target.id}
                    className={`p-2.5 rounded-xl border text-xs transition ${
                      target.completed
                        ? 'bg-zinc-850/70 border-emerald-900/50 text-zinc-200'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            target.completed ? 'text-emerald-400' : 'text-zinc-600'
                          }`}
                        />
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-zinc-100">{target.subject}</span>
                            {target.exercise && (
                              <span className="text-[10px] bg-zinc-800 text-sky-300 px-1.5 py-0.2 rounded font-mono">
                                {target.exercise}
                              </span>
                            )}
                            {target.questionCategory && (
                              <span className="text-[10px] bg-zinc-800 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                                {target.questionCategory}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-2">{target.task}</p>
                          {target.completed && target.completedQuestionsType && (
                            <span className="inline-block mt-1 text-[10px] text-emerald-400 font-medium">
                              ✓ {target.completedQuestionsType === 'all' ? 'All Questions Solved' : `${target.completedQuestionsCount} Questions Solved`}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="text-[10px] font-mono font-medium text-zinc-400 shrink-0">
                        {target.weightage}M
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action to switch selected date */}
          <button
            type="button"
            onClick={() => {
              onSelectDate(activeInspectorDate);
              onNavigateToDaily();
            }}
            className="w-full py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-200 font-medium text-xs flex items-center justify-center gap-1.5 transition active:scale-95 border border-zinc-700/60 shadow-sm"
          >
            <span>Open Goals for This Date</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
