import React from 'react';
import { Card, Col } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton'; 

const ArticleCard = ({ article, index, loading }) => {
  return (
    <Col key={index} md={4} className="mb-4">
      <Card className="shadow-sm h-100">
        {loading ? (
          <div className="skeleton-loader" style={{ height: '200px' }}></div>
        ) : (
          article?.imageUrl && <Card.Img variant="top" src={article.imageUrl} />
        )}
        <Card.Body>
          {loading ? (
            <>
              <div className="skeleton-loader" style={{ height: '20px', marginBottom: '10px' }}></div>
              <div className="skeleton-loader" style={{ height: '15px', marginBottom: '10px' }}></div>
              <div className="skeleton-loader" style={{ height: '30px' }}></div>
            </>
          ) : (
            <>
              <Card.Title>{article.title}</Card.Title>
              <Card.Text>{article.description}</Card.Text>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Read more
              </a>
            </>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ArticleCard;
