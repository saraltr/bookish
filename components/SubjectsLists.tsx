import { Book, getBooksBySubject } from "@/utils/openLibrary";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useEffect, useRef, useState } from "react";
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

// subject list from open library
const SUBJECTS = [
  "science_fiction", "fantasy", "romance", "mystery", "young_adult",
  "horror", "thriller", "history", "plays", "short_stories"
];

export default function SubjectsLists() {
  const [selectedSubject, setSelectedSubject] = useState<string>(SUBJECTS[0]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // current scroll position
  const [scrollX, setScrollX] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // card width + padding/margin to calculate scroll amount
  const CARD_WIDTH = 140 + 12; 

  useEffect(() => {
    // fetch books for the currently selected subject
    async function fetchBooks() {
      // show loading state
      setLoading(true);
      const subjectBooks = await getBooksBySubject(selectedSubject);
      // store fetched books in state
      setBooks(subjectBooks);
      // hide loading state
      setLoading(false);
      // reset scroll tracker to start
      setScrollX(0);
      // scroll list back to start
      flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    }

    // call fetch when subject changes
    fetchBooks();
  }, [selectedSubject]);

  // book item card
  const renderBookItem = ({ item }: { item: Book }) => (
    <View style={styles.bookCard}>
      <TouchableOpacity>
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
        </Link>
        </TouchableOpacity>
        <Text numberOfLines={2} style={styles.bookTitle}>
          {item.title}
        </Text>
        {item.author_name && item.author_key && (
          <Link
            href={{
              pathname: "/author/[id]",
              params: { id: item.author_key[0] },
            }}
          >
          <Text numberOfLines={2} style={styles.bookAuthor}>
            {item.author_name[0]}
          </Text>
          </Link>
        )}
    </View>
  );

  // handle scrolling when arrow buttons are clicked
  const scrollList = (direction: "left" | "right") => {
    const newOffset =
      direction === "left"
      // scroll left by one card and don't go below 0
        ? Math.max(0, scrollX - CARD_WIDTH)
        // scroll right by one card
        : scrollX + CARD_WIDTH;
    // move list to new position
    flatListRef.current?.scrollToOffset({ offset: newOffset, animated: true });
    // update scroll position tracker
    setScrollX(newOffset);
  };

  return (
    <View style={styles.container}>
      {/* filter buttons */}
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

      {/* title + scroll arrows */}
      <View style={styles.titleRow}>
        <Text style={styles.sectionTitle}>
          {selectedSubject.replace("_", " ")}
        </Text>
        <View style={styles.arrowContainer}>
          <TouchableOpacity onPress={() => scrollList("left")}>
            <Ionicons name="arrow-back-circle-outline" size={28} color="#85B79D" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => scrollList("right")}>
            <Ionicons name="arrow-forward-circle-outline" size={28} color="#85B79D" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Loading books...</Text>
      ) : (
        <FlatList
          ref={flatListRef}
          horizontal
          data={books}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          onScroll={(e) => setScrollX(e.nativeEvent.contentOffset.x)}
          scrollEventThrottle={16}
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
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2B0607",
    textTransform: "capitalize",
  },
  arrowContainer: {
    flexDirection: "row",
    gap: 8,
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
