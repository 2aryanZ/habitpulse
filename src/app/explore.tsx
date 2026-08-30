import React from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '@/context/HabitContext';
import { WeeklyHeatmap } from '@/components/WeeklyHeatmap';
import { BottomTabInset } from '@/constants/theme';

function getPastDateString(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

export default function AnalyticsScreen() {
  const { habits, stats } = useHabits();

  const achievements = [
    {
      id: 'a1',
      title: '7-Day Streak Club',
      desc: 'Maintained a 7+ day streak',
      icon: 'flame',
      color: '#F59E0B',
      unlocked: habits.some((h) => h.streak >= 7),
    },
    {
      id: 'a2',
      title: 'Perfect Day',
      desc: 'Completed 100% of habits',
      icon: 'trophy',
      color: '#10B981',
      unlocked: stats.completionRate === 100 && stats.total > 0,
    },
    {
      id: 'a3',
      title: 'Multi-Tasker',
      desc: 'Active habits in 3+ categories',
      icon: 'albums',
      color: '#8B5CF6',
      unlocked: new Set(habits.map((h) => h.category)).size >= 3,
    },
    {
      id: 'a4',
      title: 'Early Bird',
      desc: 'Checked off 2 habits today',
      icon: 'sunny',
      color: '#3B82F6',
      unlocked: stats.completedToday >= 2,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Top Navbar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.screenTitle}>Insights & Streaks 📊</Text>
          <Text style={styles.screenSubtitle}>Track your 7-day consistency & milestones</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: BottomTabInset + 60 },
        ]}>
        {/* KPI Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statBox, { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' }]}>
            <View style={styles.statIconBadge}>
              <Ionicons name="checkmark-done-circle" size={22} color="#4338CA" />
            </View>
            <Text style={styles.statNumber}>{stats.completionRate}%</Text>
            <Text style={styles.statLabel}>Today's Rate</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}>
            <View style={styles.statIconBadge}>
              <Ionicons name="flame" size={22} color="#B45309" />
            </View>
            <Text style={styles.statNumber}>{stats.bestStreak}d</Text>
            <Text style={styles.statLabel}>Longest Streak</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
            <View style={styles.statIconBadge}>
              <Ionicons name="calendar" size={22} color="#047857" />
            </View>
            <Text style={styles.statNumber}>{stats.perfectDaysCount}</Text>
            <Text style={styles.statLabel}>Perfect Days</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: '#FDF2F8', borderColor: '#FBCFE8' }]}>
            <View style={styles.statIconBadge}>
              <Ionicons name="sparkles" size={22} color="#BE185D" />
            </View>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Active Habits</Text>
          </View>
        </View>

        {/* 7-Day Consistency Chart */}
        <WeeklyHeatmap />

        {/* Habit Breakdown */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>7-Day Habit Consistency</Text>
          {habits.map((habit) => {
            // Count exactly past 7 days (0 to 6)
            let completedDaysCount = 0;
            for (let i = 0; i < 7; i++) {
              if (habit.history[getPastDateString(i)]) {
                completedDaysCount++;
              }
            }
            const weekRate = Math.round((completedDaysCount / 7) * 100);

            return (
              <View key={habit.id} style={styles.habitRowCard}>
                <View style={[styles.habitIconBox, { backgroundColor: `${habit.color}20` }]}>
                  <Ionicons name={habit.icon as any} size={20} color={habit.color} />
                </View>

                <View style={styles.habitRowDetails}>
                  <View style={styles.habitRowTop}>
                    <Text style={styles.habitRowTitle}>{habit.title}</Text>
                    <Text style={styles.habitRowRate}>
                      {completedDaysCount}/7 days ({weekRate}%)
                    </Text>
                  </View>

                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${Math.max(weekRate, 4)}%`, backgroundColor: habit.color },
                      ]}
                    />
                  </View>

                  <View style={styles.streakFooter}>
                    <Text style={styles.streakFooterText}>
                      🔥 Streak: {habit.streak}d · Best: {habit.bestStreak}d
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Achievements / Milestones */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Milestones & Badges</Text>
          <View style={styles.badgesGrid}>
            {achievements.map((ach) => (
              <View
                key={ach.id}
                style={[
                  styles.badgeCard,
                  !ach.unlocked && styles.lockedBadgeCard,
                ]}>
                <View
                  style={[
                    styles.badgeIconBox,
                    { backgroundColor: ach.unlocked ? `${ach.color}20` : '#F1F5F9' },
                  ]}>
                  <Ionicons
                    name={ach.icon as any}
                    size={24}
                    color={ach.unlocked ? ach.color : '#64748B'}
                  />
                </View>
                <Text
                  style={[
                    styles.badgeTitle,
                    !ach.unlocked && styles.lockedBadgeText,
                  ]}>
                  {ach.title}
                </Text>
                <Text style={styles.badgeDesc}>{ach.desc}</Text>
                <View
                  style={[
                    styles.statusPill,
                    ach.unlocked ? styles.unlockedPill : styles.lockedPill,
                  ]}>
                  <Text
                    style={[
                      styles.statusPillText,
                      ach.unlocked ? styles.unlockedPillText : styles.lockedPillText,
                    ]}>
                    {ach.unlocked ? 'Unlocked 🏆' : 'In Progress'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  topBar: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#F8FAFC',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  screenSubtitle: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
    marginTop: 2,
  },
  scrollContent: {
    paddingTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginVertical: 8,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 18,
    alignItems: 'flex-start',
    borderWidth: 1,
  },
  statIconBadge: {
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '700',
    marginTop: 2,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginTop: 18,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  habitRowCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  habitIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  habitRowDetails: {
    flex: 1,
  },
  habitRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  habitRowTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  habitRowRate: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  barTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  streakFooter: {
    flexDirection: 'row',
  },
  streakFooterText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  lockedBadgeCard: {
    opacity: 0.75,
    backgroundColor: '#F8FAFC',
  },
  badgeIconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  lockedBadgeText: {
    color: '#475569',
  },
  badgeDesc: {
    fontSize: 11,
    color: '#475569',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 8,
    fontWeight: '500',
  },
  statusPill: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  unlockedPill: {
    backgroundColor: '#ECFDF5',
  },
  lockedPill: {
    backgroundColor: '#F1F5F9',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  unlockedPillText: {
    color: '#047857',
  },
  lockedPillText: {
    color: '#64748B',
  },
});
