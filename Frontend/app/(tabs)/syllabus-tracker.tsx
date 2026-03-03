import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Trophy, Target, BarChart2, Zap } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;

export default function SyllabusTracker() {
    const { theme } = useTheme();

    // BACKEND DEV: Data matches the visual breakdown in image_242cc6.png
    const syllabusData = [
        { subject: 'Polity', progress: 85, color: '#3B82F6', subtitle: 'CONSTITUTIONAL FRAMEWORK & GOVERNANCE' },
        { subject: 'Economy', progress: 40, color: '#10B981', subtitle: 'MACROECONOMICS & INDIAN FINANCIAL SYSTEM' },
        { subject: 'Environment', progress: 15, color: '#F59E0B', subtitle: 'ECOLOGY, BIODIVERSITY & CLIMATE CHANGE' },
        { subject: 'History', progress: 60, color: '#6366F1', subtitle: 'MODERN INDIAN HISTORY & CULTURE' },
    ];

    return (
        <ScrollView 
            style={[styles.container, { backgroundColor: theme.background }]}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Syllabus Mastery</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Your journey to LBSNAA in numbers</Text>
            </View>

            {/* Stats Grid - Responsive spacing */}
            <View style={styles.statsRow}>
                <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
                    <View style={styles.iconCircle}>
                        <Trophy size={18} color={theme.primary} />
                    </View>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Articles Read</Text>
                    <Text style={[styles.statValue, { color: theme.text }]}>124</Text>
                    <Text style={styles.trendText}>↗ +12% from last week</Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
                    <View style={styles.iconCircle}>
                        <Target size={18} color={theme.primary} />
                    </View>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Recall Rate</Text>
                    <Text style={[styles.statValue, { color: theme.text }]}>92%</Text>
                    <Text style={styles.successText}>● Above average target</Text>
                </View>
            </View>

            {/* Subject-wise Breakdown Card */}
            <View style={[styles.chartCard, { backgroundColor: theme.surface }]}>
                <View style={styles.chartHeader}>
                    <Text style={[styles.chartTitle, { color: theme.text }]}>Subject-wise Breakdown</Text>
                    <Text style={styles.viewDetailed}>View detailed report</Text>
                </View>
                
                {syllabusData.map((item, index) => (
                    <View key={index} style={styles.progressItem}>
                        <View style={styles.progressLabelRow}>
                            <Text style={[styles.subjectText, { color: theme.text }]}>{item.subject}</Text>
                            <Text style={[styles.percentText, { color: theme.text }]}>{item.progress}%</Text>
                        </View>
                        
                        <View style={[styles.progressTrack, { backgroundColor: theme.border + '20' }]}>
                            <View 
                                style={[
                                    styles.progressFill, 
                                    { backgroundColor: item.color, width: `${item.progress}%` }
                                ]} 
                            />
                        </View>
                        <Text style={styles.subjectSubtitle}>{item.subtitle}</Text>
                    </View>
                ))}
            </View>

            {/* Dynamic Suggestion Card (Footer) */}
            <View style={[styles.footerCard, { backgroundColor: '#F1F5F9' }]}>
                <View style={styles.footerContent}>
                    <View style={styles.footerIcon}>
                        <Zap size={20} color="#64748B" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.footerTitle}>Focus on Environment</Text>
                        <Text style={styles.footerText}>Your progress is lowest in this category. Consider 30 mins extra daily.</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { 
        paddingHorizontal: width > 1000 ? '15%' : 20, 
        paddingTop: 40, 
        paddingBottom: 40 
    },
    header: { marginBottom: 30 },
    title: { fontSize: 32, fontWeight: '900', letterSpacing: -0.5 },
    subtitle: { fontSize: 16, fontWeight: '500', opacity: 0.7 },
    
    statsRow: { 
        flexDirection: 'row', 
        gap: 16, 
        marginBottom: 30 
    },
    statCard: { 
        flex: 1, 
        padding: 20, 
        borderRadius: 20, 
        gap: 4,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
            android: { elevation: 2 }
        })
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8
    },
    statLabel: { fontSize: 13, fontWeight: '600' },
    statValue: { fontSize: 28, fontWeight: '800', marginVertical: 2 },
    trendText: { fontSize: 11, fontWeight: '700', color: '#10B981' },
    successText: { fontSize: 11, fontWeight: '700', color: '#059669' },

    chartCard: { 
        padding: 24, 
        borderRadius: 24,
        marginBottom: 20 
    },
    chartHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 30 
    },
    chartTitle: { fontSize: 18, fontWeight: '800' },
    viewDetailed: { fontSize: 12, fontWeight: '700', color: '#64748B' },
    
    progressItem: { marginBottom: 24 },
    progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    subjectText: { fontSize: 15, fontWeight: '800' },
    percentText: { fontSize: 14, fontWeight: '700', opacity: 0.8 },
    progressTrack: { height: 12, borderRadius: 6, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 6 },
    subjectSubtitle: { fontSize: 10, fontWeight: '700', color: '#94A3B8', marginTop: 8, textTransform: 'uppercase', letterSpacing: 0.5 },

    footerCard: { padding: 20, borderRadius: 20, marginTop: 10 },
    footerContent: { flexDirection: 'row', gap: 15, alignItems: 'center' },
    footerIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
    footerTitle: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
    footerText: { fontSize: 13, color: '#64748B', marginTop: 2, lineHeight: 18 }
});