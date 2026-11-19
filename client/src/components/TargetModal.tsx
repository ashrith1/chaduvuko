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
    if (!taskText.trim() || !activeChapter) return;

    setIsSubmitting(true);
    try {
      const payload = {
        subject,
        chapterId: activeChapter.id,
        chapterName: activeChapter.name,
        weightage: activeChapter.weightage,
        questionCategory: subject === 'Maths' ? ('All' as QuestionCategory) : questionCategory,
        exercise: subject === 'Maths' ? selectedExercise : undefined,
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
      <div className="bg-zinc-900 border-t sm:border border-zinc-800 rounded-t-3xl sm:rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-semibold text-zinc-100">
                {assignToAll ? 'Create Group Target' : 'Create Daily Target'}
              </h3>
              {assignToAll && (
                <span className="text-[10px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Users className="w-2.5 h-2.5" />
                  All Friends
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              {subject === 'Maths'
                ? 'Select chapter and textbook exercise'
                : 'Select chapter and question type (1M, 2M, 4M, 8M)'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 p-1.5 rounded-lg hover:bg-zinc-800 transition active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 overflow-y-auto flex-1">
          {/* Group Broadcast Toggle Switch */}
          <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-medium text-zinc-100">Assign to ALL Members</div>
                <div className="text-[10px] text-zinc-400">Share this daily goal with all friends</div>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={assignToAll}
                onChange={(e) => setAssignToAll(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-200"></div>
            </label>
          </div>

          {/* 1. Subject Selector */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              1. Subject
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['Maths', 'Physics', 'Chemistry'] as const).map((sub) => (
                <button
                  type="button"
                  key={sub}
                  onClick={() => handleSubjectChange(sub)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition text-center active:scale-95 ${
                    subject === sub
                      ? 'bg-zinc-100 text-zinc-900 border-white font-semibold shadow-sm'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-850 hover:text-zinc-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Chapter Selector */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-zinc-400">
                2. Lesson / Chapter
              </label>
              {activeChapter && (
                <span className="text-[10px] font-medium text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                  {activeChapter.weightage} Marks
                </span>
              )}
            </div>
            <select
              value={activeChapter?.id || ''}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600"
            >
              {currentChapters.map((chap) => (
                <option key={chap.id} value={chap.id} className="bg-zinc-900 text-zinc-200">
                  {chap.name} ({chap.weightage} Marks)
                </option>
              ))}
            </select>
          </div>

          {/* 3. MATHEMATICS: EXERCISE SELECTOR */}
          {subject === 'Maths' ? (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                  <span>3. Choose Exercise ({exercises.length} available)</span>
                </label>
                <span className="text-[10px] text-zinc-500">Official Syllabus</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-44 overflow-y-auto pr-1">
                {exercises.map((ex) => {
                  const isSelected = selectedExercise === ex;
                  const isMcq = ex.toLowerCase().includes('mcq');

                  return (
                    <button
                      type="button"
                      key={ex}
                      onClick={() => handleSelectExercise(ex)}
                      className={`p-2.5 rounded-xl border text-left transition active:scale-95 text-xs font-medium ${
                        isSelected
                          ? 'bg-zinc-100 text-zinc-900 border-white font-semibold shadow-sm'
                          : 'bg-zinc-950 text-zinc-300 border-zinc-850 hover:border-zinc-750'
                      }`}
                    >
                      <div className="truncate">{ex}</div>
                      <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-zinc-700' : 'text-zinc-500'}`}>
                        {isMcq ? 'MCQs' : 'Problems'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* 3. SCIENCE: QUESTION TYPE SELECTOR */
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-zinc-400">
                  3. Question Category
                </label>
                <span className="text-[10px] text-zinc-500">Board Breakdown</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
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
                      className={`p-2 rounded-xl border text-left transition relative flex flex-col justify-between min-h-[60px] active:scale-95 ${
                        isSelected
                          ? 'bg-zinc-100 text-zinc-900 border-white font-semibold shadow-sm'
                          : hasInExam
                          ? 'bg-zinc-950 text-zinc-200 border-zinc-850 hover:border-zinc-750'
                          : 'bg-zinc-950/30 text-zinc-600 border-zinc-900 opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-medium">
                          {label}
                        </span>
                        {hasInExam && (
                          <span className={`text-[10px] px-1 py-0.2 rounded ${
                            isSelected ? 'bg-zinc-900 text-zinc-100 font-semibold' : 'text-zinc-400'
                          }`}>
                            {countInExam}Q
                          </span>
                        )}
                      </div>

                      <div className="text-[10px] mt-1 opacity-75 leading-tight">
                        {desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Task Description */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-zinc-400">
                4. Description
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
                className="text-[10px] text-zinc-300 hover:text-white flex items-center gap-1 font-medium"
              >
                <Sparkles className="w-3 h-3" />
                <span>Auto Fill</span>
              </button>
            </div>
            <textarea
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="e.g. Solve problems 1 to 10 from Exercise 7(b)"
              rows={2}
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 font-medium leading-relaxed"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 pb-safe">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs text-zinc-400 hover:text-zinc-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !taskText.trim()}
              className="flex-1 sm:flex-none px-5 py-2 bg-zinc-100 hover:bg-white disabled:opacity-50 text-zinc-900 rounded-xl text-xs font-semibold transition shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>
                {isSubmitting
                  ? 'Adding...'
                  : assignToAll
                  ? 'Assign to All'
                  : 'Add Target'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
