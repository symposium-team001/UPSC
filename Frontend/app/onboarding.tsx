import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  Animated, 
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { GraduationCap, BarChart3, ArrowRight } from 'lucide-react-native'; 
import { useTheme } from '../context/ThemeContext';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 450; // Simple threshold for mobile vs web/tablet

export default function OnboardingScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const slideUp = useRef(new Animated.Value(30)).current;
    const fade = useRef(new Animated.Value(0)).current;

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
        if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        router.replace('/login');
    };

    return (
        <View style={[styles.container, { backgroundColor: '#F8FAFC' }]}>
            <Animated.View style={[
                styles.content, 
                { opacity: fade, transform: [{ translateY: slideUp }] }
            ]}>
                
                {/* Scalable Icon Wrapper */}
                <View style={styles.iconWrapper}>
                    <View style={[styles.iconCircle, { backgroundColor: theme.primary, opacity: 0.1 }]} />
                    <GraduationCap 
                        size={isSmallDevice ? 80 : 100} 
                        color={theme.primary} 
                        strokeWidth={1.2} 
                    />
                    
                    <View style={[styles.accentIcon, { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderWidth: 1 }]}>
                         <BarChart3 size={isSmallDevice ? 22 : 28} color={theme.primary} strokeWidth={2} />
                    </View>
                </View>

                {/* Responsive Typography */}
                <Text style={[styles.title, { color: '#0F172A' }]}>
                    {getGreeting()}
                </Text>
                
                <Text style={styles.quote}>
                    "The best way to predict your UPSC result is to create it."
                </Text>

                <Text style={styles.description}>
                    Ethora is your personal mentor, ready to guide your journey to LBSNAA.
                </Text>

                <TouchableOpacity 
                    style={[styles.button, { backgroundColor: '#4A767D' }]} 
                    activeOpacity={0.9}
                    onPress={handleStart}
                >
                    <Text style={styles.buttonText}>Enter Workspace</Text>
                    <ArrowRight size={20} color="#FFF" style={{ marginLeft: 10 }} />
                </TouchableOpacity>

                {/* Footer labels - hidden on very small screens or wrapped */}
                <View style={styles.footerLinks}>
                    <Text style={styles.footerLabel}>ADAPTIVE LEARNING</Text>
                    <View style={styles.dot} />
                    <Text style={styles.footerLabel}>DAILY CURRENT AFFAIRS</Text>
                    <View style={styles.dot} />
                    <Text style={styles.footerLabel}>MOCK TESTS</Text>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
        paddingVertical: 20 
    },
    content: { 
        alignItems: 'center', 
        paddingHorizontal: isSmallDevice ? 25 : 40, 
        width: '100%',
        maxWidth: 800, // Keeps web view from getting too wide
    },
    iconWrapper: { 
        width: isSmallDevice ? 150 : 200, 
        height: isSmallDevice ? 150 : 200, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom: isSmallDevice ? 20 : 40 
    },
    iconCircle: { 
        position: 'absolute', 
        width: isSmallDevice ? 120 : 160, 
        height: isSmallDevice ? 120 : 160, 
        borderRadius: 80 
    },
    accentIcon: { 
        position: 'absolute', 
        bottom: isSmallDevice ? 10 : 20, 
        right: isSmallDevice ? 10 : 20, 
        padding: isSmallDevice ? 8 : 12, 
        borderRadius: 12, 
        backgroundColor: '#fff',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
            android: { elevation: 5 },
            web: { boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' }
        })
    },
    title: { 
        fontSize: isSmallDevice ? 28 : 42, // Significantly smaller on mobile
        fontWeight: '900', 
        marginBottom: 10, 
        textAlign: 'center', 
        letterSpacing: -0.5 
    },
    quote: { 
        fontSize: isSmallDevice ? 14 : 18, 
        color: '#4A767D', 
        fontStyle: 'italic', 
        fontWeight: '600', 
        marginBottom: 20, 
        textAlign: 'center',
        paddingHorizontal: 10
    },
    description: { 
        fontSize: isSmallDevice ? 14 : 16, 
        textAlign: 'center', 
        lineHeight: isSmallDevice ? 22 : 26, 
        color: '#64748B', 
        marginBottom: isSmallDevice ? 40 : 60, 
        maxWidth: 500 
    },
    button: { 
        flexDirection: 'row', 
        paddingVertical: isSmallDevice ? 16 : 20, 
        paddingHorizontal: isSmallDevice ? 30 : 40,
        borderRadius: 12, 
        width: isSmallDevice ? '100%' : 'auto', // Full width button on mobile
        alignItems: 'center', 
        justifyContent: 'center', 
        ...Platform.select({
            ios: { shadowColor: '#4A767D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
            android: { elevation: 4 },
            web: { boxShadow: '0px 4px 10px rgba(74, 118, 125, 0.3)' }
        })
    },
    buttonText: { fontSize: 18, fontWeight: '800', color: '#FFF' },
    footerLinks: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', // Allows labels to wrap on thin screens
        justifyContent: 'center',
        alignItems: 'center', 
        marginTop: isSmallDevice ? 40 : 80, 
        gap: isSmallDevice ? 10 : 15 
    },
    footerLabel: { fontSize: 9, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.5 },
    dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1' }
});