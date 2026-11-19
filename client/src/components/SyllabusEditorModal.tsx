import React, { useState } from 'react';
import type { SubjectType, SyllabusData, Chapter } from '../types';
import { X, Plus, Trash2, RotateCcw, Upload, FileText, Check, AlertCircle } from 'lucide-react';

interface SyllabusEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  syllabus: SyllabusData;
  onSaveSyllabus: (updated: SyllabusData) => Promise<void>;
  onResetDefault: () => Promise<void>;
}

export const SyllabusEditorModal: React.FC<SyllabusEditorModalProps> = ({
  isOpen,
  onClose,
  syllabus,
  onSaveSyllabus,
  onResetDefault
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'editor' | 'paste' | 'upload'>('editor');
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>('Maths');
  const [draftSyllabus, setDraftSyllabus] = useState<SyllabusData>(JSON.parse(JSON.stringify(syllabus)));
  const [pasteText, setPasteText] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateChapter = (sub: SubjectType, index: number, field: keyof Chapter, value: any) => {
    const list = [...draftSyllabus[sub]];
    list[index] = { ...list[index], [field]: value };
    setDraftSyllabus({ ...draftSyllabus, [sub]: list });
  };

  const handleAddChapter = (sub: SubjectType) => {
    const newChap: Chapter = {
      id: `${sub[0].toLowerCase()}-${Date.now().toString().slice(-4)}`,
      name: 'New Lesson',
      weightage: 5,
      unit: 'General'
    };
    setDraftSyllabus({
      ...draftSyllabus,
      [sub]: [...draftSyllabus[sub], newChap]
    });
  };

  const handleDeleteChapter = (sub: SubjectType, index: number) => {
    const list = [...draftSyllabus[sub]];
    list.splice(index, 1);
    setDraftSyllabus({ ...draftSyllabus, [sub]: list });
  };

  const handleParseAndApplyText = () => {
    setParseError(null);
    try {
      const trimmed = pasteText.trim();
      if (trimmed.startsWith('{')) {
        const parsed = JSON.parse(trimmed);
        if (parsed.Maths || parsed.Physics || parsed.Chemistry) {
          setDraftSyllabus(parsed);
          setActiveTab('editor');
          return;
        }
      }

      const lines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean);
      let currentSub: SubjectType = 'Maths';
      const newSyllabus: SyllabusData = { Maths: [], Physics: [], Chemistry: [] };

      lines.forEach((line) => {
        if (/^\[?maths?\]?$/i.test(line)) {
          currentSub = 'Maths';
          return;
        }
        if (/^\[?physics?\]?$/i.test(line)) {
          currentSub = 'Physics';
          return;
        }
        if (/^\[?chemistry?\]?$/i.test(line)) {
          currentSub = 'Chemistry';
          return;
        }

        const match = line.match(/^(.+?)(?::|-|\t|,)\s*(\d+)(?:\s*m|\s*marks)?$/i);
        if (match) {
          const name = match[1].replace(/^\d+[\.\)]\s*/, '').trim();
          const marks = parseInt(match[2], 10) || 5;
          newSyllabus[currentSub].push({
            id: `${currentSub[0].toLowerCase()}-${Math.random().toString(36).substr(2, 6)}`,
            name,
            weightage: marks,
            unit: 'Imported'
          });
        }
      });

      if (
        newSyllabus.Maths.length === 0 &&
        newSyllabus.Physics.length === 0 &&
        newSyllabus.Chemistry.length === 0
      ) {
        throw new Error('Could not parse lessons. Check format.');
      }

      const finalResult: SyllabusData = {
        Maths: newSyllabus.Maths.length > 0 ? newSyllabus.Maths : draftSyllabus.Maths,
        Physics: newSyllabus.Physics.length > 0 ? newSyllabus.Physics : draftSyllabus.Physics,
        Chemistry: newSyllabus.Chemistry.length > 0 ? newSyllabus.Chemistry : draftSyllabus.Chemistry
      };

      setDraftSyllabus(finalResult);
      setActiveTab('editor');
    } catch (err: any) {
      setParseError(err.message || 'Failed to parse text.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setPasteText(content);
        setActiveTab('paste');
      }
    };
    reader.readAsText(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveSyllabus(draftSyllabus);
      onClose();
    } catch (e) {
      alert('Error saving syllabus: ' + e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-zinc-100">
              Customize Lessons & Weightages
            </h3>
            <p className="text-xs text-zinc-400">
              Update chapters or import syllabus data
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 p-1.5 rounded-lg hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-4 pt-2 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/30">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 text-xs font-medium border-b-2 transition ${
                activeTab === 'editor'
                  ? 'border-zinc-100 text-zinc-100 font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setActiveTab('paste')}
              className={`px-3 py-1.5 text-xs font-medium border-b-2 transition ${
                activeTab === 'paste'
                  ? 'border-zinc-100 text-zinc-100 font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Paste Text
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1.5 text-xs font-medium border-b-2 transition ${
                activeTab === 'upload'
                  ? 'border-zinc-100 text-zinc-100 font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Upload File
            </button>
          </div>

          <button
            onClick={async () => {
              if (confirm('Reset all chapters back to standard defaults?')) {
                await onResetDefault();
                onClose();
              }
            }}
            className="text-[11px] text-zinc-500 hover:text-rose-400 transition flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 flex-1 overflow-y-auto">
          {activeTab === 'editor' && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                  {(['Maths', 'Physics', 'Chemistry'] as const).map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubject(sub)}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                        selectedSubject === sub
                          ? 'bg-zinc-800 text-zinc-100 font-semibold'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {sub} ({draftSyllabus[sub]?.length || 0})
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handleAddChapter(selectedSubject)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-medium transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Lesson</span>
                </button>
              </div>

              {/* Table */}
              <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950/40">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 font-medium text-[10px] uppercase tracking-wider">
                    <tr>
                      <th className="p-2.5 w-10 text-center">#</th>
                      <th className="p-2.5">Chapter Name</th>
                      <th className="p-2.5 w-36">Unit</th>
                      <th className="p-2.5 w-24 text-center">Marks</th>
                      <th className="p-2.5 w-10 text-center">Del</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850">
                    {(draftSyllabus[selectedSubject] || []).map((chap, idx) => (
                      <tr key={chap.id} className="hover:bg-zinc-900/40 transition">
                        <td className="p-2.5 text-center text-zinc-500 font-mono text-[10px]">
                          {idx + 1}
                        </td>
                        <td className="p-1.5">
                          <input
                            type="text"
                            value={chap.name}
                            onChange={(e) =>
                              handleUpdateChapter(selectedSubject, idx, 'name', e.target.value)
                            }
                            className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-lg px-2 py-1 text-xs text-zinc-200 focus:outline-none"
                          />
                        </td>
                        <td className="p-1.5">
                          <input
                            type="text"
                            value={chap.unit || ''}
                            onChange={(e) =>
                              handleUpdateChapter(selectedSubject, idx, 'unit', e.target.value)
                            }
                            className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-lg px-2 py-1 text-xs text-zinc-300 focus:outline-none"
                          />
                        </td>
                        <td className="p-1.5">
                          <div className="flex items-center justify-center gap-1">
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={chap.weightage}
                              onChange={(e) =>
                                handleUpdateChapter(
                                  selectedSubject,
                                  idx,
                                  'weightage',
                                  parseInt(e.target.value, 10) || 0
                                )
                              }
                              className="w-14 bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-lg px-1.5 py-1 text-xs text-center text-zinc-200 font-medium focus:outline-none"
                            />
                            <span className="text-[10px] text-zinc-500">M</span>
                          </div>
                        </td>
                        <td className="p-1.5 text-center">
                          <button
                            onClick={() => handleDeleteChapter(selectedSubject, idx)}
                            className="text-zinc-500 hover:text-rose-400 p-1 rounded hover:bg-zinc-900 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'paste' && (
            <div className="space-y-3">
              {parseError && (
                <div className="p-2.5 bg-rose-950/40 border border-rose-800/50 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{parseError}</span>
                </div>
              )}

              <textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder="[Maths]&#10;Relations and Functions: 6&#10;Matrices: 8&#10;&#10;[Physics]&#10;Current Electricity: 8"
                rows={9}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-600"
              />

              <button
                onClick={handleParseAndApplyText}
                className="w-full py-2 bg-zinc-100 hover:bg-white text-zinc-900 rounded-xl text-xs font-semibold transition shadow-sm"
              >
                Parse & Populate
              </button>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="border border-dashed border-zinc-800 rounded-xl p-8 text-center flex flex-col items-center justify-center">
              <FileText className="w-8 h-8 text-zinc-500 mb-2" />
              <h4 className="text-xs font-semibold text-zinc-200">
                Upload Syllabus Outline (.txt, .json, .csv)
              </h4>
              <label className="mt-3 cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-100 hover:bg-white text-zinc-900 rounded-xl text-xs font-semibold transition">
                <Upload className="w-3.5 h-3.5" />
                <span>Choose File</span>
                <input
                  type="file"
                  accept=".txt,.json,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between">
          <div className="text-xs text-zinc-500">
            Total: {(draftSyllabus.Maths?.length || 0) + (draftSyllabus.Physics?.length || 0) + (draftSyllabus.Chemistry?.length || 0)} lessons
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-1.5 bg-zinc-100 hover:bg-white disabled:opacity-50 text-zinc-900 rounded-lg text-xs font-semibold transition shadow-sm flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Syllabus'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
