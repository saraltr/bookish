import { Book, getAuthor, getBooksByAuthor } from "@/utils/openLibrary";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

interface AuthorDetails {
  name: string;
  bio?: string | { value: string };
  photos?: number[];
}

export default function AuthorDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const [author, setAuthor] = useState<AuthorDetails | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Number of books displayed on each row depending on screen width
  const numColumns =
    width >= 1200
      ? 6
      : width >= 900
      ? 5
      : width >= 600
      ? 4
      // : width >= 400
      // ? 3
      : 3;

  const bookWidth = 
    width < 400
    ? 70
    : width < 600
    ? 105
    : 120;
  
  const bookHeight = bookWidth * 1.5;

  const bookFontSize =
  width < 400
    ? 11
    : width < 600
    ? 14
    : 15;

  const bookLineHeight =
    width < 400
      ? 17
      : width < 600
      ? 18
      : 20;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: author?.name || "Author Details",
    });
  }, [navigation, author]);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      try {
        // Get author details
        const authorData = await getAuthor(id);
        setAuthor(authorData);

        // Get books by author
        if (authorData?.name) {
          const booksData = await getBooksByAuthor(authorData.name);
          setBooks(booksData);
        }
      } catch (error) {
        console.error("Error fetching author data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!author) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Author not found.</Text>
      </View>
    );
  }

  const photoId = author.photos?.[0];

  const imageSource = photoId
    ? {
        uri: `https://covers.openlibrary.org/b/id/${photoId}-L.jpg`,
      }
    : require("@/assets/images/placeholder2.png");

  return (
    <FlatList
      // Required because numColumns changes when resizing the window
      key={`columns-${numColumns}`}
      data={books}
      keyExtractor={(book) => book.key}
      numColumns={numColumns}
      contentContainerStyle={styles.scrollContainer}
      columnWrapperStyle={styles.bookRow}
      ListHeaderComponent={
        <>
          {/* author section */}

          <View style={styles.heroSection}>
            <Image
              source={imageSource}
              style={styles.coverImage}
              resizeMode="contain"
            />

            <Text style={styles.title}>{author.name}</Text>

            {author.bio && (
              <Text style={styles.bioText}>
                {typeof author.bio === "string"
                  ? author.bio
                  : author.bio.value}
              </Text>
            )}
          </View>

          <View style={styles.booksCardTop}>
            <Text style={styles.cardTitle}>
              Books by {author.name}
            </Text>
          </View>
        </>
      }
      renderItem={({ item: book }) => (
        <Link
          href={{
            pathname: "/book/[id]",
            params: { id: book.key },
          }}
          asChild
        >
          <TouchableOpacity
            style={{
              ...styles.bookItem,
              width: bookWidth,
            }}
          >
            <Image
              source={
                book.cover_i
                  ? {
                      uri: `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`,
                    }
                  : require("@/assets/images/placeholder.png")
              }
              style={[styles.bookCover,
                {
                  width: bookWidth,
                  height: bookHeight
                }
              ]}
              resizeMode="cover"
            />

            <Text
              style={{
                ...styles.bookTitle,
                fontSize: bookFontSize,
                lineHeight: bookLineHeight,
              }}
              numberOfLines={3}
            >
              {book.title}
            </Text>

            <Text style={styles.bookYear}>
              {book.first_publish_year && book.first_publish_year !== 0
                ? book.first_publish_year
                : "—"}
            </Text>
          </TouchableOpacity>
        </Link>
      )}
      ListFooterComponent={
        books.length > 0 ? <View style={styles.booksCardBottom} /> : null
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text>No books found for this author.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  // general

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  scrollContainer: {
    paddingBottom: 32,
  },

  // author section

  heroSection: {
    alignItems: "center",
    backgroundColor: "#d9d5cfba",
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  coverImage: {
    width: 180,
    height: 270,
    borderRadius: 12,
    marginBottom: 16,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginHorizontal: 12,
  },

  bioText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 22,
    marginTop: 12,
    textAlign: "center",
    paddingHorizontal: 16,
    maxWidth: 800,
  },

  // books section

  booksCardTop: {
    backgroundColor: "#fff",

    marginTop: 16,
    marginHorizontal: 10,

    paddingTop: 16,
    paddingHorizontal: 16,

    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,

    elevation: 2,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },

  bookRow: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    paddingHorizontal: 10,
    justifyContent: "space-around",
  },

  bookItem: {
    width: 120,
    marginBottom: 24,
    marginHorizontal: 6,
    alignItems: "center",
  },

  bookCover: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },

  bookTitle: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 15,
    textAlign: "center",
  },

  bookYear: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
    fontStyle: "italic"
  },

  // bottom of the white card
  booksCardBottom: {
    backgroundColor: "#fff",
    height: 16,

    marginHorizontal: 10,

    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,

    elevation: 2,
  },

  // empty

  emptyContainer: {
    backgroundColor: "#fff",

    marginHorizontal: 20,
    padding: 30,

    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,

    alignItems: "center",
  },
});