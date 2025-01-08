import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URLS } from '../constants/apiUrls';
import useAuthStore from '../store/authStore'; // Zustand store
import { postRequest } from '../utils/apiHelpers';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  // Use Zustand store for access token
  const { setInfo, clearInfo } = useAuthStore();

  // 일반 로그인 처리
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await postRequest(`${API_URLS.LOGIN}`, { username, password });
      const { accessToken, refreshToken, userId } = response.data;
      console.log(response)
      // JWT 토큰 상태에 저장 (Zustand)
      setInfo(accessToken, refreshToken, userId);

      navigate('/'); // 홈 화면으로 이동
    } catch (error) {
      console.error(error);
      alert('로그인 실패! 아이디와 비밀번호를 확인해주세요.');
    }
  };

  // 소셜 로그인 처리
  const handleSocialLogin = (provider) => {
    // Spring Boot OAuth2 Client 엔드포인트로 리다이렉트.
    const backendOauthUrl = `${API_URLS.BASE}/oauth2/authorization/${provider}`;
    window.location.href = backendOauthUrl;
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl">
        <h2 className="text-3xl font-semibold text-purple-700 text-center mb-6">로그인</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">아이디</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="아이디를 입력하세요"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 focus:outline-none transition duration-200"
          >
            로그인
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            계정이 없으신가요?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-purple-600 hover:underline"
            >
              회원가입
            </button>
          </p>
        </div>
{/* 소셜 로그인 버튼 */}
<div className="mt-8 space-y-4">
  {/* Kakao Login */}
  <button
    onClick={() => handleSocialLogin('kakao')}
    className="w-full h-14 rounded-full hover:opacity-90 focus:outline-none transition duration-200"
    style={{
      backgroundImage: "url('kakao.png')", // 카카오 로고 이미지 경로
      backgroundSize: "cover", // 커버 이미지 설정
      backgroundPosition: "center", // 이미지 중앙 정렬
      backgroundRepeat: "no-repeat", // 반복 제거
    }}
  >
    <span className="sr-only">카카오로 로그인</span> {/* 접근성용 텍스트 */}
  </button>

  {/* Naver Login */}
  <button
    onClick={() => handleSocialLogin('naver')}
    className="w-full h-14 rounded-full  hover:opacity-90 focus:outline-none transition duration-200"
    style={{
      backgroundImage: "url('naver.png')", // 네이버 로고 이미지 경로
      backgroundSize: "cover", // 커버 이미지 설정
      backgroundPosition: "center", // 이미지 중앙 정렬
      backgroundRepeat: "no-repeat", // 반복 제거
    }}
  >
    <span className="sr-only">네이버로 로그인</span> {/* 접근성용 텍스트 */}
  </button>
</div>

      </div>
    </div>
  );
};

export default Login;
