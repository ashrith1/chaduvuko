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
}

const SUBJECT_CONFIG: Record<
  SubjectType,
  {
    color: string;
    border: string;
    bg: string;
    badgeBg: string;
    badgeText: string;
    icon: string;
  }
> = {
  Maths: {
    color: 'text-indigo-400',
    border: 'border-indigo-500/30',
    bg: 'bg-indigo-950/20',
    badgeBg: 'bg-indigo-950/70 border border-indigo-800/60',
    badgeText: 'text-indigo-300',
    icon: '📐'
  },
  Physics: {
    color: 'text-sky-400',
    border: 'border-sky-500/30',
    bg: 'bg-sky-950/20',
    badgeBg: 'bg-sky-950/70 border border-sky-800/60',
    badgeText: 'text-sky-300',
    icon: '⚡'
  },
  Chemistry: {
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-950/20',
    badgeBg: 'bg-emerald-950/70 border border-emerald-800/60',
    badgeText: 'text-emerald-300',
    icon: '🧪'
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
  onStartTimerForTarget
}) => {
  const subjects: SubjectType[] = ['Maths', 'Physics', 'Chemistry'];

  // State for completion dialog
  const [completingTarget, setCompletingTarget] = useState<Target | null>(null);

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
      // Toggle off directly if already completed
      onToggleTarget(target.id);
    } else {
      // Open dialog to specify "All Questions" or "Custom Number"
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
    <div className="space-y-5">
      {/* Daily Progress Banner (with Member Progress Bar) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentUser?.avatar || '👤'}</span>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
                {currentUser?.name ? `${currentUser.name}'s Daily Targets` : 'Daily Study Goals'}
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-slate-800 text-slate-300 border border-slate-700">
                {selectedDate}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Target at least one core chapter in Maths, Physics, and Chemistry each day.
            </p>
          </div>

          {/* Quick Action: Assign Task for All Members */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onOpenAddModal('Maths', true)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 active:scale-95 transition"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Create Task for ALL Members</span>
            </button>
          </div>
        </div>

        {/* Member's Individual Daily Progress Bar */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Your Daily Goal Progress:</span>
            </span>
            <span className="font-bold text-slate-100">
              {completedTargets} of {totalTargets} Completed ({memberDailyCompletionPercent}%)
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${memberDailyCompletionPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
            <span>Subjects Done: <b className="text-slate-200">{subjectsCompletedCount}/3</b></span>
            <span>Target Marks: <b className="text-amber-400">{completedWeightageToday}/{totalWeightageToday} Marks</b></span>
          </div>
        </div>

        {/* 3-Subject Status Pills */}
        <div className="grid grid-cols-3 gap-2">
          {subjects.map((sub) => {
            const hasDone = targetsBySubject[sub].some((t) => t.completed);
            const hasAny = targetsBySubject[sub].length > 0;
            const cfg = SUBJECT_CONFIG[sub];

            return (
              <div
                key={sub}
                className={`py-2 px-1.5 rounded-xl border text-center transition ${
                  hasDone
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : hasAny
                    ? 'bg-slate-950 border-slate-800 text-slate-300'
                    : 'bg-slate-950/40 border-slate-900 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-center gap-1 text-xs font-semibold">
                  <span>{cfg.icon}</span>
                  <span>{sub}</span>
                </div>
                <div className="text-[10px] mt-0.5">
                  {hasDone ? (
                    <span className="text-emerald-400 font-bold">✓ Cleared</span>
                  ) : hasAny ? (
                    <span className="text-amber-400 font-medium">Pending</span>
                  ) : (
                    <span className="text-slate-600">Not Set</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 Subject Columns / Mobile Stack */}
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
              className={`rounded-3xl border ${cfg.border} bg-slate-900/60 backdrop-blur-sm flex flex-col justify-between overflow-hidden shadow-sm`}
            >
              {/* Header */}
              <div className="p-3.5 sm:p-4 border-b border-slate-800/80 bg-slate-900/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{cfg.icon}</span>
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm tracking-tight">
                      {subject}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <span>{doneCount}/{subTargets.length} done</span>
                      {subjectWeightage > 0 && <span>• {subjectWeightage} Marks</span>}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onOpenAddModal(subject, false)}
                  className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-xl ${cfg.badgeBg} ${cfg.badgeText} font-semibold active:scale-95 transition`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Target</span>
                </button>
              </div>

              {/* Task Cards List */}
              <div className="p-3 space-y-2.5 flex-1 min-h-[140px]">
                {subTargets.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-5 border border-dashed border-slate-800/80 rounded-2xl">
                    <p className="text-xs text-slate-400 font-medium">No {subject} goals yet</p>
                    <button
                      onClick={() => onOpenAddModal(subject, false)}
                      className={`mt-2.5 text-xs font-semibold px-3 py-1.5 rounded-xl ${cfg.badgeBg} ${cfg.badgeText} transition active:scale-95 flex items-center gap-1`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Set {subject} Target</span>
                    </button>
                  </div>
                ) : (
                  subTargets.map((target) => (
                    <div
                      key={target.id}
                      className={`group p-3.5 rounded-2xl border transition-all ${
                        target.completed
                          ? 'bg-slate-950/50 border-emerald-950/60 shadow-sm'
                          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {/* Checkbox (Click opens completion count dialog) */}
                        <button
                          onClick={() => handleCheckboxClick(target)}
                          className="mt-0.5 p-1 text-slate-400 hover:text-slate-100 active:scale-90 transition"
                          title={target.completed ? "Mark incomplete" : "End & complete task"}
                        >
                          {target.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-500 hover:text-slate-300" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          {/* Badges: Chapter + Exercise (Maths) + Question Category (Physics/Chem) */}
                          <div className="flex items-center gap-1.5 flex-wrap mb-1">
                            {target.chapterName && (
                              <span className="text-[10px] font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md truncate max-w-[150px]">
                                {target.chapterName}
                              </span>
                            )}

                            {/* Specific Maths Exercise Badge */}
                            {target.exercise && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800/80">
                                📖 {target.exercise}
                              </span>
                            )}

                            {/* Science Question Category Badge */}
                            {target.questionCategory && target.questionCategory !== 'All' && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60">
                                {target.questionCategory} Questions
                              </span>
                            )}

                            {target.weightage ? (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-amber-300">
                                {target.weightage}M
                              </span>
                            ) : null}
                          </div>

                          {/* Task Description */}
                          <p
                            className={`text-xs leading-relaxed ${
                              target.completed
                                ? 'line-through text-slate-400'
                                : 'text-slate-100 font-medium'
                            }`}
                          >
                            {target.task}
                          </p>

                          {/* Completed Questions Log Badge */}
                          {target.completed && (
                            <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>
                                {target.completedQuestionsType === 'all'
                                  ? 'Completed: All Questions'
                                  : `Completed: ${target.completedQuestionsCount || ''} Questions`}
                              </span>
                            </div>
                          )}

                          {/* Timer status & controls */}
                          <div className="mt-2.5 flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-800/60">
                            <span className="text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {target.timeSpentSeconds
                                ? `${Math.round(target.timeSpentSeconds / 60)}m logged`
                                : 'No timer logged'}
                            </span>

                            <div className="flex items-center gap-2">
                              {!target.completed && (
                                <button
                                  onClick={() => setCompletingTarget(target)}
                                  className="px-2 py-0.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/70 font-semibold active:scale-95 transition"
                                >
                                  End Task
                                </button>
                              )}

                              <button
                                onClick={() => onStartTimerForTarget(target.id)}
                                className="px-2 py-0.5 rounded-lg bg-slate-950 hover:bg-indigo-950 text-indigo-300 border border-slate-800 hover:border-indigo-800/60 flex items-center gap-1 active:scale-95 transition"
                                title="Start study timer for this task"
                              >
                                <Play className="w-2.5 h-2.5 fill-current" />
                                <span>Timer</span>
                              </button>

                              <button
                                onClick={() => onDeleteTarget(target.id)}
                                className="p-1 text-slate-500 hover:text-rose-400 transition"
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
      <div className="flex items-center justify-between p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-2xl text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="truncate">Check chapter weightages and exercises</span>
        </div>
        <button
          onClick={onNavigateToSyllabus}
          className="text-indigo-400 hover:text-indigo-300 font-semibold transition text-xs shrink-0 ml-2"
        >
          View All Lessons & Exercises →
        </button>
      </div>
    </div>
  );
};
