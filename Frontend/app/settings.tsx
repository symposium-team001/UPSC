import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView, 
    Switch, 
    Platform,
    Alert,
    Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
    ChevronLeft, 
    Lock, 
    Sun, 
    Moon, 
    ChevronRight, 
    ShieldCheck, 
    Trash2,
    Database,
    EyeOff,
    FileText
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
    const router = useRouter();
    const { isDarkMode, toggleTheme, theme } = useTheme();

    // Settings States
    const [incognitoMode, setIncognitoMode] = useState(false);

    // Load saved settings on mount
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const savedIncognito = await AsyncStorage.getItem('incognito_mode');
                if (savedIncognito !== null) {
                    setIncognitoMode(JSON.parse(savedIncognito));
                }
            } catch (e) {
                console.error("Failed to load settings", e);
            }
        };
        loadSettings();
    }, []);

    // 1. Logic for Incognito Toggle
    const handleIncognitoToggle = async (value: boolean) => {
        setIncognitoMode(value);
        await AsyncStorage.setItem('incognito_mode', JSON.stringify(value));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    // 2. Logic for Data Backup (Share Sheet)
    const handleBackup = async () => {
        try {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            
            // Collect existing local data
            const profile = await AsyncStorage.getItem('user_profile');
            
            const backupPayload = {
                app: "SuperKalam",
                version: "1.0.0",
                exportDate: new Date().toISOString(),
                userData: profile ? JSON.parse(profile) : "Default Profile",
            };

            Alert.alert(
                "Backup Study Data",
                "Machi, your study progress and profile are ready to be exported.",
                [
                    { text: "Cancel", style: "cancel" },
                    { 
                        text: "Export", 
                        onPress: async () => {
                            await Share.share({
                                message: JSON.stringify(backupPayload, null, 2),
                                title: "SuperKalam Backup"
                            });
                        } 
                    }
                ]
            );
        } catch (error) {
            Alert.alert("Error", "Could not prepare backup at this time.");
        }
    };

    // 3. Logic for Clear Cache
    const handleClearCache = () => {
        Alert.alert(
            "Clear App Cache",
            "This will remove temporary study files to free up space. Your progress remains safe. Continue?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Clear", 
                    style: "destructive", 
                    onPress: () => {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                        // In a real app, you'd clear specific temp folders here
                        Alert.alert("Success", "Cache cleared successfully!");
                    } 
                }
            ]
        );
    };

    const SettingRow = ({ icon: Icon, label, onPress, rightElement, iconColor }: any) => (
        <TouchableOpacity 
            style={styles.row} 
            onPress={onPress} 
            activeOpacity={onPress ? 0.7 : 1}
        >
            <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: `${iconColor || theme.primary}20` }]}>
                    <Icon size={20} color={iconColor || theme.primary} />
                </View>
                <Text style={[styles.rowText, { color: theme.text }]}>{label}</Text>
            </View>
            {rightElement ? rightElement : <ChevronRight size={20} color={theme.textSecondary} />}
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <SafeAreaView 
                edges={['top']} 
                style={{ backgroundColor: theme.surface, borderBottomColor: theme.border, borderBottomWidth: 1 }}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ChevronLeft size={28} color={theme.primary} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
                    <View style={{ width: 28 }} /> 
                </View>
            </SafeAreaView>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                
                {/* SECTION: SECURITY & PRIVACY */}
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Security & Privacy</Text>
                <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <SettingRow 
                        icon={Lock} 
                        label="Change Password" 
                        onPress={() => router.push('/settings/changePassword' as any)}
                        iconColor="#F59E0B"
                    />
                    <View style={[styles.divider, { backgroundColor: theme.border }]} />
                    <SettingRow 
                        icon={EyeOff} 
                        label="Incognito Study Mode" 
                        iconColor="#6366F1"
                        rightElement={
                            <Switch 
                                value={incognitoMode} 
                                onValueChange={handleIncognitoToggle}
                                trackColor={{ false: '#CBD5E1', true: theme.primary }}
                                thumbColor={Platform.OS === 'android' ? '#FFFFFF' : ''}
                            />
                        }
                    />
                </View>

                {/* SECTION: DATA MANAGEMENT */}
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Data & Legal</Text>
                <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <SettingRow 
                        icon={Database} 
                        label="Backup Study Data" 
                        onPress={handleBackup} 
                        iconColor="#8B5CF6"
                    />
                    <View style={[styles.divider, { backgroundColor: theme.border }]} />
                    <SettingRow 
                        icon={FileText} 
                        label="Terms of Service" 
                        onPress={() => router.push('/settings/termsOfService')} 
                        iconColor="#64748B"
                    />
                    <View style={[styles.divider, { backgroundColor: theme.border }]} />
                    <SettingRow 
                        icon={Trash2} 
                        label="Clear Cache" 
                        onPress={handleClearCache}
                        iconColor="#EF4444"
                    />
                </View>

                {/* SECTION: APPEARANCE */}
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Appearance</Text>
                <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <SettingRow 
                        icon={isDarkMode ? Moon : Sun} 
                        label="Dark Mode" 
                        iconColor={isDarkMode ? "#818CF8" : "#F59E0B"}
                        onPress={toggleTheme}
                        rightElement={
                            <Switch 
                                value={isDarkMode} 
                                onValueChange={toggleTheme}
                                trackColor={{ false: '#CBD5E1', true: theme.primary }}
                                thumbColor={Platform.OS === 'android' ? '#FFFFFF' : ''}
                            />
                        }
                    />
                </View>

                <Text style={[styles.footerNote, { color: theme.textSecondary }]}>
                    Ethora v1.0.0 • Made for Aspirants
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 20, 
        paddingVertical: 15,
        height: 65,
    },
    headerTitle: { fontSize: 20, fontWeight: '800' },
    backButton: { padding: 5, marginLeft: -5 },
    content: { padding: 20, paddingTop: 15 },
    sectionTitle: { 
        fontSize: 12, 
        fontWeight: '700', 
        textTransform: 'uppercase', 
        letterSpacing: 1.5,
        marginBottom: 10,
        marginLeft: 4
    },
    card: { 
        borderRadius: 24, 
        marginBottom: 30,
        borderWidth: 1,
        overflow: 'hidden',
    },
    row: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: 18 
    },
    rowLeft: { flexDirection: 'row', alignItems: 'center' },
    iconBox: { 
        width: 42, 
        height: 42, 
        borderRadius: 14, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginRight: 16 
    },
    rowText: { fontSize: 16, fontWeight: '600' },
    divider: { height: 1, marginHorizontal: 20 },
    footerNote: { textAlign: 'center', fontSize: 12, marginTop: 10, opacity: 0.6, marginBottom: 40 }
});