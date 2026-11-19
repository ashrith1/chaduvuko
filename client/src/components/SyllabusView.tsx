import React, { useState } from 'react';
import type { SubjectType, SyllabusData, ChapterStatus, Chapter } from '../types';
import { Upload, Search, ArrowUpDown, Plus, Sparkles } from 'lucide-react';

interface SyllabusViewProps {
  syllabus: SyllabusData;
  userProgress: Record<string, { status: ChapterStatus; updatedAt: string }>;
  onUpdateStatus: (chapterId: string, status: ChapterStatus) => void;
  onOpenEditorModal: () => void;
  onQuickAddTarget: (subject: SubjectType, chapter: Chapter) => void;
}

export const SyllabusView: React.FC<SyllabusViewProps> = ({
  syllabus,
  userProgress,
  onUpdateStatus,
  onOpenEditorModal,
  onQuickAddTarget
}) => {
  const [selectedSubject, setSelectedSubject] = useState<'All' | SubjectType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'weightage' | 'curriculum' | 'status'>('weightage');

  // Compute total marks
  const subjectTotals = {
    Maths: (syllabus.Maths || []).reduce((acc, c) => acc + (Number(c.weightage) || 0), 0),
    Physics: (syllabus.Physics || []).reduce((acc, c) => acc + (Number(c.weightage) || 0), 0),
    Chemistry: (syllabus.Chemistry || []).reduce((acc, c) => acc + (Number(c.weightage) || 0), 0)
  };
  const grandTotal = subjectTotals.Maths + subjectTotals.Physics + subjectTotals.Chemistry;

  // Flatten chapters with subject tag
  let allChapters: (Chapter & { subject: SubjectType })[] = [];
  if (selectedSubject === 'All' || selectedSubject === 'Maths') {
    (syllabus.Maths || []).forEach((c) => allChapters.push({ ...c, subject: 'Maths' }));
  }
  if (selectedSubject === 'All' || selectedSubject === 'Physics') {
    (syllabus.Physics || []).forEach((c) => allChapters.push({ ...c, subject: 'Physics' }));
  }
  if (selectedSubject === 'All' || selectedSubject === 'Chemistry') {
    (syllabus.Chemistry || []).forEach((c) => allChapters.push({ ...c, subject: 'Chemistry' }));
  }

  // Filter by search
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    allChapters = allChapters.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.unit && c.unit.toLowerCase().includes(q)) ||
        c.subject.toLowerCase().includes(q)
    );
  }

  // Sort
  if (sortBy === 'weightage') {
    allChapters.sort((a, b) => (Number(b.weightage) || 0) - (Number(a.weightage) || 0));
  } else if (sortBy === 'status') {
    const statusOrder: Record<ChapterStatus, number> = {
      not_started: 0,
      in_progress: 1,
      completed: 2,
      revised: 3
    };
    allChapters.sort((a, b) => {
      const sa = statusOrder[userProgress[a.id]?.status || 'not_started'];
      const sb = statusOrder[userProgress[b.id]?.status || 'not_started'];
      return sb - sa;
    });
  }

  // User completion stats
  let completedWeightage = 0;
  allChapters.forEach((c) => {
    const st = userProgress[c.id]?.status;
    if (st === 'completed' || st === 'revised') {
      completedWeightage += Number(c.weightage) || 0;
    } else if (st === 'in_progress') {
      completedWeightage += (Number(c.weightage) || 0) * 0.4;
    }
  });

  const percentComplete = grandTotal > 0 ? Math.round((completedWeightage / grandTotal) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Syllabus Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-100">
                Andhra Pradesh Board (BIEAP) 2nd Year Blueprint
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                Official {grandTotal} Marks
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Exact chapter-wise question breakdowns: 1-Mark, 2-Marks, 4-Marks, and 8-Marks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenEditorModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold transition active:scale-95"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
              <span>Edit / Upload Custom</span>
            </button>
          </div>
        </div>

        {/* Board Marks Breakdown */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-medium">BIEAP Papers:</span>
            <span className="bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800 text-indigo-300 font-semibold">
              Maths: 136M (13 Topics)
            </span>
            <span className="bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800 text-sky-300 font-semibold">
              Physics: 109M (14 Units)
            </span>
            <span className="bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800 text-emerald-300 font-semibold">
              Chemistry: 109M (10 Units)
            </span>
          </div>

          <div className="text-slate-300 font-semibold">
            Your Board Coverage: <span className="text-amber-400 font-bold">{Math.round(completedWeightage)}/{grandTotal} Marks</span> ({percentComplete}%)
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        {/* Subject Pills */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(['All', 'Maths', 'Physics', 'Chemistry'] as const).map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition active:scale-95 ${
                selectedSubject === sub
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lesson name..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-xl text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value="weightage" className="bg-slate-900">Highest Weightage</option>
              <option value="curriculum" className="bg-slate-900">Curriculum Order</option>
              <option value="status" className="bg-slate-900">My Mastery</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chapters Grid / List with exact Question Type Breakdown */}
      <div className="space-y-3">
        {allChapters.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-3xl">
            <p className="text-sm text-slate-400">No chapters found matching "{searchQuery}"</p>
          </div>
        ) : (
          allChapters.map((chapter) => {
            const currentStatus = userProgress[chapter.id]?.status || 'not_started';
            const bd = chapter.breakdown || { '1M': 0, '2M': 0, '4M': 0, '8M': 0 };

            const subjectColor =
              chapter.subject === 'Maths'
                ? 'text-indigo-400 bg-indigo-950/70 border-indigo-800/60'
                : chapter.subject === 'Physics'
                ? 'text-sky-400 bg-sky-950/70 border-sky-800/60'
                : 'text-emerald-400 bg-emerald-950/70 border-emerald-800/60';

            const has8MarkLAQ = (bd['8M'] || 0) > 0;

            return (
              <div
                key={chapter.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-sm"
              >
                {/* Left: Chapter Details & Question Breakdown Pills */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${subjectColor}`}>
                      {chapter.subject}
                    </span>

                    {has8MarkLAQ && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        8-Mark LAQ ({bd['8M']} Qs)
                      </span>
                    )}

                    {chapter.weightage >= 15 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
                        🔥 High Yield ({chapter.weightage}M)
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-100 tracking-tight">
                    {chapter.name}
                  </h4>

                  {/* Question Types Distribution Chips */}
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-500 font-medium mr-1">Questions:</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                        bd['1M'] > 0
                          ? 'bg-indigo-950/60 text-indigo-300 border-indigo-800/60'
                          : 'bg-slate-950 text-slate-600 border-slate-900'
                      }`}
                    >
                      1M: {bd['1M'] || 0} Q
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                        bd['2M'] > 0
                          ? 'bg-sky-950/60 text-sky-300 border-sky-800/60'
                          : 'bg-slate-950 text-slate-600 border-slate-900'
                      }`}
                    >
                      2M: {bd['2M'] || 0} Q
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                        bd['4M'] > 0
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                          : 'bg-slate-950 text-slate-600 border-slate-900'
                      }`}
                    >
                      4M: {bd['4M'] || 0} Q
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                        bd['8M'] > 0
                          ? 'bg-amber-950/80 text-amber-300 border-amber-800/80 font-bold'
                          : 'bg-slate-950 text-slate-600 border-slate-900'
                      }`}
                    >
                      8M: {bd['8M'] || 0} Q
                    </span>
                  </div>
                </div>

                {/* Right: Weightage & Actions */}
                <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/70">
                  {/* Total Marks badge */}
                  <div className="text-center px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 min-w-[76px]">
                    <div className="text-xs font-bold text-amber-300">
                      {chapter.weightage} Marks
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">BIEAP Board</div>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={currentStatus}
                    onChange={(e) => onUpdateStatus(chapter.id, e.target.value as ChapterStatus)}
                    className={`text-xs font-semibold rounded-xl px-2.5 py-2 border transition cursor-pointer focus:outline-none ${
                      currentStatus === 'completed'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : currentStatus === 'revised'
                        ? 'bg-purple-950 text-purple-300 border-purple-800'
                        : currentStatus === 'in_progress'
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    <option value="not_started" className="bg-slate-900 text-slate-300">⚪ Not Started</option>
                    <option value="in_progress" className="bg-slate-900 text-amber-300">🟡 In Progress</option>
                    <option value="completed" className="bg-slate-900 text-emerald-300">🟢 Mastered</option>
                    <option value="revised" className="bg-slate-900 text-purple-300">⭐ Revised (Exam Ready)</option>
                  </select>

                  {/* Quick Add Target button */}
                  <button
                    onClick={() => onQuickAddTarget(chapter.subject, chapter)}
                    className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm active:scale-95 transition"
                    title="Set as daily to-do target"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
