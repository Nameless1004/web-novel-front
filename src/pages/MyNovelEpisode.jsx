import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRequest } from '../utils/apiHelpers'; // API 호출 헬퍼
import { deleteRequest } from '../utils/apiHelpers';
import { API_URLS } from '../constants/apiUrls'; // API URL 관리

const MyNovelEpisode = () => {
  const { novelId } = useParams(); // URL에서 novelId를 가져옵니다.
  const navigate = useNavigate();
  const [episodes, setEpisodes] = useState([]); // 에피소드 목록 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
  const fetchEpisodes = async () => {
    try {
      const response = await getRequest(
        `${API_URLS.GET_EPISODE(novelId)}?page=${currentPage}&size=10`
      );
      if (response.statusCode === 200) {
        setEpisodes(response.data.content); // 에피소드 목록
        setTotalPages(response.data.totalPages); // 총 페이지 수
      }
    } catch (error) {
      console.error("에피소드 목록을 가져오는 데 실패했습니다.", error);
    }
  };
  
  useEffect(() => {
    fetchEpisodes();
  }, [novelId, currentPage]);

  // 에피소드 작성 페이지로 이동
  const handleCreateEpisode = () => {
    navigate(`/mynovels/${novelId}/episodes/create`);
  };

  // 에피소드 수정 페이지로 이동
  const handleEditEpisode = (episodeId) => {
    navigate(`/mynovels/${novelId}/episodes/edit/${episodeId}`);
  };

  // 에피소드 삭제
  const handleDeleteEpisode = async (episodeId) => {
    try {
      // 삭제 요청 API 호출
      const response = await deleteRequest(`${API_URLS.DELETE_EPISODE(novelId, episodeId)}`);
      if (response.statusCode === 200) {
        alert("에피소드가 삭제되었습니다.");
        // 삭제 후 목록 다시 가져오기
        fetchEpisodes(); // 최신 목록을 다시 불러옵니다.
      }
    } catch (error) {
      console.error("에피소드 삭제 오류:", error);
      alert("에피소드를 삭제하는 데 오류가 발생했습니다.");
    }
  };

  // 페이지 변경 처리
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container mx-auto p-8 bg-gray-50 rounded-lg shadow-xl max-w-4xl">
      <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">에피소드 관리</h1>

      {/* 에피소드 목록 */}
      {episodes.length === 0 ? (
        <div className="text-center text-gray-500">
          등록된 에피소드가 없습니다.
          <button
            onClick={handleCreateEpisode}
            className="ml-4 bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-700 transition duration-300"
          >
            지금 등록하기
          </button>
        </div>
      ) : (
        <div>
          <table className="min-w-full table-auto border-collapse border border-gray-200 mb-6">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-4 text-left font-medium text-gray-700">에피소드 번호</th>
                <th className="border p-4 text-left font-medium text-gray-700">제목</th>
                <th className="border p-4 text-left font-medium text-gray-700">작성일</th>
                <th className="border p-4 text-left font-medium text-gray-700">수정/삭제</th>
              </tr>
            </thead>
            <tbody>
              {episodes.map((episode) => (
                <tr key={episode.id} className="hover:bg-gray-100">
                  <td className="border p-4">{episode.episodeNumber}</td>
                  <td className="border p-4">{episode.title}</td>
                  <td className="border p-4">{episode.createdAt}</td>
                  <td className="border p-4">
                    <button
                      onClick={() => handleEditEpisode(episode.id)}
                      className="bg-yellow-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-yellow-600 transition duration-300 mr-3"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteEpisode(episode.id)}
                      className="bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-600 transition duration-300"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 페이지네이션 */}
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300 disabled:bg-gray-200"
            >
              이전
            </button>
            <span className="self-center text-gray-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300 disabled:bg-gray-200"
            >
              다음
            </button>
          </div>

          {/* 에피소드 작성 버튼 */}
          <div className="mt-6 text-center">
            <button
              onClick={handleCreateEpisode}
              className="bg-blue-600 text-white py-3 px-6 rounded-md shadow-md hover:bg-blue-700 transition duration-300"
            >
              에피소드 작성
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyNovelEpisode;
