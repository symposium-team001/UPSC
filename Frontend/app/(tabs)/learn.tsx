import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { BookOpen, ArrowRight } from 'lucide-react-native'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView, MotiText } from 'moti'; 
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

const MODULES = [
    { id: '1', title: 'History', category: 'SOCIAL STUDIES', description: 'Comprehensive coverage of Ancient, Medieval, and Modern Indian History.', progress: 0.65 },
    { id: '2', title: 'Geography', category: 'PHYSICAL & HUMAN', description: 'Indian and World Geography, focusing on physical features and climate.', progress: 0.30 },
    { id: '3', title: 'Polity', category: 'CONSTITUTION & GOVERNANCE', description: 'Deep dive into the Indian Constitution, parliamentary system, and policy.', progress: 0.85 },
    { id: '4', title: 'Economy', category: 'INDIAN ECONOMICS', description: 'Economic development, sustainable goals, and current financial trends.', progress: 0.10 },
];

export default function LearnScreen() {
    const { theme, isDarkMode } = useTheme();
    const router = useRouter();
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const primaryTeal = '#4A7C82';
    const cardBg = isDarkMode ? '#1E293B' : '#FFFFFF';
    const borderCol = isDarkMode ? '#334155' : '#EDF2F7';

    const handlePress = (id: string) => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC' }]}>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <SafeAreaView edges={['bottom']} style={styles.mainWrapper}>
                    
                    <View style={styles.header}>
                        {/* FIXED: Changed 'y' to 'translateY' */}
                        <MotiText 
                            from={{ opacity: 0, translateY: 10 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            style={[styles.headerTitle, { color: theme.text }]}
                        >
                            Learn
                        </MotiText>
                        <Text style={[styles.subTitle, { color: theme.textSecondary }]}>
                            Master the UPSC syllabus with curated modules
                        </Text>
                    </View>

                    <View style={styles.grid}>
                        {MODULES.map((module, index) => (
                            <MotiView
                                key={module.id}
                                from={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'spring', delay: index * 100 }}
                                style={[styles.cardWrapper, { width: isMobile ? '100%' : '48.5%' }]}
                            >
                                <TouchableOpacity 
                                    activeOpacity={0.9}
                                    onPress={() => handlePress(module.id)}
                                    // FIXED: Platform-safe props to avoid 'onMouseEnter' error
                                    {...(Platform.OS === 'web' ? {
                                        onMouseEnter: () => setHoveredId(module.id),
                                        onMouseLeave: () => setHoveredId(null)
                                    } : {} as any)}
                                    style={[
                                        styles.moduleCard, 
                                        { 
                                            backgroundColor: cardBg, 
                                            borderColor: hoveredId === module.id ? primaryTeal : borderCol 
                                        },
                                        // Web-only shadow effect
                                        (Platform.OS === 'web' && hoveredId === module.id) && {
                                            boxShadow: `0 12px 24px -10px ${primaryTeal}60`,
                                            transform: 'translateY(-4px)'
                                        }
                                    ]}
                                >
                                    <View style={styles.cardTop}>
                                        <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#0F172A' : '#F0F7F8' }]}>
                                            <BookOpen size={20} color={primaryTeal} />
                                        </View>
                                        <View style={styles.titleContainer}>
                                            <Text style={[styles.categoryText, { color: primaryTeal }]}>{module.category}</Text>
                                            <Text style={[styles.titleText, { color: theme.text }]}>{module.title}</Text>
                                        </View>
                                        <ArrowRight size={18} color={isDarkMode ? '#64748B' : '#94A3B8'} />
                                    </View>
                                    
                                    <Text style={[styles.descText, { color: theme.textSecondary }]} numberOfLines={2}>
                                        {module.description}
                                    </Text>

                                    <View style={styles.progressSection}>
                                        <View style={[styles.progressBarBg, { backgroundColor: isDarkMode ? '#0F172A' : '#E2E8F0' }]}>
                                            <MotiView 
                                                from={{ width: '0%' }}
                                                animate={{ width: `${module.progress * 100}%` }}
                                                transition={{ type: 'timing', duration: 1000, delay: 300 }}
                                                style={[styles.progressBarFill, { backgroundColor: primaryTeal }]} 
                                            />
                                        </View>
                                        <View style={styles.progressLabelRow}>
                                            <Text style={[styles.progressPercent, { color: theme.textSecondary }]}>
                                                {Math.round(module.progress * 100)}% Complete
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </MotiView>
                        ))}
                    </View>
                </SafeAreaView>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingBottom: 60 },
    mainWrapper: { 
        paddingHorizontal: isMobile ? 20 : '5%', 
        maxWidth: 1200, 
        alignSelf: 'center', 
        width: '100%', 
        paddingTop: isMobile ? 20 : 40 
    },
    header: { marginBottom: 32 },
    headerTitle: { fontSize: isMobile ? 32 : 42, fontWeight: '900', letterSpacing: -1 },
    subTitle: { fontSize: 16, marginTop: 4, fontWeight: '500' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20 },
    cardWrapper: { marginBottom: 4 },
    moduleCard: { 
        padding: 24, 
        borderRadius: 24, 
        borderWidth: 1.5,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
            android: { elevation: 3 },
            web: { transition: 'all 0.3s ease' }
        })
    },
    cardTop: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
    iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    titleContainer: { flex: 1 },
    titleText: { fontSize: 20, fontWeight: '800' },
    categoryText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5, marginBottom: 2 },
    descText: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
    progressSection: { marginTop: 'auto' },
    progressBarBg: { height: 8, borderRadius: 10, overflow: 'hidden' },
    progressBarFill: { height: '100%', borderRadius: 10 },
    progressLabelRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
    progressPercent: { fontSize: 12, fontWeight: '700' },
});