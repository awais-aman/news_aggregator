import React, { useState, useEffect } from "react";
import { fetchCategories, fetchAuthors } from "../../action/newsAction";
import { Form, Row, Col, Button, Accordion, Card } from "react-bootstrap";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import { NewsService } from "../../services/newsService";
import Cookies from "js-cookie";

const Filter = ({
  source,
  setSource,
  category,
  setCategory,
  author,
  setAuthor,
  keywords,
  setKeywords,
  dateRange,
  setDateRange,
  onSetFilters,
}) => {
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [tempFilters, setTempFilters] = useState({
    source: [],
    category: [],
    author: [],
    keywords: "",
    dateRange: { startDate: "", endDate: "" },
  });

  // Load initial categories and authors based on the source
  useEffect(() => {
    const loadInitialCategories = async () => {
      const fetchedCategories = await fetchCategories("all");
      setCategories(fetchedCategories);
    };
    const loadAuthorsForSource = async () => {
        if (source) {
          const fetchedAuthors = await fetchAuthors(source);
          console.log("Fetched authors: ", fetchedAuthors); // Debug log
          setAuthors(fetchedAuthors);
        }
      };

    loadInitialCategories();
    loadAuthorsForSource();
  }, [source]); // Make sure to include source in the dependency array to re-fetch when it changes

  // Load filters from cookies on component mount
  useEffect(() => {
    const savedFilters = Cookies.get("filters");
    if (savedFilters) {
      const parsedFilters = JSON.parse(savedFilters);
      setTempFilters(parsedFilters);

      setSource(parsedFilters.source);
      setCategory(parsedFilters.category);
      setAuthor(parsedFilters.author);
      setKeywords(parsedFilters.keywords);
      setDateRange(parsedFilters.dateRange);
    }
  }, [setSource, setCategory, setAuthor, setKeywords, setDateRange]);

  const handleSourceChange = (selectedOptions) => {
    setTempFilters((prev) => ({ ...prev, source: selectedOptions }));
  };

  const handleCategoryChange = (selectedOptions) => {
    setTempFilters((prev) => ({ ...prev, category: selectedOptions }));
  };

  const handleAuthorChange = (selectedOptions) => {
    setTempFilters((prev) => ({ ...prev, author: selectedOptions }));
  };

  const handleKeywordChange = (e) => {
    const keywords = e.target.value;
    setTempFilters((prev) => ({ ...prev, keywords }));
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setTempFilters((prev) => ({
      ...prev,
      dateRange: { ...prev.dateRange, [name]: value },
    }));
  };

  const handleSetFilters = async () => {
    setSource(tempFilters.source);
    setCategory(tempFilters.category);
    setAuthor(tempFilters.author);
    setKeywords(tempFilters.keywords);
    setDateRange(tempFilters.dateRange);

    Cookies.set("filters", JSON.stringify(tempFilters), { expires: 7 });

    if (onSetFilters) {
      onSetFilters(tempFilters);
    }

    const articles = await NewsService.getArticles(tempFilters);
    console.log("Filtered Articles:", articles);
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat,
    label: cat,
  }));

  const authorOptions = authors.map((auth) => ({
    value: auth,
    label: auth,
  }));

  const sourceOptions = [
    { value: "source1", label: "News API" },
    { value: "source2", label: "The Guardian" },
    { value: "source3", label: "New York Times" },
  ];

  return (
    <div className="filters-form-box">
      <Accordion defaultActiveKey="0" flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Filters</Accordion.Header>
          <Accordion.Body>
            <Form>
              <Row className="gy-3">
                <Col md={4}>
                  <Form.Control
                    type="text"
                    placeholder="Search by Keywords"
                    value={tempFilters.keywords}
                    onChange={handleKeywordChange}
                  />
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="date"
                    name="startDate"
                    placeholder="Start Date"
                    value={tempFilters.dateRange.startDate || ""}
                    onChange={handleDateRangeChange}
                  />
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="date"
                    name="endDate"
                    placeholder="End Date"
                    value={tempFilters.dateRange.endDate || ""}
                    onChange={handleDateRangeChange}
                  />
                </Col>
                <Col md={6}>
                  <Select
                    isMulti
                    options={sourceOptions}
                    onChange={handleSourceChange}
                    value={tempFilters.source}
                    placeholder="Select News Sources"
                  />
                </Col>
                <Col md={6}>
                  <Select
                    isMulti
                    options={categoryOptions}
                    onChange={handleCategoryChange}
                    value={tempFilters.category}
                    placeholder="Select Categories"
                  />
                </Col>
                <Col md={12}>
                <Select
                  isMulti
                  options={authorOptions}
                  onChange={handleAuthorChange}
                  value={tempFilters.author}
                  placeholder="Select Authors"
                />
                </Col>
              </Row>
            </Form>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Preferences</Accordion.Header>
          <Accordion.Body>
            <Form>
              <Row className="gy-3">
                <Col md={6}>
                  <Select
                    isMulti
                    options={sourceOptions}
                    onChange={handleSourceChange}
                    value={tempFilters.source}
                    placeholder="Select News Sources"
                  />
                </Col>
                <Col md={6}>
                  <Select
                    isMulti
                    options={categoryOptions}
                    onChange={handleCategoryChange}
                    value={tempFilters.category}
                    placeholder="Select Categories"
                  />
                </Col>
                <Col md={12}>
                  <Select
                    isMulti
                    options={authorOptions}
                    onChange={handleAuthorChange}
                    value={tempFilters.author}
                    isDisabled={!authors.length}
                    placeholder="Select Authors"
                  />
                </Col>
              </Row>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <Row className="mt-3">
        <Col>
          <Button variant="primary" onClick={handleSetFilters}>
            Apply
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default Filter;
