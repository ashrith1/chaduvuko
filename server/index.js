import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { defaultSyllabus } from './defaultData.js';
import { db, initDatabase } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve client dist if built
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
}

// Helper: map DB user row to API user object
function mapUserRow(row) {
  return {
    id: String(row.id),
    name: String(row.name),
    username: row.username || String(row.name).toLowerCase().replace(/\s+/g, ''),
    avatar: row.avatar || '🚀',
    targetScore: row.target_score || '95%+',
    status: row.status || 'Ready to study',
    streak: Number(row.streak) || 1,
    todayStudySeconds: Number(row.today_study_seconds) || 0,
    joinedAt: row.joined_at,
    role: row.role || 'student',
    pin: row.pin || '1234',
    password: row.password || row.pin || '1234'
  };
}

// Helper: map DB target row to API target object
function mapTargetRow(row) {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    subject: String(row.subject),
    chapterId: row.chapter_id || null,
    chapterName: row.chapter_name || '',
    weightage: Number(row.weightage) || 0,
    questionCategory: row.question_category || null,
    questionCount: row.question_count ? Number(row.question_count) : null,
    exercise: row.exercise || null,
    task: String(row.task),
    date: String(row.date),
    completed: Boolean(row.completed),
    completedAt: row.completed_at || null,
    completedQuestionsType: row.completed_questions_type || null,
    completedQuestionsCount: row.completed_questions_count !== null && row.completed_questions_count !== undefined
      ? Number(row.completed_questions_count)
      : null,
    timeSpentSeconds: Number(row.time_spent_seconds) || 0
  };
}

// Helper: get active syllabus
async function getActiveSyllabus() {
  const res = await db.execute("SELECT json_data FROM syllabus_data WHERE id = 'active'");
  if (res.rows.length > 0) {
    try {
      return JSON.parse(res.rows[0].json_data);
    } catch (e) {
      console.error('Error parsing syllabus JSON:', e);
    }
  }
  return defaultSyllabus;
}

