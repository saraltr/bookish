import axios from "axios";

// book structure for search page
export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  author_key?: string[];
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
  number_of_pages?: number;
  author_key?: string[];
}

export interface AuthorDetails {
  name: string;
  bio?: string | { value: string };
  photos?: number[];
}


export async function searchBooks(query: string): Promise<Book[]> {
  try {
    // encode the query to make it safe for use in a url
    const encodedQuery = encodeURIComponent(query);
    // send request to open library search api with filters
    const response = await axios.get(`https://openlibrary.org/search.json?q=${encodedQuery}&language=eng`);

    // map the response data to match the book interface
    return response.data.docs.map((book: any) => ({
      key: book.key,
      title: book.title,
      author_name: book.author_name,
      cover_i: book.cover_i,
      first_publish_year: book.first_publish_year,
      author_key: book.author_key
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

    // fetch one edition to get number of pages
    const editionRes = await axios.get(`https://openlibrary.org/works/${cleanId}/editions.json?limit=5`);
    const editions = editionRes.data.entries;

    // try to find number of pages and a fallback cover from editions
    let numberOfPages: number | undefined;
    let fallbackCovers: number[] | undefined;
    let latestEdition: any = null;
    let latestDate: string | null = null;

    for (const edition of editions) {
      // try to find an edition with number_of_pages
      if (!numberOfPages && edition.number_of_pages) {
        numberOfPages = edition.number_of_pages;
      }

      // try to find an edition with covers
      if (!fallbackCovers && edition.covers?.length > 0) {
        fallbackCovers = edition.covers;
      }

      // track latest edition by publish_date or last_modified
      const modDate = edition.last_modified?.value || edition.created?.value;
      if (modDate && (!latestDate || modDate > latestDate)) {
        latestDate = modDate;
        latestEdition = edition;
      }
    }

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

    // use work covers if available, otherwise fallback to edition covers
    const finalCovers: number[] | undefined =
      workData.covers?.length > 0 ? workData.covers : fallbackCovers;

    // return the combined book data
    return {
      ...workData,
      authors: authors.filter(Boolean), // remove values
      // add page count
      number_of_pages: numberOfPages,
      covers: finalCovers,
      latest_edition: latestEdition
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
      author_key: book.authors?.map((a: any) => a.key)
    }));
  } catch (error) {
    console.error("Error fetching subject books:", error);
    return [];
  }
}

export async function getAuthor(authorKey: string): Promise<AuthorDetails | null> {
  try {
    // Remove /authors/ prefix if included
    const cleanKey = authorKey.replace("/authors/", "");

    // Fetch works by this author
    const res = await axios.get(`https://openlibrary.org/authors/${cleanKey}.json`);

    return res.data as AuthorDetails;
  } catch (error) {
    console.error("Error fetching books by author:", error);
    return null;
  }
}

// get books for the author
export async function getBooksByAuthor(authorName: string, page = 1): Promise<Book[]> {
  try {
    return await searchBooks(`author:"${authorName}"`);
  } catch (error) {
    console.error("Error fetching books by author:", error);
    return [];
  }
}