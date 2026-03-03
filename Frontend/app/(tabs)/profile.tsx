import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Alert, Image } from 'react-native';
import { 
    User, Settings, Bell, Book, Award, CreditCard, HelpCircle, 
    LogOut, ChevronRight, Edit3, Trash2 
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
    
    const [userData, setUserData] = useState({
        name: "UPSC Aspirant",
        targetYear: "2026",
        optionalSubject: "Optional",
        bio: "Aiming for LBSNAA",
        attemptCount: "1",
        dailyGoal: "8h",
        homeState: "Not Set",
    });

    const menuItems = [
        { icon: Bell, label: 'Notifications', route: '/notifications' },
        { icon: Book, label: 'My Learning', route: '/learning' }, 
        { icon: Award, label: 'Achievements', route: '/achievements' },
        { icon: CreditCard, label: 'Subscription', route: '/subscription' },
        { icon: Settings, label: 'Settings', route: '/settings' },
        { icon: HelpCircle, label: 'Help & Support', route: '/support' }, 
    ];

    const avatarScale = useRef(new Animated.Value(0.9)).current;

    useFocusEffect(
        React.useCallback(() => {
            const loadData = async () => {
                try {
                    const savedData = await AsyncStorage.getItem('user_profile');
                    const savedImg = await AsyncStorage.getItem('user_avatar');
                    if (savedData) setUserData(JSON.parse(savedData));
                    if (savedImg) setProfileImage(savedImg);
                } catch (e) { console.error(e); }
            };
            loadData();
        }, [])
    );

    useEffect(() => {
        Animated.spring(avatarScale, { toValue: 1, friction: 8, useNativeDriver: true }).start();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images', 
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
        Alert.alert(
            "Remove Photo",
            "Are you sure you want to remove your profile picture?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Remove", 
                    style: "destructive", 
                    onPress: async () => {
                        setProfileImage(null);
                        await AsyncStorage.removeItem('user_avatar');
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    } 
                }
            ]
        );
    };

    // Navigation helper for Edit Profile
    const handleEditProfile = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push('/settings/editProfile');
    };

    return (
        <View style={[s.container, { backgroundColor: isDarkMode ? theme.background : '#F8FAFC' }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollPadding}>
                
                {/* Profile Header */}
                <View style={[s.headerSection, { backgroundColor: theme.surface }]}>
                    <View style={s.avatarWrapper}>
                        <Animated.View style={[s.avatarFrame, { transform: [{ scale: avatarScale }] }]}>
                            {profileImage ? (
                                <>
                                    <Image source={{ uri: profileImage }} style={s.avatarImg} />
                                    <TouchableOpacity style={s.trashIconBadge} onPress={removeImage}>
                                        <Trash2 size={14} color="#FFF" />
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    <View style={[s.avatarPlaceholder, { backgroundColor: '#F1F5F9' }]}>
                                        <User size={40} color="#94A3B8" />
                                    </View>
                                    {/* Routing added here to open the edit page */}
                                    <TouchableOpacity style={s.editIconBadge} onPress={handleEditProfile}>
                                        <Edit3 size={14} color="#FFF" />
                                    </TouchableOpacity>
                                </>
                            )}
                        </Animated.View>
                    </View>

                    {/* Make Name/Bio clickable to edit as well */}
                    <TouchableOpacity onPress={handleEditProfile} style={{ alignItems: 'center' }}>
                        <Text style={[s.userName, { color: theme.text }]}>{userData.name}</Text>
                        <Text style={[s.userBio, { color: theme.primary }]}>{userData.bio}</Text>
                    </TouchableOpacity>

                    {/* ADDED: Edit Profile Button */}
                    <TouchableOpacity 
                        style={[s.editProfileBtn, { borderColor: theme.border || '#E2E8F0' }]} 
                        onPress={handleEditProfile}
                    >
                        <Edit3 size={14} color={theme.primary} style={{ marginRight: 6 }} />
                        <Text style={[s.editBtnText, { color: theme.primary }]}>Edit Profile</Text>
                    </TouchableOpacity>

                    <Text style={s.metaText}>{userData.targetYear}  •  {userData.optionalSubject}  •  Attempt {userData.attemptCount}</Text>

                    {/* Stats Grid */}
                    <View style={s.statsRow}>
                        <View style={[s.statCard, { backgroundColor: isDarkMode ? theme.background : '#F1F5F9' }]}>
                            <Text style={s.statLabel}>DAILY GOAL</Text>
                            <Text style={[s.statValue, { color: theme.text }]}>{userData.dailyGoal}</Text>
                        </View>
                        <View style={[s.statCard, { backgroundColor: isDarkMode ? theme.background : '#F1F5F9' }]}>
                            <Text style={s.statLabel}>STATE</Text>
                            <Text style={[s.statValue, { color: theme.text }]}>{userData.homeState}</Text>
                        </View>
                    </View>
                </View>

                {/* Account Menu */}
                <Text style={s.sectionTitle}>ACCOUNT MENU</Text>
                <View style={[s.menuBox, { backgroundColor: theme.surface }]}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={[s.menuItem, index !== menuItems.length - 1 && s.borderBottom]}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                router.push(item.route as any);
                            }}
                        >
                            <View style={s.menuLeft}>
                                <View style={s.iconBg}>
                                    <item.icon size={20} color="#475569" />
                                </View>
                                <Text style={[s.menuLabel, { color: theme.text }]}>{item.label}</Text>
                            </View>
                            <ChevronRight size={18} color="#CBD5E1" />
                        </TouchableOpacity>
                    ))}
                    
                    <TouchableOpacity 
                        style={s.menuItem} 
                        onPress={() => Alert.alert("Logout", "Ready for a break?", [{ text: "Cancel" }, { text: "Logout", style: 'destructive' }])}
                    >
                        <View style={s.menuLeft}>
                            <View style={[s.iconBg, { backgroundColor: '#FEF2F2' }]}>
                                <LogOut size={20} color="#EF4444" />
                            </View>
                            <TouchableOpacity onPress={()=>router.push('/login')}>

                            <Text style={[s.menuLabel, { color: '#EF4444' }]}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Footer Metrics */}
                <View style={s.footerMetrics}>
                    <View style={[s.metricCard, { backgroundColor: theme.surface }]}>
                        <Text style={s.metricLabel}>Weekly Streak</Text>
                        <Text style={[s.metricValue, { color: theme.text }]}>5 Days</Text>
                    </View>
                    <View style={[s.metricCard, { backgroundColor: theme.surface }]}>
                        <Text style={s.metricLabel}>Topics Done</Text>
                        <Text style={[s.metricValue, { color: theme.text }]}>24</Text>
                    </View>
                    <View style={[s.metricCard, { backgroundColor: theme.surface }]}>
                        <Text style={s.metricLabel}>Global Rank</Text>
                        <Text style={[s.metricValue, { color: theme.text }]}>#1,248</Text>
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1 },
    scrollPadding: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 60 },
    headerSection: { borderRadius: 32, padding: 24, alignItems: 'center', marginBottom: 25 },
    avatarWrapper: { marginBottom: 16 },
    avatarFrame: { width: 90, height: 90, borderRadius: 45, padding: 3, backgroundColor: '#E2E8F0' },
    avatarImg: { width: '100%', height: '100%', borderRadius: 45 },
    avatarPlaceholder: { width: '100%', height: '100%', borderRadius: 45, alignItems: 'center', justifyContent: 'center' },
    editIconBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#334155', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFF' },
    trashIconBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#EF4444', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFF' },
    userName: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
    userBio: { fontSize: 14, fontWeight: '600', marginTop: 4, opacity: 0.9 },
    
    // Edit Button Style
    editProfileBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, marginTop: 15, marginBottom: 5 },
    editBtnText: { fontSize: 13, fontWeight: '700' },

    metaText: { fontSize: 12, color: '#94A3B8', marginTop: 8, fontWeight: '600' },
    statsRow: { flexDirection: 'row', gap: 12, marginTop: 24, width: '100%' },
    statCard: { flex: 1, padding: 16, borderRadius: 20, alignItems: 'center' },
    statLabel: { fontSize: 9, fontWeight: '800', color: '#94A3B8', marginBottom: 4 },
    statValue: { fontSize: 18, fontWeight: '800' },
    sectionTitle: { fontSize: 12, fontWeight: '800', color: '#94A3B8', marginBottom: 12, marginLeft: 8 },
    menuBox: { borderRadius: 28, overflow: 'hidden', marginBottom: 25 },
    menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
    menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    iconBg: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
    menuLabel: { fontSize: 15, fontWeight: '600' },
    borderBottom: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    footerMetrics: { flexDirection: 'row', gap: 10 },
    metricCard: { flex: 1, padding: 14, borderRadius: 20, alignItems: 'center' },
    metricLabel: { fontSize: 9, fontWeight: '700', color: '#94A3B8', marginBottom: 4 },
    metricValue: { fontSize: 14, fontWeight: '800' }
});