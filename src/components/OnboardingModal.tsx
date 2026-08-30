import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { playChimeSound, triggerHaptic } from '@/utils/sensory';

interface OnboardingModalProps {
  visible: boolean;
  onFinish: () => void;
}

const { width } = Dimensions.get('window');

const ONBOARDING_SLIDES = [
  {
    step: 1,
    title: 'Track Any Habit Type',
    subtitle:
      'Not all habits are equal. Create 1-tap check-ins, volume counters (e.g., 8 glasses of water), and focus timers (e.g., 25-min meditation).',
    icon: 'checkbox',
    color: '#4F46E5',
    bg: '#EEF2FF',
  },
  {
    step: 2,
    title: 'Rewarding Sensory Core Loop',
    subtitle:
      'Every check-off and finished interval rewards you with crisp haptic micro-feedback, sound chimes, and confetti bursts.',
    icon: 'sparkles',
    color: '#F59E0B',
    bg: '#FEF3C7',
  },
  {
    step: 3,
    title: '3-Day Kickstart & Sprints',
    subtitle:
      'Kickstart your momentum with our 3-Day Sprint immediately after starting. Complete consecutive days to unlock permanent trophy badges.',
    icon: 'trophy',
    color: '#10B981',
    bg: '#ECFDF5',
  },
  {
    step: 4,
    title: 'Timely Retention Check-ins',
    subtitle:
      'Set custom reminder times per habit and configure Morning, Mid-day, and Evening check-ins to safeguard your streaks.',
    icon: 'notifications',
    color: '#8B5CF6',
    bg: '#EDE9FE',
  },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ visible, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    triggerHaptic('light');
    playChimeSound('step');
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      triggerHaptic('success');
      playChimeSound('complete');
      onFinish();
    }
  };

  if (!visible) return null;

  const currentSlide = ONBOARDING_SLIDES[currentIndex];
  const isLast = currentIndex === ONBOARDING_SLIDES.length - 1;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onFinish}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Top Skip / Close */}
          <View style={styles.topRow}>
            <Text style={styles.stepIndicator}>
              STEP {currentIndex + 1} OF {ONBOARDING_SLIDES.length}
            </Text>
            <TouchableOpacity onPress={onFinish} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>

          {/* Hero Icon */}
          <View style={[styles.iconCircle, { backgroundColor: currentSlide.bg }]}>
            <Ionicons name={currentSlide.icon as any} size={48} color={currentSlide.color} />
          </View>

          {/* Content */}
          <Text style={styles.title}>{currentSlide.title}</Text>
          <Text style={styles.subtitle}>{currentSlide.subtitle}</Text>

          {/* Progress Dots */}
          <View style={styles.dotsRow}>
            {ONBOARDING_SLIDES.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === currentIndex && [styles.activeDot, { backgroundColor: currentSlide.color }],
                ]}
              />
            ))}
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: currentSlide.color }]}
            activeOpacity={0.8}
            onPress={handleNext}>
            <Text style={styles.actionBtnText}>
              {isLast ? 'Get Started & Build Habits 🚀' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  topRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepIndicator: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  skipBtn: {
    padding: 4,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 8,
    paddingHorizontal: 6,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    marginVertical: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  activeDot: {
    width: 22,
  },
  actionBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
