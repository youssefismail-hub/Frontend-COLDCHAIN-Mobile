import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, rounded, typography, spacing } from '../theme';

const StatusBadge = ({ status, size = 'default' }) => {
  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case 'CRITICAL':
        return { bg: `${colors.error}18`, text: colors.error };
      case 'WARNING':
        return { bg: `${colors.secondary}18`, text: colors.secondary };
      case 'TEMP SPIKE':
        return { bg: `${colors.error}18`, text: colors.error };
      case 'OK':
      case 'SAFE':
      case 'STABLE':
        return { bg: `${colors.onTertiaryContainer}18`, text: colors.onTertiaryContainer };
      case 'IDLE':
      case 'QUEUED':
        return { bg: colors.surfaceContainerHighest, text: colors.onSurfaceVariant };
      default:
        return { bg: `${colors.outline}18`, text: colors.outline };
    }
  };

  const s = getStatusStyle(status);

  return (
    <View style={[styles.badge, { backgroundColor: s.bg }, size === 'small' && styles.small]}>
      <Text style={[styles.text, { color: s.text }, size === 'small' && styles.textSmall]}>{status?.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: rounded.full,
    alignSelf: 'flex-start',
  },
  small: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: typography.fonts.mono,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  textSmall: {
    fontSize: 9,
  },
});

export default StatusBadge;
