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
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 300]);
    }

    confetti({
      particleCount: 60,
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

  const currentSeconds = mode === 'countdown' ? timeLeft : stopwatchSeconds;
  const mins = Math.floor(currentSeconds / 60);
  const secs = currentSeconds % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const progressPercent = mode === 'countdown'
    ? Math.max(0, Math.min(100, ((initialMinutes * 60 - timeLeft) / (initialMinutes * 60)) * 100))
    : 100;

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-sm max-w-md mx-auto space-y-5 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-zinc-300">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">Study Focus Timer</h3>
            <p className="text-[11px] text-zinc-400">Lock in on your daily chapter tasks</p>
          </div>
        </div>

        {completedSessions > 0 && (
          <span className="flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-zinc-800 border border-zinc-750 px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3" />
            {completedSessions} Sessions
          </span>
        )}
      </div>

      {/* Target Selector Card */}
      <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-zinc-400">
          <span className="font-medium">Focus Task:</span>
          {selectedTarget ? (
            <span className="text-zinc-200 font-medium">{selectedTarget.subject}</span>
          ) : (
            <span className="text-zinc-500">General Session</span>
          )}
        </div>

        <select
          value={activeTargetId || ''}
          onChange={(e) => onSelectTarget(e.target.value || null)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600"
        >
          <option value="">General Study (No task attached)</option>
          {targets.map((t) => (
            <option key={t.id} value={t.id}>
              [{t.subject}] {t.chapterName ? `${t.chapterName} • ` : ''}
              {t.task.slice(0, 32)}...
            </option>
          ))}
        </select>

        {selectedTarget && (
          <div className="text-[11px] text-zinc-400 pt-1 flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-zinc-500 shrink-0" />
            <span className="truncate">{selectedTarget.task}</span>
            {selectedTarget.timeSpentSeconds ? (
              <span className="text-emerald-400 ml-auto shrink-0 font-medium text-[10px]">
                {Math.round(selectedTarget.timeSpentSeconds / 60)}m logged
              </span>
            ) : null}
          </div>
        )}
      </div>

      {/* Timer Display */}
      <div className="flex flex-col items-center justify-center py-3">
        <div className="text-6xl sm:text-7xl font-mono font-bold tracking-tight text-zinc-100 tabular-nums">
          {timeFormatted}
        </div>

        {/* Sleek thin progress indicator */}
        <div className="w-44 h-1 bg-zinc-800 rounded-full mt-4 overflow-hidden">
          <div
            className="h-full bg-zinc-200 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="text-xs text-zinc-400 mt-2 font-medium">
          {mode === 'countdown' ? `${initialMinutes} min countdown` : 'Stopwatch active'}
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
            className={`py-1.5 rounded-xl text-xs font-medium border transition active:scale-95 ${
              mode === 'countdown' && initialMinutes === preset.mins
                ? 'bg-zinc-100 text-zinc-900 border-white font-semibold'
                : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center">
        <button
          onClick={handleSetStopwatch}
          className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
            mode === 'stopwatch'
              ? 'bg-zinc-800 text-zinc-100 border-zinc-700'
              : 'text-zinc-500 hover:text-zinc-300 border-transparent hover:border-zinc-800'
          }`}
        >
          Continuous Stopwatch
        </button>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-3 pt-1">
        <button
          onClick={handleReset}
          className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-200 active:scale-95 transition"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            if (isRunning) {
              handlePause();
            } else {
              setIsRunning(true);
            }
          }}
          className={`flex-1 max-w-[190px] h-12 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-95 ${
            isRunning
              ? 'bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold'
              : 'bg-zinc-100 hover:bg-white text-zinc-900 font-bold'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause Focus</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Start Focus</span>
            </>
          )}
        </button>

        {selectedTarget && !selectedTarget.completed && (
          <button
            onClick={async () => {
              if (activeTargetId) {
                await onLogTime(activeTargetId, Math.max(300, (initialMinutes * 60 - timeLeft)));
              }
            }}
            className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-emerald-400 active:scale-95 transition"
            title="Log Time & Complete Target"
          >
            <Check className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
