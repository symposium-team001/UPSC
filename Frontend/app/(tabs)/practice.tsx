import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Platform, ImageBackground, Dimensions
} from 'react-native';
import { Stack } from 'expo-router';
import { Zap } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import { MotiView } from 'moti';


const isWeb = Platform.OS === 'web';

const SUBJECTS = [
    { id: '1', name: 'Indian Polity', questions: '1200 Questions', progress: 0.80, progressText: '80% Complete', image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800', status: 'Resume Practice' },
    { id: '2', name: 'Geography', questions: '950 Questions', progress: 0.45, progressText: '45% Complete', image: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=800', status: 'Resume Practice' },
    { id: '3', name: 'Economics', questions: '800 Questions', progress: 0.10, progressText: '10% Complete', image: 'https://images.unsplash.com/photo-1611974714851-48206139d733?q=80&w=800', status: 'Resume Practice' },
    { id: '4', name: 'History', questions: '1100 Questions', progress: 0.60, progressText: '60% Complete', image: 'https://images.unsplash.com/photo-1461360229102-19304c184744?q=80&w=800', status: 'Resume Practice' },
    { id: '5', name: 'Aptitude', questions: '1500 Questions', progress: 0.25, progressText: '25% Complete', image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=800', status: 'Resume Practice' },
    { id: '6', name: 'Ethics', questions: '700 Questions', progress: 0, progressText: '0% Complete', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800', status: 'Start Learning' },
];

export default function PracticeScreen() {
    const { theme, isDarkMode } = useTheme();
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const primaryTeal = isDarkMode ? '#5FA4AD' : '#2D5A61';
    const cardBg = isDarkMode ? '#1E293B' : '#FFFFFF';

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC' }]}>
            <Stack.Screen options={{ headerShown: false }} />
            {/* Using Global Header as per your instructions */}

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* Stats Overview */}
                <View style={styles.statsContainer}>
                    {[
                        { label: 'ACCURACY', value: '84%', trend: '↑ 2%' },
                        { label: 'SOLVED', value: '1.2k', trend: '↑ 150' },
                        { label: 'STREAK', value: '12', trend: '↑ 3' }
                    ].map((stat, idx) => (
                        <MotiView 
                            key={idx} 
                            from={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 100 }}
                            style={[styles.statCard, { backgroundColor: cardBg, borderColor: isDarkMode ? '#334155' : '#E2E8F0' }]}
                        >
                            <Text style={styles.statLabel}>{stat.label}</Text>
                            <View style={styles.statValueRow}>
                                <Text style={[styles.statValue, { color: theme.text }]}>{stat.value}</Text>
                                <Text style={styles.statTrendUp}>{stat.trend}</Text>
                            </View>
                        </MotiView>
                    ))}
                </View>

                {/* Grid with Hover Effects */}
                <View style={styles.grid}>
                    {SUBJECTS.map((item, index) => (
                        <MotiView 
                            key={item.id}
                            from={{ opacity: 0, translateY: 20 }}
                            animate={{ 
                                opacity: 1, 
                                translateY: 0,
                                // Smooth scale hover effect for web
                                scale: isWeb && hoveredId === item.id ? 1.03 : 1 
                            }}
                            transition={{ delay: index * 50, type: 'timing', duration: 400 }}
                            style={styles.cardWrapper}
                        >
                            <TouchableOpacity 
                                activeOpacity={0.9}
                                // Casting props to 'any' to bypass React Native / Web TS conflict in TouchableOpacity
                                {...({
                                    onMouseEnter: () => isWeb && setHoveredId(item.id),
                                    onMouseLeave: () => isWeb && setHoveredId(null),
                                } as any)}
                                style={[
                                    styles.cardContainer, 
                                    { backgroundColor: cardBg, borderColor: isDarkMode ? '#334155' : '#E2E8F0' },
                                    isWeb && hoveredId === item.id && styles.cardHoverShadow
                                ]}
                            >
                                <ImageBackground 
                                    source={{ uri: item.image }} 
                                    style={styles.cardImage}
                                    imageStyle={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
                                >
                                    <View style={styles.imageOverlay}>
                                        <Text style={styles.cardSubjectName}>{item.name}</Text>
                                    </View>
                                </ImageBackground>

                                <View style={styles.cardContent}>
                                    <View style={styles.cardMetaRow}>
                                        <Text style={[styles.cardQsCount, { color: theme.textSecondary }]}>{item.questions}</Text>
                                        <Text style={[styles.cardProgressPercent, { color: primaryTeal }]}>{item.progressText}</Text>
                                    </View>
                                    
                                    <View style={[styles.progressBarBg, { backgroundColor: isDarkMode ? '#334155' : '#F1F5F9' }]}>
                                        <MotiView 
                                            from={{ width: '0%' }}
                                            animate={{ width: `${item.progress * 100}%` }}
                                            transition={{ type: 'timing', duration: 1000, delay: 500 }}
                                            style={[styles.progressBarFill, { backgroundColor: primaryTeal }]} 
                                        />
                                    </View>

                                    <View style={[styles.actionButton, { backgroundColor: item.status === 'Start Learning' ? 'transparent' : primaryTeal, borderColor: primaryTeal, borderWidth: item.status === 'Start Learning' ? 1.5 : 0 }]}>
                                        <Text style={[styles.actionButtonText, { color: item.status === 'Start Learning' ? primaryTeal : '#FFF' }]}>
                                            {item.status}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </MotiView>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { 
        paddingHorizontal: isWeb ? '5%' : 20, 
        paddingTop: 20, 
        paddingBottom: 100,
        maxWidth: 1400,
        alignSelf: 'center',
        width: '100%'
    },
    statsContainer: { flexDirection: 'row', gap: 15, marginBottom: 40, flexWrap: 'wrap' },
    statCard: { flex: 1, minWidth: isWeb ? 200 : '45%', padding: 20, borderRadius: 16, borderWidth: 1 },
    statLabel: { fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 1 },
    statValueRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 },
    statValue: { fontSize: 24, fontWeight: '900' },
    statTrendUp: { fontSize: 12, fontWeight: '700', color: '#10B981' },
    
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20 },
    cardWrapper: { width: isWeb ? '31%' : '100%' },
    cardContainer: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', transitionProperty: 'all', transitionDuration: '0.2s' } as any,
    cardHoverShadow: {
        ...Platform.select({
            web: {
                boxShadow: '0px 10px 20px rgba(0,0,0,0.1)',
                transform: 'translateY(-5px)'
            }
        })
    } as any,
    cardImage: { width: '100%', height: 160, justifyContent: 'flex-end' },
    imageOverlay: { backgroundColor: 'rgba(0,0,0,0.4)', padding: 12 },
    cardSubjectName: { color: '#FFF', fontSize: 18, fontWeight: '800' },
    cardContent: { padding: 16 },
    cardMetaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    cardQsCount: { fontSize: 12, fontWeight: '600' },
    cardProgressPercent: { fontSize: 12, fontWeight: '800' },
    progressBarBg: { height: 6, borderRadius: 3, marginBottom: 16, overflow: 'hidden' },
    progressBarFill: { height: '100%', borderRadius: 3 },
    actionButton: { height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    actionButtonText: { fontSize: 13, fontWeight: '800' },
});