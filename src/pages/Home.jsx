// src/components/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore'; // Zustand store

const novels = [
  { id: 1, title: '시작된 사랑', author: '홍길동', rating: 4.8, image: 'https://via.placeholder.com/150', description: '로맨틱한 사랑 이야기' },
  { id: 2, title: '끝없는 전쟁', author: '김철수', rating: 4.5, image: 'https://via.placeholder.com/150', description: '액션과 전투가 넘치는 소설' },
  { id: 3, title: '시간의 흐름', author: '이영희', rating: 4.7, image: 'https://via.placeholder.com/150', description: '시간 여행을 다룬 판타지 소설' },
  // 더 많은 소설 데이터 추가 가능
];

const Home = () => {
  const navigate = useNavigate();
  const { accessToken, clearAccessToken } = useAuthStore(); // 로그인 상태 가져오기

  const handleLogout = () => {
    clearAccessToken(); // 로그아웃 처리
    navigate('/login'); // 로그인 페이지로 리디렉션
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 네비게이션 */}
      <header className="bg-purple-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-wider">노벨피아</h1>
          <nav>
            <ul className="flex space-x-8 text-lg">
              <li><a href="/" className="hover:underline hover:text-purple-200">홈</a></li>
              {accessToken ? (
                <>
                  <li><button onClick={handleLogout} className="hover:underline hover:text-purple-200">로그아웃</button></li>
                  <li><a href="/profile" className="hover:underline hover:text-purple-200">내 정보</a></li>
                </>
              ) : (
                <>
                  <li><a href="/login" className="hover:underline hover:text-purple-200">로그인</a></li>
                  <li><a href="/signup" className="hover:underline hover:text-purple-200">회원가입</a></li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto p-8">
        {/* 검색 기능 */}
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            placeholder="웹소설을 검색하세요"
            className="w-3/4 sm:w-1/2 p-3 border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* 웹소설 목록 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {novels.map((novel) => (
            <div key={novel.id} className="bg-white shadow-xl rounded-2xl overflow-hidden transition-transform transform hover:scale-105 border border-purple-300">
              <img src={novel.image} alt={novel.title} className="w-full h-40 object-cover rounded-t-2xl" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">{novel.title}</h3>
                <p className="text-md text-gray-600 mt-2">저자: {novel.author}</p>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-400">{'★'.repeat(Math.round(novel.rating))}</span>
                  <span className="ml-2 text-gray-500">{novel.rating}</span>
                </div>
                <p className="text-sm text-gray-500 mt-4">{novel.description}</p>
                <a href={`/novel/${novel.id}`} className="block mt-4 text-purple-600 hover:text-purple-700 hover:underline">
                  더보기
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-8 gap-4">
          <button className="px-6 py-2 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 focus:outline-none">이전</button>
          <button className="px-6 py-2 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 focus:outline-none">다음</button>
        </div>
      </main>

      {/* 하단 */}
      <footer className="bg-purple-600 text-white text-center py-6 rounded-t-3xl">
        <p className="text-sm">&copy; 2024 노벨피아. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
