import { NotificationScheduleConfig } from '@/utils/notifications';

export type HabitCategory = 'health' | 'fitness' | 'mindfulness' | 'productivity' | 'learning';
export type HabitType = 'boolean' | 'counter' | 'timer';

export interface Habit {
  id: string;
  title: string;
  description?: string;
  category: HabitCategory;
  type: HabitType;
  icon: string; // Ionicons icon name
  color: string;
  targetFrequency: string; // e.g., "Daily", "5x a week", "Weekdays"
  
  // Custom reminder time for this specific habit (e.g. "08:30", "18:00")
  reminderTime?: string;

  // For counter/volume habits (e.g., 8 glasses of water)
  targetValue?: number;
  currentValue?: number;
  unit?: string; // "glasses", "reps", "pages", "cups"

  // For timer habits (e.g., 25 mins deep work)
  targetDurationMinutes?: number;
  completedSeconds?: number;

  streak: number;
  bestStreak: number;
  completedToday: boolean;
  history: Record<string, boolean>; // 'YYYY-MM-DD': true
  createdAt: string;
}

export interface HabitLogEntry {
  id: string;
  habitId: string;
  habitTitle: string;
  habitColor: string;
  habitIcon: string;
  category: HabitCategory;
  timestamp: string; // ISO date string
  date: string; // YYYY-MM-DD
  type: HabitType;
  action: 'completed' | 'increment' | 'timer_finished' | 'reflection';
  valueLogged?: string; // "Glass 4 of 8", "25 min focus", "Checked off"
  note?: string; // Optional user reflection note
}

export interface Challenge {
  id: string;
  title: string;
  tagline: string;
  description: string;
  durationDays: number;
  completedDays: number;
  targetHabitCategory?: HabitCategory;
  rewardBadge: string; // e.g. "🏆 3-Day Kickstart Master"
  rewardColor: string;
  rewardIcon: string;
  status: 'available' | 'active' | 'completed';
  startDate?: string;
  claimedAt?: string;
  isCustom?: boolean;
}

export interface HabitStats {
  total: number;
  completedToday: number;
  completionRate: number; // 0 to 100
  totalStreak: number;
  bestStreak: number;
  perfectDaysCount: number;
  totalLogEntriesCount: number;
}

export interface CategoryInfo {
  id: HabitCategory;
  label: string;
  icon: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'health', label: 'Health', icon: 'water', color: '#3B82F6' },
  { id: 'fitness', label: 'Fitness', icon: 'fitness', color: '#EF4444' },
  { id: 'mindfulness', label: 'Mind', icon: 'leaf', color: '#8B5CF6' },
  { id: 'productivity', label: 'Focus', icon: 'flash', color: '#10B981' },
  { id: 'learning', label: 'Learning', icon: 'book', color: '#F59E0B' },
];

export const HABIT_COLORS = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EF4444', // Red
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
];

export const AVAILABLE_ICONS = [
  { name: 'water', label: 'Water' },
  { name: 'fitness', label: 'Exercise' },
  { name: 'leaf', label: 'Mind' },
  { name: 'book', label: 'Reading' },
  { name: 'flash', label: 'Focus' },
  { name: 'code-slash', label: 'Code' },
  { name: 'bed', label: 'Sleep' },
  { name: 'walk', label: 'Walking' },
  { name: 'heart', label: 'Wellness' },
  { name: 'musical-notes', label: 'Music' },
  { name: 'nutrition', label: 'Diet' },
  { name: 'sunny', label: 'Morning' },
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'challenge-kickstart-3d',
    title: '3-Day Kickstart Sprint',
    tagline: 'Build immediate momentum & prove consistency',
    description: 'Complete all of your daily habits for 3 consecutive days to ignite your streak.',
    durationDays: 3,
    completedDays: 1,
    rewardBadge: '⚡ 3-Day Kickstart Champion',
    rewardColor: '#F59E0B',
    rewardIcon: 'trophy',
    status: 'active',
    startDate: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'challenge-hydration-7d',
    title: '7-Day Hydration Sprint',
    tagline: '8 glasses of water every day for 1 week',
    description: 'Crush your daily hydration targets 7 days in a row for peak energy and focus.',
    durationDays: 7,
    completedDays: 0,
    targetHabitCategory: 'health',
    rewardBadge: '💧 Hydration Master',
    rewardColor: '#3B82F6',
    rewardIcon: 'water',
    status: 'available',
  },
  {
    id: 'challenge-mindfulness-14d',
    title: '14-Day Zen Mind Mastery',
    tagline: '2 weeks of uninterrupted daily meditation',
    description: 'Train focus, eliminate mental clutter, and unlock higher emotional resilience.',
    durationDays: 14,
    completedDays: 0,
    targetHabitCategory: 'mindfulness',
    rewardBadge: '🧘 Zen Master Badge',
    rewardColor: '#8B5CF6',
    rewardIcon: 'leaf',
    status: 'available',
  },
];
