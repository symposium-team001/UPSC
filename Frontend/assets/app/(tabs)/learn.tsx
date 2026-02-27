import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Platform } from 'react-native';
import { BookOpen, Globe, Scale, TrendingUp, Leaf, Cpu } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext'; // Dynamic Theme Hook
import { modules } from '../../mocks/modules';

const iconMap: Record<string, any> = {
    BookOpen,
    Globe,
    Scale,
    TrendingUp,
    Leaf,
    Cpu,
};

export default function LearnScreen() {
    const { theme, isDarkMode } = useTheme();

    const animatedValues = useRef(
        modules.map(() => ({
            opacity: new Animated.Value(0),
            translateY: new Animated.Value(30),
            scale: new Animated.Value(1),
        }))
    ).current;

    useEffect(() => {
        const animations = modules.map((_, index) =>
            Animated.parallel([
                Animated.timing(animatedValues[index].opacity, {
                    toValue: 1,
                    duration: 500,
                    delay: index * 80, // Slightly faster stagger
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValues[index].translateY, {
                    toValue: 0,
                    duration: 500,
                    delay: index * 80,
                    useNativeDriver: true,
                }),
            ])
        );

        Animated.stagger(0, animations).start();
    }, []);

    const createPressAnimation = (index: number) => ({
        onPressIn: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Animated.spring(animatedValues[index].scale, {
                toValue: 0.97,
                useNativeDriver: true,
            }).start();
        },
        onPressOut: () => {
            Animated.spring(animatedValues[index].scale, {
                toValue: 1,
                useNativeDriver: true,
            }).start();
        },
    });

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header - Fixed & Adaptive */}
            <View style={[styles.header, { 
                backgroundColor: theme.surface, 
                borderBottomColor: theme.border 
            }]}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Learn</Text>
                <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>Master the UPSC syllabus</Text>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {modules.map((module, index) => {
                        const IconComponent = iconMap[module.icon];
                        return (
                            <Animated.View
                                key={module.id}
                                style={{
                                    opacity: animatedValues[index].opacity,
                                    transform: [
                                        { translateY: animatedValues[index].translateY },
                                        { scale: animatedValues[index].scale },
                                    ],
                                }}
                            >
                                <TouchableOpacity
                                    style={[styles.moduleCard, { 
                                        backgroundColor: theme.surface, 
                                        borderColor: theme.border,
                                        // Adding a subtle glow effect in dark mode
                                        shadowOpacity: isDarkMode ? 0 : 0.1 
                                    }]}
                                    activeOpacity={1}
                                    {...createPressAnimation(index)}
                                >
                                    <View style={styles.moduleHeader}>
                                        <View
                                            style={[styles.moduleIcon, { backgroundColor: `${module.color}15` }]}
                                        >
                                            <IconComponent size={24} color={module.color} />
                                        </View>
                                        <View style={styles.moduleInfo}>
                                            <Text style={[styles.moduleTitle, { color: theme.text }]}>{module.title}</Text>
                                            <Text style={[styles.moduleDescription, { color: theme.textSecondary }]}>
                                                {module.description}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.moduleProgress}>
                                        <View style={styles.progressInfo}>
                                            <Text style={[styles.progressText, { color: theme.textSecondary }]}>
                                                {module.completedTopics}/{module.totalTopics} Topics
                                            </Text>
                                            <Text style={[styles.progressPercent, { color: theme.text }]}>
                                                {module.progress}%
                                            </Text>
                                        </View>
                                        <View style={[styles.progressBarContainer, { backgroundColor: theme.border }]}>
                                            <View
                                                style={[
                                                    styles.progressBarFill,
                                                    {
                                                        width: `${module.progress}%`,
                                                        backgroundColor: module.color,
                                                    },
                                                ]}
                                            />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        );
                    })}
                </View>
                {/* Extra padding for the bottom tab bar */}
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 15,
        fontWeight: '500',
    },
    scrollView: { flex: 1 },
    content: { padding: 20 },
    moduleCard: {
        borderRadius: 20,
        padding: 18,
        marginBottom: 16,
        borderWidth: 1,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowRadius: 8 },
            android: { elevation: 3 }
        })
    },
    moduleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
    },
    moduleIcon: {
        width: 52,
        height: 52,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    moduleInfo: { flex: 1 },
    moduleTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 2,
    },
    moduleDescription: {
        fontSize: 13,
        lineHeight: 18,
    },
    moduleProgress: { gap: 8 },
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    progressText: {
        fontSize: 12,
        fontWeight: '600',
    },
    progressPercent: {
        fontSize: 13,
        fontWeight: '800',
    },
    progressBarContainer: {
        height: 6,
        borderRadius: 10,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 10,
    },
});