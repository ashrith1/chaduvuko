import React, { useState } from 'react';
import type { User } from '../types';
import { X, Users, Trash2, Edit2, Check, Settings, Sparkles, UserPlus } from 'lucide-react';

interface ManageUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  currentUser: User | null;
  appTitle: string;
  appBadge: string;
  onUpdateUser: (id: string, payload: Partial<User>) => Promise<void>;
  onDeleteUser: (id: string) => Promise<void>;
  onOpenAddUserModal: () => void;
  onSaveSettings: (settings: { appTitle: string; appBadge: string }) => Promise<void>;
}

const AVATAR_PRESETS = ['🚀', '⚡', '📚', '🎯', '🔥', '🧠', '🌟', '🏆', '💎', '💡', '🦁', '🦅'];

export const ManageUsersModal: React.FC<ManageUsersModalProps> = ({
  isOpen,
  onClose,
  users,
  currentUser,
  appTitle,
  appBadge,
  onUpdateUser,
  onDeleteUser,
  onOpenAddUserModal,
  onSaveSettings
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'users' | 'settings'>('users');

  // Editing user state
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('🚀');
  const [editTargetScore, setEditTargetScore] = useState('95%+');

  // Website settings state
  const [titleInput, setTitleInput] = useState(appTitle);
  const [badgeInput, setBadgeInput] = useState(appBadge);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const startEditUser = (user: User) => {
    setEditingUserId(user.id);
    setEditName(user.name);
    setEditAvatar(user.avatar || '🚀');
    setEditTargetScore(user.targetScore || '95%+');
  };

  const handleSaveUser = async (id: string) => {
    if (!editName.trim()) return;
    try {
      await onUpdateUser(id, {
        name: editName.trim(),
        avatar: editAvatar,
        targetScore: editTargetScore
      });
      setEditingUserId(null);
    } catch (e: any) {
      alert(e.message || 'Error updating user');
    }
  };

  const handleDelete = async (user: User) => {
    if (users.length <= 1) {
      alert('You cannot delete the only remaining member in the group.');
      return;
    }
    if (confirm(`Are you sure you want to remove "${user.name}" from the study group? All their assigned targets will also be removed.`)) {
      try {
        await onDeleteUser(user.id);
      } catch (e: any) {
        alert(e.message || 'Error deleting user');
      }
    }
  };

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;
    setIsSavingSettings(true);
    try {
      await onSaveSettings({
        appTitle: titleInput.trim(),
        appBadge: badgeInput.trim() || 'BIEAP State Board'
      });
      alert('Website name updated successfully!');
      onClose();
    } catch (e: any) {
      alert(e.message || 'Error saving settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Manage Users & App Settings
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Edit friends, change website name, and customize branding
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 p-2 rounded-xl hover:bg-slate-800 transition active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="px-4 pt-3 border-b border-slate-800 flex items-center gap-2 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 transition ${
              activeTab === 'users'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Manage Friends ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 transition ${
              activeTab === 'settings'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Change Website Name</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'users' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Study Circle Members:</span>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAddUserModal();
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm active:scale-95 transition"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Add New Friend</span>
                </button>
              </div>

              {/* List of Users */}
              <div className="space-y-2">
                {users.map((u) => {
                  const isEditing = editingUserId === u.id;
                  const isCurrent = currentUser?.id === u.id;

                  return (
                    <div
                      key={u.id}
                      className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col gap-2.5 transition"
                    >
                      {isEditing ? (
                        /* Inline Edit Form */
                        <div className="space-y-3 p-1">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl p-1 bg-slate-900 rounded-lg">{editAvatar}</span>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              placeholder="Friend's Name"
                              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100 font-bold focus:outline-none focus:border-indigo-500"
                              autoFocus
                            />
                          </div>

                          <div>
                            <div className="text-[10px] text-slate-400 mb-1">Pick Avatar:</div>
                            <div className="flex flex-wrap gap-1.5">
                              {AVATAR_PRESETS.map((emoji) => (
                                <button
                                  type="button"
                                  key={emoji}
                                  onClick={() => setEditAvatar(emoji)}
                                  className={`p-1.5 rounded-lg border text-sm transition ${
                                    editAvatar === emoji
                                      ? 'bg-indigo-950 border-indigo-500'
                                      : 'bg-slate-900 border-slate-800'
                                  }`}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <select
                              value={editTargetScore}
                              onChange={(e) => setEditTargetScore(e.target.value)}
                              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none"
                            >
                              <option value="98%+ (State Top Rank)">98%+ (Top Rank)</option>
                              <option value="95%+ (Distinction)">95%+ (Distinction)</option>
                              <option value="90%+ (A1 Grade)">90%+ (A1 Grade)</option>
                              <option value="85%+">85%+</option>
                            </select>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingUserId(null)}
                                className="px-2.5 py-1 rounded-lg text-xs text-slate-400 hover:text-slate-200"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveUser(u.id)}
                                className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                <span>Save</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Normal User Row */
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl p-2 bg-slate-900 rounded-xl border border-slate-800/80">
                              {u.avatar}
                            </span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-100 text-xs sm:text-sm">{u.name}</span>
                                {isCurrent && (
                                  <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800/60 px-1.5 py-0.2 rounded font-semibold">
                                    Active
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-400">Aim: {u.targetScore || '95%+'}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => startEditUser(u)}
                              className="p-2 rounded-xl text-slate-400 hover:text-indigo-300 hover:bg-slate-900 transition"
                              title="Edit user details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {users.length > 1 && (
                              <button
                                onClick={() => handleDelete(u)}
                                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition"
                                title="Remove friend from group"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <form onSubmit={handleSaveBranding} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Website / App Title
                </label>
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="e.g. 12th Prep, BIEAP Toppers, Ashrith & Friends"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-bold focus:outline-none focus:border-indigo-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Appears in the header and on your phone browser tab.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Sub-badge / Tagline
                </label>
                <input
                  type="text"
                  value={badgeInput}
                  onChange={(e) => setBadgeInput(e.target.value)}
                  placeholder="e.g. BIEAP State Board, 2nd Year MPC, Class of 2027"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Live Preview Card */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Live Header Preview
                </div>
                <div className="flex items-center gap-2.5 p-2 bg-slate-900/90 rounded-xl border border-slate-800">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm">{titleInput || '12th Prep'}</span>
                    <span className="text-[10px] font-semibold bg-indigo-950 text-indigo-300 px-1.5 py-0.2 rounded border border-indigo-800/60">
                      {badgeInput || 'State Board'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 pb-safe">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingSettings || !titleInput.trim()}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/30 flex items-center gap-1.5 active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSavingSettings ? 'Saving...' : 'Save Website Name'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
