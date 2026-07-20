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

const LiveTracking = ({ navigation }) => {
  const [trucks, setTrucks] = useState([]);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadTrucks = useCallback(async () => {
    try {
      const res = await api.get("/api/trucks");
      setTrucks(res.data.data);
      if (res.data.data.length > 0 && !selectedTruck) {
        setSelectedTruck(res.data.data[0]);
      }
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live Tracking</Text>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      <View style={styles.mapArea}>
        <View style={styles.mapBackground}>
          <Text style={styles.mapPlaceholder}>📡</Text>
          <Text style={styles.mapLabel}>Real-time GPS Tracking</Text>
        </View>

        {selectedTruck && (
          <View style={styles.sensorOverlay}>
            <GlassCard style={styles.sensorCard}>
              <Text style={styles.sensorLabel}>INTERNAL TEMP</Text>
              <View style={styles.sensorRow}>
                <Text style={styles.sensorValue}>-18.2°C</Text>
                <View style={styles.sensorStatus}>
                  <View style={styles.sensorStatusDot} />
                  <Text style={styles.sensorStatusText}>Stable</Text>
                </View>
              </View>
            </GlassCard>
          </View>
        )}

        {selectedTruck && (
          <View style={styles.bottomOverlay}>
            <GlassCard style={styles.truckInfoCard}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: "65%" }]} />
              </View>

              <View style={styles.dataGrid}>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>HUMIDITY</Text>
                  <View style={styles.dataValueRow}>
                    <Text style={styles.dataIcon}>💧</Text>
                    <Text style={styles.dataValue}>45%</Text>
                  </View>
                </View>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>EST. ARRIVAL</Text>
                  <View style={styles.dataValueRow}>
                    <Text style={styles.dataIcon}>🕐</Text>
                    <Text style={styles.dataValue}>14:35</Text>
                  </View>
                </View>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>BATTERY</Text>
                  <View style={styles.dataValueRow}>
                    <Text style={styles.dataIcon}>🔋</Text>
                    <Text style={styles.dataValue}>92%</Text>
                  </View>
                </View>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>PLATE</Text>
                  <View style={styles.dataValueRow}>
                    <Text style={styles.dataIcon}>🚚</Text>
                    <Text style={styles.dataValue}>{selectedTruck.plate_number}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.primaryAction}
                  onPress={() => navigation.navigate("ShipmentDetails", { truckId: selectedTruck._id })}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryActionText}>📊 View Sensor Log</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryAction} activeOpacity={0.85}>
                  <Text style={styles.secondaryActionText}>📞 Contact Driver</Text>
                </TouchableOpacity>
              </View>
            </GlassCard>
          </View>
        )}
      </View>

      <View style={styles.truckSelector}>
        <Text style={styles.selectorLabel}>SELECT VEHICLE</Text>
        <FlatList
          horizontal
          data={trucks}
          keyExtractor={(item) => item._id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.selectorList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.selectorItem,
                selectedTruck?._id === item._id && styles.selectorItemActive,
              ]}
              onPress={() => setSelectedTruck(item)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.selectorItemName,
                  selectedTruck?._id === item._id && styles.selectorItemNameActive,
                ]}
              >
                {item.name}
              </Text>
              <StatusBadge status={item.status} size="small" />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default LiveTracking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: `${colors.tertiaryFixed}1a`,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: rounded.full,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.onTertiaryContainer,
  },
  liveText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.onTertiaryContainer,
    fontFamily: typography.fonts.mono,
    letterSpacing: 0.6,
  },
  mapArea: {
    flex: 1,
    position: "relative",
  },
  mapBackground: {
    flex: 1,
    backgroundColor: colors.surfaceContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  mapPlaceholder: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  mapLabel: {
    fontSize: typography.bodyLg.fontSize,
    color: colors.onSurfaceVariant,
    fontFamily: typography.fonts.sans,
  },
  sensorOverlay: {
    position: "absolute",
    top: spacing.md,
    left: spacing.edgeMargin,
  },
  sensorCard: {
    padding: spacing.md,
  },
  sensorLabel: {
    fontSize: 10,
    fontFamily: typography.fonts.mono,
    fontWeight: "500",
    color: colors.outline,
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  sensorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  sensorValue: {
    fontSize: typography.headlineLg.fontSize,
    fontWeight: "700",
    color: colors.onSurface,
    fontFamily: typography.fonts.sans,
  },
  sensorStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sensorStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.onTertiaryContainer,
  },
  sensorStatusText: {
    fontSize: typography.bodySm.fontSize,
    fontWeight: "600",
    color: colors.onTertiaryContainer,
    fontFamily: typography.fonts.sans,
  },
  bottomOverlay: {
    position: "absolute",
    bottom: spacing.md,
    left: spacing.edgeMargin,
    right: spacing.edgeMargin,
  },
  truckInfoCard: {
    padding: spacing.lg,
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: colors.surfaceContainer,
    borderRadius: 2,
    marginBottom: spacing.lg,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.secondary,
    borderRadius: 2,
  },
  dataGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  dataItem: {
    width: "48%",
    marginBottom: spacing.md,
  },
  dataLabel: {
    fontSize: 10,
    fontFamily: typography.fonts.mono,
    fontWeight: "500",
    color: colors.outline,
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  dataValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  dataIcon: {
    fontSize: 14,
  },
  dataValue: {
    fontSize: typography.dataDisplay.fontSize,
    fontWeight: "600",
    color: colors.onSurface,
    fontFamily: typography.fonts.mono,
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  primaryAction: {
    flex: 1,
    backgroundColor: colors.primaryContainer,
    paddingVertical: spacing.md,
    borderRadius: rounded.lg,
    alignItems: "center",
  },
  primaryActionText: {
    fontSize: typography.bodySm.fontSize,
    fontWeight: "600",
    color: "#ffffff",
    fontFamily: typography.fonts.sans,
  },
  secondaryAction: {
    flex: 1,
    backgroundColor: colors.surfaceContainerHigh,
    paddingVertical: spacing.md,
    borderRadius: rounded.lg,
    alignItems: "center",
  },
  secondaryActionText: {
    fontSize: typography.bodySm.fontSize,
    fontWeight: "600",
    color: colors.onSurface,
    fontFamily: typography.fonts.sans,
  },
  truckSelector: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  selectorLabel: {
    fontSize: 10,
    fontFamily: typography.fonts.mono,
    fontWeight: "500",
    color: colors.outline,
    letterSpacing: 0.6,
    marginHorizontal: spacing.edgeMargin,
    marginBottom: spacing.sm,
  },
  selectorList: {
    paddingHorizontal: spacing.edgeMargin,
    gap: spacing.sm,
  },
  selectorItem: {
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: rounded.lg,
    borderWidth: 1.5,
    borderColor: "transparent",
    minWidth: 120,
  },
  selectorItemActive: {
    borderColor: colors.secondary,
    backgroundColor: `${colors.secondary}0d`,
  },
  selectorItemName: {
    fontSize: typography.bodySm.fontSize,
    fontWeight: "600",
    color: colors.onSurface,
    fontFamily: typography.fonts.sans,
    marginBottom: 4,
  },
  selectorItemNameActive: {
    color: colors.secondary,
  },
});
