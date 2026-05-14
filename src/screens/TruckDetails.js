import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-chart-kit";
import Header from "../components/Header";

const screenWidth = Dimensions.get("window").width;

const TruckDetails = ({ route }) => {
  const { truckId } = route.params;

  const [telemetry, setTelemetry] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadTelemetry = async (pageNumber = 1) => {
    const token = await AsyncStorage.getItem("token"); 
    setLoading(true);

    axios
      .get(
        `http://20.20.22.203:1234/api/telemetry/${truckId}?page=${pageNumber}&limit=10`, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (pageNumber === 1) {
          setTelemetry(res.data.data);
        } else {
          setTelemetry((prev) => [...prev, ...res.data.data]);
        }
        setLoading(false);
        
      })
      .catch((err) => {
        console.log(err.message);
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
    if (temp > 8) return "#ff4d4d";
    if (temp < 2) return "#007AFF";
    return "#28a745";
  };

  const chartData = {
    labels: telemetry.slice(0, 6).map(() => ""),
    datasets: [
      {
        data: telemetry.slice(0, 6).map((item) => item.temperature),
        color: () => "#007AFF",
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Header title="Truck Details" />

      {telemetry.length > 0 && (
        <LineChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 1,
            color: () => "#007AFF",
            labelColor: () => "#666",
          }}
          bezier
          style={styles.chart}
        />
      )}

      <Text style={styles.historyTitle}>History</Text>

      <FlatList
        data={telemetry}
        keyExtractor={(item) => item._id}
        
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text
              style={[
                styles.temperature,
                { color: getTempColor(item.temperature) },
              ]}
            >
              {item.temperature} °C
            </Text>
            <Text style={styles.date}>
              {new Date(item.timestamp).toLocaleString()}
            </Text>
          </View>
        )}
      />

      {loading && <ActivityIndicator size="large" />}
    </View>
  );
};

export default TruckDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chart: {
    borderRadius: 12,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },
  temperature: {
    fontSize: 18,
    fontWeight: "bold",
  },
  date: {
    marginTop: 5,
    color: "#666",
  },
});