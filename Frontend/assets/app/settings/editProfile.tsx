import React, { useState, useEffect } from 'react';
import { 
    View, Text, StyleSheet, TouchableOpacity, TextInput, 
    ScrollView, KeyboardAvoidingView, Platform, Alert 
} from 'react-native';
import { ChevronLeft, MapPin, Target, BookOpen, Layers, Award, Clock } from 'lucide-react-native'; 
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

export default function EditProfileScreen() {
    const router = useRouter();
    const { theme, isDarkMode } = useTheme();
    
    // Existing States
    const [name, setName] = useState("");
    const [targetYear, setTargetYear] = useState("");
    const [optionalSubject, setOptionalSubject] = useState("");
    const [location, setLocation] = useState("");
    const [bio, setBio] = useState("");

    // --- NEW UPSC FEATURES ---
    const [attemptCount, setAttemptCount] = useState("1"); // 1st, 2nd, etc.
    const [dailyGoal, setDailyGoal] = useState("8"); // Hours per day
    const [homeState, setHomeState] = useState(""); // For Cadre/State PSC content

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const savedData = await AsyncStorage.getItem('user_profile');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setName(parsed.name || "");
            setTargetYear(parsed.targetYear || "");
            setOptionalSubject(parsed.optionalSubject || "");
            setLocation(parsed.location || "");
            setBio(parsed.bio || "");
            // Load new features
            setAttemptCount(parsed.attemptCount || "1");
            setDailyGoal(parsed.dailyGoal || "8");
            setHomeState(parsed.homeState || "");
        }
    };

    const handleSave = async () => {
        try {
            const profileData = { 
                name, targetYear, optionalSubject, location, bio, 
                attemptCount, dailyGoal, homeState 
            };
            await AsyncStorage.setItem('user_profile', JSON.stringify(profileData));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.back();
        } catch (e) {
            Alert.alert("Error", "Machi, failed to save data.");
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={[s.container, { backgroundColor: theme.background }]}
        >
            <View style={[s.header, { borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={s.headerAction}>
                    <ChevronLeft size={28} color={theme.text} />
                </TouchableOpacity>
                <Text style={[s.headerTitle, { color: theme.text }]}>Aspirant Profile</Text>
                <TouchableOpacity onPress={handleSave} style={s.headerAction}>
                    <Text style={[s.doneText, { color: theme.primary }]}>Done</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
                
                <Text style={[s.sectionTitle, { color: theme.textTertiary }]}>Syllabus & Focus</Text>

                <View style={s.form}>
                    {/* Full Name */}
                    <View style={s.inputGroup}>
                        <Text style={[s.label, { color: theme.textSecondary }]}>Full Name</Text>
                        <TextInput 
                            style={[s.input, { color: theme.text, borderBottomColor: theme.border }]}
                            value={name} onChangeText={setName} 
                            placeholder="Enter your name"
                            placeholderTextColor={theme.textTertiary}
                        />
                    </View>

                    {/* Attempt Number & Target Year Row */}
                    <View style={s.row}>
                        <View style={[s.inputGroup, { flex: 1, marginRight: 10 }]}>
                            <View style={s.labelRow}><Target size={14} color={theme.primary} /><Text style={[s.label, { color: theme.textSecondary }]}>Target Year</Text></View>
                            <TextInput 
                                style={[s.input, { color: theme.text, borderBottomColor: theme.border }]}
                                value={targetYear} onChangeText={setTargetYear} keyboardType="numeric" placeholder="2026"
                            />
                        </View>
                        <View style={[s.inputGroup, { flex: 1 }]}>
                            <View style={s.labelRow}><Layers size={14} color={theme.primary} /><Text style={[s.label, { color: theme.textSecondary }]}>Attempt No.</Text></View>
                            <TextInput 
                                style={[s.input, { color: theme.text, borderBottomColor: theme.border }]}
                                value={attemptCount} onChangeText={setAttemptCount} keyboardType="numeric" placeholder="1"
                            />
                        </View>
                    </View>

                    {/* Optional Subject */}
                    <View style={s.inputGroup}>
                        <View style={s.labelRow}><BookOpen size={14} color={theme.primary} /><Text style={[s.label, { color: theme.textSecondary }]}>Optional Subject</Text></View>
                        <TextInput 
                            style={[s.input, { color: theme.text, borderBottomColor: theme.border }]}
                            value={optionalSubject} onChangeText={setOptionalSubject} placeholder="e.g. Anthropology, PSIR"
                        />
                    </View>

                    <Text style={[s.sectionTitle, { color: theme.textTertiary, marginTop: 10 }]}>Study Habits</Text>

                    {/* Daily Study Goal */}
                    <View style={s.inputGroup}>
                        <View style={s.labelRow}><Clock size={14} color={theme.primary} /><Text style={[s.label, { color: theme.textSecondary }]}>Daily Study Goal (Hours)</Text></View>
                        <TextInput 
                            style={[s.input, { color: theme.text, borderBottomColor: theme.border }]}
                            value={dailyGoal} onChangeText={setDailyGoal} keyboardType="numeric" placeholder="8"
                        />
                    </View>

                    {/* Home State (For Cadre Preference/State PSC) */}
                    <View style={s.inputGroup}>
                        <View style={s.labelRow}><Award size={14} color={theme.primary} /><Text style={[s.label, { color: theme.textSecondary }]}>Home State / Cadre Pref.</Text></View>
                        <TextInput 
                            style={[s.input, { color: theme.text, borderBottomColor: theme.border }]}
                            value={homeState} onChangeText={setHomeState} placeholder="e.g. Tamil Nadu, Bihar"
                        />
                    </View>
                </View>
                
                <View style={[s.infoBox, { backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9' }]}>
                    <Text style={[s.infoText, { color: theme.textSecondary }]}>
                        Machi, these details help us recommend better Peer Groups and Mock Tests tailored to your Optional and State.
                    </Text>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 15, borderBottomWidth: 0.5 },
    headerAction: { width: 60, alignItems: 'center' },
    headerTitle: { fontSize: 18, fontFamily: 'Lexend-Bold' },
    doneText: { fontSize: 16, fontFamily: 'Lexend-Bold' },
    content: { padding: 20 },
    sectionTitle: { fontSize: 12, fontFamily: 'Lexend-Bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 15 },
    form: { width: '100%' },
    row: { flexDirection: 'row' },
    inputGroup: { marginBottom: 25 },
    labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
    label: { fontSize: 13, fontFamily: 'Lexend-Medium' },
    input: { fontSize: 16, fontFamily: 'Lexend-Regular', paddingVertical: 10, borderBottomWidth: 1 },
    infoBox: { padding: 15, borderRadius: 12, marginTop: 10, marginBottom: 40 },
    infoText: { fontSize: 12, fontFamily: 'Lexend-Medium', lineHeight: 18, textAlign: 'center' }
});