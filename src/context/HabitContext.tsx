import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Challenge,
  Habit,
  HabitCategory,
  HabitLogEntry,
  HabitStats,
  INITIAL_CHALLENGES,
} from '@/types/habit';
import { playChimeSound, setSensorySettings, triggerHaptic } from '@/utils/sensory';
import {
  DEFAULT_NOTIFICATION_CONFIG,
  NotificationScheduleConfig,
  cancelHabitReminder,
  scheduleDailyReminders,
  scheduleHabitReminder,
} from '@/utils/notifications';
import { useAuth } from '@/context/AuthContext';
import { isSupabaseConfigured, supabase } from '@/utils/supabase';

const HABITS_STORAGE_KEY = '@habit_pulse_habits_v4';
const CHALLENGES_STORAGE_KEY = '@habit_pulse_challenges_v4';
const LOGS_STORAGE_KEY = '@habit_pulse_logs_v4';
const SETTINGS_STORAGE_KEY = '@habit_pulse_settings_v4';
const ONBOARDING_STORAGE_KEY = '@habit_pulse_onboarding_v4';

function getTodayString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

function getPastDateString(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

const SEED_HABITS: Habit[] = [
  {
    id: 'habit-1',
    title: 'Morning Meditation',
    description: 'Guided breathwork & mental stillness',
    category: 'mindfulness',
    type: 'timer',
    icon: 'leaf',
    color: '#8B5CF6',
    targetFrequency: 'Daily',
    reminderTime: '08:00',
    targetDurationMinutes: 10,
    completedSeconds: 600,
    streak: 14,
    bestStreak: 21,
    completedToday: true,
    history: {
      [getPastDateString(0)]: true,
      [getPastDateString(1)]: true,
      [getPastDateString(2)]: true,
      [getPastDateString(3)]: true,
      [getPastDateString(4)]: true,
      [getPastDateString(5)]: false,
      [getPastDateString(6)]: true,
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit-2',
    title: 'Hydration Target',
    description: 'Drink water throughout the workday',
    category: 'health',
    type: 'counter',
    icon: 'water',
    color: '#3B82F6',
    targetFrequency: 'Daily',
    reminderTime: '10:00',
    targetValue: 8,
    currentValue: 6,
    unit: 'glasses',
    streak: 9,
    bestStreak: 15,
    completedToday: false,
    history: {
      [getPastDateString(1)]: true,
      [getPastDateString(2)]: true,
      [getPastDateString(3)]: true,
      [getPastDateString(4)]: true,
      [getPastDateString(5)]: true,
      [getPastDateString(6)]: true,
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit-3',
    title: '30-Min Workout',
    description: 'Strength training or cardio run',
    category: 'fitness',
    type: 'boolean',
    icon: 'fitness',
    color: '#EF4444',
    targetFrequency: '5x a week',
    reminderTime: '17:30',
    streak: 5,
    bestStreak: 12,
    completedToday: true,
    history: {
      [getPastDateString(0)]: true,
      [getPastDateString(1)]: true,
      [getPastDateString(2)]: true,
      [getPastDateString(3)]: true,
      [getPastDateString(4)]: true,
      [getPastDateString(5)]: true,
      [getPastDateString(6)]: false,
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit-4',
    title: 'Read Non-Fiction',
    description: 'Read high-impact chapters',
    category: 'learning',
    type: 'counter',
    icon: 'book',
    color: '#F59E0B',
    targetFrequency: 'Daily',
    reminderTime: '21:00',
    targetValue: 20,
    currentValue: 20,
    unit: 'pages',
    streak: 21,
    bestStreak: 21,
    completedToday: true,
    history: {
      [getPastDateString(0)]: true,
      [getPastDateString(1)]: true,
      [getPastDateString(2)]: true,
      [getPastDateString(3)]: true,
      [getPastDateString(4)]: true,
      [getPastDateString(5)]: true,
      [getPastDateString(6)]: true,
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit-5',
    title: 'Deep Focus Block',
    description: 'Zero distractions, hard problem solving',
    category: 'productivity',
    type: 'timer',
    icon: 'flash',
    color: '#10B981',
    targetFrequency: 'Weekdays',
    reminderTime: '14:00',
    targetDurationMinutes: 25,
    completedSeconds: 0,
    streak: 7,
    bestStreak: 10,
    completedToday: false,
    history: {
      [getPastDateString(1)]: true,
      [getPastDateString(2)]: true,
      [getPastDateString(3)]: true,
      [getPastDateString(4)]: true,
      [getPastDateString(5)]: false,
      [getPastDateString(6)]: true,
    },
    createdAt: new Date().toISOString(),
  },
];

const SEED_LOGS: HabitLogEntry[] = [
  {
    id: 'log-1',
    habitId: 'habit-1',
    habitTitle: 'Morning Meditation',
    habitColor: '#8B5CF6',
    habitIcon: 'leaf',
    category: 'mindfulness',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    date: getTodayString(),
    type: 'timer',
    action: 'timer_finished',
    valueLogged: '10 min session',
    note: 'Felt very centered and energized for the day.',
  },
  {
    id: 'log-2',
    habitId: 'habit-3',
    habitTitle: '30-Min Workout',
    habitColor: '#EF4444',
    habitIcon: 'fitness',
    category: 'fitness',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    date: getTodayString(),
    type: 'boolean',
    action: 'completed',
    valueLogged: 'Completed',
    note: '5km outdoor run at steady pace.',
  },
  {
    id: 'log-3',
    habitId: 'habit-4',
    habitTitle: 'Read Non-Fiction',
    habitColor: '#F59E0B',
    habitIcon: 'book',
    category: 'learning',
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
    date: getTodayString(),
    type: 'counter',
    action: 'completed',
    valueLogged: '20 pages finished',
    note: 'Chapter 4 on compounding consistency was gold.',
  },
];

interface CelebrationState {
  visible: boolean;
  title: string;
  subtitle: string;
  badge?: string;
}

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'guest';

interface HabitContextType {
  habits: Habit[];
  challenges: Challenge[];
  logs: HabitLogEntry[];
  stats: HabitStats;
  selectedCategory: HabitCategory | 'all';
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  notificationConfig: NotificationScheduleConfig;
  celebrationState: CelebrationState;
  hasSeenOnboarding: boolean;
  syncStatus: SyncStatus;

  setSelectedCategory: (cat: HabitCategory | 'all') => void;
  toggleHabit: (id: string) => void;
  incrementHabit: (id: string, amount: number) => void;
  setTimerProgress: (id: string, seconds: number, markComplete?: boolean) => void;
  addHabit: (newHabit: Omit<Habit, 'id' | 'streak' | 'bestStreak' | 'completedToday' | 'history' | 'createdAt'>) => void;
  deleteHabit: (id: string) => void;

  startChallenge: (challengeId: string) => void;
  claimChallengeReward: (challengeId: string) => void;
  addCustomChallenge: (challenge: Omit<Challenge, 'id' | 'status' | 'completedDays' | 'isCustom'>) => void;

  devSetChallengeDay: (challengeId: string, day: number) => void;
  devTriggerChallengeCompletion: (challengeId: string) => void;
  devCompleteAllHabitsToday: () => void;
  devResetTodayHabits: () => void;

  addLogReflection: (logId: string, note: string) => void;
  createManualLog: (habitId: string, note?: string) => void;

  setSoundEnabled: (enabled: boolean) => void;
  setHapticsEnabled: (enabled: boolean) => void;
  updateNotificationConfig: (config: Partial<NotificationScheduleConfig>) => void;
  dismissCelebration: () => void;
  triggerCelebration: (title: string, subtitle: string, badge?: string) => void;
  resetDemoData: () => void;
  setHasSeenOnboarding: (seen: boolean) => void;
  syncNow: () => Promise<void>;

  generateConsistencyStory: () => { paragraph: string; score: string; highlight: string; weeklyRate: number };
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();

  const [habits, setHabits] = useState<Habit[]>(SEED_HABITS);
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [logs, setLogs] = useState<HabitLogEntry[]>(SEED_LOGS);
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | 'all'>('all');
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [hapticsEnabled, setHapticsEnabledState] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboardingState] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(isGuest ? 'guest' : 'synced');
  const [notificationConfig, setNotificationConfig] = useState<NotificationScheduleConfig>(DEFAULT_NOTIFICATION_CONFIG);
  const [celebrationState, setCelebrationState] = useState<CelebrationState>({
    visible: false,
    title: '',
    subtitle: '',
  });

  // Initial local cache load
  useEffect(() => {
    async function loadLocalData() {
      try {
        const [savedHabits, savedChallenges, savedLogs, savedSettings, savedOnboarding] = await Promise.all([
          AsyncStorage.getItem(HABITS_STORAGE_KEY),
          AsyncStorage.getItem(CHALLENGES_STORAGE_KEY),
          AsyncStorage.getItem(LOGS_STORAGE_KEY),
          AsyncStorage.getItem(SETTINGS_STORAGE_KEY),
          AsyncStorage.getItem(ONBOARDING_STORAGE_KEY),
        ]);

        const today = getTodayString();

        if (savedHabits) {
          const parsed: Habit[] = JSON.parse(savedHabits);
          const synced = parsed.map((h) => ({
            ...h,
            completedToday: !!h.history[today],
          }));
          setHabits(synced);
        }

        if (savedChallenges) setChallenges(JSON.parse(savedChallenges));
        if (savedLogs) setLogs(JSON.parse(savedLogs));
        if (savedOnboarding !== null) setHasSeenOnboardingState(JSON.parse(savedOnboarding));

        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          setSoundEnabledState(settings.soundEnabled ?? true);
          setHapticsEnabledState(settings.hapticsEnabled ?? true);
          if (settings.notificationConfig) setNotificationConfig(settings.notificationConfig);
          setSensorySettings(settings.soundEnabled ?? true, settings.hapticsEnabled ?? true);
        }
      } catch (e) {
        console.error('Failed to load storage data', e);
      }
    }
    loadLocalData();
  }, []);

  // Background Cloud Sync Trigger when user authenticates
  useEffect(() => {
    if (user && isSupabaseConfigured()) {
      syncWithCloud(user.id);
    } else {
      setSyncStatus('guest');
    }
  }, [user]);

  const syncWithCloud = async (userId: string) => {
    setSyncStatus('syncing');
    try {
      // 1. Fetch remote habits
      const { data: remoteHabits, error: habitErr } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId);

      if (!habitErr && remoteHabits && remoteHabits.length > 0) {
        const formatted: Habit[] = remoteHabits.map((h: any) => ({
          id: h.id,
          title: h.title,
          description: h.description || undefined,
          category: h.category as HabitCategory,
          type: h.type as any,
          color: h.color,
          icon: h.icon,
          targetFrequency: h.target_frequency,
          reminderTime: h.reminder_time || undefined,
          targetValue: h.target_value || undefined,
          currentValue: h.current_value || undefined,
          unit: h.unit || undefined,
          targetDurationMinutes: h.target_duration_minutes || undefined,
          completedSeconds: h.completed_seconds || undefined,
          streak: h.streak || 0,
          bestStreak: h.best_streak || 0,
          completedToday: !!h.completed_today,
          history: h.history || {},
          createdAt: h.created_at,
        }));
        setHabits(formatted);
        await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(formatted));
      } else if (!habitErr && remoteHabits && remoteHabits.length === 0) {
        // Push initial local habits to cloud
        await pushLocalHabitsToCloud(userId, habits);
      }

      // 2. Fetch remote challenges
      const { data: remoteChallenges } = await supabase
        .from('challenges')
        .select('*')
        .eq('user_id', userId);

      if (remoteChallenges && remoteChallenges.length > 0) {
        const formattedCh: Challenge[] = remoteChallenges.map((c: any) => ({
          id: c.id,
          title: c.title,
          tagline: c.tagline || '',
          description: c.description,
          durationDays: c.duration_days,
          completedDays: c.completed_days,
          targetHabitCategory: c.target_habit_category || undefined,
          rewardBadge: c.reward_badge,
          rewardColor: c.reward_color,
          rewardIcon: c.reward_icon,
          status: c.status,
          isCustom: c.is_custom,
          startDate: c.start_date || undefined,
          claimedAt: c.claimed_at || undefined,
        }));
        setChallenges(formattedCh);
        await AsyncStorage.setItem(CHALLENGES_STORAGE_KEY, JSON.stringify(formattedCh));
      }

      setSyncStatus('synced');
    } catch (e) {
      console.log('Background sync error', e);
      setSyncStatus('offline');
    }
  };

  const pushLocalHabitsToCloud = async (userId: string, habitsToPush: Habit[]) => {
    try {
      const rows = habitsToPush.map((h) => ({
        id: h.id,
        user_id: userId,
        title: h.title,
        description: h.description || null,
        category: h.category,
        type: h.type,
        color: h.color,
        icon: h.icon,
        target_frequency: h.targetFrequency,
        reminder_time: h.reminderTime || null,
        target_value: h.targetValue || null,
        current_value: h.currentValue || null,
        unit: h.unit || null,
        target_duration_minutes: h.targetDurationMinutes || null,
        completed_seconds: h.completedSeconds || null,
        streak: h.streak,
        best_streak: h.bestStreak,
        completed_today: h.completedToday,
        history: h.history,
        updated_at: new Date().toISOString(),
      }));

      await supabase.from('habits').upsert(rows, { onConflict: 'id' });
    } catch (e) {
      console.log('Push habits error', e);
    }
  };

  const saveHabits = async (newHabits: Habit[]) => {
    // 1. Instant local update (<1ms)
    setHabits(newHabits);
    try {
      await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(newHabits));
    } catch (e) {}

    // 2. Background cloud sync
    if (user && isSupabaseConfigured()) {
      pushLocalHabitsToCloud(user.id, newHabits).catch(() => {});
    }
  };

  const saveChallenges = async (newChallenges: Challenge[]) => {
    setChallenges(newChallenges);
    try {
      await AsyncStorage.setItem(CHALLENGES_STORAGE_KEY, JSON.stringify(newChallenges));
    } catch (e) {}

    if (user && isSupabaseConfigured()) {
      try {
        const rows = newChallenges.map((c) => ({
          id: c.id,
          user_id: user.id,
          title: c.title,
          tagline: c.tagline,
          description: c.description,
          duration_days: c.durationDays,
          completed_days: c.completedDays,
          target_habit_category: c.targetHabitCategory || null,
          reward_badge: c.rewardBadge,
          reward_color: c.rewardColor,
          reward_icon: c.rewardIcon,
          status: c.status,
          is_custom: !!c.isCustom,
          start_date: c.startDate || null,
          claimed_at: c.claimedAt || null,
          updated_at: new Date().toISOString(),
        }));
        supabase.from('challenges').upsert(rows, { onConflict: 'id' }).then(() => {});
      } catch (e) {}
    }
  };

  const saveLogs = async (newLogs: HabitLogEntry[]) => {
    setLogs(newLogs);
    try {
      await AsyncStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(newLogs));
    } catch (e) {}

    if (user && isSupabaseConfigured()) {
      try {
        const rows = newLogs.map((l) => ({
          id: l.id,
          user_id: user.id,
          habit_id: l.habitId,
          habit_title: l.habitTitle,
          habit_color: l.habitColor,
          habit_icon: l.habitIcon,
          category: l.category,
          type: l.type,
          action: l.action,
          value_logged: l.valueLogged || null,
          note: l.note || null,
          timestamp: l.timestamp,
          date: l.date,
        }));
        supabase.from('habit_logs').upsert(rows, { onConflict: 'id' }).then(() => {});
      } catch (e) {}
    }
  };

  const saveSettings = async (sound: boolean, haptics: boolean, notif: NotificationScheduleConfig) => {
    try {
      await AsyncStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify({ soundEnabled: sound, hapticsEnabled: haptics, notificationConfig: notif })
      );
    } catch (e) {}

    if (user && isSupabaseConfigured()) {
      supabase
        .from('user_settings')
        .upsert(
          {
            user_id: user.id,
            sound_enabled: sound,
            haptics_enabled: haptics,
            notification_config: notif,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        )
        .then(() => {});
    }
  };

  const setHasSeenOnboarding = async (seen: boolean) => {
    setHasSeenOnboardingState(seen);
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(seen));
    } catch (e) {}
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    setSensorySettings(enabled, hapticsEnabled);
    saveSettings(enabled, hapticsEnabled, notificationConfig);
  };

  const setHapticsEnabled = (enabled: boolean) => {
    setHapticsEnabledState(enabled);
    setSensorySettings(soundEnabled, enabled);
    saveSettings(soundEnabled, enabled, notificationConfig);
  };

  const updateNotificationConfig = (configUpdate: Partial<NotificationScheduleConfig>) => {
    const updated = { ...notificationConfig, ...configUpdate };
    setNotificationConfig(updated);
    scheduleDailyReminders(updated);
    saveSettings(soundEnabled, hapticsEnabled, updated);
  };

  const triggerCelebration = (title: string, subtitle: string, badge?: string) => {
    setCelebrationState({ visible: true, title, subtitle, badge });
    playChimeSound('complete');
    triggerHaptic('success');
  };

  const dismissCelebration = () => {
    setCelebrationState((prev) => ({ ...prev, visible: false }));
  };

  const logHabitAction = (
    habit: Habit,
    action: HabitLogEntry['action'],
    valueLogged?: string,
    note?: string
  ) => {
    const entry: HabitLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      habitId: habit.id,
      habitTitle: habit.title,
      habitColor: habit.color,
      habitIcon: habit.icon,
      category: habit.category,
      timestamp: new Date().toISOString(),
      date: getTodayString(),
      type: habit.type,
      action,
      valueLogged,
      note,
    };
    saveLogs([entry, ...logs]);
  };

  const toggleHabit = (id: string) => {
    const today = getTodayString();
    let justCompleted = false;
    let habitRef: Habit | undefined;

    const updated = habits.map((habit) => {
      if (habit.id !== id) return habit;
      habitRef = habit;
      const willBeCompleted = !habit.completedToday;
      justCompleted = willBeCompleted;

      const newHistory = { ...habit.history };
      if (willBeCompleted) {
        newHistory[today] = true;
      } else {
        delete newHistory[today];
      }

      const newStreak = willBeCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1);
      const newBestStreak = Math.max(habit.bestStreak, newStreak);

      return {
        ...habit,
        completedToday: willBeCompleted,
        history: newHistory,
        streak: newStreak,
        bestStreak: newBestStreak,
      };
    });

    saveHabits(updated);

    if (justCompleted && habitRef) {
      triggerHaptic('success');
      playChimeSound('complete');
      logHabitAction(habitRef, 'completed', 'Checked off for today');
      checkMilestonesAfterCompletion(updated);
    } else {
      triggerHaptic('light');
    }
  };

  const incrementHabit = (id: string, amount: number) => {
    const today = getTodayString();
    let justCompleted = false;
    let habitRef: Habit | undefined;

    const updated = habits.map((habit) => {
      if (habit.id !== id) return habit;
      habitRef = habit;

      const target = habit.targetValue || 1;
      const current = habit.currentValue || 0;
      const nextVal = Math.max(0, current + amount);
      const isNowDone = nextVal >= target;
      const wasDone = habit.completedToday;

      justCompleted = !wasDone && isNowDone;

      const newHistory = { ...habit.history };
      if (isNowDone) {
        newHistory[today] = true;
      } else {
        delete newHistory[today];
      }

      const newStreak =
        isNowDone && !wasDone
          ? habit.streak + 1
          : wasDone && !isNowDone
          ? Math.max(0, habit.streak - 1)
          : habit.streak;

      return {
        ...habit,
        currentValue: nextVal,
        completedToday: isNowDone,
        history: newHistory,
        streak: newStreak,
        bestStreak: Math.max(habit.bestStreak, newStreak),
      };
    });

    saveHabits(updated);

    if (habitRef) {
      if (justCompleted) {
        triggerHaptic('success');
        playChimeSound('complete');
        logHabitAction(
          habitRef,
          'completed',
          `${habitRef.targetValue} ${habitRef.unit || 'units'} completed!`
        );
        checkMilestonesAfterCompletion(updated);
      } else {
        triggerHaptic('light');
        playChimeSound('step');
        logHabitAction(
          habitRef,
          'increment',
          `${amount > 0 ? '+' : ''}${amount} ${habitRef.unit || 'unit'}`
        );
      }
    }
  };

  const setTimerProgress = (id: string, seconds: number, markComplete = false) => {
    const today = getTodayString();
    let habitRef: Habit | undefined;

    const updated = habits.map((habit) => {
      if (habit.id !== id) return habit;
      habitRef = habit;

      const targetSeconds = (habit.targetDurationMinutes || 1) * 60;
      const isDone = markComplete || seconds >= targetSeconds;

      const newHistory = { ...habit.history };
      if (isDone) newHistory[today] = true;

      const newStreak = isDone && !habit.completedToday ? habit.streak + 1 : habit.streak;

      return {
        ...habit,
        completedSeconds: seconds,
        completedToday: isDone,
        history: newHistory,
        streak: newStreak,
        bestStreak: Math.max(habit.bestStreak, newStreak),
      };
    });

    saveHabits(updated);

    if (habitRef && (markComplete || seconds >= (habitRef.targetDurationMinutes || 1) * 60)) {
      triggerHaptic('success');
      playChimeSound('complete');
      logHabitAction(
        habitRef,
        'timer_finished',
        `${habitRef.targetDurationMinutes || 0} min session finished`
      );
      checkMilestonesAfterCompletion(updated);
    }
  };

  const checkMilestonesAfterCompletion = (currentHabits: Habit[]) => {
    const completedCount = currentHabits.filter((h) => h.completedToday).length;
    const totalCount = currentHabits.length;

    if (totalCount > 0 && completedCount === totalCount) {
      triggerCelebration(
        '🌟 Perfect Day Fulfilled!',
        '100% of all daily habits completed today. Your discipline is unstoppable!',
        '⚡ Daily Mastery'
      );
      advanceActiveChallenges();
    }
  };

  const advanceActiveChallenges = () => {
    const updated = challenges.map((c) => {
      if (c.status !== 'active') return c;
      const nextDays = c.completedDays + 1;
      const isCompleted = nextDays >= c.durationDays;

      if (isCompleted) {
        triggerCelebration(
          `🏆 Challenge Conquered!`,
          `You have completed the "${c.title}" challenge! Your reward is unlocked.`,
          c.rewardBadge
        );
      }

      return {
        ...c,
        completedDays: nextDays,
        status: isCompleted ? ('completed' as const) : ('active' as const),
      };
    });
    saveChallenges(updated);
  };

  const startChallenge = (challengeId: string) => {
    triggerHaptic('medium');
    playChimeSound('step');
    const updated = challenges.map((c) => {
      if (c.id === challengeId) {
        return {
          ...c,
          status: 'active' as const,
          startDate: new Date().toISOString(),
          completedDays: 0,
        };
      }
      return c;
    });
    saveChallenges(updated);
  };

  const claimChallengeReward = (challengeId: string) => {
    triggerHaptic('success');
    playChimeSound('challenge');
    const updated = challenges.map((c) => {
      if (c.id === challengeId) {
        return {
          ...c,
          claimedAt: new Date().toISOString(),
        };
      }
      return c;
    });
    saveChallenges(updated);
    triggerCelebration('🎁 Reward Claimed!', 'Your challenge achievement badge is now permanently in your profile.');
  };

  const addCustomChallenge = (challengeData: Omit<Challenge, 'id' | 'status' | 'completedDays' | 'isCustom'>) => {
    const newChallenge: Challenge = {
      ...challengeData,
      id: `custom-challenge-${Date.now()}`,
      status: 'available',
      completedDays: 0,
      isCustom: true,
    };
    saveChallenges([newChallenge, ...challenges]);
    triggerHaptic('success');
    playChimeSound('step');
  };

  const devSetChallengeDay = (challengeId: string, day: number) => {
    const updated = challenges.map((c) => {
      if (c.id !== challengeId) return c;
      const clamped = Math.max(0, Math.min(day, c.durationDays));
      const isDone = clamped >= c.durationDays;
      return {
        ...c,
        completedDays: clamped,
        status: isDone ? ('completed' as const) : ('active' as const),
      };
    });
    saveChallenges(updated);
    triggerHaptic('light');
  };

  const devTriggerChallengeCompletion = (challengeId: string) => {
    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge) return;

    const updated = challenges.map((c) => {
      if (c.id === challengeId) {
        return {
          ...c,
          completedDays: c.durationDays,
          status: 'completed' as const,
        };
      }
      return c;
    });
    saveChallenges(updated);
    triggerCelebration(
      `🏆 Challenge Conquered!`,
      `You fulfilled the ${challenge.durationDays}-Day "${challenge.title}" challenge!`,
      challenge.rewardBadge
    );
  };

  const devCompleteAllHabitsToday = () => {
    const today = getTodayString();
    const updated = habits.map((h) => ({
      ...h,
      completedToday: true,
      currentValue: h.type === 'counter' ? h.targetValue || 1 : h.currentValue,
      completedSeconds: h.type === 'timer' ? (h.targetDurationMinutes || 1) * 60 : h.completedSeconds,
      history: { ...h.history, [today]: true },
      streak: h.completedToday ? h.streak : h.streak + 1,
    }));
    saveHabits(updated);
    triggerCelebration('⚡ All Habits Completed', 'Simulated 100% daily check-off across all routines.');
  };

  const devResetTodayHabits = () => {
    const today = getTodayString();
    const updated = habits.map((h) => {
      const newHist = { ...h.history };
      delete newHist[today];
      return {
        ...h,
        completedToday: false,
        currentValue: h.type === 'counter' ? 0 : h.currentValue,
        completedSeconds: h.type === 'timer' ? 0 : h.completedSeconds,
        history: newHist,
        streak: h.completedToday ? Math.max(0, h.streak - 1) : h.streak,
      };
    });
    saveHabits(updated);
    triggerHaptic('warning');
  };

  const addHabit = (
    newHabitData: Omit<Habit, 'id' | 'streak' | 'bestStreak' | 'completedToday' | 'history' | 'createdAt'>
  ) => {
    const newHabit: Habit = {
      ...newHabitData,
      id: `habit-${Date.now()}`,
      streak: 0,
      bestStreak: 0,
      completedToday: false,
      currentValue: newHabitData.type === 'counter' ? 0 : undefined,
      completedSeconds: newHabitData.type === 'timer' ? 0 : undefined,
      history: {},
      createdAt: new Date().toISOString(),
    };
    saveHabits([newHabit, ...habits]);
    if (newHabit.reminderTime) {
      scheduleHabitReminder(newHabit);
    }
    triggerHaptic('medium');
    playChimeSound('step');
  };

  const deleteHabit = (id: string) => {
    cancelHabitReminder(id);
    const updated = habits.filter((h) => h.id !== id);
    saveHabits(updated);
    if (user && isSupabaseConfigured()) {
      supabase.from('habits').delete().eq('id', id).then(() => {});
    }
    triggerHaptic('warning');
  };

  const addLogReflection = (logId: string, note: string) => {
    const updated = logs.map((l) => (l.id === logId ? { ...l, note } : l));
    saveLogs(updated);
    triggerHaptic('light');
  };

  const createManualLog = (habitId: string, note?: string) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;
    logHabitAction(habit, 'reflection', 'Quick Reflection', note);
    triggerHaptic('light');
  };

  const resetDemoData = () => {
    saveHabits(SEED_HABITS);
    saveChallenges(INITIAL_CHALLENGES);
    saveLogs(SEED_LOGS);
    triggerHaptic('medium');
    playChimeSound('step');
  };

  const syncNow = async () => {
    if (user && isSupabaseConfigured()) {
      await syncWithCloud(user.id);
    }
  };

  // Stats calculation
  const total = habits.length;
  const completedToday = habits.filter((h) => h.completedToday).length;
  const completionRate = total > 0 ? Math.round((completedToday / total) * 100) : 0;
  const totalStreak = habits.reduce((acc, h) => acc + h.streak, 0);
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.bestStreak), 0);

  let perfectDaysCount = 0;
  for (let i = 0; i < 7; i++) {
    const dateStr = getPastDateString(i);
    const count = habits.filter((h) => h.history[dateStr]).length;
    if (total > 0 && count === total) {
      perfectDaysCount++;
    }
  }

  const stats: HabitStats = {
    total,
    completedToday,
    completionRate,
    totalStreak,
    bestStreak,
    perfectDaysCount,
    totalLogEntriesCount: logs.length,
  };

  const generateConsistencyStory = () => {
    if (habits.length === 0) {
      return {
        paragraph: "You haven't created any habits yet. Start by setting up your primary daily routine to unlock personal consistency insights.",
        score: 'N/A',
        highlight: 'Begin Your Journey',
        weeklyRate: 0,
      };
    }

    let totalPossible = habits.length * 7;
    let totalDonePastWeek = 0;
    for (let i = 0; i < 7; i++) {
      const dateStr = getPastDateString(i);
      totalDonePastWeek += habits.filter((h) => h.history[dateStr]).length;
    }
    const weeklyRate = totalPossible > 0 ? Math.round((totalDonePastWeek / totalPossible) * 100) : 0;

    const topHabit = [...habits].sort((a, b) => b.streak - a.streak)[0];
    const categoryCounts: Record<string, number> = {};
    habits.forEach((h) => {
      if (h.completedToday) {
        categoryCounts[h.category] = (categoryCounts[h.category] || 0) + 1;
      }
    });
    const topCat = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Health';

    let score = 'Elite Momentum';
    if (weeklyRate < 35) score = 'Building Momentum';
    else if (weeklyRate < 70) score = 'Consistent';
    else if (weeklyRate < 95) score = 'High Performance';

    const story = `Over the past 7 days, your overall weekly consistency score is ${weeklyRate}% across all routines. Your standout habit is "${topHabit.title}" holding a ${topHabit.streak}-day streak. Today, your greatest momentum is in the ${topCat} category with ${completedToday} of ${total} routines checked off. Protect your evening streak check-in to lock in tomorrow's consistency.`;

    return {
      paragraph: story,
      score,
      highlight: `${topHabit.streak}d Streak in ${topHabit.title}`,
      weeklyRate,
    };
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        challenges,
        logs,
        stats,
        selectedCategory,
        soundEnabled,
        hapticsEnabled,
        notificationConfig,
        celebrationState,
        hasSeenOnboarding,
        syncStatus,
        setSelectedCategory,
        toggleHabit,
        incrementHabit,
        setTimerProgress,
        addHabit,
        deleteHabit,
        startChallenge,
        claimChallengeReward,
        addCustomChallenge,
        devSetChallengeDay,
        devTriggerChallengeCompletion,
        devCompleteAllHabitsToday,
        devResetTodayHabits,
        addLogReflection,
        createManualLog,
        setSoundEnabled,
        setHapticsEnabled,
        updateNotificationConfig,
        dismissCelebration,
        triggerCelebration,
        resetDemoData,
        setHasSeenOnboarding,
        syncNow,
        generateConsistencyStory,
      }}>
      {children}
    </HabitContext.Provider>
  );
};

export function useHabits() {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
}
