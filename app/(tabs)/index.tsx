import Bestsellers from "@/components/BestSellers";
import LatestUpdated from "@/components/LatestUpdated";
import SubjectsLists from "@/components/SubjectsLists";
import { Image } from "expo-image";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.contentContainer}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Image
          source={require('@/assets/images/undraw_reading-time_gcvc.svg')}
          style={styles.heroImage}
          contentFit="contain"
        />
        <Text style={styles.heroTitle}>Welcome to Bookish</Text>
        <Text style={styles.heroSubtitle}>Your personal reading companion</Text>
      </View>

      {/* Subject Lists */}
      <View style={styles.sectionWrapper}>
        <SubjectsLists />
      </View>

      {/* Latest Updated */}
      <View style={styles.sectionWrapper}>
        <LatestUpdated />
      </View>

      {/* Motivational Quote */}
      <View style={styles.quoteSection}>
        <Text style={styles.quoteText}>
          “A reader lives a thousand lives before he dies. The man who never reads lives only one.” – George R.R. Martin
        </Text>
      </View>

      {/* get started section */}
      <View style={styles.getStartedSection}>
        <Text style={styles.sectionTitle}>Get Started</Text>

        <View style={styles.getStartedItem}>
          <Image
            source={require('@/assets/images/userProfile-ex.png')}
            style={styles.getStartedImage}
            contentFit="contain"
          />
          <Text style={styles.getStartedText}>
            Sign up to create your personalized reader profile and track your journey.
          </Text>
        </View>

        <View style={styles.getStartedItem}>
          <Image
            source={require('@/assets/images/bookshelf-ex.png')}
            style={styles.getStartedImage}
            contentFit="contain"
          />
          <Text style={styles.getStartedText}>
            Build your virtual bookshelf! Organize your favorite books and plan what to read next.
          </Text>
        </View>

        <View style={styles.getStartedItem}>
          <Image
            source={require('@/assets/images/toread_and_currentlyreadinglists_ex.png')}
            style={styles.getStartedImage}
            contentFit="contain"
          />
          <Text style={styles.getStartedText}>
            Add books to your reading lists and update your progress to stay motivated and on track.
          </Text>
        </View>
      </View>


      {/* Bestsellers */}
      <View style={styles.sectionWrapper}>
        <Bestsellers />
      </View>

      {/* Footer / Info */}
      <View style={styles.extraInfoItem}>
        <Image
          source={require('@/assets/images/undraw_bookshelves_vhu6.svg')}
          style={styles.extraImage}
          contentFit="contain"
        />
        <Text style={styles.extraText}>Built with Open Library API</Text>
        <Text style={styles.extraText}>Version 1.0.0 © 2025 Bookish</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingBottom: 20,
  },
  heroSection: {
    backgroundColor: "#efefefc8",
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  heroImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 90,
    backgroundColor: "#fff",
    padding: 10,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#85B79D",
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 8,
  },
  sectionWrapper: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
  quoteSection: {
    marginHorizontal: 24,
    marginBottom: 32,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#85B79D",
  },
  quoteText: {
    fontStyle: "italic",
    color: "#5d4037",
    fontSize: 16,
  },

  getStartedSection: {
  backgroundColor: "#f9f9f9",
  marginHorizontal: 16,
  marginBottom: 32,
  borderRadius: 12,
  paddingVertical: 20,
  paddingHorizontal: 12,
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowRadius: 8,
  elevation: 2,
},
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#5d4037",
    marginBottom: 16,
    textAlign: "center",
  },
  getStartedItem: {
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  getStartedImage: {
    width: 300,
    height: 300,
    marginRight: 16,
  },
  getStartedText: {
    fontSize: 16,
    color: "#3e2c22",
    textAlign: "center",
    paddingHorizontal: 12,
  },
  extraInfoItem: {
    alignItems: "center",
    backgroundColor: "#85B79D",
    padding: 20,
  },
  extraImage: {
    width: 140,
    height: 140,
    marginBottom: 12,
  },
  extraText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    maxWidth: 320,
  },
});
