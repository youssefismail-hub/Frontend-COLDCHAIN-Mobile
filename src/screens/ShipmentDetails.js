import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import api from "../services/api";
import { LineChart } from "react-native-chart-kit";
import GlassCard from "../components/GlassCard";
import StatusBadge from "../components/StatusBadge";
import { colors, spacing, typography, rounded, shadows } from "../theme";

const screenWidth = Dimensions.get("window").width;

const ShipmentDetails = ({ route, navigation }) => {
  const { truckId } = route.params;
  const [truck, setTruck] = useState(null);
  const [telemetry, setTelemetry] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadTelemetry = async (pageNumber = 1) => {
    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await api.get(`/api/telemetry/${truckId}?page=${pageNumber}&limit=10`);
      if (pageNumber === 1) {
        setTelemetry(res.data.data);
      } else {
        setTelemetry((prev) => [...prev, ...res.data.data]);
      }
    } catch (err) {
      console.error("Failed to load telemetry:", err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadTruck = async () => {
    try {
      const res = await api.get("/api/trucks");
      const found = res.data.data.find((t) => t._id === truckId);
      setTruck(found);
    } catch (err) {
      console.error("Failed to load truck:", err.message);
    }
  };

  useEffect(() => {
    loadTruck();
    loadTelemetry();
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadTelemetry(nextPage);
  };

  const getTempColor = (temp) => {
    if (temp > 8) return colors.error;
    if (temp < 2) return colors.secondary;
    return colors.onTertiaryContainer;
  };

  const latestTemp = telemetry.length > 0 ? telemetry[0].temperature : null;

  const chartData = telemetry.length > 0 ? {
    labels: telemetry.slice(0, 6).map(() => ""),
    datasets: [
      {
        data: telemetry.slice(0, 6).map((item) => item.temperature),
        color: () => colors.secondary,
      },
    ],
  } : null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shipment Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={telemetry}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <>
            <View style={styles.shipmentHeader}>
              <View>
                <Text style={styles.shipmentLabel}>ACTIVE SHIPMENT</Text>
                <Text style={styles.shipmentId}>{truck?.name || "Loading..."}</Text>
              </View>
              <View style={styles.shipmentRight}>
                <Text style={styles.shipmentDestLabel}>PLATE</Text>
                <Text style={styles.shipmentDest}>{truck?.plate_number || "N/A"}</Text>
              </View>
            </View>

            {chartData && (
              <GlassCard style={styles.chartCard}>
                <View style={styles.chartHeader}>
                  <View>
                    <Text style={styles.chartTitle}>Temperature History</Text>
                    <Text style={styles.chartSubtitle}>Last readings • Live</Text>
                  </View>
                  <View style={styles.chartBadge}>
                    <Text style={styles.chartBadgeText}>📊 LIVE</Text>
                  </View>
                </View>

                <View style={styles.chartContainer}>
                  <LineChart
                    data={chartData}
                    width={screenWidth - spacing.edgeMargin * 2 - spacing.md * 2}
                    height={200}
                    chartConfig={{
                      backgroundColor: "transparent",
                      backgroundGradientFrom: "rgba(255,255,255,0.7)",
                      backgroundGradientTo: "rgba(255,255,255,0.7)",
                      decimalPlaces: 1,
                      color: () => colors.secondary,
                      labelColor: () => colors.outline,
                      style: { borderRadius: rounded.lg },
                      propsForDots: {
                        r: "4",
                        strokeWidth: "2",
                        stroke: colors.secondary,
                      },
                    }}
                    bezier
                    style={styles.chart}
                  />
                </View>

                {latestTemp !== null && (
                  <View style={styles.chartFooter}>
                    <View style={styles.chartFooterLeft}>
                      <View style={styles.tempDotContainer}>
                        <View style={[styles.tempDot, { backgroundColor: getTempColor(latestTemp) }]} />
                      </View>
                      <Text style={[styles.currentTemp, { color: getTempColor(latestTemp) }]}>
                        {latestTemp.toFixed(1)}°C
                      </Text>
                    </View>
                    <Text style={styles.thresholdText}>Threshold: -15°C to -22°C</Text>
                  </View>
                )}
              </GlassCard>
            )}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sensor Status</Text>
            </View>
            <View style={styles.sensorList}>
              <View style={styles.sensorItem}>
                <View style={styles.sensorItemLeft}>
                  <View style={styles.sensorItemIconWrap}>
                    <Text style={styles.sensorItemIcon}>📡</Text>
                  </View>
                  <View>
                    <Text style={styles.sensorItemName}>Probe A</Text>
                    <Text style={styles.sensorItemDesc}>Ambient Zone</Text>
                  </View>
                </View>
                <View style={[styles.sensorStatusBadge, { backgroundColor: `${colors.onTertiaryContainer}1a` }]}>
                  <Text style={[styles.sensorStatusBadgeText, { color: colors.onTertiaryContainer }]}>ACTIVE</Text>
                </View>
              </View>
              <View style={styles.sensorItem}>
                <View style={styles.sensorItemLeft}>
                  <View style={styles.sensorItemIconWrap}>
                    <Text style={styles.sensorItemIcon}>🌡️</Text>
                  </View>
                  <View>
                    <Text style={styles.sensorItemName}>Probe B</Text>
                    <Text style={styles.sensorItemDesc}>Core Temp</Text>
                  </View>
                </View>
                <View style={[styles.sensorStatusBadge, { backgroundColor: `${colors.secondary}1a` }]}>
                  <Text style={[styles.sensorStatusBadgeText, { color: colors.secondary }]}>CALIBRATING</Text>
                </View>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Manifest Details</Text>
            </View>
            <View style={styles.manifestGrid}>
              <View style={styles.manifestItem}>
                <Text style={styles.manifestLabel}>WEIGHT</Text>
                <Text style={styles.manifestValue}>1,240 kg</Text>
              </View>
              <View style={styles.manifestItem}>
                <Text style={styles.manifestLabel}>PALLETS</Text>
                <Text style={styles.manifestValue}>04 Units</Text>
              </View>
              <View style={[styles.manifestItem, styles.manifestItemFull]}>
                <View style={styles.manifestItemFullContent}>
                  <View>
                    <Text style={styles.manifestLabel}>CARGO TYPE</Text>
                    <Text style={styles.manifestItemFullValue}>Biopharmaceutical (Class A)</Text>
                  </View>
                  <Text style={styles.manifestItemFullIcon}>💊</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.downloadButton}
              activeOpacity={0.85}
              onPress={() => alert("Report download coming soon")}
            >
              <Text style={styles.downloadButtonIcon}>📥</Text>
              <Text style={styles.downloadButtonText}>Download Full Report</Text>
            </TouchableOpacity>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Telemetry History</Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.telemetryItem}>
            <View style={styles.telemetryLeft}>
              <View style={[styles.telemetryDot, { backgroundColor: getTempColor(item.temperature) }]} />
              <View style={styles.telemetryLine} />
            </View>
            <GlassCard style={styles.telemetryCard}>
              <View style={styles.telemetryRow}>
                <Text style={[styles.telemetryTemp, { color: getTempColor(item.temperature) }]}>
                  {item.temperature.toFixed(1)}°C
                </Text>
                <Text style={styles.telemetryDate}>
                  {new Date(item.timestamp).toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            </GlassCard>
          </View>
        )}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="small" color={colors.secondary} style={styles.loader} />
          ) : (
            <View style={{ height: 100 }} />
          )
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color={colors.secondary} style={styles.loader} />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📊</Text>
              <Text style={styles.emptyTitle}>No Telemetry Data</Text>
              <Text style={styles.emptySubtitle}>No sensor readings available yet</Text>
            </View>
          )
        }
      />
    </View>
  );
};

