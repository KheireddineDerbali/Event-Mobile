import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type Event = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string;
  createdAt: string;
  updatedAt: string;
};

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  EventDetail: { event: Event };
  CreateEvent: undefined;
  EditEvent: { event: Event };
};

export type MainTabsScreenProps = NativeStackScreenProps<RootStackParamList, 'MainTabs'>;
export type EventDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'EventDetail'>;
export type CreateEventScreenProps = NativeStackScreenProps<RootStackParamList, 'CreateEvent'>;
export type EditEventScreenProps = NativeStackScreenProps<RootStackParamList, 'EditEvent'>;
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, 'Register'>;
