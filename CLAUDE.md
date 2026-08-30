# HabitPulse — Developer & Claude Guide

This repository contains **HabitPulse**, an offline-first mobile habit tracker application built with **React Native**, **Expo SDK 54**, **Expo Router**, and **TypeScript**, following the **5-Pillar App Design Framework**.

---

## 🏛️ 5-Pillar App Architecture

1. **Core Function (Multi-Type Habits)**:
   - **Boolean / Daily Check-off**: 1-tap completion (e.g. *30-Min Workout*).
   - **Counter / Volume**: Multi-increment steppers with live progress bar (e.g. *Hydration Target: 6/8 glasses*).
   - **Timer / Session**: Interactive play/pause interval timer (e.g. *Morning Meditation: 10m*, *Deep Work: 25m*).

2. **Core Loop (Sensory Rewards)**:
   - **Haptic Feedback**: Micro-vibrations for steppers, medium for modals, heavy success for completions (`expo-haptics`).
   - **Audio Chimes**: Synthesized harmonic chimes on completions and fanfare chords on challenge victory (`expo-av` & Web Audio).
   - **Confetti Celebration**: Animated particle burst overlay modal with unlockable trophy badges (`ConfettiCelebration.tsx`).

3. **Accessory Features (Accountability & Consistency)**:
   - **Accountability Timeline**: Full audit log of check-ins, steppers, and timer finishes (`src/app/journal.tsx`).
   - **Reflection Notes**: Tap any log entry to record feelings and workout notes.
   - **Consistency Narrative**: Algorithmic 7-day consistency story analyzing momentum and top streaks (`ConsistencyStoryCard.tsx`).

4. **Surface Area Check (5 Screen Budget)**:
   - `src/app/index.tsx`: Habits (Daily overview, category filters, multi-type cards, Add Habit modal).
   - `src/app/challenges.tsx`: Challenges (3-Day Kickstart Sprint, custom challenge creator, claimable rewards).
   - `src/app/journal.tsx`: Accountability Log & Consistency Narrative story.
   - `src/app/explore.tsx`: Analytics (7-day heatmap, consistency breakdown, milestone trophies).
   - `src/app/settings.tsx`: Settings (Retention reminders, sensory toggles, test notification, Dev Tools).

5. **Retention Hooks (Challenges & Push Reminders)**:
   - **3-Day Kickstart Challenge**: Immediate onboarding challenge to form neuroplastic habit loops.
   - **Per-Habit Push Reminders**: Custom reminder times per habit (e.g. `08:00`, `17:30`, `21:00`).
   - **Scheduled Check-ins (`expo-notifications`)**: Morning Intention (8:00 AM), Mid-day Momentum (2:00 PM), and Evening Streak Saver (8:30 PM).

---

## 🛠️ Developer Testing Suite (`DevTestModal.tsx`)

Accessible via the red **"Dev Tools"** button in the header of **Habits**, **Challenges**, or from **Settings**:
- **Challenge Day Stepper**: Step active challenges directly to Day 1, 2, or 3.
- **Victory Ceremony Trigger**: Instantly trigger the 3-Day Kickstart fanfare chime, haptics, confetti burst, and claimable reward badge.
- **100% Perfect Day Simulator**: Check off all habits today with one tap.
- **Reset Today's State**: Clears today's check-ins to test daily completion flow.
- **Immediate Push Test**: Fires a live test notification instantly.

---

## 📁 Directory Structure

```
├── app.json                       # Expo app configuration
├── package.json                   # Dependencies & npm scripts (SDK 54)
├── tsconfig.json                  # TypeScript path mappings (@/* -> src/*)
├── expo-env.d.ts                  # Expo environment type declarations
├── assets/                        # App icons, splash screens, and images
└── src/
    ├── app/                       # File-based navigation (Expo Router)
    │   ├── _layout.tsx            # Root layout with HabitProvider and 5-tab bar
    │   ├── index.tsx              # [Screen 1] Daily Habits & Add Habit modal
    │   ├── challenges.tsx         # [Screen 2] 3-Day Kickstart & Custom Challenges
    │   ├── journal.tsx            # [Screen 3] Accountability Log & Consistency Story
    │   ├── explore.tsx            # [Screen 4] Analytics, 7-Day Heatmap & Badges
    │   └── settings.tsx           # [Screen 5] Reminders, Audio/Haptics & Dev Tools
    ├── components/                # Reusable UI components
    │   ├── AddHabitModal.tsx      # Modal for Multi-Type Habits & Custom Reminder Times
    │   ├── CategoryFilter.tsx     # Horizontal category selector pills
    │   ├── ChallengeCard.tsx      # Challenge card with progress & claim actions
    │   ├── ConfettiCelebration.tsx# Particle celebration overlay modal
    │   ├── ConsistencyStoryCard.tsx# 7-day consistency narrative summary card
    │   ├── CreateChallengeModal.tsx# Custom challenge builder modal
    │   ├── DailySummaryCard.tsx   # Progress bar, greeting & streak counter
    │   ├── DevTestModal.tsx       # Developer testing panel
    │   ├── HabitCard.tsx          # Multi-type habit card (check, stepper, timer)
    │   ├── OnboardingModal.tsx    # 4-step guided onboarding walkthrough
    │   ├── WeeklyHeatmap.tsx      # 7-day consistency bar chart
    │   ├── themed-text.tsx        # Typography components
    │   └── themed-view.tsx        # Background container components
    ├── constants/                 # Theme tokens (Colors, Spacing, Fonts)
    │   └── theme.ts
    ├── context/                   # State management & persistence
    │   └── HabitContext.tsx       # Habit store backed by AsyncStorage
    ├── hooks/                     # Custom React hooks (useColorScheme, useTheme)
    ├── types/                     # TypeScript interfaces & domain models
    │   └── habit.ts               # Habit, Challenge, LogEntry, and Stats types
    └── utils/                     # Services & Helpers
        ├── notifications.ts       # Expo Notifications scheduler & permission helpers
        └── sensory.ts             # Haptics & Audio Chime tone generators
```

---

## ⚙️ Tech Stack & Conventions

- **Expo SDK**: `~54.0.37` (Compatible with Android Expo Go `54.0.8`)
- **React Native**: `0.81.5`
- **React**: `19.1.0`
- **Routing**: Expo Router (file-based navigation under `src/app`)
- **Icons**: `@expo/vector-icons` (Ionicons)
- **Sensory**: `expo-haptics`, `expo-av`
- **Retention**: `expo-notifications`
- **Persistence**: `@react-native-async-storage/async-storage`
- **Styles**: React Native `StyleSheet` with high-contrast tokens

---

## 🚀 Key Commands

| Command | Description |
| :--- | :--- |
| `npm start` / `npx expo start` | Start the Metro development bundler |
| `npx expo start -c` | Start Metro bundler with cleared cache |
| `npx tsc --noEmit` | Run TypeScript type checking |
| `npx expo-doctor` | Validate project dependency health and compatibility |
