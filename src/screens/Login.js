import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import api, { API_URL } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GlassCard from "../components/GlassCard";
import PrimaryButton from "../components/PrimaryButton";
import { colors, spacing, typography, rounded, shadows } from "../theme";

const Login = ({ navigation }) => {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const inputChangeHandler = (value, name) => {
    setUserData({ ...userData, [name]: value });
  };

  const loginHandler = () => {
    setLoading(true);
    api
      .post("/api/signIn", userData)
      .then(async (res) => {
        const token = res.data.token;
        await AsyncStorage.setItem("token", token);
        setLoading(false);
        navigation.replace("Main");
      })
      .catch((error) => {
        setLoading(false);
        const isNetworkError = !error.response && error.message === "Network Error";
        const message = isNetworkError
          ? `Cannot reach server at ${API_URL}. Start the backend and check EXPO_PUBLIC_API_URL in .env`
          : error.response?.data?.message || "Login failed. Check your credentials.";
        alert(message);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.brandSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoIcon}>❄️</Text>
            </View>
            <Text style={styles.title}>ColdGuard</Text>
            <Text style={styles.subtitle}>Intelligence Dashboard</Text>
            <Text style={styles.tagline}>Cold Chain Monitoring Platform</Text>
          </View>

          <GlassCard style={styles.card}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <TextInput
                style={styles.input}
                value={userData.email}
                onChangeText={(txt) => inputChangeHandler(txt, "email")}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="driver@coldguard.com"
                placeholderTextColor={colors.outline}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>PASSWORD</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                value={userData.password}
                onChangeText={(txt) => inputChangeHandler(txt, "password")}
                placeholder="••••••••"
                placeholderTextColor={colors.outline}
              />
            </View>

            <PrimaryButton
              title="Secure Login"
              onPress={loginHandler}
              style={styles.button}
              loading={loading}
            />
          </GlassCard>

          <Text style={styles.footerText}>
            Secured by Arctic Encryption Protocol
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.edgeMargin,
  },
  brandSection: {
    alignItems: "center",
    marginBottom: spacing.xl * 1.5,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: rounded.xl,
    backgroundColor: colors.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
    ...shadows.lg,
  },
  logoIcon: {
    fontSize: 36,
  },
  title: {
    fontSize: typography.headlineLgMobile.fontSize,
    fontWeight: "700",
    color: colors.onBackground,
    fontFamily: typography.fonts.sans,
    letterSpacing: typography.headlineLgMobile.letterSpacing,
  },
  subtitle: {
    fontSize: typography.bodyLg.fontSize,
    color: colors.secondary,
    fontFamily: typography.fonts.mono,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginTop: spacing.xs,
  },
  tagline: {
    fontSize: typography.bodySm.fontSize,
    color: colors.onSurfaceVariant,
    marginTop: spacing.xs,
  },
  card: {
    padding: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.labelCaps.fontSize,
    color: colors.outline,
    fontFamily: typography.fonts.mono,
    fontWeight: "500",
    letterSpacing: 0.6,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: "#f1f5f9",
    borderRadius: rounded.md,
    borderWidth: 1.5,
    borderColor: colors.outlineVariant,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    fontSize: typography.bodyLg.fontSize,
    color: colors.onSurface,
    fontFamily: typography.fonts.sans,
  },
  button: {
    marginTop: spacing.sm,
  },
  footerText: {
    textAlign: "center",
    fontSize: typography.bodySm.fontSize,
    color: colors.outline,
    marginTop: spacing.xl,
    fontFamily: typography.fonts.mono,
    letterSpacing: 0.3,
  },
});