export default ShipmentDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.edgeMargin,
    height: 56,
    backgroundColor: `${colors.surface}cc`,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.outlineVariant}4d`,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 22,
    color: colors.secondary,
  },
  headerTitle: {
    fontSize: typography.headlineMd.fontSize,
    fontWeight: "700",
    color: colors.onSurface,
    fontFamily: typography.fonts.sans,
  },
  listContent: {
    paddingHorizontal: spacing.edgeMargin,
    paddingTop: spacing.lg,
  },
  shipmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: spacing.lg,
  },
  shipmentLabel: {
    fontSize: 10,
    fontFamily: typography.fonts.mono,
    fontWeight: "500",
    color: colors.secondary,
    letterSpacing: 0.6,
  },
  shipmentId: {
    fontSize: typography.headlineLgMobile.fontSize,
    fontWeight: "700",
    color: colors.onSurface,
    fontFamily: typography.fonts.sans,
    marginTop: 4,
  },
  shipmentRight: {
    alignItems: "flex-end",
  },
  shipmentDestLabel: {
    fontSize: 10,
    fontFamily: typography.fonts.mono,
    fontWeight: "500",
    color: colors.outline,
    letterSpacing: 0.6,
  },
  shipmentDest: {
    fontSize: typography.bodyLg.fontSize,
    color: colors.onSurfaceVariant,
    fontFamily: typography.fonts.sans,
    marginTop: 2,
  },
  chartCard: {
    marginBottom: spacing.lg,
    overflow: "hidden",
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  chartTitle: {
    fontSize: typography.headlineMd.fontSize,
    fontWeight: "600",
    color: colors.onSurface,
    fontFamily: typography.fonts.sans,
  },
  chartSubtitle: {
    fontSize: typography.bodySm.fontSize,
    color: colors.onSurfaceVariant,
    fontFamily: typography.fonts.sans,
    marginTop: 2,
  },
  chartBadge: {
    backgroundColor: `${colors.errorContainer}33`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: rounded.full,
  },
  chartBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.error,
    fontFamily: typography.fonts.mono,
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: spacing.md,
  },
  chart: {
    borderRadius: rounded.lg,
  },
  chartFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: `${colors.outlineVariant}4d`,
    paddingTop: spacing.md,
  },
  chartFooterLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  tempDotContainer: {
    position: "relative",
    width: 12,
    height: 12,
  },
  tempDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  currentTemp: {
    fontSize: typography.dataDisplay.fontSize,
    fontWeight: "700",
    fontFamily: typography.fonts.mono,
  },
  thresholdText: {
    fontSize: typography.bodySm.fontSize,
    color: colors.onSurfaceVariant,
    fontFamily: typography.fonts.sans,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.headlineMd.fontSize,
    fontWeight: "600",
    color: colors.onSurface,
    fontFamily: typography.fonts.sans,
  },
  telemetryItem: {
    flexDirection: "row",
    marginBottom: spacing.sm,
  },
  telemetryLeft: {
    width: 24,
    alignItems: "center",
  },
  telemetryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: spacing.md,
  },
  telemetryLine: {
    flex: 1,
    width: 2,
    backgroundColor: `${colors.outlineVariant}80`,
    marginTop: 4,
  },
  telemetryCard: {
    flex: 1,
    marginLeft: spacing.sm,
    marginBottom: 0,
  },
  telemetryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  telemetryTemp: {
    fontSize: typography.dataDisplay.fontSize,
    fontWeight: "600",
    fontFamily: typography.fonts.mono,
  },
  telemetryDate: {
    fontSize: typography.bodySm.fontSize,
    color: colors.onSurfaceVariant,
    fontFamily: typography.fonts.sans,
  },
  loader: {
    marginVertical: spacing.lg,
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
  sensorList: {
    marginBottom: spacing.lg,
  },
  sensorItem: {
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
  sensorItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  sensorItemIconWrap: {
    width: 40,
    height: 40,
    borderRadius: rounded.md,
    backgroundColor: `${colors.secondary}1a`,
    alignItems: "center",
    justifyContent: "center",
  },
  sensorItemIcon: {
    fontSize: 18,
  },
  sensorItemName: {
    fontSize: typography.bodyLg.fontSize,
    fontWeight: "600",
    color: colors.onSurface,
    fontFamily: typography.fonts.sans,
  },
  sensorItemDesc: {
    fontSize: typography.bodySm.fontSize,
    color: colors.onSurfaceVariant,
    fontFamily: typography.fonts.sans,
    marginTop: 2,
  },
  sensorStatusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: rounded.full,
  },
  sensorStatusBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    fontFamily: typography.fonts.mono,
    letterSpacing: 0.6,
  },
  manifestGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  manifestItem: {
    width: "48%",
    padding: spacing.md,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: rounded.lg,
    borderWidth: 1,
    borderColor: `${colors.outlineVariant}33`,
  },
  manifestItemFull: {
    width: "100%",
  },
  manifestItemFullContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  manifestItemFullValue: {
    fontSize: typography.bodyLg.fontSize,
    fontWeight: "600",
    color: colors.onSurface,
    fontFamily: typography.fonts.sans,
    marginTop: spacing.xs,
  },
  manifestItemFullIcon: {
    fontSize: 20,
    color: colors.secondary,
  },
  manifestLabel: {
    fontSize: 10,
    fontFamily: typography.fonts.mono,
    fontWeight: "500",
    color: colors.outline,
    letterSpacing: 0.6,
  },
  manifestValue: {
    fontSize: typography.dataDisplay.fontSize,
    fontWeight: "600",
    color: colors.onSurface,
    fontFamily: typography.fonts.mono,
    marginTop: spacing.xs,
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.primaryContainer,
    paddingVertical: spacing.md + 4,
    borderRadius: rounded.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  downloadButtonIcon: {
    fontSize: 18,
  },
  downloadButtonText: {
    fontSize: typography.bodyLg.fontSize,
    fontWeight: "600",
    color: colors.onPrimary,
    fontFamily: typography.fonts.sans,
  },
});
