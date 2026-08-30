import React, { useState, useEffect } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Habit } from '@/types/habit';
import { useHabits } from '@/context/HabitContext';

interface HabitCardProps {
  habit: Habit;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit }) => {
  const { toggleHabit, incrementHabit, setTimerProgress, deleteHabit } = useHabits();

  // Timer local state
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(habit.completedSeconds || 0);

  useEffect(() => {
    let interval: any;
    if (timerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1;
          const targetSeconds = (habit.targetDurationMinutes || 1) * 60;
          if (next >= targetSeconds) {
            setTimerRunning(false);
            setTimerProgress(habit.id, next, true);
          } else if (next % 10 === 0) {
            setTimerProgress(habit.id, next, false);
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, habit.targetDurationMinutes]);

  const handleDelete = () => {
    Alert.alert('Delete Habit', `Are you sure you want to delete "${habit.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteHabit(habit.id) },
    ]);
  };

  const formatTimerDisplay = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Render tracker action based on habit type
  const renderActionControls = () => {
    if (habit.type === 'counter') {
      const current = habit.currentValue || 0;
      const target = habit.targetValue || 1;
      const percent = Math.min(100, Math.round((current / target) * 100));

      return (
        <View style={styles.counterControlContainer}>
          <View style={styles.stepperRow}>
            <TouchableOpacity
              onPress={() => incrementHabit(habit.id, -1)}
              style={styles.stepBtn}
              activeOpacity={0.6}
              disabled={current <= 0}>
              <Ionicons name="remove" size={16} color={current <= 0 ? '#94A3B8' : '#0F172A'} />
            </TouchableOpacity>

            <View style={styles.counterValueBox}>
              <Text style={styles.counterText}>
                {current}
                <Text style={styles.counterTargetText}>/{target}</Text>
              </Text>
              <Text style={styles.counterUnitText}>{habit.unit || 'units'}</Text>
            </View>

            <TouchableOpacity
              onPress={() => incrementHabit(habit.id, 1)}
              style={[styles.stepBtn, { backgroundColor: `${habit.color}25` }]}
              activeOpacity={0.6}>
              <Ionicons name="add" size={18} color={habit.color} />
            </TouchableOpacity>
          </View>

          {/* Progress gauge */}
          <View style={styles.counterBarTrack}>
            <View
              style={[
                styles.counterBarFill,
                { width: `${percent}%`, backgroundColor: habit.color },
              ]}
            />
          </View>
        </View>
      );
    }

    if (habit.type === 'timer') {
      const targetSec = (habit.targetDurationMinutes || 1) * 60;
      const isDone = habit.completedToday || elapsedSeconds >= targetSec;

      return (
        <View style={styles.timerControlContainer}>
          <View style={styles.timerRow}>
            <Text style={[styles.timerTimeText, isDone && styles.timerDoneText]}>
              {formatTimerDisplay(elapsedSeconds)} / {habit.targetDurationMinutes}m
            </Text>

            <TouchableOpacity
              onPress={() => {
                if (isDone) return;
                setTimerRunning(!timerRunning);
              }}
              style={[
                styles.timerActionBtn,
                isDone
                  ? [styles.timerDoneBtn, { backgroundColor: habit.color }]
                  : timerRunning
                  ? styles.timerPauseBtn
                  : [styles.timerPlayBtn, { backgroundColor: `${habit.color}20` }],
              ]}
              activeOpacity={0.7}>
              <Ionicons
                name={isDone ? 'checkmark' : timerRunning ? 'pause' : 'play'}
                size={18}
                color={isDone ? '#FFFFFF' : timerRunning ? '#DC2626' : habit.color}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // Default boolean check-in
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => toggleHabit(habit.id)}
        style={[
          styles.checkButton,
          habit.completedToday
            ? [styles.checkedButton, { backgroundColor: habit.color }]
            : styles.uncheckedButton,
        ]}>
        {habit.completedToday ? (
          <View style={styles.checkIconWrapper}>
            <Ionicons name="checkmark-sharp" size={22} color="#FFFFFF" />
          </View>
        ) : (
          <Text style={styles.tapToCompleteText}>Tap to complete</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.card, habit.completedToday && styles.completedCard]}>
      {/* Category Indicator Accent */}
      <View style={[styles.accentLine, { backgroundColor: habit.color }]} />

      <View style={styles.mainRow}>
        {/* Habit Icon */}
        <View style={[styles.iconContainer, { backgroundColor: `${habit.color}20` }]}>
          <Ionicons name={habit.icon as any} size={22} color={habit.color} />
        </View>

        {/* Info */}
        <View style={styles.infoCol}>
          <View style={styles.titleRow}>
            <Text
              style={[styles.title, habit.completedToday && styles.completedTitle]}
              numberOfLines={1}>
              {habit.title}
            </Text>
          </View>

          {habit.description ? (
            <Text style={styles.description} numberOfLines={1}>
              {habit.description}
            </Text>
          ) : null}

          {/* Meta Tags Row */}
          <View style={styles.metaRow}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>
                {habit.type === 'counter'
                  ? 'Count'
                  : habit.type === 'timer'
                  ? 'Timer'
                  : 'Daily'}
              </Text>
            </View>

            <View style={styles.frequencyTag}>
              <Text style={styles.frequencyText}>{habit.targetFrequency}</Text>
            </View>

            {habit.reminderTime && (
              <View style={styles.reminderTag}>
                <Ionicons name="time-outline" size={11} color="#6366F1" />
                <Text style={styles.reminderText}>{habit.reminderTime}</Text>
              </View>
            )}

            <View style={styles.streakTag}>
              <Ionicons name="flame" size={13} color="#D97706" />
              <Text style={styles.streakText}>
                {habit.streak}d · Best {habit.bestStreak}d
              </Text>
            </View>
          </View>
        </View>

        {/* Delete button */}
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={handleDelete}
          style={styles.deleteButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="trash-outline" size={16} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Control Area (Check / Counter / Timer) */}
      <View style={styles.controlRow}>{renderActionControls()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
    overflow: 'hidden',
  },
  completedCard: {
    backgroundColor: '#FAF5FF',
    borderColor: '#D8B4FE',
  },
  accentLine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  completedTitle: {
    color: '#334155',
  },
  description: {
    fontSize: 12,
    color: '#334155',
    marginTop: 2,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  typeBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3730A3',
    textTransform: 'uppercase',
  },
  frequencyTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  frequencyText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
  },
  reminderTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  reminderText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4338CA',
  },
  streakTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  streakText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
  },
  deleteButton: {
    padding: 6,
    marginLeft: 4,
  },
  controlRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    alignItems: 'center',
  },
  checkButton: {
    width: '100%',
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uncheckedButton: {
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    backgroundColor: '#F8FAFC',
  },
  tapToCompleteText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  checkedButton: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  checkIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterControlContainer: {
    width: '100%',
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterValueBox: {
    alignItems: 'center',
  },
  counterText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  counterTargetText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  counterUnitText: {
    fontSize: 10,
    color: '#334155',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  counterBarTrack: {
    height: 5,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    marginTop: 6,
    overflow: 'hidden',
  },
  counterBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  timerControlContainer: {
    width: '100%',
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timerTimeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  timerDoneText: {
    color: '#047857',
  },
  timerActionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerPlayBtn: {},
  timerPauseBtn: {
    backgroundColor: '#FEE2E2',
  },
  timerDoneBtn: {},
});
