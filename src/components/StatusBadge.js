import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, rounded, typography, spacing } from '../theme';

const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'CRITICAL':
        return colors.error;
      case 'WARNING':
        return colors.warning;
      case 'OK':
      case 'SAFE':
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  const statusColor = getStatusColor(status);

  return (
    <View style={[styles.badge, { backgroundColor: `${statusColor}20` }]}> 
      <Text style={[styles.text, { color: statusColor }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: rounded.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: typography.sizes.sm,
    fontWeight: '700',
    fontFamily: typography.fonts.mono,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default StatusBadge;
