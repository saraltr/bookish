import { auth, db } from "@/utils/firebaseConfig";
import { BookDetails, getBook } from "@/utils/openLibrary";
import { addToReadList, addToReadingList } from "@/utils/readList";
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation } from "expo-router";
import { deleteDoc, doc } from "firebase/firestore";
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
import { SafeAreaView } from "react-native-safe-area-context";



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
    <>
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      
      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.heroSection}>
        <Image source={imageSource} style={styles.coverImage} resizeMode="contain" />
        <Text style={styles.title}>{book.title}</Text>

        {authors.length > 0 && (
          <Text style={styles.authorText}>
            by {authors.map((a) => a.name).join(", ")}
          </Text>
        )}

        {book.number_of_pages && (
            <View style={styles.pagesRow}>
              <MaterialIcons name="menu-book" size={20} color="#6F1D1B" />
              <Text style={styles.pageCount}> {book.number_of_pages} pages</Text>
            </View>
          )}
      </View>

      {book.description && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Description</Text>
            <Text style={styles.description}>
              {typeof book.description === "string"
                ? book.description
                : book.description?.value}
            </Text>
          </View>
        )}

      {subjectPlaces.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Places</Text>
            <Text style={styles.sectionText}>{subjectPlaces.join(", ")}</Text>
          </View>
        )}

      {subjectTimes.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Time Periods</Text>
            <Text style={styles.sectionText}>{subjectTimes.join(", ")}</Text>
          </View>
        )}

      {subjects.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Subjects</Text>
            <View style={styles.tagsContainer}>
              {subjects.slice(0, 20).map((subject, index) => (
                <Text key={index} style={styles.tag}>
                  {subject}
                </Text>
              ))}
            </View>
          </View>
        )}

      {links.length > 0 && (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>More Links</Text>
            {links.map((link, index) => (
              <TouchableOpacity key={index} onPress={() => Linking.openURL(link.url)}>
                <Text style={styles.link}>{link.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
      )}


      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#6F1D1B" }]}
          onPress={() => {
            if (book) {
              addToReadList(book)
                .then(() => alert("Book added to your read list!"))
                .catch((err) => alert("Failed to add book: " + err.message));
            }
          }}
        >
          <Text style={styles.buttonText}>+ To Read List</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#63ac87ff" }]}
          onPress={async () => {
            if (!book) return;

            try {
              await addToReadingList(book);
              // remove from to-read list if present
              const cleanKey = book.key.replace("/works/", "");
              await deleteDoc(doc(db, "users", auth.currentUser?.uid!, "readBooks", cleanKey));

              alert("Book moved to Currently Reading list!");
            } catch (err: any) {
              alert("Failed to move book: " + err.message);
            }
          }}
        >
          <Text style={styles.buttonText}>+ Currently Reading</Text>
        </TouchableOpacity>

      </View>


    </ScrollView>
    </SafeAreaView>
    </>
  );
}


const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heroSection: {
    width: "100%",
    backgroundColor: "#d9d5cfba",
    alignItems: "center",
    paddingBottom: 24,
    paddingTop: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  coverImage: {
    width: 180,
    height: 270,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2B0607",
    textAlign: "center",
    marginHorizontal: 12,
  },
  authorText: {
    fontSize: 16,
    color: "#294C60",
    marginTop: 8,
    fontStyle: "italic",
    marginHorizontal: 10,
    textAlign: "center"
  },
  pageCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6F1D1B",
  },
  pagesRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
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
    backgroundColor: "#294C60",
    color: "#fff",
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
    color: "#294C60",
    textDecorationLine: "underline",
    fontSize: 16,
    marginVertical: 6,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginHorizontal: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 24,
    marginBottom: 40,
    marginHorizontal: 40
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  }
});

