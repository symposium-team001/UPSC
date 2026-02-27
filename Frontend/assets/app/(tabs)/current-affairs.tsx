import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { Sparkles, Clock, Newspaper } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Added an Interface to stop the TypeScript red underlines
interface NewsItem {
    id: string;
    tag: string;
    title: string;
    source: string;
    date: string;
    readTime: string;
}

const DAILY_NEWS: NewsItem[] = [
    {
        id: '1',
        tag: 'GS II • POLITY',
        title: 'Supreme Court clarifies Article 145(3) regarding Constitutional Benches',
        source: 'The Hindu',
        date: 'Today',
        readTime: '4 min'
    },
    {
        id: '2',
        tag: 'GS III • ECONOMY',
        title: 'New Digital Currency Regulations: What Aspirants Need to Know',
        source: 'Indian Express',
        date: 'Today',
        readTime: '6 min'
    }
];

export default function CurrentAffairs() {
    const { theme } = useTheme();
    const router = useRouter();

    // Explicitly typed 'item' as NewsItem to fix your screenshot error
    const renderNewsCard = ({ item }: { item: NewsItem }) => (
        <TouchableOpacity 
            style={[styles.newsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => router.push({
                pathname: "/editorial-analyst", // Make sure file is app/editorial-analyst.tsx
                params: { id: item.id, title: item.title }
            })}
        >
            <View style={styles.cardHeader}>
                <View style={[styles.tagBadge, { backgroundColor: theme.primary + '15' }]}>
                    <Text style={[styles.tagText, { color: theme.primary }]}>{item.tag}</Text>
                </View>
                <View style={styles.metaRow}>
                    <Clock size={12} color={theme.textSecondary} />
                    <Text style={[styles.metaText, { color: theme.textSecondary }]}>{item.readTime}</Text>
                </View>
            </View>

            <Text style={[styles.newsTitle, { color: theme.text }]} numberOfLines={2}>
                {item.title}
            </Text>

            <View style={styles.cardFooter}>
                <Text style={[styles.sourceText, { color: theme.textSecondary }]}>{item.source}</Text>
                <View style={styles.analyzeBtn}>
                    <Text style={[styles.analyzeText, { color: theme.primary }]}>Analyze</Text>
                    <Sparkles size={14} color={theme.primary} />
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <SafeAreaView edges={['top']}>
                <View style={styles.header}>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Daily Affairs</Text>
                    <Newspaper size={20} color={theme.primary} />
                </View>
            </SafeAreaView>
            <FlatList
                data={DAILY_NEWS}
                renderItem={renderNewsCard}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
    headerTitle: { fontSize: 24, fontWeight: '900' },
    listContent: { padding: 20 },
    newsCard: { padding: 18, borderRadius: 24, borderWidth: 1, marginBottom: 16 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    tagBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    tagText: { fontSize: 10, fontWeight: '900' },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { fontSize: 11, fontWeight: '600' },
    newsTitle: { fontSize: 17, fontWeight: '800', lineHeight: 24, marginBottom: 15 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    sourceText: { fontSize: 12, fontWeight: '600' },
    analyzeBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    analyzeText: { fontSize: 13, fontWeight: '800' }
});