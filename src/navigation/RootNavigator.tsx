import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@/src/stores/useAuthStore';
import { RootStackParamList } from '@/src/navigation/types';

import { LoginScreen } from '@/src/features/auth/LoginScreen';
import { RegisterScreen } from '@/src/features/auth/RegisterScreen';
import { TabNavigator } from '@/src/navigation/TabNavigator';
import { EventDetailScreen } from '@/src/features/events/EventDetailScreen';
import { CreateEventScreen } from '@/src/features/events/CreateEventScreen';
import { EditEventScreen } from '@/src/features/events/EditEventScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { isAuthenticated, isLoading, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#ffffff' } }}>
        {isAuthenticated ? (
          <Stack.Group>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="EventDetail" component={EventDetailScreen} />
            <Stack.Screen name="CreateEvent" component={CreateEventScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="EditEvent" component={EditEventScreen} options={{ presentation: 'modal' }} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
