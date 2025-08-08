import { useAuth } from "@/contexts/authContext";
import { db } from "@/utils/firebaseConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  DeviceEventEmitter
} from "react-native";

type ReadBook = {
  key: string;
  title: string;
  authors?: { name: string; key: string }[];
  cover_i?: number[];
  number_of_pages?: number;
  addedAt?: string;
};

export default function Bookshelf() {
  const { user } = useAuth();
  const [bookshelf, setBookshelf] = useState<ReadBook[]>([]);
  const [readLoading, setReadLoading] = useState(true);
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);
  const [tappedBook, setTappedBook] = useState<string | null>(null);

  const BOOK_WIDTH = 120;
  const BOOK_ASPECT_RATIO = 0.66;
  const BOOK_HEIGHT = BOOK_WIDTH / BOOK_ASPECT_RATIO;
  const H_MARGIN = 6;

  const { width } = useWindowDimensions();

  const booksPerRow = Math.floor(width / (BOOK_WIDTH + H_MARGIN * 2)) || 1;

  useEffect(() => {
    const fetchReadList = async () => {
      if (!user) return;
      try {
        const snapshot = await getDocs(
          collection(db, "users", user.uid, "bookshelf")
        );
        const books = snapshot.docs.map((doc) => ({
          key: doc.id,
          ...doc.data(),
        })) as ReadBook[];

        books.sort((a, b) => {
          const dateA = new Date(a.addedAt ?? "").getTime();
          const dateB = new Date(b.addedAt ?? "").getTime();
          return dateB - dateA;
        });

        setBookshelf(books);
      } catch (err) {
        console.error("Error loading bookshelf:", err);
      } finally {
        setReadLoading(false);
      }
    };

    fetchReadList();
  }, [user, bookshelf]);

  const handleRemoveBook = async (bookId: string) => {
    if (!user) return;

    try {
      const cleanId = bookId.replace("/works/", "");
      await deleteDoc(doc(db, "users", user.uid, "bookshelf", cleanId));
      setBookshelf((prev) => prev.filter((book) => book.key !== cleanId));
      if (tappedBook === cleanId) setTappedBook(null);
      DeviceEventEmitter.emit("booksUpdated");
    } catch (error) {
      console.error("Failed to remove book:", error);
    }
  };

  const isOverlayVisible = (key: string) =>
    (Platform.OS === "web" && hoveredBook === key) ||
    (Platform.OS !== "web" && tappedBook === key);

  const renderBook = (item: ReadBook) => {
  const showOverlay = isOverlayVisible(item.key);

  return (
    <View
      key={item.key}
      {...(Platform.OS === "web"
        ? {
            onMouseEnter: () => setHoveredBook(item.key),
            onMouseLeave: () => setHoveredBook(null),
          }
        : {})}
      style={[
        styles.bookWrapper,
        { width: BOOK_WIDTH, height: BOOK_HEIGHT, marginHorizontal: H_MARGIN },
  ]}
    >
      <Pressable
        onPress={() => {
          if (Platform.OS !== "web") {
            setTappedBook((prev) => (prev === item.key ? null : item.key));
          }
        }}
        style={{ flex: 1 }}
      >
        <Image
          style={styles.bookCover}
          source={
            item.cover_i && item.cover_i.length > 0
              ? {
                  uri: `https://covers.openlibrary.org/b/id/${item.cover_i[0]}-M.jpg`,
                }
              : require("@/assets/images/placeholder.png")
          }
        />
      </Pressable>

      {showOverlay && (
        <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
          <Pressable
            style={styles.overlayTouchableArea}
            onPress={() => {
              if (Platform.OS !== "web") {
                setTappedBook(null);
              }
            }}
            pointerEvents={Platform.OS === "web" ? "none" : "auto"}
          >
            <View style={styles.overlay}>
              <Text style={styles.overlayTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.overlayAuthor} numberOfLines={1}>
                {item.authors?.map((a) => a.name).join(", ") ?? "Unknown"}
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => handleRemoveBook(item.key)}
            style={styles.removeButton}
          >
            <Ionicons name="trash" size={18} color="#fff" />
          </Pressable>
        </View>
      )}
    </View>
  );
};


  // group books into rows
  const bookRows = [];
  for (let i = 0; i < bookshelf.length; i += booksPerRow) {
    bookRows.push(bookshelf.slice(i, i + booksPerRow));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Bookshelf</Text>

      {readLoading ? (
        <Text style={styles.loadingText}>Loading bookshelf...</Text>
      ) : bookshelf.length === 0 ? (
        <Text style={styles.emptyText}>No books yet. Start reading!</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {bookRows.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.shelfRow}>
              <View style={styles.shelfContent}>
                {row.map(renderBook)}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6F1D1B",
    paddingTop: 32,
    paddingHorizontal: 16,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  header: {
    fontSize: 28,
    fontWeight: "800",
    color: "#f5efe6",
    paddingHorizontal: 8,
    marginBottom: 20,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  loadingText: {
    textAlign: "center",
    color: "#bbb",
    fontSize: 18,
    fontStyle: "italic",
    marginVertical: 16,
  },

  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    marginTop: 20,
    marginBottom: 20
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 40,
  },
  shelfRow: {
    flexDirection: "column",
    marginBottom: 28,
    paddingBottom: 12,
    borderBottomWidth: 4,
    borderBottomColor: "#d7ccc8",
  },
  shelfContent: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "center",
    flexGrow: 1,
  },
  bookWrapper: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  bookCover: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: 1,
  },
  overlayTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  overlayAuthor: {
    fontSize: 10,
    fontStyle: "italic",
    color: "#ccc",
  },
  removeButton: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#bf360c",
    padding: 6,
    borderRadius: 14,
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayTouchableArea: {
    flex: 1,
    justifyContent: "flex-end",
  }
});
