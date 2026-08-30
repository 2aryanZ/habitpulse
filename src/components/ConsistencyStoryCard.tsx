import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '@/context/HabitContext';

export const ConsistencyStoryCard: React.FC = () => {
  const { generateConsistencyStory } = useHabits();
  const { paragraph, score, highlight } = generateConsistencyStory();

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="sparkles" size={16} color="#8B5CF6" />
          </View>
          <Text style={styles.title}>Consistency Narrative</Text>
        </View>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      </View>

      <Text style={styles.paragraph}>{paragraph}</Text>

      <View style={styles.footerRow}>
        <Ionicons name="ribbon-outline" size={14} color="#6366F1" />
        <Text style={styles.highlightText}>Highlight: {highlight}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  scoreBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  scoreText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4338CA',
  },
  paragraph: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  highlightText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4F46E5',
  },
});
