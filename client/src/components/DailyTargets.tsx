import React, { useState } from 'react';
import type { SubjectType, Target, User } from '../types';
import { CheckCircle2, Circle, Plus, Trash2, BookOpen, Users, Play, Clock, Check } from 'lucide-react';
import { CompleteTaskModal } from './CompleteTaskModal';

interface DailyTargetsProps {
  currentUser: User | null;
  users?: User[];
  selectedDate: string;
  targets: Target[];
  onToggleTarget: (id: string, options?: { completedQuestionsType?: 'all' | 'custom'; completedQuestionsCount?: number }) => void;
  onDeleteTarget: (id: string) => void;
  onOpenAddModal: (subject: SubjectType, broadcast?: boolean) => void;
  onNavigateToSyllabus: () => void;
  onStartTimerForTarget: (targetId: string) => void;
  onSelectUser?: (user: User) => void;
}

const SUBJECT_CONFIG: Record<
  SubjectType,
  {
    badgeText: string;
    icon: string;
    dotColor: string;
  }
> = {
  Maths: {
    badgeText: 'text-violet-400',
    icon: '📐',
    dotColor: 'bg-violet-400'
  },
  Physics: {
    badgeText: 'text-sky-400',
    icon: '⚡',
    dotColor: 'bg-sky-400'
  },
  Chemistry: {
    badgeText: 'text-emerald-400',
    icon: '🧪',
    dotColor: 'bg-emerald-400'
  }
};

