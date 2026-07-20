import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, rounded, spacing, shadows } from '../theme';

const GlassCard = ({ children, style, variant = 'default' }) => {
  return (
    <View style={[styles.card, variant === 'elevated' && styles.elevated, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: rounded.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    ...shadows.card,
  },
  elevated: {
    ...shadows.lg,
  },
});

export default GlassCard;
