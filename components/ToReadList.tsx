import { useAuth } from "@/contexts/authContext";
import { db } from "@/utils/firebaseConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  View
} from "react-native";


type ReadBook = {
  key: string;
  title: string;
  authors?: { name: string; key: string }[];
  cover_i?: number[];
};


export default function ToReadList() {
  const { user, loading } = useAuth();

  const [readList, setReadList] = useState<ReadBook[]>([]);
  const [readLoading, setReadLoading] = useState(true);

  useEffect(() => {
    const fetchReadList = async () => {
      if (!user) return;
      try {
        const snapshot = await getDocs(
          collection(db, "users", user.uid, "readBooks")
        );
        const books = snapshot.docs.map((doc) => ({
          key: doc.id,
          ...doc.data(),
        })) as (ReadBook & { addedAt?: string })[];

        // Sort by latest added (newest first)
        books.sort((a, b) => {
            const dateA = new Date(a.addedAt ?? "").getTime();
            const dateB = new Date(b.addedAt ?? "").getTime();
            return dateB - dateA;
        });
        
        setReadList(books);
      } catch (err) {
        console.error("Error loading read list:", err);
      } finally {
        setReadLoading(false);
      }
    };

    fetchReadList();
  }, [user, readList]);

    const handleRemoveBook = async (bookId: string) => {
        if (!user) return;

        try {
            const cleanId = bookId.replace("/works/", "");
            await deleteDoc(doc(db, "users", user.uid, "readBooks", cleanId));
            // update local state to remove the deleted book
            setReadList((prev) => prev.filter((book) => book.key !== cleanId));
        } catch (error) {
            console.error("Failed to remove book:", error);
        }
    };


    if (loading) return <Text>Loading...</Text>;


  return (

      <View style={styles.container}>
        <Text style={styles.headerText}>To Read List:</Text>
        {readLoading ? (
          <Text>Loading your books...</Text>
        ) : readList.length === 0 ? (
          <Text style={styles.defaultText}>No books added yet.</Text>
        ) : (
        <FlatList
            data={readList}
            keyExtractor={(item) => item.key}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
                
                <View style={styles.bookContainer}>
                    <View style={styles.removeButtonWrapper}>
                        <Ionicons
                        name="trash"
                        size={20}
                        color="#fff"
                        onPress={() => handleRemoveBook(item.key)}
                        />
                    </View>
                    <Link 
                  href={
                    {
                      pathname:"/book/[id]",
                      params: {id: item.key}
                    }
                  }
                  
                  >
                    <Image
                        style={styles.image}
                        source={
                        item.cover_i && item.cover_i.length > 0
                            ? {
                                uri: `https://covers.openlibrary.org/b/id/${item.cover_i[0]}-M.jpg`,
                            }
                            : require("@/assets/images/placeholder.png")
                        }
                    />
                    <Text style={styles.title} numberOfLines={2}>
                        {item.title}
                    </Text>
                    <Text style={styles.author} numberOfLines={1}>
                        {item.authors?.map((a) => a.name).join(", ") ?? "Unknown author"}
                    </Text>
                    </Link>
                </View>
            )}
        />
        )}
      </View>

  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingLeft: 16,
    paddingRight: 8,
    paddingBottom: 16,
  },
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
  defaultText: {
    paddingHorizontal: 20,
  },
  bookContainer: {
    width: 140,
    marginRight: 16,
    borderRadius: 10,
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 1,
      },
      default: {
        // web
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
      },
    }),
    padding: 10,
  },
  image: {
    width: "100%",
    height: 180,
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
  remove: {
    color: "#d45b5b",
    fontSize: 20,
    marginTop: 8,
    textAlign: "right",
    },
    removeButtonWrapper: {
        position: "absolute",
        top: 6,
        right: 6,
        backgroundColor: "#d45b5b",
        borderRadius: 16,
        padding: 4,
        zIndex: 2,
    },
});