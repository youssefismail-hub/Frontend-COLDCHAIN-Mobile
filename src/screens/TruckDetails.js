import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import api from "../services/api";
import { LineChart } from "react-native-chart-kit";
import Header from "../components/Header";
import GlassCard from "../components/GlassCard";
import { colors, spacing, typography } from "../theme";

const screenWidth = Dimensions.get("window").width;

const TruckDetails = ({ route }) => {
  const { truckId } = route.params;

  const [telemetry, setTelemetry] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadTelemetry = async (pageNumber = 1) => {
    setLoading(true);

    api
      .get(`/api/telemetry/${truckId}?page=${pageNumber}&limit=10`)
      .then((res) => {
        if (pageNumber === 1) {
          setTelemetry(res.data.data);
        } else {
          setTelemetry((prev) => [...prev, ...res.data.data]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load telemetry:", err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
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
    return colors.success;
  };

  const chartData = {
    labels: telemetry.slice(0, 6).map(() => ""),
    datasets: [
      {
        data: telemetry.slice(0, 6).map((item) => item.temperature),
        color: () => colors.secondary,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Header title="Truck Details" />

      {telemetry.length > 0 && (
        <View style={styles.chartContainer}>
          <LineChart
            data={chartData}
            width={screenWidth - spacing.lg * 2}
            height={220}
            chartConfig={{
              backgroundColor: colors.surface,
              backgroundGradientFrom: colors.surface,
              backgroundGradientTo: colors.surface,
              decimalPlaces: 1,
              color: () => colors.secondary,
              labelColor: () => colors.onSurfaceVariant,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: colors.secondary
              }
            }}
            bezier
            style={styles.chart}
          />
        </View>
      )}

      <Text style={styles.historyTitle}>TELEMETRY HISTORY</Text>

      <FlatList
        data={telemetry}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <GlassCard style={styles.card}>
            <View style={styles.dataRow}>
              <Text
                style={[
                  styles.temperature,
                  { color: getTempColor(item.temperature) },
                ]}
              >
                {item.temperature.toFixed(1)} °C
              </Text>
              <Text style={styles.date}>
                {new Date(item.timestamp).toLocaleString([], { 
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                })}
              </Text>
            </View>
          </GlassCard>
        )}
      />

      {loading && <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />}
    </View>
  );
};

export default TruckDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  chartContainer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  chart: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
  },
  historyTitle: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.mono,
    fontWeight: "700",
    color: colors.onSurfaceVariant,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    letterSpacing: 1,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  card: {
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  temperature: {
    fontSize: typography.sizes.lg,
    fontWeight: "bold",
    fontFamily: typography.fonts.mono,
  },
  date: {
    fontSize: typography.sizes.sm,
    color: colors.onSurfaceVariant,
    fontFamily: typography.fonts.sans,
  },
  loader: {
    marginVertical: spacing.lg,
  }
});