// ==========================================
// 1. Syllabus Endpoints
// ==========================================
app.get('/api/syllabus', async (req, res) => {
  try {
    const syllabus = await getActiveSyllabus();
    res.json({ success: true, syllabus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/syllabus', async (req, res) => {
  try {
    const { syllabus } = req.body;
    if (!syllabus || !syllabus.Maths || !syllabus.Physics || !syllabus.Chemistry) {
      return res.status(400).json({ error: 'Invalid syllabus payload. Must contain Maths, Physics, Chemistry.' });
    }
    await db.execute({
      sql: "INSERT OR REPLACE INTO syllabus_data (id, json_data) VALUES ('active', ?)",
      args: [JSON.stringify(syllabus)]
    });
    res.json({ success: true, syllabus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/syllabus/reset', async (req, res) => {
  try {
    await db.execute({
      sql: "INSERT OR REPLACE INTO syllabus_data (id, json_data) VALUES ('active', ?)",
      args: [JSON.stringify(defaultSyllabus)]
    });
    res.json({ success: true, syllabus: defaultSyllabus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 2. Users / Friends Endpoints
// ==========================================
app.get('/api/users', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM users ORDER BY rowid ASC');
    const users = result.rows.map(mapUserRow);
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, avatar, targetScore } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const cleanName = name.trim();

    // Check existing
    const existing = await db.execute({
      sql: 'SELECT * FROM users WHERE LOWER(name) = LOWER(?)',
      args: [cleanName]
    });

    if (existing.rows.length > 0) {
      const user = mapUserRow(existing.rows[0]);
      if (avatar || targetScore) {
        await db.execute({
          sql: 'UPDATE users SET avatar = COALESCE(?, avatar), target_score = COALESCE(?, target_score) WHERE id = ?',
          args: [avatar || null, targetScore || null, user.id]
        });
        if (avatar) user.avatar = avatar;
        if (targetScore) user.targetScore = targetScore;
      }
      return res.json({ success: true, user });
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

    await db.execute({
      sql: `INSERT INTO users (id, name, avatar, target_score, status, streak, today_study_seconds, joined_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [newUser.id, newUser.name, newUser.avatar, newUser.targetScore, newUser.status, newUser.streak, newUser.todayStudySeconds, newUser.joinedAt]
    });

    res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, avatar, targetScore, status, addStudySeconds } = req.body;

    const existing = await db.execute({
      sql: 'SELECT * FROM users WHERE id = ?',
      args: [id]
    });
    if (existing.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const current = mapUserRow(existing.rows[0]);
    const updatedName = name !== undefined ? name.trim() : current.name;
    const updatedAvatar = avatar !== undefined ? avatar : current.avatar;
    const updatedTargetScore = targetScore !== undefined ? targetScore : current.targetScore;
    const updatedStatus = status !== undefined ? status : current.status;
    const newStudySeconds = current.todayStudySeconds + (Number(addStudySeconds) || 0);

    await db.execute({
      sql: `UPDATE users SET name = ?, avatar = ?, target_score = ?, status = ?, today_study_seconds = ? WHERE id = ?`,
      args: [updatedName, updatedAvatar, updatedTargetScore, updatedStatus, newStudySeconds, id]
    });

    res.json({
      success: true,
      user: {
        ...current,
        name: updatedName,
        avatar: updatedAvatar,
        targetScore: updatedTargetScore,
        status: updatedStatus,
        todayStudySeconds: newStudySeconds
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const countRes = await db.execute('SELECT COUNT(*) as count FROM users');
    if (Number(countRes.rows[0].count) <= 1) {
      return res.status(400).json({ error: 'Cannot delete the only member in the group' });
    }

    const userRes = await db.execute({ sql: 'SELECT * FROM users WHERE id = ?', args: [id] });
    if (userRes.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const removedUser = mapUserRow(userRes.rows[0]);

    await db.execute({ sql: 'DELETE FROM targets WHERE user_id = ?', args: [id] });
    await db.execute({ sql: 'DELETE FROM chapter_progress WHERE user_id = ?', args: [id] });
    await db.execute({ sql: 'DELETE FROM users WHERE id = ?', args: [id] });

    res.json({ success: true, removedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User Login with Custom ID / Username & Password verification
app.post('/api/login', async (req, res) => {
  try {
    const identifier = String(req.body.username || req.body.userId || '').trim();
    const secret = String(req.body.password || req.body.pin || '').trim();

    if (!identifier) {
      return res.status(400).json({ error: 'User ID or Username is required' });
    }
    if (!secret) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Lookup user by case-insensitive username, ID, or full name
    const userRes = await db.execute({
      sql: 'SELECT * FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(id) = LOWER(?) OR LOWER(name) = LOWER(?) LIMIT 1',
      args: [identifier, identifier, identifier]
    });

    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'Account not found. Please check your User ID or Username.' });
    }

    const user = mapUserRow(userRes.rows[0]);
    const expectedPassword = user.password || user.pin || '1234';

    if (secret !== expectedPassword && secret !== user.pin && secret !== user.password) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Student Self-Registration with custom ID and Password
app.post('/api/register', async (req, res) => {
  try {
    const { name, username, password, avatar, targetScore } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: 'Full name is required' });
    if (!username || !username.trim()) return res.status(400).json({ error: 'Custom User ID / Username is required' });
    if (!password || !password.trim()) return res.status(400).json({ error: 'Password is required' });

    const cleanName = name.trim();
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    const cleanPassword = password.trim();

    if (cleanUsername.length < 3) {
      return res.status(400).json({ error: 'User ID must be at least 3 characters (letters, numbers, underscores)' });
    }

    if (cleanPassword.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters' });
    }

    // Check if username is already taken
    const existing = await db.execute({
      sql: 'SELECT id FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(id) = LOWER(?) LIMIT 1',
      args: [cleanUsername, cleanUsername]
    });

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: `User ID '${cleanUsername}' is already taken. Please choose another.` });
    }

    const newUser = {
      id: 'u-' + Date.now(),
      name: cleanName,
      username: cleanUsername,
      password: cleanPassword,
      avatar: avatar || '🚀',
      targetScore: targetScore || '95%+',
      status: 'Ready to study',
      streak: 1,
      todayStudySeconds: 0,
      joinedAt: new Date().toISOString(),
      role: 'student',
      pin: cleanPassword
    };

    await db.execute({
      sql: `INSERT INTO users (id, name, username, password, avatar, target_score, status, streak, today_study_seconds, joined_at, role, pin)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        newUser.id,
        newUser.name,
        newUser.username,
        newUser.password,
        newUser.avatar,
        newUser.targetScore,
        newUser.status,
        newUser.streak,
        newUser.todayStudySeconds,
        newUser.joinedAt,
        newUser.role,
        newUser.pin
      ]
    });

    res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update PIN
app.patch('/api/users/:id/pin', async (req, res) => {
  try {
    const { id } = req.params;
    const { pin } = req.body;
    if (!pin || String(pin).trim().length < 4) {
      return res.status(400).json({ error: 'PIN must be at least 4 digits' });
    }

    await db.execute({
      sql: 'UPDATE users SET pin = ? WHERE id = ?',
      args: [String(pin).trim(), id]
    });

    res.json({ success: true, message: 'PIN updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Calendar History for a specific user
app.get('/api/calendar/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const targetsRes = await db.execute({
      sql: 'SELECT * FROM targets WHERE user_id = ? ORDER BY date DESC',
      args: [userId]
    });
    const targets = targetsRes.rows.map(mapTargetRow);

    const byDate = {};
    for (const t of targets) {
      if (!byDate[t.date]) {
        byDate[t.date] = {
          date: t.date,
          totalTargets: 0,
          completedTargets: 0,
          studyMinutes: 0,
          targets: []
        };
      }
      byDate[t.date].totalTargets += 1;
      if (t.completed) byDate[t.date].completedTargets += 1;
      byDate[t.date].studyMinutes += Math.round((t.timeSpentSeconds || 0) / 60);
      byDate[t.date].targets.push(t);
    }

    const days = Object.values(byDate).sort((a, b) => b.date.localeCompare(a.date));
    res.json({ success: true, days });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Monitoring Overview (Comprehensive Audit across all days and members)
app.get('/api/admin/overview', async (req, res) => {
  try {
    const usersRes = await db.execute('SELECT * FROM users ORDER BY rowid ASC');
    const users = usersRes.rows.map(mapUserRow);

    const targetsRes = await db.execute('SELECT * FROM targets ORDER BY date DESC');
    const allTargets = targetsRes.rows.map(mapTargetRow);

    const progressRes = await db.execute('SELECT * FROM chapter_progress');
    const progressByUser = {};
    for (const p of progressRes.rows) {
      if (!progressByUser[p.user_id]) progressByUser[p.user_id] = {};
      progressByUser[p.user_id][p.chapter_id] = { status: p.status, updatedAt: p.updated_at };
    }

    const syllabus = await getActiveSyllabus();
    const grandTotalMarks =
      (syllabus.Maths || []).reduce((a, c) => a + (Number(c.weightage) || 0), 0) +
      (syllabus.Physics || []).reduce((a, c) => a + (Number(c.weightage) || 0), 0) +
      (syllabus.Chemistry || []).reduce((a, c) => a + (Number(c.weightage) || 0), 0);

    const auditMembers = users.map((u) => {
      const userTargets = allTargets.filter((t) => t.userId === u.id);
      const completedTotal = userTargets.filter((t) => t.completed).length;
      const totalStudySeconds = userTargets.reduce((acc, t) => acc + (t.timeSpentSeconds || 0), u.todayStudySeconds || 0);

      // Unique days studied
      const activeDates = Array.from(new Set(userTargets.map((t) => t.date)));

      const userProg = progressByUser[u.id] || {};
      let completedWeightage = 0;
      ['Maths', 'Physics', 'Chemistry'].forEach((sub) => {
        (syllabus[sub] || []).forEach((chap) => {
          if (userProg[chap.id]?.status === 'completed' || userProg[chap.id]?.status === 'revised') {
            completedWeightage += Number(chap.weightage) || 0;
          } else if (userProg[chap.id]?.status === 'in_progress') {
            completedWeightage += (Number(chap.weightage) || 0) * 0.4;
          }
        });
      });

      const syllabusRate = grandTotalMarks > 0 ? Math.round((completedWeightage / grandTotalMarks) * 100) : 0;

      return {
        ...u,
        totalLifetimeTargets: userTargets.length,
        completedLifetimeTargets: completedTotal,
        activeDaysCount: activeDates.length,
        totalStudyHours: Number((totalStudySeconds / 3600).toFixed(1)),
        syllabusCompletionRate: syllabusRate,
        recentTargets: userTargets.slice(0, 5)
      };
    });

    res.json({
      success: true,
      totalUsers: users.length,
      grandTotalMarks,
      auditMembers
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 3. Settings Endpoints
// ==========================================
app.get('/api/settings', async (req, res) => {
  try {
    const result = await db.execute("SELECT value FROM app_settings WHERE key = 'branding'");
    let settings = { appTitle: 'Chaduvuko', appBadge: 'BIEAP 12th' };
    if (result.rows.length > 0) {
      try {
        settings = JSON.parse(result.rows[0].value);
      } catch (e) {}
    }
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const { appTitle, appBadge } = req.body;
    const currentRes = await db.execute("SELECT value FROM app_settings WHERE key = 'branding'");
    let current = { appTitle: 'Chaduvuko', appBadge: 'BIEAP 12th' };
    if (currentRes.rows.length > 0) {
      try {
        current = JSON.parse(currentRes.rows[0].value);
      } catch (e) {}
    }

    const updated = {
      appTitle: appTitle ? appTitle.trim() : current.appTitle,
      appBadge: appBadge ? appBadge.trim() : current.appBadge
    };

    await db.execute({
      sql: "INSERT OR REPLACE INTO app_settings (key, value) VALUES ('branding', ?)",
      args: [JSON.stringify(updated)]
    });

    res.json({ success: true, settings: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. Targets Endpoints
// ==========================================
app.get('/api/targets', async (req, res) => {
  try {
    const { date, userId } = req.query;
    let sql = 'SELECT * FROM targets';
    const conditions = [];
    const args = [];

    if (date) {
      conditions.push('date = ?');
      args.push(date);
    }
    if (userId) {
      conditions.push('user_id = ?');
      args.push(userId);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY rowid ASC';

    const result = await db.execute({ sql, args });
    const targets = result.rows.map(mapTargetRow);
    res.json({ success: true, targets });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/targets', async (req, res) => {
  try {
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

    await db.execute({
      sql: `INSERT INTO targets (id, user_id, subject, chapter_id, chapter_name, weightage, question_category, exercise, task, date, completed, completed_at, completed_questions_type, completed_questions_count, time_spent_seconds)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NULL, NULL, NULL, 0)`,
      args: [
        newTarget.id,
        newTarget.userId,
        newTarget.subject,
        newTarget.chapterId,
        newTarget.chapterName,
        newTarget.weightage,
        newTarget.questionCategory,
        newTarget.exercise,
        newTarget.task,
        newTarget.date
      ]
    });

    res.status(201).json({ success: true, target: newTarget });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// BROADCAST TARGET TO ALL MEMBERS AT ONCE
app.post('/api/targets/broadcast', async (req, res) => {
  try {
    const { subject, chapterId, chapterName, weightage, questionCategory, exercise, task, date } = req.body;
    if (!subject || !task) {
      return res.status(400).json({ error: 'Missing subject or task description' });
    }

    const targetDate = date || new Date().toISOString().split('T')[0];
    const usersRes = await db.execute('SELECT id FROM users');
    const createdList = [];

    for (const u of usersRes.rows) {
      const newTarget = {
        id: 't-' + Date.now() + '-' + u.id + '-' + Math.random().toString(36).substring(2, 5),
        userId: String(u.id),
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

      await db.execute({
        sql: `INSERT INTO targets (id, user_id, subject, chapter_id, chapter_name, weightage, question_category, exercise, task, date, completed, completed_at, completed_questions_type, completed_questions_count, time_spent_seconds)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NULL, NULL, NULL, 0)`,
        args: [
          newTarget.id,
          newTarget.userId,
          newTarget.subject,
          newTarget.chapterId,
          newTarget.chapterName,
          newTarget.weightage,
          newTarget.questionCategory,
          newTarget.exercise,
          newTarget.task,
          newTarget.date
        ]
      });

      createdList.push(newTarget);
    }

    res.status(201).json({ success: true, targets: createdList, count: createdList.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/targets/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const { completedQuestionsType, completedQuestionsCount } = req.body || {};

    const targetRes = await db.execute({ sql: 'SELECT * FROM targets WHERE id = ?', args: [id] });
    if (targetRes.rows.length === 0) return res.status(404).json({ error: 'Target not found' });

    const current = mapTargetRow(targetRes.rows[0]);
    const nextCompleted = !current.completed;
    const completedAt = nextCompleted ? new Date().toISOString() : null;
    const type = nextCompleted ? (completedQuestionsType || 'all') : null;
    const count = nextCompleted && completedQuestionsCount !== undefined ? Number(completedQuestionsCount) : null;

    await db.execute({
      sql: `UPDATE targets SET completed = ?, completed_at = ?, completed_questions_type = ?, completed_questions_count = ? WHERE id = ?`,
      args: [nextCompleted ? 1 : 0, completedAt, type, count, id]
    });

    // Auto-update chapter progress if completed
    if (nextCompleted && current.chapterId) {
      const progRes = await db.execute({
        sql: 'SELECT status FROM chapter_progress WHERE user_id = ? AND chapter_id = ?',
        args: [current.userId, current.chapterId]
      });
      if (progRes.rows.length === 0 || progRes.rows[0].status !== 'completed') {
        await db.execute({
          sql: `INSERT OR REPLACE INTO chapter_progress (user_id, chapter_id, status, updated_at) VALUES (?, ?, 'in_progress', ?)`,
          args: [current.userId, current.chapterId, new Date().toISOString()]
        });
      }
    }

    res.json({
      success: true,
      target: {
        ...current,
        completed: nextCompleted,
        completedAt,
        completedQuestionsType: type,
        completedQuestionsCount: count
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOG TIMER ON TARGET
app.patch('/api/targets/:id/timer', async (req, res) => {
  try {
    const { id } = req.params;
    const { seconds } = req.body;
    const added = Number(seconds) || 0;

    const targetRes = await db.execute({ sql: 'SELECT * FROM targets WHERE id = ?', args: [id] });
    if (targetRes.rows.length === 0) return res.status(404).json({ error: 'Target not found' });

    const target = mapTargetRow(targetRes.rows[0]);
    const newSpent = target.timeSpentSeconds + added;

    await db.execute({
      sql: 'UPDATE targets SET time_spent_seconds = ? WHERE id = ?',
      args: [newSpent, id]
    });

    // Also update user's daily study time
    await db.execute({
      sql: 'UPDATE users SET today_study_seconds = today_study_seconds + ? WHERE id = ?',
      args: [added, target.userId]
    });

    const userRes = await db.execute({ sql: 'SELECT today_study_seconds FROM users WHERE id = ?', args: [target.userId] });
    const userStudySeconds = userRes.rows.length > 0 ? Number(userRes.rows[0].today_study_seconds) : 0;

    res.json({
      success: true,
      target: { ...target, timeSpentSeconds: newSpent },
      userStudySeconds
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// RESCHEDULE TARGET (e.g., move incomplete yesterday targets to today)
app.patch('/api/targets/:id/reschedule', async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body;
    if (!date) return res.status(400).json({ error: 'New date required' });

    await db.execute({
      sql: 'UPDATE targets SET date = ? WHERE id = ?',
      args: [date, id]
    });

    res.json({ success: true, id, date });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/targets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute({ sql: 'DELETE FROM targets WHERE id = ?', args: [id] });
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 5. Chapter Progress Endpoints
// ==========================================
app.get('/api/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await db.execute({
      sql: 'SELECT chapter_id, status, updated_at FROM chapter_progress WHERE user_id = ?',
      args: [userId]
    });

    const progress = {};
    for (const r of result.rows) {
      progress[r.chapter_id] = {
        status: r.status,
        updatedAt: r.updated_at
      };
    }

    res.json({ success: true, progress });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { chapterId, status } = req.body;
    if (!chapterId || !status) {
      return res.status(400).json({ error: 'chapterId and status required' });
    }

    const updatedAt = new Date().toISOString();
    await db.execute({
      sql: `INSERT OR REPLACE INTO chapter_progress (user_id, chapter_id, status, updated_at) VALUES (?, ?, ?, ?)`,
      args: [userId, chapterId, status, updatedAt]
    });

    const allRes = await db.execute({
      sql: 'SELECT chapter_id, status, updated_at FROM chapter_progress WHERE user_id = ?',
      args: [userId]
    });
    const progress = {};
    for (const r of allRes.rows) {
      progress[r.chapter_id] = { status: r.status, updatedAt: r.updated_at };
    }

    res.json({ success: true, progress });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 6. Group Overview & Analytics
// ==========================================
app.get('/api/group-overview', async (req, res) => {
  try {
    const today = req.query.date || new Date().toISOString().split('T')[0];
    const syllabus = await getActiveSyllabus();

    const totalSubjectMarks = {
      Maths: (syllabus.Maths || []).reduce((acc, c) => acc + (Number(c.weightage) || 0), 0),
      Physics: (syllabus.Physics || []).reduce((acc, c) => acc + (Number(c.weightage) || 0), 0),
      Chemistry: (syllabus.Chemistry || []).reduce((acc, c) => acc + (Number(c.weightage) || 0), 0)
    };
    const grandTotalMarks = totalSubjectMarks.Maths + totalSubjectMarks.Physics + totalSubjectMarks.Chemistry;

    const usersRes = await db.execute('SELECT * FROM users ORDER BY rowid ASC');
    const users = usersRes.rows.map(mapUserRow);

    const targetsRes = await db.execute({
      sql: 'SELECT * FROM targets WHERE date = ?',
      args: [today]
    });
    const allTodayTargets = targetsRes.rows.map(mapTargetRow);

    const progressRes = await db.execute('SELECT * FROM chapter_progress');
    const progressByUser = {};
    for (const p of progressRes.rows) {
      if (!progressByUser[p.user_id]) progressByUser[p.user_id] = {};
      progressByUser[p.user_id][p.chapter_id] = { status: p.status, updatedAt: p.updated_at };
    }

    let totalGroupTodayTargets = 0;
    let totalGroupTodayCompleted = 0;
    let totalGroupStudySeconds = 0;
    let totalSyllabusSum = 0;

    const members = users.map((u) => {
      const userTargetsToday = allTodayTargets.filter((t) => t.userId === u.id);
      const completedToday = userTargetsToday.filter((t) => t.completed).length;
      const totalToday = userTargetsToday.length;

      totalGroupTodayTargets += totalToday;
      totalGroupTodayCompleted += completedToday;
      totalGroupStudySeconds += u.todayStudySeconds || 0;

      const userProg = progressByUser[u.id] || {};
      let completedWeightage = 0;
      ['Maths', 'Physics', 'Chemistry'].forEach((sub) => {
        (syllabus[sub] || []).forEach((chap) => {
          if (userProg[chap.id]?.status === 'completed' || userProg[chap.id]?.status === 'revised') {
            completedWeightage += Number(chap.weightage) || 0;
          } else if (userProg[chap.id]?.status === 'in_progress') {
            completedWeightage += (Number(chap.weightage) || 0) * 0.4;
          }
        });
      });

      const completionPercentage = grandTotalMarks > 0 ? Math.round((completedWeightage / grandTotalMarks) * 100) : 0;
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

    const groupAverageSyllabusRate = members.length > 0
      ? Math.round(totalSyllabusSum / members.length)
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
      members
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SPA Fallback
if (fs.existsSync(clientDist)) {
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientDist, 'index.html'));
    }
  });
}

const PORT = process.env.PORT || 3001;

// Initialize Database before listening
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Fatal: Failed to initialize database:', err);
    process.exit(1);
  });
