// src/constants/apiUrls.js

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;  // 백엔드 API 기본 URL

// 각 엔드포인트를 하나의 객체로 관리
export const API_URLS = {
  REISSUE: `${API_BASE_URL}/api/auth/reissue`,
  BASE: `${API_BASE_URL}`
  ,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  USER_PROFILE: `${API_BASE_URL}/api/users/profile`,
  // 추가적인 API 엔드포인트들...
  TAG: `${API_BASE_URL}/api/tags`,
  CREATE_COMMENT: (novelId, episodeId) => `${API_BASE_URL}/api/novels/${novelId}/episodes/${episodeId}/comments`,
  DELETE_COMMENT: (novelId, episodeId, commentId) => `${API_BASE_URL}/api/novels/${novelId}/episodes/${episodeId}/comments/${commentId}`,
  UPDATE_COMMENT: (novelId, episodeId, commentId) => `${API_BASE_URL}/api/novels/${novelId}/episodes/${episodeId}/comments/${commentId}`,
  GET_COMMENTS: (novelId, episodeId) => `${API_BASE_URL}/api/novels/${novelId}/episodes/${episodeId}/comments`,
  GET_NOVEL: `${API_BASE_URL}/api/novels`,
  GET_HOT_NOVELS: `${API_BASE_URL}/api/novels/hot`,
  GET_MY_NOVEL: `${API_BASE_URL}/api/user/novels`,
  UPDATE_NOVEL: (novelId) => `${API_BASE_URL}/api/novels/${novelId}`,
  GET_NOVEL_DETAILS: (novelId) => `${API_BASE_URL}/api/novels/${novelId}`,
  CREATE_EPISODE: (novelId) => `${API_BASE_URL}/api/novels/${novelId}/episodes`,
  GET_EPISODE: (novelId) => `${API_BASE_URL}/api/novels/${novelId}/episodes`,
  GET_EPISODE_DETAILS: (episodeId) => `${API_BASE_URL}/api/episodes/${episodeId}`,
  EDIT_EPISODE: (novelId,episodeId) => `${API_BASE_URL}/api/novels/${novelId}/episodes/${episodeId}`,
  DELETE_EPISODE: (novelId,episodeId) => `${API_BASE_URL}/api/novels/${novelId}/episodes/${episodeId}`,
  CREATE_NOVEL: `${API_BASE_URL}/api/novels`,
  CHECK_USERNAME: `${API_BASE_URL}/api/users/check/username`,
  CHECK_NICKNAME: `${API_BASE_URL}/api/users/check/nickname`,
  CHECK_EMAIL: `${API_BASE_URL}/api/users/check/email`,
  INCREASE_VIEW: (episodeId) => `${API_BASE_URL}/api/episodes/${episodeId}/views`
};
