import { auth, db } from "@/utils/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

// get count of books in the readBooks collection
export async function getToReadCount(): Promise<number> {
  const user = auth.currentUser;
  if (!user) throw new Error("user not authenticated");

  const snapshot = await getDocs(collection(db, "users", user.uid, "readBooks"));
  return snapshot.size;
}

// get count of books in the currentBooks collection
export async function getCurrentlyReadingCount(): Promise<number> {
  const user = auth.currentUser;
  if (!user) throw new Error("user not authenticated");

  const snapshot = await getDocs(collection(db, "users", user.uid, "currentBooks"));
  return snapshot.size;
}

// get count of books in the bookshelf collection
export async function getBookShelfCount(): Promise<number> {
  const user = auth.currentUser;
  if (!user) throw new Error("user not authenticated");

  const snapshot = await getDocs(collection(db, "users", user.uid, "bookshelf"));
  return snapshot.size;
}
