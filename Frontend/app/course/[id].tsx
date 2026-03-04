import React, { useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Animated, Platform, Dimensions, SafeAreaView
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import {
    ChevronLeft, PlayCircle, Clock, BookOpen, Star, ShieldCheck
} from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export default function CourseEnrollmentScreen() {
    const { id } = useLocalSearchParams();
    const { theme } = useTheme();

    // Breakpoints strategy
    const isDesktop = isWeb && width >= 1024;
    const isTablet = width >= 768 && width < 1024;

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true
        }).start();
    }, []);

    const mockCourse = {
        title: "UPSC Standard Modules 2026",
        category: "PRELIMS + MAINS",
        instructor: "Editorial Team",
        duration: "180 Hours",
        rating: 4.9,
        students: "12,400+",
        description: "Comprehensive coverage of History, Polity, Geography, and Economy specifically tailored for the 2026 UPSC Examination. Master the UPSC Syllabus effortlessly with structured content, daily routines, and analytical exercises.",
        modules: [
            "Ancient & Medieval History",
            "Indian Polity & Governance",
            "Physical & Human Geography",
            "Macroeconomics & Current Trends"
        ]
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header / Nav */}
            <View style={[styles.header, { borderBottomColor: theme.border, backgroundColor: theme.surface }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Course Enrollment</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View style={[
                    styles.contentWrapper,
                    isDesktop ? styles.desktopWrapper : isTablet ? styles.tabletWrapper : null,
                    { opacity: fadeAnim }
                ]}>

                    {/* Course Banner Info */}
                    <View style={styles.mainInfo}>
                        <View style={[styles.badge, { backgroundColor: theme.primary + '20' }]}>
                            <Text style={[styles.badgeText, { color: theme.primary }]}>{mockCourse.category}</Text>
                        </View>

                        <Text style={[styles.courseTitle, { color: theme.text }]}>Course #{id ? id : 'Details'}: {mockCourse.title}</Text>

                        <View style={styles.metaRow}>
                            <View style={styles.metaItem}>
                                <Star size={16} color="#F59E0B" fill="#F59E0B" />
                                <Text style={[styles.metaText, { color: theme.textSecondary }]}>{mockCourse.rating} ({mockCourse.students})</Text>
                            </View>
                            <View style={styles.metaItem}>
                                <Clock size={16} color={theme.textSecondary} />
                                <Text style={[styles.metaText, { color: theme.textSecondary }]}>{mockCourse.duration}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Desktop Two-Column Layout Container */}
                    <View style={isDesktop ? styles.desktopColumns : null}>

                        {/* Left Column (Content Details) */}
                        <View style={isDesktop ? styles.desktopLeftCol : null}>
                            <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                                <Text style={[styles.sectionTitle, { color: theme.text }]}>About Course</Text>
                                <Text style={[styles.description, { color: theme.textSecondary }]}>{mockCourse.description}</Text>
                            </View>

                            <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                                <Text style={[styles.sectionTitle, { color: theme.text }]}>What you'll learn</Text>
                                {mockCourse.modules.map((mod, idx) => (
                                    <View key={idx} style={styles.moduleItem}>
                                        <BookOpen size={20} color={theme.primary} />
                                        <Text style={[styles.moduleText, { color: theme.text }]}>{mod}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Right Column (Enrollment Card) */}
                        <View style={isDesktop ? styles.desktopRightCol : null}>
                            <View style={[styles.enrollCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                                <View style={styles.enrollImagePlaceholder}>
                                    <PlayCircle size={48} color="#FFF" />
                                </View>
                                <View style={styles.enrollDetails}>
                                    <Text style={[styles.price, { color: theme.text }]}>Free Access</Text>
                                    <Text style={[styles.accessText, { color: theme.textSecondary }]}>Full lifetime access</Text>

                                    <TouchableOpacity
                                        style={[styles.enrollBtn, { backgroundColor: theme.primary }]}
                                        onPress={() => router.push('/subscription')}
                                    >
                                        <Text style={styles.enrollBtnText}>Enroll Now</Text>
                                    </TouchableOpacity>

                                    <View style={styles.guarantee}>
                                        <ShieldCheck size={16} color={theme.textSecondary} />
                                        <Text style={[styles.guaranteeText, { color: theme.textSecondary }]}>Premium Quality Guarantee</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                    </View>

                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    backButton: { padding: 8 },
    headerTitle: { fontSize: 18, fontWeight: '700' },
    headerRight: { width: 40 },
    scrollContent: { paddingBottom: 40 },

    contentWrapper: { padding: 16 },
    tabletWrapper: { paddingHorizontal: 40 },
    desktopWrapper: { alignSelf: 'center', width: '100%', maxWidth: 1100, paddingVertical: 32 },

    mainInfo: { marginBottom: 24, marginTop: 12 },
    badge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 12 },
    badgeText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
    courseTitle: { fontSize: 32, fontWeight: '800', marginBottom: 16, lineHeight: 40 },
    metaRow: { flexDirection: 'row', gap: 16, alignItems: 'center' },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    metaText: { fontSize: 14, fontWeight: '600' },

    desktopColumns: { flexDirection: 'row', gap: 32, alignItems: 'flex-start' },
    desktopLeftCol: { flex: 2 },
    desktopRightCol: { flex: 1 },

    section: {
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 24
    },
    sectionTitle: { fontSize: 20, fontWeight: '800', marginBottom: 16 },
    description: { fontSize: 16, lineHeight: 26 },

    moduleItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
    moduleText: { fontSize: 16, fontWeight: '600' },

    enrollCard: {
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
        marginBottom: 24
    },
    enrollImagePlaceholder: {
        height: 200,
        backgroundColor: '#1E293B',
        alignItems: 'center',
        justifyContent: 'center'
    },
    enrollDetails: { padding: 24 },
    price: { fontSize: 28, fontWeight: '800', marginBottom: 4 },
    accessText: { fontSize: 14, marginBottom: 24 },
    enrollBtn: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16
    },
    enrollBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
    guarantee: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
    guaranteeText: { fontSize: 13, fontWeight: '600' }
});
