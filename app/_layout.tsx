import { AuthProvider } from "@/contexts/authContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
        name="+not-found" />
        <Stack.Screen 
        name="login" options={{ title: "Login"}} />
        <Stack.Screen 
        name="register" options={{ title: "Register"}} />
        <Stack.Screen
        name="book/[id]"/>
      </Stack>
    </AuthProvider>
  );
}
