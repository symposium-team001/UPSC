import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Send, ChevronLeft } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';

// Define the message type
interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    time: string;
}

export default function SupportChatScreen() {
    const { theme, isDarkMode } = useTheme();
    const router = useRouter();
    const scrollViewRef = useRef<ScrollView>(null);
    
    // --- STATE MANAGEMENT ---
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: `Welcome, Machi. I am your Support Assistant. How can I facilitate your journey today?`,
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);

    const botReplies = [
        "Understood. I am looking into this for you, Aspirant.",
        "Your request has been logged. Our technical team is on it.",
        "Integrity and patience are key. Let me verify that data for you.",
        "I've shared your concern with the Priority Desk. Anything else?",
        "Noted. Please ensure your internet connection is stable while I sync your data."
    ];

    const handleSend = () => {
        if (message.trim().length === 0) return;

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // 1. Add User Message
        const newUserMsg: Message = { id: Date.now(), text: message, sender: 'user', time };
        setMessages(prev => [...prev, newUserMsg]);
        setMessage('');

        // 2. Simulate Bot Thinking & Reply
        setTimeout(() => {
            const randomReply = botReplies[Math.floor(Math.random() * botReplies.length)];
            const botMsg: Message = { id: Date.now() + 1, text: randomReply, sender: 'bot', time };
            setMessages(prev => [...prev, botMsg]);
        }, 1000);
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            style={[s.container, { backgroundColor: theme.background }]}
        >
            {/* Header */}
            <View style={[s.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
                    <ChevronLeft size={24} color={theme.text} />
                </TouchableOpacity>
                <View>
                    <Text style={[s.headerTitle, { color: theme.text }]}>Priority Support</Text>
                    <View style={s.statusRow}>
                        <View style={s.onlineDot} />
                        <Text style={[s.statusText, { color: theme.textSecondary }]}>AI Desk Online</Text>
                    </View>
                </View>
            </View>

            <ScrollView 
                ref={scrollViewRef}
                contentContainerStyle={s.chatContent} 
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
                {messages.map((msg) => (
                    <View 
                        key={msg.id} 
                        style={[
                            msg.sender === 'bot' ? s.botMessage : s.userMessage, 
                            { backgroundColor: msg.sender === 'bot' ? theme.surfaceAlt : theme.primary }
                        ]}
                    >
                        <Text style={[s.messageText, { color: msg.sender === 'bot' ? theme.text : '#FFFFFF' }]}>
                            {msg.text}
                        </Text>
                        <Text style={[
                            s.timeStamp, 
                            { 
                                color: msg.sender === 'bot' ? theme.textTertiary : 'rgba(255,255,255,0.7)', 
                                textAlign: msg.sender === 'bot' ? 'left' : 'right' 
                            }
                        ]}>
                            {msg.time}
                        </Text>
                    </View>
                ))}
            </ScrollView>

            {/* Input Bar */}
            <View style={[s.inputWrapper, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
                <View style={[s.inputContainer, { backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9' }]}>
                    <TextInput
                        style={[s.input, { color: theme.text }]}
                        placeholder="Describe your issue..."
                        placeholderTextColor={theme.textTertiary}
                        value={message}
                        onChangeText={setMessage}
                        multiline={true}
                    />
                    <TouchableOpacity 
                        style={[s.sendBtn, { backgroundColor: theme.primary, opacity: message.trim().length > 0 ? 1 : 0.6 }]}
                        onPress={handleSend}
                        disabled={message.trim().length === 0}
                    >
                        <Send size={18} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 15, borderBottomWidth: 1 },
    backBtn: { marginRight: 15 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
    onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981', marginRight: 6 },
    statusText: { fontSize: 12, fontWeight: '600' },
    chatContent: { padding: 20, paddingBottom: 40 },
    botMessage: { padding: 12, paddingHorizontal: 16, borderRadius: 20, borderTopLeftRadius: 4, alignSelf: 'flex-start', maxWidth: '85%', marginBottom: 16 },
    userMessage: { padding: 12, paddingHorizontal: 16, borderRadius: 20, borderTopRightRadius: 4, alignSelf: 'flex-end', maxWidth: '85%', marginBottom: 16 },
    messageText: { fontSize: 15, lineHeight: 22, fontWeight: '500' },
    timeStamp: { fontSize: 10, marginTop: 4, fontWeight: '600' },
    inputWrapper: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: Platform.OS === 'ios' ? 34 : 15, borderTopWidth: 1 },
    inputContainer: { flexDirection: 'row', alignItems: 'flex-end', padding: 8, borderRadius: 24, paddingLeft: 16 },
    input: { flex: 1, fontSize: 15, fontWeight: '500', maxHeight: 120, paddingTop: Platform.OS === 'ios' ? 10 : 5, paddingBottom: Platform.OS === 'ios' ? 10 : 5 },
    sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginLeft: 8, marginBottom: 2 }
});