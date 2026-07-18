import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";
import api from "../services/api";
import Header from "../components/Header";
import GlassCard from "../components/GlassCard";
import StatusBadge from "../components/StatusBadge";
import PrimaryButton from "../components/PrimaryButton";
import { colors, spacing, typography } from "../theme";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const loadAlerts = async () => {
      api
        .get("/api/alerts")
        .then((res) => {
          setAlerts(res.data.data);
        })
        .catch((err) => {
          console.error("Failed to load alerts:", err.message);
        });
    };

    loadAlerts();
  }, []);

  const resolveAlert = async (alertId) => {
    api
      .patch(`/api/alerts/${alertId}/resolve`, {})
      .then(() => {
        setAlerts((prev) =>
          prev.map((a) =>
            a._id === alertId ? { ...a, resolved: true } : a
          )
        );
      })
      .catch((err) => {
        console.error("Failed to resolve alert:", err.message);
      });
  };

  return (
    <View style={styles.container}>
      <Header title="Alerts" />

      <FlatList
        data={alerts}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <GlassCard style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.type}>{item.type}</Text>
              <StatusBadge status={item.severity} />
            </View>

            <Text style={styles.message}>
              {item.message}
            </Text>

            <View style={styles.footer}>
              <Text style={[styles.status, item.resolved && styles.statusResolved]}>
                {item.resolved ? "RESOLVED" : "ACTIVE"}
              </Text>

              {!item.resolved && (
                <PrimaryButton 
                  title="Resolve"
                  variant="primary"
                  onPress={() => resolveAlert(item._id)}
                  style={styles.resolveButton}
                />
              )}
            </View>
          </GlassCard>
        )}
      />
    </View>
  );
};

export default Alerts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.lg,
  },
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  type: {
    fontSize: typography.sizes.md,
    fontWeight: "700",
    color: colors.textPrimary,
    fontFamily: typography.fonts.sans,
  },
  message: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceVariant,
    paddingTop: spacing.sm,
  },
  status: {
    fontSize: typography.sizes.sm,
    fontWeight: "bold",
    fontFamily: typography.fonts.mono,
    color: colors.error,
  },
  statusResolved: {
    color: colors.success,
  },
  resolveButton: {
    minHeight: 36,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
});