import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import api, { API_URL } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GlassCard from "../components/GlassCard";
import PrimaryButton from "../components/PrimaryButton";
import { colors, spacing, typography, rounded } from "../theme";

const Login = ({ navigation }) => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const inputChangeHandler = (value, name) => {
    setUserData({ ...userData, [name]: value });   
  };

  const loginHandler = () => {
    api
      .post("/api/signIn", userData)
      .then(async (res) => {
        const token = res.data.token;
        await AsyncStorage.setItem("token", token);
        navigation.replace("Dashboard"); 
      })
      .catch((error) => {
        const isNetworkError = !error.response && error.message === "Network Error";
        const message = isNetworkError
          ? `Cannot reach server at ${API_URL}. Start the backend and check EXPO_PUBLIC_API_URL in .env`
          : error.response?.data?.message || "Login failed. Check your credentials.";

        alert(message);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Text style={styles.title}>ColdGuard</Text>
          <Text style={styles.subtitle}>Intelligence Dashboard</Text>

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
                placeholderTextColor={colors.textSecondary}
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
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <PrimaryButton 
              title="Secure Login" 
              onPress={loginHandler} 
              style={styles.button}
            />
          </GlassCard>
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
    padding: spacing.xl,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: "700",
    color: colors.primary,
    fontFamily: typography.fonts.sans,
    textAlign: "center",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.secondary,
    fontFamily: typography.fonts.mono,
    textAlign: "center",
    marginBottom: spacing.xl * 2,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  card: {
    padding: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontFamily: typography.fonts.mono,
    fontWeight: "600",
    marginBottom: spacing.xs,
    letterSpacing: 1,
  },
  input: {
    borderBottomWidth: 2,
    borderColor: colors.surfaceVariant,
    paddingVertical: spacing.sm,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    fontFamily: typography.fonts.sans,
  },
  button: {
    marginTop: spacing.md,
  },
});