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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              Add Friend to Group
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Study 12th Board targets together
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 p-1.5 rounded-lg hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Friend's Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul, Sneha"
              required
              autoFocus
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Avatar
            </label>
            <div className="flex flex-wrap gap-1.5">
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setAvatar(emoji)}
                  className={`text-lg p-2 rounded-xl border transition ${
                    avatar === emoji
                      ? 'bg-zinc-800 border-zinc-500 shadow-sm'
                      : 'bg-zinc-950 border-zinc-850 hover:bg-zinc-800'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Target Aim
            </label>
            <select
              value={targetScore}
              onChange={(e) => setTargetScore(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600"
            >
              <option value="98%+ (State Top Rank)">98%+ (State Top Rank)</option>
              <option value="95%+ (Distinction)">95%+ (Distinction)</option>
              <option value="90%+ (A1 Grade)">90%+ (A1 Grade)</option>
              <option value="85%+">85%+</option>
              <option value="80%+">80%+</option>
            </select>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="px-4 py-2 bg-zinc-100 hover:bg-white disabled:opacity-50 text-zinc-900 rounded-xl text-xs font-semibold transition shadow-sm flex items-center gap-1.5"
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
