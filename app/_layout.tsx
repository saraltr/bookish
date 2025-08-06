import { AuthProvider } from "@/contexts/authContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Stack, router } from "expo-router";
import { TouchableOpacity } from "react-native";

// back button
function BackButton() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          router.replace("/"); // fallback if there's no history
        }
      }}
      style={{ marginLeft: 16 }}
    >
      <Ionicons name="arrow-back" size={24} color={"#fff"} />
    </TouchableOpacity>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
        name="+not-found" />
        <Stack.Screen
          name="login"
          options={{
            title: "Login",
            headerStyle: { backgroundColor: "#2B0607" },
            headerTintColor: "#fff",
            headerLeft: () => <BackButton />,
          }}
        />
        <Stack.Screen 
        name="register" options={{ 
          title: "Register",
          headerStyle: { backgroundColor: "#2B0607" },
            headerTintColor: "#fff",
            headerLeft: () => <BackButton />,
          }} />
        <Stack.Screen
          name="book/[id]"
          options={{
            headerStyle: {
              backgroundColor: "#2B0607",
            },
            // color of back arrow and title text
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerLeft: () => <BackButton />,
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
