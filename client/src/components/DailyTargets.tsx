import React, { useState } from 'react';
import type { SubjectType, Target, User } from '../types';
import { CheckCircle2, Circle, Plus, Trash2, BookOpen, Users, Play, Clock, Check } from 'lucide-react';
import { CompleteTaskModal } from './CompleteTaskModal';

interface DailyTargetsProps {
  currentUser: User | null;
  selectedDate: string;
  targets: Target[];
  onToggleTarget: (id: string, options?: { completedQuestionsType?: 'all' | 'custom'; completedQuestionsCount?: number }) => void;
  onDeleteTarget: (id: string) => void;
  onOpenAddModal: (subject: SubjectType, broadcast?: boolean) => void;
  onNavigateToSyllabus: () => void;
  onStartTimerForTarget: (targetId: string) => void;
  onRescheduleTarget?: (id: string, newDate: string) => void;
}

const SUBJECT_CONFIG: Record<
  SubjectType,
  {
    badgeText: string;
    icon: string;
    dotColor: string;
    glowClass: string;
    borderAccent: string;
    gradientBg: string;
  }
> = {
  Maths: {
    badgeText: 'text-violet-400',
    icon: '📐',
    dotColor: 'bg-violet-400',
    glowClass: 'glow-maths',
    borderAccent: 'border-violet-500/30',
    gradientBg: 'from-violet-950/20 via-zinc-900/70 to-zinc-950/90'
  },
  Physics: {
    badgeText: 'text-sky-400',
    icon: '⚡',
    dotColor: 'bg-sky-400',
    glowClass: 'glow-physics',
    borderAccent: 'border-sky-500/30',
    gradientBg: 'from-sky-950/20 via-zinc-900/70 to-zinc-950/90'
  },
  Chemistry: {
    badgeText: 'text-emerald-400',
    icon: '🧪',
    dotColor: 'bg-emerald-400',
    glowClass: 'glow-chemistry',
    borderAccent: 'border-emerald-500/30',
    gradientBg: 'from-emerald-950/20 via-zinc-900/70 to-zinc-950/90'
  }
};

