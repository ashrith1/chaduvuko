import React, { useState } from 'react';
import type { GroupOverview, User } from '../types';
import { Flame, Trophy, CheckCircle2, MessageSquare, Plus, ChevronDown, ChevronUp, Sparkles, Clock, Users } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GroupHubProps {
  currentUser: User | null;
  overview: GroupOverview | null;
  onOpenNewUserModal: () => void;
  onUpdateStatus: (status: string) => void;
}

export const GroupHub: React.FC<GroupHubProps> = ({
  currentUser,
  overview,
  onOpenNewUserModal,
  onUpdateStatus
}) => {
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [statusInput, setStatusInput] = useState('');
  const [isEditingStatus, setIsEditingStatus] = useState(false);

  const members = overview?.members || [];

  // Sort members by today's completed targets or overall completion
  const sortedMembers = [...members].sort((a, b) => {
    if (b.targetsToday.completed !== a.targetsToday.completed) {
      return b.targetsToday.completed - a.targetsToday.completed;
    }
    return b.syllabusCompletionRate - a.syllabusCompletionRate;
  });

  const totalGroupCompletedToday = overview?.todayGroupCompletedCount ?? 0;
  const totalGroupTargetsToday = overview?.todayGroupTargetsCount ?? 0;
  const groupDailyRate = overview?.groupDailyCompletionRate ?? 0;
  const groupAvgSyllabus = overview?.groupAverageSyllabusRate ?? 0;
  const groupStudyMins = overview?.groupTodayStudyMinutes ?? 0;

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (statusInput.trim()) {
      onUpdateStatus(statusInput.trim());
      setIsEditingStatus(false);
      setStatusInput('');
    }
  };

  const sendCheer = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([40, 40, 40]);
    }
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="space-y-5">
      {/* 1. ENTIRE GROUP OVERALL PROGRESS CARD */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Users className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>Entire Group Progress</span>
                <span className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800/60 px-2.5 py-0.5 rounded-full font-semibold">
                  {members.length} Members
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Collective accountability for 12th class board exams.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onOpenNewUserModal}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm active:scale-95 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Friend</span>
            </button>
          </div>
        </div>

        {/* GROUP PROGRESS BAR: Daily Tasks */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Group Daily Goals Completed:</span>
              </span>
              <span className="font-bold text-amber-300">
                {totalGroupCompletedToday}/{totalGroupTargetsToday} Tasks ({groupDailyRate}%)
              </span>
            </div>
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-indigo-500 to-sky-400 rounded-full transition-all duration-500"
                style={{ width: `${groupDailyRate}%` }}
              />
            </div>
          </div>

          {/* GROUP PROGRESS BAR: Overall Board Syllabus Mastery */}
          <div className="pt-2 border-t border-slate-900">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-medium">Group Average Board Syllabus Mastery:</span>
              <span className="font-semibold text-sky-300">{groupAvgSyllabus}%</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full transition-all duration-500"
                style={{ width: `${groupAvgSyllabus}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>{groupStudyMins} mins studied together today</span>
            </span>
            <span>Target: 100% Board Readiness</span>
          </div>
        </div>

        {/* Current User Quick Status Update */}
        {currentUser && (
          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-slate-500">Your Study Status:</span>
              <span className="font-medium text-indigo-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                "{currentUser.status || 'Ready to study'}"
              </span>
            </div>

            {isEditingStatus ? (
              <form onSubmit={handleSaveStatus} className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  placeholder="e.g. Practicing 2-mark Calculus questions..."
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 w-full sm:w-60"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-500 active:scale-95"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingStatus(false)}
                  className="px-2 py-1 text-slate-400 hover:text-slate-200 text-xs"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                onClick={() => {
                  setStatusInput(currentUser.status || '');
                  setIsEditingStatus(true);
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 active:scale-95 transition"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Update Status</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. PROGRESS BAR FOR EACH MEMBER */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-300 px-1">
          Individual Member Progress Bars
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedMembers.map((member) => {
            const isCurrent = member.id === currentUser?.id;
            const isExpanded = expandedUser === member.id;
            const memberTodayTargets = member.targetsToday.list;

            const subjects = ['Maths', 'Physics', 'Chemistry'] as const;
            const subjectSummary = subjects.map((sub) => {
              const list = memberTodayTargets.filter((t) => t.subject === sub);
              const done = list.some((t) => t.completed);
              const count = list.length;
              return { sub, done, count };
            });

            return (
              <div
                key={member.id}
                className={`rounded-3xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-slate-900/90 border-indigo-500/50 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Member Header */}
                <div className="p-4 border-b border-slate-800/70">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2.5 rounded-2xl bg-slate-950 border border-slate-800">
                        {member.avatar}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-slate-100 text-sm">{member.name}</h4>
                          {isCurrent && (
                            <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800/60 px-1.5 py-0.2 rounded font-semibold">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 italic truncate max-w-[170px] mt-0.5">
                          "{member.status || 'Studying'}"
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center justify-end text-amber-400 font-bold text-xs gap-1">
                        <Flame className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{member.streak || 1}d Streak</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">
                        Aim: {member.targetScore || '90%+'}
                      </span>
                    </div>
                  </div>

                  {/* 3-Subject Chips */}
                  <div className="mt-3 grid grid-cols-3 gap-1.5">
                    {subjectSummary.map(({ sub, done, count }) => (
                      <div
                        key={sub}
                        className={`px-2 py-1 rounded-xl text-center border text-[11px] font-medium transition ${
                          done
                            ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300'
                            : count > 0
                            ? 'bg-slate-950 border-slate-800 text-amber-400'
                            : 'bg-slate-950/40 border-slate-900 text-slate-600'
                        }`}
                      >
                        <div className="text-[10px] opacity-75">{sub}</div>
                        <div>{done ? '✓ Done' : count > 0 ? `${count} Pending` : '—'}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* INDIVIDUAL PROGRESS BARS */}
                <div className="p-4 space-y-3.5">
                  {/* Bar 1: Member Today's Tasks Progress */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Today's Tasks:</span>
                      </span>
                      <span className="font-bold text-emerald-300">
                        {member.targetsToday.completed}/{member.targetsToday.total} ({member.dailyCompletionRate}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                        style={{ width: `${member.dailyCompletionRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Bar 2: Member Board Exam Syllabus Weightage Progress */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400 font-medium">Board Weightage Mastered:</span>
                      <span className="font-semibold text-indigo-300">
                        {member.completedWeightage} Marks ({member.syllabusCompletionRate}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full transition-all duration-500"
                        style={{ width: `${member.syllabusCompletionRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Time logged today */}
                  <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Study Time Today:</span>
                    </span>
                    <span className="font-semibold text-slate-100">
                      {member.todayStudyMinutes} minutes
                    </span>
                  </div>

                  {/* Expandable tasks */}
                  {memberTodayTargets.length > 0 && (
                    <div>
                      <button
                        onClick={() => setExpandedUser(isExpanded ? null : member.id)}
                        className="w-full flex items-center justify-between text-[11px] text-slate-400 hover:text-slate-200 transition py-1"
                      >
                        <span>
                          {isExpanded ? 'Hide' : 'See'} {member.name}'s to-dos ({memberTodayTargets.length})
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {memberTodayTargets.map((t) => (
                            <div
                              key={t.id}
                              className={`p-2 rounded-xl text-xs border ${
                                t.completed
                                  ? 'bg-slate-950/30 border-slate-800/40 text-slate-400 line-through'
                                  : 'bg-slate-950 border-slate-800/80 text-slate-200'
                              }`}
                            >
                              <div className="flex items-center gap-1 font-semibold text-[10px] text-indigo-400 mb-0.5">
                                <span>{t.subject}</span>
                                {t.chapterName && <span>• {t.chapterName}</span>}
                                {t.questionCategory && <span>• {t.questionCategory}</span>}
                                {t.weightage ? <span>({t.weightage}m)</span> : null}
                              </div>
                              <p className="text-[11px] leading-snug">{t.task}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Footer: Cheer */}
                <div className="p-3 border-t border-slate-800/60 bg-slate-950/40 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {memberTodayTargets.length === 0 ? 'No tasks set today' : '12th Board Prep'}
                  </span>
                  <button
                    onClick={sendCheer}
                    className="flex items-center gap-1 text-[11px] font-medium px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white active:scale-95 transition"
                    title="Cheer your friend"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Cheer</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
