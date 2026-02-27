import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Target, Sparkles, CheckCircle2, XCircle, Compass } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext'; // Check this path matches your folder
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

export default function EditorialAnalyst() {
    const { theme } = useTheme();
    const router = useRouter();
    const { title } = useLocalSearchParams();
    
    const [activeTab, setActiveTab] = useState('prelims');
    const [showRecall, setShowRecall] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const mockData = {
        syllabusPath: ["GS II", "Polity", "Judiciary"],
        prelims: "Focus on Article 145(3) regarding Constitutional Benches. Note the quorum requirement.",
        mains: "Discuss the impact of judicial overreach on the separation of powers.",
        interview: "Should the CJI have more power in the Collegium? Justify your stance.",
        recall: {
            question: "What is the minimum number of judges for a Constitutional Bench?",
            options: ["3 Judges", "5 Judges", "7 Judges", "9 Judges"],
            correct: 1
        }
    };

    const handleOptionPress = (index: number) => {
        setSelectedOption(index);
        if (index === mockData.recall.correct) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <SafeAreaView edges={['top']} style={{ backgroundColor: theme.surface }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <ChevronLeft size={28} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Ethora Analyst</Text>
                    <View style={{ width: 28 }} />
                </View>
            </SafeAreaView>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.mapContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <View style={styles.breadcrumbRow}>
                        <Compass size={14} color={theme.primary} />
                        {mockData.syllabusPath.map((p, i) => (
                            <Text key={i} style={[styles.pathText, { color: theme.textSecondary }]}>
                                {p}{i < mockData.syllabusPath.length - 1 ? " → " : ""}
                            </Text>
                        ))}
                    </View>
                </View>

                <Text style={[styles.mainTitle, { color: theme.text }]}>{title}</Text>

                <View style={[styles.tabContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    {['prelims', 'mains', 'interview'].map((tab) => (
                        <TouchableOpacity 
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            style={[styles.tab, activeTab === tab && { backgroundColor: theme.primary }]}
                        >
                            <Text style={[styles.tabText, { color: activeTab === tab ? '#FFF' : theme.textSecondary }]}>
                                {tab.toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={[styles.contentCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <View style={styles.cardHeader}>
                        <Sparkles size={18} color={theme.primary} />
                        <Text style={[styles.cardHeaderText, { color: theme.primary }]}>Mentor Perspective</Text>
                    </View>
                    <Text style={[styles.contentText, { color: theme.text }]}>
                        {activeTab === 'prelims' && mockData.prelims}
                        {activeTab === 'mains' && mockData.mains}
                        {activeTab === 'interview' && mockData.interview}
                    </Text>
                </View>

                <TouchableOpacity 
                    style={[styles.recallTrigger, { backgroundColor: theme.primary + '15', borderColor: theme.primary }]}
                    onPress={() => setShowRecall(true)}
                >
                    <Target size={20} color={theme.primary} />
                    <Text style={[styles.recallTriggerText, { color: theme.primary }]}>Final Recall Check</Text>
                </TouchableOpacity>
            </ScrollView>

            <Modal visible={showRecall} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>{mockData.recall.question}</Text>
                        {mockData.recall.options.map((opt, idx) => (
                            <TouchableOpacity 
                                key={idx}
                                style={[styles.optionBtn, { borderColor: theme.border },
                                    selectedOption === idx && { backgroundColor: idx === mockData.recall.correct ? '#4ADE8020' : '#F8717120' }
                                ]}
                                onPress={() => handleOptionPress(idx)}
                            >
                                <Text style={[styles.optionText, { color: theme.text }]}>{opt}</Text>
                                {selectedOption === idx && (idx === mockData.recall.correct ? <CheckCircle2 size={18} color="#4ADE80" /> : <XCircle size={18} color="#F87171" />)}
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={[styles.closeBtn, { backgroundColor: theme.primary }]} onPress={() => { setShowRecall(false); setSelectedOption(null); }}>
                            <Text style={styles.closeBtnText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 60 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    scrollContent: { padding: 20 },
    mapContainer: { padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 20 },
    breadcrumbRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    pathText: { fontSize: 12, fontWeight: '700' },
    mainTitle: { fontSize: 22, fontWeight: '900', marginBottom: 20 },
    tabContainer: { flexDirection: 'row', padding: 4, borderRadius: 12, borderWidth: 1, marginBottom: 20 },
    tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
    tabText: { fontSize: 11, fontWeight: '800' },
    contentCard: { padding: 20, borderRadius: 20, borderWidth: 1, minHeight: 180, marginBottom: 20 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    cardHeaderText: { fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
    contentText: { fontSize: 16, lineHeight: 24 },
    recallTrigger: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed', gap: 10 },
    recallTriggerText: { fontSize: 15, fontWeight: '800' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
    modalContent: { padding: 25, borderRadius: 30 },
    modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 20, textAlign: 'center' },
    optionBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 15, borderWidth: 1, marginBottom: 12 },
    optionText: { fontSize: 15, fontWeight: '600' },
    closeBtn: { marginTop: 10, paddingVertical: 16, borderRadius: 15, alignItems: 'center' },
    closeBtnText: { color: '#FFF', fontWeight: '800' }
});