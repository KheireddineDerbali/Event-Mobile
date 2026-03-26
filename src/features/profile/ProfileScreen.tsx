import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, StyleSheet } from 'react-native';
import { User, Bell, Globe, Moon, ChevronRight, LogOut } from 'lucide-react-native';
import { useAuthStore } from '@/src/stores/useAuthStore';
import { useSettingsStore } from '@/src/stores/useSettingsStore';
import { useTheme } from '@/src/hooks/useTheme';
import { useT, LANGUAGES } from '@/src/hooks/useT';

export const ProfileScreen = () => {
  const { t } = useT();
  const logout = useAuthStore(s => s.logout);
  const { isDark, toggleDark, language, setLanguage } = useSettingsStore();
  const C = useTheme();

  return (
    <ScrollView style={[styles.root, { backgroundColor: C.bg }]} contentContainerStyle={{ paddingBottom: 160 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerSub, { color: C.accent }]}>{t('account').toUpperCase()}</Text>
        <Text style={[styles.headerTitle, { color: C.text }]}>{t('profile')}</Text>
      </View>

      {/* Avatar Card */}
      <View style={[styles.avatarCard, { backgroundColor: C.surface, shadowColor: C.shadow }]}>
        <View style={[styles.avatarRing, { backgroundColor: C.accentLight, borderColor: C.accentBorder }]}>
          <User size={36} color={C.accent} />
        </View>
        <View style={{ flex: 1, marginLeft: 16 }}>
          <Text style={[styles.avatarName, { color: C.text }]}>Event Explorer</Text>
          <View style={[styles.avatarBadge, { backgroundColor: C.accentLight }]}>
            <Text style={[styles.avatarBadgeText, { color: C.accent }]}>{t('proMember')}</Text>
          </View>
        </View>
      </View>

      {/* Appearance */}
      <Text style={[styles.sectionLabel, { color: C.textMuted }]}>{t('appearance').toUpperCase()}</Text>
      <View style={[styles.settingsCard, { backgroundColor: C.surface, shadowColor: C.shadow }]}>
        <View style={styles.menuRow}>
          <View style={[styles.menuIcon, { backgroundColor: C.bg }]}>
            <Moon size={18} color={C.accent} />
          </View>
          <Text style={[styles.menuLabel, { color: C.text, flex: 1 }]}>{t('darkMode')}</Text>
          <Switch
            value={isDark}
            onValueChange={toggleDark}
            trackColor={{ false: '#E2E8F0', true: C.accentBorder }}
            thumbColor={isDark ? C.accent : '#fff'}
            style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
          />
        </View>
      </View>

      {/* Language */}
      <Text style={[styles.sectionLabel, { color: C.textMuted }]}>{t('language').toUpperCase()}</Text>
      <View style={[styles.settingsCard, { backgroundColor: C.surface, shadowColor: C.shadow }]}>
        {LANGUAGES.map((lang, idx) => (
          <TouchableOpacity
            key={lang.code}
            style={[styles.menuRow, idx < LANGUAGES.length - 1 && { borderBottomWidth: 1, borderBottomColor: C.border }]}
            onPress={() => setLanguage(lang.code)}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIcon, { backgroundColor: C.bg }]}>
              <Globe size={18} color={C.accent} />
            </View>
            <Text style={[styles.menuLabel, { color: C.text, flex: 1 }]}>{lang.flag}  {lang.label}</Text>
            {language === lang.code && (
              <View style={[styles.activeDot, { backgroundColor: C.accent }]} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Settings */}
      <Text style={[styles.sectionLabel, { color: C.textMuted }]}>{t('settings').toUpperCase()}</Text>
      <View style={[styles.settingsCard, { backgroundColor: C.surface, shadowColor: C.shadow }]}>
        {[
          { icon: <Bell size={18} color={C.accent} />, label: t('notifications'), sub: 'Manage alerts' },
          { icon: <User size={18} color={C.accent} />, label: t('myRegistrations'), sub: 'Events you joined' },
        ].map((item, idx, arr) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.menuRow, idx < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: C.border }]}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIcon, { backgroundColor: C.bg }]}>{item.icon}</View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.menuLabel, { color: C.text }]}>{item.label}</Text>
              <Text style={[styles.menuSub, { color: C.textMuted }]}>{item.sub}</Text>
            </View>
            <ChevronRight size={18} color={C.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Sign Out */}
      <TouchableOpacity style={styles.logoutRow} onPress={logout} activeOpacity={0.7}>
        <LogOut size={16} color={C.danger} style={{ marginRight: 8 }} />
        <Text style={[styles.logoutText, { color: C.danger }]}>{t('signOut')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 60 },
  header: { paddingHorizontal: 24, paddingBottom: 24 },
  headerSub: { fontSize: 11, fontWeight: '700', letterSpacing: 2, marginBottom: 2 },
  headerTitle: { fontSize: 32, fontWeight: '800', letterSpacing: -0.8 },
  avatarCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 20, borderRadius: 24, padding: 20,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 16, elevation: 3,
    marginBottom: 28,
  },
  avatarRing: {
    width: 72, height: 72, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1.5,
  },
  avatarName: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
  avatarBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  avatarBadgeText: { fontWeight: '700', fontSize: 12 },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginHorizontal: 24, marginBottom: 10 },
  settingsCard: {
    marginHorizontal: 20, borderRadius: 24, overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 16, elevation: 3,
    marginBottom: 22,
  },
  menuRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16,
    minHeight: 60,
  },
  menuIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  menuLabel: { fontSize: 15, fontWeight: '700' },
  menuSub: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  activeDot: { width: 8, height: 8, borderRadius: 4 },
  logoutRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20 },
  logoutText: { fontWeight: '700', fontSize: 15 },
});
