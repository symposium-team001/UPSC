import React, { useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Animated, Dimensions, Platform
} from 'react-native';
import { 
    History, Gavel, BarChart3, Zap, 
    ChevronRight, Target, BrainCircuit, Globe2 
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

const SUBJECTS = [
    { id: '1', name: 'Indian Polity', icon: Gavel, color: '#3B82F6', questions: 1200, progress: 0.65 },
    { id: '2', name: 'History', icon: History, color: '#F59E0B', questions: 850, progress: 0.40 },
    { id: '3', name: 'Geography', icon: Globe2, color: '#10B981', questions: 600, progress: 0.25 },
    { id: '4', name: 'Aptitude', icon: BrainCircuit, color: '#8B5CF6', questions: 450, progress: 0.80 },
    { id: '5', name: 'Economics', icon: BarChart3, color: '#EC4899', questions: 300, progress: 0.15 },
    { id: '6', name: 'Ethics', icon: Target, color: '#EF4444', questions: 200, progress: 0.90 },
];

export default function PracticeScreen() {
    const { theme } = useTheme();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scrollY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleCategoryPress = (name: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        console.log(`Navigating to ${name} quiz...`);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* 1. STATS OVERVIEW CARD */}
                <Animated.View style={[styles.statsCard, { backgroundColor: theme.surface, opacity: fadeAnim }]}>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: theme.text }]}>84%</Text>
                            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Accuracy</Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: theme.text }]}>1.2k</Text>
                            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Solved</Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: theme.primary }]}>12</Text>
                            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Streak</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* 2. SECTION TITLE */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Explore Subjects</Text>
                    <Text style={[styles.sectionSub, { color: theme.textSecondary }]}>Choose a topic to begin practice</Text>
                </View>

                {/* 3. SUBJECT GRID */}
                <View style={styles.grid}>
                    {SUBJECTS.map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            activeOpacity={0.7}
                            onPress={() => handleCategoryPress(item.name)}
                            style={[styles.subjectCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                        >
                            <View style={[styles.iconCircle, { backgroundColor: item.color + '15' }]}>
                                <item.icon size={24} color={item.color} />
                            </View>
                            
                            <Text style={[styles.subjectName, { color: theme.text }]}>{item.name}</Text>
                            <Text style={[styles.questionCount, { color: theme.textSecondary }]}>{item.questions} Qs</Text>
                            
                            {/* PROGRESS BAR */}
                            <View style={styles.progressContainer}>
                                <View style={[styles.progressBg, { backgroundColor: theme.border }]} />
                                <View style={[styles.progressFill, { backgroundColor: item.color, width: `${item.progress * 100}%` }]} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* 4. QUICK CHALLENGE BUTTON */}
                <TouchableOpacity 
                    style={[styles.quickPlay, { backgroundColor: theme.primary }]}
                    onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
                >
                    <Zap size={20} color="#FFF" fill="#FFF" />
                    <Text style={styles.quickPlayText}>Random Mixed Quiz</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 40, paddingHorizontal: 20 },
    
    // Stats Styles
    statsCard: { padding: 24, borderRadius: 28, marginBottom: 32, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 }, android: { elevation: 4 } }) },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    statItem: { alignItems: 'center', flex: 1 },
    statValue: { fontSize: 22, fontWeight: '800' },
    statLabel: { fontSize: 12, fontWeight: '600', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
    statDivider: { width: 1, height: 30 },

    // Grid Styles
    sectionHeader: { marginBottom: 20, paddingLeft: 4 },
    sectionTitle: { fontSize: 24, fontWeight: '800' },
    sectionSub: { fontSize: 14, marginTop: 4, fontWeight: '500' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16 },
    subjectCard: { 
        width: (width - 56) / 2, 
        padding: 20, 
        borderRadius: 24, 
        borderWidth: 1.5,
        justifyContent: 'center'
    },
    iconCircle: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
    subjectName: { fontSize: 16, fontWeight: '700' },
    questionCount: { fontSize: 12, fontWeight: '500', marginTop: 2 },
    
    // Progress Bar Styles
    progressContainer: { height: 6, width: '100%', marginTop: 15, borderRadius: 3, overflow: 'hidden' },
    progressBg: { height: '100%', width: '100%', position: 'absolute' },
    progressFill: { height: '100%', borderRadius: 3 },

    // Quick Play Button
    quickPlay: { 
        marginTop: 32, 
        flexDirection: 'row', 
        height: 60, 
        borderRadius: 20, 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: 12 
    },
    quickPlayText: { color: '#FFF', fontSize: 18, fontWeight: '800' }
});