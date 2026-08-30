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
import {
  AVAILABLE_ICONS,
  CATEGORIES,
  HABIT_COLORS,
  HabitCategory,
  HabitType,
} from '@/types/habit';
import { useHabits } from '@/context/HabitContext';

interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AddHabitModal: React.FC<AddHabitModalProps> = ({ visible, onClose }) => {
  const { addHabit } = useHabits();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>('health');
  const [type, setType] = useState<HabitType>('boolean');
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(AVAILABLE_ICONS[0].name);
  const [frequency, setFrequency] = useState('Daily');
  const [reminderTime, setReminderTime] = useState('08:00');

  // Multi-type specific states
  const [targetValue, setTargetValue] = useState('8');
  const [unit, setUnit] = useState('glasses');
  const [targetDurationMinutes, setTargetDurationMinutes] = useState('15');

  const FREQUENCY_OPTIONS = ['Daily', 'Weekdays', 'Weekends', '3x a week', '5x a week'];
  const QUICK_REMINDER_TIMES = ['07:30', '08:00', '12:30', '17:30', '20:00', '21:30'];

  const handleSave = () => {
    if (!title.trim()) return;

    addHabit({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      type,
      color: selectedColor,
      icon: selectedIcon,
      targetFrequency: frequency,
      reminderTime: reminderTime.trim() || undefined,
      targetValue: type === 'counter' ? parseInt(targetValue, 10) || 1 : undefined,
      unit: type === 'counter' ? unit.trim() || 'times' : undefined,
      targetDurationMinutes:
        type === 'timer' ? parseInt(targetDurationMinutes, 10) || 10 : undefined,
    });

    // Reset and close
    setTitle('');
    setDescription('');
    setCategory('health');
    setType('boolean');
    setSelectedColor(HABIT_COLORS[0]);
    setSelectedIcon(AVAILABLE_ICONS[0].name);
    setFrequency('Daily');
    setReminderTime('08:00');
    setTargetValue('8');
    setUnit('glasses');
    setTargetDurationMinutes('15');
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
            <Text style={styles.modalTitle}>✨ New Habit</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#0F172A" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
            {/* Habit Type Selection */}
            <Text style={styles.label}>Habit Modality</Text>
            <View style={styles.typeSelectorRow}>
              <TouchableOpacity
                onPress={() => setType('boolean')}
                style={[styles.typeButton, type === 'boolean' && styles.typeButtonActive]}>
                <Ionicons
                  name="checkbox"
                  size={16}
                  color={type === 'boolean' ? '#FFFFFF' : '#0F172A'}
                />
                <Text style={[styles.typeText, type === 'boolean' && styles.typeTextActive]}>
                  Check-off
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setType('counter')}
                style={[styles.typeButton, type === 'counter' && styles.typeButtonActive]}>
                <Ionicons
                  name="calculator"
                  size={16}
                  color={type === 'counter' ? '#FFFFFF' : '#0F172A'}
                />
                <Text style={[styles.typeText, type === 'counter' && styles.typeTextActive]}>
                  Volume Count
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setType('timer')}
                style={[styles.typeButton, type === 'timer' && styles.typeButtonActive]}>
                <Ionicons
                  name="timer"
                  size={16}
                  color={type === 'timer' ? '#FFFFFF' : '#0F172A'}
                />
                <Text style={[styles.typeText, type === 'timer' && styles.typeTextActive]}>
                  Timer Session
                </Text>
              </TouchableOpacity>
            </View>

            {/* Type Specific Fields */}
            {type === 'counter' && (
              <View style={styles.typeSpecificBox}>
                <View style={styles.inlineInputs}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.subLabel}>Target Goal</Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      value={targetValue}
                      onChangeText={setTargetValue}
                      placeholder="e.g. 8"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                  <View style={{ flex: 1.5 }}>
                    <Text style={styles.subLabel}>Unit Label</Text>
                    <TextInput
                      style={styles.input}
                      value={unit}
                      onChangeText={setUnit}
                      placeholder="glasses, reps, sets"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                </View>
              </View>
            )}

            {type === 'timer' && (
              <View style={styles.typeSpecificBox}>
                <Text style={styles.subLabel}>Target Duration (Minutes)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={targetDurationMinutes}
                  onChangeText={setTargetDurationMinutes}
                  placeholder="e.g. 20"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            )}

            {/* Title */}
            <Text style={styles.label}>Habit Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Morning Stretch, Read Non-Fiction..."
              placeholderTextColor="#64748B"
              value={title}
              onChangeText={setTitle}
            />

            {/* Description */}
            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Short note or motivation..."
              placeholderTextColor="#64748B"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={2}
            />

            {/* Custom Reminder Time */}
            <Text style={styles.label}>Custom Habit Reminder Time</Text>
            <View style={styles.chipRow}>
              {QUICK_REMINDER_TIMES.map((time) => {
                const isSelected = reminderTime === time;
                return (
                  <TouchableOpacity
                    key={time}
                    onPress={() => setReminderTime(time)}
                    style={[styles.freqChip, isSelected && styles.selectedFreqChip]}>
                    <Text style={[styles.freqText, isSelected && styles.selectedFreqText]}>
                      ⏰ {time}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Category */}
            <Text style={styles.label}>Category</Text>
            <View style={styles.chipRow}>
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => {
                      setCategory(cat.id);
                      setSelectedColor(cat.color);
                    }}
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

            {/* Icon Picker */}
            <Text style={styles.label}>Icon</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconScroll}>
              {AVAILABLE_ICONS.map((item) => {
                const isSelected = selectedIcon === item.name;
                return (
                  <TouchableOpacity
                    key={item.name}
                    onPress={() => setSelectedIcon(item.name)}
                    style={[
                      styles.iconButton,
                      isSelected && { backgroundColor: selectedColor, borderColor: selectedColor },
                    ]}>
                    <Ionicons
                      name={item.name as any}
                      size={20}
                      color={isSelected ? '#FFFFFF' : '#0F172A'}
                    />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Color Picker */}
            <Text style={styles.label}>Color Theme</Text>
            <View style={styles.colorRow}>
              {HABIT_COLORS.map((c) => {
                const isSelected = selectedColor === c;
                return (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setSelectedColor(c)}
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

            {/* Frequency */}
            <Text style={styles.label}>Frequency</Text>
            <View style={styles.chipRow}>
              {FREQUENCY_OPTIONS.map((opt) => {
                const isSelected = frequency === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => setFrequency(opt)}
                    style={[styles.freqChip, isSelected && styles.selectedFreqChip]}>
                    <Text style={[styles.freqText, isSelected && styles.selectedFreqText]}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Submit Button */}
          <TouchableOpacity
            disabled={!title.trim()}
            onPress={handleSave}
            style={[styles.saveButton, { backgroundColor: title.trim() ? '#4F46E5' : '#CBD5E1' }]}>
            <Text style={styles.saveButtonText}>Create Habit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 14,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  typeButtonActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  typeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  typeTextActive: {
    color: '#FFFFFF',
  },
  typeSpecificBox: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inlineInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  textArea: {
    height: 55,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    gap: 6,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  selectedChipText: {
    color: '#FFFFFF',
  },
  iconScroll: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
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
  freqChip: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  selectedFreqChip: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  freqText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  selectedFreqText: {
    color: '#FFFFFF',
  },
  saveButton: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
