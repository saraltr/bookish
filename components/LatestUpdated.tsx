import { useAuth } from "@/contexts/authContext";
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Progress from 'react-native-progress';

type Book = {
  key: string;
  title: string;
  authors?: { name: string; key: string }[];
  cover_i?: number[];
  currentPage?: number;
  number_of_pages?: number;
  updatedAt?: Date;
};

export default function LatestUpdated() {
  const { user } = useAuth();
  const [latestBook, setLatestBook] = useState<Book | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchLatestBook = async () => {
      try {
        const db = getFirestore();
        const q = query(
          collection(db, "users", user.uid, "currentBooks"),
          orderBy("updatedAt", "desc"),
          limit(1)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          const data = doc.data() as Book & { updatedAt?: any };

          setLatestBook({
            ...data,
            key: doc.id,
            updatedAt: data.updatedAt?.toDate?.(),
          });
        }
      } catch (err) {
        console.error("Failed to fetch latest updated book:", err);
      }
    };

    fetchLatestBook();
  }, [user, latestBook]);

  if (!latestBook) return null;

  const coverUrl = latestBook.cover_i?.[0]
    const imageSource = coverUrl
  ? { uri: `https://covers.openlibrary.org/b/id/${coverUrl}-L.jpg` }
  : require("@/assets/images/placeholder.png");

  const { currentPage = 0, number_of_pages = 0 } = latestBook;
  const authors = latestBook.authors ?? [];
  const progress = number_of_pages > 0 ? Math.floor((currentPage / number_of_pages) * 100) : 0;

  return (
    <View style={styles.container}>
  <Text style={styles.title}>Continue reading</Text>
  <View style={styles.row}>
    <View style={styles.frame}>
      <Image source={imageSource} style={styles.coverImage} />
    </View>

    <View style={styles.detailsRow}>
      <View style={styles.textContainer}>
        <Text
        style={styles.bookTitle}
        numberOfLines={2}
        ellipsizeMode="tail"
        >
        {latestBook.title}
        </Text>

        {authors.length > 0 &&(

            <Text style={styles.bookAuthor}>
            by {authors.map((a) => a.name).join(", ")}
            </Text>
        )}

      </View>

      <View style={styles.progressContainer}>

        <Progress.Circle
          size={60}
          progress={progress === 100 ? 1 : progress / 100}
          showsText={true}
          formatText={() => `${progress}%`}
          color="#10B981"
          unfilledColor="#333" //background contast
          borderWidth={0} // remove outer ring
          thickness={4}
          textStyle={{ color: '#fff', fontWeight: 'bold' }}
          strokeCap="round"
        />

        <Text style={styles.pageText}>
          {currentPage} / {number_of_pages} pages
        </Text>
      </View>
    </View>
  </View>
</View>

  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2B0607",
    margin: 15,
    padding: 15,
    borderRadius: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#efefef",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  frame: {
    borderWidth: 3,
    borderColor: "#fff",
    padding: 4,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginRight: 15,
  },
  coverImage: {
    width: 100,
    height: 150,
    borderRadius: 4,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  bookTitle: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 10,
  },
  progressText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  pageText: {
    color: "#ccc",
    fontSize: 14,
  },
  detailsRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
    maxWidth: "55%",
  },
  bookAuthor: {
    color: "#ccc",
    fontSize: 14,
  },
  progressContainer: {
    alignItems: "center",
  }
});
