import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Alert, Image } from 'react-native';
import { 
    User, Settings, Bell, Book, Award, CreditCard, HelpCircle, 
    LogOut, ChevronRight, Camera, Trash2, Target, BookOpen, 
    Layers, Clock, MapPin, EyeOff 
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter, useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext'; 

export default function ProfileScreen() {
    const router = useRouter();
    const { theme, isDarkMode } = useTheme();
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isIncognito, setIsIncognito] = useState(false);
    
    // UPSC Data State
    const [userData, setUserData] = useState({
        name: "UPSC Aspirant",
        targetYear: "2026",
        optionalSubject: "Optional",
        bio: "Aiming for LBSNAA",
        attemptCount: "1",
        dailyGoal: "8",
        homeState: "Not Set",
        location: "Delhi"
    });

    const menuItems = [
        { icon: Bell, label: 'Notifications', color: theme.primary, route: '/notifications' },
        { icon: Book, label: 'My Learning', color: isDarkMode ? '#38BDF8' : theme.accent, route: '/learning' }, 
        { icon: Award, label: 'Achievements', color: '#FBBF24', route: '/achievements' },
        { icon: CreditCard, label: 'Subscription', color: theme.primary, route: '/subscription' },
        { icon: Settings, label: 'Settings', color: isDarkMode ? '#94A3B8' : theme.textSecondary, route: '/settings' },
        { icon: HelpCircle, label: 'Help & Support', color: isDarkMode ? '#A78BFA' : '#8B5CF6', route: '/support' }, 
    ];

    const avatarScale = useRef(new Animated.Value(0)).current;

    // Load data whenever the screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            const loadData = async () => {
                try {
                    const savedData = await AsyncStorage.getItem('user_profile');
                    const savedImg = await AsyncStorage.getItem('user_avatar');
                    const incognito = await AsyncStorage.getItem('incognito_mode');
                    
                    if (savedData) setUserData(JSON.parse(savedData));
                    if (savedImg) setProfileImage(savedImg);
                    if (incognito !== null) setIsIncognito(JSON.parse(incognito));
                } catch (e) {
                    console.error("Failed to load profile data", e);
                }
            };
            loadData();
        }, [])
    );

    useEffect(() => {
        Animated.spring(avatarScale, { toValue: 1, tension: 50, useNativeDriver: true }).start();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setProfileImage(uri);
            await AsyncStorage.setItem('user_avatar', uri);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    };

    const removeImage = async () => {
        setProfileImage(null);
        await AsyncStorage.removeItem('user_avatar');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const handleLogout = () => {
        Alert.alert("Logout", "Are you sure you want to take a break, Buddy?", [
            { text: "Cancel", style: "cancel" },
            { 
                text: "Logout", 
                style: "destructive", 
                onPress: () => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                    // router.replace('/login');
                } 
            }
        ]);
    };

    return (
        <View style={[s.container, { backgroundColor: theme.background }]}>
            {/* Header with Incognito Badge */}
            <View style={[s.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Text style={[s.headerTitle, { color: theme.text }]}>Profile</Text>
                    {isIncognito && (
                        <View style={s.incognitoBadge}>
                            <EyeOff size={12} color="#FFFFFF" />
                            <Text style={s.incognitoText}>INCOGNITO</Text>
                        </View>
                    )}
                </View>
            </View>

            <ScrollView style={s.scrollView} showsVerticalScrollIndicator={false}>
                <View style={s.content}>
                    <View style={[s.profileCard, { backgroundColor: theme.surface }]}>
                        
                        {/* Avatar Section */}
                        <View style={s.avatarSection}>
                            <Animated.View style={[s.avatar, { backgroundColor: theme.primary, transform: [{ scale: avatarScale }], overflow: 'hidden' }]}>
                                {profileImage ? (
                                    <Image source={{ uri: profileImage }} style={s.fullImg} />
                                ) : (
                                    <User size={40} color="#FFFFFF" />
                                )}
                            </Animated.View>

                            <View style={s.photoActionRow}>
                                <TouchableOpacity 
                                    style={[s.photoBtn, { backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9' }]} 
                                    onPress={pickImage}
                                >
                                    <Camera size={14} color={theme.primary} />
                                    <Text style={[s.btnText, { color: theme.text }]}>Change</Text>
                                </TouchableOpacity>

                                {profileImage && (
                                    <TouchableOpacity 
                                        style={[s.photoBtn, { backgroundColor: isDarkMode ? '#2D1B1E' : '#FEF2F2' }]} 
                                        onPress={removeImage}
                                    >
                                        <Trash2 size={14} color="#EF4444" />
                                        <Text style={[s.btnText, { color: '#EF4444' }]}>Remove</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                        
                        <Text style={[s.userName, { color: theme.text }]}>{userData.name}</Text>
                        
                        <View style={s.badgeRow}>
                            <View style={[s.badge, { backgroundColor: isDarkMode ? '#1E293B' : '#EEF2FF' }]}>
                                <Target size={12} color={theme.primary} />
                                <Text style={[s.badgeText, { color: theme.primary }]}>{userData.targetYear}</Text>
                            </View>
                            <View style={[s.badge, { backgroundColor: isDarkMode ? '#1E293B' : '#EEF2FF' }]}>
                                <BookOpen size={12} color={theme.primary} />
                                <Text style={[s.badgeText, { color: theme.primary }]}>{userData.optionalSubject}</Text>
                            </View>
                            <View style={[s.badge, { backgroundColor: isDarkMode ? '#1E293B' : '#EEF2FF' }]}>
                                <Layers size={12} color={theme.primary} />
                                <Text style={[s.badgeText, { color: theme.primary }]}>Attempt {userData.attemptCount}</Text>
                            </View>
                        </View>

                        <Text style={[s.userBio, { color: theme.textSecondary }]}>{userData.bio}</Text>

                        {/* UPSC Stats Bar */}
                        <View style={[s.statsBar, { borderTopColor: theme.border, borderBottomColor: theme.border }]}>
                            <View style={s.statItem}>
                                <Clock size={16} color={theme.primary} />
                                <Text style={[s.statLabel, { color: theme.textSecondary }]}>Daily Goal</Text>
                                <Text style={[s.statValue, { color: theme.text }]}>{userData.dailyGoal}h</Text>
                            </View>
                            <View style={s.statDivider} />
                            <View style={s.statItem}>
                                <MapPin size={16} color={theme.primary} />
                                <Text style={[s.statLabel, { color: theme.textSecondary }]}>State</Text>
                                <Text style={[s.statValue, { color: theme.text }]} numberOfLines={1}>{userData.homeState}</Text>
                            </View>
                        </View>

                        <TouchableOpacity 
                            style={[s.editBtn, { borderColor: theme.border, marginTop: 15 }]} 
                            onPress={() => router.push('/settings/editProfile' as any)}
                        >
                            <Text style={[s.editBtnText, { color: theme.text }]}>Edit Profile</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Menu Items Section */}
                    <View style={[s.menuSection, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        {menuItems.map((item, index) => (
                            <TouchableOpacity 
                                key={index} 
                                style={[s.menuItem, { borderBottomColor: theme.border }]}
                                onPress={() => router.push(item.route as any)}
                            >
                                <View style={s.menuItemLeft}>
                                    <View style={[s.menuIconContainer, { backgroundColor: isDarkMode ? `${item.color}25` : `${item.color}15` }]}>
                                        <item.icon size={20} color={item.color} />
                                    </View>
                                    <Text style={[s.menuItemText, { color: theme.text }]}>{item.label}</Text>
                                </View>
                                <ChevronRight size={20} color={theme.textSecondary} />
                            </TouchableOpacity>
                        ))}

                        {/* Logout Row */}
                        <TouchableOpacity 
                            style={[s.menuItem, { borderBottomWidth: 0 }]}
                            onPress={handleLogout}
                        >
                            <View style={s.menuItemLeft}>
                                <View style={[s.menuIconContainer, { backgroundColor: '#FEF2F2' }]}>
                                    <LogOut size={20} color="#EF4444" />
                                </View>
                                <Text style={[s.menuItemText, { color: '#EF4444' }]}>Logout</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1 },
    scrollView: { flex: 1 },
    header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, borderBottomWidth: 1 },
    headerTitle: { fontSize: 32, fontWeight: '800' },
    incognitoBadge: { backgroundColor: '#6366F1', flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    incognitoText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
    content: { padding: 20 },
    profileCard: { borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 20 },
    avatarSection: { alignItems: 'center', marginBottom: 15 },
    avatar: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
    fullImg: { width: '100%', height: '100%' },
    photoActionRow: { flexDirection: 'row', gap: 10 },
    photoBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
    btnText: { fontSize: 12, fontWeight: '600' },
    userName: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
    badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap', justifyContent: 'center' },
    badge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    badgeText: { fontSize: 11, fontWeight: '700' },
    userBio: { fontSize: 14, textAlign: 'center', marginBottom: 20, opacity: 0.7 },
    statsBar: { flexDirection: 'row', width: '100%', paddingVertical: 15, borderTopWidth: 0.5, borderBottomWidth: 0.5, marginTop: 10 },
    statItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    statLabel: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', marginBottom: 2 },
    statValue: { fontSize: 14, fontWeight: '700' },
    statDivider: { width: 1, height: '60%', backgroundColor: '#CBD5E1', opacity: 0.3 },
    editBtn: { width: '100%', paddingVertical: 12, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
    editBtnText: { fontSize: 14, fontWeight: '700' },
    menuSection: { borderRadius: 24, overflow: 'hidden', borderWidth: 1 },
    menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderBottomWidth: 1 },
    menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    menuIconContainer: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    menuItemText: { fontSize: 16, fontWeight: '600' },
});