import Bookshelf from "@/components/Bookshelf";
import CurrentlyReading from "@/components/CurrentlyReading";
import LatestUpdated from "@/components/LatestUpdated";
import ReaderStats from "@/components/ReaderStats";
import ToReadList from "@/components/ToReadList";
import { useAuth } from "@/contexts/authContext";
import { auth } from "@/utils/firebaseConfig";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { useEffect } from "react";
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

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

    if (loading) return <Text style={styles.loadingText}>Loading...</Text>;

    if (!user) {
      // return null so nothing renders while navigation happens
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
      {/* User info from auth */}
      <View style={styles.userInfo}>
        <Image
          source={require("@/assets/images/userIcon.svg")}
          style={styles.avatar}
          contentFit="contain"
        />
        <Text style={styles.welcomeText}>Welcome,</Text>
        <Text style={styles.emailText}>{user?.email}</Text>
      </View>

    {/* Logout button */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>

      {/* Reader stats */}
      <ReaderStats></ReaderStats>

      <View style={styles.currentSection}>
        <LatestUpdated />
      </View>

      {/* bookshelf */}
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

export const styles = StyleSheet.create({
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
  currentSection: {
   margin: 15,
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
  }
});