import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, RefreshControl, StyleSheet, Platform } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { CalendarX, Plus } from 'lucide-react-native';
import { useEvents } from '../../hooks/useEvents';
import { EventCard } from '../../components/ui/EventCard';
import { useTheme } from '../../hooks/useTheme';
import { useT } from '../../hooks/useT';

const EmptyState = ({ onCreatePress, C, t }: any) => (
  <View style={styles.emptyWrap}>
    <View style={[styles.emptyIconCircle, { backgroundColor: C.accentLight }]}>
      <CalendarX size={40} color={C.accent} />
    </View>
    <Text style={[styles.emptyTitle, { color: C.text }]}>{t('noEventsTitle')}</Text>
    <Text style={[styles.emptyBody, { color: C.textSecondary }]}>{t('noEventsBody')}</Text>
    <TouchableOpacity style={[styles.emptyBtn, { backgroundColor: C.text }]} onPress={onCreatePress}>
      <Text style={[styles.emptyBtnText, { color: C.bg }]}>{t('createFirst')}</Text>
    </TouchableOpacity>
  </View>
);

export const EventsListScreen = ({ navigation }: any) => {
  const { t } = useT();
  const C = useTheme();
  const { data: events, isLoading, isError, error, refetch, isRefetching } = useEvents();

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: C.bg }]}>
        <ActivityIndicator size="large" color={C.accent} />
        <Text style={[styles.loadingText, { color: C.textMuted }]}>Loading events…</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.center, { backgroundColor: C.bg }]}>
        <Text style={[styles.errorTitle, { color: C.text }]}>Something went wrong</Text>
        <Text style={[styles.errorBody, { color: C.textSecondary }]}>{(error as Error)?.message}</Text>
        <TouchableOpacity style={[styles.retryBtn, { backgroundColor: C.accent }]} onPress={() => refetch()}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const tabBarHeight = Platform.OS === 'ios' ? 28 + 80 : 20 + 80;
  const fabBottom = tabBarHeight + 16;

  return (
    <View style={[styles.root, { backgroundColor: C.bg }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerLabel, { color: C.accent }]}>{t('upcoming').toUpperCase()}</Text>
          <Text style={[styles.headerTitle, { color: C.text }]}>{t('events')}</Text>
        </View>
        <View style={[styles.headerBadge, { backgroundColor: C.accentLight, borderColor: C.accentBorder }]}>
          <Text style={[styles.headerBadgeText, { color: C.accent }]}>{(events || []).length}</Text>
        </View>
      </View>

      <FlashList
        data={events || []}
        renderItem={({ item }) => (
          <EventCard event={item} onPress={() => navigation.navigate('EventDetail', { event: item })} />
        )}
        // @ts-ignore
        estimatedItemSize={140}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={C.accent} />}
        ListEmptyComponent={<EmptyState onCreatePress={() => navigation.navigate('CreateEvent')} C={C} t={t} />}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: tabBarHeight + 80, paddingTop: 8 }}
      />

      {/* FAB — dynamically positioned above tab bar */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: C.accent, bottom: fabBottom, shadowColor: C.accent }]}
        onPress={() => navigation.navigate('CreateEvent')}
        activeOpacity={0.85}
      >
        <Plus size={18} color="#fff" strokeWidth={2.5} style={{ marginRight: 6 }} />
        <Text style={styles.fabText}>{t('newEvent')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 60 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  loadingText: { marginTop: 12, fontWeight: '600', fontSize: 14 },
  errorTitle: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
  errorBody: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  retryBtn: { paddingHorizontal: 32, paddingVertical: 14, borderRadius: 14 },
  retryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingBottom: 16,
  },
  headerLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 2 },
  headerTitle: { fontSize: 32, fontWeight: '800', letterSpacing: -0.8 },
  headerBadge: { borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1 },
  headerBadgeText: { fontWeight: '700', fontSize: 16 },
  emptyWrap: { alignItems: 'center', paddingTop: 64, paddingHorizontal: 32 },
  emptyIconCircle: { width: 88, height: 88, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  emptyTitle: { fontSize: 22, fontWeight: '800', marginBottom: 10, letterSpacing: -0.4 },
  emptyBody: { fontSize: 15, textAlign: 'center', lineHeight: 24, marginBottom: 28 },
  emptyBtn: { paddingHorizontal: 28, paddingVertical: 16, borderRadius: 16 },
  emptyBtnText: { fontWeight: '700', fontSize: 15 },
  fab: {
    position: 'absolute', right: 20,
    paddingHorizontal: 20, paddingVertical: 14, borderRadius: 24,
    flexDirection: 'row', alignItems: 'center',
    shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 10,
  },
  fabText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
