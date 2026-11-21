import React, { useState } from 'react';
import type { User, Target } from '../types';
import { Share2, Copy, Check, MessageSquare, X, Flame, Clock, Award } from 'lucide-react';

interface ShareReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  selectedDate: string;
  targets: Target[];
}

export const ShareReportModal: React.FC<ShareReportModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  selectedDate,
  targets
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);

  // Filter targets for today and current user
  const todayTargets = targets.filter(
    (t) => t.userId === currentUser?.id && t.date === selectedDate
  );

  const completed = todayTargets.filter((t) => t.completed);
  const totalMinutes = Math.round(todayTargets.reduce((acc, t) => acc + (t.timeSpentSeconds || 0), 0) / 60);

  const formattedDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  // Construct WhatsApp / Markdown report
  const reportText = `🎯 *Chaduvuko Class 12 Board Prep Report*
📅 *Date:* ${formattedDate}
👤 *Student:* ${currentUser?.name || 'User'} (${currentUser?.targetScore || '95%+'} Target)
🔥 *Streak:* ${currentUser?.streak || 1} Days
⏱️ *Study Time:* ${totalMinutes > 0 ? `${totalMinutes} Minutes` : 'Focused Study Session'}

✅ *Completed Goals:*
${
  completed.length > 0
    ? completed
        .map(
          (t) =>
            `• [${t.subject}] ${t.exercise ? `${t.exercise} - ` : ''}${t.chapterName || t.task} (${
              t.completedQuestionsCount ? `${t.completedQuestionsCount} questions` : 'All questions'
            })`
        )
        .join('\n')
    : '• In progress with revision'
}

📊 *Daily Completion:* ${todayTargets.length > 0 ? `${completed.length}/${todayTargets.length} Goals` : 'Planning goals'}
🚀 _Generated with Chaduvuko BIEAP 12th Prep Tracker_`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    if ('vibrate' in navigator) navigator.vibrate(25);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(reportText);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full sm:max-w-md bg-zinc-900 border-t sm:border border-zinc-800 rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl z-50 space-y-4 text-zinc-100 animate-slide-up">
        <div className="w-10 h-1 bg-zinc-700/60 rounded-full mx-auto sm:hidden" />

        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Daily Study Report</h3>
              <p className="text-[11px] text-zinc-400">Share your progress with parents & study group</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Report Preview Box */}
        <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 font-mono text-[11px] leading-relaxed text-zinc-300 max-h-[220px] overflow-y-auto whitespace-pre-wrap select-all">
          {reportText}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={handleCopy}
            className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-zinc-200 font-medium text-xs flex items-center justify-center gap-1.5 active:scale-95 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
            <span>{copied ? 'Copied!' : 'Copy Report'}</span>
          </button>

          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Share on WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
