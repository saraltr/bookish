import { useAuth } from "@/contexts/authContext";
import { auth } from "@/utils/firebaseConfig";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();

    if (loading) return <Text>Loading...</Text>;

    if (!user) {
      router.replace("/login");
    }

    const handleLogout = async () => {
      try {
        await signOut(auth);
        router.replace("/");
      } catch (error) {
        console.log("Logout error:", error);
      }
    };

  return (
    <View>
     <Text>Welcome, {user?.email}</Text>
     <TouchableOpacity onPress={handleLogout} style={styles.button}>
      Log Out
     </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    color: "#ffffffff",
    backgroundColor: "#d45b5bff",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: "center", 
  },
});