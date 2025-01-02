import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRequest } from '../utils/apiHelpers';  // getRequest 함수 import
import { API_URLS } from '../constants/apiUrls';  // API_URLS 경로 import
import { ClipLoader } from 'react-spinners';  // react-spinners에서 ClipLoader import

const MyNovel = () => {
    const [activeTab, setActiveTab] = useState('내작품'); // 현재 선택된 탭 관리
    const [myNovels, setMyNovels] = useState([]); // 작품 목록을 저장할 상태
    const [page, setPage] = useState(1); // 페이지는 1부터 시작
    const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
    const [loading, setLoading] = useState(false); // 로딩 상태
    const navigate = useNavigate();
    
    const tabs = ["내작품", "후원관리", "작품통계", "정산"];

    // 작품 목록을 가져오는 함수
    const fetchNovels = async () => {
        setLoading(true); // 로딩 시작
        try {
            const response = await getRequest(`${API_URLS.GET_NOVEL}?page=${page}&size=10`);  // API에서 0-based index를 사용하므로 page-1로 전달
            if (response.statusCode === 200) {
                setMyNovels(response.data.content); // 작품 목록 저장
                setTotalPages(response.data.totalPages); // 전체 페이지 수 설정
            }
        } catch (error) {
            console.error("작품 목록을 가져오는 데 실패했습니다:", error);
        } finally {
            setLoading(false); // 로딩 끝
        }
    };

    // 페이지가 변경될 때마다 작품 목록을 다시 가져옴
    useEffect(() => {
        fetchNovels();
    }, [page]);

    // 탭 선택
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    // 소설 클릭 시 상세 페이지로 이동
    const handleNovelClick = (novelId) => {
        navigate(`/mynovels/details?id=${novelId}`);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">내 작품</h1>

            {/* 탭 메뉴 */}
            <div className="flex border-b border-gray-300 mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => handleTabClick(tab)}
                        className={`px-4 py-2 font-medium text-gray-600 ${
                            activeTab === tab
                                ? 'border-b-2 border-purple-600 text-purple-600'
                                : 'hover:text-purple-600'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* 탭 내용 */}
            {activeTab === '내작품' && (
                <div>
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <ClipLoader color="#6B46C1" loading={loading} size={50} />
                        </div>
                    ) : myNovels.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 border border-gray-300 bg-white rounded-lg">
                            <p className="text-gray-500 text-sm">등록된 작품이 없습니다.</p>
                            <button
                                className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 focus:outline-none"
                                onClick={() => navigate('/publishing/new')}
                            >
                                신규 작품 등록
                            </button>
                        </div>
                    ) : (
                        <div>
                            {/* 작품 목록 렌더링 */}
                            <ul>
                                {myNovels.map((novel) => (
                                    <li
                                        key={novel.novelId}
                                        className="mb-4 p-4 border border-gray-300 bg-white rounded-lg shadow-sm"
                                        onClick={() => handleNovelClick(novel.novelId)}  // 소설 클릭 시 상세 페이지로 이동
                                    >
                                        <h3 className="text-xl font-semibold text-gray-800">{novel.title}</h3>
                                        <p className="text-sm text-gray-600">작성자: {novel.authorNickname}</p>
                                        <div className="flex flex-wrap mt-2">
                                            {novel.tags.map((tag, index) => (
                                                <span key={index} className="text-xs text-purple-600 bg-purple-100 rounded-full px-2 py-1 mr-2 mb-2">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* 페이지네이션 */}
                            <div className="flex justify-between items-center mt-6">
                                <button
                                    onClick={() => setPage(Math.max(page - 1, 1))}
                                    className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                                    disabled={page === 1}
                                >
                                    이전
                                </button>
                                <span className="text-gray-600">페이지 {page} / {totalPages}</span>
                                <button
                                    onClick={() => setPage(Math.min(page + 1, totalPages))}
                                    className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                                    disabled={page === totalPages}
                                >
                                    다음
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 다른 탭 내용 */}
        </div>
    );
};

export default MyNovel;
