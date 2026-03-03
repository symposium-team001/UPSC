import React, { useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Animated, Platform, Image
} from 'react-native';
import { 
    ChevronRight, Newspaper
} from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { useTheme } from '../../context/ThemeContext';
import { router } from 'expo-router';

const isWeb = Platform.OS === 'web';

export default function HomeScreen() {
    const { theme } = useTheme();
    const userName = "Buddy";
    
    const fadeText = useRef(new Animated.Value(0)).current;
    const fadeButton = useRef(new Animated.Value(0)).current;
    const fadeImage = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(15)).current; 
    
    const hasSpoken = useRef(false);

    useEffect(() => {
        Animated.sequence([
            Animated.delay(100),
            Animated.parallel([
                Animated.timing(fadeText, { toValue: 1, duration: 600, useNativeDriver: true }),
                Animated.timing(translateY, { toValue: 0, duration: 600, useNativeDriver: true })
            ]),
            Animated.timing(fadeButton, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(fadeImage, { toValue: 1, duration: 800, useNativeDriver: true })
        ]).start();
        
        if (!hasSpoken.current) {
            Speech.speak(`Welcome ${userName}`, { language: 'en-US', rate: 0.9 });
            hasSpoken.current = true;
        }
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* REMOVED: Local NavBar code has been deleted.
               The Global Header from (tabs)/_layout.tsx will now handle the top navigation.
            */}

            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={[
                    styles.scrollContent, 
                    // This padding ensures content starts below the global header
                    { paddingTop: isWeb ? 40 : 20 } 
                ]}
            >
                <View style={styles.responsiveWrapper}>
                    {/* --- HERO SECTION --- */}
                    <View style={styles.heroSection}>
                        <Animated.View style={[styles.heroTextContainer, { opacity: fadeText, transform: [{ translateY }] }]}>
                            <Text style={[styles.welcomeText, { color: theme.primary }]}>Welcome, {userName}!</Text>
                            <Text style={[styles.heroTitle, { color: theme.text }]}>
                                Master the UPSC Syllabus with <Text style={{ color: theme.primary }}>Ethora</Text>
                            </Text>
                            <Text style={[styles.heroSub, { color: theme.textSecondary }]}>
                                Your all-in-one destination for Daily Current Affairs, Subject Modules, and Realistic Mock Tests.
                            </Text>
                            
                            <Animated.View style={{ opacity: fadeButton }}>
                                <TouchableOpacity 
                                    onPress={() => router.push('/learn')}
                                    style={[styles.btnPrimary, { backgroundColor: theme.primary }]}
                                >
                                    <Text style={styles.btnPrimaryText}>Go to Course</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </Animated.View>

                        <Animated.View style={[styles.heroImageContainer, { opacity: fadeImage }]}>
                            <Image 
                                source={{ uri: 'https://i.pinimg.com/1200x/19/69/01/19690123eea6d53b81d03b65598f5df6.jpg' }} 
                                style={styles.heroImage}
                                resizeMode="contain"
                            />
                        </Animated.View>
                    </View>

                    {/* --- DAILY AFFAIRS SECTION --- */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Newspaper size={24} color={theme.primary} />
                            <Text style={[styles.sectionTitle, { color: theme.text, marginLeft: 10 }]}>Daily Current Affairs</Text>
                        </View>
                        <View style={styles.affairsGrid}>
                            {[1, 2, 3].map((item) => (
                                <TouchableOpacity key={item} style={[styles.affairCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                                    <View style={styles.dateBadge}><Text style={styles.dateText}>March {item + 1}, 2026</Text></View>
                                    <Text style={[styles.affairTitle, { color: theme.text }]}>Important Editorial Analysis: India's Foreign Policy</Text>
                                    <View style={styles.cardFooter}>
                                        <Text style={{ color: theme.primary, fontWeight: '700' }}>Read Now</Text>
                                        <ChevronRight size={16} color={theme.primary} />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                {/* --- FOOTER --- */}
                <View style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
                    <View style={styles.footerContent}>
                        <View style={styles.footerLinksRow}>
                            <TouchableOpacity><Text style={[styles.footerLink, { color: theme.textSecondary }]}>About Us</Text></TouchableOpacity>
                            <TouchableOpacity><Text style={[styles.footerLink, { color: theme.textSecondary }]}>Contact</Text></TouchableOpacity>
                            <TouchableOpacity><Text style={[styles.footerLink, { color: theme.textSecondary }]}>Privacy</Text></TouchableOpacity>
                        </View>
                        <View style={styles.footerBrand}>
                             <Text style={[styles.logo, { color: theme.primary }]}>Ethora</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    // Simplified logo for footer
    logo: { fontSize: 24, fontWeight: '900', letterSpacing: -1 },
    scrollContent: { flexGrow: 1 },
    responsiveWrapper: { width: isWeb ? '80%' : '100%', alignSelf: 'center', paddingHorizontal: 20 },
    heroSection: { flexDirection: isWeb ? 'row' : 'column', paddingVertical: 60, gap: 40, alignItems: 'center' },
    heroTextContainer: { flex: 1 },
    welcomeText: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
    heroTitle: { fontSize: isWeb ? 52 : 36, fontWeight: '900', marginBottom: 20, lineHeight: isWeb ? 60 : 42 },
    heroSub: { fontSize: 17, lineHeight: 26, marginBottom: 35 },
    btnPrimary: { alignSelf: 'flex-start', paddingHorizontal: 28, paddingVertical: 16, borderRadius: 10, elevation: 2 },
    btnPrimaryText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
    heroImageContainer: { 
        flex: 1, 
        width: '100%', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: isWeb ? 450 : 300, 
        marginTop: isWeb ? 0 : 20,
    },
    heroImage: { 
        width: isWeb ? 500 : '100%', 
        height: isWeb ? 450 : undefined,
        aspectRatio: isWeb ? undefined : 1, 
    },
    section: { paddingVertical: 40 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
    sectionTitle: { fontSize: 24, fontWeight: '800' },
    affairsGrid: { flexDirection: isWeb ? 'row' : 'column', gap: 20 },
    affairCard: { flex: 1, padding: 20, borderRadius: 15, borderWidth: 1 },
    dateBadge: { backgroundColor: '#E0F2F1', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, marginBottom: 12 },
    dateText: { fontSize: 11, fontWeight: '700', color: '#00796B' },
    affairTitle: { fontSize: 16, fontWeight: '700', lineHeight: 22, marginBottom: 20 },
    cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    footer: { paddingVertical: 50, borderTopWidth: 1, marginTop: 40 },
    footerContent: { 
        width: isWeb ? '80%' : '100%', 
        alignSelf: 'center', 
        flexDirection: isWeb ? 'row' : 'column-reverse', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        gap: 30 
    },
    footerBrand: { alignItems: 'center' },
    footerLinksRow: { flexDirection: 'row', gap: 30 },
    footerLink: { fontSize: 14, fontWeight: '600' }
});