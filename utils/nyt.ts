import axios from "axios";

export async function getNYTBestsellers(list: string = "hardcover-fiction") {
  const apiKey = process.env.NYT_API_KEY;
  const url = `https://api.nytimes.com/svc/books/v3/lists/current/${list}.json?api-key=${apiKey}`;

  try {
    const res = await axios.get(url);
    return res.data.results.books;
  } catch (error) {
    console.error("NYT API Error:", error);
    return [];
  }
}
