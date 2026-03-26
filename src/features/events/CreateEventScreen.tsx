import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  ActivityIndicator, StyleSheet, Image, Alert, Pressable,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useT } from '@/src/hooks/useT';
import {
  X, Type, AlignLeft, Calendar, Clock, MapPin, Image as ImageIcon,
} from 'lucide-react-native';
import { CreateEventScreenProps } from '@/src/navigation/types';
import { useCreateEvent } from '@/src/hooks/useCreateEvent';
import { useTheme } from '@/src/hooks/useTheme';
import { useSettingsStore } from '@/src/stores/useSettingsStore';

export const CreateEventScreen = ({ navigation }: CreateEventScreenProps) => {
  const { t, isRTL } = useT();
  const C = useTheme();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [coverUri, setCoverUri] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { mutate: createEvent, isPending } = useCreateEvent();
  const isValid = title.trim() && date.trim() && location.trim();

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { Alert.alert('Permission needed', 'Allow gallery access to pick a cover.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled) setCoverUri(result.assets[0].uri);
  };

  const handleCreate = () => {
    if (!isValid) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const isoDate = new Date(`${date}T${time || '00:00'}:00`).toISOString();
    createEvent(
      { title: title.trim(), description: description.trim(), date: isoDate, location: location.trim() },
      { onSuccess: () => navigation.goBack() }
    );
  };

  // Helper to clone lucide icon with props
  const renderIcon = (icon: React.ReactElement, size: number, color: string) =>
    React.cloneElement(icon as React.ReactElement<any>, { size, color });

  // Styled field component
  interface FieldProps {
    icon: React.ReactElement;
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    multiline?: boolean;
    keyboardType?: any;
  }
  const Field = ({ icon, label, value, onChangeText, placeholder, multiline = false, keyboardType = 'default' }: FieldProps) => (
    <View style={[styles.fieldBlock, { borderBottomColor: focusedField === label ? C.accent : C.border }]}>
      <View style={[styles.fieldHeader, isRTL && { flexDirection: 'row-reverse' }]}>
        {renderIcon(icon, 14, focusedField === label ? C.accent : C.textMuted)}
        <Text style={[styles.fieldLabel, { color: focusedField === label ? C.accent : C.textMuted, marginLeft: isRTL ? 0 : 6, marginRight: isRTL ? 6 : 0 }]}>{label}</Text>
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.textMuted}
        style={[styles.fieldInput, { color: C.text, textAlign: isRTL ? 'right' : 'left' }, multiline && styles.multilineInput]}
        multiline={multiline}
        keyboardType={keyboardType}
        onFocus={() => setFocusedField(label)}
        onBlur={() => setFocusedField(null)}
      />
    </View>
  );

  // Pressable Tile
  interface TileProps {
    icon: React.ReactElement;
    label: string;
    value: string;
    onPress: () => void;
    flex?: number;
  }
  const Tile = ({ icon, label, value, onPress, flex = 1 }: TileProps) => (
    <Pressable
      onPress={() => { Haptics.selectionAsync(); onPress(); }}
      style={({ pressed }) => [styles.tile, { backgroundColor: pressed ? C.accentLight : C.surface, flex, borderColor: C.border }]}
    >
      <View style={[styles.tileHeader, isRTL && { flexDirection: 'row-reverse' }]}>
        {renderIcon(icon, 14, C.accent)}
        <Text style={[styles.tileLabel, { color: C.textMuted, marginLeft: isRTL ? 0 : 6, marginRight: isRTL ? 6 : 0 }]}>{label}</Text>
      </View>
      <Text style={[styles.tileValue, { color: value ? C.text : C.textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
        {value || '—'}
      </Text>
    </Pressable>
  );

  return (
    <View style={[styles.root, { backgroundColor: C.bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.surface, borderBottomColor: C.border }]}>
        <View>
          <Text style={[styles.headerSub, { color: C.accent }]}>{t('newLabel')}</Text>
          <Text style={[styles.headerTitle, { color: C.text }]}>{t('createEvent')}</Text>
        </View>
        <TouchableOpacity style={[styles.closeBtn, { backgroundColor: C.bg }]} onPress={() => navigation.goBack()}>
          <X size={18} color={C.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Cover Photo Hero */}
        <TouchableOpacity
          style={[styles.coverTile, { backgroundColor: C.surface, borderColor: C.border }]}
          onPress={pickImage}
          activeOpacity={0.8}
        >
          {coverUri ? (
            <Image source={{ uri: coverUri }} style={styles.coverImage} />
          ) : (
            <View style={styles.coverPlaceholder}>
              <View style={[styles.coverIconCircle, { backgroundColor: C.accentLight }]}>
                <ImageIcon size={28} color={C.accent} />
              </View>
              <Text style={[styles.coverTitle, { color: C.text }]}>{t('coverPhoto')}</Text>
              <Text style={[styles.coverSub, { color: C.textMuted }]}>{t('tapToUpload')}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Title + Description Card */}
        <View style={[styles.card, { backgroundColor: C.surface, shadowColor: C.shadow }]}>
          <Field
            icon={<Type />}
            label={t('eventTitle').toUpperCase()}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Neo Design Summit 2026"
          />
          <Field
            icon={<AlignLeft />}
            label={t('description').toUpperCase()}
            value={description}
            onChangeText={setDescription}
            placeholder="What makes this event special?"
            multiline
          />
        </View>

        {/* Date + Time Tile Row */}
        <View style={styles.tileRow}>
          <Tile icon={<Calendar />} label={t('date').toUpperCase()} value={date} onPress={() => setFocusedField('date')} flex={1} />
          <View style={{ width: 12 }} />
          <Tile icon={<Clock />} label={t('time').toUpperCase()} value={time} onPress={() => setFocusedField('time')} flex={1} />
        </View>

        {/* Date input revealed */}
        {(focusedField === 'date' || date) && (
          <View style={[styles.card, { backgroundColor: C.surface, shadowColor: C.shadow }]}>
            <Field icon={<Calendar />} label={t('date').toUpperCase()} value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" keyboardType="numbers-and-punctuation" />
          </View>
        )}
        {(focusedField === 'time' || time) && (
          <View style={[styles.card, { backgroundColor: C.surface, shadowColor: C.shadow }]}>
            <Field icon={<Clock />} label={t('time').toUpperCase()} value={time} onChangeText={setTime} placeholder="HH:MM (24h)" keyboardType="numbers-and-punctuation" />
          </View>
        )}

        {/* Location Tile */}
        <Pressable
          onPress={() => { Haptics.selectionAsync(); setFocusedField('location'); }}
          style={({ pressed }) => [styles.tile, styles.tileFullWidth, { backgroundColor: pressed ? C.accentLight : C.surface, borderColor: C.border }]}
        >
          <View style={[styles.tileHeader, isRTL && { flexDirection: 'row-reverse' }]}>
            <MapPin size={14} color={C.accent} />
            <Text style={[styles.tileLabel, { color: C.textMuted, marginLeft: isRTL ? 0 : 6, marginRight: isRTL ? 6 : 0 }]}>{t('location').toUpperCase()}</Text>
          </View>
          <Text style={[styles.tileValue, { color: location ? C.text : C.textMuted }]}>{location || '—'}</Text>
        </Pressable>

        {(focusedField === 'location' || location) && (
          <View style={[styles.card, { backgroundColor: C.surface, shadowColor: C.shadow }]}>
            <Field icon={<MapPin />} label={t('location').toUpperCase()} value={location} onChangeText={setLocation} placeholder="City / Venue name" />
          </View>
        )}

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Sticky CTA */}
      <View style={[styles.ctaWrap, { backgroundColor: C.surface, borderTopColor: C.border }]}>
        <TouchableOpacity
          style={[styles.ctaBtn, { backgroundColor: isValid ? C.accent : C.textMuted }]}
          onPress={handleCreate}
          disabled={isPending || !isValid}
          activeOpacity={0.85}
        >
          {isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.ctaBtnText}>{t('publish')}</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 64, paddingBottom: 18, borderBottomWidth: 1,
  },
  headerSub: { fontSize: 11, fontWeight: '700', letterSpacing: 2, marginBottom: 2 },
  headerTitle: { fontSize: 26, fontWeight: '800', letterSpacing: -0.6 },
  closeBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: 20, paddingTop: 20 },
  coverTile: {
    borderRadius: 20, borderWidth: 1.5, borderStyle: 'dashed',
    overflow: 'hidden', marginBottom: 14, height: 180,
  },
  coverImage: { width: '100%', height: '100%' },
  coverPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  coverIconCircle: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  coverTitle: { fontSize: 15, fontWeight: '700' },
  coverSub: { fontSize: 12, fontWeight: '500' },
  card: {
    borderRadius: 20, padding: 20,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 20, elevation: 2,
    marginBottom: 14,
  },
  fieldBlock: { borderBottomWidth: 1.5, paddingBottom: 14, marginBottom: 14 },
  fieldHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  fieldLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
  fieldInput: { fontSize: 16, fontWeight: '600', paddingVertical: 4 },
  multilineInput: { minHeight: 72, textAlignVertical: 'top' },
  tileRow: { flexDirection: 'row', marginBottom: 14 },
  tile: {
    borderRadius: 20, borderWidth: 1, padding: 18,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 20, elevation: 2,
  },
  tileFullWidth: { marginBottom: 14 },
  tileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  tileLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
  tileValue: { fontSize: 16, fontWeight: '700' },
  ctaWrap: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 36, borderTopWidth: 1 },
  ctaBtn: {
    borderRadius: 18, height: 58, alignItems: 'center', justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 8,
  },
  ctaBtnText: { color: '#fff', fontWeight: '800', fontSize: 17, letterSpacing: 0.4 },
});
