import { Tabs } from "expo-router";
// Using LayoutGrid for the Dashboard look
import { Home, BookOpen, Newspaper, PenTool, User, LayoutGrid } from "lucide-react-native";
import React from "react";
import { Platform } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function TabLayout() {
    const { theme, isDarkMode } = useTheme();

    return (
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
                    height: Platform.OS === 'ios' ? 95 : 75, 
                    marginBottom: 0,
                    marginHorizontal: 0,
                    paddingBottom: Platform.OS === 'ios' ? 35 : 15,
                    paddingTop: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '700',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="learn"
                options={{
                    title: "Learn",
                    tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="current-affairs"
                options={{
                    title: "Affairs",
                    tabBarIcon: ({ color, size }) => <Newspaper size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="practice"
                options={{
                    title: "Practice",
                    tabBarIcon: ({ color, size }) => <PenTool size={size} color={color} />,
                }}
            />
            
            {/* UPDATED: Name matches your file 'syllabus-tracker.tsx' */}
            <Tabs.Screen
                name="syllabus-tracker" 
                options={{
                    title: "Dashboard", 
                    tabBarLabel: "Dashboard",
                    tabBarIcon: ({ color, size }) => <LayoutGrid size={size} color={color} />,
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}