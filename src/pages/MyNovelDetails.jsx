import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRequest } from '../utils/apiHelpers';  // getRequest 함수 import
import { API_URLS } from '../constants/apiUrls';  // API_URLS 경로 import
import { ClipLoader } from 'react-spinners';  // 로딩 스피너 컴포넌트 import

const MyNovelDetails = () => {
    const [novel, setNovel] = useState(null); // 소설 상세 정보를 저장할 상태
    const [loading, setLoading] = useState(false); // 로딩 상태
    const location = useLocation();
    const navigate = useNavigate(); // useNavigate 훅 추가

    // 쿼리 파라미터에서 novelId를 추출
    const queryParams = new URLSearchParams(location.search);
    const novelId = queryParams.get('id');

    // 소설 상세 정보 가져오기
    const fetchNovelDetails = async () => {
        setLoading(true); // 로딩 시작
        try {
            const response = await getRequest(`${API_URLS.GET_NOVEL_DETAILS(novelId)}`);
            if (response.statusCode === 200) {
                setNovel(response.data); // 소설 상세 정보 저장
            }
        } catch (error) {
            console.error("소설 상세 정보를 가져오는 데 실패했습니다:", error);
        } finally {
            setLoading(false); // 로딩 끝
        }
    };

    // 컴포넌트가 마운트될 때 소설 정보를 가져옴
    useEffect(() => {
        if (novelId) {
            fetchNovelDetails();
        }
    }, [novelId]);

    // 수정 버튼 클릭 시 /publishing/update로 네비게이션
    const handleUpdateClick = () => {
        navigate(`/publishing/update?id=${novelId}`);
    };

    // 에피소드 버튼 클릭 시 /mynovel/{novelId}/episodes로 네비게이션
    const handleEpisodesClick = () => {
        navigate(`/mynovels/${novelId}/episodes`);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <ClipLoader color="#6B46C1" loading={loading} size={50} />
                </div>
            ) : novel ? (
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">{novel.title}</h1>
                    <p className="text-gray-600 mb-4 text-xl font-medium">{novel.authorNickname}</p>
                    <p className="text-gray-500 mb-4">{novel.synopsis}</p>

                    <div className="bg-gray-100 p-4 rounded-lg mb-6">
                        <p className="text-lg font-semibold">통계</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <p className="font-semibold">구독자 수: <span className="text-purple-600">{novel.totalSubscriberCount}</span></p>
                            <p className="font-semibold">추천 수: <span className="text-purple-600">{novel.totalRecommendationCount}</span></p>
                            <p className="font-semibold">조회 수: <span className="text-purple-600">{novel.totalViewCount}</span></p>
                            <p className="font-semibold">에피소드 수: <span className="text-purple-600">{novel.totalEpisodeCount}</span></p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="font-semibold text-lg">태그</p>
                        <div className="flex flex-wrap mt-2">
                            {novel.tags.map((tag, index) => (
                                <span key={index} className="text-xs text-purple-600 bg-purple-100 rounded-full px-3 py-1 mr-2 mb-2">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* 버튼들 추가 */}
                    <div className="flex justify-between mt-6">
                        <button
                            onClick={handleUpdateClick}
                            className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 focus:outline-none"
                        >
                            수정하기
                        </button>
                        <button
                            onClick={handleEpisodesClick}
                            className="px-6 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 focus:outline-none"
                        >
                            에피소드 관리
                        </button>
                    </div>

                    {/* 추가적인 소설 상세 정보 여기에 추가 */}
                </div>
            ) : (
                <p className="text-gray-500">소설 정보를 찾을 수 없습니다.</p>
            )}
        </div>
    );
};

export default MyNovelDetails;
