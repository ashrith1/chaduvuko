import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { defaultSyllabus } from './defaultData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory or root
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const localDbPath = path.join(dataDir, 'chaduvuko.db').replace(/\\/g, '/');
const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

export const db = createClient({
  url: tursoUrl || `file:${localDbPath}`,
  authToken: tursoToken
});

export const isUsingTursoCloud = Boolean(tursoUrl && tursoUrl.startsWith('libsql://'));

/**
 * Initialize database tables and seed with initial data if empty.
 */
export async function initDatabase() {
  console.log(
    isUsingTursoCloud
      ? `🌐 Connected to Turso Cloud Database: ${tursoUrl}`
      : `📁 Using Local SQLite Database: file:${localDbPath}`
  );

  // 1. Create Tables
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      avatar TEXT DEFAULT '🚀',
      target_score TEXT DEFAULT '95%+',
      status TEXT DEFAULT 'Ready to study',
      streak INTEGER DEFAULT 1,
      today_study_seconds INTEGER DEFAULT 0,
      joined_at TEXT NOT NULL,
      role TEXT DEFAULT 'student',
      pin TEXT DEFAULT '1234'
    );

    CREATE TABLE IF NOT EXISTS targets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      subject TEXT NOT NULL,
      chapter_id TEXT,
      chapter_name TEXT,
      weightage INTEGER DEFAULT 0,
      question_category TEXT,
      question_count INTEGER,
      exercise TEXT,
      task TEXT NOT NULL,
      date TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      completed_at TEXT,
      completed_questions_type TEXT,
      completed_questions_count INTEGER,
      time_spent_seconds INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS chapter_progress (
      user_id TEXT NOT NULL,
      chapter_id TEXT NOT NULL,
      status TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (user_id, chapter_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS syllabus_data (
      id TEXT PRIMARY KEY,
      json_data TEXT NOT NULL
    );
  `);

  // 2. Seed Default Settings if not set
  const settingsRes = await db.execute("SELECT * FROM app_settings WHERE key = 'branding'");
  if (settingsRes.rows.length === 0) {
    await db.execute({
      sql: 'INSERT INTO app_settings (key, value) VALUES (?, ?)',
      args: ['branding', JSON.stringify({ appTitle: 'Chaduvuko', appBadge: 'BIEAP 12th' })]
    });
  }

  // 3. Seed Default Syllabus if not set
  const syllabusRes = await db.execute("SELECT * FROM syllabus_data WHERE id = 'active'");
  if (syllabusRes.rows.length === 0) {
    await db.execute({
      sql: 'INSERT INTO syllabus_data (id, json_data) VALUES (?, ?)',
      args: ['active', JSON.stringify(defaultSyllabus)]
    });
  }

  // 4. Seed Default Users if none exist (or migrate from store.json)
  const usersRes = await db.execute('SELECT COUNT(*) as count FROM users');
  const userCount = Number(usersRes.rows[0].count);

  if (userCount === 0) {
    const storeJsonPath = path.join(__dirname, 'data', 'store.json');
    let migrated = false;

    if (fs.existsSync(storeJsonPath)) {
      try {
        const raw = fs.readFileSync(storeJsonPath, 'utf-8');
        const storeData = JSON.parse(raw);

        if (Array.isArray(storeData.users) && storeData.users.length > 0) {
          console.log(`📦 Migrating ${storeData.users.length} users and data from store.json to Turso/SQLite...`);
          
          for (const u of storeData.users) {
            await db.execute({
              sql: `INSERT OR REPLACE INTO users (id, name, avatar, target_score, status, streak, today_study_seconds, joined_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              args: [
                u.id,
                u.name,
                u.avatar || '🚀',
                u.targetScore || '95%+',
                u.status || 'Ready to study',
                u.streak || 1,
                u.todayStudySeconds || 0,
                u.joinedAt || new Date().toISOString()
              ]
            });
          }

          if (Array.isArray(storeData.targets)) {
            for (const t of storeData.targets) {
              await db.execute({
                sql: `INSERT OR REPLACE INTO targets (id, user_id, subject, chapter_id, chapter_name, weightage, question_category, question_count, exercise, task, date, completed, completed_at, completed_questions_type, completed_questions_count, time_spent_seconds)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                args: [
                  t.id,
                  t.userId,
                  t.subject,
                  t.chapterId || null,
                  t.chapterName || '',
                  t.weightage || 0,
                  t.questionCategory || null,
                  t.questionCount || null,
                  t.exercise || null,
                  t.task,
                  t.date,
                  t.completed ? 1 : 0,
                  t.completedAt || null,
                  t.completedQuestionsType || null,
                  t.completedQuestionsCount || null,
                  t.timeSpentSeconds || 0
                ]
              });
            }
          }

          if (storeData.chapterProgress) {
            for (const [userId, chaps] of Object.entries(storeData.chapterProgress)) {
              for (const [chapId, prog] of Object.entries(chaps)) {
                await db.execute({
                  sql: `INSERT OR REPLACE INTO chapter_progress (user_id, chapter_id, status, updated_at)
                        VALUES (?, ?, ?, ?)`,
                  args: [userId, chapId, prog.status, prog.updatedAt || new Date().toISOString()]
                });
              }
            }
          }
          migrated = true;
          console.log('✅ Successfully migrated store.json to database!');
        }
      } catch (err) {
        console.error('Failed to migrate store.json, using defaults:', err);
      }
    }

    if (!migrated) {
      // Seed initial starter users
      const initialUsers = [
        { id: 'u-1', name: 'Ashrith', avatar: '🚀', targetScore: '95%+', status: 'Ready to study', streak: 4, todayStudySeconds: 1500 },
        { id: 'u-2', name: 'Rohan', avatar: '⚡', targetScore: '90%+', status: 'Solving Integrals', streak: 3, todayStudySeconds: 1200 },
        { id: 'u-3', name: 'Priya', avatar: '📚', targetScore: '95%+', status: 'Reviewing Ray Optics', streak: 5, todayStudySeconds: 1800 }
      ];

      for (const u of initialUsers) {
        await db.execute({
          sql: `INSERT INTO users (id, name, avatar, target_score, status, streak, today_study_seconds, joined_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [u.id, u.name, u.avatar, u.targetScore, u.status, u.streak, u.todayStudySeconds, new Date().toISOString()]
        });
      }

      // Seed starter targets for today
      const today = new Date().toISOString().split('T')[0];
      const initialTargets = [
        {
          id: 't-1',
          userId: 'u-1',
          subject: 'Maths',
          chapterId: 'm-7',
          chapterName: 'Integrals (Definite & Indefinite)',
          weightage: 23,
          questionCategory: '2M',
          exercise: 'Exercise 7(b)',
          task: 'Solve 8 2-Mark Questions from Exercise 7(b)',
          date: today,
          completed: 1,
          completedAt: new Date().toISOString(),
          timeSpentSeconds: 900
        },
        {
          id: 't-2',
          userId: 'u-1',
          subject: 'Physics',
          chapterId: 'p-9',
          chapterName: 'Ray Optics and Optical Instruments',
          weightage: 10,
          questionCategory: '8M',
          exercise: null,
          task: 'Derive Prism Formula and Lens Maker Equation',
          date: today,
          completed: 0,
          completedAt: null,
          timeSpentSeconds: 600
        },
        {
          id: 't-3',
          userId: 'u-1',
          subject: 'Chemistry',
          chapterId: 'c-3',
          chapterName: 'Chemical Kinetics',
          weightage: 15,
          questionCategory: '4M',
          exercise: null,
          task: 'Arrhenius equation numericals + first-order half-life',
          date: today,
          completed: 0,
          completedAt: null,
          timeSpentSeconds: 0
        }
      ];

      for (const t of initialTargets) {
        await db.execute({
          sql: `INSERT INTO targets (id, user_id, subject, chapter_id, chapter_name, weightage, question_category, exercise, task, date, completed, completed_at, time_spent_seconds)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [t.id, t.userId, t.subject, t.chapterId, t.chapterName, t.weightage, t.questionCategory, t.exercise, t.task, t.date, t.completed, t.completedAt, t.timeSpentSeconds]
        });
      }
    }
  }

  console.log('✅ Turso / SQLite Database initialized successfully!');
}
