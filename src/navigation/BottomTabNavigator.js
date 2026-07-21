import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, typography, spacing, rounded } from "../theme";

import Dashboard from "../screens/Dashboard";
import LiveTracking from "../screens/LiveTracking";
import Shipments from "../screens/Shipments";
import Alerts from "../screens/Alerts";

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Dashboard: { active: "📊", inactive: "📊" },
  Tracking: { active: "📍", inactive: "📍" },
  Shipments: { active: "📦", inactive: "📦" },
  Alerts: { active: "⚠️", inactive: "⚠️" },
};

const BottomTabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          const icon = TAB_ICONS[route.name];
          return (
            <View style={[styles.tabIconWrap, focused && styles.tabIconWrapActive]}>
              <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>
                {focused ? icon.active : icon.inactive}
              </Text>
            </View>
          );
        },
        tabBarLabel: ({ focused }) => (
          <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
            {route.name}
          </Text>
        ),
        tabBarStyle: [
          styles.tabBar,
          { paddingBottom: Math.max(insets.bottom, 8) },
        ],
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Tracking" component={LiveTracking} />
      <Tab.Screen name="Shipments" component={Shipments} />
      <Tab.Screen name="Alerts" component={Alerts} />
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
    backgroundColor: `${colors.surface}cc`,
    borderTopWidth: 1,
    borderTopColor: `${colors.outlineVariant}30`,
    paddingTop: spacing.xs,
    height: 64,
    elevation: 8,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  tabIconWrap: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 32,
    borderRadius: rounded.full,
  },
  tabIconWrapActive: {
    backgroundColor: `${colors.secondaryContainer}1a`,
  },
  tabIcon: {
    fontSize: 20,
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
