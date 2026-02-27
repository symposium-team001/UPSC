import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { FileText, Download, ChevronLeft } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';

export default function LearningScreen() {
    const { theme } = useTheme();
    const router = useRouter();

    const materials = [
        { id: '1', title: 'Modern History Notes', size: '2.4 MB' },
        { id: '2', title: 'Budget 2026 Analysis', size: '1.1 MB' },
        { id: '3', title: 'Ethics Case Studies', size: '4.5 MB' },
    ];

    return (
        <View style={[s.container, { backgroundColor: theme.background }]}>
            <View style={s.header}>
                <TouchableOpacity onPress={() => router.back()}><ChevronLeft size={28} color={theme.primary} /></TouchableOpacity>
                <Text style={[s.headerTitle, { color: theme.text }]}>My Learning</Text>
                <View style={{ width: 28 }} />
            </View>

            <FlatList 
                data={materials}
                contentContainerStyle={{ padding: 20 }}
                renderItem={({ item }) => (
                    <View style={[s.item, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <View style={s.itemLeft}>
                            <FileText color={theme.primary} size={24} />
                            <View>
                                <Text style={[s.itemTitle, { color: theme.text }]}>{item.title}</Text>
                                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{item.size}</Text>
                            </View>
                        </View>
                        <TouchableOpacity><Download size={20} color={theme.textSecondary} /></TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingHorizontal: 20, marginBottom: 10 },
    headerTitle: { fontSize: 20, fontWeight: '800' },
    item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderRadius: 20, borderWidth: 1, marginBottom: 15 },
    itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    itemTitle: { fontSize: 16, fontWeight: '700' }
}); 