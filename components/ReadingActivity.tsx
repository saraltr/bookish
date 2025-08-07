import { useAuth } from "@/contexts/authContext";
import { db } from "@/utils/firebaseConfig";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  bookId: string;
  currentPage?: number;
  number_of_pages?: number;
};

export default function ReadingActivity({
  bookId,
  currentPage = 0,
  number_of_pages,
  isEditing,
  onEditChange,
}: Props & {
  isEditing: boolean;
  onEditChange: (editing: boolean) => void;
}) {
  const { user } = useAuth();
  const [pageInput, setPageInput] = useState(currentPage.toString());
  const [totalInput, setTotalInput] = useState(number_of_pages?.toString() ?? "");

  const handleUpdate = async () => {
    if (!user) return;
    const cleanId = bookId.replace("/works/", "");

    try {
      await updateDoc(doc(db, "users", user.uid, "currentBooks", cleanId), {
        currentPage: Number(pageInput),
        ...(totalInput ? { number_of_pages: Number(totalInput) } : {}),
        updatedAt: serverTimestamp()
      });
      onEditChange(false);
    } catch (err) {
      console.error("Failed to update progress", err);
    }
  };

  const progress =
    number_of_pages && Number(number_of_pages) > 0
      ? `${currentPage} / ${number_of_pages} pages (${Math.floor(
          (currentPage / number_of_pages) * 100
        )}%)`
      : `${currentPage} pages read`;

  return (
    <View style={styles.container}>
      {!isEditing ? (
        <>
          <Text style={styles.progressText}>📖 {progress}</Text>
          <Pressable onPress={() => onEditChange(true)}>
            <Text style={styles.updateLink}>Update Progress</Text>
          </Pressable>
        </>
      ) : (
        <>
          <View style={styles.inputRow}>
            <TextInput
              value={pageInput}
              onChangeText={setPageInput}
              keyboardType="numeric"
              placeholder="Pages read"
              style={styles.input}
            />
            <Text style={styles.slash}>/</Text>
            <TextInput
              value={totalInput}
              onChangeText={setTotalInput}
              keyboardType="numeric"
              placeholderTextColor="#f1efefff"
              placeholder="Total pages"
              style={styles.input}
            />
          </View>
          <Pressable style={styles.saveButton} onPress={handleUpdate}>
            <Text style={styles.saveButtonText}>Save</Text>
          </Pressable>

        </>
      )}
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    alignItems: "center",
  },
  progressText: {
    fontSize: 12,
    color: "#444",
    textAlign: "center",
  },
  updateLink: {
    fontSize: 12,
    color: "#85B79D",
    marginTop: 2,
    textDecorationLine: "underline",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
    gap: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#f1efefff",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    width: 50,
    fontSize: 12,
    textAlign: "center",
  },
  slash: {
    fontSize: 14,
    marginHorizontal: 2,
    color: "#f1efefff"
  },
  saveButton: {
    backgroundColor: "#85B79D",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  }
});