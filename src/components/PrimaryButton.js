import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, rounded, typography, spacing } from '../theme';

const PrimaryButton = ({ title, onPress, style, variant = 'primary' }) => {
  const isSecondary = variant === 'secondary';
  const isDanger = variant === 'danger';

  let bgColor = colors.primary;
  let textColor = colors.onPrimary;

  if (isSecondary) {
    bgColor = colors.secondary;
    textColor = colors.onSecondary;
  } else if (isDanger) {
    bgColor = colors.error;
    textColor = colors.onPrimary;
  }

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bgColor }, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: rounded.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  text: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    fontFamily: typography.fonts.sans,
  },
});

export default PrimaryButton;
