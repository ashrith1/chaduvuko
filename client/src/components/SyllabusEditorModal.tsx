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

  // Quick edit chapter
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

  // Smart Parser for pasted text
  const handleParseAndApplyText = () => {
    setParseError(null);
    try {
      const trimmed = pasteText.trim();
      if (trimmed.startsWith('{')) {
        const parsed = JSON.parse(trimmed);
        if (parsed.Maths && parsed.Physics && parsed.Chemistry) {
          setDraftSyllabus(parsed);
          setActiveTab('editor');
          return;
        }
      }

      let currentSub: SubjectType = 'Maths';
      const newSyllabus: SyllabusData = {
        Maths: [],
        Physics: [],
        Chemistry: []
      };

      const lines = trimmed.split('\n');
      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;

        if (line.toLowerCase().includes('[maths]') || line.toLowerCase().includes('# maths')) {
          currentSub = 'Maths';
          continue;
        }
        if (line.toLowerCase().includes('[physics]') || line.toLowerCase().includes('# physics')) {
          currentSub = 'Physics';
          continue;
        }
        if (line.toLowerCase().includes('[chemistry]') || line.toLowerCase().includes('# chemistry')) {
          currentSub = 'Chemistry';
          continue;
        }

        const match = line.match(/^(.*?)(?::|-|,|=|\s{2,})\s*(\d+)(?:\s*(?:marks|m))?$/i);
        if (match) {
          const name = match[1].replace(/^\d+[\.\)]\s*/, '').trim();
          const weightage = parseInt(match[2], 10);
          if (name && !isNaN(weightage)) {
            newSyllabus[currentSub].push({
              id: `${currentSub[0].toLowerCase()}-${Date.now().toString().slice(-4)}-${Math.random().toString(36).substring(2, 5)}`,
              name,
              weightage,
              unit: 'Core'
            });
          }
        } else {
          const cleanName = line.replace(/^\d+[\.\)]\s*/, '').trim();
          if (cleanName.length > 2) {
            newSyllabus[currentSub].push({
              id: `${currentSub[0].toLowerCase()}-${Date.now().toString().slice(-4)}-${Math.random().toString(36).substring(2, 5)}`,
              name: cleanName,
              weightage: 5,
              unit: 'Core'
            });
          }
        }
      }

      if (
        newSyllabus.Maths.length === 0 &&
        newSyllabus.Physics.length === 0 &&
        newSyllabus.Chemistry.length === 0
      ) {
        throw new Error('Could not parse any lessons. Please check the format examples below.');
      }

      const finalResult: SyllabusData = {
        Maths: newSyllabus.Maths.length > 0 ? newSyllabus.Maths : draftSyllabus.Maths,
        Physics: newSyllabus.Physics.length > 0 ? newSyllabus.Physics : draftSyllabus.Physics,
        Chemistry: newSyllabus.Chemistry.length > 0 ? newSyllabus.Chemistry : draftSyllabus.Chemistry
      };

      setDraftSyllabus(finalResult);
      setActiveTab('editor');
    } catch (err: any) {
      setParseError(err.message || 'Failed to parse text. Please ensure valid syntax.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <h3 className="text-base font-semibold text-slate-100">
              Customize Board Exam Lessons & Weightages
            </h3>
            <p className="text-xs text-slate-400">
              Add chapters, update marks, or upload your State Board syllabus blueprint.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-5 pt-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/30">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition ${
                activeTab === 'editor'
                  ? 'border-indigo-500 text-indigo-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Interactive Table
            </button>
            <button
              onClick={() => setActiveTab('paste')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition ${
                activeTab === 'paste'
                  ? 'border-indigo-500 text-indigo-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Paste / Import Text
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition ${
                activeTab === 'upload'
                  ? 'border-indigo-500 text-indigo-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Upload File
            </button>
          </div>

          <button
            onClick={async () => {
              if (confirm('Reset all chapters and marks back to standard State Board defaults?')) {
                await onResetDefault();
                onClose();
              }
            }}
            className="text-[11px] text-slate-500 hover:text-rose-400 transition flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Defaults</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex-1 overflow-y-auto">
          {activeTab === 'editor' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  {(['Maths', 'Physics', 'Chemistry'] as const).map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubject(sub)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        selectedSubject === sub
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {sub} ({draftSyllabus[sub]?.length || 0})
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handleAddChapter(selectedSubject)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium transition"
                >
                  <Plus className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Add {selectedSubject} Lesson</span>
                </button>
              </div>

              {/* Editable Table */}
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/50">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3 w-12 text-center">#</th>
                      <th className="p-3">Lesson / Chapter Name</th>
                      <th className="p-3 w-40">Unit / Topic</th>
                      <th className="p-3 w-28 text-center">Marks (Weightage)</th>
                      <th className="p-3 w-12 text-center">Del</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {(draftSyllabus[selectedSubject] || []).map((chap, idx) => (
                      <tr key={chap.id} className="hover:bg-slate-900/50 transition">
                        <td className="p-3 text-center text-slate-500 font-mono text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={chap.name}
                            onChange={(e) =>
                              handleUpdateChapter(selectedSubject, idx, 'name', e.target.value)
                            }
                            className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none font-medium"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={chap.unit || ''}
                            onChange={(e) =>
                              handleUpdateChapter(selectedSubject, idx, 'unit', e.target.value)
                            }
                            className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
                            placeholder="e.g. Calculus"
                          />
                        </td>
                        <td className="p-2">
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
                              className="w-16 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg px-2 py-1.5 text-xs text-center text-amber-300 font-bold focus:outline-none"
                            />
                            <span className="text-[10px] text-slate-500">M</span>
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() => handleDeleteChapter(selectedSubject, idx)}
                            className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-900 transition"
                            title="Remove chapter"
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
            <div className="space-y-4">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <p className="font-semibold text-slate-200">How to format your text:</p>
                <p className="text-slate-400">
                  Use subject headers like <code className="text-indigo-400">[Maths]</code>, followed by chapter names with weightages:
                </p>
                <pre className="bg-slate-900 p-2.5 rounded-lg font-mono text-[11px] text-slate-300 overflow-x-auto border border-slate-800">
{`[Maths]
Relations and Functions: 6
Matrices: 8
Integrals: 12
Vectors: 8

[Physics]
Electrostatics: 12
Current Electricity: 8
Ray Optics: 8

[Chemistry]
Solutions: 7
Electrochemistry: 9
Coordination Compounds: 7`}
                </pre>
              </div>

              {parseError && (
                <div className="p-3 bg-rose-950/50 border border-rose-800/60 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{parseError}</span>
                </div>
              )}

              <textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder="Paste your lessons with marks here..."
                rows={10}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
              />

              <button
                onClick={handleParseAndApplyText}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition shadow-md shadow-indigo-600/20"
              >
                Parse & Populate Table
              </button>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-8 text-center transition flex flex-col items-center justify-center">
                <FileText className="w-10 h-10 text-indigo-400 mb-2" />
                <h4 className="text-sm font-semibold text-slate-200">
                  Upload Syllabus File (.txt, .json, .csv)
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Upload a plain text syllabus outline or weightage table from your computer.
                </p>
                <label className="mt-4 cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition">
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
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Total Lessons: {(draftSyllabus.Maths?.length || 0) + (draftSyllabus.Physics?.length || 0) + (draftSyllabus.Chemistry?.length || 0)}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-medium transition flex items-center gap-1.5 shadow-sm shadow-indigo-600/30"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Syllabus Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
