import { API_URLS } from '../constants/apiUrls'; // API URL 관리
import { postRequest, getRequest } from '../utils/apiHelpers'; 
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'; // react-select import

const Publishing = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState(""); // 작품명
  const [synopsis, setSynopsis] = useState(""); // 작품 소개
  const [selectedTags, setSelectedTags] = useState([]); // 선택한 태그 (단일 선택으로 변경)
  const [tags, setTags] = useState([]); // 서버에서 가져온 태그들

  // 서버에서 태그 목록을 가져오는 함수
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await getRequest(API_URLS.TAG);
        setTags(response.data); // 데이터에서 태그 목록을 가져옴
      } catch (error) {
        console.error("태그를 가져오는 데 실패했습니다:", error);
      }
    };

    fetchTags();
  }, []);

  // 작품 등록 폼 제출 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 동작 방지

    // 제출할 데이터 준비
    const requestData = {
      title,
      synopsis,
      tagIds: selectedTags && selectedTags.length > 0 ? selectedTags.map(tag => tag.value) : [], 
    };

    try {
      const response = await postRequest(API_URLS.CREATE_NOVEL, JSON.stringify(requestData));
      if (response.statusCode === 201) {
        alert("작품이 성공적으로 등록되었습니다!");
        setTitle("");
        setSynopsis("");
        setSelectedTags([]); // 초기화
        navigate("/mynovels");
      } else {
        alert("작품 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("작품 등록 오류:", error);
      alert("작품 등록에 오류가 발생했습니다.");
    }
  };

  // 태그 변환: react-select에 맞게 { value, label } 형태로 변환
  const tagOptions = tags.map(tag => ({
    value: tag.id,
    label: tag.name,
  }));

  // 취소 버튼 핸들러
  const handleCancel = () => {
    navigate("/mynovels"); // 취소 시 /mynovels로 이동
  };

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-xl max-w-lg">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">작품 등록</h1>

      <form onSubmit={handleSubmit}>
        {/* 작품명 입력 */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-lg font-medium text-gray-700">작품명</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 p-3 border-2 border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* 태그 선택 */}
        <div className="mb-6">
          <label htmlFor="tags" className="block text-lg font-medium text-gray-700">분류 태그</label>
          <Select
            id="tags"
            options={tagOptions}
            isMulti
            value={selectedTags}
            onChange={(selected) => setSelectedTags(selected)} // 한 개의 태그 선택
            className="mt-2"
            placeholder="태그를 선택하세요"
            classNamePrefix="react-select"
          />
        </div>

        {/* 작품 소개 입력 */}
        <div className="mb-6">
          <label htmlFor="synopsis" className="block text-lg font-medium text-gray-700">작품 소개</label>
          <textarea
            id="synopsis"
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            className="mt-2 p-3 border-2 border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="작품에 대한 간단한 소개를 작성해주세요."
          />
        </div>

        {/* 작품 등록 버튼 */}
        <div className="flex justify-between items-center mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300"
          >
            작품 등록
          </button>
          {/* 취소 버튼 */}
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-gray-600 transition-colors duration-300"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default Publishing;