export const DailyTargets: React.FC<DailyTargetsProps> = ({
  currentUser,
  users = [],
  selectedDate,
  targets,
  onToggleTarget,
  onDeleteTarget,
  onOpenAddModal,
  onNavigateToSyllabus,
  onStartTimerForTarget,
  onSelectUser
}) => {
  const subjects: SubjectType[] = ['Maths', 'Physics', 'Chemistry'];

  // State for completion dialog & quick user switcher
  const [completingTarget, setCompletingTarget] = useState<Target | null>(null);
  const [quickSwitcherOpen, setQuickSwitcherOpen] = useState(false);

  // Filter targets for current user and date
  const userTargets = targets.filter(
    (t) => t.userId === currentUser?.id && t.date === selectedDate
  );

  const targetsBySubject = subjects.reduce((acc, sub) => {
    acc[sub] = userTargets.filter((t) => t.subject === sub);
    return acc;
  }, {} as Record<SubjectType, Target[]>);

  const totalTargets = userTargets.length;
  const completedTargets = userTargets.filter((t) => t.completed).length;

  const memberDailyCompletionPercent = totalTargets > 0
    ? Math.round((completedTargets / totalTargets) * 100)
    : 0;

  const subjectsCompletedCount = subjects.filter((sub) =>
    targetsBySubject[sub].some((t) => t.completed)
  ).length;

  const totalWeightageToday = userTargets.reduce(
    (acc, t) => acc + (t.weightage || 0),
    0
  );

  const completedWeightageToday = userTargets
    .filter((t) => t.completed)
    .reduce((acc, t) => acc + (t.weightage || 0), 0);

  const handleCheckboxClick = (target: Target) => {
    if (target.completed) {
      onToggleTarget(target.id);
    } else {
      setCompletingTarget(target);
    }
  };

  const handleConfirmCompletion = (targetId: string, completedQuestionsType: 'all' | 'custom', count?: number) => {
    onToggleTarget(targetId, {
      completedQuestionsType,
      completedQuestionsCount: count
    });
  };

  return (
    <div className="space-y-4">
      {/* Daily Progress Minimal Card */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg">{currentUser?.avatar || '👤'}</span>
              <h2 className="text-sm sm:text-base font-semibold text-zinc-100 tracking-tight">
                {currentUser?.name ? `${currentUser.name}'s Daily Goals` : 'Daily Goals'}
              </h2>

              {/* Quick Profile Switcher Pill */}
              {users.length > 1 && onSelectUser && (
                <div className="relative">
                  <button
                    onClick={() => setQuickSwitcherOpen(!quickSwitcherOpen)}
                    className="text-[11px] px-2 py-0.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-300 border border-zinc-700/80 transition flex items-center gap-1 font-medium active:scale-95"
                    title="Switch student"
                  >
                    <span>Switch</span>
                    <span className="text-[9px] text-zinc-400">▾</span>
                  </button>

                  {quickSwitcherOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setQuickSwitcherOpen(false)}
                      />
                      <div className="absolute left-0 mt-1.5 w-44 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl py-1 z-40 animate-fade-in">
                        <div className="px-3 py-1 text-[10px] font-semibold text-zinc-500 uppercase">
                          Select Student
                        </div>
                        {users.map((u) => {
                          const isSel = u.id === currentUser?.id;
                          return (
                            <button
                              key={u.id}
                              onClick={() => {
                                if ('vibrate' in navigator) navigator.vibrate(25);
                                onSelectUser(u);
                                setQuickSwitcherOpen(false);
                              }}
                              className={`w-full text-left px-3 py-1.5 flex items-center justify-between text-xs transition ${
                                isSel
                                  ? 'bg-zinc-800 text-zinc-100 font-semibold'
                                  : 'text-zinc-300 hover:bg-zinc-800/60'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span>{u.avatar}</span>
                                <span className="truncate">{u.name}</span>
                              </div>
                              {isSel && <Check className="w-3.5 h-3.5 text-zinc-200" />}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Maths, Physics & Chemistry target checklist for today.
            </p>
          </div>

          {/* Quick Action: Assign Task for All Members */}
          <div className="w-full sm:w-auto">
            <button
              onClick={() => onOpenAddModal('Maths', true)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-900 text-xs font-semibold shadow-sm active:scale-95 transition"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Create Task for Group</span>
            </button>
          </div>
        </div>

        {/* Minimal Progress Bar (Sleek 4px) */}
        <div className="space-y-2 pt-1 border-t border-zinc-800/60">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-300 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Completed:</span>
              <strong className="text-zinc-100 font-semibold ml-1">
                {completedTargets} of {totalTargets} ({memberDailyCompletionPercent}%)
              </strong>
            </span>
            <span className="text-[11px] text-zinc-400">
              Marks: <strong className="text-zinc-200">{completedWeightageToday}/{totalWeightageToday} M</strong>
            </span>
          </div>

          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${memberDailyCompletionPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-0.5">
            <span>Subjects Done: <strong className="text-zinc-200">{subjectsCompletedCount}/3</strong></span>
            <span>Date: <strong className="text-zinc-300">{selectedDate}</strong></span>
          </div>
        </div>

        {/* 3-Subject Minimal Status Chips */}
        <div className="grid grid-cols-3 gap-2">
          {subjects.map((sub) => {
            const hasDone = targetsBySubject[sub].some((t) => t.completed);
            const hasAny = targetsBySubject[sub].length > 0;
            const cfg = SUBJECT_CONFIG[sub];

            return (
              <div
                key={sub}
                className={`py-2 px-2 rounded-xl border text-center transition ${
                  hasDone
                    ? 'bg-zinc-800/80 border-emerald-500/40 text-emerald-300'
                    : hasAny
                    ? 'bg-zinc-850/60 border-zinc-800 text-zinc-300'
                    : 'bg-zinc-900/30 border-zinc-850 text-zinc-500'
                }`}
              >
                <div className="flex items-center justify-center gap-1 text-xs font-medium">
                  <span>{cfg.icon}</span>
                  <span>{sub}</span>
                </div>
                <div className="text-[10px] mt-0.5">
                  {hasDone ? (
                    <span className="text-emerald-400 font-semibold">✓ Done</span>
                  ) : hasAny ? (
                    <span className="text-amber-400 font-medium">Pending</span>
                  ) : (
                    <span className="text-zinc-600">None</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 Subject Columns / Clean Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {subjects.map((subject) => {
          const cfg = SUBJECT_CONFIG[subject];
          const subTargets = targetsBySubject[subject];
          const doneCount = subTargets.filter((t) => t.completed).length;
          const subjectWeightage = subTargets.reduce(
            (acc, t) => acc + (t.weightage || 0),
            0
          );

          return (
            <div
              key={subject}
              className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 backdrop-blur-sm flex flex-col justify-between overflow-hidden shadow-sm"
            >
              {/* Header */}
              <div className="p-3.5 border-b border-zinc-800/80 bg-zinc-900/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{cfg.icon}</span>
                  <div>
                    <h3 className="font-semibold text-zinc-100 text-xs sm:text-sm">
                      {subject}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                      <span>{doneCount}/{subTargets.length} done</span>
                      {subjectWeightage > 0 && <span>• {subjectWeightage} Marks</span>}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onOpenAddModal(subject, false)}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700/60 font-medium active:scale-95 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Target</span>
                </button>
              </div>

              {/* Task Cards List */}
              <div className="p-2.5 space-y-2 flex-1 min-h-[120px]">
                {subTargets.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4 border border-dashed border-zinc-800/80 rounded-xl">
                    <p className="text-xs text-zinc-500 font-medium">No {subject} tasks set</p>
                    <button
                      onClick={() => onOpenAddModal(subject, false)}
                      className="mt-2 text-xs font-medium px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white transition active:scale-95 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Set Target</span>
                    </button>
                  </div>
                ) : (
                  subTargets.map((target) => (
                    <div
                      key={target.id}
                      className={`group p-3 rounded-xl border transition-all ${
                        target.completed
                          ? 'bg-zinc-950/40 border-zinc-850 opacity-80'
                          : 'bg-zinc-850/50 border-zinc-800/80 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {/* Minimal Checkbox */}
                        <button
                          onClick={() => handleCheckboxClick(target)}
                          className="mt-0.5 p-0.5 text-zinc-400 hover:text-zinc-100 active:scale-90 transition shrink-0"
                          title={target.completed ? "Mark incomplete" : "End & complete task"}
                        >
                          {target.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-950" />
                          ) : (
                            <Circle className="w-4 h-4 text-zinc-500 hover:text-zinc-300" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          {/* Badges */}
                          <div className="flex items-center gap-1.5 flex-wrap mb-1">
                            {target.chapterName && (
                              <span className="text-[10px] font-medium text-zinc-300 bg-zinc-800/80 px-1.5 py-0.2 rounded truncate max-w-[140px]">
                                {target.chapterName}
                              </span>
                            )}

                            {target.exercise && (
                              <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-zinc-800 text-violet-300 border border-zinc-700">
                                {target.exercise}
                              </span>
                            )}

                            {target.questionCategory && target.questionCategory !== 'All' && (
                              <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-zinc-800 text-amber-300 border border-zinc-700">
                                {target.questionCategory}
                              </span>
                            )}

                            {target.weightage ? (
                              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                                {target.weightage}M
                              </span>
                            ) : null}
                          </div>

                          {/* Task Description */}
                          <p
                            className={`text-xs leading-relaxed ${
                              target.completed
                                ? 'line-through text-zinc-500'
                                : 'text-zinc-200'
                            }`}
                          >
                            {target.task}
                          </p>

                          {/* Completed Questions Log Badge */}
                          {target.completed && (
                            <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-1.5 py-0.5 rounded">
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>
                                {target.completedQuestionsType === 'all'
                                  ? 'All Questions'
                                  : `${target.completedQuestionsCount || ''} Questions Done`}
                              </span>
                            </div>
                          )}

                          {/* Action footer */}
                          <div className="mt-2 flex items-center justify-between text-[10px] pt-1.5 border-t border-zinc-800/50">
                            <span className="text-zinc-500 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-zinc-500" />
                              {target.timeSpentSeconds
                                ? `${Math.round(target.timeSpentSeconds / 60)}m`
                                : '0m'}
                            </span>

                            <div className="flex items-center gap-1.5">
                              {!target.completed && (
                                <button
                                  onClick={() => setCompletingTarget(target)}
                                  className="px-2 py-0.5 rounded-md bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 font-medium active:scale-95 transition"
                                >
                                  End Task
                                </button>
                              )}

                              <button
                                onClick={() => onStartTimerForTarget(target.id)}
                                className="px-2 py-0.5 rounded-md bg-zinc-800 hover:bg-zinc-750 text-zinc-300 border border-zinc-700 flex items-center gap-1 active:scale-95 transition"
                                title="Start study timer for this task"
                              >
                                <Play className="w-2.5 h-2.5 fill-current" />
                                <span>Timer</span>
                              </button>

                              <button
                                onClick={() => onDeleteTarget(target.id)}
                                className="p-1 text-zinc-500 hover:text-rose-400 transition"
                                title="Delete task"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Modal */}
      <CompleteTaskModal
        isOpen={!!completingTarget}
        target={completingTarget}
        onClose={() => setCompletingTarget(null)}
        onConfirmComplete={handleConfirmCompletion}
      />

      {/* Footer link to syllabus */}
      <div className="flex items-center justify-between p-3 bg-zinc-900/40 border border-zinc-800/80 rounded-xl text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="truncate">View AP BIEAP chapter list & question weightages</span>
        </div>
        <button
          onClick={onNavigateToSyllabus}
          className="text-zinc-200 hover:text-white font-medium transition text-xs shrink-0 ml-2"
        >
          View Syllabus →
        </button>
      </div>
    </div>
  );
};
