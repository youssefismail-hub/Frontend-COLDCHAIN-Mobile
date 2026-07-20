import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  StatusBar,
} from "react-native";
import api from "../services/api";
import GlassCard from "../components/GlassCard";
import StatusBadge from "../components/StatusBadge";
import { colors, spacing, typography, rounded, shadows } from "../theme";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState("unresolved");
  const [refreshing, setRefreshing] = useState(false);

  const loadAlerts = useCallback(async () => {
    try {
      const res = await api.get("/api/alerts");
      setAlerts(res.data.data);
    } catch (err) {
      console.error("Failed to load alerts:", err.message);
    }
  }, []);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAlerts();
    setRefreshing(false);
  }, [loadAlerts]);

  const resolveAlert = async (alertId) => {
    try {
      await api.patch(`/api/alerts/${alertId}/resolve`, {});
      setAlerts((prev) =>
        prev.map((a) => (a._id === alertId ? { ...a, resolved: true } : a))
      );
    } catch (err) {
      console.error("Failed to resolve alert:", err.message);
    }
  };

  const filteredAlerts = alerts.filter((alert) =>
    activeTab === "unresolved" ? !alert.resolved : alert.resolved
  );

  const unresolvedCount = alerts.filter((a) => !a.resolved).length;

  const getPriorityStyle = (severity) => {
    switch (severity?.toUpperCase()) {
      case "CRITICAL":
      case "HIGH":
        return { border: colors.error, dot: colors.error, label: "High Priority" };
      case "WARNING":
      case "MEDIUM":
        return { border: colors.secondary, dot: colors.secondary, label: "Medium Priority" };
      default:
        return { border: colors.outline, dot: colors.outline, label: "Low Priority" };
    }
  };

  const renderHeader = () => (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alerts Management</Text>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "unresolved" && styles.tabActive]}
          onPress={() => setActiveTab("unresolved")}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === "unresolved" && styles.tabTextActive]}>
            Unresolved {unresolvedCount > 0 ? `(${unresolvedCount})` : ""}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "history" && styles.tabActive]}
          onPress={() => setActiveTab("history")}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === "history" && styles.tabTextActive]}>
            History
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderItem = ({ item }) => {
    const priority = getPriorityStyle(item.severity);
    const isResolved = item.resolved;

    return (
      <GlassCard
        style={[
          styles.alertCard,
          { borderLeftWidth: 4, borderLeftColor: priority.border },
          isResolved && styles.alertCardResolved,
        ]}
      >
        <View style={styles.alertHeader}>
          <View style={styles.alertPriorityRow}>
            <View style={[styles.alertDot, { backgroundColor: priority.dot }]} />
            <Text style={[styles.alertPriorityLabel, { color: priority.border }]}>
              {priority.label.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.alertTime}>
            {isResolved ? "Resolved" : "Active"}
          </Text>
        </View>

        <View style={styles.alertBody}>
          <Text style={[styles.alertTitle, isResolved && styles.alertTitleResolved]}>
            {item.type}
          </Text>
          <View style={styles.alertDetailRow}>
            <Text style={styles.alertMessage}>{item.message}</Text>
          </View>
        </View>

        <View style={styles.alertFooter}>
          {!isResolved && activeTab === "unresolved" && (
            <TouchableOpacity
              style={styles.resolveButton}
              onPress={() => resolveAlert(item._id)}
              activeOpacity={0.85}
            >
              <Text style={styles.resolveButtonText}>Resolve Issue</Text>
            </TouchableOpacity>
          )}
          {isResolved && (
            <View style={styles.resolvedBadge}>
              <Text style={styles.resolvedBadgeText}>✅ Resolved</Text>
            </View>
          )}
        </View>
      </GlassCard>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredAlerts}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.secondary]} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>{activeTab === "unresolved" ? "✅" : "📋"}</Text>
            <Text style={styles.emptyTitle}>
              {activeTab === "unresolved" ? "All Clear" : "No History"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === "unresolved"
                ? "No unresolved alerts at this time"
                : "No resolved alerts yet"}
            </Text>
          </View>
        }
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
    paddingBottom: spacing.xl,
  },
  header: {
    paddingHorizontal: spacing.edgeMargin,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.headlineLgMobile.fontSize,
    fontWeight: "700",
    color: colors.onBackground,
    fontFamily: typography.fonts.sans,
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: spacing.edgeMargin,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: rounded.lg,
    padding: 4,
    marginBottom: spacing.md,
    alignSelf: "flex-start",
  },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: rounded.md,
  },
  tabActive: {
    backgroundColor: colors.surfaceContainerLowest,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: typography.bodySm.fontSize,
    fontWeight: "500",
    color: colors.onSurfaceVariant,
    fontFamily: typography.fonts.sans,
  },
  tabTextActive: {
    color: colors.secondary,
    fontWeight: "600",
  },
  cardWrapper: {
    marginHorizontal: spacing.edgeMargin,
    marginBottom: spacing.sm,
  },
  alertCard: {
    marginHorizontal: spacing.edgeMargin,
    marginBottom: spacing.sm,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  alertCardResolved: {
    opacity: 0.6,
  },
  alertHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  alertPriorityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  alertPriorityLabel: {
    fontSize: 10,
    fontWeight: "700",
    fontFamily: typography.fonts.mono,
    letterSpacing: 0.6,
  },
  alertTime: {
    fontSize: 10,
    fontFamily: typography.fonts.mono,
    fontWeight: "500",
    color: colors.outline,
    letterSpacing: 0.3,
  },
  alertBody: {
    marginBottom: spacing.md,
  },
  alertTitle: {
    fontSize: typography.headlineMd.fontSize,
    fontWeight: "600",
    color: colors.onSurface,
    fontFamily: typography.fonts.sans,
    marginBottom: spacing.xs,
  },
  alertTitleResolved: {
    textDecorationLine: "line-through",
    color: colors.onSurfaceVariant,
  },
  alertDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  alertMessage: {
    fontSize: typography.bodySm.fontSize,
    color: colors.onSurfaceVariant,
    fontFamily: typography.fonts.sans,
    lineHeight: 20,
  },
  alertFooter: {
    flexDirection: "row",
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: `${colors.outlineVariant}4d`,
    paddingTop: spacing.md,
  },
  resolveButton: {
    flex: 1,
    backgroundColor: colors.primaryContainer,
    paddingVertical: spacing.sm + 2,
    borderRadius: rounded.lg,
    alignItems: "center",
  },
  resolveButtonText: {
    fontSize: typography.bodySm.fontSize,
    fontWeight: "600",
    color: "#ffffff",
    fontFamily: typography.fonts.sans,
  },
  resolvedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  resolvedBadgeText: {
    fontSize: typography.bodySm.fontSize,
    fontWeight: "500",
    color: colors.onTertiaryContainer,
    fontFamily: typography.fonts.sans,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl * 2,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: typography.headlineMd.fontSize,
    fontWeight: "600",
    color: colors.onSurface,
    fontFamily: typography.fonts.sans,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: typography.bodySm.fontSize,
    color: colors.onSurfaceVariant,
    fontFamily: typography.fonts.sans,
  },
});
