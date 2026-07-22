import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { io } from "socket.io-client";
import api, { API_URL } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GlassCard from "../components/GlassCard";
import StatusBadge from "../components/StatusBadge";
import { colors, spacing, typography, rounded, shadows } from "../theme";

const statusColors = {
  OK: "#10b981",
  WARNING: "#f59e0b",
  CRITICAL: "#ef4444",
  OFFLINE: "#64748b",
};

const LiveTracking = ({ navigation }) => {
  const [trucks, setTrucks] = useState([]);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const mapRef = useRef(null);
  const socketRef = useRef(null);

  const companyIdRef = useRef(null);

  const loadTrucks = useCallback(async () => {
    try {
      const res = await api.get("/api/trucks");
      const data = res.data.data || [];
      setTrucks(data);
      if (data.length > 0 && !selectedTruck) {
        setSelectedTruck(data[0]);
      }
      companyIdRef.current = data[0]?.company?._id || data[0]?.company || null;
      return data;
    } catch (err) {
      console.error("Failed to load trucks:", err.message);
      return [];
    }
  }, [selectedTruck]);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const trucksData = await loadTrucks();
      if (!mounted) return;
      const cid = trucksData[0]?.company?._id || trucksData[0]?.company;
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;
        const socket = io(API_URL, {
          autoConnect: true,
          auth: { token },
        });
        socketRef.current = socket;
        socket.on("connect", () => {
          if (cid) socket.emit("join_company", cid);
        });
        socket.on("telemetry_update", (data) => {
          if (!mounted) return;
          setTrucks(prev =>
            prev.map(t => {
              if (t._id === data.truckId) {
                return {
                  ...t,
                  temperature: data.temperature,
                  status: data.status || t.status,
                  door_open: data.door_open !== undefined ? data.door_open : t.door_open,
                  latitude: data.latitude !== undefined ? data.latitude : t.latitude,
                  longitude: data.longitude !== undefined ? data.longitude : t.longitude,
                  lastSeen: data.timestamp || t.lastSeen,
                };
              }
              return t;
            })
          );
          setSelectedTruck(prev => {
            if (prev && prev._id === data.truckId) {
              return {
                ...prev,
                temperature: data.temperature,
                status: data.status || prev.status,
                door_open: data.door_open !== undefined ? data.door_open : prev.door_open,
                latitude: data.latitude !== undefined ? data.latitude : prev.latitude,
                longitude: data.longitude !== undefined ? data.longitude : prev.longitude,
                lastSeen: data.timestamp || prev.lastSeen,
              };
            }
            return prev;
          });
        });
      } catch (err) {
        console.error("Socket init error:", err.message);
      }
    };
    init();
    return () => {
      mounted = false;
      if (socketRef.current) {
        socketRef.current.off("telemetry_update");
        socketRef.current.disconnect();
      }
    };
  }, [loadTrucks]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTrucks();
    setRefreshing(false);
  }, [loadTrucks]);

  const selectedLat = selectedTruck?.latitude;
  const selectedLng = selectedTruck?.longitude;
  const hasLocation = selectedLat != null && selectedLng != null;

  const region = hasLocation
    ? {
        latitude: selectedLat,
        longitude: selectedLng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : null;

  const markerColor = selectedTruck
    ? statusColors[selectedTruck.status] || statusColors.OFFLINE
    : statusColors.OFFLINE;

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
        {region ? (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={region}
            showsUserLocation={false}
            showsCompass={true}
            showsScale={true}
          >
            {trucks
              .filter(t => t.latitude != null && t.longitude != null)
              .map(truck => {
                const color = statusColors[truck.status] || statusColors.OFFLINE;
                const isSelected = selectedTruck?._id === truck._id;
                return (
                  <Marker
                    key={truck._id}
                    coordinate={{ latitude: truck.latitude, longitude: truck.longitude }}
                    title={truck.name}
                    pinColor={color}
                    opacity={isSelected ? 1 : 0.7}
                    onPress={() => setSelectedTruck(truck)}
                  >
                    <Callout>
                      <View style={styles.calloutContainer}>
                        <Text style={styles.calloutTitle}>{truck.name}</Text>
                        <Text style={styles.calloutSub}>{truck.plate_number}</Text>
                        <Text style={styles.calloutTemp}>
                          {truck.temperature != null
                            ? `${truck.temperature.toFixed(1)}°C`
                            : "--"}
                        </Text>
                        <View
                          style={[
                            styles.calloutBadge,
                            { backgroundColor: color },
                          ]}
                        >
                          <Text style={styles.calloutBadgeText}>
                            {truck.status}
                          </Text>
                        </View>
                      </View>
                    </Callout>
                  </Marker>
                );
              })}
          </MapView>
        ) : (
          <View style={styles.mapBackground}>
            <Text style={styles.mapPlaceholder}>🗺️</Text>
            <Text style={styles.mapLabel}>En attente des données GPS...</Text>
            <ActivityIndicator
              size="small"
              color={colors.secondary}
              style={{ marginTop: spacing.md }}
            />
          </View>
        )}

        {selectedTruck && hasLocation && (
          <View style={styles.sensorOverlay}>
            <GlassCard style={styles.sensorCard}>
              <Text style={styles.sensorLabel}>INTERNAL TEMP</Text>
              <View style={styles.sensorRow}>
                <Text style={styles.sensorValue}>
                  {selectedTruck.temperature != null
                    ? `${selectedTruck.temperature.toFixed(1)}°C`
                    : "--"}
                </Text>
                <View style={styles.sensorStatus}>
                  <View
                    style={[
                      styles.sensorStatusDot,
                      { backgroundColor: markerColor },
                    ]}
                  />
                  <Text style={[styles.sensorStatusText, { color: markerColor }]}>
                    {selectedTruck.status}
                  </Text>
                </View>
              </View>
            </GlassCard>
          </View>
        )}
      </View>

      {selectedTruck && (
        <View style={styles.bottomSheet}>
          <GlassCard style={styles.truckInfoCard}>
            <View style={styles.truckInfoHeader}>
              <View>
                <Text style={styles.truckName}>{selectedTruck.name}</Text>
                <Text style={styles.truckPlate}>
                  {selectedTruck.plate_number}
                </Text>
              </View>
              <StatusBadge status={selectedTruck.status} size="small" />
            </View>

            <View style={styles.dataGrid}>
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>PORTE</Text>
                <Text style={styles.dataValue}>
                  {selectedTruck.door_open ? "Ouverte" : "Fermée"}
                </Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>TEMP MIN</Text>
                <Text style={styles.dataValue}>
                  {selectedTruck.min_temperature ?? "--"}°C
                </Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>TEMP MAX</Text>
                <Text style={styles.dataValue}>
                  {selectedTruck.max_temperature ?? "--"}°C
                </Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>STATUT</Text>
                <Text style={[styles.dataValue, { color: markerColor }]}>
                  {selectedTruck.status}
                </Text>
              </View>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.primaryAction}
                onPress={() =>
                  navigation.navigate("ShipmentDetails", {
                    truckId: selectedTruck._id,
                  })
                }
                activeOpacity={0.85}
              >
                <Text style={styles.primaryActionText}>
                  📊 Voir l'historique
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryAction}
                activeOpacity={0.85}
                onPress={() => {
                  if (hasLocation) {
                    const url = `https://www.google.com/maps?q=${selectedLat},${selectedLng}`;
                    navigation.navigate("ShipmentDetails", {
                      truckId: selectedTruck._id,
                    });
                    alert(`📍 Position: ${selectedLat.toFixed(4)}, ${selectedLng.toFixed(4)}`);
                  } else {
                    alert("Aucune position GPS disponible");
                  }
                }}
              >
                <Text style={styles.secondaryActionText}>📍 Position</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </View>
      )}

      <View style={styles.truckSelector}>
        <Text style={styles.selectorLabel}>SÉLECTIONNER UN VÉHICULE</Text>
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
                selectedTruck?._id === item._id &&
                  styles.selectorItemActive,
              ]}
              onPress={() => {
                setSelectedTruck(item);
                if (item.latitude != null && item.longitude != null) {
                  mapRef.current?.animateToRegion(
                    {
                      latitude: item.latitude,
                      longitude: item.longitude,
                      latitudeDelta: 0.05,
                      longitudeDelta: 0.05,
                    },
                    500
                  );
                }
              }}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.selectorItemName,
                  selectedTruck?._id === item._id &&
                    styles.selectorItemNameActive,
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
  map: {
    ...StyleSheet.absoluteFillObject,
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
    zIndex: 10,
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
  },
  sensorStatusText: {
    fontSize: typography.bodySm.fontSize,
    fontWeight: "600",
    fontFamily: typography.fonts.sans,
  },
  bottomSheet: {
    paddingHorizontal: spacing.edgeMargin,
    paddingBottom: spacing.sm,
  },
  truckInfoCard: {
    padding: spacing.lg,
  },
  truckInfoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  truckName: {
    fontSize: typography.bodyLg.fontSize,
    fontWeight: "700",
    color: colors.onSurface,
    fontFamily: typography.fonts.sans,
  },
  truckPlate: {
    fontSize: typography.bodySm.fontSize,
    color: colors.onSurfaceVariant,
    fontFamily: typography.fonts.mono,
  },
  dataGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  dataItem: {
    width: "48%",
    marginBottom: spacing.sm,
  },
  dataLabel: {
    fontSize: 10,
    fontFamily: typography.fonts.mono,
    fontWeight: "500",
    color: colors.outline,
    letterSpacing: 0.6,
    marginBottom: 2,
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
  calloutContainer: {
    padding: spacing.xs,
    minWidth: 120,
  },
  calloutTitle: {
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 2,
  },
  calloutSub: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
  },
  calloutTemp: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  calloutBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  calloutBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  truckSelector: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
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
