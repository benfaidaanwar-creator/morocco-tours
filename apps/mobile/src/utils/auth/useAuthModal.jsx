import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { getSupabase } from '../supabase';
import { useAuthModal, useAuthStore } from './store';

export const AuthModal = () => {
  const { isOpen, mode, close } = useAuthModal();
  const { auth, setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isSignup = mode === 'signup';

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const supabase = getSupabase();
      const result = isSignup
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (result.error) throw result.error;

      const session = result.data.session;
      if (session) {
        setAuth({
          jwt: session.access_token,
          user: session.user,
          session,
        });
        close();
      } else if (isSignup) {
        setError('Check your email to confirm your account before signing in.');
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={isOpen && !auth} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.45)',
          justifyContent: 'center',
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 20,
            gap: 14,
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827' }}>
            {isSignup ? 'Create account' : 'Sign in'}
          </Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={{
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 10,
              padding: 12,
            }}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={{
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 10,
              padding: 12,
            }}
          />
          {error ? <Text style={{ color: '#DC2626' }}>{error}</Text> : null}
          <Pressable
            disabled={loading || !email || !password}
            onPress={handleSubmit}
            style={{
              alignItems: 'center',
              backgroundColor: '#C8A96E',
              borderRadius: 10,
              opacity: loading || !email || !password ? 0.6 : 1,
              padding: 13,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: '#fff', fontWeight: '700' }}>
                {isSignup ? 'Sign up' : 'Sign in'}
              </Text>
            )}
          </Pressable>
          <Pressable onPress={close} style={{ alignItems: 'center', padding: 8 }}>
            <Text style={{ color: '#6B7280' }}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default useAuthModal;
