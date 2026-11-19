import React, { useState, useEffect, useRef } from 'react';
import type { Target } from '../types';
import { Play, Pause, RotateCcw, Check, Clock, Sparkles, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudyTimerProps {
  targets: Target[];
  activeTargetId: string | null;
  onSelectTarget: (id: string | null) => void;
  onLogTime: (targetId: string, seconds: number) => Promise<void>;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({
  targets,
  activeTargetId,
  onSelectTarget,
  onLogTime
}) => {
  const [mode, setMode] = useState<'countdown' | 'stopwatch'>('countdown');
  const [initialMinutes, setInitialMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  const timerRef = useRef<any>(null);

  const selectedTarget = targets.find((t) => t.id === activeTargetId);

  // Set preset
  const handleSetPreset = (mins: number) => {
    setIsRunning(false);
    setMode('countdown');
    setInitialMinutes(mins);
    setTimeLeft(mins * 60);
  };

  const handleSetStopwatch = () => {
    setIsRunning(false);
    setMode('stopwatch');
    setStopwatchSeconds(0);
  };

  // Timer Tick
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        if (mode === 'countdown') {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              setIsRunning(false);
              handleTimerFinish();
              return 0;
            }
            return prev - 1;
          });
        } else {
          setStopwatchSeconds((prev) => prev + 1);
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  const handleTimerFinish = async () => {
    // Vibration for Android device
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 300]);
    }

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });

    setCompletedSessions((c) => c + 1);

    if (activeTargetId) {
      await onLogTime(activeTargetId, initialMinutes * 60);
    }
  };

  const handlePause = async () => {
    setIsRunning(false);
    // If we were running stopwatch or countdown, offer to log the elapsed chunk
    if (mode === 'stopwatch' && stopwatchSeconds > 60 && activeTargetId) {
      await onLogTime(activeTargetId, stopwatchSeconds);
      setStopwatchSeconds(0);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    if (mode === 'countdown') {
      setTimeLeft(initialMinutes * 60);
    } else {
      setStopwatchSeconds(0);
    }
  };

  // Format time
  const currentSeconds = mode === 'countdown' ? timeLeft : stopwatchSeconds;
  const mins = Math.floor(currentSeconds / 60);
  const secs = currentSeconds % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const progressPercent = mode === 'countdown'
    ? Math.max(0, Math.min(100, ((initialMinutes * 60 - timeLeft) / (initialMinutes * 60)) * 100))
    : 100;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-950 border border-indigo-800/80 flex items-center justify-center text-indigo-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Study Focus Timer</h3>
            <p className="text-[11px] text-slate-400">Stay locked in on your 12th board tasks</p>
          </div>
        </div>

        {completedSessions > 0 && (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3" />
            {completedSessions} Pomodoros
          </span>
        )}
      </div>

      {/* Target Selector Card (Attach Timer to Today's Target) */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-medium">Assigned to Today's Task:</span>
          {selectedTarget ? (
            <span className="text-indigo-400 font-semibold">{selectedTarget.subject}</span>
          ) : (
            <span className="text-slate-500">General Study</span>
          )}
        </div>

        <select
          value={activeTargetId || ''}
          onChange={(e) => onSelectTarget(e.target.value || null)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          <option value="">General Study (No specific task)</option>
          {targets.map((t) => (
            <option key={t.id} value={t.id}>
              [{t.subject}] {t.chapterName ? `${t.chapterName} • ` : ''}
              {t.questionCategory ? `${t.questionCategory} • ` : ''}
              {t.task.slice(0, 35)}...
            </option>
          ))}
        </select>

        {selectedTarget && (
          <div className="text-[11px] text-slate-400 pt-1 flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-indigo-400" />
            <span className="truncate">{selectedTarget.task}</span>
            {selectedTarget.timeSpentSeconds ? (
              <span className="text-emerald-400 ml-auto shrink-0 font-medium">
                ⏱️ {Math.round(selectedTarget.timeSpentSeconds / 60)}m logged
              </span>
            ) : null}
          </div>
        )}
      </div>

      {/* Timer Display */}
      <div className="flex flex-col items-center justify-center py-4 relative">
        {/* Subtle radial backdrop glow */}
        <div
          className={`absolute w-48 h-48 rounded-full blur-3xl transition-opacity duration-700 pointer-events-none ${
            isRunning ? 'bg-indigo-600/20 opacity-100' : 'bg-transparent opacity-0'
          }`}
        />

        {/* Large time digits */}
        <div className="relative text-6xl sm:text-7xl font-mono font-bold tracking-tight text-slate-100 tabular-nums">
          {timeFormatted}
        </div>

        {/* Progress indicator bar */}
        <div className="w-48 h-1.5 bg-slate-800 rounded-full mt-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="text-xs text-slate-400 mt-2 font-medium">
          {mode === 'countdown' ? `${initialMinutes} Min Session` : 'Stopwatch Running'}
        </div>
      </div>

      {/* Preset Pill Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: '15m', mins: 15 },
          { label: '25m', mins: 25 },
          { label: '45m', mins: 45 },
          { label: '60m', mins: 60 }
        ].map((preset) => (
          <button
            key={preset.mins}
            onClick={() => handleSetPreset(preset.mins)}
            className={`py-2 rounded-xl text-xs font-semibold border transition active:scale-95 ${
              mode === 'countdown' && initialMinutes === preset.mins
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-600/30'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center">
        <button
          onClick={handleSetStopwatch}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
            mode === 'stopwatch'
              ? 'bg-indigo-600 text-white border-indigo-500'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:border-slate-800'
          }`}
        >
          Continuous Stopwatch
        </button>
      </div>

      {/* Main Controls (Thumb-friendly touch targets) */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <button
          onClick={handleReset}
          className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200 active:scale-95 transition"
          title="Reset Timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={() => {
            if (isRunning) {
              handlePause();
            } else {
              setIsRunning(true);
            }
          }}
          className={`flex-1 max-w-[200px] h-14 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-95 ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 fill-current" />
              <span>Pause Focus</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>Start Studying</span>
            </>
          )}
        </button>

        {selectedTarget && !selectedTarget.completed && (
          <button
            onClick={async () => {
              if (activeTargetId) {
                // Quick complete target
                await onLogTime(activeTargetId, Math.max(300, (initialMinutes * 60 - timeLeft)));
              }
            }}
            className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400 active:scale-95 transition"
            title="Log Time & Complete Target"
          >
            <Check className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
