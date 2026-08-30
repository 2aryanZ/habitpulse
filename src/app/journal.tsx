import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '@/context/HabitContext';
import { HabitLogEntry } from '@/types/habit';
import { ConsistencyStoryCard } from '@/components/ConsistencyStoryCard';

export default function JournalScreen() {
  const { logs, addLogReflection } = useHabits();
  const [selectedLog, setSelectedLog] = useState<HabitLogEntry | null>(null);
  const [reflectionText, setReflectionText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const openReflectionModal = (log: HabitLogEntry) => {
    setSelectedLog(log);
    setReflectionText(log.note || '');
    setModalVisible(true);
  };

  const handleSaveReflection = () => {
    if (selectedLog) {
      addLogReflection(selectedLog.id, reflectionText.trim());
    }
    setModalVisible(false);
  };

  const formatLogTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Top Navbar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.appTitle}>Accountability Log 📝</Text>
          <Text style={styles.appSubtitle}>Audit your habit history & personal reflections</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{logs.length} entries</Text>
        </View>
      </View>

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <ConsistencyStoryCard />
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Activity Timeline</Text>
              <Text style={styles.sectionSubtitle}>Tap entry to attach reflection</Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.logCard}
            activeOpacity={0.7}
            onPress={() => openReflectionModal(item)}>
            <View style={[styles.iconBox, { backgroundColor: `${item.habitColor}20` }]}>
              <Ionicons name={item.habitIcon as any} size={20} color={item.habitColor} />
            </View>

            <View style={styles.logDetails}>
              <View style={styles.logTopRow}>
                <Text style={styles.habitTitle}>{item.habitTitle}</Text>
                <Text style={styles.timestampText}>{formatLogTime(item.timestamp)}</Text>
              </View>

              <Text style={styles.valueText}>{item.valueLogged || 'Activity recorded'}</Text>

              {item.note ? (
                <View style={styles.noteBox}>
                  <Ionicons name="chatbubble-ellipses-outline" size={14} color="#4338CA" />
                  <Text style={styles.noteText}>{item.note}</Text>
                </View>
              ) : (
                <Text style={styles.addNoteHint}>+ Add reflection note</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="journal-outline" size={48} color="#64748B" />
            <Text style={styles.emptyTitle}>No activity logged yet</Text>
            <Text style={styles.emptySubtitle}>
              Check off your daily habits or complete intervals to see your accountability audit.
            </Text>
          </View>
        }
      />

      {/* Reflection Note Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reflect on {selectedLog?.habitTitle}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              How did you feel during this session? What went well?
            </Text>

            <TextInput
              style={styles.reflectionInput}
              placeholder="Write your personal reflection or victory note here..."
              placeholderTextColor="#64748B"
              value={reflectionText}
              onChangeText={setReflectionText}
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity style={styles.saveNoteBtn} activeOpacity={0.8} onPress={handleSaveReflection}>
              <Text style={styles.saveNoteBtnText}>Save Reflection 💾</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  countBadge: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  countText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#3730A3',
  },
  listContent: {
    paddingBottom: 40,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  logCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logDetails: {
    flex: 1,
  },
  logTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  habitTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  timestampText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
  },
  valueText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
    marginTop: 2,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  noteText: {
    fontSize: 12,
    color: '#312E81',
    fontWeight: '600',
    flex: 1,
  },
  addNoteHint: {
    fontSize: 11,
    color: '#4F46E5',
    fontWeight: '700',
    marginTop: 6,
  },
  emptyState: {
    alignItems: 'center',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 14,
    fontWeight: '500',
  },
  reflectionInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
    height: 100,
    textAlignVertical: 'top',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    marginBottom: 16,
  },
  saveNoteBtn: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  saveNoteBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
