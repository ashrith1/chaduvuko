import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (data: { name: string; avatar: string; targetScore: string }) => Promise<void>;
}

const AVATAR_OPTIONS = ['🚀', '⚡', '📚', '🎯', '🔥', '🧠', '🌟', '🏆', '💎', '💡'];

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onAddUser }) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🚀');
  const [targetScore, setTargetScore] = useState('95%+');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddUser({
        name: name.trim(),
        avatar,
        targetScore
      });
      setName('');
      onClose();
    } catch (e) {
      alert('Error adding user: ' + e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <h3 className="text-base font-semibold text-slate-100">
              Add Friend to Study Group
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Track 12th Board targets together
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Friend's Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul, Sneha"
              required
              autoFocus
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Choose Avatar Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setAvatar(emoji)}
                  className={`text-xl p-2 rounded-xl border transition ${
                    avatar === emoji
                      ? 'bg-indigo-950 border-indigo-500 shadow-sm'
                      : 'bg-slate-950 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              12th Board Target Aim
            </label>
            <select
              value={targetScore}
              onChange={(e) => setTargetScore(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="98%+ (State Top Rank)" className="bg-slate-900">98%+ (State Top Rank)</option>
              <option value="95%+ (Distinction)" className="bg-slate-900">95%+ (Distinction)</option>
              <option value="90%+ (A1 Grade)" className="bg-slate-900">90%+ (A1 Grade)</option>
              <option value="85%+" className="bg-slate-900">85%+</option>
              <option value="80%+" className="bg-slate-900">80%+</option>
            </select>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Adding...' : 'Add Friend'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
