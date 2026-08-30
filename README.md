# HabitPulse ✨

An offline-first, high-tier mobile habit tracker built with **React Native**, **Expo SDK 54**, **Expo Router**, and **TypeScript**, designed around the **5-Pillar App Design Framework**.

---

## 🏛️ The 5-Pillar Framework

### 1. 🎯 Core Function (Multi-Type Habit Tracking)
- **Boolean / Daily Check-off**: 1-tap completion for daily routines (e.g. *30-Min Workout*).
- **Volume / Count Steppers**: Incremental steppers with real-time progress bars (e.g. *Hydration: 6/8 glasses*, *Read Non-Fiction: 20 pages*).
- **Session / Interval Timers**: Interactive play, pause, and auto-finish timers (e.g. *Morning Meditation: 10 mins*, *Deep Focus Block: 25 mins*).

### 2. ⚡ Core Loop (Multi-Sensory Rewards)
- **Haptic Micro-Feedback (`expo-haptics`)**: Light tactile clicks for steppers, medium for navigation, and heavy victory vibrations on goal completions.
- **Synthesized Audio Chimes (`expo-av` & Web Audio)**: Harmonic 3-chord chime on habit completion and 4-note victory fanfare for challenge fulfillment.
- **Particle Confetti Celebration (`ConfettiCelebration.tsx`)**: Dynamic reward modal overlay with unlockable trophy badges.

### 3. 📝 Accessory Features (Accountability Log & Consistency Narrative)
- **Audit Timeline ([`journal.tsx`](src/app/journal.tsx))**: Chronological activity timeline of every check-in, stepper increment, and timer finish.
- **Reflection Notes**: Tap any log entry to attach thoughts, workout notes, and personal victories.
- **Automated Consistency Story ([`ConsistencyStoryCard.tsx`](src/components/ConsistencyStoryCard.tsx))**: An algorithmically generated 7-day consistency narrative evaluating your streak momentum and category focus.

### 4. 📱 Surface Area Check (5-Screen Architecture)
1. **Habits ([`src/app/index.tsx`](src/app/index.tsx))**: Daily overview, category filters, multi-type cards, and "+ Add Habit" modal.
2. **Challenges ([`src/app/challenges.tsx`](src/app/challenges.tsx))**: 3-Day Kickstart sprint, custom challenge creator, and claimable reward badges.
3. **Log ([`src/app/journal.tsx`](src/app/journal.tsx))**: Consistency Narrative story and interactive accountability timeline.
4. **Insights ([`src/app/explore.tsx`](src/app/explore.tsx))**: 7-day weekly heatmap, habit performance bars, and milestone badges.
5. **Settings ([`src/app/settings.tsx`](src/app/settings.tsx))**: Retention notification schedules, sensory toggles, test notification triggers, and dev controls.

### 5. 🪝 Retention Hooks (Challenges & Push Reminders)
- **3-Day Kickstart Challenge**: Immediate onboarding challenge to rapidly wire neuroplastic habit loops.
- **Per-Habit Push Reminders**: Custom reminder times per habit (e.g. `08:00`, `17:30`, `21:00`).
- **Multi-Time Daily Check-ins (`expo-notifications`)**:
  - **Morning Intention (8:00 AM)**: *"What intention did you set today?"*
  - **Mid-day Momentum (2:00 PM)**: *"Halfway through the day! Check in on your hydration & workout."*
  - **Evening Streak Saver (8:30 PM)**: *"Don't break your streak! Wrap up your habits before bed."*

---

## 🛠️ Developer Testing Suite (`DevTestModal.tsx`)

Accessible via the red **"Dev Tools"** button in the header of **Habits**, **Challenges**, or from **Settings**:
- **Instant Challenge Stepper**: Step active challenges directly to Day 1, Day 2, or Day 3.
- **Victory Ceremony Trigger**: Instantly trigger the 3-Day Kickstart fanfare chime, haptics, confetti burst, and claimable reward badge without waiting 3 real days.
- **100% Perfect Day Simulator**: Check off all habits today with one tap.
- **Reset Today's State**: Clears today's check-ins to test fresh daily completions.
- **Immediate Push Test**: Fires a live test notification instantly.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Start Expo Development Server
```bash
npx expo start -c
```

### 3. Open on Mobile (Expo Go)
- **Android**: Open **Expo Go** (v54.0.8) and scan the terminal QR code.
- **iOS**: Open the native **Camera** app and scan the QR code to launch in **Expo Go**.

---

## 🧪 Verification & Type Safety

```bash
# Type check
npx tsc --noEmit

# Project health check
npx expo-doctor
```

---

## 📁 Directory Map

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

## 📄 License
MIT
