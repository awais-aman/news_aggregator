import React, { useEffect, useState } from "react";
import { fetchLatestNews, fetchArticles, fetchAuthors } from "../action/newsAction.js";
import ArticleCard from "../shared/components/articleCard.jsx";
import { Row } from "react-bootstrap";
import Filter from "../shared/components/filter.jsx";
import Cookies from "js-cookie"; 

const NewsList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState([]);
  const [category, setCategory] = useState([]);
  const [author, setAuthor] = useState("");
  const [keywords, setKeywords] = useState("");
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [authors, setAuthors] = useState([]); // State for authors

  const loadFiltersFromCookies = () => {
    const savedFilters = Cookies.get("filters");
    console.log("Loaded filters from cookies:", savedFilters); 
    if (savedFilters) {
      return JSON.parse(savedFilters);
    }
    return null;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const savedFilters = loadFiltersFromCookies();

      if (savedFilters) {
        const { source, category, author, keywords, dateRange } = savedFilters;

        setSource(source.map((s) => s.value));
        setCategory(category.map((c) => c.value));
        setAuthor(author);
        setKeywords(keywords);
        setDateRange(dateRange);

        console.log("Fetching articles with saved filters:", savedFilters);
        const fetchedArticles = await fetchArticles(
          source.map((s) => s.value),
          category.map((c) => c.value),
          author,
          keywords,
          dateRange
        );
        setArticles(fetchedArticles);
      } else {
        console.log("Fetching latest news (no filters found)"); 
        const latestNews = await fetchLatestNews();
        setArticles(latestNews);
      }

      // Fetch authors every time the page loads or refreshes
      const fetchedAuthors = await fetchAuthors();
      setAuthors(fetchedAuthors);

    } catch (error) {
      console.error("Error fetching articles:", error);
      setArticles([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []); 

  const handleSetFilters = (updatedFilters) => {
    console.log("Setting new filters:", updatedFilters); 

    setSource(updatedFilters.source.map((s) => s.value));
    setCategory(updatedFilters.category.map((c) => c.value));
    setAuthor(updatedFilters.author);
    setKeywords(updatedFilters.keywords);
    setDateRange(updatedFilters.dateRange);

    
    Cookies.set("filters", JSON.stringify(updatedFilters), { expires: 7 });
    console.log("Filters saved to cookies:", updatedFilters); 

    const fetchDataWithFilters = async () => {
      setLoading(true);
      try {
        const fetchedArticles = await fetchArticles(
          updatedFilters.source.map((s) => s.value),
          updatedFilters.category.map((c) => c.value),
          updatedFilters.author,
          updatedFilters.keywords,
          updatedFilters.dateRange
        );
        setArticles(fetchedArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setArticles([]);
      }
      setLoading(false);
    };

    fetchDataWithFilters(); 
  };

  return (
    <div>
      <Filter
        source={source}
        setSource={setSource}
        category={category}
        setCategory={setCategory}
        author={author}
        setAuthor={setAuthor}
        keywords={keywords}
        setKeywords={setKeywords}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onSetFilters={handleSetFilters}
        authors={authors} // Pass the authors to Filter
      />

      <Row>
        {loading ? (
          Array.from({ length: 9 }).map((_, index) => (
            <ArticleCard
              key={index}
              article={{}}
              index={index}
              loading={loading}
            />
          ))
        ) : articles.length > 0 ? (
          articles.map((article, index) => (
            <ArticleCard
              key={index}
              article={article}
              index={index}
              loading={loading}
            />
          ))
        ) : (
          <p>{loading ? "Loading articles..." : "No articles found"}</p>
        )}
      </Row>
    </div>
  );
};

export default NewsList;
