import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import axios from "axios";

const Alerts = ({ route }) => {
  const { token } = route.params;
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost/api/alerts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAlerts(res.data.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        Alerts
      </Text>

      <FlatList
        data={alerts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={{ marginTop: 15 }}>
            <Text>Type: {item.type}</Text>
            <Text>Message: {item.message}</Text>
            <Text>Severity: {item.severity}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Alerts;