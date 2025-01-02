import React, { useState } from 'react';
import NewsList from './components/newsList';

const App = () => {
  const [articles, setArticles] = useState([]);

  return (
    <div>
      <header>
        <h1>News Aggregator</h1>
      </header>
      <main>
        <NewsList articles={articles} />
      </main>
    </div>
  );
};

export default App;

