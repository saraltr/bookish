import axios from "axios";

export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
}

export async function searchBooks(query: string): Promise<Book[]> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await axios.get(`https://openlibrary.org/search.json?q=${encodedQuery}&limit=20&language=eng`);

    return response.data.docs.map((book: any) => ({
      key: book.key,
      title: book.title,
      author_name: book.author_name,
      cover_i: book.cover_i,
      first_publish_year: book.first_publish_year,
    }));
  } catch (error) {
    console.error("Error fetching books from Open Library:", error);
    return [];
  }
}
