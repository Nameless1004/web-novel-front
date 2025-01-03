import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRequest, deleteRequest } from '../utils/apiHelpers';
import { API_URLS } from '../constants/apiUrls';
import { FiArrowLeft, FiEdit, FiTrash2 } from 'react-icons/fi'; // 아이콘 추가

const MyNovelEpisode = () => {
  const { novelId } = useParams();
  const navigate = useNavigate();
  const [episodes, setEpisodes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEpisodes = async () => {
    try {
      const response = await getRequest(
        `${API_URLS.GET_EPISODE(novelId)}?page=${currentPage}&size=10`
      );
      if (response.statusCode === 200) {
        setEpisodes(response.data.content);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('에피소드 목록을 가져오는 데 실패했습니다.', error);
    }
  };

  useEffect(() => {
    fetchEpisodes();
  }, [novelId, currentPage]);

  const handleCreateEpisode = () => {
    navigate(`/mynovels/${novelId}/episodes/create`);
  };

  const handleEditEpisode = (episodeId) => {
    navigate(`/mynovels/${novelId}/episodes/edit/${episodeId}`);
  };

  const handleDeleteEpisode = async (episodeId) => {
    if (!window.confirm('정말 이 에피소드를 삭제하시겠습니까?')) return;
    try {
      const response = await deleteRequest(`${API_URLS.DELETE_EPISODE(novelId, episodeId)}`);
      if (response.statusCode === 200) {
        alert('에피소드가 삭제되었습니다.');
        fetchEpisodes();
      }
    } catch (error) {
      console.error('에피소드 삭제 오류:', error);
      alert('에피소드를 삭제하는 데 오류가 발생했습니다.');
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleGoBack = () => {
    navigate(`/mynovels/details?id=${novelId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">에피소드 관리</h1>
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-full shadow-md hover:bg-gray-800 transition duration-300"
          >
            <FiArrowLeft size={18} />
            <span>뒤로가기</span>
          </button>
        </div>

        {episodes.length === 0 ? (
          <div className="text-center text-gray-500">
            <p className="text-lg">등록된 에피소드가 없습니다.</p>
            <button
              onClick={handleCreateEpisode}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
              에피소드 작성
            </button>
          </div>
        ) : (
          <>
            <table className="w-full border-collapse border border-gray-200">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-4 text-left text-gray-700">번호</th>
                  <th className="border p-4 text-left text-gray-700">제목</th>
                  <th className="border p-4 text-left text-gray-700">작성일</th>
                  <th className="border p-4 text-center text-gray-700">수정/삭제</th>
                </tr>
              </thead>
              <tbody>
                {episodes.map((episode) => (
                  <tr key={episode.id} className="hover:bg-gray-100 transition">
                    <td className="border p-4">{episode.episodeNumber}</td>
                    <td className="border p-4">{episode.title}</td>
                    <td className="border p-4">{episode.createdAt}</td>
                    <td className="border p-4 flex justify-center gap-4">
                      <button
                        onClick={() => handleEditEpisode(episode.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-md shadow-md hover:bg-yellow-600 transition duration-300"
                      >
                        <FiEdit size={18} />
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteEpisode(episode.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition duration-300"
                      >
                        <FiTrash2 size={18} />
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-300 disabled:bg-gray-200"
              >
                이전
              </button>
              <span className="text-gray-700">
                페이지 {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-300 disabled:bg-gray-200"
              >
                다음
              </button>
            </div>

            <div className="text-center mt-8">
              <button
                onClick={handleCreateEpisode}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
              >
                에피소드 작성
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyNovelEpisode;
