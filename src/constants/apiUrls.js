// src/constants/apiUrls.js

const API_BASE_URL = 'http://localhost:8080';  // 백엔드 API 기본 URL

// 각 엔드포인트를 하나의 객체로 관리
export const API_URLS = {
  REISSUE: `${API_BASE_URL}/api/auth/reissue`,
  BASE: `${API_BASE_URL}`
  ,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  GET_USER: `${API_BASE_URL}/user`,
  UPDATE_USER: `${API_BASE_URL}/user/update`,
  DELETE_USER: `${API_BASE_URL}/user/delete`,
  // 추가적인 API 엔드포인트들...
  TAG: `${API_BASE_URL}/api/tags`,
  GET_NOVEL: `${API_BASE_URL}/api/novels`,
  GET_MY_NOVEL: `${API_BASE_URL}/api/user/novels`,
  UPDATE_NOVEL: (novelId) => `${API_BASE_URL}/api/novels/${novelId}`,
  GET_NOVEL_DETAILS: (novelId) => `${API_BASE_URL}/api/novels/${novelId}`,
  CREATE_EPISODE: (novelId) => `${API_BASE_URL}/api/novels/${novelId}/episodes`,
  GET_EPISODE: (novelId) => `${API_BASE_URL}/api/novels/${novelId}/episodes`,
  GET_EPISODE_DETAILS: (novelId,episodeId) => `${API_BASE_URL}/api/novels/${novelId}/episodes/${episodeId}`,
  EDIT_EPISODE: (novelId,episodeId) => `${API_BASE_URL}/api/novels/${novelId}/episodes/${episodeId}`,
  DELETE_EPISODE: (novelId,episodeId) => `${API_BASE_URL}/api/novels/${novelId}/episodes/${episodeId}`,
  CREATE_NOVEL: `${API_BASE_URL}/api/novels`,
  CHECK_USERNAME: `${API_BASE_URL}/api/users/check/username`,
  CHECK_NICKNAME: `${API_BASE_URL}/api/users/check/nickname`,
  CHECK_EMAIL: `${API_BASE_URL}/api/users/check/email`
};
