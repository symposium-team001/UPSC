import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Search, User } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { router, usePathname, Link } from 'expo-router';

const isWeb = Platform.OS === 'web';

export default function GlobalHeader() {
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
        <View style={[styles.navbar, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
            <View style={styles.navInner}>
                
                {/* LEFT: Logo */}
                <View style={styles.leftSection}>
                    <TouchableOpacity onPress={() => router.push('/')}>
                        <Text style={[styles.logoText, { color: '#2D5A61' }]}>Ethora</Text>
                    </TouchableOpacity>
                </View>

                {/* CENTER: Links (Visible only on Web) */}
                {isWeb && (
                    <View style={styles.centerSection}>
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
                )}

                {/* RIGHT: Search & Profile (Both Mobile & Web) */}
                <View style={styles.rightSection}>
                    <View style={[styles.searchContainer, { backgroundColor: '#F5F7F8' }]}>
                        <Search size={16} color="#9BA4AD" />
                        <TextInput 
                            placeholder="Search..." 
                            style={styles.searchInput} 
                            placeholderTextColor="#9BA4AD" 
                        />
                    </View>
                    
                    <TouchableOpacity onPress={() => router.push('/profile')}>
                        <View style={styles.profileCircle}>
                             <User size={18} color="#FFF" />
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    navbar: {
        height: isWeb ? 70 : 100,
        paddingTop: isWeb ? 0 : 40,
        borderBottomWidth: 1,
        justifyContent: 'center',
        paddingHorizontal: '4%',
        zIndex: 1000,
    },
    navInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    leftSection: {
        width: isWeb ? '20%' : 'auto',
        alignItems: 'flex-start',
    },
    centerSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 25,
        flex: 1, // Forces this to take all available middle space
    },
    rightSection: {
        width: isWeb ? '25%' : 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 12,
    },
    logoText: {
        fontSize: 22,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    navLink: {
        fontSize: 14,
        fontWeight: '700',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderRadius: 8,
        width: isWeb ? 180 : 110, 
        height: 36,
    },
    searchInput: {
        flex: 1,
        marginLeft: 6,
        fontSize: 12,
        ...Platform.select({ web: { outlineStyle: 'none' } as any }),
    },
    profileCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#2D5A61',
        alignItems: 'center',
        justifyContent: 'center',
    },
});