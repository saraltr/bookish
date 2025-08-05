import axios from "axios";

// book structure for search page
export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
}

// book structure for detailed page
export interface BookDetails {
  key: string;
  title: string;
  description?: string | { value: string };
  covers?: number[];
  subject_places?: string[];
  subject_times?: string[];
  subjects?: string[];
  links?: { title: string; url: string }[];
  authors?: { name: string; key: string }[];
  cover_i?: number[];
}


export async function searchBooks(query: string): Promise<Book[]> {
  try {
    // encode the query to make it safe for use in a url
    const encodedQuery = encodeURIComponent(query);
    // send request to open library search api with filters
    const response = await axios.get(`https://openlibrary.org/search.json?q=${encodedQuery}&limit=20&language=eng`);

    // map the response data to match the book interface
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

// get detailed information for a single book using its id
export async function getBook(id: string): Promise<BookDetails | null> {
  try {
    // remove /works/ from the id
    const cleanId = id.replace("/works/", "");
     // fetch the book details from the works endpoint
    const workRes = await axios.get(`https://openlibrary.org/works/${cleanId}.json`);
    const workData = workRes.data;

    // fetch author names
    const authors = await Promise.all(
      (workData.authors || []).map(async (entry: any) => {
        const authorKey = entry.author?.key;
        if (!authorKey) return null;
        try {
          // fetch author name using the author key
          const authorRes = await axios.get(`https://openlibrary.org${authorKey}.json`);
          return {
            name: authorRes.data.name,
            key: authorKey,
          };
        } catch (err) {
          console.error("Failed to fetch author:", authorKey, err);
          return null;
        }
      })
    );

    // return the combined book data with filtered authors
    return {
      ...workData,
      authors: authors.filter(Boolean), // remove values
    };
  } catch (error) {
    console.error("Error fetching book details:", error);
    return null;
  }
}

export async function getBooksBySubject(subject: string): Promise<Book[]> {
  try {
    const res = await axios.get(`https://openlibrary.org/subjects/${subject}.json?limit=20`);
    return res.data.works.map((book: any) => ({
      key: book.key,
      title: book.title,
      author_name: book.authors?.map((a: any) => a.name),
      cover_i: book.cover_id,
      first_publish_year: book.first_publish_year,
    }));
  } catch (error) {
    console.error("Error fetching subject books:", error);
    return [];
  }
}