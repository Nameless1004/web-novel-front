import { useState } from 'react';
import { postRequest } from '../utils/apiHelpers'; // API 요청 헬퍼
import { useNavigate, useParams } from 'react-router-dom';
import { API_URLS } from '../constants/apiUrls'; // API URL 관리

const EpisodeCreate = () => {
  const { novelId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState(''); // 에피소드 제목
  const [authorReview, setAuthorReview] = useState(''); // 작가 리뷰
  const [content, setContent] = useState(''); // 에피소드 내용
  const [error, setError] = useState(null); // 에러 메시지

  // 에피소드 등록 함수
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 필수 필드 확인
    if (!title || !content) {
      setError('제목과 내용은 필수 항목입니다.');
      return;
    }

    // 요청 데이터 준비
    const requestData = {
      title,
      authorReview,
      content,
    };

    try {
      const response = await postRequest(`${API_URLS.CREATE_EPISODE(novelId)}`, JSON.stringify(requestData));
      if (response.statusCode === 201) {
        alert('에피소드가 성공적으로 등록되었습니다!');
        navigate(`/mynovels/${novelId}/episodes`);
      } else {
        alert('에피소드 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('에피소드 등록 오류:', error);
      alert('에피소드 등록에 오류가 발생했습니다.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">에피소드 작성</h1>

      <form onSubmit={handleSubmit}>
        {/* 에피소드 제목 */}
        <div className="mb-6">
          <label htmlFor="title" className="text-lg font-semibold text-gray-700">제목</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 p-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            placeholder="에피소드 제목을 입력해주세요"
            required
          />
        </div>

        {/* 작가 리뷰 */}
        <div className="mb-6">
          <label htmlFor="authorReview" className="text-lg font-semibold text-gray-700">작가의 리뷰</label>
          <textarea
            id="authorReview"
            value={authorReview}
            onChange={(e) => setAuthorReview(e.target.value)}
            className="mt-2 p-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            placeholder="작가의 리뷰를 작성해주세요 (선택 사항)"
          />
        </div>

        {/* 에피소드 내용 */}
        <div className="mb-6">
          <label htmlFor="content" className="text-lg font-semibold text-gray-700">내용</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-2 p-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            placeholder="에피소드 내용을 작성해주세요"
            required
          />
        </div>

        {/* 에러 메시지 */}
        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

        {/* 제출 버튼 */}
        <div className="flex justify-between items-center mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-lg font-semibold"
          >
            에피소드 등록
          </button>
          {/* 취소 버튼 */}
          <button
            type="button"
            onClick={() => navigate(`/mynovels/${novelId}/episodes`)}
            className="bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors duration-300 text-lg font-semibold"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default EpisodeCreate;
