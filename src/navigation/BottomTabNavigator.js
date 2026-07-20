import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { colors, typography, spacing, rounded } from "../theme";

import Dashboard from "../screens/Dashboard";
import LiveTracking from "../screens/LiveTracking";
import Shipments from "../screens/Shipments";
import Alerts from "../screens/Alerts";

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Dashboard: "📊",
  Tracking: "📍",
  Shipments: "📦",
  Alerts: "⚠️",
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>
            {TAB_ICONS[route.name]}
          </Text>
        ),
        tabBarLabel: ({ focused }) => (
          <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
            {route.name}
          </Text>
        ),
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Tracking" component={LiveTracking} />
      <Tab.Screen name="Shipments" component={Shipments} />
      <Tab.Screen
        name="Alerts"
        component={Alerts}
        options={{
          tabBarBadge: undefined,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: `${colors.surface}cc`,
    borderTopWidth: 1,
    borderTopColor: `${colors.outlineVariant}4d`,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    elevation: 8,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  tabIcon: {
    fontSize: 18,
    opacity: 0.6,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "500",
    fontFamily: typography.fonts.mono,
    letterSpacing: 0.6,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  tabLabelActive: {
    color: colors.secondary,
    fontWeight: "700",
  },
});
