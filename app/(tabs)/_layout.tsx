import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#7fc8f8",
        tabBarInactiveTintColor: "#bbb",
        headerStyle: {
          backgroundColor: "#1e1e2e",
        },
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
          color: "#fefefe",
        },
        headerTintColor: "#fefefe",
        tabBarStyle: {
          backgroundColor: "#1e1e2e",
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
        name="book/[id]"
        options={{
          href:null
        }}
      >
      </Tabs.Screen>
      <Tabs.Screen
        name="clubs"
        options={{
          title: "Clubs",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "people" : "people-outline"} color={color} size={24} />
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
    </Tabs>
  );
}
