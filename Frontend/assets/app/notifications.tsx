import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView, 
    Switch, 
    Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Bell, BookOpen, MessageSquare, Trophy, Zap } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationsScreen() {
    const router = useRouter();
    const { theme, isDarkMode } = useTheme();

    // Master switch and granular switches
    const [isEnabled, setIsEnabled] = useState(true);
    const [settings, setSettings] = useState({
        quizzes: true,
        mentorship: true,
        community: false,
        achievements: true,
    });

    const toggleSetting = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const SettingRow = ({ icon: Icon, title, subtitle, value, onToggle, color }: any) => (
        <View style={[styles.row, { borderBottomColor: theme.border, opacity: isEnabled ? 1 : 0.5 }]}>
            <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: `${color}15` }]}>
                    <Icon size={22} color={color} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.rowTitle, { color: theme.text }]}>{title}</Text>
                    <Text style={[styles.rowSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
                </View>
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                disabled={!isEnabled}
                trackColor={{ false: '#CBD5E1', true: theme.primary }}
                thumbColor={Platform.OS === 'android' ? '#FFFFFF' : ''}
            />
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <SafeAreaView edges={['top']} style={{ backgroundColor: theme.surface }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <ChevronLeft size={28} color={theme.primary} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Notifications</Text>
                    <View style={{ width: 40 }} />
                </View>
            </SafeAreaView>

            <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
                
                {/* MASTER SWITCH CARD */}
                <View style={[styles.masterCard, { backgroundColor: theme.primary + '10', borderColor: theme.primary + '30' }]}>
                    <View style={styles.masterLeft}>
                        <Zap size={24} color={theme.primary} />
                        <View style={{ marginLeft: 12 }}>
                            <Text style={[styles.masterTitle, { color: theme.text }]}>Push Notifications</Text>
                            <Text style={[styles.masterSub, { color: theme.textSecondary }]}>Enable or disable all alerts</Text>
                        </View>
                    </View>
                    <Switch
                        value={isEnabled}
                        onValueChange={setIsEnabled}
                        trackColor={{ false: '#CBD5E1', true: theme.primary }}
                    />
                </View>

                <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Activity Preferences</Text>
                
                <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <SettingRow 
                        icon={Bell} 
                        title="Daily Mock Tests" 
                        subtitle="Alerts when your daily quiz is ready"
                        color="#F59E0B"
                        value={settings.quizzes}
                        onToggle={() => toggleSetting('quizzes')}
                    />
                    <SettingRow 
                        icon={BookOpen} 
                        title="Study Reminders" 
                        subtitle="Follow up on your study schedule"
                        color={theme.primary}
                        value={settings.mentorship}
                        onToggle={() => toggleSetting('mentorship')}
                    />
                    <SettingRow 
                        icon={MessageSquare} 
                        title="Doubt Discussions" 
                        subtitle="Replies to your community posts"
                        color="#10B981"
                        value={settings.community}
                        onToggle={() => toggleSetting('community')}
                    />
                    <SettingRow 
                        icon={Trophy} 
                        title="Milestones" 
                        subtitle="Badges and streak updates"
                        color="#818CF8"
                        value={settings.achievements}
                        onToggle={() => toggleSetting('achievements')}
                    />
                </View>

                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: theme.textTertiary }]}>
                        You can also manage system notifications in your phone's device settings.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    backBtn: { padding: 4 },
    scrollBody: { padding: 20 },
    masterCard: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: 20, 
        borderRadius: 24, 
        borderWidth: 1, 
        marginBottom: 25 
    },
    masterLeft: { flexDirection: 'row', alignItems: 'center' },
    masterTitle: { fontSize: 16, fontWeight: '700' },
    masterSub: { fontSize: 12, marginTop: 2 },
    sectionLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12, marginLeft: 4 },
    card: { borderRadius: 24, borderWidth: 1, overflow: 'hidden' },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18, borderBottomWidth: 1 },
    rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    iconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
    textContainer: { flex: 1, paddingRight: 10 },
    rowTitle: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
    rowSubtitle: { fontSize: 12, lineHeight: 18 },
    footer: { marginTop: 20, paddingHorizontal: 20 },
    footerText: { textAlign: 'center', fontSize: 12, lineHeight: 18 }
});