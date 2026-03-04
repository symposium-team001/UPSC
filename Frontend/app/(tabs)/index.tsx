import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Platform,
  Image,
  Dimensions,
} from "react-native";
import {
  ChevronRight,
  Newspaper,
  PlayCircle,
  Clock,
} from "lucide-react-native";
import * as Speech from "expo-speech";
import { useTheme } from "../../context/ThemeContext";
import { router } from "expo-router";

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";
const isDesktop = width >= 1024;

export default function HomeScreen() {
  const { theme, isDarkMode } = useTheme();
  const userName = "Buddy";

  const fadeText = useRef(new Animated.Value(0)).current;
  const fadeButton = useRef(new Animated.Value(0)).current;
  const fadeImage = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(15)).current;

  const hasSpoken = useRef(false);

  useEffect(() => {
    Animated.sequence([
      Animated.delay(100),
      Animated.parallel([
        Animated.timing(fadeText, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(fadeButton, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeImage, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    if (!hasSpoken.current) {
      Speech.speak(`Welcome ${userName}`, { language: "en-US", rate: 0.9 });
      hasSpoken.current = true;
    }
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* REMOVED: Local NavBar code has been deleted.
               The Global Header from (tabs)/_layout.tsx will now handle the top navigation.
            */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          // This padding ensures content starts below the global header
          { paddingTop: isWeb ? 40 : 20 },
        ]}
      >
        <View style={styles.responsiveWrapper}>
          {/* --- HERO SECTION --- */}
          <View style={styles.heroSection}>
            <Animated.View
              style={[
                styles.heroTextContainer,
                { opacity: fadeText, transform: [{ translateY }] },
              ]}
            >
              <Text style={[styles.welcomeText, { color: theme.primary }]}>
                WELCOME, {userName.toUpperCase()}!
              </Text>
              <Text style={[styles.heroTitle, { color: theme.text }]}>
                Master the UPSC Syllabus with{" "}
                <Text style={{ color: theme.primary }}>Ethora</Text>
              </Text>
              <Text style={[styles.heroSub, { color: theme.textSecondary }]}>
                Your all-in-one destination for{" "}
                <Text
                  style={{ color: theme.primary, fontWeight: "700" }}
                  onPress={() => router.push("/current-affairs")}
                >
                  Daily Current Affairs
                </Text>
                , Subject Modules, and Realistic Mock Tests.
              </Text>

              <Animated.View style={{ opacity: fadeButton }}>
                <TouchableOpacity
                  onPress={() => router.push("/learn")}
                  style={[
                    styles.btnPrimary,
                    { backgroundColor: theme.primary },
                  ]}
                >
                  <Text style={styles.btnPrimaryText}>Go to Course</Text>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>

            {isWeb && (
              <Animated.View
                style={[styles.heroImageContainer, { opacity: fadeImage }]}
              >
                <View style={[styles.heroImageWrapper, { overflow: 'hidden' }]}>
                  <Image
                    source={{
                      uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png",
                    }}
                    style={[
                      styles.heroImage,
                      { tintColor: isDarkMode ? "#E2E8F0" : "#2D5A61" },
                    ]}
                    resizeMode="contain"
                  />
                </View>
              </Animated.View>
            )}
          </View>

          {/* --- CONTINUE LEARNING SECTION --- */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <PlayCircle size={24} color={theme.primary} />
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.text, marginLeft: 12 },
                ]}
              >
                Continue Learning
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push("/learn")}
              style={[
                styles.continueCard,
                {
                  backgroundColor: isDarkMode ? theme.surfaceAlt : "#F0F7F8",
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.continueCardContent}>
                <Text style={[styles.continueTag, { color: theme.primary }]}>
                  MODERN HISTORY
                </Text>
                <Text style={[styles.continueTitle, { color: theme.text }]}>
                  The Revolt of 1857: Causes and Impact
                </Text>
                <View style={styles.continueMeta}>
                  <Clock size={14} color={theme.textSecondary} />
                  <Text
                    style={[
                      styles.continueMetaText,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {" "}
                    45 mins remaining
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/learn")}
                style={[styles.resumeBtn, { backgroundColor: theme.primary }]}
              >
                <PlayCircle size={20} color="#FFF" />
                <Text style={styles.resumeBtnText}>Resume</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>

          {/* --- DAILY AFFAIRS SECTION --- */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Newspaper size={24} color={theme.primary} />
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.text, marginLeft: 12 },
                ]}
              >
                Daily Current Affairs
              </Text>
            </View>
            <View style={styles.affairsGrid}>
              {[1, 2, 3].map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => router.push("/current-affairs")}
                  style={[
                    styles.affairCard,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <View style={[styles.dateBadge, { backgroundColor: isDarkMode ? theme.surfaceAlt : "#E0F2F1" }]}>
                      <Text style={[styles.dateText, { color: isDarkMode ? theme.primary : "#00796B" }]}>
                        March {item + 1}, 2026
                      </Text>
                    </View>
                    <Text style={[styles.affairTitle, { color: theme.text }]}>
                      Important Editorial Analysis: India's Foreign Policy
                    </Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <Text style={{ color: theme.primary, fontWeight: "700" }}>
                      Read Now
                    </Text>
                    <ChevronRight size={16} color={theme.primary} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* --- WEB INFO & INSTALL APP (Web Only) --- */}
        {
          isWeb && (
            <View
              style={[
                styles.webInfoSection,
                { backgroundColor: theme.surfaceAlt, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.webInfoTitle, { color: theme.text }]}>
                Experience the Best of Ethora
              </Text>
              <Text style={[styles.webInfoText, { color: theme.textSecondary }]}>
                Ethora is an all-in-one platform for UPSC aspirants. Read daily
                current affairs, complete structured syllabus modules, and track
                your progress in real-time. For a calm and distraction-free pocket
                learning experience, download our mobile application today.
              </Text>
              <TouchableOpacity
                style={[styles.installBtn, { backgroundColor: theme.primary }]}
              >
                <Text style={styles.installBtnText}>Install our app</Text>
              </TouchableOpacity>
            </View>
          )
        }
      </ScrollView >
    </View >
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  logo: { fontSize: 24, fontWeight: "900", letterSpacing: -1 },
  scrollContent: { flexGrow: 1 },
  responsiveWrapper: {
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: isWeb ? '5%' : 20,
    maxWidth: 1100,
    paddingTop: 30,
    paddingBottom: 100
  },
  heroSection: {
    flexDirection: isWeb && width > 800 ? "row" : "column",
    paddingVertical: isWeb && width > 800 ? 48 : 20,
    gap: isWeb && width > 800 ? 48 : 16,
    alignItems: "center",
  },
  heroTextContainer: { flex: 1 },
  welcomeText: {
    fontSize: isWeb && width > 800 ? 16 : 12,
    fontWeight: "800",
    marginBottom: isWeb && width > 800 ? 16 : 8,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  heroTitle: {
    fontSize: width > 800 ? 56 : 30,
    fontWeight: "900",
    marginBottom: isWeb && width > 800 ? 24 : 12,
    lineHeight: width > 800 ? 64 : 36,
    letterSpacing: -1,
  },
  heroSub: { fontSize: width > 800 ? 18 : 13, lineHeight: width > 800 ? 28 : 20, marginBottom: isWeb && width > 800 ? 32 : 16 },
  btnPrimary: {
    alignSelf: "flex-start",
    paddingHorizontal: width > 800 ? 32 : 24,
    paddingVertical: width > 800 ? 16 : 12,
    borderRadius: 12,
    elevation: 2,
    minHeight: width > 800 ? 48 : 40,
    justifyContent: "center",
  },
  btnPrimaryText: { color: "#FFF", fontWeight: "800", fontSize: width > 800 ? 16 : 14 },
  heroImageContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: width > 800 ? 450 : 200,
    marginTop: width > 800 ? 0 : 8,
  },
  heroImageWrapper: {
    width: width > 800 ? 500 : "100%",
    height: width > 800 ? 380 : 180, // Reduced height to crop bottom text
  },
  heroImage: {
    width: "100%",
    height: width > 800 ? 450 : 220, // Keep full height to prevent squishing
    marginTop: 0,
  },
  section: { paddingVertical: 32 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  sectionTitle: { fontSize: 24, fontWeight: "800", letterSpacing: -0.5 },

  // Continue Learning Styles
  continueCard: {
    flexDirection: width > 600 ? "row" : "column",
    alignItems: width > 600 ? "center" : "stretch",
    justifyContent: "space-between",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    gap: 20,
  },
  continueCardContent: { flex: 1 },
  continueTag: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 8,
  },
  continueTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
    lineHeight: 28,
  },
  continueMeta: { flexDirection: "row", alignItems: "center" },
  continueMetaText: { fontSize: 14, fontWeight: "600", marginLeft: 4 },
  resumeBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    minHeight: 48,
    gap: 8,
    justifyContent: "center",
  },
  resumeBtnText: { color: "#FFF", fontWeight: "800", fontSize: 16 },

  affairsGrid: { flexDirection: width > 800 ? "row" : "column", gap: 24 },
  affairCard: {
    flex: 1,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 200,
    display: "flex",
    flexDirection: "column",
  },
  dateBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 16,
  },
  dateText: { fontSize: 12, fontWeight: "800" },
  affairTitle: {
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 26,
    marginBottom: 24,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: "auto",
  },

  webInfoSection: {
    padding: 48,
    marginTop: 48,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
  },
  webInfoTitle: { fontSize: 24, fontWeight: "800", marginBottom: 16 },
  webInfoText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 32,
    maxWidth: 640,
  },
  installBtn: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 2,
  },
  installBtnText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
