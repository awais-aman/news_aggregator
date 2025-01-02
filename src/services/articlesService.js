import { newsApiService, guardianApiService, nytApiService } from './baseService';

export function getNewsApiArticles(params) {
  const api = newsApiService();  
  return api.get('/everything?q=latest', { params });
}

export function getGuardianArticles(params) {
  const api = guardianApiService();  
  return api.get('', { params });
}

export function getNytArticles(params) {
  const api = nytApiService();  
  return api.get('', { params });
}
