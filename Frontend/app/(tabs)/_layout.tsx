import { Tabs, router, usePathname, Link } from "expo-router";
import { Home, BookOpen, Newspaper, PenTool, User, LayoutGrid, Search } from "lucide-react-native";
import React from "react";
import { Platform, View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { useTheme } from "../../context/ThemeContext";

const isWeb = Platform.OS === 'web';

// --- GLOBAL HEADER COMPONENT ---
function GlobalHeader() {
    const { theme } = useTheme();
    const pathname = usePathname();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Learn', path: '/learn' },
        { name: 'Affairs', path: '/current-affairs' },
        { name: 'Practice', path: '/practice' },
        { name: 'Dashboard', path: '/syllabus-tracker' },
    ];

    return (
        <View style={[styles.headerContainer, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
            <View style={styles.headerContent}>
                
                {/* 1. LEFT: Logo */}
                <View style={styles.sideSection}>
                    <TouchableOpacity onPress={() => router.push('/')}>
                        <Text style={[styles.logoText, { color: '#2D5A61' }]}>Ethora</Text>
                    </TouchableOpacity>
                </View>

                {/* 2. CENTER: Web Navigation (Centered) */}
                {isWeb && (
                    <View style={styles.centerSection}>
                        <View style={styles.webNav}>
                            {navLinks.map((item) => {
                                const isActive = pathname === item.path;
                                return (
                                    <Link key={item.path} href={item.path as any} asChild>
                                        <TouchableOpacity>
                                            <Text style={[
                                                styles.navLink, 
                                                { color: isActive ? '#2D5A61' : theme.textSecondary }
                                            ]}>
                                                {item.name}
                                            </Text>
                                        </TouchableOpacity>
                                    </Link>
                                );
                            })}
                        </View>
                    </View>
                )}

                {/* 3. RIGHT: Search & Profile (Mobile & Web) */}
                <View style={[styles.sideSection, { alignItems: 'flex-end' }]}>
                    <View style={styles.headerRight}>
                        <View style={[styles.searchBar, { backgroundColor: '#F5F7F8' }]}>
                            <Search size={16} color="#9BA4AD" />
                            <TextInput 
                                placeholder="Search..." 
                                style={styles.searchInput} 
                                placeholderTextColor="#9BA4AD" 
                            />
                        </View>
                        
                        <TouchableOpacity onPress={() => router.push('/profile')}>
                            <View style={styles.profileAvatar}>
                                 <User size={18} color="#FFF" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        </View>
    );
}

// --- MAIN LAYOUT ---
export default function TabLayout() {
    const { theme, isDarkMode } = useTheme();

    return (
        <>
            <GlobalHeader />
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: isDarkMode ? "#FFFFFF" : "#2D5A61",
                    tabBarInactiveTintColor: theme.textSecondary,
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: theme.surface,
                        borderTopColor: theme.border,
                        borderTopWidth: 1,
                        elevation: 0,
                        height: Platform.OS === 'ios' ? 90 : 70, 
                        paddingBottom: Platform.OS === 'ios' ? 30 : 12,
                        paddingTop: 8,
                        display: isWeb ? 'none' : 'flex', 
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                    },
                    tabBarLabelStyle: { fontSize: 10, fontWeight: '700', marginTop: 2 },
                }}
            >
                <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color }) => <Home size={22} color={color} /> }} />
                <Tabs.Screen name="learn" options={{ title: "Learn", tabBarIcon: ({ color }) => <BookOpen size={22} color={color} /> }} />
                <Tabs.Screen name="current-affairs" options={{ title: "Affairs", tabBarIcon: ({ color }) => <Newspaper size={22} color={color} /> }} />
                <Tabs.Screen name="practice" options={{ title: "Practice", tabBarIcon: ({ color }) => <PenTool size={22} color={color} /> }} />
                <Tabs.Screen name="syllabus-tracker" options={{ title: "Dashboard", tabBarIcon: ({ color }) => <LayoutGrid size={22} color={color} /> }} />
                <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ color }) => <User size={22} color={color} /> }} />
            </Tabs>
        </>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        borderBottomWidth: 1,
        zIndex: 1000,
        ...Platform.select({
            web: { height: 75, justifyContent: 'center' },
            default: { paddingTop: 50, paddingBottom: 15 }
        })
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: isWeb ? '5%' : 15,
        width: '100%',
    },
    sideSection: {
        flex: 1, // Forces left and right to equal sizes
    },
    centerSection: {
        flex: 2, // Gives middle nav more space
        alignItems: 'center',
    },
    logoText: {
        fontSize: 22,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    webNav: {
        flexDirection: 'row',
        gap: 25,
    },
    navLink: {
        fontSize: 14,
        fontWeight: '700',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderRadius: 8,
        width: isWeb ? 200 : 120, // Now visible on mobile
        height: 38,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 13,
        ...(isWeb ? { outlineStyle: 'none' } : {}) as any,
    },
    profileAvatar: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#2D5A61',
        alignItems: 'center',
        justifyContent: 'center',
    },
});