// src/components/LoginSuccess.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // useNavigate 훅을 import 해야 합니다.
import useAuthStore from '../store/authStore';

const LoginSuccess = () => {
  const navigate = useNavigate();  // useNavigate 훅을 사용
  const setAccessToken = useAuthStore((state) => state.setAccessToken); // Zustand store에서 setAccessToken 가져오기

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('Authorization');

    if (token) {
      // Zustand store에 토큰 저장
      setAccessToken(token);
      navigate('/');  // 홈으로 리디렉션
    } else {
      navigate('/login');  // 로그인 실패 시 로그인 페이지로 리디렉션
    }
  }, [navigate, setAccessToken]);

  return null; // 렌더링할 내용 없음
};

export default LoginSuccess;
