import axios from 'axios';
import useAuthStore from '../store/authStore'; // Zustand store 가져오기

// Axios 인스턴스 설정
const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 토큰이 있으면 Authorization 헤더에 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken; // 상태에서 직접 토큰 가져오기
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`; // Bearer 방식으로 토큰 추가
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // 요청 오류 시 Promise.reject() 반환
  }
);

// GET 요청
export const getRequest = async (url) => {
  try {
    const response = await axiosInstance.get(url);
    return response.data; // 응답 데이터를 반환
  } catch (error) {
    handleError(error);
  }
};

// POST 요청
export const postRequest = async (url, data) => {
  try {
    const response = await axiosInstance.post(url, data);
    return response.data; // 응답 데이터를 반환
  } catch (error) {
    handleError(error);
  }
};

// PUT 요청
export const putRequest = async (url, data) => {
  try {
    const response = await axiosInstance.put(url, data);
    return response.data; // 응답 데이터를 반환
  } catch (error) {
    handleError(error);
  }
};

// PATCH 요청
export const patchRequest = async (url, data) => {
  try {
    const response = await axiosInstance.patch(url, data);
    return response.data; // 응답 데이터를 반환
  } catch (error) {
    handleError(error);
  }
};

// DELETE 요청
export const deleteRequest = async (url) => {
  try {
    const response = await axiosInstance.delete(url);
    return response.data; // 응답 데이터를 반환
  } catch (error) {
    handleError(error);
  }
};

// 에러 처리 함수
const handleError = (error) => {
  if (error.response) {
    // 서버가 응답을 보냈고, 응답 코드가 2xx가 아닌 경우
    console.error('Error Response:', error.response.data);
    alert(`Error: ${error.response.data.message || 'Unknown error'}`);
  } else if (error.request) {
    // 요청은 했지만 응답을 받지 못한 경우
    console.error('Error Request:', error.request);
    alert('Error: Server did not respond');
  } else {
    // 설정에서 발생한 에러
    console.error('Error Message:', error.message);
    alert(`Error: ${error.message}`);
  }
};
