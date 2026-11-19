import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defaultSyllabus } from './defaultData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data', 'store.json');

// Ensure data folder exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// Initial state
let store = {
  syllabus: defaultSyllabus,
  users: [
    {
      id: 'u-1',
      name: 'Ashrith',
      avatar: '🚀',
      targetScore: '95%+',
      status: 'Ready to study',
      streak: 4,
      todayStudySeconds: 1500,
      joinedAt: new Date().toISOString()
    },
    {
      id: 'u-2',
      name: 'Rohan',
      avatar: '⚡',
      targetScore: '90%+',
      status: 'Solving 2-Mark Integrals',
      streak: 3,
      todayStudySeconds: 1200,
      joinedAt: new Date().toISOString()
    },
    {
      id: 'u-3',
      name: 'Priya',
      avatar: '📚',
      targetScore: '95%+',
      status: 'Reviewing Ray Optics',
      streak: 5,
      todayStudySeconds: 1800,
      joinedAt: new Date().toISOString()
    }
  ],
  targets: [],
  chapterProgress: {} // { userId: { chapterId: { status: 'completed' | 'in_progress' | 'revised', date: ... } } }
};

// Load saved data if exists
if (fs.existsSync(DATA_FILE)) {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    store = JSON.parse(raw);
    // Always keep official BIEAP syllabus updated
    store.syllabus = defaultSyllabus;
    saveStore();
  } catch (err) {
    console.error('Error loading store.json, using defaults:', err);
  }
} else {
  // Prepopulate today's demo targets for a warm start
  const today = new Date().toISOString().split('T')[0];
  store.targets = [
    {
      id: 't-1',
      userId: 'u-1',
      subject: 'Maths',
      chapterId: 'm-7',
      chapterName: 'Integrals (Definite & Indefinite)',
      weightage: 12,
      questionCategory: '2M',
      questionCount: 8,
      task: 'Solve 8 2-Mark Questions from Exercise 7.2',
      date: today,
      completed: true,
      completedAt: new Date().toISOString(),
      timeSpentSeconds: 900
    },
    {
      id: 't-2',
      userId: 'u-1',
      subject: 'Physics',
      chapterId: 'p-9',
      chapterName: 'Ray Optics and Optical Instruments',
      weightage: 8,
      questionCategory: '8M',
      questionCount: 2,
      task: 'Derive Prism Formula and Lens Maker Equation',
      date: today,
      completed: false,
      completedAt: null,
      timeSpentSeconds: 600
    },
    {
      id: 't-3',
      userId: 'u-1',
      subject: 'Chemistry',
      chapterId: 'c-2',
      chapterName: 'Electrochemistry',
      weightage: 9,
      questionCategory: '4M',
      questionCount: 4,
      task: 'Kohlrausch law numericals + Nernst equation',
      date: today,
      completed: false,
      completedAt: null,
      timeSpentSeconds: 0
    },
    {
      id: 't-4',
      userId: 'u-2',
      subject: 'Maths',
      chapterId: 'm-7',
      chapterName: 'Integrals',
      weightage: 12,
      questionCategory: '2M',
      questionCount: 8,
      task: 'Solve 8 2-Mark Questions from Exercise 7.2',
      date: today,
      completed: true,
      completedAt: new Date().toISOString(),
      timeSpentSeconds: 1200
    },
    {
      id: 't-5',
      userId: 'u-3',
      subject: 'Physics',
      chapterId: 'p-9',
      chapterName: 'Ray Optics',
      weightage: 8,
      questionCategory: '8M',
      questionCount: 2,
      task: 'Compound Microscope ray diagram and magnification formula',
      date: today,
      completed: true,
      completedAt: new Date().toISOString(),
      timeSpentSeconds: 1800
    }
  ];
  saveStore();
}

function saveStore() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write store.json:', e);
  }
}

const app = express();
app.use(cors());
app.use(express.json());

// Serve client dist if built
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
}

// 1. Syllabus Endpoints
app.get('/api/syllabus', (req, res) => {
  res.json({ success: true, syllabus: store.syllabus });
});

