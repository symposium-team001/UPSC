import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Check, Zap, Infinity, Map, Globe } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';

const PLANS = [
    { id: 'monthly', title: 'Monthly', price: 299, perMonth: 299, savings: null },
    { id: 'quarterly', title: 'Quarterly', price: 699, perMonth: 233, savings: 'Save 20%' },
    { id: 'annual', title: 'Yearly', price: 1999, perMonth: 166, savings: 'Save 45%' },
];

export default function SubscriptionScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    
    // Track which plan is selected
    const [selectedId, setSelectedId] = useState('annual');

    // Get the current active plan details
    const currentPlan = PLANS.find(p => p.id === selectedId) || PLANS[2];

    const handleUpgrade = () => {
        const paymentData = {
            planId: currentPlan.id,
            amount: currentPlan.price,
            currency: 'INR'
        };
        
        console.log("Initiating Payment:", paymentData);
        
        Alert.alert(
            "Ethora Pro",
            `Proceed to pay ₹${currentPlan.price} for the ${currentPlan.title} plan?`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Pay Now", onPress: () => console.log("Integrating Gateway...") }
            ]
        );
    };

    return (
        <SafeAreaView style={[s.container, { backgroundColor: theme.background }]}>
            {/* Header with fixed StatusBar height logic */}
            <View style={s.header}>
                <TouchableOpacity 
                    onPress={() => router.push('/profile')} 
                    style={[s.backBtn, { backgroundColor: theme.surface }]}
                >
                    <ChevronLeft size={24} color={theme.text} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInDown.duration(600)}>
                    <Text style={[s.title, { color: theme.text }]}>Unlock your Ethora{"\n"}Analyst superpowers</Text>
                </Animated.View>

                {/* Features List */}
                <Animated.View entering={FadeInDown.delay(200).duration(600)} style={[s.perksBox, { backgroundColor: theme.surface }]}>
                    <FeatureRow icon={<Infinity size={22} color={theme.text} />} title="Unlimited AI Evaluation" sub="Evaluate Mains answers without limits" theme={theme} />
                    <FeatureRow icon={<Map size={22} color={theme.text} />} title="GS Mapping & Analysis" sub="Interactive mapping for Geography & IR" theme={theme} />
                    <FeatureRow icon={<Globe size={22} color={theme.text} />} title="Daily Editorial Insights" sub="Unlock specialized UPSC perspectives" theme={theme} />
                    <FeatureRow icon={<Zap size={22} color={theme.text} />} title="Priority Processing" sub="Get your feedback in under 2 minutes" theme={theme} />
                </Animated.View>

                {/* Horizontal Plan Selector */}
                <View style={s.planContainer}>
                    {PLANS.map((plan) => (
                        <TouchableOpacity 
                            key={plan.id}
                            onPress={() => setSelectedId(plan.id)}
                            style={[
                                s.planCard, 
                                { 
                                    backgroundColor: theme.surface, 
                                    borderColor: selectedId === plan.id ? theme.primary : 'transparent',
                                    borderWidth: 2 
                                }
                            ]}
                        >
                            {plan.savings && (
                                <View style={s.savingsBadge}>
                                    <Text style={s.savingsText}>{plan.savings}</Text>
                                </View>
                            )}
                            <Text style={[s.planTitle, { color: theme.textSecondary }]}>{plan.title}</Text>
                            <Text style={[s.planPrice, { color: theme.text }]}>₹{plan.price}</Text>
                            <Text style={[s.planSub, { color: theme.textSecondary }]}>₹{plan.perMonth}/mo</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Terms and Pricing Detail */}
                <Text style={[s.billingNote, { color: theme.textSecondary }]}>
                    ₹{currentPlan.perMonth} per month billed {currentPlan.title.toLowerCase()}.{"\n"}
                    Auto-renews unless canceled. Secure UPI Payment.
                </Text>

                {/* Premium Action Button */}
                <TouchableOpacity style={[s.actionBtn, { backgroundColor: theme.primary }]} onPress={handleUpgrade}>
                    <Text style={s.actionBtnText}>Get Ethora {currentPlan.title}</Text>
                </TouchableOpacity>

                <View style={s.footerLinks}>
                    <Text style={s.footerText}>Terms of Service</Text>
                    <Text style={s.footerText}>Privacy Policy</Text>
                    <Text style={s.footerText}>Restore</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const FeatureRow = ({ icon, title, sub, theme }: any) => (
    <View style={s.featureRow}>
        <View style={s.iconCircle}>{icon}</View>
        <View style={{ flex: 1 }}>
            <Text style={[s.featureTitle, { color: theme.text }]}>{title}</Text>
            <Text style={[s.featureSub, { color: theme.textSecondary }]}>{sub}</Text>
        </View>
        <View style={s.checkCircle}><Check size={14} color="#FFF" /></View>
    </View>
);

const s = StyleSheet.create({
    container: { flex: 1 },
    header: { 
        paddingHorizontal: 20, 
        // FIX: Added || 0 to handle the TypeScript 'possibly undefined' error
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 20 : 25, 
        paddingBottom: 10 
    },
    backBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', elevation: 2 },
    content: { paddingHorizontal: 25, paddingTop: 15, paddingBottom: 40 },
    title: { fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 30, lineHeight: 34 },
    perksBox: { borderRadius: 24, padding: 20, marginBottom: 30 },
    featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    iconCircle: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    featureTitle: { fontSize: 16, fontWeight: '700' },
    featureSub: { fontSize: 13, opacity: 0.7 },
    checkCircle: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center' },
    planContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    planCard: { flex: 1, padding: 15, borderRadius: 20, position: 'relative' },
    savingsBadge: { position: 'absolute', top: -12, left: 10, backgroundColor: '#F59E0B', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, zIndex: 1 },
    savingsText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
    planTitle: { fontSize: 12, fontWeight: '700', marginBottom: 5 },
    planPrice: { fontSize: 20, fontWeight: '800' },
    planSub: { fontSize: 11, opacity: 0.6 },
    billingNote: { textAlign: 'center', fontSize: 12, lineHeight: 18, marginBottom: 30, paddingHorizontal: 10 },
    actionBtn: { height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
    actionBtnText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
    footerLinks: { flexDirection: 'row', justifyContent: 'center', gap: 15, marginTop: 25 },
    footerText: { fontSize: 12, color: '#64748B', textDecorationLine: 'underline' }
});