import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore'; // Zustand store
import { getRequest } from '../utils/apiHelpers';
import { API_URLS } from '../constants/apiUrls';

const ProfilePopup = ({ isOpen, onClose }) => {
  const { accessToken, clearInfo } = useAuthStore();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const popupRef = useRef(null); // Popup DOM 참조
  const navigate = useNavigate();

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose(); // 팝업 닫기
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // 프로필 데이터 로드
  useEffect(() => {
    const fetchProfileData = async () => {
      if (isOpen && accessToken) {
        setLoading(true);
        setError(null);
        try {
          const response = await getRequest(`${API_URLS.USER_PROFILE}`);
          setProfileData(response.data);
        } catch (err) {
          setError('프로필 정보를 가져오는 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfileData();
  }, [isOpen, accessToken]);

  // 로그아웃 처리
  const handleLogout = () => {
    clearInfo();
    onClose();
  };

  // 로그인 페이지로 이동
  const handleLogin = () => {
    navigate('/');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={popupRef}
      className="fixed top-16 right-6 w-72 bg-white shadow-lg rounded-lg p-6 z-50"
    >
      {loading && <p className="text-center text-gray-500">로딩 중...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          {accessToken ? (
            <div>
              <div className="flex items-center space-x-4">
                <img
                  src={profileData?.profileImage || 'https://via.placeholder.com/50'}
                  alt="프로필 이미지"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="text-lg font-semibold text-black">{profileData?.nickname}</p>
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
              onClick={handleLogin}
              className="block w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none"
            >
              로그인
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ProfilePopup;