app.post('/api/syllabus', (req, res) => {
  const { syllabus } = req.body;
  if (!syllabus || !syllabus.Maths || !syllabus.Physics || !syllabus.Chemistry) {
    return res.status(400).json({ error: 'Invalid syllabus payload. Must contain Maths, Physics, Chemistry.' });
  }
  store.syllabus = syllabus;
  saveStore();
  res.json({ success: true, syllabus: store.syllabus });
});

app.post('/api/syllabus/reset', (req, res) => {
  store.syllabus = defaultSyllabus;
  saveStore();
  res.json({ success: true, syllabus: store.syllabus });
});

// 2. Users / Friends Endpoints
app.get('/api/users', (req, res) => {
  res.json({ success: true, users: store.users });
});

app.post('/api/users', (req, res) => {
  const { name, avatar, targetScore } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }
  const cleanName = name.trim();
  let existing = store.users.find(u => u.name.toLowerCase() === cleanName.toLowerCase());
  if (existing) {
    if (avatar) existing.avatar = avatar;
    if (targetScore) existing.targetScore = targetScore;
    saveStore();
    return res.json({ success: true, user: existing });
  }
  const newUser = {
    id: 'u-' + Date.now(),
    name: cleanName,
    avatar: avatar || '⭐',
    targetScore: targetScore || '90%+',
    status: 'Ready to study',
    streak: 1,
    todayStudySeconds: 0,
    joinedAt: new Date().toISOString()
  };
  store.users.push(newUser);
  saveStore();
  res.status(201).json({ success: true, user: newUser });
});

app.patch('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const user = store.users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  const { name, avatar, targetScore, status, addStudySeconds } = req.body;
  if (name !== undefined) user.name = name.trim();
  if (avatar !== undefined) user.avatar = avatar;
  if (targetScore !== undefined) user.targetScore = targetScore;
  if (status !== undefined) user.status = status;
  if (addStudySeconds) {
    user.todayStudySeconds = (user.todayStudySeconds || 0) + Number(addStudySeconds);
  }
  
  saveStore();
  res.json({ success: true, user });
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const idx = store.users.findIndex(u => u.id === id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  
  // Prevent deleting last user
  if (store.users.length <= 1) {
    return res.status(400).json({ error: 'Cannot delete the only member in the group' });
  }

  const removed = store.users.splice(idx, 1)[0];
  // Also clean up user's targets
  store.targets = store.targets.filter(t => t.userId !== id);
  if (store.chapterProgress[id]) {
    delete store.chapterProgress[id];
  }

  saveStore();
  res.json({ success: true, removedUser: removed });
});

// App Settings (Website Name & Badge)
app.get('/api/settings', (req, res) => {
  const settings = store.settings || {
    appTitle: '12th Prep',
    appBadge: 'BIEAP State Board'
  };
  res.json({ success: true, settings });
});

app.post('/api/settings', (req, res) => {
  const { appTitle, appBadge } = req.body;
  if (!store.settings) store.settings = {};
  if (appTitle) store.settings.appTitle = appTitle.trim();
  if (appBadge) store.settings.appBadge = appBadge.trim();
  saveStore();
  res.json({ success: true, settings: store.settings });
});

// 3. Targets Endpoints
app.get('/api/targets', (req, res) => {
  const { date, userId } = req.query;
  let list = store.targets;
  if (date) {
    list = list.filter(t => t.date === date);
  }
  if (userId) {
    list = list.filter(t => t.userId === userId);
  }
  res.json({ success: true, targets: list });
});

app.post('/api/targets', (req, res) => {
  const { userId, subject, chapterId, chapterName, weightage, questionCategory, exercise, task, date } = req.body;
  if (!userId || !subject || !task) {
    return res.status(400).json({ error: 'Missing required target fields' });
  }

  const targetDate = date || new Date().toISOString().split('T')[0];
  const newTarget = {
    id: 't-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    userId,
    subject,
    chapterId: chapterId || null,
    chapterName: chapterName || '',
    weightage: Number(weightage) || 0,
    questionCategory: questionCategory || null,
    exercise: exercise || null,
    task: task.trim(),
    date: targetDate,
    completed: false,
    completedAt: null,
    completedQuestionsType: null,
    completedQuestionsCount: null,
    timeSpentSeconds: 0
  };

  store.targets.push(newTarget);
  saveStore();
  res.status(201).json({ success: true, target: newTarget });
});

