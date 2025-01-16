import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaBook, FaBell, FaUser, FaSearch  } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ProfilePopup from './ProfilePopup'; // ProfilePopup 컴포넌트 import

const Header = ({ onProfileToggle, isProfileOpen }) => {
  const navigate = useNavigate();

  const handleMyNovels = () => {
    navigate('/mynovels');
  };

  const handleSearch = () => {
    navigate('/novels/search');
  }

  return (  
    <header className="mx-auto p-8">
      <div className="relative top-0 left-0 w-full z-20 bg-white">
        <div className="container mx-auto flex justify-between items-center py-3">
          <img src="/logo-black.png" alt="픽션홀릭 로고" className="w-32 h-auto" />
          <nav className="flex items-center space-x-6">
            <motion.button onClick={() => navigate('/')} className="flex flex-col items-center" whileHover={{ scale: 1.1 }}>
              <FaHome className="w-5 h-5 mb-1" />
              홈
            </motion.button>
            <motion.button onClick={handleMyNovels} className="flex flex-col items-center" whileHover={{ scale: 1.1 }}>
              <FaBook className="w-5 h-5 mb-1" />
              내 작품
            </motion.button>
            {/* <motion.button className="flex flex-col items-center" whileHover={{ scale: 1.1 }}>
              <FaBell className="w-5 h-5 mb-1" />
              알림
            </motion.button> */}
            <motion.button onClick= {handleSearch}className="flex flex-col items-center" whileHover={{ scale: 1.1 }}>
              <FaSearch  className="w-5 h-5 mb-1" />
              검색
            </motion.button>
            <motion.button onClick={onProfileToggle} className="flex flex-col items-center" whileHover={{ scale: 1.1 }}>
              <FaUser className="w-5 h-5 mb-1" />
              프로필
            </motion.button>
          </nav>
        </div>
      </div>

      {/* 프로필 팝업 */}
      <ProfilePopup isOpen={isProfileOpen} onClose={onProfileToggle} />
    </header>
  );
};

export default Header;
