import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Flame, Award, Target, Star, Lock } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

const ACHIEVEMENTS = [
    { id: 1, title: 'Early Bird', desc: 'Login before 6 AM', icon: <Flame size={32} color="#FF8C00" />, color: '#FFF4E6', progress: 1, total: 1 },
    { id: 2, title: 'Polity King', desc: '50 Correct Answers', icon: <Award size={32} color="#6366F1" />, color: '#EEF2FF', progress: 1, total: 1 },
    { id: 3, title: 'Streak 10', desc: '10 Day Study Streak', icon: <Target size={32} color="#10B981" />, color: '#ECFDF5', progress: 0.7, total: 1 },
    { id: 4, title: 'Top Scorer', desc: 'Rank #1 in Mock Test', icon: <Star size={32} color="#F59E0B" />, color: '#FFFBEB', progress: 0.4, total: 1 },
    { id: 5, title: 'Mains Pro', desc: '10 Answers Evaluated', icon: <Lock size={28} color="#94A3B8" />, color: '#F1F5F9', progress: 0, total: 1, locked: true },
];

export default function AchievementScreen() {
    const { theme } = useTheme();
    const router = useRouter();

    return (
        <SafeAreaView style={[s.container, { backgroundColor: theme.background }]}>
            {/* Added StatusBar padding for Android/iOS consistency */}
            <View style={s.topSpacer} />

            {/* Header */}
            <View style={s.header}>
                <TouchableOpacity 
                    onPress={() => router.push('/profile')} 
                    style={[s.backBtn, { backgroundColor: theme.surface }]}
                >
                    <ChevronLeft size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[s.headerTitle, { color: theme.text }]}>Badges & Honors</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView 
                contentContainerStyle={s.content} 
                showsVerticalScrollIndicator={false}
            >
                {/* Level Progress Card */}
                <Animated.View 
                    entering={FadeInDown.delay(100)} 
                    style={[s.levelCard, { backgroundColor: '#0F172A' }]}
                >
                    <View>
                        <Text style={s.levelText}>UPSC Aspirant Level 4</Text>
                        <Text style={s.xpText}>1,240 XP to Level 5</Text>
                    </View>
                    <Award color="#4C848C" size={40} />
                </Animated.View>

                <Text style={[s.sectionTitle, { color: theme.text }]}>Your Collection</Text>

                <View style={s.grid}>
                    {ACHIEVEMENTS.map((item, index) => (
                        <Animated.View 
                            key={item.id} 
                            entering={FadeInDown.delay(200 + (index * 100))}
                            style={[
                                s.badgeCard, 
                                { 
                                    backgroundColor: theme.surface, 
                                    opacity: item.locked ? 0.6 : 1 
                                }
                            ]}
                        >
                            <View style={[s.iconCircle, { backgroundColor: item.color }]}>
                                {item.icon}
                            </View>
                            
                            <Text style={[s.badgeTitle, { color: theme.text }]}>{item.title}</Text>
                            <Text style={[s.badgeDesc, { color: theme.textSecondary }]}>{item.desc}</Text>

                            {/* Progress Bar */}
                            <View style={s.progressTrack}>
                                <View 
                                    style={[
                                        s.progressBar, 
                                        { 
                                            width: `${item.progress * 100}%`, 
                                            backgroundColor: item.locked ? '#CBD5E1' : '#4C848C' 
                                        }
                                    ]} 
                                />
                            </View>
                        </Animated.View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    container: { 
        flex: 1,
    },
    topSpacer: {
        height: Platform.OS === 'android' ? StatusBar.currentHeight : 10,
    },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 20, 
        paddingTop: 15, // Extra padding top for header
        paddingBottom: 15 
    },
    headerTitle: { 
        fontSize: 18, 
        fontWeight: '800' 
    },
    backBtn: { 
        width: 44, 
        height: 44, 
        borderRadius: 22, 
        justifyContent: 'center', 
        alignItems: 'center', 
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2
    },
    content: { 
        paddingHorizontal: 20, 
        paddingTop: 10, // Added padding at the top of scroll content
        paddingBottom: 40 
    },
    levelCard: { 
        padding: 25, 
        borderRadius: 24, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 30, 
        marginTop: 5 
    },
    levelText: { 
        color: '#FFF', 
        fontSize: 18, 
        fontWeight: '800' 
    },
    xpText: { 
        color: '#94A3B8', 
        fontSize: 14, 
        marginTop: 4 
    },
    sectionTitle: { 
        fontSize: 20, 
        fontWeight: '800', 
        marginBottom: 20 
    },
    grid: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between', 
        gap: 15 
    },
    badgeCard: { 
        width: (width / 2) - 28, 
        padding: 20, 
        borderRadius: 24, 
        alignItems: 'center',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5
    },
    iconCircle: { 
        width: 70, 
        height: 70, 
        borderRadius: 35, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: 15 
    },
    badgeTitle: { 
        fontSize: 15, 
        fontWeight: '800', 
        textAlign: 'center' 
    },
    badgeDesc: { 
        fontSize: 12, 
        textAlign: 'center', 
        marginTop: 4, 
        height: 32 
    },
    progressTrack: { 
        width: '100%', 
        height: 6, 
        backgroundColor: '#F1F5F9', 
        borderRadius: 3, 
        marginTop: 15, 
        overflow: 'hidden' 
    },
    progressBar: { 
        height: '100%', 
        borderRadius: 3 
    }
});