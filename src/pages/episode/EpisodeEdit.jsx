import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRequest, patchRequest } from "../../utils/apiHelpers"; // API 요청 헬퍼
import { API_URLS } from "../../constants/apiUrls"; // API URL 관리
import { FiSave, FiXCircle } from 'react-icons/fi'; // 아이콘 추가

const EpisodeEdit = () => {
  const { novelId, episodeId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState(""); // 에피소드 제목
  const [authorReview, setAuthorReview] = useState(""); // 작가 리뷰
  const [content, setContent] = useState(""); // 에피소드 내용
  const [error, setError] = useState(null); // 에러 메시지

  useEffect(() => {
    const fetchEpisodeDetails = async () => {
        try {
          const response = await getRequest(
            `${API_URLS.GET_EPISODE_DETAILS(novelId, episodeId)}`
          );
          if (response.statusCode === 200) {
            const episode = response.data;
            setTitle(episode.title);
            setAuthorReview(episode.authorReview);
            setContent(episode.content);
          }
        } catch (err) {
          console.error('에피소드 세부 사항을 가져오는 데 실패했습니다.', err);
        }
    };

    fetchEpisodeDetails();
  }, [novelId, episodeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      setError("제목과 내용은 필수 항목입니다.");
      return;
    }

    const requestData = {
      title,
      authorReview,
      content,
    };

    try {
      const response = await patchRequest(
        `${API_URLS.EDIT_EPISODE(novelId, episodeId)}`,
        JSON.stringify(requestData)
      );

      if (response.statusCode === 200) {
        alert("에피소드가 성공적으로 수정되었습니다!");
        navigate(`/mynovels/${novelId}/episodes`);
      } else {
        alert("에피소드 수정에 실패했습니다.");
      }
    } catch (err) {
      console.error("에피소드 수정 오류:", err);
      alert("에피소드 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
          에피소드 수정
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="title"
              className="text-lg font-semibold text-gray-700"
            >
              제목
            </label>
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

          <div className="mb-6">
            <label
              htmlFor="authorReview"
              className="text-lg font-semibold text-gray-700"
            >
              작가의 리뷰
            </label>
            <textarea
              id="authorReview"
              value={authorReview}
              onChange={(e) => setAuthorReview(e.target.value)}
              className="mt-2 p-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              placeholder="작가의 리뷰를 작성해주세요 (선택 사항)"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="content"
              className="text-lg font-semibold text-gray-700"
            >
              내용
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-2 p-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              placeholder="에피소드 내용을 작성해주세요"
              required
            />
          </div>

          {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

          <div className="flex justify-between items-center mt-8">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 text-lg font-semibold"
            >
              <FiSave size={18} />
              수정
            </button>
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

export default EpisodeEdit;
