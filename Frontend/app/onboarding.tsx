import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { GraduationCap, BarChart3, ArrowRight } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
    const router = useRouter();
    const { theme, isDarkMode } = useTheme();
    const slideUp = useRef(new Animated.Value(30)).current;
    const fade = useRef(new Animated.Value(0)).current;

    // Get Greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning, Aspirant!";
        if (hour < 17) return "Good Afternoon, Aspirant!";
        return "Good Evening, Aspirant!";
    };

    useEffect(() => {
        Animated.parallel([
            Animated.timing(slideUp, { toValue: 0, duration: 800, useNativeDriver: true }),
            Animated.timing(fade, { toValue: 1, duration: 800, useNativeDriver: true })
        ]).start();
    }, []);

    const handleStart = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace('/login');
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Animated.View style={[styles.content, { opacity: fade, transform: [{ translateY: slideUp }] }]}>
                
                <View style={styles.iconWrapper}>
                    <View style={[styles.iconCircle, { backgroundColor: theme.primary, opacity: isDarkMode ? 0.15 : 0.1 }]} />
                    <GraduationCap size={100} color={theme.primary} strokeWidth={1.2} />
                    
                    <View style={[styles.accentIcon, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }]}>
                         <BarChart3 size={28} color={theme.primary} strokeWidth={2} />
                    </View>
                </View>

                <Text style={[styles.title, { color: theme.text }]}>
                    {getGreeting()}
                </Text>
                
                <Text style={[styles.description, { color: theme.textSecondary }]}>
                    "The best way to predict your UPSC result is to create it."{"\n\n"}
                    Ethora is your personal mentor, ready to guide your journey to LBSNAA.
                </Text>

                <TouchableOpacity 
                    style={[styles.button, { backgroundColor: theme.primary, shadowColor: theme.primary }]} 
                    activeOpacity={0.9}
                    onPress={handleStart}
                >
                    <Text style={[styles.buttonText, { color: '#FFF' }]}>Enter Workspace</Text>
                    <ArrowRight size={20} color="#FFF" style={{ marginLeft: 10 }} />
                </TouchableOpacity>

                <Text style={[styles.footerText, { color: theme.textTertiary }]}>
                    Join 10,000+ aspirants today
                </Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    content: { alignItems: 'center', paddingHorizontal: 30, width: '100%' },
    iconWrapper: { width: 180, height: 180, alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
    iconCircle: { position: 'absolute', width: 140, height: 140, borderRadius: 70 },
    accentIcon: { position: 'absolute', bottom: 15, right: 10, padding: 12, borderRadius: 20, elevation: 5, shadowOpacity: 0.1 },
    title: { fontSize: 30, fontWeight: '800', marginBottom: 16, textAlign: 'center' },
    description: { fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 60, opacity: 0.9 },
    button: { flexDirection: 'row', paddingVertical: 18, borderRadius: 20, width: width - 80, alignItems: 'center', justifyContent: 'center', elevation: 8 },
    buttonText: { fontSize: 18, fontWeight: '700' },
    footerText: { marginTop: 25, fontSize: 12, fontWeight: '600', opacity: 0.5 }
});