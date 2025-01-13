import { useState } from 'react';
import { postFormRequest } from '../../utils/apiHelpers'; // API 요청 헬퍼
import { useNavigate, useParams } from 'react-router-dom';
import { API_URLS } from '../../constants/apiUrls'; // API URL 관리
import { FiSave, FiXCircle } from 'react-icons/fi'; // 아이콘 추가

const EpisodeCreate = () => {
  const { novelId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState(''); // 에피소드 제목
  const [authorReview, setAuthorReview] = useState(''); // 작가 리뷰
  const [content, setContent] = useState(''); // 에피소드 내용
  const [cover, setCover] = useState(null); // 커버 이미지
  const [coverPreview, setCoverPreview] = useState(null); // 커버 이미지 미리보기
  const [error, setError] = useState(null); // 에러 메시지

  // 에피소드 등록 함수
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 필수 필드 확인
    if (!title || !content) {
      setError('제목과 내용은 필수 항목입니다.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('authorReview', authorReview);
    formData.append('content', content);

    // 커버 이미지가 있을 경우 추가
    if (cover) {
      formData.append('cover', cover);
    }

    try {
      const response = await postFormRequest(`${API_URLS.CREATE_EPISODE(novelId)}`, formData);
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

  // 커버 이미지 처리 함수
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    setCover(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result); // 이미지 미리보기 설정
      };
      reader.readAsDataURL(file); // 파일을 읽어 Data URL로 변환
    } else {
      setCoverPreview(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
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

          {/* 커버 이미지 업로드 및 미리보기 */}
          <div className="mb-6">
            <label htmlFor="cover" className="text-lg font-semibold text-gray-700">커버 이미지</label>
            <div className="flex items-center space-x-4">
              {coverPreview && (
                <div>
                  <img src={coverPreview} alt="Cover Preview" className="w-24 h-24 object-cover rounded-md" />
                  <button
                    type="button"
                    onClick={() => {
                      setCover(null);
                      setCoverPreview(null); // 커버 이미지 제거
                    }}
                    className="text-red-500 mt-2"
                  >
                    제거
                  </button>
                </div>
              )}
              <input
                id="cover"
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="mt-2"
              />
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

          {/* 제출 버튼 */}
          <div className="flex justify-between items-center mt-8">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 text-lg font-semibold"
            >
              <FiSave size={18} />
              등록
            </button>
            {/* 취소 버튼 */}
            <button
              type="button"
              onClick={() => navigate(`/mynovels/${novelId}/episodes`)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300 text-lg font-semibold"
            >
              <FiXCircle size={18} />
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EpisodeCreate;
