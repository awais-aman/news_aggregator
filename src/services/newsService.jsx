import { fetchLatestNews, fetchCategories, fetchAuthors, fetchArticles } from "../action/newsAction";


export const NewsService = {
  getLatestNews: async () => {
    return await fetchLatestNews();
  },

  getCategories: async (source) => {
    return await fetchCategories(source);
  },

  getAuthors: async () => {
    return await fetchAuthors();
  },

  getArticles: async (filters) => {
    const { sources, categories, author, keywords, dateRange } = filters;
    return await fetchArticles(sources, categories, author, keywords, dateRange);
  },
};
