import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore'; // Zustand store
import Particles from 'react-tsparticles'; // 파티클 효과 라이브러리
import { getRequest } from '../utils/apiHelpers'
import { API_URLS } from '../constants/apiUrls';
import Header from '../components/Header'; // Header 컴포넌트 import

const Home = () => {
  const navigate = useNavigate();
  const { accessToken, clearInfo } = useAuthStore(); // 로그인 상태 가져오기
  const [isProfileOpen, setProfileOpen] = useState(false); // 프로필 팝업 상태
  const [profileData, setProfileData] = useState(null); // 프로필 데이터
  const [hotNovels, setHotNovels] = useState([]); // 인기 소설 데이터
  const [pdNovels, setPdNovels] = useState([]); // PD 추천픽 데이터
  const [novelPickNovels, setNovelPickNovels] = useState([]); // 노벨픽 데이터
  const [newNovels, setNewNovels] = useState([]); // 신규작 픽 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [currentHour, setCurrentHour] = useState(null);
  const [newNovelsPage, setNewNovelsPage] = useState(0); // 신규작 픽 현재 페이지
  const itemsPerPage = 9; // 페이지당 아이템 수

  useEffect(() => {
    // 인기 소설 데이터 불러오기
    if (accessToken == null) {
      navigate("/login")
      return;
    }

    const FetchCurrentTime = async () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0'); // 두 자리로 표시
      setCurrentHour(`${hours}:00`);
    }

    const fetchHotNovels = async () => {
      const response = await getRequest(`${API_URLS.GET_HOT_NOVELS}`, { hour: new Date().getHours(), page: 1, size: 9 });
      setHotNovels(response.data.content || []);
      FetchCurrentTime();
    };

    // 신규작 픽 데이터 불러오기
    const fetchNewNovels = async () => {
      try {
        const response = await getRequest(`${API_URLS.GET_NOVEL}`, { orderby: 'new', direction: 'desc', page: 1, size: 7 });
        setNewNovels(response.data.content || []);
      } catch (error) {
        console.error('Failed to fetch new novels:', error);
      }
    };

    // API 요청을 순차적으로 실행
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchHotNovels(), fetchNewNovels()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (isProfileOpen) {
        const response = await getRequest(`${API_URLS.USER_PROFILE}`);
        setProfileData(response.data);
      }
    };

    fetchProfileData();
  }, [isProfileOpen]);

  const handleLogout = () => {
    clearInfo(); // 로그아웃 처리
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


      {/* 프로필 팝업 */}
      {isProfileOpen && (
        <div className="fixed top-16 right-6 w-72 bg-white shadow-lg rounded-lg p-6 z-50">
          {accessToken ? (
            <div>
              <div className="flex items-center space-x-4">
                <img src="https://via.placeholder.com/50" alt="프로필 이미지" className="w-12 h-12 rounded-full" />
                <div>
                  <p className="text-lg font-semibold text-black">{profileData?.nickname}</p>
                </div>
              </div>
              {/* <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-gray-700">코인</p>
                  <p className="text-lg font-bold">0</p>
                </div>
                <div>
                  <p className="text-gray-700">마일리지</p>
                  <p className="text-lg font-bold">4</p>
                </div>
              </div> */}
              <button onClick={handleLogout} className="block w-full mt-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none">
                로그아웃
              </button>
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className="block w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none">
              로그인
            </button>
          )}
        </div>
      )}
   <main className="container mx-auto p-8">
  <h3 className="text-3xl font-semibold text-left text-black mb-4">인기 작품</h3>
  <div className="text-2xl text-left text-gray-800 mb-8">
      <span className="font-bold"> {currentHour}</span> 기준 픽션홀릭 유저들의 실시간 <span className="text-blue-600 font-semibold">조회수</span> 인기작품
    </div>
  {loading ? (
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
            {/* 왼쪽: 커버 이미지 */}
            <div className="w-full lg:w-1/3 h-48 mb-3 lg:mb-0">
              <img
                src={novel.coverImageUrl || 'default-cover.jpg'} // 커버 이미지 URL
                alt="Cover"
                className="w-full h-full object-cover rounded-lg"
                style={{ aspectRatio: '3 / 4' }} // 3:4 비율로 설정
              />
            </div>

            {/* 오른쪽: 소설 정보 */}
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
        {loading ? (
          <p className="text-center text-gray-500">로딩 중...</p>
        ) : (
          <div className="relative">
            {/* 신규작 목록 */}
            <div className="grid grid-cols-7 gap-6">
              {newNovels.map((novel) => (
                <div
                  key={novel.id}
                  className="bg-white overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/novels/details?id=${novel.novelId}`)} // 클릭 시 노벨 디테일 페이지로 이동
                >
                  {/* 이미지 부분 */}
                  <div className="w-full rounded-xl" style={{ aspectRatio: '5 / 7' }}>
                    <img
                      src={novel.coverImageUrl || 'cover.jpg'} // 기본 이미지 경로
                      className="w-full h-full object-cover rounded-xl"  // 이미지 자체도 라운드 처리
                    />
                  </div>
                  {/* 내용 부분 */}
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
