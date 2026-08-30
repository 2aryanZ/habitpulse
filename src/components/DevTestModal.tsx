import React from 'react';
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '@/context/HabitContext';
import { sendInstantTestNotification } from '@/utils/notifications';

interface DevTestModalProps {
  visible: boolean;
  onClose: () => void;
}

export const DevTestModal: React.FC<DevTestModalProps> = ({ visible, onClose }) => {
  const {
    challenges,
    devSetChallengeDay,
    devTriggerChallengeCompletion,
    devCompleteAllHabitsToday,
    devResetTodayHabits,
    resetDemoData,
  } = useHabits();

  const handleTestNotification = async () => {
    await sendInstantTestNotification(
      '🛠️ Dev Test Check-in',
      'This is an instant simulated push notification reminder.'
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.titleRow}>
              <View style={styles.badge}>
                <Ionicons name="construct" size={16} color="#DC2626" />
                <Text style={styles.badgeText}>DEV MODE</Text>
              </View>
              <Text style={styles.title}>Developer Test Suite</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.introNote}>
              Use these developer controls to verify challenge milestone fulfillment, test sensory rewards, and simulate daily mastery instantly.
            </Text>

            {/* Quick Master Actions */}
            <Text style={styles.sectionHeader}>⚡ Instant State Simulators</Text>
            <View style={styles.actionGrid}>
              <TouchableOpacity
                style={[styles.actionCard, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}
                activeOpacity={0.7}
                onPress={devCompleteAllHabitsToday}>
                <Ionicons name="checkmark-done-circle" size={24} color="#059669" />
                <Text style={[styles.actionCardTitle, { color: '#065F46' }]}>100% Perfect Day</Text>
                <Text style={styles.actionCardDesc}>Check off all habits for today</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionCard, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}
                activeOpacity={0.7}
                onPress={devResetTodayHabits}>
                <Ionicons name="refresh-circle" size={24} color="#DC2626" />
                <Text style={[styles.actionCardTitle, { color: '#991B1B' }]}>Reset Today's State</Text>
                <Text style={styles.actionCardDesc}>Clear completions for today</Text>
              </TouchableOpacity>
            </View>

            {/* Challenge Milestone Steppers */}
            <Text style={styles.sectionHeader}>🏆 Challenge Day Steppers & Victory Triggers</Text>
            {challenges.map((c) => {
              const is3Day = c.id === 'challenge-kickstart-3d';
              return (
                <View key={c.id} style={styles.challengeBox}>
                  <View style={styles.challengeInfoRow}>
                    <View>
                      <Text style={styles.challengeTitle}>{c.title}</Text>
                      <Text style={styles.challengeMeta}>
                        Status: <Text style={{ fontWeight: '700' }}>{c.status.toUpperCase()}</Text> · Day {c.completedDays}/{c.durationDays}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.stepperRow}>
                    <Text style={styles.stepperLabel}>Set Day:</Text>
                    <View style={styles.dayButtonsRow}>
                      {Array.from({ length: c.durationDays + 1 }, (_, i) => (
                        <TouchableOpacity
                          key={i}
                          style={[
                            styles.dayBtn,
                            c.completedDays === i && styles.dayBtnActive,
                          ]}
                          onPress={() => devSetChallengeDay(c.id, i)}>
                          <Text
                            style={[
                              styles.dayBtnText,
                              c.completedDays === i && styles.dayBtnTextActive,
                            ]}>
                            {i}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.triggerVictoryBtn,
                      is3Day && { backgroundColor: '#F59E0B' },
                    ]}
                    activeOpacity={0.8}
                    onPress={() => {
                      devTriggerChallengeCompletion(c.id);
                    }}>
                    <Ionicons name="sparkles" size={16} color="#FFFFFF" />
                    <Text style={styles.triggerVictoryText}>
                      Trigger {is3Day ? '3-Day Kickstart' : 'Full'} Victory Ceremony 🎉
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}

            {/* Push Notification Test */}
            <Text style={styles.sectionHeader}>🔔 Retention & Notification Tests</Text>
            <TouchableOpacity
              style={styles.notifBtn}
              activeOpacity={0.8}
              onPress={handleTestNotification}>
              <Ionicons name="paper-plane" size={18} color="#FFFFFF" />
              <Text style={styles.notifBtnText}>Fire Immediate Test Notification</Text>
            </TouchableOpacity>

            {/* Reset All */}
            <TouchableOpacity
              style={styles.resetAllBtn}
              activeOpacity={0.8}
              onPress={resetDemoData}>
              <Ionicons name="trash-bin-outline" size={16} color="#64748B" />
              <Text style={styles.resetAllText}>Reset Full Demo Dataset to Initial State</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DC2626',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  introNote: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 14,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 14,
    marginBottom: 8,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  actionCard: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  actionCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
  },
  actionCardDesc: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  challengeBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  challengeInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  challengeMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  stepperLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  dayButtonsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  dayBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayBtnActive: {
    backgroundColor: '#4F46E5',
  },
  dayBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  dayBtnTextActive: {
    color: '#FFFFFF',
  },
  triggerVictoryBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#4F46E5',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  triggerVictoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  notifBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0284C7',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  notifBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  resetAllBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    marginTop: 14,
  },
  resetAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
});
