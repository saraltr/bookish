import { getNYTBestsellers } from "@/utils/nyt";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View
} from "react-native";

type Book = {
  primary_isbn13: string;
  title: string;
  author: string;
  book_image: string;
  publisher: string;
  description: string;
};

export default function Bestsellers() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      const results = await getNYTBestsellers();
      setBooks(results);
      setLoading(false);
    }
    fetchBooks();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#8e94f2" />
      </View>
    );
  }

  if (books.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No bestsellers found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>The New York Times Best Sellers lists.</Text>
      <FlatList
        data={books}
        keyExtractor={(item) => item.primary_isbn13}
        horizontal
        showsHorizontalScrollIndicator={false}
        removeClippedSubviews={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.bookContainer}>
            <Image source={{ uri: item.book_image }} style={styles.image} />
            <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.author} numberOfLines={1}>{item.author}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    overflow: "visible",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    paddingHorizontal: 16,
    color: "#1e1e2e",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingLeft: 16,
    paddingRight: 8,
    paddingBottom: 16,
  },
  bookContainer: {
    width: 140,
    marginRight: 16,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    padding: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#1e1e2e",
  },
  author: {
    fontStyle: "italic",
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
});
