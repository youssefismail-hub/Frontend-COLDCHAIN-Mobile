import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import axios from "axios";

const Dashboard = ({ route, navigation }) => {
  const { token } = route.params;
  const [trucks, setTrucks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost/api/trucks", {
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
    </View>
  );
};

export default Dashboard;