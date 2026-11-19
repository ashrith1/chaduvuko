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

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    allChapters = allChapters.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.unit && c.unit.toLowerCase().includes(q)) ||
        c.subject.toLowerCase().includes(q)
    );
  }

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
    <div className="space-y-4">
      {/* Syllabus Header Banner */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-semibold text-zinc-100">
                AP BIEAP Class 12 Blueprint
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-zinc-800 text-zinc-300 border border-zinc-750">
                {grandTotal} Marks Total
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Chapter-wise blueprints: 1-Mark, 2-Marks, 4-Marks, and 8-Marks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenEditorModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white border border-zinc-700/60 text-xs font-medium transition active:scale-95"
            >
              <Upload className="w-3.5 h-3.5 text-zinc-400" />
              <span>Edit / Upload</span>
            </button>
          </div>
        </div>

        {/* Board Marks Breakdown */}
        <div className="pt-2.5 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-800 text-zinc-300 font-medium text-[11px]">
              Maths: 136M
            </span>
            <span className="bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-800 text-zinc-300 font-medium text-[11px]">
              Physics: 109M
            </span>
            <span className="bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-800 text-zinc-300 font-medium text-[11px]">
              Chemistry: 109M
            </span>
          </div>

          <div className="text-zinc-300 text-xs">
            Your Coverage: <strong className="text-zinc-100">{Math.round(completedWeightage)}/{grandTotal} Marks</strong> ({percentComplete}%)
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-800/80">
        {/* Subject Pills */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
          {(['All', 'Maths', 'Physics', 'Chemistry'] as const).map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition active:scale-95 ${
                selectedSubject === sub
                  ? 'bg-zinc-800 text-zinc-100 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chapter..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-2.5 py-1 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 placeholder:text-zinc-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 px-2 py-1 rounded-lg text-xs text-zinc-300">
            <ArrowUpDown className="w-3 h-3 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-zinc-300 text-xs focus:outline-none cursor-pointer"
            >
              <option value="weightage" className="bg-zinc-900">Weightage</option>
              <option value="curriculum" className="bg-zinc-900">Curriculum</option>
              <option value="status" className="bg-zinc-900">Mastery</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chapters List */}
      <div className="space-y-2">
        {allChapters.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-zinc-800 rounded-2xl">
            <p className="text-xs text-zinc-500">No chapters found</p>
          </div>
        ) : (
          allChapters.map((chapter) => {
            const currentStatus = userProgress[chapter.id]?.status || 'not_started';
            const bd = chapter.breakdown || { '1M': 0, '2M': 0, '4M': 0, '8M': 0 };
            const has8MarkLAQ = (bd['8M'] || 0) > 0;

            return (
              <div
                key={chapter.id}
                className="bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 rounded-xl p-3 sm:p-3.5 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-sm"
              >
                {/* Left */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {chapter.subject}
                    </span>

                    {has8MarkLAQ && (
                      <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        8-Mark LAQ
                      </span>
                    )}

                    {chapter.weightage >= 15 && (
                      <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-zinc-800 text-rose-300 border border-zinc-700">
                        High Yield
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs sm:text-sm font-semibold text-zinc-100">
                    {chapter.name}
                  </h4>

                  {/* Question Types Distribution Chips */}
                  <div className="mt-1.5 flex items-center gap-1.5 flex-wrap text-[10px]">
                    <span className="text-zinc-500">Breakdown:</span>
                    <span className="px-1.5 py-0.2 rounded bg-zinc-950 border border-zinc-800 text-zinc-400">
                      1M: {bd['1M'] || 0}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-zinc-950 border border-zinc-800 text-zinc-400">
                      2M: {bd['2M'] || 0}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-zinc-950 border border-zinc-800 text-zinc-400">
                      4M: {bd['4M'] || 0}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded border ${
                      bd['8M'] > 0
                        ? 'bg-amber-950/60 border-amber-800/60 text-amber-300 font-medium'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-600'
                    }`}>
                      8M: {bd['8M'] || 0}
                    </span>
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-zinc-800/60">
                  <div className="text-center px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 min-w-[70px]">
                    <div className="text-xs font-semibold text-zinc-200">
                      {chapter.weightage} Marks
                    </div>
                  </div>

                  <select
                    value={currentStatus}
                    onChange={(e) => onUpdateStatus(chapter.id, e.target.value as ChapterStatus)}
                    className="text-xs font-medium rounded-lg px-2 py-1.5 bg-zinc-900 border border-zinc-750 text-zinc-300 focus:outline-none"
                  >
                    <option value="not_started">⚪ Not Started</option>
                    <option value="in_progress">🟡 In Progress</option>
                    <option value="completed">🟢 Mastered</option>
                    <option value="revised">⭐ Revised</option>
                  </select>

                  <button
                    onClick={() => onQuickAddTarget(chapter.subject, chapter)}
                    className="p-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-900 active:scale-95 transition"
                    title="Set as target"
                  >
                    <Plus className="w-3.5 h-3.5" />
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
