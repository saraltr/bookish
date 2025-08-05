import { BookDetails, getBook } from "@/utils/openLibrary";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { addToReadList } from "@/utils/readList"

export default function BookDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const [book, setBook] = useState<BookDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: book?.title || "Book Details",
    });
  }, [navigation, book]);

  useEffect(() => {
    async function fetchData() {
      if (id) {
        const data = await getBook(id);
        setBook(data);
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

  if (!book) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Book not found.</Text>
      </View>
    );
  }

  const coverId = book.covers?.[0];
  const imageSource = coverId
  ? { uri: `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` }
  : require("@/assets/images/placeholder.png");


  const subjects = book.subjects ?? [];
  const subjectPlaces = book.subject_places ?? [];
  const subjectTimes = book.subject_times ?? [];
  const links = book.links ?? [];
  const authors = book.authors ?? [];

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Image
          source={imageSource}
          style={styles.coverImage}
          resizeMode="contain"
        />
      <Text style={styles.title}>{book.title}</Text>
      {authors.length > 0 && (
        <Text style={styles.section}>
          <Text style={styles.bold}>Author{authors.length > 1 ? "s" : ""}: </Text>
          {authors.map((author, index) => (
            <Text key={index}>
              {author.name}
              {index < authors.length - 1 ? ", " : ""}
            </Text>
          ))}
        </Text>
      )}


      {book.description && (
        <Text style={styles.description}>
          {typeof book.description === "string"
            ? book.description
            : book.description?.value}
        </Text>
      )}

      {subjectPlaces.length > 0 && (
        <Text style={styles.section}>
          <Text style={styles.bold}>Places: </Text>
          {subjectPlaces.join(", ")}
        </Text>
      )}

      {subjectTimes.length > 0 && (
        <Text style={styles.section}>
          <Text style={styles.bold}>Time Periods: </Text>
          {subjectTimes.join(", ")}
        </Text>
      )}

      {subjects.length > 0 && (
        <View style={styles.tagsContainer}>
          {subjects.slice(0, 20).map((subject, index) => (
            <Text key={index} style={styles.tag}>
              {subject}
            </Text>
          ))}
        </View>
      )}

      {links.length > 0 && (
        <View style={styles.linksContainer}>
          <Text style={styles.bold}>More Links:</Text>
          {links.map((link, index) => (
            <TouchableOpacity key={index} onPress={() => Linking.openURL(link.url)}>
              <Text style={styles.link}>{link.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}


      <TouchableOpacity
        onPress={() => {
          if (book) {
            addToReadList(book)
            .then(() => alert("Book added to your read list!"))
          .catch((err) => alert("Failed to add book: " + err.message));
          }
        }}
        >
          <Text>Add to Read List</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "#fdfdfd",
  },
  coverImage: {
    width: 220,
    height: 330,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
    color: "#1e1e2e",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "left",
    color: "#444",
    marginBottom: 16,
    width: "100%",
  },
  section: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4,
    width: "100%",
    textAlign: "left",
    color: "#333",
  },
  bold: {
    fontWeight: "600",
    color: "#111",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 12,
    gap: 8,
  },
  tag: {
    backgroundColor: "#e6f0ff",
    color: "#004080",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 14,
  },
  linksContainer: {
    marginTop: 24,
    width: "100%",
  },
  link: {
    color: "#1e88e5",
    textDecorationLine: "underline",
    fontSize: 16,
    marginVertical: 6,
  },
});

