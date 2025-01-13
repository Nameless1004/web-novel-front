import { API_URLS } from '../constants/apiUrls'; // API URL 관리
import { getRequest, patchFormRequest } from '../utils/apiHelpers';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Autocomplete, TextField, Chip } from '@mui/material'; // MUI 컴포넌트 임포트
const NovelPatch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const novelId = new URLSearchParams(location.search).get('id'); // 쿼리 파라미터에서 novelId를 가져옴
  const [title, setTitle] = useState(""); // 작품명
  const [synopsis, setSynopsis] = useState(""); // 작품 소개
  const [selectedTags, setSelectedTags] = useState([]); // 선택한 태그 (배열로 변경)
  const [tags, setTags] = useState([]); // 서버에서 가져온 태그들
  const [status, setStatus] = useState(""); // 작품 상태
  const [cover, setCover] = useState(null); // 커버 이미지
  const [coverPreview, setCoverPreview] = useState(null); // 커버 이미지 미리보기

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

    // 처음 컴포넌트가 마운트될 때만 호출
    fetchTags();
  }, []); // 빈 배열을 넣어서 컴포넌트가 처음 렌더링될 때만 실행되도록 함

  useEffect(() => {
    if (tags.length === 0) return; // tags가 비어 있으면 실행하지 않음

    const fetchNovelDetails = async () => {
      try {
        const response = await getRequest(`${API_URLS.GET_NOVEL_DETAILS(novelId)}`);
        if (response.statusCode === 200) {
          const { title, synopsis, tags: tag, status, coverImageUrl: cover } = response.data;
          setTitle(title);
          setSynopsis(synopsis);
          setStatus(status); // 상태 값 그대로 설정
          // 다중 선택된 태그들 설정 (태그 배열로 설정)
          if (tag && tag.length > 0) {
            const filtered = tag.map((selectedTag) => {
              const matchingTag = tags.find(t => t.name === selectedTag); // 태그 이름을 기준으로 일치하는 것 찾기
              return matchingTag ? { value: matchingTag.id, label: matchingTag.name } : null;
            }).filter(tag => tag !== null); // null 값 제거
            setSelectedTags(filtered);
          } else {
            setSelectedTags([]); // 태그가 없으면 빈 배열로 초기화
          }

          if (cover) {
            setCoverPreview(cover); // 기존 커버 이미지 미리보기 설정
          }
        }
      } catch (error) {
        console.error("소설 상세 정보를 가져오는 데 실패했습니다:", error);
      }
    };
    console.log(status)
    fetchNovelDetails();
  }, [novelId, tags]); // novelId나 tags가 변경될 때마다 실행

  // 작품 수정 폼 제출 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 동작 방지

    // 상태와 태그가 선택되지 않았다면 알림을 띄우고 제출 방지
    if (!status) {
      alert("작품 상태를 선택해주세요.");
      return;
    }
    if (selectedTags.length === 0) {
      alert("분류 태그를 선택해주세요.");
      return;
    }

    // 폼 데이터 준비
    const formData = new FormData();
    formData.append("title", title);
    formData.append("synopsis", synopsis);
    formData.append("status", status);
    selectedTags.forEach(tag => formData.append("tagIds", tag.value));

    // 커버 이미지가 선택된 경우, 폼 데이터에 추가
    if (cover) {
      formData.append("cover", cover);
    }

    const response = await patchFormRequest(`${API_URLS.UPDATE_NOVEL(novelId)}`, formData);
    if (response.statusCode === 200) {
      alert("작품이 성공적으로 수정되었습니다!");
      navigate(`/mynovels`); // 수정 후 목록으로 이동
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
    setStatus(statusKey); // 하나의 상태만 설정
  };

  // 커버 이미지 업로드 핸들러
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    setCover(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result); // 이미지 미리보기 설정
      };
      reader.readAsDataURL(file); // 이미지 파일을 Data URL로 읽음
    } else {
      setCoverPreview(null); // 파일이 없으면 미리보기 제거
    }
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
          <Autocomplete
            multiple
            id="tags"
            options={tagOptions}
            value={selectedTags}
            onChange={(event, newValue) => setSelectedTags(newValue)}
            getOptionLabel={(option) => option.label}
            isOptionDisabled={(option) => selectedTags.some(tag => tag.value === option.value)} // 이미 선택된 태그는 비활성화
            renderInput={(params) => <TextField {...params} label="태그를 선택하세요" />}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option.label} {...getTagProps({ index })} key={option.value} />
              ))
            }
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
                type="radio"
                checked={status === 'PUBLISHING'}
                onChange={() => handleStatusChange('PUBLISHING')}
                id="PUBLISHING"
                className="mr-2"
              />
              <label htmlFor="PUBLISHING" className="text-gray-700">연재중</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                checked={status === 'ON_HOLD'}
                onChange={() => handleStatusChange('ON_HOLD')}
                id="ON_HOLD"
                className="mr-2"
              />
              <label htmlFor="ON_HOLD" className="text-gray-700">휴재중</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                checked={status === 'FINISHED'}
                onChange={() => handleStatusChange('FINISHED')}
                id="FINISHED"
                className="mr-2"
              />
              <label htmlFor="FINISHED" className="text-gray-700">완결</label>
            </div>
          </div>
        </div>

        {/* 커버 이미지 미리보기 및 업로드 */}
        <div className="mb-6">
          <label htmlFor="cover" className="block text-lg font-medium text-gray-700">커버 이미지</label>
          <div className="flex items-center space-x-4">
            {coverPreview && (
              <div>
                <img src={coverPreview} alt="Cover Preview" className="w-24 h-24 object-cover rounded-md" />
                <button
                  type="button"
                  onClick={() => setCoverPreview(null)} // 커버 이미지 제거
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