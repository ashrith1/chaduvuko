import type { SyllabusData, Target, User, GroupOverview, ChapterStatus } from '../types';

const API_BASE = '/api';

const LOCAL_STORAGE_KEY_USER = 'study_tracker_current_user_id';

export const api = {
  getCurrentUserId(): string {
    return localStorage.getItem(LOCAL_STORAGE_KEY_USER) || 'u-1';
  },

  setCurrentUserId(id: string) {
    localStorage.setItem(LOCAL_STORAGE_KEY_USER, id);
  },

  async getSyllabus(): Promise<SyllabusData> {
    const res = await fetch(`${API_BASE}/syllabus`);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    return data.syllabus;
  },

  async updateSyllabus(syllabus: SyllabusData): Promise<SyllabusData> {
    const res = await fetch(`${API_BASE}/syllabus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ syllabus })
    });
    if (!res.ok) throw new Error('Failed to update syllabus');
    const data = await res.json();
    return data.syllabus;
  },

  async resetSyllabus(): Promise<SyllabusData> {
    const res = await fetch(`${API_BASE}/syllabus/reset`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset syllabus');
    const data = await res.json();
    return data.syllabus;
  },

  async getUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/users`);
    if (!res.ok) throw new Error('Failed to fetch users');
    const data = await res.json();
    return data.users;
  },

  async createUser(payload: { name: string; avatar?: string; targetScore?: string }): Promise<User> {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to create user');
    const data = await res.json();
    return data.user;
  },

  async updateUser(id: string, payload: Partial<User> & { addStudySeconds?: number }): Promise<User> {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to update user');
    const data = await res.json();
    return data.user;
  },

  async deleteUser(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete user');
    }
  },

  async getSettings(): Promise<{ appTitle: string; appBadge: string }> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    const data = await res.json();
    return data.settings;
  },

  async updateSettings(settings: { appTitle?: string; appBadge?: string }): Promise<{ appTitle: string; appBadge: string }> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    const data = await res.json();
    return data.settings;
  },

  async getTargets(date?: string, userId?: string): Promise<Target[]> {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (userId) params.append('userId', userId);
    
    const res = await fetch(`${API_BASE}/targets?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch targets');
    const data = await res.json();
    return data.targets;
  },

  async createTarget(target: Omit<Target, 'id' | 'completed' | 'completedAt'>): Promise<Target> {
    const res = await fetch(`${API_BASE}/targets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(target)
    });
    if (!res.ok) throw new Error('Failed to create target');
    const data = await res.json();
    return data.target;
  },

  async broadcastTarget(target: Omit<Target, 'id' | 'userId' | 'completed' | 'completedAt'>): Promise<{ targets: Target[]; count: number }> {
    const res = await fetch(`${API_BASE}/targets/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(target)
    });
    if (!res.ok) throw new Error('Failed to broadcast target');
    return await res.json();
  },

  async toggleTarget(
    id: string,
    options?: { completedQuestionsType?: 'all' | 'custom'; completedQuestionsCount?: number }
  ): Promise<Target> {
    const res = await fetch(`${API_BASE}/targets/${id}/toggle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options || {})
    });
    if (!res.ok) throw new Error('Failed to toggle target');
    const data = await res.json();
    return data.target;
  },

  async logTimer(targetId: string, seconds: number): Promise<{ target: Target; userStudySeconds: number }> {
    const res = await fetch(`${API_BASE}/targets/${targetId}/timer`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seconds })
    });
    if (!res.ok) throw new Error('Failed to log timer');
    return await res.json();
  },

  async deleteTarget(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/targets/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete target');
  },

  async getProgress(userId: string): Promise<Record<string, { status: ChapterStatus; updatedAt: string }>> {
    const res = await fetch(`${API_BASE}/progress/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch progress');
    const data = await res.json();
    return data.progress || {};
  },

  async updateProgress(userId: string, chapterId: string, status: ChapterStatus): Promise<Record<string, any>> {
    const res = await fetch(`${API_BASE}/progress/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterId, status })
    });
    if (!res.ok) throw new Error('Failed to update progress');
    const data = await res.json();
    return data.progress;
  },

  async getGroupOverview(date?: string): Promise<GroupOverview> {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    const res = await fetch(`${API_BASE}/group-overview?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch group overview');
    return await res.json();
  }
};
