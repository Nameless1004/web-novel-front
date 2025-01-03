import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaBook, FaBell, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore'; // Zustand store
import Particles from 'react-tsparticles'; // 파티클 효과 라이브러리

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
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 파티클 효과 */}
      <Particles
        id="tsparticles"
        options={{
          particles: {
            number: {
              value: 100,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            shape: {
              type: 'circle',
            },
            opacity: {
              value: 0.5,
              random: true,
              anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
              },
            },
            size: {
              value: 3,
              random: true,
            },
            links: {
              enable: true,
              distance: 150,
              color: '#ffffff',
              opacity: 0.4,
              width: 1,
            },
            move: {
              enable: true,
              speed: 2,
            },
          },
          interactivity: {
            events: {
              onhover: {
                enable: true,
                mode: 'repulse',
              },
            },
          },
        }}
      />

      {/* 상단 네비게이션 */}
      <header className="relative z-10">
        {/* 배너 */}
        <div className="w-full h-[550px] bg-cover bg-center" style={{ backgroundImage: "url('/banner.jpg')", backgroundPosition: 'bottom' }} />

        {/* 상단 네비게이션 */}
        <div className="absolute top-0 left-0 w-full z-20 bg-gradient-to-b from-black to-transparent text-white">
          <div className="container mx-auto flex justify-between items-center py-4 px-6">
            <img src="/logo.png" alt="픽션홀릭 로고" className="w-32 h-auto" />
            <nav className="flex items-center space-x-8">
              <motion.button
                className="flex flex-col items-center"
                whileHover={{ scale: 1.1 }}
              >
                <FaHome className="w-6 h-6 mb-1" />
                홈
              </motion.button>
              <motion.button
                onClick={handleMyNovels}
                className="flex flex-col items-center"
                whileHover={{ scale: 1.1 }}
              >
                <FaBook className="w-6 h-6 mb-1" />
                내 작품
              </motion.button>
              <motion.button
                className="flex flex-col items-center"
                whileHover={{ scale: 1.1 }}
              >
                <FaBell className="w-6 h-6 mb-1" />
                알림
              </motion.button>
              <motion.button
                onClick={() => setProfileOpen(!isProfileOpen)}
                className="flex flex-col items-center"
                whileHover={{ scale: 1.1 }}
              >
                <FaUser className="w-6 h-6 mb-1" />
                프로필
              </motion.button>
            </nav>
          </div>
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
                  <p className="text-lg font-semibold text-black">사용자_123</p>
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
                className="block w-full mt-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="block w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none"
            >
              로그인
            </button>
          )}
        </div>
      )}

<main className="container mx-auto p-8">
  <h3 className="text-3xl font-semibold text-left text-black mb-4">인기 작품</h3>
  <div className="text-1xl text-left text-gray-500 mb-8">인기 작품이 궁금하다면</div>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-20">
    {novels.map((novel) => (
      <div key={novel.id} className="overflow-hidden transition-transform transform hover:scale-105 flex justify-between items-center">
        {/* 커버 이미지 */}
        <img
          src={novel.image}
          alt={novel.title}
          className="w-24 h-36 object-cover"  // 이미지 크기 설정
        />
        {/* 정보 영역 */}
        <div className="ml-2 p-3 flex-1">
          {/* 제목: 텍스트가 넘칠 경우 ... 표시 */}
          <h3 className="text-xl font-semibold text-black overflow-hidden text-ellipsis whitespace-nowrap">{novel.title}</h3>
          {/* 저자: 텍스트가 넘칠 경우 ... 표시 */}
          <p className="text-md text-gray-700 mt-2 overflow-hidden text-ellipsis whitespace-nowrap">{novel.author}</p>
          <div className="flex items-center mt-2">
            <span className="text-yellow-400">{'★'.repeat(Math.round(novel.rating))}</span>
            <span className="ml-2 text-gray-500">{novel.rating}</span>
          </div>
          {/* 설명: 텍스트가 넘칠 경우 ... 표시 */}
          <p className="text-sm text-gray-500 mt-4 overflow-hidden text-ellipsis whitespace-nowrap">{novel.description}</p>
        </div>
      </div>
    ))}
  </div>
</main>


      {/* PD 추천 픽 */}
      <main className="container mx-auto p-8">
        <h3 className="text-3xl font-semibold text-left text-black mb-4">PD 추천픽!</h3>
        <div className="text-1xl text-left text-gray-500 mb-8">인기 작품이 궁금하다면</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-20">
          {novels.map((novel) => (
            <div key={novel.id} className="bg-white shadow-xl rounded-2xl overflow-hidden transition-transform transform hover:scale-105 border border-gray-300">
              <img src={novel.image} alt={novel.title} className="w-full h-40 object-cover rounded-t-2xl" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-black">{novel.title}</h3>
                <p className="text-md text-gray-700 mt-2">저자: {novel.author}</p>
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
      </main>

      {/* 노벨 추천 픽 */}
      <main className="container mx-auto p-8">
        <h2 className="text-3xl font-semibold text-left text-black mb-4">노벨PICK 모아보기</h2>
        <div className="text-1xl text-left text-gray-500 mb-8">인기 작품이 궁금하다면</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-20">
          {novels.map((novel) => (
            <div key={novel.id} className="bg-white shadow-xl rounded-2xl overflow-hidden transition-transform transform hover:scale-105 border border-gray-300">
              <img src={novel.image} alt={novel.title} className="w-full h-40 object-cover rounded-t-2xl" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-black">{novel.title}</h3>
                <p className="text-md text-gray-700 mt-2">저자: {novel.author}</p>
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
      </main>

      {/* 신규작 픽 */}
      <main className="container mx-auto p-8">
        <h2 className="text-3xl font-semibold text-left text-black mb-8">따끈따끈 신규 작품</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-20">
          {novels.map((novel) => (
            <div key={novel.id} className="bg-white shadow-xl rounded-2xl overflow-hidden transition-transform transform hover:scale-105 border border-gray-300">
              <img src={novel.image} alt={novel.title} className="w-full h-40 object-cover rounded-t-2xl" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-black">{novel.title}</h3>
                <p className="text-md text-gray-700 mt-2">저자: {novel.author}</p>
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
      </main>

      {/* 하단 */}
      <footer className="bg-white text-center py-6">
        <p className="text-sm text-gray-600">&copy; 2024 노벨피아. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
