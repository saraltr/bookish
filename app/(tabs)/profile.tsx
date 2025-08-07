import Bookshelf from "@/components/Bookshelf";
import CurrentlyReading from "@/components/CurrentlyReading";
import LatestUpdated from "@/components/LatestUpdated";
import ToReadList from "@/components/ToReadList";
import { useAuth } from "@/contexts/authContext";
import { auth } from "@/utils/firebaseConfig";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) return <Text style={styles.loadingText}>Loading...</Text>;

  if (!user) {
    router.replace("/login");
    return null;
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.userInfo}>
        <Image
          source={require("@/assets/images/userIcon.svg")}
          style={styles.avatar}
          contentFit="contain"
        />
        <Text style={styles.welcomeText}>Welcome,</Text>
        <Text style={styles.emailText}>{user?.email}</Text>
      </View>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>

      {/* Reading Stats Section */}
      <View style={styles.statsSection}>
        <Text style={styles.statsTitle}>Your Reading Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Books Read</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Currently Reading</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Books To Read</Text>
          </View>
        </View>
      </View>

      {/* Motivational Quote */}
      {/* <View style={styles.quoteSection}>
        <Text style={styles.quoteText}>
          “A reader lives a thousand lives before he dies. The man who never reads lives only one.” – George R.R. Martin
        </Text>
      </View> */}

      <View style={styles.sectionWrapper}>
        <LatestUpdated />
      </View>

      <View style={styles.sectionWrapper}>
        <Bookshelf />
      </View>

      <Image
        source={require("@/assets/images/undraw_books.svg")}
        style={styles.decorativeImage}
        contentFit="contain"
      />
      <Text style={styles.decorativeText}>
        Your next great read is just a page away.
      </Text>


      <View style={styles.sectionWrapper}>
        <CurrentlyReading />
      </View>

      <View style={styles.sectionWrapper}>
        <ToReadList />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    backgroundColor: "#efefefc8",
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
    backgroundColor: "#a1887f",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#85B79D",
  },
  emailText: {
    fontSize: 16,
    color: "#2B0607",
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: "#d45b5b",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignSelf: "center",
    marginBottom: 32,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  sectionWrapper: {
    marginBottom: 32,
  },
  decorativeImage: {
    width: "100%",
    height: 150,
    marginBottom: 32,
  },
  decorativeText: {
    fontSize: 16,
    color: "#5d4037",
    fontStyle: "italic",
    textAlign: "center",
    marginHorizontal: 24,
    marginBottom: 32,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#ddd",
  },
  statsSection: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 32,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#5d4037",
    marginBottom: 12,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: "#85B79D",
  },
  statLabel: {
    fontSize: 12,
    color: "#3e2c22",
    marginTop: 4,
  },
});