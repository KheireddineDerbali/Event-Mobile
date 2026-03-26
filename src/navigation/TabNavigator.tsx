import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Compass, User } from 'lucide-react-native';
import { useT } from '@/src/hooks/useT';
import { EventsListScreen } from '@/src/features/events/EventsListScreen';
import { ProfileScreen } from '@/src/features/profile/ProfileScreen';
import { useTheme } from '@/src/hooks/useTheme';

const Tab = createBottomTabNavigator();

const TabIcon = ({
  Icon, label, focused, theme,
}: { Icon: any; label: string; focused: boolean; theme: any }) => (
  <View style={styles.tabItem}>
    <View style={[styles.iconWrap, focused && { backgroundColor: theme.accentLight }]}>
      <Icon size={24} color={focused ? theme.accent : theme.textMuted} strokeWidth={focused ? 2.5 : 1.8} />
    </View>
    <Text style={[styles.tabLabel, { color: focused ? theme.accent : theme.textMuted }, focused && styles.tabLabelActive]}>
      {label}
    </Text>
    {focused && <View style={[styles.activeDot, { backgroundColor: theme.accent }]} />}
  </View>
);

export const TabNavigator = () => {
  const { t } = useT();
  const C = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.tabBar, { backgroundColor: C.surface, shadowColor: C.shadow }],
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="EventsRoot"
        component={EventsListScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon Icon={Compass} label={t('events')} focused={focused} theme={C} />,
        }}
      />
      <Tab.Screen
        name="ProfileRoot"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon Icon={User} label={t('profile')} focused={focused} theme={C} />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 28 : 20,
    left: 20, right: 20,
    height: 80,
    borderRadius: 28,
    borderTopWidth: 0,
    elevation: 0,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
  },
  tabItem: { alignItems: 'center', justifyContent: 'center', minWidth: 80, paddingVertical: 4 },
  iconWrap: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  tabLabel: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  tabLabelActive: { fontWeight: '800' },
  activeDot: { width: 4, height: 4, borderRadius: 2, marginTop: 3 },
});
