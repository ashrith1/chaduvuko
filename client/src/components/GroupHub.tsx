import React, { useState } from 'react';
import type { GroupOverview, User } from '../types';
import { Flame, Trophy, CheckCircle2, MessageSquare, Plus, ChevronDown, ChevronUp, Sparkles, Clock, Users } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GroupHubProps {
  currentUser: User | null;
  overview: GroupOverview | null;
  onOpenNewUserModal: () => void;
  onUpdateStatus: (status: string) => void;
  onSelectUser?: (user: User) => void;
}

export const GroupHub: React.FC<GroupHubProps> = ({
  currentUser,
  overview,
  onOpenNewUserModal,
  onUpdateStatus,
  onSelectUser
}) => {
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [statusInput, setStatusInput] = useState('');
  const [isEditingStatus, setIsEditingStatus] = useState(false);

  const members = overview?.members || [];

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
    <div className="space-y-4">
      {/* 1. ENTIRE GROUP OVERALL PROGRESS CARD */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-zinc-300">
                <Users className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-sm sm:text-base font-semibold text-zinc-100 flex items-center gap-2">
                <span>Group Accountability</span>
                <span className="text-[11px] bg-zinc-800 text-zinc-300 border border-zinc-700/60 px-2 py-0.5 rounded-full font-medium">
                  {members.length} Friends
                </span>
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Collective target tracking and daily study streaks.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onOpenNewUserModal}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-900 text-xs font-semibold shadow-sm active:scale-95 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Friend</span>
            </button>
          </div>
        </div>

        {/* Minimal Group Progress Bars */}
        <div className="bg-zinc-950/60 border border-zinc-800/60 rounded-xl p-3.5 space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-zinc-300 font-medium flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Group Daily Goals Completed:</span>
              </span>
              <span className="font-semibold text-zinc-100">
                {totalGroupCompletedToday}/{totalGroupTargetsToday} ({groupDailyRate}%)
              </span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-300"
                style={{ width: `${groupDailyRate}%` }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-850">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-zinc-400 font-medium">Average Syllabus Mastery:</span>
              <span className="font-semibold text-zinc-200">{groupAvgSyllabus}%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${groupAvgSyllabus}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-0.5">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <Clock className="w-3 h-3" />
              <span>{groupStudyMins}m group study logged today</span>
            </span>
            <span>Target: 100% Mastery</span>
          </div>
        </div>

        {/* Current User Status Update */}
        {currentUser && (
          <div className="pt-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <span className="text-zinc-500">Your Status:</span>
              <span className="font-medium text-zinc-200 bg-zinc-950 px-2 py-0.5 rounded-lg border border-zinc-800">
                "{currentUser.status || 'Ready to study'}"
              </span>
            </div>

            {isEditingStatus ? (
              <form onSubmit={handleSaveStatus} className="flex items-center gap-1.5 w-full sm:w-auto">
                <input
                  type="text"
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  placeholder="e.g. Practicing 2-mark questions..."
                  className="bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-zinc-100 focus:outline-none focus:border-zinc-500 w-full sm:w-60"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-zinc-100 text-zinc-900 rounded-lg text-xs font-semibold hover:bg-white active:scale-95"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingStatus(false)}
                  className="px-2 py-1 text-zinc-400 hover:text-zinc-200 text-xs"
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
                className="text-xs text-zinc-300 hover:text-white font-medium flex items-center gap-1 active:scale-95 transition"
              >
                <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                <span>Update Status</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. PROGRESS BAR FOR EACH MEMBER */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-1">
          Study Group Members ({sortedMembers.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
                className={`rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-zinc-900/80 border-zinc-700 shadow-md'
                    : 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                {/* Member Header */}
                <div className="p-3.5 border-b border-zinc-800/70">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl p-2 rounded-xl bg-zinc-950 border border-zinc-800">
                        {member.avatar}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-semibold text-zinc-100 text-xs sm:text-sm">{member.name}</h4>
                          {isCurrent ? (
                            <span className="text-[10px] bg-zinc-800 text-zinc-300 border border-zinc-700 px-1.5 py-0.2 rounded font-medium">
                              You
                            </span>
                          ) : onSelectUser ? (
                            <button
                              onClick={() => {
                                if ('vibrate' in navigator) navigator.vibrate(25);
                                onSelectUser(member);
                              }}
                              className="text-[10px] bg-zinc-800 hover:bg-zinc-750 text-zinc-300 border border-zinc-700 px-1.5 py-0.2 rounded font-medium transition active:scale-95"
                              title={`Switch to ${member.name}`}
                            >
                              Switch
                            </button>
                          ) : null}
                        </div>
                        <p className="text-[11px] text-zinc-400 italic truncate max-w-[160px] mt-0.5">
                          "{member.status || 'Studying'}"
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center justify-end text-amber-400 font-medium text-xs gap-1">
                        <Flame className="w-3 h-3 fill-amber-400" />
                        <span>{member.streak || 1}d</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-medium">
                        Goal: {member.targetScore || '90%+'}
                      </span>
                    </div>
                  </div>

                  {/* 3-Subject Chips */}
                  <div className="mt-2.5 grid grid-cols-3 gap-1">
                    {subjectSummary.map(({ sub, done, count }) => (
                      <div
                        key={sub}
                        className={`px-1.5 py-1 rounded-lg text-center border text-[10px] font-medium transition ${
                          done
                            ? 'bg-zinc-800/90 border-emerald-500/40 text-emerald-300'
                            : count > 0
                            ? 'bg-zinc-850 border-zinc-800 text-zinc-300'
                            : 'bg-zinc-900/40 border-zinc-850 text-zinc-600'
                        }`}
                      >
                        <div className="opacity-75">{sub}</div>
                        <div>{done ? '✓ Done' : count > 0 ? `${count} Pending` : '—'}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress bars */}
                <div className="p-3.5 space-y-2.5">
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-zinc-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Today's Tasks:</span>
                      </span>
                      <span className="font-semibold text-zinc-200">
                        {member.targetsToday.completed}/{member.targetsToday.total} ({member.dailyCompletionRate}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                        style={{ width: `${member.dailyCompletionRate}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-zinc-400 font-medium">Board Weightage:</span>
                      <span className="font-semibold text-zinc-300">
                        {member.completedWeightage}M ({member.syllabusCompletionRate}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-zinc-300 rounded-full transition-all duration-300"
                        style={{ width: `${member.syllabusCompletionRate}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-400 bg-zinc-950/40 p-2 rounded-lg border border-zinc-800/60">
                    <span className="flex items-center gap-1 text-zinc-400">
                      <Clock className="w-3 h-3" />
                      <span>Study Log:</span>
                    </span>
                    <span className="font-medium text-zinc-200">
                      {member.todayStudyMinutes} mins
                    </span>
                  </div>

                  {memberTodayTargets.length > 0 && (
                    <div>
                      <button
                        onClick={() => setExpandedUser(isExpanded ? null : member.id)}
                        className="w-full flex items-center justify-between text-[11px] text-zinc-400 hover:text-zinc-200 transition py-0.5"
                      >
                        <span>
                          {isExpanded ? 'Hide' : 'Show'} to-dos ({memberTodayTargets.length})
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="mt-1.5 space-y-1 max-h-40 overflow-y-auto pr-1">
                          {memberTodayTargets.map((t) => (
                            <div
                              key={t.id}
                              className={`p-1.5 rounded-lg text-xs border ${
                                t.completed
                                  ? 'bg-zinc-950/30 border-zinc-800/40 text-zinc-500 line-through'
                                  : 'bg-zinc-950/80 border-zinc-800 text-zinc-200'
                              }`}
                            >
                              <div className="flex items-center gap-1 font-medium text-[10px] text-zinc-400">
                                <span>{t.subject}</span>
                                {t.chapterName && <span>• {t.chapterName}</span>}
                              </div>
                              <p className="text-[11px]">{t.task}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Cheer footer */}
                <div className="p-2.5 border-t border-zinc-800/60 bg-zinc-950/30 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500">
                    {memberTodayTargets.length === 0 ? 'No tasks yet' : 'Board Prep'}
                  </span>
                  <button
                    onClick={sendCheer}
                    className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white active:scale-95 transition"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
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
