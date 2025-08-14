import { Book, getAuthor, getBooksByAuthor } from "@/utils/openLibrary";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

interface AuthorDetails {
  name: string;
  bio?: string | { value: string };
  photos?: number[];
}

export default function AuthorDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  const [author, setAuthor] = useState<AuthorDetails | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

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

        // If author found, fetch books by name
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
    ? { uri: `https://covers.openlibrary.org/b/id/${photoId}-L.jpg` }
    : require("@/assets/images/placeholder2.png");

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Author info */}
      <View style={styles.heroSection}>
        <Image source={imageSource} style={styles.coverImage} resizeMode="contain" />
        <Text style={styles.title}>{author.name}</Text>
        {author.bio && (
          <Text style={styles.bioText}>
            {typeof author.bio === "string" ? author.bio : author.bio.value}
          </Text>
        )}
      </View>

      {/* Books list */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Books by {author.name}</Text>
        {books.map((book) => (
          <Link
            key={book.key}
            href={{
              pathname: "/book/[id]",
              params: { id: book.key }
            }}
            asChild // let TouchableOpacity be the clickable component
          >
            <TouchableOpacity style={styles.bookRow}>
              <Image
                source={
                  book.cover_i
                    ? { uri: `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` }
                    : require("@/assets/images/placeholder.png")
                }
                style={styles.bookCover}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.bookTitle}>{book.title}</Text>
                {book.first_publish_year && (
                  <Text style={styles.bookYear}>
                    First published: {book.first_publish_year}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          </Link>
        ))}
      </View>

    </ScrollView>
  );
}


const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    paddingBottom: 32,
  },
  heroSection: {
    alignItems: "center",
    backgroundColor: "#d9d5cfba",
    paddingVertical: 24,
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
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginHorizontal: 20,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  bookRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
  },
  bookCover: {
    width: 60,
    height: 90,
    borderRadius: 6,
    marginRight: 12,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  bookYear: {
    fontSize: 14,
    color: "#666",
  },
});
