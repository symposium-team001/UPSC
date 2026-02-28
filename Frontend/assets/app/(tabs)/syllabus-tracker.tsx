import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Trophy, Target, BarChart2 } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function SyllabusTracker() {
    const { theme } = useTheme();

    // BACKEND DEV: Provide an array of subjects with 'progress' (0-100)
    const syllabusData = [
        { subject: 'Polity', progress: 85, color: '#3B82F6' },
        { subject: 'Economy', progress: 40, color: '#10B981' },
        { subject: 'Environment', progress: 15, color: '#F59E0B' },
        { subject: 'History', progress: 60, color: '#6366F1' },
    ];

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Syllabus Mastery</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Your journey to LBSNAA in numbers</Text>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsRow}>
                <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
                    <Trophy size={20} color={theme.primary} />
                    <Text style={[styles.statValue, { color: theme.text }]}>124</Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Articles Read</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
                    <Target size={20} color={theme.primary} />
                    <Text style={[styles.statValue, { color: theme.text }]}>92%</Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Recall Rate</Text>
                </View>
            </View>

            {/* Visual Progress Bars */}
            <View style={[styles.chartCard, { backgroundColor: theme.surface }]}>
                <View style={styles.chartHeader}>
                    <BarChart2 size={18} color={theme.primary} />
                    <Text style={[styles.chartTitle, { color: theme.text }]}>Subject-wise Breakdown</Text>
                </View>
                
                {syllabusData.map((item, index) => (
                    <View key={index} style={styles.progressItem}>
                        <View style={styles.progressLabelRow}>
                            <Text style={[styles.subjectText, { color: theme.text }]}>{item.subject}</Text>
                            <Text style={[styles.percentText, { color: theme.primary }]}>{item.progress}%</Text>
                        </View>
                        <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
                            <View 
                                style={[
                                    styles.progressFill, 
                                    { backgroundColor: item.color, width: `${item.progress}%` }
                                ]} 
                            />
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { marginBottom: 30, marginTop: 40 },
    title: { fontSize: 28, fontWeight: '900' },
    subtitle: { fontSize: 14, marginTop: 5 },
    statsRow: { flexDirection: 'row', gap: 15, marginBottom: 25 },
    statCard: { flex: 1, padding: 20, borderRadius: 24, alignItems: 'center', gap: 8 },
    statValue: { fontSize: 20, fontWeight: '800' },
    statLabel: { fontSize: 12, fontWeight: '600' },
    chartCard: { padding: 20, borderRadius: 28 },
    chartHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 25 },
    chartTitle: { fontSize: 16, fontWeight: '800' },
    progressItem: { marginBottom: 20 },
    progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    subjectText: { fontSize: 14, fontWeight: '700' },
    percentText: { fontSize: 13, fontWeight: '800' },
    progressTrack: { height: 10, borderRadius: 5, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 5 },
});