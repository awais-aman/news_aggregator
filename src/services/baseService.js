import axios from 'axios';
import { 
  BASE_URL_NEWSAPI, 
  GUARDIAN_API_URL, 
  BASE_URL_NYT 
} from './newsConstants';

const newsApiService = () => {
  const defaultOptions = {
    baseURL: BASE_URL_NEWSAPI,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return axios.create(defaultOptions);
};

const guardianApiService = () => {
  const defaultOptions = {
    baseURL: GUARDIAN_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return axios.create(defaultOptions);
};

const nytApiService = () => {
  const defaultOptions = {
    baseURL: BASE_URL_NYT,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return axios.create(defaultOptions);
};

export { newsApiService, guardianApiService, nytApiService };