export const DailyTargets: React.FC<DailyTargetsProps> = ({
  currentUser,
  selectedDate,
  targets,
  onToggleTarget,
  onDeleteTarget,
  onOpenAddModal,
  onNavigateToSyllabus,
  onStartTimerForTarget,
  onRescheduleTarget
}) => {
  const subjects: SubjectType[] = ['Maths', 'Physics', 'Chemistry'];

  // State for completion dialog
  const [completingTarget, setCompletingTarget] = useState<Target | null>(null);

  // Filter targets for current user and date
  const userTargets = targets.filter(
    (t) => t.userId === currentUser?.id && t.date === selectedDate
  );

  // Pending targets from previous days
  const pendingPreviousTargets = targets.filter(
    (t) => t.userId === currentUser?.id && !t.completed && t.date < selectedDate
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
    <div className="space-y-4 pb-12 sm:pb-4">
      {/* Daily Progress Glassmorphic Hero Card */}
      <div className="glass-panel rounded-3xl p-4 sm:p-6 space-y-5 shadow-2xl relative overflow-hidden">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-2xl p-1.5 rounded-xl bg-zinc-950/70 border border-white/10 shadow-inner">
                {currentUser?.avatar || '👤'}
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>{currentUser?.name ? `${currentUser.name}'s Goals` : 'Daily Goals'}</span>
                  {currentUser?.streak ? (
                    <span className="text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      🔥 {currentUser.streak}d streak
                    </span>
                  ) : null}
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  BIEAP 12th Board checklist • Track daily marks mastery
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action: Group Broadcast */}
          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              onClick={() => onOpenAddModal('Maths', true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-bold shadow-lg shadow-white/5 active-press transition"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Broadcast to Group</span>
            </button>
          </div>
        </div>

        {/* Dynamic Dual Progress Meter */}
        <div className="relative z-10 space-y-2.5 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-200 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Today's Completion:</span>
              <strong className="text-emerald-300 font-bold ml-0.5">
                {completedTargets} of {totalTargets} ({memberDailyCompletionPercent}%)
              </strong>
            </span>
            <span className="text-xs font-semibold text-zinc-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
              Marks Earned: <strong className="text-violet-300">{completedWeightageToday}/{totalWeightageToday} M</strong>
            </span>
          </div>

          {/* Glowing Multi-Segment Progress Bar */}
          <div className="w-full h-2.5 bg-zinc-950/80 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${memberDailyCompletionPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-0.5">
            <span className="flex items-center gap-1">
              <span>Subjects Active:</span>
              <strong className="text-zinc-200">{subjectsCompletedCount}/3 completed</strong>
            </span>
            <span className="font-mono text-zinc-400">📅 {selectedDate}</span>
          </div>
        </div>

        {/* 3-Subject Modern Status Chips */}
        <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-3">
          {subjects.map((sub) => {
            const hasDone = targetsBySubject[sub].some((t) => t.completed);
            const hasAny = targetsBySubject[sub].length > 0;
            const cfg = SUBJECT_CONFIG[sub];

            return (
              <div
                key={sub}
                className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                  hasDone
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200 shadow-sm'
                    : hasAny
                    ? 'bg-zinc-900/60 border-white/10 text-zinc-200'
                    : 'bg-zinc-950/40 border-white/5 text-zinc-500'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold">
                  <span>{cfg.icon}</span>
                  <span className={cfg.badgeText}>{sub}</span>
                </div>
                <div className="text-[10px] mt-0.5 font-medium">
                  {hasDone ? (
                    <span className="text-emerald-400 font-bold">✓ 100% Done</span>
                  ) : hasAny ? (
                    <span className="text-amber-400">In Progress</span>
                  ) : (
                    <span className="text-zinc-500">No Goals</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unfinished Previous Targets Banner */}
      {pendingPreviousTargets.length > 0 && (
        <div className="glass-panel border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs animate-fade-in shadow-lg glow-amber">
          <div className="flex items-center gap-2.5 text-amber-300">
            <Clock className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              You have <strong className="text-amber-100 font-bold">{pendingPreviousTargets.length}</strong> unfinished goal(s) from earlier days.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              pendingPreviousTargets.forEach((t) => onRescheduleTarget?.(t.id, selectedDate));
            }}
            className="px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 rounded-xl font-semibold text-xs whitespace-nowrap transition active-press"
          >
            Carry Over to Today &rarr;
          </button>
        </div>
      )}

      {/* 3 Subject Columns / Glassmorphic Glowing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
              className={`rounded-3xl border ${cfg.borderAccent} bg-gradient-to-b ${cfg.gradientBg} ${cfg.glowClass} backdrop-blur-xl flex flex-col justify-between overflow-hidden shadow-xl transition-all duration-300`}
            >
              {/* Header */}
              <div className="p-4 border-b border-white/5 bg-zinc-950/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl p-1 rounded-xl bg-zinc-900/80 border border-white/10 shadow-sm">{cfg.icon}</span>
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      {subject}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                      <span className="font-medium text-zinc-300">{doneCount}/{subTargets.length} done</span>
                      {subjectWeightage > 0 && <span>• <strong className={cfg.badgeText}>{subjectWeightage} Marks</strong></span>}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onOpenAddModal(subject, false)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 font-semibold active-press transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Goal</span>
                </button>
              </div>

              {/* Task Cards List */}
              <div className="p-3 space-y-2.5 flex-1 min-h-[140px]">
                {subTargets.length === 0 ? (
                  <div className="h-full min-h-[130px] flex flex-col items-center justify-center text-center p-4 border border-dashed border-white/10 rounded-2xl bg-zinc-950/20">
                    <p className="text-xs text-zinc-500 font-medium">No {subject} goals for today</p>
                    <button
                      onClick={() => onOpenAddModal(subject, false)}
                      className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white border border-white/10 transition active-press flex items-center gap-1.5"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Set {subject} Goal</span>
                    </button>
                  </div>
                ) : (
                  subTargets.map((target) => (
                    <div
                      key={target.id}
                      className={`group p-3.5 rounded-2xl border transition-all duration-200 active-press ${
                        target.completed
                          ? 'glass-card opacity-70 border-white/5 bg-zinc-950/50'
                          : 'glass-card hover:border-white/20 bg-zinc-900/60 shadow-lg'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Interactive Checkbox with Glow */}
                        <button
                          onClick={() => handleCheckboxClick(target)}
                          className="mt-0.5 p-0.5 text-zinc-400 hover:text-white active:scale-90 transition shrink-0"
                          title={target.completed ? "Mark incomplete" : "End & complete task"}
                        >
                          {target.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                          ) : (
                            <Circle className="w-5 h-5 text-zinc-600 hover:text-zinc-300" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          {/* Badges */}
                          <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                            {target.chapterName && (
                              <span className="text-[10px] font-semibold text-zinc-200 bg-white/10 px-2 py-0.5 rounded-md truncate max-w-[140px] border border-white/5">
                                {target.chapterName}
                              </span>
                            )}

                            {target.exercise && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-violet-500/15 text-violet-300 border border-violet-500/30">
                                {target.exercise}
                              </span>
                            )}

                            {target.questionCategory && target.questionCategory !== 'All' && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                {target.questionCategory}
                              </span>
                            )}

                            {target.weightage ? (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-zinc-800/80 text-zinc-300 border border-white/5">
                                {target.weightage}M
                              </span>
                            ) : null}
                          </div>

                          {/* Task Description */}
                          <p
                            className={`text-xs leading-relaxed font-medium ${
                              target.completed
                                ? 'line-through text-zinc-500'
                                : 'text-zinc-100'
                            }`}
                          >
                            {target.task}
                          </p>

                          {/* Completed Questions Log Badge */}
                          {target.completed && (
                            <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md shadow-sm">
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>
                                {target.completedQuestionsType === 'all'
                                  ? 'All Questions Completed'
                                  : `${target.completedQuestionsCount || ''} Questions Logged`}
                              </span>
                            </div>
                          )}

                          {/* Action footer */}
                          <div className="mt-2.5 flex items-center justify-between text-[11px] pt-2 border-t border-white/5">
                            <span className="text-zinc-400 flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3 text-zinc-500" />
                              {target.timeSpentSeconds
                                ? `${Math.round(target.timeSpentSeconds / 60)}m`
                                : '0m'}
                            </span>

                            <div className="flex items-center gap-1.5">
                              {!target.completed && (
                                <button
                                  onClick={() => setCompletingTarget(target)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-semibold text-[11px] active:scale-95 transition"
                                >
                                  End Task
                                </button>
                              )}

                              <button
                                onClick={() => onStartTimerForTarget(target.id)}
                                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-200 border border-white/10 flex items-center gap-1 active:scale-95 transition text-[11px] font-medium"
                                title="Start focus timer for this goal"
                              >
                                <Play className="w-2.5 h-2.5 fill-current text-emerald-400" />
                                <span>Focus</span>
                              </button>

                              <button
                                onClick={() => onDeleteTarget(target.id)}
                                className="p-1 text-zinc-500 hover:text-rose-400 transition"
                                title="Delete task"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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
