import { API_URLS } from '../constants/apiUrls'; // API URL 관리
import { patchRequest, getRequest } from '../utils/apiHelpers'; 
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Select from 'react-select'; // react-select import

const NovelPatch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const novelId = new URLSearchParams(location.search).get('id'); // 쿼리 파라미터에서 novelId를 가져옴
  const [title, setTitle] = useState(""); // 작품명
  const [synopsis, setSynopsis] = useState(""); // 작품 소개
  const [selectedTags, setSelectedTags] = useState(null); // 선택한 태그
  const [tags, setTags] = useState([]); // 서버에서 가져온 태그들
  const [status, setStatus] = useState({ PUBLISHING: false, ON_HOLD: false, FINISHED: false }); // 작품 상태 (기본값 연재중)

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

    const fetchNovelDetails = async () => {
      try {
        const response = await getRequest(`${API_URLS.GET_NOVEL_DETAILS(novelId)}`);
        if (response.statusCode === 200) {
          const { title, synopsis, tags, status } = response.data;
          setTitle(title);
          setSynopsis(synopsis);
          setStatus({
            PUBLISHING: status === 'PUBLISHING',
            ON_HOLD: status === 'ON_HOLD',
            FINISHED: status === 'FINISHED',
          });
          setSelectedTags(tags.length > 0 ? { value: tags[0].id, label: tags[0].name } : null); // 첫 번째 태그만 선택
        }
      } catch (error) {
        console.error("소설 상세 정보를 가져오는 데 실패했습니다:", error);
      }
    };

    fetchTags();
    fetchNovelDetails();
  }, [novelId]);

  // 작품 수정 폼 제출 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 동작 방지

    // 선택된 상태 찾기
    const selectedStatus = Object.keys(status).find((key) => status[key]);

    // 상태와 태그가 선택되지 않았다면 알림을 띄우고 제출 방지
    if (!selectedStatus) {
      alert("작품 상태를 선택해주세요.");
      return;
    }
    if (!selectedTags) {
      alert("분류 태그를 선택해주세요.");
      return;
    }

    // 제출할 데이터 준비
    const requestData = {
      title,
      synopsis,
      status: selectedStatus, // 선택된 상태
      tagIds: selectedTags ? [selectedTags.value] : [], // 선택된 태그가 있으면 value를 배열로 담기
    };
        console.log(API_URLS.UPDATE_NOVEL(novelId))
      const response = await patchRequest(`${API_URLS.UPDATE_NOVEL(novelId)}`, JSON.stringify(requestData));
      console.log(response)
      if (response.statusCode === 200) {
        alert("작품이 성공적으로 수정되었습니다!");
        navigate(`/mynovels`);
      } else {
        alert("작품 수정에 실패했습니다.");
      }
  };

  // 태그 변환: react-select에 맞게 { value, label } 형태로 변환
  const tagOptions = tags.map(tag => ({
    value: tag.id,
    label: tag.name,
  }));

  // 취소 버튼 핸들러
  const handleCancel = () => {
    navigate(`/mynovels/details?id=${novelId}`); // 취소 시 /mynovels로 이동
  };

  // 상태 변경 핸들러
  const handleStatusChange = (statusKey) => {
    setStatus((prevStatus) => ({
      PUBLISHING: statusKey === 'PUBLISHING' ? !prevStatus.PUBLISHING : prevStatus.PUBLISHING,
      ON_HOLD: statusKey === 'ON_HOLD' ? !prevStatus.ON_HOLD : prevStatus.ON_HOLD,
      FINISHED: statusKey === 'FINISHED' ? !prevStatus.FINISHED : prevStatus.FINISHED,
    }));
  };

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-xl max-w-lg">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">작품 수정</h1>

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

        {/* 작품 상태 선택 */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700">작품 상태</label>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={status.PUBLISHING}
                onChange={() => handleStatusChange('PUBLISHING')}
                id="PUBLISHING"
                className="mr-2"
              />
              <label htmlFor="PUBLISHING" className="text-gray-700">연재중</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={status.ON_HOLD}
                onChange={() => handleStatusChange('ON_HOLD')}
                id="ON_HOLD"
                className="mr-2"
              />
              <label htmlFor="ON_HOLD" className="text-gray-700">휴재중</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={status.FINISHED}
                onChange={() => handleStatusChange('FINISHED')}
                id="FINISHED"
                className="mr-2"
              />
              <label htmlFor="FINISHED" className="text-gray-700">완결</label>
            </div>
          </div>
        </div>

        {/* 작품 수정 버튼 */}
        <div className="flex justify-between items-center mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300"
          >
            작품 수정
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

export default NovelPatch;
