import axios from "axios";

export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
}

export interface BookDetails {
  title: string;
  description?: string | { value: string };
  covers?: number[];
  subject_places?: string[];
  subject_times?: string[];
  subjects?: string[];
  links?: { title: string; url: string }[];
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

export async function getBook(id: string): Promise<BookDetails | null> {
  try {
    const cleanId = id.replace("/works/", "");
    const response = await axios.get(`https://openlibrary.org/works/${cleanId}.json`);
    return response.data;
  } catch (error) {
    console.error("Error fetching book details:", error);
    return null;
  }
}

