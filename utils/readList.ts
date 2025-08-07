import { auth, db } from "@/utils/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { BookDetails } from "./openLibrary";

// build the book data object to store in firestore
function buildBookData(book: BookDetails, includeUpdatedAt = false) {
  const data: any = {
    key: book.key,
    title: book.title,
    // use empty array if authors is missing
    authors: book.authors ?? [],
     // fallback to covers or null
    cover_i: book.cover_i ?? book.covers ?? null,
    addedAt: new Date().toISOString(),
  };

  // only include number_of_pages if it's defined
  if (typeof book.number_of_pages !== "undefined") {
    data.number_of_pages = book.number_of_pages;
  }

  // include updatedAt timestamp
  if (includeUpdatedAt) {
    data.updatedAt = new Date().toISOString();
  }

  return data;
}

// add book to the readBooks collection
export async function addToReadList(book: BookDetails) {
  const user = auth.currentUser;
  if (!user) throw new Error("user not authenticated");

  // clean the book key
  const cleanKey = book.key.replace("/works/", "");

  // create a reference to the user's readBooks document
  const bookRef = doc(db, "users", user.uid, "readBooks", cleanKey);

  // store the book data in firestore
  await setDoc(bookRef, buildBookData(book));
}

// add book to the currentBooks collection
export async function addToReadingList(book: BookDetails) {
  const user = auth.currentUser;
  if (!user) throw new Error("user not authenticated");

  // clean the book key
  const cleanKey = book.key.replace("/works/", "");

  // create a reference to the user's currentBooks document
  const bookRef = doc(db, "users", user.uid, "currentBooks", cleanKey);

  // store the book data
  await setDoc(bookRef, buildBookData(book, true));
}

// add book to the bookshelf collection
export async function addToBookShelf(book: BookDetails) {
  const user = auth.currentUser;
  if (!user) throw new Error("user not authenticated");

  // clean the book key 
  const cleanKey = book.key.replace("/works/", "");

  // create a reference to the user's bookshelf document
  const bookRef = doc(db, "users", user.uid, "bookshelf", cleanKey);

  // store the book data in firestore
  await setDoc(bookRef, buildBookData(book));
}
