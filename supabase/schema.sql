-- ==============================================================================
-- HabitPulse Supabase Database Schema
-- Run this script in your Supabase Project -> SQL Editor -> Run
-- ==============================================================================

-- 1. Create HABITS table
CREATE TABLE IF NOT EXISTS public.habits (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'boolean',
    color TEXT NOT NULL,
    icon TEXT NOT NULL,
    target_frequency TEXT NOT NULL DEFAULT 'Daily',
    reminder_time TEXT,
    target_value INTEGER,
    current_value INTEGER,
    unit TEXT,
    target_duration_minutes INTEGER,
    completed_seconds INTEGER,
    streak INTEGER NOT NULL DEFAULT 0,
    best_streak INTEGER NOT NULL DEFAULT 0,
    completed_today BOOLEAN NOT NULL DEFAULT FALSE,
    history JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create CHALLENGES table
CREATE TABLE IF NOT EXISTS public.challenges (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    challenge_key TEXT,
    title TEXT NOT NULL,
    tagline TEXT,
    description TEXT NOT NULL,
    duration_days INTEGER NOT NULL DEFAULT 3,
    completed_days INTEGER NOT NULL DEFAULT 0,
    target_habit_category TEXT,
    reward_badge TEXT NOT NULL,
    reward_color TEXT NOT NULL,
    reward_icon TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'available', -- 'available' | 'active' | 'completed'
    is_custom BOOLEAN NOT NULL DEFAULT FALSE,
    start_date TIMESTAMPTZ,
    claimed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create HABIT_LOGS table (Accountability audit trail)
CREATE TABLE IF NOT EXISTS public.habit_logs (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    habit_id TEXT NOT NULL,
    habit_title TEXT NOT NULL,
    habit_color TEXT NOT NULL,
    habit_icon TEXT NOT NULL,
    category TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'boolean',
    action TEXT NOT NULL, -- 'completed' | 'increment' | 'timer_finished' | 'reflection'
    value_logged TEXT,
    note TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    date TEXT NOT NULL -- YYYY-MM-DD
);

-- 4. Create USER_SETTINGS table
CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    sound_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    haptics_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    notification_config JSONB NOT NULL DEFAULT '{"morningEnabled":true,"morningTime":"08:00","afternoonEnabled":true,"afternoonTime":"14:00","eveningEnabled":true,"eveningTime":"20:30"}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 5. Enable Row Level Security (RLS) on all tables
-- ==============================================================================
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies: Ensure users can ONLY access their own rows
-- Habits Policies
DROP POLICY IF EXISTS "Users can view their own habits" ON public.habits;
CREATE POLICY "Users can view their own habits" ON public.habits FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own habits" ON public.habits;
CREATE POLICY "Users can insert their own habits" ON public.habits FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own habits" ON public.habits;
CREATE POLICY "Users can update their own habits" ON public.habits FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own habits" ON public.habits;
CREATE POLICY "Users can delete their own habits" ON public.habits FOR DELETE USING (auth.uid() = user_id);

-- Challenges Policies
DROP POLICY IF EXISTS "Users can view their own challenges" ON public.challenges;
CREATE POLICY "Users can view their own challenges" ON public.challenges FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own challenges" ON public.challenges;
CREATE POLICY "Users can insert their own challenges" ON public.challenges FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own challenges" ON public.challenges;
CREATE POLICY "Users can update their own challenges" ON public.challenges FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own challenges" ON public.challenges;
CREATE POLICY "Users can delete their own challenges" ON public.challenges FOR DELETE USING (auth.uid() = user_id);

-- Habit Logs Policies
DROP POLICY IF EXISTS "Users can view their own logs" ON public.habit_logs;
CREATE POLICY "Users can view their own logs" ON public.habit_logs FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own logs" ON public.habit_logs;
CREATE POLICY "Users can insert their own logs" ON public.habit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own logs" ON public.habit_logs;
CREATE POLICY "Users can update their own logs" ON public.habit_logs FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own logs" ON public.habit_logs;
CREATE POLICY "Users can delete their own logs" ON public.habit_logs FOR DELETE USING (auth.uid() = user_id);

-- User Settings Policies
DROP POLICY IF EXISTS "Users can view their own settings" ON public.user_settings;
CREATE POLICY "Users can view their own settings" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can upsert their own settings" ON public.user_settings;
CREATE POLICY "Users can upsert their own settings" ON public.user_settings FOR ALL USING (auth.uid() = user_id);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON public.habits(user_id);
CREATE INDEX IF NOT EXISTS idx_challenges_user_id ON public.challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_user_id ON public.habit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_date ON public.habit_logs(date);
