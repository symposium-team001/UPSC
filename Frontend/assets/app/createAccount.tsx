import React, { useState } from 'react';
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
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { User, Mail, Lock, ChevronLeft, Eye, EyeOff } from 'lucide-react-native'; 
import { useTheme } from '../context/ThemeContext'; 

export default function CreateAccount() {
  const router = useRouter();
  const { theme, isDarkMode } = useTheme(); 
  
  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // UI States
  const [isFocused, setIsFocused] = useState<string | null>(null);
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });

  // Validation Logic
  const validateForm = () => {
    let isValid = true;
    let newErrors = { name: '', email: '', password: '' };

    if (!name.trim()) {
      newErrors.name = "Full name is required.";
      isValid = false;
    } else if (name.trim().length < 2) {
      newErrors.name = "Name is too short.";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address.";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignUp = () => {
    if (validateForm()) {
      Alert.alert(
        "Account Created!",
        "Welcome to SuperKalam.",
        [{ text: "Let's Go!", onPress: () => router.replace('/(tabs)') }]
      );
    }
  };

  return (
    // Added paddingTop: 20 here to the container
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background, paddingTop: 20 }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back button fixed to point back to login */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={28} color={isDarkMode ? theme.text : theme.accent} />
          </TouchableOpacity>
          
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: isDarkMode ? theme.text : theme.accent }]}>
                Create Account
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Join the Ethora community and start your journey.
            </Text>
          </View>

          <View style={styles.form}>
            {/* Full Name Field */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: isDarkMode ? theme.text : theme.accent }]}>Full Name</Text>
              <View style={[
                styles.inputWrapper, 
                { backgroundColor: theme.surface, borderColor: theme.border },
                isFocused === 'name' && { borderColor: theme.primary },
                errors.name ? styles.inputError : null
              ]}>
                <User size={20} color={isFocused === 'name' ? theme.primary : theme.textTertiary} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Enter your name"
                  placeholderTextColor={theme.textTertiary}
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (errors.name) setErrors({...errors, name: ''});
                  }}
                  onFocus={() => setIsFocused('name')}
                  onBlur={() => setIsFocused(null)}
                />
              </View>
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            </View>

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: isDarkMode ? theme.text : theme.accent }]}>Email Address</Text>
              <View style={[
                styles.inputWrapper, 
                { backgroundColor: theme.surface, borderColor: theme.border },
                isFocused === 'email' && { borderColor: theme.primary },
                errors.email ? styles.inputError : null
              ]}>
                <Mail size={20} color={isFocused === 'email' ? theme.primary : theme.textTertiary} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="name@example.com"
                  placeholderTextColor={theme.textTertiary}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({...errors, email: ''});
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setIsFocused('email')}
                  onBlur={() => setIsFocused(null)}
                />
              </View>
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: isDarkMode ? theme.text : theme.accent }]}>Password</Text>
              <View style={[
                styles.inputWrapper, 
                { backgroundColor: theme.surface, borderColor: theme.border },
                isFocused === 'password' && { borderColor: theme.primary },
                errors.password ? styles.inputError : null
              ]}>
                <Lock size={20} color={isFocused === 'password' ? theme.primary : theme.textTertiary} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="******"
                  placeholderTextColor={theme.textTertiary}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors({...errors, password: ''});
                  }}
                  secureTextEntry={!isPasswordVisible}
                  onFocus={() => setIsFocused('password')}
                  onBlur={() => setIsFocused(null)}
                />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                  {isPasswordVisible ? 
                    <EyeOff size={20} color={theme.textTertiary} /> : 
                    <Eye size={20} color={theme.textTertiary} />
                  }
                </TouchableOpacity>
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            <TouchableOpacity 
              style={[
                styles.signUpButton, 
                { backgroundColor: theme.primary, shadowColor: theme.primary },
                (!name || !email || !password) && styles.buttonDisabled
              ]} 
              onPress={handleSignUp}
              activeOpacity={0.8}
            >
              <Text style={[styles.signUpButtonText, { color: theme.textLight }]}>Create Account</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => router.replace('/login')}
              style={styles.loginLink}
            >
              <Text style={[styles.loginText, { color: theme.textSecondary }]}>
                Already have an account? <Text style={[styles.loginTextBold, { color: theme.primary }]}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 25, paddingTop: 20, paddingBottom: 40 },
  backButton: { marginBottom: 20, marginLeft: -10, width: 40 },
  headerContainer: { marginBottom: 35 },
  title: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 16, marginTop: 8, lineHeight: 22 },
  form: { width: '100%' },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '700', marginBottom: 8, marginLeft: 4 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 58,
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 15,
  },
  input: { flex: 1, height: '100%', marginLeft: 12, fontSize: 16 },
  inputError: { borderColor: '#EF4444', backgroundColor: '#FFF8F8' },
  errorText: { color: '#EF4444', fontSize: 12, fontWeight: '600', marginTop: 6, marginLeft: 4 },
  signUpButton: {
    height: 58,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  signUpButtonText: { fontSize: 18, fontWeight: 'bold' },
  loginLink: { marginTop: 25, alignItems: 'center' },
  loginText: { fontSize: 15 },
  loginTextBold: { fontWeight: 'bold' },
});