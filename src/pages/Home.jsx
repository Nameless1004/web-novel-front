import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore'; // Zustand store
import Particles from 'react-tsparticles'; // 파티클 효과 라이브러리
import { getRequest } from '../utils/apiHelpers';
import { API_URLS } from '../constants/apiUrls';
import Header from '../components/Header'; // Header 컴포넌트 import

const Home = () => {
  const navigate = useNavigate();
  const { accessToken, clearInfo } = useAuthStore(); // 로그인 상태 가져오기
  const [isProfileOpen, setProfileOpen] = useState(false); // 프로필 팝업 상태
  const [profileData, setProfileData] = useState(null); // 프로필 데이터
  const [hotNovels, setHotNovels] = useState([]); // 인기 소설 데이터
  const [newNovels, setNewNovels] = useState([]); // 신규작 픽 데이터
  const [loadingHotNovels, setLoadingHotNovels] = useState(true); // 인기 소설 로딩 상태
  const [loadingNewNovels, setLoadingNewNovels] = useState(true); // 신규작 픽 로딩 상태
  const [currentHour, setCurrentHour] = useState(null);

  const itemsPerPage = 9; // 페이지당 아이템 수

  useEffect(() => {
    const fetchCurrentTime = async () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0'); // 두 자리로 표시
      setCurrentHour(`${hours}:00`);
    };

    const fetchHotNovels = async () => {
      setLoadingHotNovels(true);
      try {
        const response = await getRequest(`${API_URLS.GET_HOT_NOVELS}`, { hour: new Date().getHours(), page: 1, size: 9 });
        setHotNovels(response.data.content || []);
      } catch (error) {
        console.error('Failed to fetch hot novels:', error);
      }
      setLoadingHotNovels(false);
    };

    const fetchNewNovels = async () => {
      setLoadingNewNovels(true);
      try {
        const response = await getRequest(`${API_URLS.GET_NOVEL}`, { orderby: 'new', direction: 'desc', page: 1, size: 7 });
        setNewNovels(response.data.content || []);
      } catch (error) {
        console.error('Failed to fetch new novels:', error);
      }
      setLoadingNewNovels(false);
    };

    // Fetch data
    fetchCurrentTime();
    fetchHotNovels();
    fetchNewNovels();
  }, []);

  const handleLogout = () => {
    clearInfo(); // 로그아웃 처리
    navigate('/'); // 로그인 페이지로 리디렉션
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
            number: { value: 100, density: { enable: true, value_area: 800 } },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1 } },
            size: { value: 3, random: true },
            links: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
            move: { enable: true, speed: 2 },
          },
          interactivity: { events: { onhover: { enable: true, mode: 'repulse' } } },
        }}
      />
      <Header isProfileOpen={isProfileOpen} onProfileToggle={() => setProfileOpen(!isProfileOpen)} />
      <div className="w-full h-[550px] bg-cover bg-center" style={{ backgroundImage: "url('/banner.jpg')", backgroundPosition: 'bottom' }} />
      {/* 인기 작품 */}
      <main className="container mx-auto p-8">
        <h3 className="text-3xl font-semibold text-left text-black mb-4">인기 작품</h3>
        <div className="text-2xl text-left text-gray-800 mb-8">
          <span className="font-bold">{currentHour}</span> 기준 픽션홀릭 유저들의 실시간 <span className="text-blue-600 font-semibold">조회수</span> 인기작품
        </div>
        {loadingHotNovels ? (
          <p className="text-center text-gray-500">로딩 중...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {hotNovels.length === 0 ? (
              <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center col-span-3">
                순위 집계 중...
              </div>
            ) : (
              hotNovels.map((novel, index) => (
                <div
                  key={novel.novelId}
                  className="bg-white rounded-lg p-3 flex flex-col lg:flex-row h-full cursor-pointer"
                  onClick={() => navigate(`/novels/details?id=${novel.novelId}`)} // 클릭 시 노벨 디테일 페이지로 이동
                >
                  <div className="w-full lg:w-1/3 h-48 mb-3 lg:mb-0">
                    <img
                      src={novel.coverImageUrl || '/cover.jpg'}
                      className="w-full h-full object-cover rounded-lg"
                      style={{ aspectRatio: '3 / 4' }}
                    />
                  </div>
                  <div className="flex flex-col justify-between h-full lg:w-2/3 lg:pl-4">
                    <div>
                      <div className="text-gray-500 text-sm">#{index + 1} 순위</div>
                      <h3 className="text-xl font-semibold text-black mt-2">{novel.title}</h3>
                      <p className="text-md text-gray-700 mt-1">저자: {novel.authorNickname}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {novel.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="bg-gray-200 text-sm text-gray-600 px-2 py-1 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* 신규작 픽 */}
      <main className="container mx-auto p-8">
        <h2 className="text-3xl font-semibold text-left text-black mb-4">따끈따끈 신규 작품!</h2>
        <div className="text-2xl text-left text-gray-500 mb-8">새로운걸 원한다면</div>
        {loadingNewNovels ? (
          <p className="text-center text-gray-500">로딩 중...</p>
        ) : (
          <div className="relative">
            <div className="grid grid-cols-7 gap-6">
              {newNovels.map((novel) => (
                <div
                  key={novel.id}
                  className="bg-white overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/novels/details?id=${novel.novelId}`)}
                >
                  <div className="w-full rounded-xl" style={{ aspectRatio: '5 / 7' }}>
                    <img
                      src={novel.coverImageUrl || 'cover.jpg'}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-black truncate sm:text-lg md:text-xl">{novel.title}</h3>
                    <p className="text-md text-gray-700 mt-2 sm:text-sm md:text-md">{novel.authorNickname}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 하단 */}
      <footer className="bg-white text-center py-6">
        <p className="text-sm text-gray-600">&copy; 2025 픽션홀릭. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
