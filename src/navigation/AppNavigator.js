import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/Login";
import Dashboard from "../screens/Dashboard";
import Alerts from "../screens/Alerts";
import TruckDetails from "../screens/TruckDetails";
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Alerts" component={Alerts} />
        <Stack.Screen name="TruckDetails" component={TruckDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;