// BROADCAST TARGET TO ALL MEMBERS AT ONCE
app.post('/api/targets/broadcast', (req, res) => {
  const { subject, chapterId, chapterName, weightage, questionCategory, exercise, task, date } = req.body;
  if (!subject || !task) {
    return res.status(400).json({ error: 'Missing subject or task description' });
  }

  const targetDate = date || new Date().toISOString().split('T')[0];
  const createdList = [];

  store.users.forEach(user => {
    const newTarget = {
      id: 't-' + Date.now() + '-' + user.id + '-' + Math.random().toString(36).substring(2, 5),
      userId: user.id,
      subject,
      chapterId: chapterId || null,
      chapterName: chapterName || '',
      weightage: Number(weightage) || 0,
      questionCategory: questionCategory || null,
      exercise: exercise || null,
      task: task.trim(),
      date: targetDate,
      completed: false,
      completedAt: null,
      completedQuestionsType: null,
      completedQuestionsCount: null,
      timeSpentSeconds: 0
    };
    store.targets.push(newTarget);
    createdList.push(newTarget);
  });

  saveStore();
  res.status(201).json({ success: true, targets: createdList, count: createdList.length });
});

app.patch('/api/targets/:id/toggle', (req, res) => {
  const { id } = req.params;
  const { completedQuestionsType, completedQuestionsCount } = req.body || {};
  const target = store.targets.find(t => t.id === id);
  if (!target) return res.status(404).json({ error: 'Target not found' });

  target.completed = !target.completed;
  target.completedAt = target.completed ? new Date().toISOString() : null;

  if (target.completed) {
    target.completedQuestionsType = completedQuestionsType || 'all';
    target.completedQuestionsCount = completedQuestionsCount !== undefined ? Number(completedQuestionsCount) : null;
  } else {
    target.completedQuestionsType = null;
    target.completedQuestionsCount = null;
  }

  // Auto-update chapter progress if linked to chapter and completed
  if (target.completed && target.chapterId) {
    if (!store.chapterProgress[target.userId]) {
      store.chapterProgress[target.userId] = {};
    }
    const current = store.chapterProgress[target.userId][target.chapterId];
    if (!current || current.status !== 'completed') {
      store.chapterProgress[target.userId][target.chapterId] = {
        status: 'in_progress',
        updatedAt: new Date().toISOString()
      };
    }
  }

  saveStore();
  res.json({ success: true, target });
});

// LOG TIMER ON TARGET
app.patch('/api/targets/:id/timer', (req, res) => {
  const { id } = req.params;
  const { seconds } = req.body;
  const target = store.targets.find(t => t.id === id);
  if (!target) return res.status(404).json({ error: 'Target not found' });

  const added = Number(seconds) || 0;
  target.timeSpentSeconds = (target.timeSpentSeconds || 0) + added;

  // Also add to user's overall daily study time
  const user = store.users.find(u => u.id === target.userId);
  if (user) {
    user.todayStudySeconds = (user.todayStudySeconds || 0) + added;
  }

  saveStore();
  res.json({ success: true, target, userStudySeconds: user?.todayStudySeconds || 0 });
});

app.delete('/api/targets/:id', (req, res) => {
  const { id } = req.params;
  const idx = store.targets.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Target not found' });
  store.targets.splice(idx, 1);
  saveStore();
  res.json({ success: true, id });
});

// 4. Chapter Progress Endpoints
app.get('/api/progress/:userId', (req, res) => {
  const { userId } = req.params;
  const progress = store.chapterProgress[userId] || {};
  res.json({ success: true, progress });
});

