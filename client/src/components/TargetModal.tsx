import React, { useState, useEffect } from 'react';
import type { SubjectType, SyllabusData, Chapter, Target, QuestionCategory } from '../types';
import { X, Plus, Users, Sparkles, BookOpen } from 'lucide-react';

interface TargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject: SubjectType;
  defaultChapter?: Chapter | null;
  syllabus: SyllabusData;
  userId: string;
  selectedDate: string;
  onSaveTarget: (target: Omit<Target, 'id' | 'completed' | 'completedAt'>) => Promise<void>;
  onBroadcastTarget: (target: Omit<Target, 'id' | 'userId' | 'completed' | 'completedAt'>) => Promise<void>;
}

export const TargetModal: React.FC<TargetModalProps> = ({
  isOpen,
  onClose,
  defaultSubject,
  defaultChapter,
  syllabus,
  userId,
  selectedDate,
  onSaveTarget,
  onBroadcastTarget
}) => {
  if (!isOpen) return null;

  const [subject, setSubject] = useState<SubjectType>(defaultSubject);
  const [selectedChapterId, setSelectedChapterId] = useState<string>(defaultChapter?.id || '');
  const [questionCategory, setQuestionCategory] = useState<QuestionCategory>('2M');
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [taskText, setTaskText] = useState('');
  const [assignToAll, setAssignToAll] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setSubject(defaultSubject);
    if (defaultChapter) {
      setSelectedChapterId(defaultChapter.id);
    } else {
      setSelectedChapterId(syllabus[defaultSubject]?.[0]?.id || '');
    }
  }, [defaultSubject, defaultChapter, syllabus]);

  const currentChapters = syllabus[subject] || [];
  const activeChapter = currentChapters.find((c) => c.id === selectedChapterId) || currentChapters[0];

  // Auto-set initial exercise or question type when chapter or subject changes
  useEffect(() => {
    if (activeChapter) {
      if (subject === 'Maths') {
        const exercises = activeChapter.exercises || ['Exercise 1(a)', 'Chapter MCQs'];
        const firstEx = exercises[0] || 'Exercise 1(a)';
        setSelectedExercise(firstEx);
        setTaskText(`Solve problems from ${firstEx} in ${activeChapter.name}`);
      } else {
        const breakdown = activeChapter.breakdown || { '1M': 0, '2M': 0, '4M': 0, '8M': 0 };
        const available = (['1M', '2M', '4M', '8M'] as const).filter((cat) => (breakdown[cat] || 0) > 0);
        const pick = available.includes(questionCategory as any) ? questionCategory : (available[0] || '2M');
        setQuestionCategory(pick);
        autoFillScienceTask(pick, activeChapter.name);
      }
    }
  }, [selectedChapterId, subject]);

  const handleSubjectChange = (newSub: SubjectType) => {
    setSubject(newSub);
    const firstOfNew = syllabus[newSub]?.[0];
    if (firstOfNew) {
      setSelectedChapterId(firstOfNew.id);
    }
  };

  const autoFillScienceTask = (cat: QuestionCategory, chapName: string) => {
    if (cat === '1M') {
      setTaskText(`Practice 1-Mark Very Short Answer Questions & MCQs in ${chapName}`);
    } else if (cat === '2M') {
      setTaskText(`Practice 2-Mark Short Answer Questions in ${chapName}`);
    } else if (cat === '4M') {
      setTaskText(`Solve 4-Mark Problem Questions & Numericals in ${chapName}`);
    } else if (cat === '8M') {
      setTaskText(`Master and write out 8-Mark Long Answer Derivations in ${chapName}`);
    } else {
      setTaskText(`Practice Board Exam Questions in ${chapName}`);
    }
  };

  const handleSelectExercise = (ex: string) => {
    setSelectedExercise(ex);
    setTaskText(`Solve problems from ${ex} in ${activeChapter?.name || 'Mathematics'}`);
  };

  const handleSelectQuestionType = (cat: '1M' | '2M' | '4M' | '8M') => {
    setQuestionCategory(cat);
    autoFillScienceTask(cat, activeChapter?.name || 'Chapter');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        subject,
        chapterId: activeChapter?.id || null,
        chapterName: activeChapter?.name || '',
        weightage: activeChapter?.weightage || 0,
        questionCategory: subject === 'Maths' ? null : questionCategory,
        exercise: subject === 'Maths' ? selectedExercise : null,
        task: taskText.trim(),
        date: selectedDate
      };

      if (assignToAll) {
        await onBroadcastTarget(payload);
      } else {
        await onSaveTarget({
          ...payload,
          userId
        });
      }

      setTaskText('');
      onClose();
    } catch (err) {
      alert('Error creating target: ' + err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const breakdown = activeChapter?.breakdown || { '1M': 0, '2M': 0, '4M': 0, '8M': 0 };
  const exercises = activeChapter?.exercises || [];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-100">
                {assignToAll ? 'Assign Task to All Friends' : 'Create Daily To-Do Target'}
              </h3>
              {assignToAll && (
                <span className="text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/70 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Users className="w-2.5 h-2.5" />
                  All Members
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {subject === 'Maths'
                ? 'Select chapter and textbook exercise'
                : 'Select chapter and question type (1M, 2M, 4M, 8M)'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 p-2 rounded-xl hover:bg-slate-800 transition active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {/* Group Broadcast Toggle Switch */}
          <div className="bg-gradient-to-r from-indigo-950/60 to-slate-950 border border-indigo-800/50 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-100">Create Task for ALL Members</div>
                <div className="text-[11px] text-slate-400">Assign this goal to everyone in your study circle</div>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={assignToAll}
                onChange={(e) => setAssignToAll(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* 1. Subject Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              1. Select Subject
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Maths', 'Physics', 'Chemistry'] as const).map((sub) => (
                <button
                  type="button"
                  key={sub}
                  onClick={() => handleSubjectChange(sub)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition text-center active:scale-95 ${
                    subject === sub
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-600/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Chapter Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-400">
                2. Select Lesson / Chapter
              </label>
              {activeChapter && (
                <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                  {activeChapter.weightage} Marks in Blueprint
                </span>
              )}
            </div>
            <select
              value={activeChapter?.id || ''}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
            >
              {currentChapters.map((chap) => (
                <option key={chap.id} value={chap.id} className="bg-slate-900 text-slate-200">
                  {chap.name} ({chap.weightage} Marks)
                </option>
              ))}
            </select>
          </div>

          {/* 3. MATHEMATICS: EXERCISE SELECTOR */}
          {subject === 'Maths' ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>3. Choose Exercise ({exercises.length} available)</span>
                </label>
                <span className="text-[10px] text-indigo-400 font-semibold">BIEAP Official Exercises</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                {exercises.map((ex) => {
                  const isSelected = selectedExercise === ex;
                  const isMcq = ex.toLowerCase().includes('mcq');

                  return (
                    <button
                      type="button"
                      key={ex}
                      onClick={() => handleSelectExercise(ex)}
                      className={`p-2.5 rounded-xl border text-left transition active:scale-95 text-xs font-semibold ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="truncate">{ex}</div>
                      <div className={`text-[10px] mt-0.5 font-normal ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                        {isMcq ? 'Objective Questions' : 'Textbook Problems'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* 3. PHYSICS & CHEMISTRY: QUESTION TYPE SELECTOR (1M, 2M, 4M, 8M) */
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-400">
                  3. Choose Question Type
                </label>
                <span className="text-[10px] text-slate-500">Board Exam Blueprint</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { cat: '1M' as const, label: '1 Mark', desc: 'VSAQ / MCQ' },
                  { cat: '2M' as const, label: '2 Marks', desc: 'SAQ - I' },
                  { cat: '4M' as const, label: '4 Marks', desc: 'SAQ - II' },
                  { cat: '8M' as const, label: '8 Marks', desc: 'LAQ Derivation' }
                ].map(({ cat, label, desc }) => {
                  const countInExam = breakdown[cat] || 0;
                  const hasInExam = countInExam > 0;
                  const isSelected = questionCategory === cat;

                  return (
                    <button
                      type="button"
                      key={cat}
                      disabled={!hasInExam}
                      onClick={() => handleSelectQuestionType(cat)}
                      className={`p-2.5 rounded-2xl border text-left transition relative flex flex-col justify-between min-h-[68px] active:scale-95 ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                          : hasInExam
                          ? 'bg-slate-950 text-slate-200 border-slate-800 hover:border-slate-700'
                          : 'bg-slate-950/30 text-slate-600 border-slate-900 opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-xs font-bold ${isSelected ? 'text-slate-950' : 'text-slate-100'}`}>
                          {label}
                        </span>
                        {hasInExam ? (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                              isSelected
                                ? 'bg-slate-950 text-amber-300'
                                : 'bg-indigo-950 text-indigo-300 border border-indigo-800/60'
                            }`}
                          >
                            {countInExam} Q{countInExam > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-[9px] text-slate-600 font-medium">None</span>
                        )}
                      </div>

                      <div className="text-[10px] mt-1 opacity-80 leading-tight">
                        {desc}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Blueprint details */}
              <div className="mt-2 p-2 bg-slate-950 border border-slate-800/80 rounded-xl text-[11px] text-slate-400 flex items-center justify-between">
                <span>
                  Blueprint for <b className="text-slate-200">{activeChapter?.name}</b>:
                </span>
                <div className="flex items-center gap-1.5 font-mono text-[10px]">
                  <span className={breakdown['1M'] ? 'text-indigo-400 font-bold' : 'text-slate-600'}>1M: {breakdown['1M']}</span>
                  <span>•</span>
                  <span className={breakdown['2M'] ? 'text-sky-400 font-bold' : 'text-slate-600'}>2M: {breakdown['2M']}</span>
                  <span>•</span>
                  <span className={breakdown['4M'] ? 'text-emerald-400 font-bold' : 'text-slate-600'}>4M: {breakdown['4M']}</span>
                  <span>•</span>
                  <span className={breakdown['8M'] ? 'text-amber-400 font-bold' : 'text-slate-600'}>8M: {breakdown['8M']}</span>
                </div>
              </div>
            </div>
          )}

          {/* 4. Task Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-400">
                4. To-Do Target Details
              </label>
              <button
                type="button"
                onClick={() => {
                  if (subject === 'Maths') {
                    setTaskText(`Solve problems from ${selectedExercise} in ${activeChapter?.name || 'Mathematics'}`);
                  } else {
                    autoFillScienceTask(questionCategory, activeChapter?.name || 'Chapter');
                  }
                }}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
              >
                <Sparkles className="w-3 h-3" />
                <span>Auto Template</span>
              </button>
            </div>
            <textarea
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="e.g. Solve problems 1 to 10 from Exercise 7(b)"
              rows={2}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-medium leading-relaxed"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 pb-safe">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !taskText.trim()}
              className="flex-1 sm:flex-none px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'Adding...'
                  : assignToAll
                  ? 'Assign to All Members'
                  : 'Add To-Do Target'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
