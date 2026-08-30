import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { triggerHaptic } from '@/utils/sensory';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose }) => {
  const { isConfigured, signInWithEmail, signUpWithEmail, resetPassword, continueAsGuest } =
    useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const switchMode = (newMode: 'signin' | 'signup' | 'forgot') => {
    triggerHaptic('light');
    setMode(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (mode === 'forgot') {
      setLoading(true);
      setErrorMessage(null);
      const { error } = await resetPassword(email);
      setLoading(false);
      if (error) {
        setErrorMessage(error.message || 'Failed to send reset link.');
      } else {
        setSuccessMessage('Password reset link sent! Check your inbox.');
      }
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    if (mode === 'signin') {
      const { error } = await signInWithEmail(email, password);
      setLoading(false);
      if (error) {
        setErrorMessage(error.message || 'Failed to sign in. Please verify your credentials.');
      } else {
        triggerHaptic('success');
        onClose();
      }
    } else {
      const { error, user } = await signUpWithEmail(email, password);
      setLoading(false);
      if (error) {
        setErrorMessage(error.message || 'Failed to create account.');
      } else if (user && !user.confirmed_at) {
        setSuccessMessage('Account created! Please check your email inbox to confirm your account.');
      } else {
        triggerHaptic('success');
        onClose();
      }
    }
  };

  const handleGuest = async () => {
    triggerHaptic('light');
    await continueAsGuest();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.titleGroup}>
              <Ionicons
                name={mode === 'forgot' ? 'key-outline' : 'cloud-done'}
                size={24}
                color="#4F46E5"
              />
              <Text style={styles.title}>
                {mode === 'signin'
                  ? 'Welcome Back'
                  : mode === 'signup'
                  ? 'Create Account'
                  : 'Reset Password'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#0F172A" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.subtitle}>
              {mode === 'signin'
                ? 'Sign in to sync your habits, streaks, and challenges to Supabase.'
                : mode === 'signup'
                ? 'Sign up to backup your progress and access HabitPulse from any device.'
                : 'Enter your email address to receive a secure password recovery link.'}
            </Text>

            {/* Supabase Not Configured Warning */}
            {!isConfigured && (
              <View style={styles.configNotice}>
                <Ionicons name="information-circle" size={20} color="#D97706" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.configNoticeTitle}>Offline Local Cache Mode</Text>
                  <Text style={styles.configNoticeText}>
                    All features are active locally! To connect live cloud auth, copy .env.example to .env and add your Supabase URL & Anon Key.
                  </Text>
                </View>
              </View>
            )}

            {/* Mode Switch Tabs */}
            {mode !== 'forgot' && (
              <View style={styles.tabSelector}>
                <TouchableOpacity
                  style={[styles.tabBtn, mode === 'signin' && styles.tabBtnActive]}
                  onPress={() => switchMode('signin')}>
                  <Text style={[styles.tabBtnText, mode === 'signin' && styles.tabBtnTextActive]}>
                    Sign In
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tabBtn, mode === 'signup' && styles.tabBtnActive]}
                  onPress={() => switchMode('signup')}>
                  <Text style={[styles.tabBtnText, mode === 'signup' && styles.tabBtnTextActive]}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Error Banner */}
            {errorMessage && (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={18} color="#DC2626" />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            {/* Success Banner */}
            {successMessage && (
              <View style={styles.successBanner}>
                <Ionicons name="checkmark-circle" size={18} color="#059669" />
                <Text style={styles.successText}>{successMessage}</Text>
              </View>
            )}

            {/* Email Field */}
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            {/* Password Fields */}
            {mode !== 'forgot' && (
              <>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Min 6 characters"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeBtn}
                    onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="#64748B"
                    />
                  </TouchableOpacity>
                </View>

                {mode === 'signup' && (
                  <>
                    <Text style={styles.inputLabel}>Confirm Password</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Re-enter password"
                      placeholderTextColor="#94A3B8"
                      secureTextEntry={!showPassword}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                  </>
                )}

                {mode === 'signin' && (
                  <TouchableOpacity
                    style={styles.forgotBtn}
                    onPress={() => switchMode('forgot')}>
                    <Text style={styles.forgotBtnText}>Forgot password?</Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            {/* Action Submit */}
            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              activeOpacity={0.8}
              disabled={loading}
              onPress={handleSubmit}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitBtnText}>
                  {mode === 'signin'
                    ? 'Sign In & Sync ☁️'
                    : mode === 'signup'
                    ? 'Create Account 🚀'
                    : 'Send Recovery Link ✉️'}
                </Text>
              )}
            </TouchableOpacity>

            {mode === 'forgot' && (
              <TouchableOpacity
                style={styles.backToSignInBtn}
                onPress={() => switchMode('signin')}>
                <Ionicons name="arrow-back" size={16} color="#4F46E5" />
                <Text style={styles.backToSignInText}>Back to Sign In</Text>
              </TouchableOpacity>
            )}

            {/* Continue as Guest */}
            <TouchableOpacity style={styles.guestBtn} activeOpacity={0.8} onPress={handleGuest}>
              <Text style={styles.guestBtnText}>Continue in Offline / Guest Mode</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 36,
    maxHeight: '90%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  subtitle: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 14,
  },
  configNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  configNoticeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
  },
  configNoticeText: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 2,
    lineHeight: 15,
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#0F172A',
    fontWeight: '800',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
    flex: 1,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  successText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 10,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  eyeBtn: {
    position: 'absolute',
    right: 14,
    padding: 4,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotBtnText: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  backToSignInBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    marginTop: 6,
  },
  backToSignInText: {
    fontSize: 13,
    color: '#4F46E5',
    fontWeight: '700',
  },
  guestBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  guestBtnText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '700',
  },
});
