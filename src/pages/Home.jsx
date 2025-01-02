import React, { useState } from 'react';
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
  const [isProfileOpen, setProfileOpen] = useState(false); // 프로필 팝업 상태

  const handleLogout = () => {
    clearAccessToken(); // 로그아웃 처리
    navigate('/login'); // 로그인 페이지로 리디렉션
  };

  const handleMyNovels = () => {
    navigate('/mynovels');
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 네비게이션 */}
      <header className="bg-purple-600 text-white shadow-lg">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-3xl font-bold tracking-wider">노벨피아</h1>
          <nav className="flex items-center space-x-6">
            <button className="text-white flex flex-col items-center hover:text-purple-200">
              <img src="/icons/home.png" alt="홈" className="w-6 h-6 mb-1" />
              홈
            </button>
            <button onClick={handleMyNovels} className="text-white flex flex-col items-center hover:text-purple-200">
              <img src="/icons/novels.png" alt="내 작품" className="w-6 h-6 mb-1" />
              내 작품
            </button>
            <button className="text-white flex flex-col items-center hover:text-purple-200">
              <img src="/icons/notification.png" alt="알림" className="w-6 h-6 mb-1" />
              알림
            </button>
            <button
              onClick={() => setProfileOpen(!isProfileOpen)}
              className="text-white flex flex-col items-center hover:text-purple-200"
            >
              <img src="/icons/profile.png" alt="프로필" className="w-6 h-6 mb-1" />
              프로필
            </button>
          </nav>
        </div>
      </header>

      {/* 프로필 팝업 */}
      {isProfileOpen && (
        <div className="fixed top-16 right-6 w-72 bg-white shadow-lg rounded-lg p-6 z-50">
          {accessToken ? (
            <div>
              <div className="flex items-center space-x-4">
                <img
                  src="https://via.placeholder.com/50"
                  alt="프로필 이미지"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="text-lg font-semibold">사용자_123</p>
                  <p className="text-sm text-gray-500">PLUS 멤버십 활성화</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-gray-700">코인</p>
                  <p className="text-lg font-bold">0</p>
                </div>
                <div>
                  <p className="text-gray-700">마일리지</p>
                  <p className="text-lg font-bold">4</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="block w-full mt-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="block w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              로그인
            </button>
          )}
        </div>
      )}

      {/* 배너 섹션 */}
      <section className="relative bg-cover bg-center h-64" style={{ backgroundImage: 'url(/path-to-your-banner-image.jpg)' }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white">
          <h2 className="text-4xl font-bold">웹소설/웹만화 한 달간 무제한 열람</h2>
          <button className="mt-4 px-6 py-2 bg-purple-500 rounded-full text-lg shadow-lg hover:bg-purple-400">구독하기</button>
        </div>
      </section>

      {/* 카테고리 섹션 */}
      <section className="container mx-auto py-8">
        <div className="flex justify-around">
          <div className="flex flex-col items-center">
            <img src="/icons/subscribe.png" alt="구독하기" className="w-12 h-12 mb-2" />
            <span>구독하기</span>
          </div>
          <div className="flex flex-col items-center">
            <img src="/icons/coin.png" alt="코인샵" className="w-12 h-12 mb-2" />
            <span>코인샵</span>
          </div>
          <div className="flex flex-col items-center">
            <img src="/icons/event.png" alt="이벤트" className="w-12 h-12 mb-2" />
            <span>이벤트</span>
          </div>
          <div className="flex flex-col items-center">
            <img src="/icons/ranking.png" alt="랭킹" className="w-12 h-12 mb-2" />
            <span>랭킹</span>
          </div>
        </div>
      </section>

      {/* 인기 작품 섹션 */}
      <main className="container mx-auto p-8">
        <h2 className="text-2xl font-bold mb-4">노벨피아 인기 작품</h2>
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
