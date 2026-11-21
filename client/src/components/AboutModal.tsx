import React from 'react';
import {
  X,
  BookOpen,
  Target,
  Users,
  Clock,
  Flame,
  Award,
  Smartphone,
  CheckCircle2,
  Sparkles,
  Layers
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  appTitle?: string;
  appBadge?: string;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  appTitle = 'Chaduvuko',
  appBadge = 'BIEAP 12th'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full sm:max-w-2xl bg-zinc-900 border-t sm:border border-zinc-800 rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl z-50 max-h-[90vh] overflow-y-auto space-y-6 pb-8 sm:pb-6 text-zinc-100 animate-slide-up">
        {/* Mobile drag handle */}
        <div className="w-10 h-1 bg-zinc-700/60 rounded-full mx-auto sm:hidden" />

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-100 font-bold text-base shadow-inner">
              C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-zinc-100 tracking-tight">
                  About {appTitle}
                </h2>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                  {appBadge}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                తెలుగులో <span className="text-zinc-200 font-medium">చదువుకో</span> అంటే &quot;Study!&quot; — High-Efficiency 12th Board Prep Tracker
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-750 text-zinc-400 hover:text-zinc-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* What is Chaduvuko */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>What is {appTitle}?</span>
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-zinc-950/70 p-3.5 rounded-xl border border-zinc-800/80">
            <strong>{appTitle}</strong> is a specialized, mobile-optimized study companion built specifically for 
            <strong> Class 12 (Intermediate 2nd Year) students</strong> preparing for the 
            <strong> Andhra Pradesh Board of Intermediate Education (BIEAP) IPE Exams</strong>. Unlike generic to-do apps, 
            it aligns daily targets directly with official chapter mark weightages and textbook exercise blueprints.
          </p>
        </div>

        {/* Core Pillars Grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Key Pillars & Capabilities</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* 1. Official Weightage System */}
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                <Award className="w-4 h-4 shrink-0" />
                <span>BIEAP Weightage System</span>
              </div>
              <p className="text-zinc-400 leading-normal">
                Every chapter in Maths, Physics, and Chemistry is preloaded with its official marks weightage. Prioritize high-yield chapters like Integrals (23M), Determinants (15M), and Chemical Kinetics (15M).
              </p>
            </div>

            {/* 2. Exercise-Based Math */}
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 text-sky-400 font-semibold">
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>Exercise-Based Math Planner</span>
              </div>
              <p className="text-zinc-400 leading-normal">
                Select exact textbook exercises (e.g., Exercise 7(a) through 7(j)) rather than vague mark categories. For Science, target 1M VSAQ, 2M SAQ, 4M LAQ, or 8M Essay problems.
              </p>
            </div>

            {/* 3. Peer Study Circle */}
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <Users className="w-4 h-4 shrink-0" />
                <span>Group Hub & Accountability</span>
              </div>
              <p className="text-zinc-400 leading-normal">
                Study with your circle! View friends' streaks, daily minutes, and current topics. Use <strong>Broadcast Target</strong> to assign problem sets to all members in one click.
              </p>
            </div>

            {/* 4. Dual Progress Analytics */}
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <Target className="w-4 h-4 shrink-0" />
                <span>Dual Progress Analytics</span>
              </div>
              <p className="text-zinc-400 leading-normal">
                Track both: <strong>Daily Completion %</strong> (today's immediate tasks) and <strong>Syllabus Mastery %</strong> (cumulative board marks completed across all 3 subjects).
              </p>
            </div>

            {/* 5. Study Timer & Stopwatch */}
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 text-rose-400 font-semibold">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Pomodoro Focus Timer</span>
              </div>
              <p className="text-zinc-400 leading-normal">
                Run 15m, 25m, 45m, or 60m focus blocks or stopwatch sessions linked directly to today's tasks. Timer logs automatically contribute to personal and group study hours.
              </p>
            </div>

            {/* 6. Mobile-First PWA */}
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 text-purple-400 font-semibold">
                <Smartphone className="w-4 h-4 shrink-0" />
                <span>Android PWA Experience</span>
              </div>
              <p className="text-zinc-400 leading-normal">
                Designed for mobile phones. Add to Home screen on Android Chrome for a full-screen, native app feel with haptic feedback and dark-mode battery saving.
              </p>
            </div>
          </div>
        </div>

        {/* Syllabus Weightage Summary Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>BIEAP 2nd Year Weightage Overview</span>
          </h3>

          <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/90 text-zinc-300 font-semibold border-b border-zinc-800">
                <tr>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Chapters</th>
                  <th className="py-2.5 px-3">Total Pool Weightage</th>
                  <th className="py-2.5 px-3">Top High-Weightage Chapters</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300 text-[11px] sm:text-xs">
                <tr>
                  <td className="py-2 px-3 font-semibold text-sky-400">Mathematics</td>
                  <td className="py-2 px-3">13 Chapters</td>
                  <td className="py-2 px-3 font-medium">126 Marks</td>
                  <td className="py-2 px-3 text-zinc-400">Integrals (23M), Determinants (15M), Vector Algebra (15M), Probability (15M)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-indigo-400">Physics</td>
                  <td className="py-2 px-3">14 Chapters</td>
                  <td className="py-2 px-3 font-medium">106 Marks</td>
                  <td className="py-2 px-3 text-zinc-400">Ray Optics (10M), Moving Charges (10M), Capacitance (10M), Modern Physics (27M)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-emerald-400">Chemistry</td>
                  <td className="py-2 px-3">10 Chapters</td>
                  <td className="py-2 px-3 font-medium">110 Marks</td>
                  <td className="py-2 px-3 text-zinc-400">Chemical Kinetics (15M), Coordination Compounds (15M), Aldehydes & Ketones (15M)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 95%+ Strategy Tips */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 p-4 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Pro-Tips for 95%+ in BIEAP Board Exams</span>
          </div>
          <ul className="text-[11px] sm:text-xs text-zinc-300 space-y-1 list-disc list-inside">
            <li><strong>Master high-weightage chapters first:</strong> Just 5 chapters in Maths and Chemistry account for over 50% of total marks.</li>
            <li><strong>Derivations & Diagrams:</strong> In Physics, dedicate timer sessions to 8-mark derivations (Prism Formula, Lens Maker, Cyclotron).</li>
            <li><strong>Daily Peer Accountability:</strong> Maintain your streak by completing at least 2 target sets daily with your study group.</li>
          </ul>
        </div>

        {/* Footer & Close */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-zinc-800 text-xs text-zinc-500">
          <div className="flex items-center gap-2 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Chaduvuko v1.0.0 &bull; Built for BIEAP Class 12 Peers</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-zinc-100 hover:bg-white text-zinc-900 rounded-xl text-xs font-semibold transition active:scale-95 shadow-sm"
          >
            Got it, Let&apos;s Study!
          </button>
        </div>
      </div>
    </div>
  );
};
