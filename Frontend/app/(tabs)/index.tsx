import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Animated, Dimensions, Platform, StatusBar
} from 'react-native';
import { RefreshCcw, Zap, Globe, Volume2, VolumeX } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { useTheme } from '../../context/ThemeContext';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const KURAL_POOL = [
    { 
        number: 391, 
        line1: "கற்க கசடறக் கற்பவை கற்றபின்", 
        line2: "நிற்க அதற்குத் தக.", 
        translation: "Learn perfectly what should be learned; and then live according to that learning." 
    },
    { 
        number: 666, 
        line1: "எண்ணிய எண்ணியாங்கு எய்துப எண்ணியார்", 
        line2: "திண்ணியர் ஆகப் பெறின்.", 
        translation: "If those who have planned an undertaking possess firmness of mind, they will certainly achieve what they desired." 
    },
    { 
        number: 392, 
        line1: "எண்ணென்ப ஏனை எழுத்தென்ப இவ்விரண்டும்", 
        line2: "கண்ணென்ப வாழும் உயிர்க்கு.", 
        translation: "Letters and numbers are the two eyes of living beings." 
    }
];

const AFFAIRS_DATA = [
    { id: '1', category: 'POLITY', title: 'New Bill on Digital Data Protection tabled in Parliament.', readTime: '2 min read' },
    { id: '2', category: 'ECONOMY', title: 'RBI maintains Repo Rate at 6.5% for the fourth time.', readTime: '3 min read' },
];

const TypewriterText = ({ text, style, delay = 30, active }: any) => {
    const [displayedText, setDisplayedText] = useState("");
    useEffect(() => {
        if (!active) { setDisplayedText(""); return; }
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex <= text.length) {
                setDisplayedText(text.substring(0, currentIndex));
                currentIndex++;
            } else { clearInterval(interval); }
        }, delay);
        return () => clearInterval(interval);
    }, [text, active]);
    return <Text style={style}>{displayedText}</Text>;
};

