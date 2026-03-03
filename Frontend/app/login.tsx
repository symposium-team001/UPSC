import React, { useState, useEffect, useRef } from 'react';
import { 
    View, Text, StyleSheet, TouchableOpacity, TextInput, 
    KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, 
    Alert, ActivityIndicator, Animated, Dimensions 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { Svg, Path } from 'react-native-svg'; 
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const isMobile = width < 450;

export default function LoginScreen() {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(15)).current;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false); 

    const brandColor = '#4A767D';

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true })
        ]).start();
    }, []);

    const handleLogin = () => {
        if (!email.trim() || !password) {
            if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert("Missing Info", "Fill in both fields!");
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.replace('/(tabs)'); 
        }, 1200);
    };

    return (
        <SafeAreaView style={s.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                style={{ flex: 1 }}
            >
                <ScrollView 
                    contentContainerStyle={s.scrollContent} 
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >
                    <Animated.View style={[
                        s.card, 
                        { 
                            opacity: fadeAnim, 
                            transform: [{ translateY: slideAnim }],
                            padding: isMobile ? 24 : 45,
                        }
                    ]}>
                        <Text style={[s.cardTitle, { fontSize: isMobile ? 24 : 32 }]}>Welcome Back</Text>
                        <Text style={s.cardSubtitle}>Sign in to your workspace</Text>

                        <View style={s.form}>
                            <Text style={s.label}>Email Address</Text>
                            <View style={[s.inputWrap, { height: isMobile ? 50 : 56 }]}>
                                <Mail size={16} color="#94A3B8" style={{ marginRight: 10 }} />
                                <TextInput 
                                    style={s.input} 
                                    placeholder="name@company.com" 
                                    placeholderTextColor="#94A3B8"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                    editable={!loading}
                                />
                            </View>

                            <View style={s.passwordHeader}>
                                <Text style={s.label}>Password</Text>
                                <TouchableOpacity onPress={() => router.push('/forgot-password')}>
                                    <Text style={[s.forgotText, { color: brandColor }]}>Forgot?</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[s.inputWrap, { height: isMobile ? 50 : 56, marginBottom: 20 }]}>
                                <Lock size={16} color="#94A3B8" style={{ marginRight: 10 }} />
                                <TextInput 
                                    style={s.input} 
                                    placeholder="••••••••" 
                                    secureTextEntry={!showPassword}
                                    placeholderTextColor="#94A3B8"
                                    autoCorrect={false}
                                    value={password}
                                    onChangeText={setPassword}
                                    editable={!loading}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={18} color={brandColor} /> : <Eye size={18} color="#94A3B8" />}
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity 
                                style={[s.signInBtn, { backgroundColor: brandColor, height: isMobile ? 50 : 56 }]} 
                                onPress={handleLogin}
                                disabled={loading}
                            >
                                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={s.signInBtnText}>Sign In</Text>}
                            </TouchableOpacity>
                        </View>

                        <View style={s.dividerRow}>
                            <View style={s.line} /><Text style={s.dividerText}>OR</Text><View style={s.line} />
                        </View>

                        <View style={s.socialRow}>
                            {['google', 'apple', 'facebook'].map((platform, index) => (
                                <TouchableOpacity key={index} style={[s.socialBtn, { height: isMobile ? 48 : 52 }]}>
                                    {platform === 'google' && <Svg width="18" height="18" viewBox="0 0 24 24"><Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><Path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></Svg>}
                                    {platform === 'apple' && <Svg width="18" height="18" viewBox="0 0 256 315"><Path d="M213.803 167.03c.442 47.83 41.74 63.884 42.18 64.084-.353.995-6.55 22.526-21.505 44.413-12.923 18.914-26.324 37.738-47.465 38.126-20.764.387-27.426-12.286-51.193-12.286-23.766 0-31.147 12.067-50.806 12.833-20.376.765-35.343-20.302-48.373-39.284-26.662-38.834-47.07-109.68-19.458-157.72 13.713-23.834 38.25-38.966 64.733-39.354 20.376-.387 39.542 13.684 52.006 13.684 12.464 0 35.635-16.924 60.18-14.413 10.28.43 39.14 4.14 57.653 31.258-1.492.93-34.406 20.063-34.06 60.203M174.455 42.152C183.74 30.932 189.982 15.347 188.256 0c-13.16.53-29.073 8.76-38.508 19.824-8.46 9.77-15.86 25.61-13.88 40.71 14.673 1.142 29.53-7.258 38.587-18.382" fill="#000"/></Svg>}
                                    {platform === 'facebook' && <Svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><Path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07c0 6.03 4.41 11.02 10.12 11.91v-8.43H7.08v-3.48h3.04V9.41c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.68.23 2.68.23v2.96h-1.51c-1.49 0-1.95.92-1.95 1.87v2.24h3.33l-.53 3.48h-2.8v8.43C19.59 23.09 24 18.1 24 12.07z" /></Svg>}
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={s.footer}>
                            <Text style={{ color: '#64748B', fontSize: 13 }}>New here? </Text>
                            <TouchableOpacity onPress={() => router.push('/createAccount')}>
                                <Text style={{ color: brandColor, fontWeight: '700', fontSize: 13 }}>Create Account</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>

                    <Text style={s.copyright}>© 2026 Digital Systems</Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    scrollContent: { 
        flexGrow: 1, 
        justifyContent: 'center', // This centers the card vertically
        alignItems: 'center', 
        paddingVertical: 20 
    },
    card: { 
        width: isMobile ? '90%' : '100%',
        maxWidth: 480, 
        backgroundColor: '#FFFFFF', 
        borderRadius: isMobile ? 24 : 32, 
        borderWidth: 1,
        borderColor: '#E2E8F0',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20 },
            android: { elevation: 6 },
            web: { boxShadow: '0px 10px 40px rgba(0,0,0,0.04)' }
        })
    },
    cardTitle: { fontWeight: '900', color: '#0F172A', textAlign: 'center', letterSpacing: -0.5 },
    cardSubtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', marginTop: 6, marginBottom: 25 },
    form: { width: '100%' },
    label: { fontSize: 11, fontWeight: '800', color: '#0F172A', marginBottom: 6, marginLeft: 2, textTransform: 'uppercase' },
    inputWrap: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 16, 
        borderRadius: 12, 
        borderWidth: 1.5, 
        borderColor: '#F1F5F9', 
        backgroundColor: '#F8FAFC',
        marginBottom: 12
    },
    input: { flex: 1, fontSize: 15, color: '#0F172A' },
    passwordHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    forgotText: { fontSize: 11, fontWeight: '700' },
    signInBtn: { borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    signInBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
    dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
    line: { flex: 1, height: 1, backgroundColor: '#F1F5F9' },
    dividerText: { fontSize: 10, fontWeight: '800', color: '#CBD5E1', marginHorizontal: 12 },
    socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 20 },
    socialBtn: { 
        flex: 1, borderRadius: 12, borderWidth: 1.5, borderColor: '#F1F5F9', 
        alignItems: 'center', justifyContent: 'center' 
    },
    footer: { flexDirection: 'row', justifyContent: 'center' },
    copyright: { fontSize: 10, color: '#CBD5E1', fontWeight: '600', marginTop: 20 }
});