import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#85B79D",
        tabBarInactiveTintColor: "#bbb",
        headerStyle: {
          backgroundColor: "#2B0607",
        },
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
          color: "#f0f4ff",
        },
        headerTintColor: "#f0f4ff",
        tabBarStyle: {
          backgroundColor: "#2B0607",
          borderTopWidth: 0.5,
          borderTopColor: "#333",
          height: 65,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "book" : "book-outline"} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "search-outline" : "search-outline"} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person-circle-outline" : "person-circle-outline"} color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
