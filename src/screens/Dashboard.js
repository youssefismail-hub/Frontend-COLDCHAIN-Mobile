import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";
import GlassCard from "../components/GlassCard";
import StatusBadge from "../components/StatusBadge";
import PrimaryButton from "../components/PrimaryButton";
import { colors, spacing, typography } from "../theme";

const Dashboard = ({ navigation }) => {
  const [trucks, setTrucks] = useState([]);

  const logoutHandler = async () => {
    await AsyncStorage.removeItem("token");
    navigation.replace("Login");
  };

  useEffect(() => {
    const loadTrucks = async () => {
      api
        .get("/api/trucks")
        .then((res) => {
          setTrucks(res.data.data);
        })
        .catch((err) => {
          console.error("Failed to load trucks:", err.message);
        });
    };

    loadTrucks();
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Dashboard" />

      <FlatList
        data={trucks}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("TruckDetails", {
                truckId: item._id,
              })
            }
            activeOpacity={0.9}
          >
            <GlassCard>
              <View style={styles.cardHeader}>
                <Text style={styles.truckName}>{item.name}</Text>
                <StatusBadge status={item.status} />
              </View>

              <Text style={styles.plate}>
                PLATE: {item.plate_number}
              </Text>
            </GlassCard>
          </TouchableOpacity>
        )}
      />

      <View style={styles.actionContainer}>
        <PrimaryButton 
          title="View Alerts" 
          onPress={() => navigation.navigate("Alerts")} 
          style={styles.actionButton}
        />
        <PrimaryButton 
          title="Logout" 
          variant="danger"
          onPress={logoutHandler} 
          style={styles.actionButton}
        />
      </View>
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
    padding: spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  truckName: {
    fontSize: typography.sizes.lg,
    fontWeight: "700",
    color: colors.textPrimary,
    fontFamily: typography.fonts.sans,
  },
  plate: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontFamily: typography.fonts.mono,
    letterSpacing: 1,
  },
  actionContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  actionButton: {
    width: '100%',
  },
});