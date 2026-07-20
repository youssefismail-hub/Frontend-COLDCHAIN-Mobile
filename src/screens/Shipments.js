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

const Shipments = ({ navigation }) => {
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

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "CRITICAL": return "🔴";
      case "WARNING": return "🟡";
      default: return "🟢";
    }
  };

  const renderHeader = () => (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Shipments</Text>
          <Text style={styles.headerSubtitle}>{trucks.length} active vehicles in fleet</Text>
        </View>
        <TouchableOpacity style={styles.filterButton} activeOpacity={0.8}>
          <Text style={styles.filterIcon}>🔍</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("ShipmentDetails", { truckId: item._id })}
      activeOpacity={0.85}
      style={styles.cardWrapper}
    >
      <GlassCard style={styles.shipmentCard}>
        <View style={styles.shipmentRow}>
          <View style={styles.shipmentIconContainer}>
            <Text style={styles.shipmentIcon}>📦</Text>
          </View>
          <View style={styles.shipmentInfo}>
            <Text style={styles.shipmentId}>{item.name}</Text>
            <Text style={styles.shipmentRoute}>PLATE: {item.plate_number}</Text>
          </View>
          <View style={styles.shipmentRight}>
            <StatusBadge status={item.status} size="small" />
            <Text style={styles.shipmentEta}>{getStatusIcon(item.status)} {item.status || "N/A"}</Text>
          </View>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={trucks}
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
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>No Shipments</Text>
            <Text style={styles.emptySubtitle}>No active shipments in the fleet</Text>
          </View>
        }
      />
    </View>
  );
};

export default Shipments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.edgeMargin,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: typography.headlineLgMobile.fontSize,
    fontWeight: "700",
    color: colors.onBackground,
    fontFamily: typography.fonts.sans,
  },
  headerSubtitle: {
    fontSize: typography.bodySm.fontSize,
    color: colors.onSurfaceVariant,
    fontFamily: typography.fonts.sans,
    marginTop: 2,
  },
  filterButton: {
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
  cardWrapper: {
    marginHorizontal: spacing.edgeMargin,
    marginBottom: spacing.sm,
  },
  shipmentCard: {
    padding: spacing.md,
  },
  shipmentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  shipmentIconContainer: {
    width: 44,
    height: 44,
    borderRadius: rounded.lg,
    backgroundColor: `${colors.secondary}1a`,
    alignItems: "center",
    justifyContent: "center",
  },
  shipmentIcon: {
    fontSize: 20,
  },
  shipmentInfo: {
    flex: 1,
  },
  shipmentId: {
    fontSize: typography.bodyLg.fontSize,
    fontWeight: "700",
    color: colors.onSurface,
    fontFamily: typography.fonts.sans,
  },
  shipmentRoute: {
    fontSize: typography.bodySm.fontSize,
    color: colors.onSurfaceVariant,
    fontFamily: typography.fonts.sans,
    marginTop: 2,
  },
  shipmentRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  shipmentEta: {
    fontSize: 10,
    fontFamily: typography.fonts.mono,
    fontWeight: "500",
    color: colors.onSurfaceVariant,
    letterSpacing: 0.3,
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
