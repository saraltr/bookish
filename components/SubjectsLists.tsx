import { Book, getBooksBySubject } from "@/utils/openLibrary";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SUBJECTS = ["science_fiction", "fantasy", "romance", "mystery", "young_adult", "horror", "thriller", "history", "plays", "short_stories"];

export default function SubjectsLists() {
  const [selectedSubject, setSelectedSubject] = useState<string>(SUBJECTS[0]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      const subjectBooks = await getBooksBySubject(selectedSubject);
      setBooks(subjectBooks);
      setLoading(false);
    }

    fetchBooks();
  }, [selectedSubject]);

  const renderBookItem = ({ item }: { item: Book }) => (
    <TouchableOpacity style={styles.bookCard}>
      <Link
        href={{
          pathname: "/book/[id]",
          params: { id: item.key },
        }}
      >
        <Image
          source={
            item.cover_i
              ? { uri: `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` }
              : require("@/assets/images/placeholder.png")
          }
          style={styles.coverImage}
        />
        <Text numberOfLines={2} style={styles.bookTitle}>
          {item.title}
        </Text>
        {item.author_name && (
          <Text numberOfLines={1} style={styles.bookAuthor}>
            {item.author_name[0]}
          </Text>
        )}
      </Link>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        {SUBJECTS.map((subject) => (
          <Pressable
            key={subject}
            style={[
              styles.filterButton,
              subject === selectedSubject && styles.activeFilterButton,
            ]}
            onPress={() => setSelectedSubject(subject)}
          >
            <Text
              style={[
                styles.filterText,
                subject === selectedSubject && styles.activeFilterText,
              ]}
            >
              {subject.replace("_", " ")}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>
        {selectedSubject.replace("_", " ")}
      </Text>

      {loading ? (
        <Text style={styles.loadingText}>Loading books...</Text>
      ) : (
        <FlatList
          horizontal
          data={books}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: "#fdfdfd",
  },
  filterContainer: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#f0f4ff",
    borderRadius: 20,
  },
  activeFilterButton: {
    backgroundColor: "#85B79D",
  },
  filterText: {
    color: "#333",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  activeFilterText: {
    color: "#fff",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    paddingHorizontal: 16,
    color: "#2B0607",
    textTransform: "capitalize"
  },
  listContent: {
    paddingLeft: 16,
    paddingRight: 8,
    paddingBottom: 16,
  },
  bookCard: {
    width: 140,
    padding: 10,
    marginRight: 12,
  },
  coverImage: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  bookTitle: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#2B0607",
  },
  bookAuthor: {
    fontStyle: "italic",
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  loadingText: {
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#888",
  },
});
