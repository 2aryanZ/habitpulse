import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useHabits } from '@/context/HabitContext';

export const WeeklyHeatmap: React.FC = () => {
  const { habits } = useHabits();

  // Generate last 7 days
  const days = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    const isToday = i === 0;

    const completedCount = habits.filter((h) => h.history[dateStr]).length;
    const totalCount = habits.length;
    const ratio = totalCount > 0 ? completedCount / totalCount : 0;

    days.push({
      dateStr,
      dayName,
      dayNum,
      isToday,
      completedCount,
      totalCount,
      ratio,
    });
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Weekly Consistency</Text>
        <Text style={styles.subtitle}>Past 7 Days</Text>
      </View>

      <View style={styles.daysRow}>
        {days.map((d, index) => {
          const heightPercent = Math.max(d.ratio * 100, 12);
          const barColor =
            d.ratio >= 0.8
              ? '#10B981'
              : d.ratio >= 0.5
              ? '#3B82F6'
              : d.ratio > 0
              ? '#F59E0B'
              : '#E5E7EB';

          return (
            <View key={index} style={styles.dayCol}>
              {/* Bar container */}
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { height: `${heightPercent}%`, backgroundColor: barColor },
                  ]}
                />
              </View>

              {/* Day info */}
              <Text style={[styles.dayName, d.isToday && styles.todayName]}>
                {d.dayName}
              </Text>
              <View style={[styles.dateCircle, d.isToday && styles.todayCircle]}>
                <Text style={[styles.dateNum, d.isToday && styles.todayDateNum]}>
                  {d.dayNum}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
          <Text style={styles.legendText}>80%+ High</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
          <Text style={styles.legendText}>50%+ Moderate</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
          <Text style={styles.legendText}>Some</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 16,
    marginVertical: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingBottom: 6,
  },
  dayCol: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    width: 14,
    height: 75,
    backgroundColor: '#F3F4F6',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 8,
  },
  barFill: {
    width: '100%',
    borderRadius: 7,
  },
  dayName: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  todayName: {
    color: '#4F46E5',
    fontWeight: '700',
  },
  dateCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayCircle: {
    backgroundColor: '#4F46E5',
  },
  dateNum: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '600',
  },
  todayDateNum: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
});
