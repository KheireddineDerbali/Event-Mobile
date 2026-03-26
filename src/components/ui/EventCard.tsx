import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Event } from '../../navigation/types';
import { MapPin } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

export const EventCard = ({ event, onPress }: EventCardProps) => {
  const C = useTheme();
  const month = new Date(event.date).toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const day = new Date(event.date).getDate();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: C.surface, shadowColor: C.shadow }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.dateBadge, { backgroundColor: C.accentLight, borderColor: C.accentBorder }]}>
        <Text style={[styles.dateMonth, { color: C.accent }]}>{month}</Text>
        <Text style={[styles.dateDay, { color: C.text }]}>{day}</Text>
      </View>

      <View style={styles.info}>
        <Text style={[styles.title, { color: C.text }]} numberOfLines={2}>{event.title}</Text>
        <View style={styles.locationRow}>
          <MapPin size={12} color={C.textMuted} style={{ marginRight: 4 }} />
          <Text style={[styles.location, { color: C.textSecondary }]} numberOfLines={1}>{event.location}</Text>
        </View>
      </View>

      <View style={[styles.chevronWrap, { backgroundColor: C.bg }]}>
        <Text style={[styles.chevron, { color: C.textMuted }]}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center',
    marginBottom: 14,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 16, elevation: 3,
  },
  dateBadge: {
    width: 56, height: 60, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
    marginRight: 16, borderWidth: 1,
  },
  dateMonth: { fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  dateDay: { fontSize: 24, fontWeight: '800', lineHeight: 28 },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 6, lineHeight: 22 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  location: { fontSize: 13, fontWeight: '500', flex: 1 },
  chevronWrap: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  chevron: { fontSize: 22, fontWeight: '300', lineHeight: 26 },
});
