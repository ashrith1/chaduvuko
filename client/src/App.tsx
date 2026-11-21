import React, { useState, useEffect, useCallback } from 'react';
import { api } from './services/api';
import type { SubjectType, SyllabusData, Target, User, GroupOverview, ChapterStatus, Chapter } from './types';
import { Header } from './components/Header';
import { DailyTargets } from './components/DailyTargets';
import { GroupHub } from './components/GroupHub';
import { SyllabusView } from './components/SyllabusView';
import { StudyTimer } from './components/StudyTimer';
import { TargetModal } from './components/TargetModal';
import { UserModal } from './components/UserModal';
import { SyllabusEditorModal } from './components/SyllabusEditorModal';
import { ManageUsersModal } from './components/ManageUsersModal';
import { AboutModal } from './components/AboutModal';
import { CalendarView } from './components/CalendarView';
import { AdminMonitorView } from './components/AdminMonitorView';
import { LoginModal } from './components/LoginModal';
import { ShareReportModal } from './components/ShareReportModal';
import { Shield } from 'lucide-react';

export const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<'daily' | 'group' | 'syllabus' | 'timer' | 'calendar' | 'admin'>(() => {
    const hash = window.location.hash.replace('#', '');
    if (['daily', 'group', 'syllabus', 'timer', 'calendar', 'admin'].includes(hash)) {
      return hash as any;
    }
    return 'daily';
  });

  const handleTabChange = (tab: 'daily' | 'group' | 'syllabus' | 'timer' | 'calendar' | 'admin') => {
    setCurrentTab(tab);
    window.location.hash = tab;
  };

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['daily', 'group', 'syllabus', 'timer', 'calendar', 'admin'].includes(hash)) {
        setCurrentTab(hash as any);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);
  const [selectedDate, setSelectedDate] = useState<string>(
    () => new Date().toISOString().split('T')[0]
  );

  // App Settings (Website Name & Badge)
  const [appSettings, setAppSettings] = useState<{ appTitle: string; appBadge: string }>({
    appTitle: '12th Prep',
    appBadge: 'BIEAP State Board'
  });

  // Core Data
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [syllabus, setSyllabus] = useState<SyllabusData>({ Maths: [], Physics: [], Chemistry: [] });
  const [targets, setTargets] = useState<Target[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, { status: ChapterStatus; updatedAt: string }>>({});
  const [groupOverview, setGroupOverview] = useState<GroupOverview | null>(null);

  // Active target for Study Timer
  const [activeTimerTargetId, setActiveTimerTargetId] = useState<string | null>(null);

  // Modals
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [targetModalSubject, setTargetModalSubject] = useState<SubjectType>('Maths');
  const [targetModalChapter, setTargetModalChapter] = useState<Chapter | null>(null);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isManageUsersModalOpen, setIsManageUsersModalOpen] = useState(false);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginTargetUser, setLoginTargetUser] = useState<User | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [adminOverview, setAdminOverview] = useState<any>(null);

  // Fetch all initial data
  const loadData = useCallback(async () => {
    try {
      const [fetchedSyllabus, fetchedUsers, fetchedTargets, fetchedOverview, fetchedSettings, fetchedAdminOverview] = await Promise.all([
        api.getSyllabus(),
        api.getUsers(),
        api.getTargets(), // Load all targets so past pending targets are accessible
        api.getGroupOverview(selectedDate),
        api.getSettings().catch(() => ({ appTitle: '12th Prep', appBadge: 'BIEAP State Board' })),
        api.getAdminOverview().catch(() => null)
      ]);

      setSyllabus(fetchedSyllabus);
      setUsers(fetchedUsers);
      setTargets(fetchedTargets);
      setGroupOverview(fetchedOverview);
      if (fetchedAdminOverview) {
        setAdminOverview(fetchedAdminOverview);
      }
      if (fetchedSettings?.appTitle) {
        setAppSettings(fetchedSettings);
        document.title = `${fetchedSettings.appTitle} | ${fetchedSettings.appBadge}`;
      }

      // Determine active user
      const storedUserId = api.getCurrentUserId();
      const matched = fetchedUsers.find((u) => u.id === storedUserId) || fetchedUsers[0] || null;
      setCurrentUser(matched);

      if (matched) {
        const prog = await api.getProgress(matched.id);
        setUserProgress(prog);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Periodic poll for peer activity every 10 seconds
  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const [fetchedTargets, fetchedOverview, fetchedAdminOverview] = await Promise.all([
          api.getTargets(),
          api.getGroupOverview(selectedDate),
          api.getAdminOverview().catch(() => null)
        ]);
        setTargets(fetchedTargets);
        setGroupOverview(fetchedOverview);
        if (fetchedAdminOverview) setAdminOverview(fetchedAdminOverview);
      } catch (e) {
        // silent
      }
    }, 10000);
    return () => clearInterval(timer);
  }, [selectedDate]);

  // Active user change & authentication
  const handleSelectUser = async (user: User) => {
    setCurrentUser(user);
    api.setCurrentUserId(user.id);
    try {
      const prog = await api.getProgress(user.id);
      setUserProgress(prog);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenLoginModal = (targetUser?: User | null) => {
    setLoginTargetUser(targetUser || null);
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = async (user: User) => {
    await handleSelectUser(user);
  };

  const handleUpdatePin = async (userId: string, pin: string) => {
    await api.updatePin(userId, pin);
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, pin } : u)));
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, pin } : null));
    }
  };

  const handleAssignTargetToUser = (user: User) => {
    setCurrentUser(user);
    api.setCurrentUserId(user.id);
    setTargetModalSubject('Maths');
    setTargetModalChapter(null);
    setIsTargetModalOpen(true);
  };

  // Target handlers
  const handleToggleTarget = async (
    id: string,
    options?: { completedQuestionsType?: 'all' | 'custom'; completedQuestionsCount?: number }
  ) => {
    try {
      setTargets((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                completed: !t.completed,
                completedQuestionsType: options?.completedQuestionsType || (t.completed ? null : 'all'),
                completedQuestionsCount: options?.completedQuestionsCount ?? null
              }
            : t
        )
      );
      await api.toggleTarget(id, options);
      const [updatedTargets, updatedOverview] = await Promise.all([
        api.getTargets(selectedDate),
        api.getGroupOverview(selectedDate)
      ]);
      setTargets(updatedTargets);
      setGroupOverview(updatedOverview);
      if (currentUser) {
        const prog = await api.getProgress(currentUser.id);
        setUserProgress(prog);
      }
    } catch (e) {
      console.error('Error toggling target:', e);
      loadData();
    }
  };

  const handleDeleteTarget = async (id: string) => {
    try {
      setTargets((prev) => prev.filter((t) => t.id !== id));
      await api.deleteTarget(id);
      const updatedOverview = await api.getGroupOverview(selectedDate);
      setGroupOverview(updatedOverview);
    } catch (e) {
      console.error('Error deleting target:', e);
      loadData();
    }
  };

  const handleRescheduleTarget = async (id: string, newDate: string) => {
    try {
      setTargets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, date: newDate } : t))
      );
      await api.rescheduleTarget(id, newDate);
      const updatedOverview = await api.getGroupOverview(selectedDate);
      setGroupOverview(updatedOverview);
    } catch (e) {
      console.error('Error rescheduling target:', e);
      loadData();
    }
  };

  const handleSaveTarget = async (newTargetData: Omit<Target, 'id' | 'completed' | 'completedAt'>) => {
    try {
      const created = await api.createTarget(newTargetData);
      setTargets((prev) => [...prev, created]);
      const updatedOverview = await api.getGroupOverview(selectedDate);
      setGroupOverview(updatedOverview);
    } catch (e) {
      console.error('Error saving target:', e);
      throw e;
    }
  };

  const handleBroadcastTarget = async (targetData: Omit<Target, 'id' | 'userId' | 'completed' | 'completedAt'>) => {
    try {
      const res = await api.broadcastTarget(targetData);
      const [updatedTargets, updatedOverview] = await Promise.all([
        api.getTargets(selectedDate),
        api.getGroupOverview(selectedDate)
      ]);
      setTargets(updatedTargets);
      setGroupOverview(updatedOverview);
      alert(`🎉 Target created for all ${res.count} members!`);
    } catch (e) {
      console.error('Error broadcasting target:', e);
      throw e;
    }
  };

  // Timer log handler
  const handleLogTimer = async (targetId: string, seconds: number) => {
    try {
      await api.logTimer(targetId, seconds);
      const [updatedTargets, updatedOverview] = await Promise.all([
        api.getTargets(selectedDate),
        api.getGroupOverview(selectedDate)
      ]);
      setTargets(updatedTargets);
      setGroupOverview(updatedOverview);
    } catch (e) {
      console.error('Error logging timer:', e);
    }
  };

  // Chapter progress status handler
  const handleUpdateChapterStatus = async (chapterId: string, status: ChapterStatus) => {
    if (!currentUser) return;
    try {
      setUserProgress((prev) => ({
        ...prev,
        [chapterId]: { status, updatedAt: new Date().toISOString() }
      }));
      await api.updateProgress(currentUser.id, chapterId, status);
      const updatedOverview = await api.getGroupOverview(selectedDate);
      setGroupOverview(updatedOverview);
    } catch (e) {
      console.error('Error updating chapter status:', e);
    }
  };

  // Syllabus update handler
  const handleSaveSyllabus = async (updatedSyllabus: SyllabusData) => {
    try {
      const saved = await api.updateSyllabus(updatedSyllabus);
      setSyllabus(saved);
      const updatedOverview = await api.getGroupOverview(selectedDate);
      setGroupOverview(updatedOverview);
    } catch (e) {
      console.error('Error updating syllabus:', e);
      throw e;
    }
  };

  const handleResetSyllabus = async () => {
    try {
      const reset = await api.resetSyllabus();
      setSyllabus(reset);
      const updatedOverview = await api.getGroupOverview(selectedDate);
      setGroupOverview(updatedOverview);
    } catch (e) {
      console.error('Error resetting syllabus:', e);
    }
  };

  // User management handlers
  const handleAddUser = async (data: { name: string; avatar: string; targetScore: string }) => {
    try {
      const created = await api.createUser(data);
      setUsers((prev) => [...prev, created]);
      setCurrentUser(created);
      api.setCurrentUserId(created.id);
      const updatedOverview = await api.getGroupOverview(selectedDate);
      setGroupOverview(updatedOverview);
    } catch (e) {
      console.error('Error adding user:', e);
      throw e;
    }
  };

  const handleUpdateUser = async (id: string, payload: Partial<User>) => {
    try {
      const updated = await api.updateUser(id, payload);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      if (currentUser?.id === id) {
        setCurrentUser(updated);
      }
      const updatedOverview = await api.getGroupOverview(selectedDate);
      setGroupOverview(updatedOverview);
    } catch (e) {
      console.error('Error updating user:', e);
      throw e;
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await api.deleteUser(id);
      const remaining = users.filter((u) => u.id !== id);
      setUsers(remaining);
      if (currentUser?.id === id) {
        const nextUser = remaining[0] || null;
        setCurrentUser(nextUser);
        if (nextUser) api.setCurrentUserId(nextUser.id);
      }
      const [updatedTargets, updatedOverview] = await Promise.all([
        api.getTargets(selectedDate),
        api.getGroupOverview(selectedDate)
      ]);
      setTargets(updatedTargets);
      setGroupOverview(updatedOverview);
    } catch (e) {
      console.error('Error deleting user:', e);
      throw e;
    }
  };

  const handleUpdateStatus = async (statusText: string) => {
    if (!currentUser) return;
    try {
      const updated = await api.updateUser(currentUser.id, { status: statusText });
      setCurrentUser(updated);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      const updatedOverview = await api.getGroupOverview(selectedDate);
      setGroupOverview(updatedOverview);
    } catch (e) {
      console.error('Error updating status:', e);
    }
  };

  // Website Settings handler
  const handleSaveSettings = async (settings: { appTitle: string; appBadge: string }) => {
    try {
      const updated = await api.updateSettings(settings);
      setAppSettings(updated);
      document.title = `${updated.appTitle} | ${updated.appBadge}`;
    } catch (e) {
      console.error('Error saving settings:', e);
      throw e;
    }
  };

  // Quick action from Syllabus to open Target modal
  const handleQuickAddTarget = (subject: SubjectType, chapter: Chapter) => {
    setTargetModalSubject(subject);
    setTargetModalChapter(chapter);
    setIsTargetModalOpen(true);
  };

  const handleStartTimerForTarget = (targetId: string) => {
    setActiveTimerTargetId(targetId);
    handleTabChange('timer');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-zinc-400 gap-3">
        <div className="w-7 h-7 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-medium tracking-tight text-zinc-300">Loading {appSettings.appTitle}...</p>
      </div>
    );
  }

  // Filter user's targets for today for the timer selector
  const currentUserTodayTargets = targets.filter(
    (t) => t.userId === currentUser?.id && t.date === selectedDate
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col selection:bg-zinc-700 selection:text-white">
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        users={users}
        currentTab={currentTab}
        appTitle={appSettings.appTitle}
        appBadge={appSettings.appBadge}
        onTabChange={handleTabChange}
        onSelectUser={handleSelectUser}
        onOpenNewUserModal={() => setIsUserModalOpen(true)}
        onOpenManageUsersModal={() => setIsManageUsersModalOpen(true)}
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
        onOpenLoginModal={handleOpenLoginModal}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3.5 sm:px-4 py-4 sm:py-5 pb-28 md:pb-8">
        {currentTab === 'daily' && (
          <DailyTargets
            currentUser={currentUser}
            users={users}
            selectedDate={selectedDate}
            targets={targets}
            onToggleTarget={handleToggleTarget}
            onDeleteTarget={handleDeleteTarget}
            onOpenAddModal={(sub) => {
              setTargetModalSubject(sub);
              setTargetModalChapter(null);
              setIsTargetModalOpen(true);
            }}
            onNavigateToSyllabus={() => handleTabChange('syllabus')}
            onStartTimerForTarget={handleStartTimerForTarget}
            onSelectUser={handleSelectUser}
            onRescheduleTarget={handleRescheduleTarget}
          />
        )}

        {currentTab === 'timer' && (
          <div className="py-2 animate-fade-in">
            <StudyTimer
              targets={currentUserTodayTargets}
              activeTargetId={activeTimerTargetId}
              onSelectTarget={setActiveTimerTargetId}
              onLogTime={handleLogTimer}
            />
          </div>
        )}

        {currentTab === 'calendar' && (
          <div className="py-2 animate-fade-in">
            <CalendarView
              currentUser={currentUser}
              targets={targets}
              selectedDate={selectedDate}
              onSelectDate={(d) => {
                setSelectedDate(d);
              }}
              onNavigateToDaily={() => handleTabChange('daily')}
            />
          </div>
        )}

        {currentTab === 'admin' && (
          <div className="py-2 animate-fade-in">
            <AdminMonitorView
              currentUser={currentUser}
              users={users}
              auditMembers={adminOverview?.members || []}
              onOpenAddUserModal={() => setIsUserModalOpen(true)}
              onOpenBroadcastModal={() => {
                setTargetModalSubject('Maths');
                setTargetModalChapter(null);
                setIsTargetModalOpen(true);
              }}
              onOpenSyllabusEditor={() => setIsEditorModalOpen(true)}
              onDeleteUser={handleDeleteUser}
              onUpdatePin={handleUpdatePin}
              onAssignTargetToUser={handleAssignTargetToUser}
            />
          </div>
        )}

        {currentTab === 'group' && (
          <GroupHub
            currentUser={currentUser}
            overview={groupOverview}
            onOpenNewUserModal={() => setIsUserModalOpen(true)}
            onUpdateStatus={handleUpdateStatus}
            onSelectUser={handleSelectUser}
          />
        )}

        {currentTab === 'syllabus' && (
          <SyllabusView
            syllabus={syllabus}
            userProgress={userProgress}
            onUpdateStatus={handleUpdateChapterStatus}
            onOpenEditorModal={() => setIsEditorModalOpen(true)}
            onQuickAddTarget={handleQuickAddTarget}
          />
        )}
      </main>

      {/* Target Modal */}
      <TargetModal
        isOpen={isTargetModalOpen}
        onClose={() => setIsTargetModalOpen(false)}
        defaultSubject={targetModalSubject}
        defaultChapter={targetModalChapter}
        syllabus={syllabus}
        userId={currentUser?.id || 'u-1'}
        selectedDate={selectedDate}
        onSaveTarget={handleSaveTarget}
        onBroadcastTarget={handleBroadcastTarget}
      />

      {/* Add User Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onAddUser={handleAddUser}
      />

      {/* Manage Users & Website Name Modal */}
      <ManageUsersModal
        isOpen={isManageUsersModalOpen}
        onClose={() => setIsManageUsersModalOpen(false)}
        users={users}
        currentUser={currentUser}
        appTitle={appSettings.appTitle}
        appBadge={appSettings.appBadge}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
        onOpenAddUserModal={() => setIsUserModalOpen(true)}
        onSaveSettings={handleSaveSettings}
      />

      {/* Syllabus & Weightage Editor / Upload Modal */}
      <SyllabusEditorModal
        isOpen={isEditorModalOpen}
        onClose={() => setIsEditorModalOpen(false)}
        syllabus={syllabus}
        onSaveSyllabus={handleSaveSyllabus}
        onResetDefault={handleResetSyllabus}
      />

      {/* About Chaduvuko & Blueprint Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        appTitle={appSettings.appTitle}
        appBadge={appSettings.appBadge}
      />

      {/* Login & PIN Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        users={users}
        onLoginSuccess={handleLoginSuccess}
        targetUser={loginTargetUser}
      />

      {/* Share Report Modal */}
      <ShareReportModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        currentUser={currentUser}
        selectedDate={selectedDate}
        targets={targets}
      />
    </div>
  );
};

export default App;
