import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";


const Dashboard = ({ navigation }) => {
  const [trucks, setTrucks] = useState([]);

  const logoutHandler = async () => {
    await AsyncStorage.removeItem("token");
    navigation.replace("Login");
  };

  useEffect(() => {
    const loadTrucks = async () => {
      const token = await AsyncStorage.getItem("token");

      axios
        .get("http://20.20.22.203:1234/api/trucks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setTrucks(res.data.data);
          
        })
        .catch((err) => {
          console.log(err.message);
          
        });
    };

    loadTrucks();
  }, []);

  const getStatusColor = (status) => {
    if (status === "CRITICAL") return "#ff4d4d";
    if (status === "WARNING") return "#ffa500";
    if (status === "OK") return "#28a745";
    return "#999";
  };

  return (
    <View style={styles.container}>
      <Header title="Dashboard" />

      <FlatList
        data={trucks}
        keyExtractor={(item) => item._id}
        
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("TruckDetails", {
                truckId: item._id,
              })
            }
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.truckName}>{item.name}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(item.status) },
                ]}
              >
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>

            <Text style={styles.plate}>
              Plate: {item.plate_number}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate("Alerts")}
        style={styles.alertButton}
      >
        <Text style={styles.alertText}>View Alerts</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={logoutHandler}
        style={styles.logoutButton}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Dashboard;

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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  truckName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  plate: {
    marginTop: 8,
    color: "#666",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  alertButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  alertText: {
    color: "#fff",
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#ff4d4d",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
});