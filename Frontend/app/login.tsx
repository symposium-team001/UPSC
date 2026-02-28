import React, { useState } from 'react';
import { 
    View, Text, StyleSheet, TouchableOpacity, TextInput, 
    KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, Alert, ActivityIndicator 
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { useRouter } from 'expo-router';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
    const { theme, isDarkMode } = useTheme();
    const router = useRouter();
    
    // STATES
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false); 

    const brandColor = '#3D6D7A'; 

    // VALIDATION & LOGIN LOGIC
    const handleLogin = () => {
        const trimmedEmail = email.trim();

        // 1. Check for empty fields
        if (!trimmedEmail || !password) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert("Missing Info", "Fill in both email and password, Machi!");
            return;
        }

        // 2. Validate email format
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(trimmedEmail)) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Alert.alert("Invalid Email", "That doesn't look like a real email address.");
            return;
        }

        // 3. Check password length
        if (password.length < 6) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Alert.alert("Security Check", "Password must be at least 6 characters long.");
            return;
        }

        // ALL CHECKS PASSED: Proceed to Dashboard
        setLoading(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        setTimeout(() => {
            setLoading(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            
            // Navigate directly to the app
            router.replace('/(tabs)'); 
        }, 1500);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    {/* LOGO SECTION */}
                    <View style={s.logoContainer}>
                        <View style={[s.logoCircle, { backgroundColor: theme.surface }]}>
                            <Svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={brandColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <Path d="M22 10L12 5L2 10L12 15L22 10Z" />
                                <Path d="M6 12.5V16C6 16 8.5 19 12 19C15.5 19 18 16 18 16V12.5" />
                            </Svg>
                        </View>
                        <Text style={[s.brandName, { color: brandColor }]}>Ethora</Text>
                        <Text style={[s.brandTagline, { color: theme.textSecondary }]}>Empowering your IAS journey with AI</Text>
                    </View>

                    {/* FORM */}
                    <View style={s.formContainer}>
                        <Text style={[s.label, { color: isDarkMode ? '#FFF' : '#0A2540' }]}>Email Address</Text>
                        <View style={[s.inputWrap, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <Mail size={20} color={theme.textTertiary} />
                            <TextInput 
                                style={[s.input, { color: theme.text }]} 
                                placeholder="e.g. topper@upsc.com" 
                                placeholderTextColor="#A0AEC0"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                                editable={!loading}
                            />
                        </View>

                        <View style={s.passwordHeader}>
                            <Text style={[s.label, { color: isDarkMode ? '#FFF' : '#0A2540' }]}>Password</Text>
                            <TouchableOpacity onPress={() => router.push('/forgot-password')}>
                                <Text style={[s.forgotText, { color: brandColor }]}>Forgot?</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[s.inputWrap, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <Lock size={20} color={theme.textTertiary} />
                            <TextInput 
                                style={[s.input, { color: theme.text }]} 
                                placeholder="........" 
                                secureTextEntry={!showPassword}
                                placeholderTextColor="#A0AEC0"
                                autoCorrect={false}
                                value={password}
                                onChangeText={setPassword}
                                editable={!loading}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={20} color={brandColor} /> : <Eye size={20} color={theme.textTertiary} />}
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity 
                            style={[s.signInBtn, { backgroundColor: brandColor, opacity: loading ? 0.7 : 1 }]} 
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={s.signInBtnText}>Sign In</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* DIVIDER */}
                    <View style={s.divider}>
                        <View style={[s.line, { backgroundColor: theme.border }]} />
                        <Text style={{ color: theme.textTertiary, marginHorizontal: 10, fontWeight: '600' }}>OR</Text>
                        <View style={[s.line, { backgroundColor: theme.border }]} />
                    </View>

                    {/* SOCIAL ROW */}
                    <View style={s.socialRow}>
                        <TouchableOpacity style={[s.iconBtn, { borderColor: theme.border }]}>
                            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </Svg>
                        </TouchableOpacity>

                        <TouchableOpacity style={[s.iconBtn, { borderColor: theme.border }]}>
                            <Svg width="24" height="24" viewBox="0 0 256 315">
                                <Path 
                                    d="M213.803 167.03c.442 47.83 41.74 63.884 42.18 64.084-.353.995-6.55 22.526-21.505 44.413-12.923 18.914-26.324 37.738-47.465 38.126-20.764.387-27.426-12.286-51.193-12.286-23.766 0-31.147 12.067-50.806 12.833-20.376.765-35.343-20.302-48.373-39.284-26.662-38.834-47.07-109.68-19.458-157.72 13.713-23.834 38.25-38.966 64.733-39.354 20.376-.387 39.542 13.684 52.006 13.684 12.464 0 35.635-16.924 60.18-14.413 10.28.43 39.14 4.14 57.653 31.258-1.492.93-34.406 20.063-34.06 60.203M174.455 42.152C183.74 30.932 189.982 15.347 188.256 0c-13.16.53-29.073 8.76-38.508 19.824-8.46 9.77-15.86 25.61-13.88 40.71 14.673 1.142 29.53-7.258 38.587-18.382" 
                                    fill={isDarkMode ? "#FFF" : "#000"} 
                                />
                            </Svg>
                        </TouchableOpacity>

                        <TouchableOpacity style={[s.iconBtn, { borderColor: theme.border }]}>
                            <Svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2">
                                <Path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07c0 6.03 4.41 11.02 10.12 11.91v-8.43H7.08v-3.48h3.04V9.41c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.68.23 2.68.23v2.96h-1.51c-1.49 0-1.95.92-1.95 1.87v2.24h3.33l-.53 3.48h-2.8v8.43C19.59 23.09 24 18.1 24 12.07z" />
                            </Svg>
                        </TouchableOpacity>
                    </View>

                    {/* FOOTER */}
                    <View style={s.footer}>
                        <Text style={{ color: theme.textSecondary }}>New to Ethora? </Text>
                        <TouchableOpacity onPress={() => router.push('/createAccount')}>
                            <Text style={{ color: brandColor, fontWeight: '800' }}>Create Account</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    scrollContent: { flexGrow: 1, paddingHorizontal: 30, paddingTop: 60, paddingBottom: 40, alignItems: 'center' },
    logoContainer: { alignItems: 'center', marginBottom: 40 },
    logoCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    brandName: { fontSize: 32, fontWeight: '900' },
    brandTagline: { fontSize: 14, marginTop: 5, textAlign: 'center' },
    formContainer: { width: '100%', gap: 10 },
    label: { fontSize: 14, fontWeight: '700', marginLeft: 4 },
    inputWrap: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 58, borderRadius: 16, borderWidth: 1, gap: 12 },
    input: { flex: 1, fontSize: 16 },
    passwordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
    forgotText: { fontSize: 13, fontWeight: '700' },
    signInBtn: { height: 58, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
    signInBtnText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
    divider: { flexDirection: 'row', alignItems: 'center', width: '100%', marginVertical: 30 },
    line: { flex: 1, height: 1, opacity: 0.1 },
    socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 15, width: '100%' },
    iconBtn: { width: '30%', height: 55, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    footer: { flexDirection: 'row', marginTop: 30, alignItems: 'center' }
});