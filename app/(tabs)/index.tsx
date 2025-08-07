import Bestsellers from "@/components/BestSellers";
import SubjectsLists from "@/components/SubjectsLists";
import { Image } from "expo-image";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import LatestUpdated
 from "@/components/LatestUpdated";
export default function HomeScreen() {
  

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.contentContainer}>
      <View style={styles.heroSection}>
        <Image
          source={require('@/assets/images/undraw_reading-time_gcvc.svg')}
          style={styles.heroImage}
          contentFit="contain"
        />
        <Text style={styles.heroTitle}>Welcome to Bookish</Text>
        <Text style={styles.heroSubtitle}>subtitle</Text>
      </View>

      <SubjectsLists></SubjectsLists>

      <LatestUpdated></LatestUpdated>
    
      <Bestsellers></Bestsellers>

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
});
