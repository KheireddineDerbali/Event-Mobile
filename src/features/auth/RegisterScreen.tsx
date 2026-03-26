import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet,
} from 'react-native';
import { useAuthStore } from '../../stores/useAuthStore';
import { api } from '../../services/api';
import { RegisterScreenProps } from '../../navigation/types';

export const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const { login } = useAuthStore();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Missing Fields', 'Please fill all fields.'); return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.'); return;
    }
    try {
      setLoading(true);
      const res = await api.post('/auth/register', { name: name.trim(), email: email.trim().toLowerCase(), password });
      await login(res.data.accessToken);
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.message?.toString() || 'Could not register. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  const field = (label: string, icon: string, props: any) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, focused === label && styles.inputFocused]}>
        <Text style={styles.inputIcon}>{icon}</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor="#9CA3AF"
          onFocus={() => setFocused(label)}
          onBlur={() => setFocused(null)}
          {...props}
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Create Account</Text>
          <Text style={styles.heroSub}>Join thousands of event enthusiasts</Text>
        </View>

        <View style={styles.card}>
          {field('FULL NAME', '👤', { placeholder: 'Your name', value: name, onChangeText: setName, autoCapitalize: 'words' })}
          {field('EMAIL', '✉', { placeholder: 'you@example.com', value: email, onChangeText: setEmail, autoCapitalize: 'none', keyboardType: 'email-address' })}
          {field('PASSWORD', '🔒', { placeholder: '••••••••', value: password, onChangeText: setPassword, secureTextEntry: true })}

          <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleRegister} disabled={loading} activeOpacity={0.85}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Create Account →</Text>}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.switchLink} onPress={() => navigation.goBack()}>
          <Text style={styles.switchLinkText}>
            Already have an account? <Text style={styles.switchLinkAccent}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFF' },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  header: { marginBottom: 8 },
  backBtn: { alignSelf: 'flex-start', paddingVertical: 8 },
  backText: { color: '#2563EB', fontWeight: '700', fontSize: 15 },
  hero: { marginBottom: 32 },
  heroTitle: { fontSize: 32, fontWeight: '800', color: '#0F172A', letterSpacing: -0.8 },
  heroSub: { fontSize: 15, color: '#64748B', fontWeight: '500', marginTop: 6 },
  card: {
    backgroundColor: '#fff', borderRadius: 28, padding: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 20, elevation: 4,
    marginBottom: 24,
  },
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
  switchLink: { alignItems: 'center' },
  switchLinkText: { color: '#64748B', fontSize: 14, fontWeight: '500' },
  switchLinkAccent: { color: '#2563EB', fontWeight: '700' },
});
