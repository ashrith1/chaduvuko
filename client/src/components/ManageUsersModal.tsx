import React, { useState } from 'react';
import type { User } from '../types';
import { X, Users, Trash2, Edit2, Check, Settings, UserPlus } from 'lucide-react';

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
      alert('You cannot delete the only remaining member.');
      return;
    }
    if (confirm(`Remove "${user.name}" from the study group?`)) {
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
        appBadge: badgeInput.trim() || 'BIEAP 12th'
      });
      onClose();
    } catch (e: any) {
      alert(e.message || 'Error saving settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border-t sm:border border-zinc-800 rounded-t-3xl sm:rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-zinc-100">
              Settings & Friends
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Manage study circle and website name
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 p-1.5 rounded-lg hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="px-4 pt-2 border-b border-zinc-800 flex items-center gap-2 bg-zinc-950/40">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition ${
              activeTab === 'users'
                ? 'border-zinc-100 text-zinc-100 font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Friends ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition ${
              activeTab === 'settings'
                ? 'border-zinc-100 text-zinc-100 font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Website Name</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3.5">
          {activeTab === 'users' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">Members:</span>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAddUserModal();
                  }}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-zinc-100 hover:bg-white text-zinc-900 text-xs font-semibold shadow-sm active:scale-95 transition"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add Friend</span>
                </button>
              </div>

              {/* List of Users */}
              <div className="space-y-1.5">
                {users.map((u) => {
                  const isEditing = editingUserId === u.id;
                  const isCurrent = currentUser?.id === u.id;

                  return (
                    <div
                      key={u.id}
                      className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl flex flex-col gap-2 transition"
                    >
                      {isEditing ? (
                        <div className="space-y-2.5 p-1">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl p-1 bg-zinc-900 rounded-lg">{editAvatar}</span>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              placeholder="Name"
                              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-zinc-100 font-semibold focus:outline-none focus:border-zinc-500"
                              autoFocus
                            />
                          </div>

                          <div>
                            <div className="text-[10px] text-zinc-400 mb-1">Pick Avatar:</div>
                            <div className="flex flex-wrap gap-1">
                              {AVATAR_PRESETS.map((emoji) => (
                                <button
                                  type="button"
                                  key={emoji}
                                  onClick={() => setEditAvatar(emoji)}
                                  className={`p-1.5 rounded-lg border text-sm transition ${
                                    editAvatar === emoji
                                      ? 'bg-zinc-800 border-zinc-500'
                                      : 'bg-zinc-900 border-zinc-800'
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
                              className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-zinc-300 focus:outline-none"
                            >
                              <option value="98%+">98%+</option>
                              <option value="95%+">95%+</option>
                              <option value="90%+">90%+</option>
                              <option value="85%+">85%+</option>
                            </select>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingUserId(null)}
                                className="px-2 py-1 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveUser(u.id)}
                                className="px-3 py-1 rounded-lg bg-zinc-100 text-zinc-900 text-xs font-semibold flex items-center gap-1 hover:bg-white"
                              >
                                <Check className="w-3 h-3" />
                                <span>Save</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl p-1.5 bg-zinc-900 rounded-lg border border-zinc-800">
                              {u.avatar}
                            </span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-zinc-100 text-xs sm:text-sm">{u.name}</span>
                                {isCurrent && (
                                  <span className="text-[10px] bg-zinc-800 text-zinc-300 border border-zinc-750 px-1.5 py-0.2 rounded font-medium">
                                    Active
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-zinc-400">Aim: {u.targetScore || '95%+'}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => startEditUser(u)}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850 transition"
                              title="Edit user"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {users.length > 1 && (
                              <button
                                onClick={() => handleDelete(u)}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-850 transition"
                                title="Remove friend"
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
            <form onSubmit={handleSaveBranding} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Website Title
                </label>
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="e.g. Chaduvuko"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 font-semibold focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Sub-badge / Board
                </label>
                <input
                  type="text"
                  value={badgeInput}
                  onChange={(e) => setBadgeInput(e.target.value)}
                  placeholder="e.g. BIEAP 12th"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                />
              </div>

              {/* Preview */}
              <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-3 space-y-1.5">
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                  Header Preview
                </div>
                <div className="flex items-center gap-2 p-2 bg-zinc-900 rounded-lg border border-zinc-800">
                  <div className="w-6 h-6 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200 text-xs font-bold">
                    C
                  </div>
                  <span className="font-semibold text-zinc-100 text-xs">{titleInput || 'Chaduvuko'}</span>
                  <span className="text-[10px] text-zinc-400 bg-zinc-950 px-1.5 py-0.2 rounded border border-zinc-800">
                    {badgeInput || 'BIEAP 12th'}
                  </span>
                </div>
              </div>

              {/* About Chaduvuko Info Card */}
              <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-3 space-y-1 text-xs">
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                  About Chaduvuko
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Tailored study group tracker designed for <strong>12th Class (BIEAP Andhra Pradesh Board)</strong>. Features official chapter marks weightage, exercise-based Maths planning, peer accountability, and an integrated study timer.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 pb-safe">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-xl text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingSettings || !titleInput.trim()}
                  className="px-5 py-2 bg-zinc-100 hover:bg-white disabled:opacity-50 text-zinc-900 rounded-xl text-xs font-semibold transition shadow-sm active:scale-95"
                >
                  {isSavingSettings ? 'Saving...' : 'Save Name'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
