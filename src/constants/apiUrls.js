// src/constants/apiUrls.js

const API_BASE_URL = 'http://localhost:8080';  // 백엔드 API 기본 URL

// 각 엔드포인트를 하나의 객체로 관리
export const API_URLS = {
  BASE: `${API_BASE_URL}`,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  GET_USER: `${API_BASE_URL}/user`,
  UPDATE_USER: `${API_BASE_URL}/user/update`,
  DELETE_USER: `${API_BASE_URL}/user/delete`,
  // 추가적인 API 엔드포인트들...

  CHECK_USERNAME: `${API_BASE_URL}/api/users/check/username`,
  CHECK_NICKNAME: `${API_BASE_URL}/api/users/check/nickname`,
  CHECK_EMAIL: `${API_BASE_URL}/api/users/check/email`
};
