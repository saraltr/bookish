import Bestsellers from "@/components/BestSellers";
import LatestUpdated from "@/components/LatestUpdated";
import SubjectsLists from "@/components/SubjectsLists";
import { Image } from "expo-image";
import React, { ComponentProps } from "react";
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";


export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768; // tablet breakpoint

  const getStartedItems = [
    {
      title: "Create Your Profile",
      icon: "person-circle-outline",
      image: require("@/assets/images/userProfile-ex.png"),
      text: "Sign up to create your personalized reader profile and track your journey.",
      alt: "user profile image"
    },
    {
      title: "Build Your Bookshelf",
      icon: "library-outline",
      image: require("@/assets/images/bookshelf-ex.png"),
      text: "Build your virtual bookshelf! Organize your favorite books and plan what to read next.",
      alt: "user bookshelf image"
    },
    {
      title: "Track Your Reading",
      icon: "book-outline",
      image: require("@/assets/images/toread_and_currentlyreadinglists_ex.png"),
      text: "Add books to your reading lists and update your progress to stay motivated and on track.",
      alt: "user reading lists image"
    },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.contentContainer}>
      {/* Hero Section */}
      <View style={[styles.heroSection, isLargeScreen && styles.heroSectionLarge]}>
        <Image
          source={require("@/assets/images/undraw_reading-time_gcvc.svg")}
          style={[styles.heroImage, isLargeScreen && styles.heroImageLarge]}
          alt="hero image"
          contentFit="contain"
        />
        <View style={[styles.heroTextWrapper, isLargeScreen && styles.heroTextWrapperLarge]}>
          <Text style={[styles.heroTitle, isLargeScreen && styles.heroTitleLarge]}>
            Welcome to Bookish
          </Text>
          <Text style={[styles.heroSubtitle, isLargeScreen && styles.heroSubtitleLarge]}>
            Your personal reading companion
          </Text>
        </View>
      </View>

      {/* Subject Lists */}
      <View style={styles.sectionWrapper}>
        <SubjectsLists />
      </View>

      {/* Latest Updated */}
      <View style={styles.sectionWrapper}>
        <LatestUpdated />
      </View>

      {/* get started section */}
      <View style={styles.getStartedSection}>
        <Text style={styles.sectionTitle}>Get Started</Text>
        <View
          style={[
            styles.getStartedList,
            isLargeScreen && styles.getStartedListLarge,
          ]}
        >
          {getStartedItems.map((item, idx) => (
            <View
              key={idx}
              style={[
                styles.getStartedItem,
                isLargeScreen && styles.getStartedItemLarge,
              ]}
            >
              {/* icon + title */}
              <View style={styles.itemHeader}>
                <Ionicons
                  name={item.icon as ComponentProps<typeof Ionicons>["name"]}
                  size={28}
                  color="#85B79D"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.itemTitle}>{item.title}</Text>
              </View>

              {/* image */}
              <Image
                source={item.image}
                style={[
                  styles.getStartedImage,
                  isLargeScreen && styles.getStartedImageLarge,
                ]}
                alt={item.alt}
                contentFit="contain"
              />
              {/* text */}
              <Text style={styles.getStartedText}>{item.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* quote */}
      <View style={styles.quoteSection}>
        <Text style={styles.quoteText}>
          “A reader lives a thousand lives before he dies. The man who never reads lives only one.”
          – George R.R. Martin
        </Text>
      </View>

      {/* Bestsellers */}
      <View style={styles.sectionWrapper}>
        <Bestsellers />
      </View>

      {/* Footer / Info */}
      <View style={styles.extraInfoItem}>
        <Image
          source={require("@/assets/images/undraw_bookshelves_vhu6.svg")}
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
    alignItems: "center",
    paddingBottom: 20,
  },
  sectionWrapper: {
    width: "100%",
    maxWidth: 1000,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  // hero section
  heroSection: {
    backgroundColor: "#efefefc8",
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    width: "100%",
  },
  heroSectionLarge: {
    flexDirection: "row",
    justifyContent: "center",
  },
  heroImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 90,
    backgroundColor: "#fff",
    padding: 10,
  },
  heroImageLarge: {
    width: 250,
    height: 250,
    marginBottom: 0,
    marginRight: 30,
  },
  heroTextWrapper: {
    alignItems: "center",
  },
  heroTextWrapperLarge: {
    alignItems: "flex-start",
    maxWidth: 500,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#85B79D",
    textAlign: "center",
  },
  heroTitleLarge: {
    fontSize: 40,
    textAlign: "left",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 8,
  },
  heroSubtitleLarge: {
    fontSize: 20,
    textAlign: "left",
  },
  // quote
  quoteSection: {
    marginVertical: 24,
    marginHorizontal: 24,
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
  // get started section
  getStartedSection: {
    width: "100%",
    maxWidth: 1000,
    backgroundColor: "#f9f9f9",
    marginTop: 32,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2B0607",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    paddingHorizontal: 16,
    color: "#2B0607",
    textAlign: "center",
  },
  getStartedList: {
    flexDirection: "column",
  },
  getStartedListLarge: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
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
    width: "100%",
  },
  getStartedItemLarge: {
    width: "30%",
  },
  getStartedImage: {
    width: 300,
    height: 300,
    marginBottom: 12,
  },
  getStartedImageLarge: {
    width: "100%",
    height: 300,
  },
  getStartedText: {
    fontSize: 16,
    color: "#3e2c22",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  // extra info & footer
  extraInfoItem: {
    alignItems: "center",
    backgroundColor: "#85B79D",
    padding: 20,
    width: "100%",
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
