# News Aggregator

## Overview
The News Aggregator is a project designed to collect and display news articles from various sources in one place. It aims to provide users with a convenient way to stay updated with the latest news.

## Features
- Fetch news from multiple sources
- Categorize news articles by Sources, Categories and authors
- User-friendly interface

## Installation

1. Build the Docker image:

       docker build -t news_agrigator .
2. Run the Docker container:

       docker run -p 3000:3000 news_agrigator


## Installation without Docker
1. Start the application:
    ```
    npm start
    ```
2. Open the browser and go to `http://localhost:3000`
 

## Project structure

| Name                    | Description                                                                                                |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| src/                    | Client (React) source code                                                                                 |
| src/actions             | Contains all api actions divided in related files (News related actions will be in newsActions file. etc.) |
| src/components          | Components using in the app                                                                                |
| src/shared   | Components that will be shared across the app (Navbar, Filter, Cards etc.)                                 |
| src/constants           | Contains constants of all application divided in related files                                             |
| src/services            | Services folder will have a service for each module which will be responsible for making api calls                                                                     |
| src/stylesheets         |     Contains CSS files for each component      |


## Assumptions

1. News API has a rate limit and after that it doesn't return any news 
2. Author field should be disabled for the sources which do not provide the name of AUthors as attributes to the Article. e.g. Guardian
3. On Read More button click I am redirecting it to original source page
4. I am storing preferences in the cookies and thier expiry time is 7 days or when you do hard refresh they will be cleared
