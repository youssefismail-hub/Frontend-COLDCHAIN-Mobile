import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
} from "react-native";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GlassCard from "../components/GlassCard";
import StatusBadge from "../components/StatusBadge";
import { colors, spacing, typography, rounded, shadows } from "../theme";

const Dashboard = ({ navigation }) => {
  const [trucks, setTrucks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadTrucks = useCallback(async () => {
    try {
      const res = await api.get("/api/trucks");
      setTrucks(res.data.data);
    } catch (err) {
      console.error("Failed to load trucks:", err.message);
    }
  }, []);

  useEffect(() => {
    loadTrucks();
  }, [loadTrucks]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTrucks();
    setRefreshing(false);
  }, [loadTrucks]);

  const criticalCount = trucks.filter((t) => t.status === "CRITICAL").length;
  const stableCount = trucks.filter((t) => ["OK", "SAFE", "STABLE"].includes(t.status)).length;

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "CRITICAL": return "🔴";
      case "WARNING": return "🟡";
      default: return "🟢";
    }
  };

  const renderHeader = () => (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryContainer} />
      <View style={styles.heroSection}>
        <View style={styles.heroBackground}>
          <View style={styles.heroCircle1} />
          <View style={styles.heroCircle2} />
        </View>
        <View style={styles.heroContent}>
          <Text style={styles.heroLabel}>NETWORK STATUS: OPERATIONAL</Text>
          <View style={styles.heroRow}>
            <View>
              <Text style={styles.heroTitle}>Active Shipments</Text>
              <View style={styles.heroStatRow}>
                <Text style={styles.heroStatValue}>{trucks.length}</Text>
                <View style={styles.heroStatBadge}>
                  <Text style={styles.heroStatBadgeText}>LIVE</Text>
                </View>
              </View>
            </View>
            <View style={styles.heroRight}>
              <Text style={styles.heroRightLabel}>Critical Alerts</Text>
              <View style={styles.heroAlertRow}>
                <Text style={styles.heroAlertIcon}>⚠️</Text>
                <Text style={styles.heroAlertValue}>{String(criticalCount).padStart(2, "0")}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Fleet Health</Text>
        <TouchableOpacity>
          <Text style={styles.sectionAction}>VIEW ALL</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderTruckCard = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("ShipmentDetails", { truckId: item._id })}
      activeOpacity={0.85}
      style={styles.cardWrapper}
    >
      <GlassCard style={styles.fleetCard}>
        <View style={styles.fleetCardHeader}>
          <View style={styles.fleetCardLeft}>
            <Text style={styles.fleetCardIcon}>🚚</Text>
            <Text style={styles.fleetCardName}>{item.name}</Text>
          </View>
          <StatusBadge status={item.status} size="small" />
        </View>
        <View style={styles.fleetCardData}>
          <View>
            <Text style={styles.fleetCardLabel}>PLATE</Text>
            <Text style={styles.fleetCardValue}>{item.plate_number}</Text>
          </View>
          <View style={styles.fleetCardRight}>
            <Text style={styles.fleetCardLabel}>STATUS</Text>
            <Text style={styles.fleetCardValue}>{getStatusIcon(item.status)} {item.status || "N/A"}</Text>
          </View>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );

  const renderFooter = () => (
    <View style={styles.footerSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
      </View>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={async () => {
          await AsyncStorage.removeItem("token");
          navigation.replace("Login");
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      <View style={{ height: 100 }} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={trucks}
        keyExtractor={(item) => item._id}
        renderItem={renderTruckCard}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.secondary]} />
        }
      />

      <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
        <Text style={styles.fabIcon}>➕</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  heroSection: {
    marginHorizontal: spacing.edgeMargin,
    marginTop: spacing.lg,
    borderRadius: rounded.xl,
    overflow: "hidden",
    ...shadows.lg,
  },
  heroBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primaryContainer,
  },
  heroCircle1: {
    position: "absolute",
    right: -48,
    top: -48,
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  heroCircle2: {
    position: "absolute",
    right: -20,
    top: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  heroContent: {
    padding: spacing.lg,
    position: "relative",
    zIndex: 1,
  },
  heroLabel: {
    fontSize: 10,
    fontFamily: typography.fonts.mono,
    fontWeight: "500",
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
  },
  heroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  heroTitle: {
    fontSize: typography.headlineLgMobile.fontSize,
    fontWeight: "700",
    color: "#ffffff",
    fontFamily: typography.fonts.sans,
  },
  heroStatRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  heroStatValue: {
    fontSize: 40,
    fontWeight: "700",
    color: "#ffffff",
    fontFamily: typography.fonts.sans,
  },
  heroStatBadge: {
    backgroundColor: `${colors.tertiaryFixed}33`,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: rounded.full,
  },
  heroStatBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.tertiaryFixed,
    fontFamily: typography.fonts.mono,
  },
  heroRight: {
    alignItems: "flex-end",
  },
  heroRightLabel: {
    fontSize: typography.bodySm.fontSize,
    color: "rgba(255,255,255,0.7)",
    fontFamily: typography.fonts.sans,
  },
  heroAlertRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  heroAlertIcon: {
    fontSize: 18,
  },
  heroAlertValue: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.errorContainer,
    fontFamily: typography.fonts.sans,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: spacing.edgeMargin,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.headlineMd.fontSize,
    fontWeight: "600",
    color: colors.onSurface,
    fontFamily: typography.fonts.sans,
  },
  sectionAction: {
    fontSize: 10,
    fontWeight: "500",
    color: colors.secondary,
    fontFamily: typography.fonts.mono,
    letterSpacing: 0.6,
  },
  cardWrapper: {
    marginHorizontal: spacing.edgeMargin,
    marginBottom: spacing.sm,
  },
  fleetCard: {
    padding: spacing.md,
  },
  fleetCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  fleetCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  fleetCardIcon: {
    fontSize: 16,
  },
  fleetCardName: {
    fontSize: 10,
    fontWeight: "500",
    fontFamily: typography.fonts.mono,
    color: colors.onSurface,
    letterSpacing: 0.6,
  },
  fleetCardData: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fleetCardLabel: {
    fontSize: 10,
    color: colors.onSurfaceVariant,
    fontFamily: typography.fonts.mono,
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  fleetCardValue: {
    fontSize: typography.bodyLg.fontSize,
    fontWeight: "600",
    color: colors.onSurface,
    fontFamily: typography.fonts.sans,
  },
  fleetCardRight: {
    alignItems: "flex-end",
  },
  footerSection: {
    marginTop: spacing.sm,
  },
  logoutButton: {
    marginHorizontal: spacing.edgeMargin,
    backgroundColor: colors.error,
    paddingVertical: spacing.md,
    borderRadius: rounded.lg,
    alignItems: "center",
  },
  logoutText: {
    fontSize: typography.bodyLg.fontSize,
    fontWeight: "600",
    color: colors.onError,
    fontFamily: typography.fonts.sans,
  },
  fab: {
    position: "absolute",
    bottom: 90,
    right: spacing.edgeMargin,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.lg,
  },
  fabIcon: {
    fontSize: 24,
    color: "#ffffff",
  },
});
