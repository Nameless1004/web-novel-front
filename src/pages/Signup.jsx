import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postRequest, getRequest } from '../utils/apiHelpers'; // Axios 헬퍼 메서드 사용
import { API_URLS } from '../constants/apiUrls'; // API URL 관리
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // 체크, 취소 아이콘 추가

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    nickname: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    username: '',
    nickname: '',
    email: '',
    password: '',
  });
  const [isValid, setIsValid] = useState({
    username: false,
    nickname: false,
    email: false,
    password: false,
    name: true, // 이름은 유효성 검사하지 않으므로 기본적으로 true로 설정
  });
  const [loading, setLoading] = useState({
    username: false,
    nickname: false,
    email: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // 입력값 변경 처리
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // 중복 체크 함수
  const checkDuplication = async (field, value) => {
    if (!value.trim()) {
      setErrors((prev) => ({
        ...prev,
        [field]: `${field === 'username' ? '아이디' : field === 'nickname' ? '닉네임' : '이메일'}을 입력해주세요.`,
      }));
      setIsValid((prev) => ({
        ...prev,
        [field]: false,
      }));
      return;
    }

    setLoading((prev) => ({
      ...prev,
      [field]: true,
    }));

    try {
      let response;
      if (field === 'username') {
        response = await getRequest(`${API_URLS.CHECK_USERNAME}?username=${value}`);
      } else if (field === 'nickname') {
        response = await getRequest(`${API_URLS.CHECK_NICKNAME}?nickname=${value}`);
      } else if (field === 'email') {
        response = await getRequest(`${API_URLS.CHECK_EMAIL}?email=${value}`);
      }

      if (response.data.duplicated) {
        setErrors((prev) => ({
          ...prev,
          [field]: `이미 존재하는 ${field === 'username' ? '아이디' : field === 'nickname' ? '닉네임' : '이메일'}입니다.`,
        }));
        setIsValid((prev) => ({
          ...prev,
          [field]: false,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [field]: `${field === 'username' ? '아이디' : field === 'nickname' ? '닉네임' : '이메일'}은 사용 가능합니다.`,
        }));
        setIsValid((prev) => ({
          ...prev,
          [field]: true,
        }));
      }
    } catch (error) {
      console.error(error);
      setErrors((prev) => ({
        ...prev,
        [field]: `${field === 'username' ? '아이디' : field === 'nickname' ? '닉네임' : '이메일'} 확인 중 오류가 발생했습니다.`,
      }));
    } finally {
      setLoading((prev) => ({
        ...prev,
        [field]: false,
      }));
    }
  };

  // 비밀번호 유효성 검사
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (password && !passwordRegex.test(password)) {
      setErrors((prev) => ({
        ...prev,
        password: '비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.',
      }));
      setIsValid((prev) => ({
        ...prev,
        password: false,
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        password: '',
      }));
      setIsValid((prev) => ({
        ...prev,
        password: true,
      }));
    }
  };

  // 회원가입 처리
  const handleSignup = async (e) => {
    e.preventDefault();

    if (Object.values(isValid).some((valid) => !valid)) {
      alert('모든 중복 확인을 통과해야 회원가입을 진행할 수 있습니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await postRequest(API_URLS.SIGNUP, formData);
      alert('회원가입 성공!');
      navigate('/login'); // 회원가입 성공 시 로그인 페이지로 이동
    } catch (error) {
      console.error(error);
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl">
        <h2 className="text-3xl font-semibold text-purple-700 text-center mb-6">회원가입</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-6">
            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">아이디</label>
            <div className="flex items-center">
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-4 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="아이디를 입력하세요"
                required
                onBlur={() => checkDuplication('username', formData.username)}
              />
              {isValid.username !== null && (
                <div className="ml-2">
                  {isValid.username ? (
                    <FaCheckCircle className="text-green-500" size={20} />
                  ) : (
                    <FaTimesCircle className="text-red-500" size={20} />
                  )}
                </div>
              )}
            </div>
            {errors.username && <p className={`text-sm ${isValid.username ? 'text-green-500' : 'text-red-500'}`}>{errors.username}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">이름</label>
            <div className="flex items-center">
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-4 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="이름을 입력하세요"
                required
              />
              {/* 이름 입력란에 더미 오브젝트 추가하여 너비를 맞춤 */}
              <div className="ml-2 w-5 h-5" />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="nickname" className="block text-gray-700 font-medium mb-2">닉네임</label>
            <div className="flex items-center">
              <input
                type="text"
                id="nickname"
                value={formData.nickname}
                onChange={handleChange}
                className="w-full p-4 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="닉네임을 입력하세요"
                required
                onBlur={() => checkDuplication('nickname', formData.nickname)}
              />
              {isValid.nickname !== null && (
                <div className="ml-2">
                  {isValid.nickname ? (
                    <FaCheckCircle className="text-green-500" size={20} />
                  ) : (
                    <FaTimesCircle className="text-red-500" size={20} />
                  )}
                </div>
              )}
            </div>
            {errors.nickname && <p className={`text-sm ${isValid.nickname ? 'text-green-500' : 'text-red-500'}`}>{errors.nickname}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">이메일</label>
            <div className="flex items-center">
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-4 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="이메일을 입력하세요"
                required
                onBlur={() => checkDuplication('email', formData.email)}
              />
              {isValid.email !== null && (
                <div className="ml-2">
                  {isValid.email ? (
                    <FaCheckCircle className="text-green-500" size={20} />
                  ) : (
                    <FaTimesCircle className="text-red-500" size={20} />
                  )}
                </div>
              )}
            </div>
            {errors.email && <p className={`text-sm ${isValid.email ? 'text-green-500' : 'text-red-500'}`}>{errors.email}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">비밀번호</label>
            <div className="flex items-center">
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => {
                  handleChange(e);
                  validatePassword(e.target.value); // 비밀번호 유효성 검사
                }}
                className="w-full p-4 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="비밀번호를 입력하세요"
                required
              />
              {isValid.password !== null && (
                <div className="ml-2">
                  {isValid.password ? (
                    <FaCheckCircle className="text-green-500" size={20} />
                  ) : (
                    <FaTimesCircle className="text-red-500" size={20} />
                  )}
                </div>
              )}
            </div>
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 focus:outline-none transition duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? '회원가입 중...' : '회원가입'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-purple-600 hover:underline"
            >
              로그인
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
