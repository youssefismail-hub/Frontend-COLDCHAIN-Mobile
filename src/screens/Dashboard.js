import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
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

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "CRITICAL": return "🔴";
      case "WARNING": return "🟡";
      default: return "🟢";
    }
  };

  const getTempForTruck = (truck) => {
    if (truck.last_temperature !== undefined) return truck.last_temperature;
    return null;
  };

  const getFuelForTruck = (truck) => {
    if (truck.fuel_level !== undefined) return truck.fuel_level;
    return null;
  };

  const getProgressForTruck = (truck) => {
    if (truck.progress !== undefined) return truck.progress;
    if (truck.fuel_level !== undefined) return truck.fuel_level;
    return 50;
  };

  const renderTopBar = () => (
    <View style={styles.topBar}>
      <View style={styles.topBarLeft}>
        <View style={styles.logoIconWrap}>
          <Text style={styles.logoIcon}>❄️</Text>
        </View>
        <Text style={styles.topBarTitle}>ColdGuard</Text>
      </View>
      <View style={styles.topBarRight}>
        <TouchableOpacity style={styles.topBarBtn} activeOpacity={0.7}>
          <Text style={styles.topBarBtnIcon}>🔔</Text>
        </TouchableOpacity>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarText}>U</Text>
        </View>
      </View>
    </View>
  );

  const renderHero = () => (
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
    </>
  );

  const renderFleetHealth = () => (
    <View style={styles.fleetSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Fleet Health</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Shipments")}
          activeOpacity={0.7}
        >
          <Text style={styles.sectionAction}>VIEW ALL</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.fleetScrollContent}
      >
        {trucks.length === 0 ? (
          <View style={styles.fleetEmptyCard}>
            <GlassCard style={styles.fleetCard}>
              <Text style={styles.fleetEmptyText}>No vehicles in fleet</Text>
            </GlassCard>
          </View>
        ) : (
          trucks.map((truck) => {
            const temp = getTempForTruck(truck);
            const fuel = getFuelForTruck(truck);
            const progress = getProgressForTruck(truck);
            return (
              <TouchableOpacity
                key={truck._id}
                onPress={() => navigation.navigate("ShipmentDetails", { truckId: truck._id })}
                activeOpacity={0.85}
                style={styles.fleetCardWrapper}
              >
                <GlassCard style={styles.fleetCard}>
                  <View style={styles.fleetCardHeader}>
                    <View style={styles.fleetCardLeft}>
                      <Text style={styles.fleetCardIcon}>🚚</Text>
                      <Text style={styles.fleetCardName}>{truck.plate_number || truck.name}</Text>
                    </View>
                    <StatusBadge status={truck.status} size="small" />
                  </View>
                  <View style={styles.fleetCardData}>
                    <View style={styles.fleetCardDataItem}>
                      <Text style={styles.fleetCardLabel}>Temp</Text>
                      <Text style={[styles.fleetCardDataValue, temp !== null && temp > 8 && { color: colors.error }]}>
                        {temp !== null ? `${temp.toFixed(1)}°C` : "N/A"}
                      </Text>
                    </View>
                    <View style={styles.fleetCardDataItemRight}>
                      <Text style={styles.fleetCardLabel}>Fuel</Text>
                      <Text style={styles.fleetCardDataValue}>
                        {fuel !== null ? `${fuel}%` : "N/A"}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }, progress < 20 && { backgroundColor: colors.error }]} />
                  </View>
                </GlassCard>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );

  const renderRecentShipments = () => (
    <View style={styles.recentSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Shipments</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Shipments")}
          activeOpacity={0.7}
          style={styles.filterBtn}
        >
          <Text style={styles.filterIcon}>🔍</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.recentList}>
        {trucks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>No Shipments</Text>
            <Text style={styles.emptySubtitle}>No active shipments in the fleet</Text>
          </View>
        ) : (
          trucks.slice(0, 4).map((truck) => (
            <TouchableOpacity
              key={truck._id}
              onPress={() => navigation.navigate("ShipmentDetails", { truckId: truck._id })}
              activeOpacity={0.85}
            >
              <View style={styles.recentItem}>
                <View style={styles.recentItemLeft}>
                  <View style={[styles.recentItemIconWrap, truck.status === "CRITICAL" && styles.recentItemIconError]}>
                    <Text style={styles.recentItemIcon}>
                      {truck.status === "CRITICAL" ? "⚠️" : "📦"}
                    </Text>
                  </View>
                  <View style={styles.recentItemInfo}>
                    <Text style={styles.recentItemId}>{truck.name}</Text>
                    <Text style={styles.recentItemRoute}>PLATE: {truck.plate_number}</Text>
                  </View>
                </View>
                <View style={styles.recentItemRight}>
                  <StatusBadge status={truck.status} size="small" />
                  <Text style={styles.recentItemStatus}>{getStatusIcon(truck.status)} {truck.status || "N/A"}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </View>
  );

  const renderLogout = () => (
    <View style={styles.logoutSection}>
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
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.secondary]} />
        }
      >
        {renderTopBar()}
        {renderHero()}
        {renderFleetHealth()}
        {renderRecentShipments()}
        {renderLogout()}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => navigation.navigate("Shipments")}
      >
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
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.edgeMargin,
    height: 56,
    backgroundColor: `${colors.surface}cc`,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.outlineVariant}30`,
  },
  topBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  logoIconWrap: {
    width: 32,
    height: 32,
    borderRadius: rounded.md,
    backgroundColor: colors.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  logoIcon: {
    fontSize: 16,
  },
  topBarTitle: {
    fontSize: typography.headlineMd.fontSize,
    fontWeight: "700",
    color: colors.onBackground,
    fontFamily: typography.fonts.sans,
  },
  topBarRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  topBarBtn: {
    padding: spacing.xs,
  },
  topBarBtnIcon: {
    fontSize: 18,
    color: colors.secondary,
  },
  avatarWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${colors.secondaryContainer}33`,
    borderWidth: 1,
    borderColor: `${colors.secondary}33`,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.secondary,
    fontFamily: typography.fonts.sans,
  },
  heroSection: {
    marginHorizontal: spacing.edgeMargin,
    marginTop: spacing.lg,
    borderRadius: rounded.lg,
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
  fleetSection: {
    marginTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: spacing.edgeMargin,
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
  fleetScrollContent: {
    paddingHorizontal: spacing.edgeMargin,
    gap: spacing.md,
  },
  fleetCardWrapper: {
    minWidth: 280,
  },
  fleetEmptyCard: {
    minWidth: 280,
  },
  fleetCard: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  fleetCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    alignItems: "flex-end",
  },
  fleetCardDataItem: {},
  fleetCardDataItemRight: {
    alignItems: "flex-end",
  },
  fleetCardLabel: {
    fontSize: 10,
    color: colors.onSurfaceVariant,
    fontFamily: typography.fonts.sans,
    marginBottom: 2,
  },
  fleetCardDataValue: {
    fontSize: typography.bodyLg.fontSize,
    fontWeight: "600",
    color: colors.onSurface,
    fontFamily: typography.fonts.mono,
  },
  progressBar: {
    width: "100%",
    height: 6,
    backgroundColor: colors.surfaceContainer,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.secondary,
    borderRadius: 3,
  },
  fleetEmptyText: {
    fontSize: typography.bodySm.fontSize,
    color: colors.onSurfaceVariant,
    fontFamily: typography.fonts.sans,
    textAlign: "center",
    paddingVertical: spacing.md,
  },
  recentSection: {
    marginTop: spacing.lg,
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: rounded.lg,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  filterIcon: {
    fontSize: 16,
  },
  recentList: {
    marginHorizontal: spacing.edgeMargin,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: rounded.lg,
    borderWidth: 1,
    borderColor: `${colors.outlineVariant}33`,
    marginBottom: spacing.sm,
  },
  recentItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1,
  },
  recentItemIconWrap: {
    width: 40,
    height: 40,
    borderRadius: rounded.md,
    backgroundColor: `${colors.secondary}1a`,
    alignItems: "center",
    justifyContent: "center",
  },
  recentItemIconError: {
    backgroundColor: `${colors.error}1a`,
  },
  recentItemIcon: {
    fontSize: 18,
  },
  recentItemInfo: {
    flex: 1,
  },
  recentItemId: {
    fontSize: typography.bodySm.fontSize,
    fontWeight: "700",
    color: colors.onSurface,
    fontFamily: typography.fonts.sans,
  },
  recentItemRoute: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    fontFamily: typography.fonts.sans,
    marginTop: 2,
  },
  recentItemRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  recentItemStatus: {
    fontSize: 10,
    fontFamily: typography.fonts.mono,
    fontWeight: "500",
    color: colors.onSurfaceVariant,
    letterSpacing: 0.3,
  },
  logoutSection: {
    marginTop: spacing.sm,
    marginHorizontal: spacing.edgeMargin,
  },
  logoutButton: {
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
  emptyContainer: {
    alignItems: "center",
    paddingVertical: spacing.xl,
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
  bottomSpacer: {
    height: 100,
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
