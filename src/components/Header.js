import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, typography, spacing, rounded } from "../theme";

const Header = ({ title, showBack = false, onBack, rightAction }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      {rightAction && (
        <TouchableOpacity onPress={rightAction.onPress} style={styles.rightButton} activeOpacity={0.7}>
          <Text style={styles.rightIcon}>🔔</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.edgeMargin,
    height: 56,
    backgroundColor: `${colors.surface}cc`,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.outlineVariant}4d`,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
  },
  backIcon: {
    fontSize: 20,
    color: colors.secondary,
  },
  title: {
    fontSize: typography.headlineMd.fontSize,
    fontWeight: "700",
    color: colors.primary,
    fontFamily: typography.fonts.sans,
    letterSpacing: typography.headlineMd.letterSpacing || 0,
  },
  rightButton: {
    padding: spacing.xs,
  },
  rightIcon: {
    fontSize: 18,
    color: colors.secondary,
  },
});
