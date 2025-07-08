const GNEWS_API_KEY = "382285d416f292fb6c09fd7cd0725aeb"; // Replace with your actual GNews API key
const GNEWS_API_BASE_URL = "https://gnews.io/api/v4";

export const fetchNews = async (
  category = "general",
  country = "in",
  max = 5
) => {
  try {
    const url = `${GNEWS_API_BASE_URL}/top-headlines?category=${category}&country=${country}&max=${max}&apikey=${GNEWS_API_KEY}`;

    console.log(
      "Fetching news with country:",
      country,
      "and category:",
      category
    );
    console.log("GNews URL:", url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      status: "ok",
      totalResults: data.totalArticles,
      articles: data.articles,
    };
  } catch (error) {
    console.error("Error fetching news:", error);
    return getMockNews(); // Make sure getMockNews is defined somewhere
  }
};

export const searchNews = async (query, lang = "en", max = 20) => {
  try {
    const url = `${GNEWS_API_BASE_URL}/search?q=${encodeURIComponent(
      query
    )}&lang=${lang}&max=${max}&apikey=${GNEWS_API_KEY}`;

    console.log("Searching news with query:", query);
    console.log("GNews Search URL:", url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      status: "ok",
      totalResults: data.totalArticles,
      articles: data.articles,
    };
  } catch (error) {
    console.error("Error searching news:", error);
    return getMockSearchNews(query); // Make sure getMockSearchNews is defined
  }
};

export const categories = [
  "general",
  "world",
  "nation",
  "business",
  "technology",
  "entertainment",
  "sports",
  "science",
  "health",
];

export const countries = [
  { code: "us", name: "United States" },
  { code: "gb", name: "United Kingdom" },
  { code: "ca", name: "Canada" },
  { code: "au", name: "Australia" },
  { code: "de", name: "Germany" },
  { code: "fr", name: "France" },
  { code: "jp", name: "Japan" },
  { code: "in", name: "India" },
  { code: "br", name: "Brazil" },
  { code: "mx", name: "Mexico" },
];
