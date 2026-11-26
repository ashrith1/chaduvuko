export type SubjectType = 'Maths' | 'Physics' | 'Chemistry';

export type ChapterStatus = 'not_started' | 'in_progress' | 'completed' | 'revised';

export type QuestionCategory = '1M' | '2M' | '4M' | '8M' | 'All';

export interface QuestionBreakdown {
  '1M': number;
  '2M': number;
  '4M': number;
  '8M': number;
}

export interface Chapter {
  id: string;
  name: string;
  weightage: number; // Marks in board exam
  unit?: string;
  breakdown?: QuestionBreakdown;
  questionTypes?: ('1M' | '2M' | '4M' | '8M')[];
  exercises?: string[]; // Specifically for Mathematics
}

export interface SyllabusData {
  Maths: Chapter[];
  Physics: Chapter[];
  Chemistry: Chapter[];
}

export interface User {
  id: string;
  name: string;
  username?: string;
  password?: string;
  avatar: string;
  targetScore: string;
  status: string;
  streak: number;
  todayStudySeconds?: number;
  joinedAt: string;
  role?: 'admin' | 'student';
  pin?: string;
}

export interface Target {
  id: string;
  userId: string;
  subject: SubjectType;
  chapterId?: string | null;
  chapterName?: string;
  weightage?: number;
  questionCategory?: QuestionCategory | null; // For Physics & Chemistry
  exercise?: string | null; // For Mathematics (e.g. Exercise 7(a))
  task: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  completedAt?: string | null;
  completedQuestionsType?: 'all' | 'custom' | null;
  completedQuestionsCount?: number | null;
  timeSpentSeconds?: number;
}

export interface MemberProgress extends User {
  targetsToday: {
    total: number;
    completed: number;
    list: Target[];
  };
  dailyCompletionRate: number; // 0 - 100%
  completedWeightage: number;
  grandTotalMarks: number;
  syllabusCompletionRate: number; // 0 - 100%
  todayStudyMinutes: number;
}

export interface GroupOverview {
  today: string;
  totalSubjectMarks: {
    Maths: number;
    Physics: number;
    Chemistry: number;
  };
  grandTotalMarks: number;
  todayGroupTargetsCount: number;
  todayGroupCompletedCount: number;
  groupDailyCompletionRate: number; // 0 - 100%
  groupAverageSyllabusRate: number; // 0 - 100%
  groupTodayStudyMinutes: number;
  members: MemberProgress[];
}

export interface CalendarDaySummary {
  date: string; // YYYY-MM-DD
  totalTargets: number;
  completedTargets: number;
  studyMinutes: number;
  targets: Target[];
}
