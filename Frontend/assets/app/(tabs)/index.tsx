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

// --- DATA POOLS (Defined outside to prevent "Cannot find name" errors) ---
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

// --- HELPER COMPONENTS ---
const TypewriterText = ({ text, style, delay = 40, active }: any) => {
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

// --- MAIN HOME SCREEN ---
export default function HomeScreen() {
    const { theme } = useTheme();
    const [currentKural, setCurrentKural] = useState(KURAL_POOL[0]);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const userName = "Buddy";

    // GUARD: Remembers if we already spoke the welcome message
    const hasWelcomed = useRef(false);

    const slideLeftAnim = useRef(new Animated.Value(-20)).current; 
    const kuralFadeAnim = useRef(new Animated.Value(0)).current;
    const timeouts = useRef<any[]>([]);

    const stopAllAudio = () => {
        Speech.stop();
        timeouts.current.forEach(clearTimeout);
        timeouts.current = [];
        setIsSpeaking(false);
    };

    const speakKuralOnly = () => {
        stopAllAudio();
        setIsSpeaking(true);
        Speech.speak(`${currentKural.line1} ${currentKural.line2}`, { language: 'ta-IN', rate: 0.85 });
        const t1 = setTimeout(() => {
            Speech.speak("In English, we say...", { language: 'en-US', rate: 0.9 });
        }, 3500);
        const t2 = setTimeout(() => {
            Speech.speak(currentKural.translation, { language: 'en-US', rate: 1.0 });
            setIsSpeaking(false);
        }, 5500);
        timeouts.current.push(t1, t2);
    };

    const runKuralAnimation = () => {
        setIsTyping(false);
        kuralFadeAnim.setValue(0);
        slideLeftAnim.setValue(-20);
        Animated.parallel([
            Animated.timing(kuralFadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.spring(slideLeftAnim, { toValue: 0, tension: 45, friction: 8, useNativeDriver: true })
        ]).start(() => { setIsTyping(true); });
    };

    useEffect(() => {
        runKuralAnimation();
        
        // ONLY speak welcome if it hasn't happened yet in this session
        if (!hasWelcomed.current) {
            Speech.speak(`Hey, welcome ${userName}!`, { language: 'en-US', rate: 0.9 });
            hasWelcomed.current = true; // Lock it so it doesn't repeat
        }

        return () => stopAllAudio();
    }, []);

    const handleShuffle = () => {
        stopAllAudio();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const filtered = KURAL_POOL.filter(k => k.number !== currentKural.number);
        const next = filtered[Math.floor(Math.random() * filtered.length)];
        setCurrentKural(next);
        runKuralAnimation(); 
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            
            {/* --- FIXED HEADER (One place for welcome text) --- */}
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

            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={styles.scrollContent}
            >
                {/* KURAL SECTION */}
                <Animated.View style={[styles.kuralSection, { opacity: kuralFadeAnim }]}>
                    <View style={styles.kuralHeaderRow}>
                        <Animated.View style={{ flex: 1, transform: [{ translateX: slideLeftAnim }] }}>
                            <TypewriterText 
                                active={isTyping}
                                text={currentKural.line1} 
                                style={[styles.kuralLine, { color: theme.text }]} 
                            />
                            <TypewriterText 
                                active={isTyping}
                                delay={60} 
                                text={currentKural.line2} 
                                style={[styles.kuralLine, { color: theme.text, marginTop: 4 }]} 
                            />
                        </Animated.View>
                        
                        <TouchableOpacity 
                            onPress={isSpeaking ? stopAllAudio : speakKuralOnly}
                            style={[styles.voiceButton, { backgroundColor: isSpeaking ? theme.primary : theme.surface }]}
                        >
                            {isSpeaking ? <VolumeX size={22} color="#FFF" /> : <Volume2 size={22} color={theme.primary} />}
                        </TouchableOpacity>
                    </View>
                    
                    {isTyping && (
                        <View>
                            <Text style={[styles.kuralTranslation, { color: theme.textSecondary }]}>
                                "{currentKural.translation}"
                            </Text>
                            <Text style={[styles.kuralNumber, { color: theme.primary }]}>
                                — Kural {currentKural.number}
                            </Text>
                        </View>
                    )}
                </Animated.View>

                {/* CURRENT AFFAIRS */}
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

                {/* MOCK TEST CHALLENGE */}
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
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 24, 
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 20 : 60,
        paddingBottom: 20,
    },
    scrollContent: { 
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 130 : 170, 
        paddingBottom: 40 
    },
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