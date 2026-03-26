import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { MapPin, ArrowLeft, Edit2 } from 'lucide-react-native';
import { EventDetailScreenProps } from '../../navigation/types';
import { useRegisterEvent } from '../../hooks/useRegisterEvent';
import { useTheme } from '../../hooks/useTheme';
import { useT } from '../../hooks/useT';

export const EventDetailScreen = ({ route, navigation }: EventDetailScreenProps) => {
  const { event } = route.params;
  const { mutate: registerForEvent, isPending } = useRegisterEvent();
  const C = useTheme();
  const { t } = useT();

  if (!event) {
    return (
      <View style={[styles.root, styles.center, { backgroundColor: C.bg }]}>
        <Text style={[styles.errorText, { color: C.text }]}>Event not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backPill, { backgroundColor: C.surface }]}>
          <Text style={[styles.backPillText, { color: C.accent }]}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const dateObj = new Date(event.date);
  const fullDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const day = dateObj.getDate();

  return (
    <View style={[styles.root, { backgroundColor: C.bg }]}>
      {/* Hero */}
      <View style={[styles.hero, { backgroundColor: C.surface, borderBottomColor: C.border }]}>
        <View style={[styles.dateBadge, { backgroundColor: C.accentLight, borderColor: C.accentBorder }]}>
          <Text style={[styles.dateMonth, { color: C.accent }]}>{month}</Text>
          <Text style={[styles.dateDay, { color: C.text }]}>{day}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 16 }}>
          <Text style={[styles.title, { color: C.text }]} numberOfLines={3}>{event.title}</Text>
          <View style={styles.locationRow}>
            <MapPin size={13} color={C.textMuted} />
            <Text style={[styles.locationText, { color: C.textSecondary }]} numberOfLines={1}>{event.location}</Text>
          </View>
        </View>
      </View>

      {/* Action row */}
      <View style={[styles.actionRow, { backgroundColor: C.bg, borderBottomColor: C.border }]}>
        <TouchableOpacity style={[styles.pill, { backgroundColor: C.surface, borderColor: C.border }]} onPress={() => navigation.goBack()}>
          <ArrowLeft size={15} color={C.text} />
          <Text style={[styles.pillText, { color: C.text }]}>{t('back')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.pill, { backgroundColor: C.accentLight, borderColor: C.accentBorder }]} onPress={() => navigation.navigate('EditEvent', { event })}>
          <Edit2 size={15} color={C.accent} />
          <Text style={[styles.pillText, { color: C.accent }]}>{t('edit')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        {/* Info grid */}
        <View style={styles.grid}>
          <View style={[styles.infoCard, { backgroundColor: C.surface, shadowColor: C.shadow, flex: 1, marginRight: 8 }]}>
            <Text style={[styles.infoLabel, { color: C.textMuted }]}>DATE</Text>
            <Text style={[styles.infoVal, { color: C.text }]}>{fullDate}</Text>
          </View>
          <View style={[styles.infoCard, { backgroundColor: C.surface, shadowColor: C.shadow, flex: 1, marginLeft: 8 }]}>
            <Text style={[styles.infoLabel, { color: C.textMuted }]}>TIME</Text>
            <Text style={[styles.infoVal, { color: C.text }]}>{timeStr}</Text>
          </View>
        </View>

        {/* About */}
        <View style={[styles.aboutCard, { backgroundColor: C.surface, shadowColor: C.shadow }]}>
          <Text style={[styles.aboutTitle, { color: C.text }]}>{t('about')}</Text>
          <Text style={[styles.aboutBody, { color: C.textSecondary }]}>
            {event.description || 'No description provided. Check back closer to the date for more details.'}
          </Text>
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={[styles.cta, { backgroundColor: C.surface, borderTopColor: C.border }]}>
        <TouchableOpacity
          style={[styles.ctaBtn, { backgroundColor: C.accent }, isPending && { opacity: 0.7 }]}
          onPress={() => registerForEvent(event.id)}
          disabled={isPending}
          activeOpacity={0.85}
        >
          {isPending
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.ctaBtnText}>{t('register')} →</Text>
          }
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  backPill: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14 },
  backPillText: { fontWeight: '700', fontSize: 15 },
  hero: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingTop: 70, paddingBottom: 24, paddingHorizontal: 24,
    borderBottomWidth: 1,
  },
  dateBadge: {
    width: 64, height: 70, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, flexShrink: 0,
  },
  dateMonth: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  dateDay: { fontSize: 28, fontWeight: '800' },
  title: { fontSize: 20, fontWeight: '800', lineHeight: 26, marginBottom: 8 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: { fontSize: 13, fontWeight: '500', flex: 1 },
  actionRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 10, borderBottomWidth: 1,
  },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, borderWidth: 1,
  },
  pillText: { fontWeight: '700', fontSize: 14 },
  grid: { flexDirection: 'row', marginBottom: 14 },
  infoCard: {
    borderRadius: 20, padding: 18,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  infoLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 8 },
  infoVal: { fontSize: 14, fontWeight: '700', lineHeight: 20 },
  aboutCard: {
    borderRadius: 20, padding: 20,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  aboutTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12 },
  aboutBody: { fontSize: 15, lineHeight: 26 },
  cta: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 20, paddingBottom: 36, borderTopWidth: 1,
  },
  ctaBtn: {
    borderRadius: 18, height: 58, alignItems: 'center', justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 8,
  },
  ctaBtnText: { color: '#fff', fontWeight: '700', fontSize: 17, letterSpacing: 0.3 },
});
