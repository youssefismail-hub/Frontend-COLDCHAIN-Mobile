import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, rounded, typography, spacing } from '../theme';

const PrimaryButton = ({ title, onPress, style, variant = 'primary', loading = false, icon }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return { bg: colors.surfaceContainerHigh, text: colors.onSurface };
      case 'danger':
        return { bg: colors.error, text: colors.onError };
      case 'outline':
        return { bg: 'transparent', text: colors.secondary, border: colors.outlineVariant };
      case 'ghost':
        return { bg: 'transparent', text: colors.secondary };
      default:
        return { bg: colors.primaryContainer, text: colors.onPrimary };
    }
  };

  const v = getVariantStyles();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: v.bg },
        v.border && { borderWidth: 1, borderColor: v.border },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={v.text} size="small" />
      ) : (
        <Text style={[styles.text, { color: v.text }]}>{title}</Text>
      )}
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
    flexDirection: 'row',
  },
  text: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    fontFamily: typography.fonts.sans,
  },
});

export default PrimaryButton;