export default function HomeScreen() {
    const { theme } = useTheme();
    const [currentKural, setCurrentKural] = useState(KURAL_POOL[0]);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const userName = "Buddy";

    // GUARD: Persistent welcome check
    const hasWelcomed = useRef(false);
    const slideLeftAnim = useRef(new Animated.Value(-20)).current; 
    const kuralFadeAnim = useRef(new Animated.Value(0)).current;

    const stopAllAudio = () => {
        Speech.stop();
        setIsSpeaking(false);
    };

    const speakKuralOnly = () => {
        stopAllAudio();
        setIsSpeaking(true);

        // 1. Speak Tamil immediately (Using 'ta' as fallback)
        Speech.speak(`${currentKural.line1}. ${currentKural.line2}`, { 
            language: 'ta', 
            rate: 0.9,
            pitch: 1.0,
            onDone: () => {
                // 2. Speak English as soon as Tamil finishes (No more hardcoded timeouts)
                Speech.speak(`In English: ${currentKural.translation}`, {
                    language: 'en-US',
                    rate: 1.0,
                    onDone: () => setIsSpeaking(false)
                });
            },
            onError: () => setIsSpeaking(false)
        });
    };

    const runKuralAnimation = () => {
        setIsTyping(false);
        kuralFadeAnim.setValue(0);
        slideLeftAnim.setValue(-20);
        Animated.parallel([
            Animated.timing(kuralFadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.spring(slideLeftAnim, { toValue: 0, tension: 50, friction: 7, useNativeDriver: true })
        ]).start(() => { setIsTyping(true); });
    };

    useEffect(() => {
        runKuralAnimation();
        
        // STRICT ONE-TIME WELCOME (Checks if it already happened)
        if (!hasWelcomed.current) {
            Speech.speak(`Hey, welcome ${userName}!`, { language: 'en-US', rate: 1.0 });
            hasWelcomed.current = true; 
        }

        return () => stopAllAudio();
    }, []);

    const handleShuffle = () => {
        stopAllAudio();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const filtered = KURAL_POOL.filter(k => k.number !== currentKural.number);
        const next = filtered[Math.floor(Math.random() * filtered.length)];
        setCurrentKural(next);
        runKuralAnimation(); 
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.fixedHeader, { backgroundColor: theme.background }]}>
                <View>
                    <Text style={[styles.dateText, { color: theme.textSecondary }]}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long' })}
                    </Text>
                    <Text style={[styles.userName, { color: theme.text }]}>Hey, welcome {userName}!</Text>
                </View>
                <TouchableOpacity onPress={handleShuffle} style={[styles.shuffleButton, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <RefreshCcw size={20} color={theme.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Animated.View style={[styles.kuralSection, { opacity: kuralFadeAnim }]}>
                    <View style={styles.kuralHeaderRow}>
                        <Animated.View style={{ flex: 1, transform: [{ translateX: slideLeftAnim }] }}>
                            <TypewriterText active={isTyping} text={currentKural.line1} style={[styles.kuralLine, { color: theme.text }]} />
                            <TypewriterText active={isTyping} delay={50} text={currentKural.line2} style={[styles.kuralLine, { color: theme.text, marginTop: 4 }]} />
                        </Animated.View>
                        <TouchableOpacity onPress={isSpeaking ? stopAllAudio : speakKuralOnly} style={[styles.voiceButton, { backgroundColor: isSpeaking ? theme.primary : theme.surface }]}>
                            {isSpeaking ? <VolumeX size={22} color="#FFF" /> : <Volume2 size={22} color={theme.primary} />}
                        </TouchableOpacity>
                    </View>
                    {isTyping && (
                        <View>
                            <Text style={[styles.kuralTranslation, { color: theme.textSecondary }]}>"{currentKural.translation}"</Text>
                            <Text style={[styles.kuralNumber, { color: theme.primary }]}>— Kural {currentKural.number}</Text>
                        </View>
                    )}
                </Animated.View>

                {/* --- Section Title and Horizontal Scroll for Current Affairs --- */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Current Affairs</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 24, paddingRight: 10 }}>
                        {AFFAIRS_DATA.map((item) => (
                            <TouchableOpacity key={item.id} style={[styles.affairsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                                <Text style={[styles.categoryText, { color: theme.primary }]}>{item.category}</Text>
                                <Text style={[styles.affairsTitle, { color: theme.text }]}>{item.title}</Text>
                                <View style={styles.affairsFooter}>
                                    <Globe size={12} color={theme.textSecondary} />
                                    <Text style={[styles.readTime, { color: theme.textSecondary }]}>{item.readTime}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* --- Mock Test Banner --- */}
                <View style={[styles.mockCard, { backgroundColor: theme.primary, marginTop: 30 }]}>
                    <View style={styles.mockContent}>
                        <Zap size={22} color="#FFF" fill="#FFF" />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.mockTitle}>Ready for a Challenge?</Text>
                            <Text style={styles.mockSub}>Quick 10-question Mini Mock Test</Text>
                        </View>
                        <TouchableOpacity style={styles.mockBtn} onPress={() => router.push('/practice')}>
                            <Text style={[styles.mockBtnText, { color: theme.primary }]}>Start Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    fixedHeader: { 
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, flexDirection: 'row', 
        justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, 
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 20 : 60, paddingBottom: 20,
    },
    scrollContent: { paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 130 : 170, paddingBottom: 40 },
    dateText: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
    userName: { fontSize: 26, fontWeight: '800' },
    shuffleButton: { width: 48, height: 48, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    kuralSection: { paddingHorizontal: 24, marginBottom: 35 },
    kuralHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 },
    kuralLine: { fontSize: 20, fontWeight: '900', lineHeight: 28 },
    voiceButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', elevation: 2 },
    kuralTranslation: { fontSize: 15, lineHeight: 22, marginBottom: 4, fontStyle: 'italic' },
    kuralNumber: { fontSize: 13, fontWeight: '800', opacity: 0.6 },
    affairsCard: { width: width * 0.7, padding: 18, borderRadius: 24, marginRight: 16, borderWidth: 1, height: 150, justifyContent: 'space-between' },
    categoryText: { fontSize: 10, fontWeight: '800' },
    affairsTitle: { fontSize: 15, fontWeight: '700' },
    affairsFooter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    readTime: { fontSize: 11 },
    mockCard: { marginHorizontal: 24, padding: 20, borderRadius: 24 },
    mockContent: { flexDirection: 'row', alignItems: 'center' },
    mockTitle: { color: '#FFF', fontSize: 16, fontWeight: '800' },
    mockSub: { color: '#FFF', fontSize: 12, opacity: 0.8 },
    mockBtn: { backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
    mockBtnText: { fontSize: 12, fontWeight: '900' },
    section: { marginTop: 10 },
    sectionTitle: { fontSize: 20, fontWeight: '800', paddingHorizontal: 24, marginBottom: 15 },
});