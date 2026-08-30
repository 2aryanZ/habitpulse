import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES, HABIT_COLORS, HabitCategory } from '@/types/habit';
import { useHabits } from '@/context/HabitContext';

interface CreateChallengeModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CreateChallengeModal: React.FC<CreateChallengeModalProps> = ({
  visible,
  onClose,
}) => {
  const { addCustomChallenge } = useHabits();

  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [durationDays, setDurationDays] = useState(7);
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | 'all'>('all');
  const [rewardBadge, setRewardBadge] = useState('');
  const [rewardColor, setRewardColor] = useState(HABIT_COLORS[0]);

  const DURATION_OPTIONS = [3, 7, 14, 21, 30];

  const handleSave = () => {
    if (!title.trim()) return;

    addCustomChallenge({
      title: title.trim(),
      tagline: tagline.trim() || `${durationDays}-Day Personal Consistency Sprint`,
      description:
        description.trim() ||
        `Maintain your daily habits for ${durationDays} consecutive days to achieve mastery.`,
      durationDays,
      targetHabitCategory: selectedCategory === 'all' ? undefined : selectedCategory,
      rewardBadge: rewardBadge.trim() ? `🏆 ${rewardBadge.trim()}` : `🏆 ${title.trim()} Champion`,
      rewardColor,
      rewardIcon: 'trophy',
    });

    // Reset and close
    setTitle('');
    setTagline('');
    setDescription('');
    setDurationDays(7);
    setSelectedCategory('all');
    setRewardBadge('');
    setRewardColor(HABIT_COLORS[0]);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.modalTitle}>🚀 Create Custom Challenge</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
            {/* Title */}
            <Text style={styles.label}>Challenge Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 14-Day Code & Read Sprint, 7-Day Clean Eating..."
              placeholderTextColor="#94A3B8"
              value={title}
              onChangeText={setTitle}
            />

            {/* Tagline */}
            <Text style={styles.label}>Tagline / Motivation</Text>
            <TextInput
              style={styles.input}
              placeholder="Short exciting hook..."
              placeholderTextColor="#94A3B8"
              value={tagline}
              onChangeText={setTagline}
            />

            {/* Duration Selector */}
            <Text style={styles.label}>Sprint Duration</Text>
            <View style={styles.chipRow}>
              {DURATION_OPTIONS.map((days) => {
                const isSelected = durationDays === days;
                return (
                  <TouchableOpacity
                    key={days}
                    onPress={() => setDurationDays(days)}
                    style={[styles.freqChip, isSelected && styles.selectedFreqChip]}>
                    <Text style={[styles.freqText, isSelected && styles.selectedFreqText]}>
                      {days} Days {days === 3 ? '⚡' : days === 7 ? '🔥' : '🏆'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Target Category */}
            <Text style={styles.label}>Target Category Focus</Text>
            <View style={styles.chipRow}>
              <TouchableOpacity
                onPress={() => setSelectedCategory('all')}
                style={[styles.categoryChip, selectedCategory === 'all' && styles.selectedAllChip]}>
                <Text style={[styles.chipText, selectedCategory === 'all' && styles.selectedChipText]}>
                  All Habits
                </Text>
              </TouchableOpacity>

              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setSelectedCategory(cat.id)}
                    style={[
                      styles.categoryChip,
                      isSelected && { backgroundColor: cat.color, borderColor: cat.color },
                    ]}>
                    <Ionicons
                      name={cat.icon as any}
                      size={14}
                      color={isSelected ? '#FFFFFF' : cat.color}
                    />
                    <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Reward Badge Name */}
            <Text style={styles.label}>Unlockable Reward Badge Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Master of Consistency, Hydration Legend..."
              placeholderTextColor="#94A3B8"
              value={rewardBadge}
              onChangeText={setRewardBadge}
            />

            {/* Reward Theme Color */}
            <Text style={styles.label}>Reward Color Theme</Text>
            <View style={styles.colorRow}>
              {HABIT_COLORS.map((c) => {
                const isSelected = rewardColor === c;
                return (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setRewardColor(c)}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: c },
                      isSelected && styles.selectedColorCircle,
                    ]}>
                    {isSelected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Submit */}
          <TouchableOpacity
            disabled={!title.trim()}
            onPress={handleSave}
            style={[styles.saveButton, { backgroundColor: title.trim() ? '#4F46E5' : '#CBD5E1' }]}>
            <Text style={styles.saveButtonText}>Launch Custom Challenge 🚀</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 36,
    maxHeight: '90%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  scrollContainer: {
    paddingBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginTop: 14,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  freqChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedFreqChip: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  freqText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  selectedFreqText: {
    color: '#FFFFFF',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  selectedAllChip: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  selectedChipText: {
    color: '#FFFFFF',
  },
  colorRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 4,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColorCircle: {
    borderWidth: 3,
    borderColor: '#0F172A',
  },
  saveButton: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 14,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
