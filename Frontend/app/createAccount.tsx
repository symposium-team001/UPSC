import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Animated,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react-native'; 
import { useTheme } from '../context/ThemeContext'; 
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const isMobile = width < 450;

export default function CreateAccount() {
  const router = useRouter();
  const { theme, isDarkMode } = useTheme(); 
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(15)).current;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState<string | null>(null);

  const brandColor = '#4A7C82';

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true })
    ]).start();
  }, []);

  const handleSignUp = () => {
    if (!name || !email || !password) {
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        router.replace('/(tabs)'); 
    }, 1500);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? theme.background : '#F8FAFC' }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            keyboardShouldPersistTaps="handled" 
            showsVerticalScrollIndicator={false}
            bounces={false}
        >
          
          <Animated.View 
            style={[
              styles.card, 
              { 
                backgroundColor: theme.surface,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
                padding: isMobile ? 24 : 45,
                borderColor: isDarkMode ? '#333' : '#E2E8F0' 
              }
            ]}
          >
            <View style={styles.headerContainer}>
              <Text style={[styles.title, { color: theme.text, fontSize: isMobile ? 24 : 32 }]}>
                Create Account
              </Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Join the Ethora community today
              </Text>
            </View>

            <View style={styles.form}>
              {/* Full Name */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>Full Name</Text>
                <View style={[
                    styles.inputWrapper, 
                    { 
                        height: isMobile ? 50 : 56,
                        borderColor: isFocused === 'name' ? brandColor : (isDarkMode ? '#444' : '#F1F5F9'),
                        backgroundColor: isDarkMode ? theme.background : '#F8FAFC'
                    }
                ]}>
                  <User size={16} color={isFocused === 'name' ? brandColor : theme.textTertiary} style={styles.icon} />
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder="Enter your full name"
                    placeholderTextColor={theme.textTertiary}
                    onFocus={() => setIsFocused('name')}
                    onBlur={() => setIsFocused(null)}
                    onChangeText={setName}
                  />
                </View>
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>Email Address</Text>
                <View style={[
                    styles.inputWrapper, 
                    { 
                        height: isMobile ? 50 : 56,
                        borderColor: isFocused === 'email' ? brandColor : (isDarkMode ? '#444' : '#F1F5F9'),
                        backgroundColor: isDarkMode ? theme.background : '#F8FAFC'
                    }
                ]}>
                  <Mail size={16} color={isFocused === 'email' ? brandColor : theme.textTertiary} style={styles.icon} />
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder="email@example.com"
                    placeholderTextColor={theme.textTertiary}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onFocus={() => setIsFocused('email')}
                    onBlur={() => setIsFocused(null)}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>Password</Text>
                <View style={[
                    styles.inputWrapper, 
                    { 
                        height: isMobile ? 50 : 56,
                        borderColor: isFocused === 'password' ? brandColor : (isDarkMode ? '#444' : '#F1F5F9'),
                        backgroundColor: isDarkMode ? theme.background : '#F8FAFC'
                    }
                ]}>
                  <Lock size={16} color={isFocused === 'password' ? brandColor : theme.textTertiary} style={styles.icon} />
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder="Create a strong password"
                    placeholderTextColor={theme.textTertiary}
                    secureTextEntry={!isPasswordVisible}
                    onFocus={() => setIsFocused('password')}
                    onBlur={() => setIsFocused(null)}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                    {isPasswordVisible ? <EyeOff size={18} color={theme.textTertiary} /> : <Eye size={18} color={theme.textTertiary} />}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.signUpButton, { backgroundColor: brandColor, height: isMobile ? 50 : 56 }]} 
                activeOpacity={0.8}
                onPress={handleSignUp}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.signUpButtonText}>Create Account</Text>}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.replace('/login')} style={styles.loginLink}>
                <Text style={[styles.loginText, { color: theme.textSecondary }]}>
                  Already have an account? <Text style={{ color: brandColor, fontWeight: '700' }}>Log in</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
          
          <Text style={[styles.copyright, { color: theme.textTertiary }]}>© 2026 Ethora Systems</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  card: {
    borderRadius: isMobile ? 24 : 32,
    width: isMobile ? '92%' : '100%',
    maxWidth: 480,
    alignSelf: 'center',
    borderWidth: 1,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20 },
      android: { elevation: 6 },
      web: { boxShadow: '0px 10px 40px rgba(0,0,0,0.04)' }
    }),
  },
  headerContainer: { alignItems: 'center', marginBottom: 25 },
  title: { fontWeight: '900', textAlign: 'center', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, marginTop: 4, textAlign: 'center' },
  form: { width: '100%' },
  inputGroup: { marginBottom: 12 },
  label: { fontSize: 11, fontWeight: '800', marginBottom: 6, marginLeft: 2, textTransform: 'uppercase' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15 },
  signUpButton: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  signUpButtonText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  loginLink: { marginTop: 22, alignItems: 'center' },
  loginText: { fontSize: 13 },
  copyright: { fontSize: 10, fontWeight: '600', marginTop: 20 }
});