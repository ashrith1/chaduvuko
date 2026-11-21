import React, { useState } from 'react';
import type { User } from '../types';
import {
  Shield,
  Users,
  Plus,
  Trash2,
  Send,
  BookOpen,
  Flame,
  X
} from 'lucide-react';

interface AdminMonitorViewProps {
  currentUser: User | null;
  users: User[];
  auditMembers: any[];
  onOpenAddUserModal: () => void;
  onOpenBroadcastModal: () => void;
  onOpenSyllabusEditor: () => void;
  onDeleteUser: (id: string) => Promise<void>;
  onUpdatePin: (userId: string, pin: string) => Promise<void>;
  onAssignTargetToUser: (user: User) => void;
}

export const AdminMonitorView: React.FC<AdminMonitorViewProps> = ({
  currentUser,
  users,
  auditMembers,
  onOpenAddUserModal,
  onOpenBroadcastModal,
  onOpenSyllabusEditor,
  onDeleteUser,
  onUpdatePin,
  onAssignTargetToUser
}) => {
  const [pinChangeUserId, setPinChangeUserId] = useState<string | null>(null);
  const [newPinInput, setNewPinInput] = useState('');
  const [isUpdatingPin, setIsUpdatingPin] = useState(false);

  const totalStudents = users.length;
  const totalCompletedGoals = auditMembers.reduce((acc, m) => acc + (m.completedLifetimeTargets || 0), 0);
  const totalStudyHours = auditMembers.reduce((acc, m) => acc + (m.totalStudyHours || 0), 0).toFixed(1);

  const handleSavePin = async (userId: string) => {
    if (newPinInput.trim().length < 4) {
      alert('PIN must be at least 4 digits');
      return;
    }
    setIsUpdatingPin(true);
    try {
      await onUpdatePin(userId, newPinInput.trim());
      setPinChangeUserId(null);
      setNewPinInput('');
      alert('Security PIN updated successfully!');
    } catch (e: any) {
      alert(e.message || 'Failed to update PIN');
    } finally {
      setIsUpdatingPin(false);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-zinc-900 to-zinc-900 border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center shadow-inner">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-zinc-100 tracking-tight">
                  Admin Supervisor Control
                </h2>
                <span className="text-[10px] bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold px-2 py-0.5 rounded-full">
                  Admin: {currentUser?.name}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Monitor student study integrity, review progress, manage accounts, and assign problem sets
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={onOpenBroadcastModal}
              className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Target</span>
            </button>

            <button
              type="button"
              onClick={onOpenAddUserModal}
              className="py-1.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 border border-zinc-700/80 active:scale-95 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Student</span>
            </button>

            <button
              type="button"
              onClick={onOpenSyllabusEditor}
              className="py-1.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 border border-zinc-700/80 active:scale-95 transition"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Edit Syllabus</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-zinc-800 text-xs">
          <div className="bg-zinc-950/70 border border-zinc-800/80 p-3 rounded-xl text-center">
            <div className="text-[10px] text-zinc-400 font-medium">Students Enrolled</div>
            <div className="text-sm sm:text-base font-bold text-zinc-100 mt-0.5">{totalStudents} Members</div>
          </div>
          <div className="bg-zinc-950/70 border border-zinc-800/80 p-3 rounded-xl text-center">
            <div className="text-[10px] text-zinc-400 font-medium">Total Solved Goals</div>
            <div className="text-sm sm:text-base font-bold text-emerald-400 mt-0.5">{totalCompletedGoals} Tasks</div>
          </div>
          <div className="bg-zinc-950/70 border border-zinc-800/80 p-3 rounded-xl text-center">
            <div className="text-[10px] text-zinc-400 font-medium">Total Group Study Time</div>
            <div className="text-sm sm:text-base font-bold text-indigo-400 mt-0.5">{totalStudyHours} Hours</div>
          </div>
        </div>
      </div>

      {/* Student Audit Roster */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-zinc-300" />
            <span>Individual Student Progress & Account Security</span>
          </h3>
          <span className="text-[11px] text-zinc-500">{users.length} active students</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {users.map((user) => {
            const audit = auditMembers.find((m) => m.id === user.id) || {};
            const isAdmin = user.role === 'admin' || user.id === 'u-1';
            const userPin = user.pin || '1234';

            return (
              <div
                key={user.id}
                className={`p-4 rounded-2xl border transition shadow-sm space-y-3.5 ${
                  isAdmin
                    ? 'bg-zinc-900/80 border-amber-500/30 ring-1 ring-amber-500/10'
                    : 'bg-zinc-900/60 border-zinc-800/80'
                }`}
              >
                {/* Top Profile Strip */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-zinc-950 border border-zinc-800">
                      {user.avatar}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-sm text-zinc-100">{user.name}</span>
                        {isAdmin ? (
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5">
                            <Shield className="w-2.5 h-2.5" /> Admin
                          </span>
                        ) : (
                          <span className="text-[9px] bg-zinc-800 text-zinc-400 border border-zinc-700 px-1.5 py-0.2 rounded font-medium">
                            Student
                          </span>
                        )}
                        <span className="text-[10px] text-zinc-400 bg-zinc-950 px-1.5 py-0.2 rounded border border-zinc-850">
                          Target: {user.targetScore}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                        <span className="text-zinc-300 truncate max-w-[150px]">{user.status}</span>
                        <span>&bull;</span>
                        <span className="text-amber-400 font-medium flex items-center gap-0.5">
                          <Flame className="w-3 h-3 fill-amber-400" /> {user.streak}d streak
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Security PIN badge */}
                  <div className="text-right">
                    <div className="text-[10px] text-zinc-500 font-mono">PIN: <strong className="text-zinc-200">{userPin}</strong></div>
                    <button
                      type="button"
                      onClick={() => {
                        setPinChangeUserId(user.id);
                        setNewPinInput(userPin);
                      }}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 underline mt-0.5"
                    >
                      Change PIN
                    </button>
                  </div>
                </div>

                {/* Audit Performance Metrics */}
                <div className="grid grid-cols-3 gap-2 bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-850 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-500">Completed</span>
                    <div className="font-bold text-emerald-400 mt-0.5">
                      {audit.completedLifetimeTargets || 0} / {audit.totalLifetimeTargets || 0}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500">Study Time</span>
                    <div className="font-bold text-indigo-400 mt-0.5">
                      {audit.totalStudyHours || 0} hrs
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500">Syllabus</span>
                    <div className="font-bold text-amber-400 mt-0.5">
                      {audit.syllabusCompletionRate || 0}%
                    </div>
                  </div>
                </div>

                {/* PIN Change Dialog (Inline) */}
                {pinChangeUserId === user.id && (
                  <div className="p-3 bg-zinc-950 rounded-xl border border-indigo-500/40 space-y-2 animate-fade-in">
                    <div className="flex items-center justify-between text-xs text-zinc-200 font-medium">
                      <span>Set New 4-Digit PIN for {user.name}</span>
                      <button
                        type="button"
                        onClick={() => setPinChangeUserId(null)}
                        className="text-zinc-500 hover:text-zinc-300"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={newPinInput}
                        onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 5678"
                        className="bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-lg text-xs text-white font-mono tracking-widest focus:outline-none focus:border-indigo-500 w-full"
                      />
                      <button
                        type="button"
                        onClick={() => handleSavePin(user.id)}
                        disabled={isUpdatingPin || newPinInput.length < 4}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold whitespace-nowrap transition active:scale-95 disabled:opacity-40"
                      >
                        Save PIN
                      </button>
                    </div>
                  </div>
                )}

                {/* Card Action Buttons */}
                <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80 text-xs">
                  <button
                    type="button"
                    onClick={() => onAssignTargetToUser(user)}
                    className="py-1.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-zinc-200 font-medium flex items-center gap-1.5 active:scale-95 transition"
                  >
                    <Plus className="w-3 h-3 text-indigo-400" />
                    <span>Assign Goal</span>
                  </button>

                  {!isAdmin && users.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Remove student "${user.name}" from the group?`)) {
                          onDeleteUser(user.id);
                        }
                      }}
                      className="py-1.5 px-2.5 rounded-xl text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-900/50 flex items-center gap-1 transition"
                      title="Remove student"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
