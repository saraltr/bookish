import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "@/utils/firebaseConfig";
import { BookDetails } from "./openLibrary";

export async function addToReadList(book: BookDetails) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  // remove `/works/` if present in key
  const cleanKey = book.key.replace("/works/", "");

  const bookRef = doc(db, "users", user.uid, "readBooks", cleanKey);
  await setDoc(bookRef, {
    key: book.key,
    title: book.title,
    authors: book.authors ?? [],
    cover_i: book.covers ?? null,
    addedAt: new Date().toISOString(),
  });
}

export async function addToReadingList(book: BookDetails) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  // remove `/works/` if present in key
  const cleanKey = book.key.replace("/works/", "");

  const bookRef = doc(db, "users", user.uid, "currentBooks", cleanKey);
  await setDoc(bookRef, {
    key: book.key,
    title: book.title,
    authors: book.authors ?? [],
    cover_i: book.cover_i ?? book.covers ?? null,
    addedAt: new Date().toISOString(),
  });
}

