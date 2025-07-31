import placeholderImage from "@/assets/images/placeholder.png";
import { Book, searchBooks } from "@/utils/openLibrary";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function BookSearch() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    const results = await searchBooks(query);
    setBooks(results);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <FontAwesome5 name="book" size={26} color="#8e94f2" />
        <Text style={styles.headerText}>Search Books</Text>
      </View>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Search for a book..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.key}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => {
            const imageSource = item.cover_i
              ? { uri: `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` }
              : placeholderImage;

            return (
              <View style={styles.bookItem}>
                <Image source={imageSource} style={styles.image} />
                <View style={styles.bookInfo}>
                  <Text style={styles.title}>{item.title}</Text>
                  {item.author_name && (
                    <Text style={styles.author}>
                      {item.author_name.join(", ")}
                    </Text>
                  )}
                  {item.first_publish_year && (
                    <Text style={styles.year}>
                      <Feather name="calendar" size={16} color="#70a288" />{" "}
                      {item.first_publish_year}
                    </Text>
                  )}
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#8e94f2",
    marginLeft: 8,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 50,
    backgroundColor: "#f9f9f9",
    flex: 1,
  },
  searchRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    marginRight: 8,
  },
  button: {
    backgroundColor: "#8e94f2",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  loading: {
    textAlign: "center",
    marginTop: 16,
    color: "#666",
  },
  bookItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 90,
    borderRadius: 4,
    marginRight: 12,
  },
  bookInfo: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e1e2e",
  },
  author: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  year: {
    fontSize: 14,
    color: "#70a288",
    marginTop: 4,
  },
});
