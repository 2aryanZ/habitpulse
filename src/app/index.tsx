import React, { useState } from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '@/context/HabitContext';
import { DailySummaryCard } from '@/components/DailySummaryCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { HabitCard } from '@/components/HabitCard';
import { AddHabitModal } from '@/components/AddHabitModal';
import { ConfettiCelebration } from '@/components/ConfettiCelebration';
import { DevTestModal } from '@/components/DevTestModal';
import { OnboardingModal } from '@/components/OnboardingModal';
import { BottomTabInset } from '@/constants/theme';

export default function HabitsScreen() {
  const {
    habits,
    selectedCategory,
    celebrationState,
    hasSeenOnboarding,
    setHasSeenOnboarding,
    dismissCelebration,
    resetDemoData,
  } = useHabits();

  const [modalVisible, setModalVisible] = useState(false);
  const [devModalVisible, setDevModalVisible] = useState(false);
  const [onboardingVisible, setOnboardingVisible] = useState(false);

  const filteredHabits = habits.filter((habit) => {
    if (selectedCategory === 'all') return true;
    return habit.category === selectedCategory;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Top Navbar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.appTitle}>HabitPulse ✨</Text>
          <Text style={styles.appSubtitle}>Build consistency daily</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.devBtn}
            activeOpacity={0.7}
            onPress={() => setDevModalVisible(true)}>
            <Ionicons name="construct-outline" size={15} color="#DC2626" />
            <Text style={styles.devBtnText}>Dev Tools</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={resetDemoData}
            style={styles.refreshButton}
            activeOpacity={0.7}>
            <Ionicons name="reload-outline" size={15} color="#4F46E5" />
            <Text style={styles.refreshText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredHabits}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: BottomTabInset + 90 },
        ]}
        ListHeaderComponent={
          <>
            <DailySummaryCard />
            <CategoryFilter />
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>
                {selectedCategory === 'all'
                  ? 'All Habits'
                  : `${selectedCategory.toUpperCase()} Habits`}
              </Text>
              <Text style={styles.sectionCount}>
                {filteredHabits.length} {filteredHabits.length === 1 ? 'habit' : 'habits'}
              </Text>
            </View>
          </>
        }
        renderItem={({ item }) => <HabitCard habit={item} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="sparkles-outline" size={48} color="#64748B" />
            <Text style={styles.emptyTitle}>No habits in this category</Text>
            <Text style={styles.emptySubtitle}>
              Tap the "+ Add Habit" button below to create your first routine!
            </Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
        <Text style={styles.fabText}>Add Habit</Text>
      </TouchableOpacity>

      {/* New Habit Modal */}
      <AddHabitModal visible={modalVisible} onClose={() => setModalVisible(false)} />

      {/* Developer Testing Tools Modal */}
      <DevTestModal visible={devModalVisible} onClose={() => setDevModalVisible(false)} />

      {/* Onboarding Guide Modal */}
      <OnboardingModal
        visible={onboardingVisible}
        onFinish={() => {
          setOnboardingVisible(false);
          setHasSeenOnboarding(true);
        }}
      />

      {/* Confetti Celebration Overlay */}
      <ConfettiCelebration
        visible={celebrationState.visible}
        title={celebrationState.title}
        subtitle={celebrationState.subtitle}
        badge={celebrationState.badge}
        onDismiss={dismissCelebration}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  devBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEE2E2',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  devBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DC2626',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  refreshText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4338CA',
  },
  listContent: {
    paddingTop: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 14,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCount: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#334155',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: BottomTabInset + 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    gap: 6,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
