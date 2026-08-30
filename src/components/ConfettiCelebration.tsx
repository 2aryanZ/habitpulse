import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ConfettiCelebrationProps {
  visible: boolean;
  title?: string;
  subtitle?: string;
  badge?: string;
  onDismiss: () => void;
}

const { width, height } = Dimensions.get('window');
const NUM_PARTICLES = 32;
const COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#EC4899', '#8B5CF6', '#EF4444', '#FBBF24'];

export const ConfettiCelebration: React.FC<ConfettiCelebrationProps> = ({
  visible,
  title = '🎉 Goal Completed!',
  subtitle = 'Incredible work! Keep this momentum alive.',
  badge,
  onDismiss,
}) => {
  const particles = useRef(
    Array.from({ length: NUM_PARTICLES }, () => ({
      animY: new Animated.Value(0),
      animX: new Animated.Value(0),
      animRotate: new Animated.Value(0),
      animScale: new Animated.Value(0),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      startX: Math.random() * width,
      targetX: (Math.random() - 0.5) * 280,
      targetY: -height * 0.45 - Math.random() * 250,
      size: Math.floor(Math.random() * 8) + 8,
      isRound: Math.random() > 0.5,
    }))
  ).current;

  const scaleCard = useRef(new Animated.Value(0.7)).current;
  const opacityCard = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      particles.forEach((p) => {
        p.animY.setValue(0);
        p.animX.setValue(0);
        p.animRotate.setValue(0);
        p.animScale.setValue(0);
      });
      scaleCard.setValue(0.7);
      opacityCard.setValue(0);

      // Trigger card bounce
      Animated.parallel([
        Animated.spring(scaleCard, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(opacityCard, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        ...particles.map((p) =>
          Animated.parallel([
            Animated.timing(p.animY, {
              toValue: p.targetY,
              duration: 1200 + Math.random() * 600,
              useNativeDriver: true,
            }),
            Animated.timing(p.animX, {
              toValue: p.targetX,
              duration: 1200 + Math.random() * 600,
              useNativeDriver: true,
            }),
            Animated.timing(p.animRotate, {
              toValue: 720,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(p.animScale, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(p.animScale, {
                toValue: 0,
                duration: 1200,
                delay: 400,
                useNativeDriver: true,
              }),
            ]),
          ])
        ),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        {/* Particles */}
        <View style={styles.particlesContainer} pointerEvents="none">
          {particles.map((p, i) => {
            const spin = p.animRotate.interpolate({
              inputRange: [0, 720],
              outputRange: ['0deg', '720deg'],
            });

            return (
              <Animated.View
                key={i}
                style={[
                  styles.particle,
                  {
                    left: p.startX,
                    top: height * 0.65,
                    width: p.size,
                    height: p.isRound ? p.size : p.size * 1.6,
                    backgroundColor: p.color,
                    borderRadius: p.isRound ? p.size / 2 : 2,
                    transform: [
                      { translateX: p.animX },
                      { translateY: p.animY },
                      { rotate: spin },
                      { scale: p.animScale },
                    ],
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Celebratory Card */}
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ scale: scaleCard }],
              opacity: opacityCard,
            },
          ]}>
          <View style={styles.trophyCircle}>
            <Ionicons name="sparkles" size={36} color="#F59E0B" />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          {badge ? (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ) : null}

          <TouchableOpacity style={styles.continueBtn} activeOpacity={0.8} onPress={onDismiss}>
            <Text style={styles.continueBtnText}>Claim Reward & Continue ✨</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  particle: {
    position: 'absolute',
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
  trophyCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#FDE68A',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  badgeContainer: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    marginTop: 16,
  },
  badgeText: {
    color: '#4338CA',
    fontSize: 13,
    fontWeight: '700',
  },
  continueBtn: {
    width: '100%',
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