app.post('/api/progress/:userId', (req, res) => {
  const { userId } = req.params;
  const { chapterId, status } = req.body;
  if (!chapterId || !status) {
    return res.status(400).json({ error: 'chapterId and status required' });
  }

  if (!store.chapterProgress[userId]) {
    store.chapterProgress[userId] = {};
  }

  store.chapterProgress[userId][chapterId] = {
    status,
    updatedAt: new Date().toISOString()
  };

  saveStore();
  res.json({ success: true, progress: store.chapterProgress[userId] });
});

// 5. Group Overview / Peer Activity Feed (with Dual Progress Bars)
app.get('/api/group-overview', (req, res) => {
  const today = req.query.date || new Date().toISOString().split('T')[0];

  const totalSubjectMarks = {
    Maths: (store.syllabus.Maths || []).reduce((acc, c) => acc + (Number(c.weightage) || 0), 0),
    Physics: (store.syllabus.Physics || []).reduce((acc, c) => acc + (Number(c.weightage) || 0), 0),
    Chemistry: (store.syllabus.Chemistry || []).reduce((acc, c) => acc + (Number(c.weightage) || 0), 0)
  };
  const grandTotalMarks = totalSubjectMarks.Maths + totalSubjectMarks.Physics + totalSubjectMarks.Chemistry;

  let totalGroupTodayTargets = 0;
  let totalGroupTodayCompleted = 0;
  let totalGroupStudySeconds = 0;
  let totalSyllabusSum = 0;

  const usersOverview = store.users.map(u => {
    const userTargetsToday = store.targets.filter(t => t.userId === u.id && t.date === today);
    const completedToday = userTargetsToday.filter(t => t.completed).length;
    const totalToday = userTargetsToday.length;

    totalGroupTodayTargets += totalToday;
    totalGroupTodayCompleted += completedToday;
    totalGroupStudySeconds += (u.todayStudySeconds || 0);

    // Calculate completed weightage
    const userProg = store.chapterProgress[u.id] || {};
    let completedWeightage = 0;
    ['Maths', 'Physics', 'Chemistry'].forEach(sub => {
      (store.syllabus[sub] || []).forEach(chap => {
        if (userProg[chap.id]?.status === 'completed') {
          completedWeightage += Number(chap.weightage) || 0;
        } else if (userProg[chap.id]?.status === 'revised') {
          completedWeightage += Number(chap.weightage) || 0;
        } else if (userProg[chap.id]?.status === 'in_progress') {
          completedWeightage += (Number(chap.weightage) || 0) * 0.4;
        }
      });
    });

    const completionPercentage = grandTotalMarks > 0 
      ? Math.round((completedWeightage / grandTotalMarks) * 100) 
      : 0;

    totalSyllabusSum += completionPercentage;

    const dailyRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

    return {
      ...u,
      targetsToday: {
        total: totalToday,
        completed: completedToday,
        list: userTargetsToday
      },
      dailyCompletionRate: dailyRate,
      completedWeightage: Math.round(completedWeightage),
      grandTotalMarks,
      syllabusCompletionRate: completionPercentage,
      todayStudyMinutes: Math.round((u.todayStudySeconds || 0) / 60)
    };
  });

  const groupDailyCompletionRate = totalGroupTodayTargets > 0
    ? Math.round((totalGroupTodayCompleted / totalGroupTodayTargets) * 100)
    : 0;

  const groupAverageSyllabusRate = usersOverview.length > 0
    ? Math.round(totalSyllabusSum / usersOverview.length)
    : 0;

  res.json({
    success: true,
    today,
    totalSubjectMarks,
    grandTotalMarks,
    todayGroupTargetsCount: totalGroupTodayTargets,
    todayGroupCompletedCount: totalGroupTodayCompleted,
    groupDailyCompletionRate,
    groupAverageSyllabusRate,
    groupTodayStudyMinutes: Math.round(totalGroupStudySeconds / 60),
    members: usersOverview
  });
});

// Fallback for SPA routing if dist exists
if (fs.existsSync(clientDist)) {
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientDist, 'index.html'));
    }
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
