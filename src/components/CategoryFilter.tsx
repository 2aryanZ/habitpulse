import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES, HabitCategory } from '@/types/habit';
import { useHabits } from '@/context/HabitContext';

export const CategoryFilter: React.FC = () => {
  const { selectedCategory, setSelectedCategory, habits } = useHabits();

  const getCategoryCount = (category: HabitCategory | 'all') => {
    if (category === 'all') return habits.length;
    return habits.filter((h) => h.category === category).length;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setSelectedCategory('all')}
          style={[
            styles.filterPill,
            selectedCategory === 'all' && styles.activePill,
          ]}>
          <Text
            style={[
              styles.pillText,
              selectedCategory === 'all' && styles.activePillText,
            ]}>
            All
          </Text>
          <View
            style={[
              styles.badge,
              selectedCategory === 'all' && styles.activeBadge,
            ]}>
            <Text
              style={[
                styles.badgeText,
                selectedCategory === 'all' && styles.activeBadgeText,
              ]}>
              {getCategoryCount('all')}
            </Text>
          </View>
        </TouchableOpacity>

        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = getCategoryCount(cat.id);

          return (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.7}
              onPress={() => setSelectedCategory(cat.id)}
              style={[
                styles.filterPill,
                isSelected && { backgroundColor: cat.color, borderColor: cat.color },
              ]}>
              <Ionicons
                name={cat.icon as any}
                size={14}
                color={isSelected ? '#FFFFFF' : cat.color}
                style={styles.pillIcon}
              />
              <Text
                style={[
                  styles.pillText,
                  isSelected && styles.activePillText,
                ]}>
                {cat.label}
              </Text>
              <View
                style={[
                  styles.badge,
                  isSelected && { backgroundColor: 'rgba(255, 255, 255, 0.25)' },
                ]}>
                <Text
                  style={[
                    styles.badgeText,
                    isSelected && styles.activeBadgeText,
                  ]}>
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activePill: {
    backgroundColor: '#1E1B4B',
    borderColor: '#1E1B4B',
  },
  pillIcon: {
    marginRight: 6,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  activePillText: {
    color: '#FFFFFF',
  },
  badge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  activeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  activeBadgeText: {
    color: '#FFFFFF',
  },
});
