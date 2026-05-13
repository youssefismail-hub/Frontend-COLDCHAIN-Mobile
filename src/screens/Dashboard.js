import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Dashboard = ({ route, navigation }) => {
  const { token } = route.params;
  const [trucks, setTrucks] = useState([]);

  const logoutHandler = async () => {
  await AsyncStorage.removeItem("token");
  navigation.replace("Login");
  };

useEffect(() => {
  const loadTrucks = async () => {
    const token = await AsyncStorage.getItem("token");

    axios
      .get("http://localhost:1234/api/trucks", {
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

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        My Trucks
      </Text>

      <FlatList
        data={trucks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={{ marginTop: 15 }}>
            <Text>Name: {item.name}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate("Alerts", { token })}
        style={{ marginTop: 20 }}
      >
        <Text style={{ color: "blue" }}>Go to Alerts</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={logoutHandler}
        style={{ marginTop: 20 }}
        >
        <Text style={{ color: "red" }}>Logout</Text>
     </TouchableOpacity>
    </View>
  );
};

export default Dashboard;