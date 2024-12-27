import React from 'react';
import { BrowserRouter } from 'react-router-dom';  // BrowserRouter 임포트
import useAuthStore from './store/authStore';  // Zustand store 가져오기
import RoutesConfig from './routes';  // RoutesConfig는 default export

const App = () => {
  const { accessToken } = useAuthStore();

  return (
    <BrowserRouter>  {/* 전체 라우팅을 감싸는 BrowserRouter */}
      <RoutesConfig accessToken={accessToken} />
    </BrowserRouter>
  );
};

export default App;
