import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRequest } from '../utils/apiHelpers';
import { API_URLS } from '../constants/apiUrls';
import { ClipLoader } from 'react-spinners';
import { FiArrowLeft } from 'react-icons/fi'; // React Icons에서 뒤로가기 아이콘 추가
import { AiOutlinePlus } from 'react-icons/ai'; // 추가 버튼 아이콘

const MyNovel = () => {
    const [activeTab, setActiveTab] = useState('내작품');
    const [myNovels, setMyNovels] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const tabs = ["내작품", "후원관리", "작품통계", "정산"];

    const fetchNovels = async () => {
        setLoading(true);
        try {
            const response = await getRequest(`${API_URLS.GET_NOVEL}?page=${page}&size=10`);
            if (response.statusCode === 200) {
                setMyNovels(response.data.content);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error("작품 목록을 가져오는 데 실패했습니다:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNovels();
    }, [page]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleNovelClick = (novelId) => {
        navigate(`/mynovels/details?id=${novelId}`);
    };

    const handleGoBack = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 p-8">
            {/* 뒤로가기 버튼 */}
            <div className="flex items-center mb-6">
                <button
                    onClick={handleGoBack}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-900 focus:outline-none transition duration-300"
                >
                    <FiArrowLeft size={30} />
                </button>
            </div>

            {/* 제목 */}
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">내 작품</h1>

            {/* 탭 메뉴 */}
            <div className="flex justify-center border-b border-gray-300 mb-8">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => handleTabClick(tab)}
                        className={`px-6 py-3 font-semibold text-gray-600 ${
                            activeTab === tab
                                ? 'border-b-4 border-purple-600 text-purple-600'
                                : 'hover:text-purple-600'
                        } transition duration-300`}
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
                        <div className="flex flex-col items-center justify-center h-64 border border-gray-300 bg-white rounded-lg shadow-md">
                            <p className="text-gray-500 text-sm">등록된 작품이 없습니다.</p>
                            <button
                                className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-full flex items-center gap-2 shadow-lg hover:bg-purple-700 focus:outline-none transition duration-300"
                                onClick={() => navigate('/publishing/new')}
                            >
                                <AiOutlinePlus size={18} />
                                신규 작품 등록
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* 작품 목록 렌더링 */}
                            {myNovels.map((novel) => (
                                <div
                                    key={novel.novelId}
                                    className="p-6 border border-gray-200 bg-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 cursor-pointer"
                                    onClick={() => handleNovelClick(novel.novelId)}
                                >
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{novel.title}</h3>
                                    <p className="text-sm text-gray-600 mb-4">작성자: {novel.authorNickname}</p>
                                    <div className="flex flex-wrap">
                                        {novel.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="text-xs text-purple-600 bg-purple-100 rounded-full px-2 py-1 mr-2 mb-2"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 페이지네이션 */}
                    <div className="flex justify-center items-center mt-8">
                        <button
                            onClick={() => setPage(Math.max(page - 1, 1))}
                            className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition duration-300"
                            disabled={page === 1}
                        >
                            이전
                        </button>
                        <span className="text-gray-600 mx-4">페이지 {page} / {totalPages}</span>
                        <button
                            onClick={() => setPage(Math.min(page + 1, totalPages))}
                            className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition duration-300"
                            disabled={page === totalPages}
                        >
                            다음
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyNovel;
