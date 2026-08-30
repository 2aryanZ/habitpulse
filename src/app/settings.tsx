import React, { useState } from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '@/context/HabitContext';
import {
  requestNotificationPermissions,
  sendInstantTestNotification,
} from '@/utils/notifications';
import { DevTestModal } from '@/components/DevTestModal';
import { OnboardingModal } from '@/components/OnboardingModal';

export default function SettingsScreen() {
  const {
    soundEnabled,
    hapticsEnabled,
    notificationConfig,
    setSoundEnabled,
    setHapticsEnabled,
    updateNotificationConfig,
    resetDemoData,
  } = useHabits();

  const [devModalVisible, setDevModalVisible] = useState(false);
  const [onboardingVisible, setOnboardingVisible] = useState(false);
  const [testSent, setTestSent] = useState(false);

  const MORNING_TIMES = ['07:00', '07:30', '08:00', '08:30', '09:00'];
  const AFTERNOON_TIMES = ['12:00', '13:00', '14:00', '15:00', '16:00'];
  const EVENING_TIMES = ['19:00', '20:00', '20:30', '21:00', '21:30'];

  const handleToggleNotification = async (
    key: 'morningEnabled' | 'afternoonEnabled' | 'eveningEnabled',
    value: boolean
  ) => {
    if (value) {
      const granted = await requestNotificationPermissions();
      if (!granted && Platform.OS !== 'web') {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in your device settings to receive daily habit check-ins.'
        );
        return;
      }
    }
    updateNotificationConfig({ [key]: value });
  };

  const handleSendTestNotification = async () => {
    await sendInstantTestNotification(
      '🔥 HabitPulse Check-in',
      "Keep your daily momentum alive! 2 habits remain on today's goal list."
    );
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const handleResetConfirm = () => {
    Alert.alert(
      'Reset Demo State',
      'This will reset your habits, challenges, and log entries to the fresh demo dataset.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetDemoData },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.appTitle}>Settings & Controls ⚙️</Text>
          <Text style={styles.appSubtitle}>Configure reminders, sensory feedback & dev tools</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Developer Testing Tools Highlight */}
        <View style={[styles.sectionCard, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
          <View style={styles.devBannerRow}>
            <View style={styles.devIconCircle}>
              <Ionicons name="construct" size={20} color="#DC2626" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sectionHeader, { color: '#991B1B', marginBottom: 2 }]}>
                Developer Testing Suite
              </Text>
              <Text style={styles.devDesc}>
                Set challenge days (e.g. 3-day kickstart), trigger instant victory ceremonies, and simulate 100% daily mastery.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.openDevBtn}
            activeOpacity={0.8}
            onPress={() => setDevModalVisible(true)}>
            <Ionicons name="flash" size={16} color="#FFFFFF" />
            <Text style={styles.openDevBtnText}>Open Developer Test Panel</Text>
          </TouchableOpacity>
        </View>

        {/* Sensory Feedback Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Sensory Reward Loop</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <View style={[styles.settingIcon, { backgroundColor: '#EDE9FE' }]}>
                <Ionicons name="volume-high" size={20} color="#6D28D9" />
              </View>
              <View>
                <Text style={styles.settingTitle}>Audio Chimes</Text>
                <Text style={styles.settingDesc}>Harmonic tones on habit completions and fanfares</Text>
              </View>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: '#CBD5E1', true: '#8B5CF6' }}
            />
          </View>

          <View style={[styles.settingRow, styles.rowBorder]}>
            <View style={styles.settingInfo}>
              <View style={[styles.settingIcon, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="phone-portrait" size={20} color="#B45309" />
              </View>
              <View>
                <Text style={styles.settingTitle}>Haptic Feedback</Text>
                <Text style={styles.settingDesc}>Micro-vibrations for steppers and check-offs</Text>
              </View>
            </View>
            <Switch
              value={hapticsEnabled}
              onValueChange={setHapticsEnabled}
              trackColor={{ false: '#CBD5E1', true: '#F59E0B' }}
            />
          </View>
        </View>

        {/* Retention Hooks & Daily Reminders */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Retention & Push Schedules</Text>
          <Text style={styles.sectionNote}>
            Customize exactly when you want HabitPulse to check in with you during the day.
          </Text>

          {/* Morning */}
          <View style={styles.reminderBlock}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={[styles.settingIcon, { backgroundColor: '#FEF9C3' }]}>
                  <Ionicons name="sunny" size={20} color="#A16207" />
                </View>
                <View>
                  <Text style={styles.settingTitle}>Morning Intention</Text>
                  <Text style={styles.settingDesc}>"What intention did you set today?"</Text>
                </View>
              </View>
              <Switch
                value={notificationConfig.morningEnabled}
                onValueChange={(val) => handleToggleNotification('morningEnabled', val)}
                trackColor={{ false: '#CBD5E1', true: '#EAB308' }}
              />
            </View>
            {notificationConfig.morningEnabled && (
              <View style={styles.timeSelectorRow}>
                {MORNING_TIMES.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.timeSlotPill,
                      notificationConfig.morningTime === t && styles.timeSlotPillActive,
                    ]}
                    onPress={() => updateNotificationConfig({ morningTime: t })}>
                    <Text
                      style={[
                        styles.timeSlotText,
                        notificationConfig.morningTime === t && styles.timeSlotTextActive,
                      ]}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Midday */}
          <View style={[styles.reminderBlock, styles.rowBorder]}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={[styles.settingIcon, { backgroundColor: '#E0F2FE' }]}>
                  <Ionicons name="flash" size={20} color="#0369A1" />
                </View>
                <View>
                  <Text style={styles.settingTitle}>Mid-Day Momentum</Text>
                  <Text style={styles.settingDesc}>"Halfway through! Check hydration & workout."</Text>
                </View>
              </View>
              <Switch
                value={notificationConfig.afternoonEnabled}
                onValueChange={(val) => handleToggleNotification('afternoonEnabled', val)}
                trackColor={{ false: '#CBD5E1', true: '#0284C7' }}
              />
            </View>
            {notificationConfig.afternoonEnabled && (
              <View style={styles.timeSelectorRow}>
                {AFTERNOON_TIMES.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.timeSlotPill,
                      notificationConfig.afternoonTime === t && styles.timeSlotPillActive,
                    ]}
                    onPress={() => updateNotificationConfig({ afternoonTime: t })}>
                    <Text
                      style={[
                        styles.timeSlotText,
                        notificationConfig.afternoonTime === t && styles.timeSlotTextActive,
                      ]}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Evening */}
          <View style={[styles.reminderBlock, styles.rowBorder]}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={[styles.settingIcon, { backgroundColor: '#EDE9FE' }]}>
                  <Ionicons name="moon" size={20} color="#4338CA" />
                </View>
                <View>
                  <Text style={styles.settingTitle}>Evening Streak Saver</Text>
                  <Text style={styles.settingDesc}>"Don't break your streak! Wrap up habits."</Text>
                </View>
              </View>
              <Switch
                value={notificationConfig.eveningEnabled}
                onValueChange={(val) => handleToggleNotification('eveningEnabled', val)}
                trackColor={{ false: '#CBD5E1', true: '#6366F1' }}
              />
            </View>
            {notificationConfig.eveningEnabled && (
              <View style={styles.timeSelectorRow}>
                {EVENING_TIMES.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.timeSlotPill,
                      notificationConfig.eveningTime === t && styles.timeSlotPillActive,
                    ]}
                    onPress={() => updateNotificationConfig({ eveningTime: t })}>
                    <Text
                      style={[
                        styles.timeSlotText,
                        notificationConfig.eveningTime === t && styles.timeSlotTextActive,
                      ]}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Test Notification Button */}
          <TouchableOpacity
            style={styles.testNotifBtn}
            activeOpacity={0.8}
            onPress={handleSendTestNotification}>
            <Ionicons name="paper-plane-outline" size={16} color="#4F46E5" />
            <Text style={styles.testNotifBtnText}>
              {testSent ? '✓ Check-in Notification Sent!' : 'Send Test Notification Now'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Guide & Data Management */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>App Guide & Reset</Text>

          <TouchableOpacity
            style={styles.guideBtn}
            activeOpacity={0.8}
            onPress={() => setOnboardingVisible(true)}>
            <Ionicons name="help-circle-outline" size={20} color="#4F46E5" />
            <Text style={styles.guideBtnText}>Replay Onboarding & Core Loop Guide</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetBtn} activeOpacity={0.8} onPress={handleResetConfirm}>
            <Ionicons name="reload-circle-outline" size={20} color="#DC2626" />
            <Text style={styles.resetBtnText}>Reset Demo Habits & History</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Dev Test Modal */}
      <DevTestModal
        visible={devModalVisible}
        onClose={() => setDevModalVisible(false)}
      />

      {/* Onboarding Guide Modal */}
      <OnboardingModal
        visible={onboardingVisible}
        onFinish={() => setOnboardingVisible(false)}
      />
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
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
    marginTop: 2,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  devBannerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  devIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  devDesc: {
    fontSize: 12,
    color: '#7F1D1D',
    lineHeight: 16,
    fontWeight: '500',
  },
  openDevBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 14,
  },
  openDevBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  sectionNote: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  reminderBlock: {
    paddingVertical: 6,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 6,
    paddingTop: 10,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 10,
  },
  settingIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  settingDesc: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
    fontWeight: '500',
  },
  timeSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
    paddingLeft: 50,
  },
  timeSlotPill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  timeSlotPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  timeSlotText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  timeSlotTextActive: {
    color: '#FFFFFF',
  },
  testNotifBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  testNotifBtnText: {
    color: '#4338CA',
    fontSize: 13,
    fontWeight: '800',
  },
  guideBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EEF2FF',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  guideBtnText: {
    color: '#4338CA',
    fontSize: 13,
    fontWeight: '800',
  },
  resetBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  resetBtnText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '800',
  },
});
