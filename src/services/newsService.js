const NEWS_API_KEY = "d86f1fa4b6644aebbddcbeccef429b65"; // Replace with your actual API key
const NEWS_API_BASE_URL = "https://newsapi.org/";

export const fetchNews = async (
  category = "general",
  country = "india",
  pageSize = 20
) => {
  try {
    const url = `${NEWS_API_BASE_URL}/top-headlines?country=${country}&category=${category}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`;

    if (NEWS_API_KEY === "d86f1fa4b6644aebbddcbeccef429b65") {
      return getMockNews();
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching news:", error);
    return getMockNews();
  }
};

export const searchNews = async (query, language = "en", pageSize = 20) => {
  try {
    const url = `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(
      query
    )}&language=${language}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`;

    if (NEWS_API_KEY === "d86f1fa4b6644aebbddcbeccef429b65") {
      return getMockSearchNews(query);
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching news:", error);
    return getMockSearchNews(query);
  }
};

// Mock data for demo purposes
const getMockNews = () => ({
  status: "ok",
  totalResults: 5,
  articles: [
    {
      title: "Breaking: Revolutionary AI Technology Transforms Healthcare",
      description:
        "A new artificial intelligence system has shown remarkable results in early disease detection, potentially saving millions of lives.",
      content:
        "Scientists have developed a groundbreaking AI system that can detect diseases up to 5 years before traditional methods...",
      url: "https://example.com/ai-healthcare",
      urlToImage:
        "https://images.pexels.com/photos/3825539/pexels-photo-3825539.jpeg?auto=compress&cs=tinysrgb&w=800",
      publishedAt: new Date().toISOString(),
      source: { name: "TechNews Today" },
    },
    {
      title: "Climate Summit Reaches Historic Agreement on Carbon Reduction",
      description:
        "World leaders commit to ambitious new targets for reducing global carbon emissions by 2030.",
      content:
        "In a landmark decision, representatives from 195 countries have agreed to implement aggressive carbon reduction measures...",
      url: "https://example.com/climate-summit",
      urlToImage:
        "https://images.pexels.com/photos/683535/pexels-photo-683535.jpeg?auto=compress&cs=tinysrgb&w=800",
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      source: { name: "Global Environment Weekly" },
    },
    {
      title:
        "Space Exploration Milestone: First Human Settlement on Mars Planned",
      description:
        "Space agencies announce detailed plans for establishing the first permanent human settlement on Mars by 2035.",
      content:
        "A consortium of international space agencies has unveiled comprehensive plans for Mars colonization...",
      url: "https://example.com/mars-settlement",
      urlToImage:
        "https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg?auto=compress&cs=tinysrgb&w=800",
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      source: { name: "Space Exploration Journal" },
    },
    {
      title: "Economic Markets Show Strong Recovery Amid Global Uncertainty",
      description:
        "Stock markets worldwide demonstrate resilience with significant gains across major indices.",
      content:
        "Despite ongoing global challenges, financial markets have shown remarkable strength...",
      url: "https://example.com/market-recovery",
      urlToImage:
        "https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg?auto=compress&cs=tinysrgb&w=800",
      publishedAt: new Date(Date.now() - 10800000).toISOString(),
      source: { name: "Financial Times Global" },
    },
    {
      title:
        "Breakthrough in Quantum Computing Promises Revolutionary Applications",
      description:
        "Scientists achieve quantum supremacy with new computer that solves complex problems in seconds.",
      content:
        "Researchers have successfully demonstrated a quantum computer capable of performing calculations...",
      url: "https://example.com/quantum-computing",
      urlToImage:
        "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800",
      publishedAt: new Date(Date.now() - 14400000).toISOString(),
      source: { name: "Quantum Science Review" },
    },
  ],
});

const getMockSearchNews = (query) => ({
  status: "ok",
  totalResults: 3,
  articles: [
    {
      title: `Latest developments in ${query}`,
      description: `Breaking news and updates related to ${query} from around the world.`,
      content: `This is the latest news about ${query}...`,
      url: `https://example.com/search-${query}`,
      urlToImage:
        "https://images.pexels.com/photos/3825539/pexels-photo-3825539.jpeg?auto=compress&cs=tinysrgb&w=800",
      publishedAt: new Date().toISOString(),
      source: { name: "News Search" },
    },
    {
      title: `Expert analysis on ${query}`,
      description: `Industry experts weigh in on the latest ${query} developments.`,
      content: `Leading experts in the field have provided their insights on ${query}...`,
      url: `https://example.com/analysis-${query}`,
      urlToImage:
        "https://images.pexels.com/photos/683535/pexels-photo-683535.jpeg?auto=compress&cs=tinysrgb&w=800",
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      source: { name: "Expert Analysis" },
    },
    {
      title: `Future outlook for ${query}`,
      description: `What the future holds for ${query} in the coming months.`,
      content: `Industry analysts predict significant changes in the ${query} sector...`,
      url: `https://example.com/outlook-${query}`,
      urlToImage:
        "https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg?auto=compress&cs=tinysrgb&w=800",
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      source: { name: "Future Trends" },
    },
  ],
});

export const categories = [
  "general",
  "business",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
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
