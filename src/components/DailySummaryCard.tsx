import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '@/context/HabitContext';

export const DailySummaryCard: React.FC = () => {
  const { stats } = useHabits();
  const { total, completedToday, completionRate } = stats;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 18) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  };

  const getMotivation = () => {
    if (completionRate === 100 && total > 0) return '🎉 All habits completed today! Legendary!';
    if (completionRate >= 60) return '🔥 You are crushing your goals today!';
    if (completionRate > 0) return '💪 Great start! Keep the momentum going!';
    return '⚡ Tap habits to mark them complete for today!';
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.greetingText}>{getGreeting()}</Text>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>
        <View style={styles.streakBadge}>
          <Ionicons name="flame" size={18} color="#F59E0B" />
          <Text style={styles.streakText}>{stats.bestStreak}d best</Text>
        </View>
      </View>

      {/* Progress Bar & Ratio */}
      <View style={styles.progressSection}>
        <View style={styles.progressLabelRow}>
          <Text style={styles.progressTitle}>Today's Progress</Text>
          <Text style={styles.progressValue}>
            {completedToday}/{total} ({completionRate}%)
          </Text>
        </View>

        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${Math.max(completionRate, 3)}%` }]} />
        </View>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.motivationText}>{getMotivation()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#1E1B4B',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: '#4338CA',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  dateText: {
    fontSize: 13,
    color: '#C7D2FE',
    marginTop: 2,
    fontWeight: '500',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  streakText: {
    color: '#FBBF24',
    fontSize: 12,
    fontWeight: '700',
  },
  progressSection: {
    marginVertical: 4,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    color: '#E0E7FF',
    fontSize: 14,
    fontWeight: '600',
  },
  progressValue: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: '700',
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 5,
  },
  footerRow: {
    marginTop: 12,
  },
  motivationText: {
    color: '#A5B4FC',
    fontSize: 12,
    fontWeight: '500',
  },
});
