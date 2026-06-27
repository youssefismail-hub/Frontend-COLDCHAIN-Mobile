import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import api from "../services/api";
import Header from "../components/Header";

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

  const getSeverityColor = (severity) => {
    if (severity === "CRITICAL") return "#ff4d4d";
    if (severity === "WARNING") return "#ffa500";
    return "#007AFF";
  };

  return (
    <View style={styles.container}>
      <Header title="Alerts" />

      <FlatList
        data={alerts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.type}>{item.type}</Text>

              <View
                style={[
                  styles.badge,
                  { backgroundColor: getSeverityColor(item.severity) },
                ]}
              >
                <Text style={styles.badgeText}>
                  {item.severity}
                </Text>
              </View>
            </View>

            <Text style={styles.message}>
              {item.message}
            </Text>

            <Text style={styles.status}>
              Status: {item.resolved ? "Resolved ✅" : "Active ❗"}
            </Text>

            {!item.resolved && (
              <TouchableOpacity
                onPress={() => resolveAlert(item._id)}
                style={styles.resolveButton}
              >
                <Text style={styles.resolveText}>
                  Resolve Alert
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default Alerts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  type: {
    fontSize: 16,
    fontWeight: "bold",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  message: {
    marginTop: 8,
    color: "#555",
  },
  status: {
    marginTop: 8,
    fontWeight: "bold",
  },
  resolveButton: {
    backgroundColor: "#28a745",
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  resolveText: {
    color: "#fff",
    fontWeight: "bold",
  },
});