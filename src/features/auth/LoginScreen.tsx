import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet,
} from 'react-native';
import { useAuthStore } from '../../stores/useAuthStore';
import { api } from '../../services/api';
import { LoginScreenProps } from '../../navigation/types';

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { login } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }
    try {
      setLoading(true);
      const res = await api.post('/auth/login', { email: email.trim().toLowerCase(), password });
      await login(res.data.accessToken);
    } catch (error: any) {
      Alert.alert('Login Failed', error.response?.data?.message || 'Invalid credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Top decorative block */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>✦</Text>
          </View>
          <Text style={styles.heroTitle}>Event Pro</Text>
          <Text style={styles.heroSubtitle}>Discover & manage extraordinary events</Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome back</Text>
          <Text style={styles.cardSub}>Sign in to your account</Text>

          {/* Email field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>EMAIL</Text>
            <View style={[styles.inputWrap, emailFocused && styles.inputFocused]}>
              <Text style={styles.inputIcon}>✉</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>
          </View>

          {/* Password field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>PASSWORD</Text>
            <View style={[styles.inputWrap, passwordFocused && styles.inputFocused]}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
            </View>
          </View>

          <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>Sign In →</Text>
            }
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.switchLink} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.switchLinkText}>
            Don't have an account? <Text style={styles.switchLinkAccent}>Create one</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFF' },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 },
  hero: { alignItems: 'center', marginBottom: 40 },
  heroBadge: {
    width: 64, height: 64, borderRadius: 20,
    backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#2563EB', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 10,
  },
  heroBadgeText: { fontSize: 28, color: '#fff' },
  heroTitle: { fontSize: 34, fontWeight: '800', color: '#0F172A', letterSpacing: -1 },
  heroSubtitle: { fontSize: 15, color: '#64748B', marginTop: 6, fontWeight: '500' },
  card: {
    backgroundColor: '#fff', borderRadius: 28, padding: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 20, elevation: 4,
    marginBottom: 24,
  },
  cardTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  cardSub: { fontSize: 14, color: '#64748B', fontWeight: '500', marginBottom: 28 },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 1.2, marginBottom: 8 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8FAFF', borderRadius: 14, paddingHorizontal: 16,
    borderWidth: 1.5, borderColor: '#E2E8F0',
  },
  inputFocused: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  inputIcon: { fontSize: 16, marginRight: 10, color: '#94A3B8' },
  input: { flex: 1, height: 52, fontSize: 15, color: '#0F172A', fontWeight: '500' },
  btn: {
    backgroundColor: '#2563EB', borderRadius: 16, height: 56,
    alignItems: 'center', justifyContent: 'center', marginTop: 8,
    shadowColor: '#2563EB', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  btnDisabled: { opacity: 0.7 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700', letterSpacing: 0.3 },
  switchLink: { alignItems: 'center', marginTop: 8 },
  switchLinkText: { color: '#64748B', fontSize: 14, fontWeight: '500' },
  switchLinkAccent: { color: '#2563EB', fontWeight: '700' },
});
