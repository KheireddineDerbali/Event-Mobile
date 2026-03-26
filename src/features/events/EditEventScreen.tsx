import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { EditEventScreenProps } from '@/src/navigation/types';
import { useEditEvent } from '@/src/hooks/useEditEvent';

export const EditEventScreen = ({ route, navigation }: EditEventScreenProps) => {
  const { event } = route.params;
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description || '');
  const [date, setDate] = useState(event.date.split('T')[0]);
  const [location, setLocation] = useState(event.location);
  const [focused, setFocused] = useState<string | null>(null);

  const { mutate: editEvent, isPending } = useEditEvent();

  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    editEvent(
      { id: event.id, data: { title, description, date, location } },
      { onSuccess: () => navigation.goBack() }
    );
  };

  const field = (key: string, label: string, icon: string, props: any) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{icon}  {label}</Text>
      <TextInput
        style={[styles.fieldInput, focused === key && styles.fieldInputFocused]}
        placeholderTextColor="#94A3B8"
        onFocus={() => setFocused(key)}
        onBlur={() => setFocused(null)}
        {...props}
      />
    </View>
  );

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>EDITING</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>{event.title}</Text>
        </View>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 140, paddingTop: 8 }} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          {field('title', 'EVENT TITLE', '✦', { value: title, onChangeText: setTitle })}
          {field('desc', 'DESCRIPTION', '📝', {
            value: description, onChangeText: setDescription,
            multiline: true, style: [styles.fieldInput, styles.fieldTextarea, focused === 'desc' && styles.fieldInputFocused],
          })}
        </View>
        <View style={styles.gridRow}>
          <View style={[styles.card, { flex: 1, marginRight: 8 }]}>
            {field('date', 'DATE', '📅', { placeholder: 'YYYY-MM-DD', value: date, onChangeText: setDate })}
          </View>
          <View style={[styles.card, { flex: 1, marginLeft: 8 }]}>
            {field('loc', 'LOCATION', '📍', { value: location, onChangeText: setLocation })}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Save CTA */}
      <View style={styles.cta}>
        <TouchableOpacity style={[styles.ctaBtn, isPending && { opacity: 0.7 }]} onPress={handleSave} disabled={isPending} activeOpacity={0.85}>
          {isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.ctaBtnText}>Save Changes →</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFF' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 64, paddingBottom: 20,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  headerSub: { fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 1.5, marginBottom: 2 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', letterSpacing: -0.4, maxWidth: 240 },
  closeBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  closeText: { fontSize: 16, color: '#64748B', fontWeight: '700' },
  card: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2,
    marginBottom: 14,
  },
  gridRow: { flexDirection: 'row', marginBottom: 14 },
  fieldGroup: { marginBottom: 0 },
  fieldLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 1.2, marginBottom: 10 },
  fieldInput: {
    fontSize: 16, fontWeight: '600', color: '#0F172A',
    borderBottomWidth: 1.5, borderBottomColor: '#E2E8F0',
    paddingBottom: 10, paddingTop: 4,
  },
  fieldInputFocused: { borderBottomColor: '#2563EB' },
  fieldTextarea: { minHeight: 80, textAlignVertical: 'top' },
  cta: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', padding: 20, paddingBottom: 36,
    borderTopWidth: 1, borderTopColor: '#F1F5F9',
  },
  ctaBtn: {
    backgroundColor: '#0F172A', borderRadius: 18, height: 58, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 6,
  },
  ctaBtnText: { color: '#fff', fontWeight: '700', fontSize: 17 },
});
