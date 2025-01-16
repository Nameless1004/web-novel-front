import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore'; // Zustand store
import { getRequest } from '../utils/apiHelpers';
import { API_URLS } from '../constants/apiUrls';
import { FaTimes } from 'react-icons/fa'; // FaTimes 아이콘 추가

const ProfilePopup = ({ isOpen, onClose }) => {
  const { accessToken, clearInfo } = useAuthStore();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (isOpen && accessToken) {
        const response = await getRequest(`${API_URLS.USER_PROFILE}`);
        setProfileData(response.data);
      }
    };

    fetchProfileData();
  }, [isOpen, accessToken]);

  const handleLogout = () => {
    clearInfo(); // 로그아웃 처리
    onClose(); // 팝업 닫기
  };

  const navigate = useNavigate();

  return (
    isOpen && (
      <div className="fixed top-16 right-6 w-72 bg-white shadow-lg rounded-lg p-6 z-50">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        {accessToken ? (
          <div>
            <div className="flex items-center space-x-4">
              <img
                src="https://via.placeholder.com/50"
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
            onClick={() => navigate('/')}
            className="block w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none"
          >
            로그인
          </button>
        )}
      </div>
    )
  );
};

export default ProfilePopup;
