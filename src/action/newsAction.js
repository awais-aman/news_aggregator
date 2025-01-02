import { 
  API_KEY_NEWSAPI, 
  GUARDIAN_API_KEY, 
  NYT_API_KEY, 
  PLACEHOLDER_IMAGE_URL,
  SOURCE1_CATEGORIES, 
  SOURCE2_CATEGORIES, 
  SOURCE3_CATEGORIES 
} from "../services/newsConstants";

import { 
  getNewsApiArticles, 
  getGuardianArticles, 
  getNytArticles 
} from "../services/articlesService";
import Filter from "../shared/components/filter"; 


export const fetchLatestNews = async () => {
  try {
    const newsApiResponses = await Promise.all([
      getNewsApiArticles({ q: "technology", apiKey: API_KEY_NEWSAPI }),
      getNewsApiArticles({ q: "business", apiKey: API_KEY_NEWSAPI }),
      getNewsApiArticles({ q: "sports", apiKey: API_KEY_NEWSAPI }),
    ]);

    const newsApiArticles = newsApiResponses.flatMap((res) =>
      res.data.articles.map((article) => ({
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        imageUrl: article.urlToImage || PLACEHOLDER_IMAGE_URL,
        publishedAt: article.publishedAt,
        source: "News API",
      }))
    );

    const guardianResponse = await getGuardianArticles({ "api-key": GUARDIAN_API_KEY });
    const guardianArticles = guardianResponse.data.response.results.map((article) => ({
      title: article.webTitle,
      url: article.webUrl,
      source: "The Guardian",
      publishedAt: article.webPublicationDate,
      imageUrl: article.fields?.thumbnail || PLACEHOLDER_IMAGE_URL,
    }));

    const nytResponse = await getNytArticles({ q: "latest", "api-key": NYT_API_KEY });
    const nytArticles = nytResponse.data.response.docs.map((article) => ({
      title: article.headline.main,
      description: article.abstract || "No description available",
      content: article.lead_paragraph || "No content available",
      url: article.web_url,
      imageUrl: article.multimedia?.[0]?.url
        ? `https://www.nytimes.com/${article.multimedia[0].url}`
        : PLACEHOLDER_IMAGE_URL,
      publishedAt: article.pub_date,
      source: "The New York Times",
    }));

    const allArticles = [...newsApiArticles, ...guardianArticles, ...nytArticles];
    return allArticles.sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error("Error fetching news from multiple sources:", error);
    return [];
  }
};

export const fetchCategories = async () => {
  try {
    return [...SOURCE1_CATEGORIES, ...SOURCE2_CATEGORIES, ...SOURCE3_CATEGORIES];
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    return [];
  }
};
export const fetchAuthors = async () => {
  try {
    const [nytAuthors] = await Promise.all([
      getNytArticles({ q: "authors", "api-key": NYT_API_KEY }),
    ]);

    console.log("NYT Response:", nytAuthors); 

    if (!nytAuthors || !nytAuthors.data) {
      console.error("NYT API response does not have expected structure.");
      return []; 
    }

    const nytAuthorsList = nytAuthors.data.response.docs.map((doc) => doc.byline?.original || "Unknown Author");

    const allAuthors = [
      ...nytAuthorsList,
    ];
    const uniqueAuthors = [...new Set(allAuthors)];

    return uniqueAuthors;
  } catch (error) {
    console.error("Error fetching authors:", error);
    return [];
  }
};


export const fetchArticles = async (sources, categories, author, keywords, dateRange) => {
  const params = {};

  if (keywords) params.q = keywords;
  if (dateRange?.startDate && dateRange?.endDate) {
    params.from = dateRange.startDate;
    params.to = dateRange.endDate;
  }

  if (categories?.length) params.q = (params.q ? `${params.q} OR ` : "") + categories.join(" OR ");

  if (author) params.author = author;

  try {
    const allArticles = [];

    if (sources.includes("source1")) {
      params.apiKey = API_KEY_NEWSAPI;
      const response = await getNewsApiArticles(params);
      allArticles.push(...response.data.articles.map((article) => ({
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        imageUrl: article.urlToImage || PLACEHOLDER_IMAGE_URL,
        publishedAt: article.publishedAt,
        source: "News API",
      })));
    }

    if (sources.includes("source2")) {
      params["api-key"] = GUARDIAN_API_KEY;
      const response = await getGuardianArticles(params);
      allArticles.push(...response.data.response.results.map((article) => ({
        title: article.webTitle,
        description: article.fields?.trailText || "Description not available",
        content: article.fields?.bodyText || "Content not available",
        url: article.webUrl,
        imageUrl: article.fields?.thumbnail || PLACEHOLDER_IMAGE_URL,
        publishedAt: article.webPublicationDate,
        source: "The Guardian",
      })));
    }

    if (sources.includes("source3")) {
      params["api-key"] = NYT_API_KEY;
      if (author) params.fq = author;
      const response = await getNytArticles(params);
      allArticles.push(...response.data.response.docs.map((article) => ({
        title: article.headline.main,
        description: article.abstract || "No description available",
        content: article.lead_paragraph || "No content available",
        url: article.web_url,
        imageUrl: article.multimedia?.[0]?.url
          ? `https://www.nytimes.com/${article.multimedia[0].url}`
          : PLACEHOLDER_IMAGE_URL,
        publishedAt: article.pub_date,
        source: "The New York Times",
      })));
    }

    return allArticles.sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
};
