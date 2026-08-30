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
import { ChallengeCard } from '@/components/ChallengeCard';
import { ConfettiCelebration } from '@/components/ConfettiCelebration';
import { CreateChallengeModal } from '@/components/CreateChallengeModal';
import { DevTestModal } from '@/components/DevTestModal';

export default function ChallengesScreen() {
  const { challenges, celebrationState, dismissCelebration } = useHabits();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [devModalVisible, setDevModalVisible] = useState(false);

  const activeCount = challenges.filter((c) => c.status === 'active').length;
  const completedCount = challenges.filter((c) => c.status === 'completed').length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.appTitle}>Challenges 🏆</Text>
          <Text style={styles.appSubtitle}>Build rapid momentum through micro-sprints</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.devBtn}
            activeOpacity={0.7}
            onPress={() => setDevModalVisible(true)}>
            <Ionicons name="construct-outline" size={16} color="#DC2626" />
            <Text style={styles.devBtnText}>Dev Tools</Text>
          </TouchableOpacity>

          <View style={styles.statsBadge}>
            <Ionicons name="flame" size={15} color="#D97706" />
            <Text style={styles.statsBadgeText}>
              {activeCount} active · {completedCount} won
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={challenges}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerSection}>
            {/* 3-Day Kickstart Highlight Banner */}
            <View style={styles.bannerBox}>
              <View style={styles.bannerIconCircle}>
                <Ionicons name="rocket" size={24} color="#4F46E5" />
              </View>
              <View style={styles.bannerTextCol}>
                <Text style={styles.bannerTitle}>3-Day Habit Kickstart</Text>
                <Text style={styles.bannerDesc}>
                  The fastest way to form neuroplastic habit loops is completing 3 consecutive days.
                </Text>
              </View>
            </View>

            {/* Create Custom Challenge Button */}
            <TouchableOpacity
              style={styles.createChallengeBtn}
              activeOpacity={0.8}
              onPress={() => setCreateModalVisible(true)}>
              <Ionicons name="add-circle" size={20} color="#FFFFFF" />
              <Text style={styles.createChallengeBtnText}>Create Custom Challenge</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => <ChallengeCard challenge={item} />}
      />

      {/* Custom Challenge Creator */}
      <CreateChallengeModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
      />

      {/* Developer Testing Tools Modal */}
      <DevTestModal
        visible={devModalVisible}
        onClose={() => setDevModalVisible(false)}
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  devBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEE2E2',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  devBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DC2626',
  },
  statsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  statsBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
  },
  listContent: {
    paddingBottom: 40,
  },
  headerSection: {
    paddingHorizontal: 16,
    marginVertical: 6,
    gap: 10,
  },
  bannerBox: {
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  bannerIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTextCol: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#312E81',
  },
  bannerDesc: {
    fontSize: 12,
    color: '#4338CA',
    marginTop: 2,
    lineHeight: 16,
    fontWeight: '500',
  },
  createChallengeBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  createChallengeBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
