import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Challenge } from '@/types/habit';
import { useHabits } from '@/context/HabitContext';

interface ChallengeCardProps {
  challenge: Challenge;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
  const { startChallenge, claimChallengeReward } = useHabits();

  const progressRatio = Math.min(1, challenge.completedDays / challenge.durationDays);
  const percent = Math.round(progressRatio * 100);
  const isCompleted = challenge.status === 'completed';
  const isActive = challenge.status === 'active';
  const isClaimed = !!challenge.claimedAt;

  return (
    <View style={[styles.card, isActive && styles.activeCard, isCompleted && styles.completedCard]}>
      <View style={styles.headerRow}>
        <View style={[styles.iconBox, { backgroundColor: `${challenge.rewardColor}18` }]}>
          <Ionicons name={challenge.rewardIcon as any} size={24} color={challenge.rewardColor} />
        </View>

        <View style={styles.headerTextCol}>
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.statusBadge,
                isCompleted
                  ? styles.completedBadge
                  : isActive
                  ? styles.activeBadge
                  : styles.availableBadge,
              ]}>
              <Text
                style={[
                  styles.statusText,
                  isCompleted
                    ? styles.completedText
                    : isActive
                    ? styles.activeText
                    : styles.availableText,
                ]}>
                {isCompleted ? 'Completed 🏆' : isActive ? 'Active Challenge 🔥' : 'Available'}
              </Text>
            </View>
            <Text style={styles.durationText}>{challenge.durationDays} Days</Text>
          </View>

          <Text style={styles.title}>{challenge.title}</Text>
          <Text style={styles.tagline}>{challenge.tagline}</Text>
        </View>
      </View>

      <Text style={styles.description}>{challenge.description}</Text>

      {/* Progress section if active or completed */}
      {(isActive || isCompleted) && (
        <View style={styles.progressSection}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabel}>
              Day {challenge.completedDays} of {challenge.durationDays}
            </Text>
            <Text style={styles.progressPercent}>{percent}%</Text>
          </View>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                { width: `${Math.max(percent, 4)}%`, backgroundColor: challenge.rewardColor },
              ]}
            />
          </View>
        </View>
      )}

      {/* Reward Preview */}
      <View style={styles.rewardBox}>
        <Ionicons name="gift-outline" size={16} color="#6366F1" />
        <Text style={styles.rewardText}>Reward: {challenge.rewardBadge}</Text>
      </View>

      {/* Actions */}
      <View style={styles.footerRow}>
        {challenge.status === 'available' && (
          <TouchableOpacity
            style={styles.startBtn}
            activeOpacity={0.8}
            onPress={() => startChallenge(challenge.id)}>
            <Text style={styles.startBtnText}>Start Challenge 🚀</Text>
          </TouchableOpacity>
        )}

        {isCompleted && !isClaimed && (
          <TouchableOpacity
            style={styles.claimBtn}
            activeOpacity={0.8}
            onPress={() => claimChallengeReward(challenge.id)}>
            <Text style={styles.claimBtnText}>Claim Reward Badge 🎁</Text>
          </TouchableOpacity>
        )}

        {isCompleted && isClaimed && (
          <View style={styles.claimedBadge}>
            <Ionicons name="checkmark-circle" size={18} color="#059669" />
            <Text style={styles.claimedText}>Reward Claimed & Stored</Text>
          </View>
        )}
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
    marginVertical: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  activeCard: {
    borderColor: '#C7D2FE',
    backgroundColor: '#FBFBFE',
  },
  completedCard: {
    borderColor: '#A7F3D0',
    backgroundColor: '#F0FDF4',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextCol: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  availableBadge: {
    backgroundColor: '#F1F5F9',
  },
  activeBadge: {
    backgroundColor: '#EEF2FF',
  },
  completedBadge: {
    backgroundColor: '#ECFDF5',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  availableText: {
    color: '#64748B',
  },
  activeText: {
    color: '#4F46E5',
  },
  completedText: {
    color: '#059669',
  },
  durationText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  tagline: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  description: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginTop: 10,
  },
  progressSection: {
    marginTop: 14,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
  barTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  rewardBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 8,
    marginTop: 14,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4338CA',
  },
  footerRow: {
    marginTop: 14,
  },
  startBtn: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  startBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  claimBtn: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  claimBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  claimedBadge: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  claimedText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
  },
});
