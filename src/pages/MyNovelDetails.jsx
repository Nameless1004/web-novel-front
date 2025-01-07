import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRequest, deleteRequest } from '../utils/apiHelpers'; // deleteRequest 추가
import { API_URLS } from '../constants/apiUrls';
import { ClipLoader } from 'react-spinners';
import { FiArrowLeft } from 'react-icons/fi'; // 뒤로가기 아이콘
import { FaEdit, FaList, FaTrash } from 'react-icons/fa'; // 수정, 관리, 삭제 아이콘

const MyNovelDetails = () => {
    const [novel, setNovel] = useState(null);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // URL에서 novelId 추출
    const queryParams = new URLSearchParams(location.search);
    const novelId = queryParams.get('id');

    // 소설 상세 정보 가져오기
    const fetchNovelDetails = async () => {
        setLoading(true);
        try {
            const response = await getRequest(`${API_URLS.GET_NOVEL_DETAILS(novelId)}`);
            if (response.statusCode === 200) {
                setNovel(response.data);
            }
        } catch (error) {
            console.error("소설 상세 정보를 가져오는 데 실패했습니다:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (novelId) {
            fetchNovelDetails();
        }
    }, [novelId]);

    const handleUpdateClick = () => {
        navigate(`/publishing/update?id=${novelId}`);
    };

    const handleEpisodesClick = () => {
        navigate(`/mynovels/${novelId}/episodes`);
    };

    const handleGoBack = () => {
        navigate('/mynovels');
    };

    const handleDeleteClick = async () => {
        const confirmDelete = window.confirm("정말로 이 소설을 삭제하시겠습니까?");
        if (confirmDelete) {
            try {
                const response = await deleteRequest(`${API_URLS.DELETE_NOVEL(novelId)}`);
                if (response.statusCode === 200) {
                    alert("소설이 성공적으로 삭제되었습니다.");
                    navigate('/mynovels');
                }
            } catch (error) {
                console.error("소설 삭제에 실패했습니다:", error);
                alert("소설 삭제 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 p-8">
            {/* 뒤로가기 버튼 */}
            <div className="flex items-center mb-8">
                <button
                    onClick={handleGoBack}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-full shadow-md hover:bg-gray-900 focus:outline-none transition duration-300"
                >
                    <FiArrowLeft size={30} />
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <ClipLoader color="#6B46C1" loading={loading} size={50} />
                </div>
            ) : novel ? (
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-4">{novel.title}</h1>
                    <p className="text-lg text-gray-600 mb-6">작성자: <span className="font-semibold">{novel.authorNickname}</span></p>
                    <p className="text-gray-600 mb-6">
                        {novel.synopsis.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))}
                    </p>

                    <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-6">
                        <p className="text-lg font-semibold mb-4 text-gray-700">통계 정보</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <p className="text-gray-600">구독자 수: <span className="text-purple-600 font-bold">{novel.totalSubscriberCount}</span></p>
                            <p className="text-gray-600">추천 수: <span className="text-purple-600 font-bold">{novel.totalRecommendationCount}</span></p>
                            <p className="text-gray-600">조회 수: <span className="text-purple-600 font-bold">{novel.totalViewCount}</span></p>
                            <p className="text-gray-600">에피소드 수: <span className="text-purple-600 font-bold">{novel.totalEpisodeCount}</span></p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="font-semibold text-lg text-gray-700 mb-3">태그</p>
                        <div className="flex flex-wrap">
                            {novel.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="text-sm text-purple-700 bg-purple-100 px-3 py-1 rounded-full mr-2 mb-2 shadow-sm"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between mt-8">
                        <button
                            onClick={handleUpdateClick}
                            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none transition duration-300"
                        >
                            <FaEdit />
                            수정하기
                        </button>
                        <button
                            onClick={handleEpisodesClick}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none transition duration-300"
                        >
                            <FaList />
                            에피소드 관리
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none transition duration-300"
                        >
                            <FaTrash />
                            삭제하기
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center mt-16">
                    <p className="text-gray-500 text-lg">소설 정보를 찾을 수 없습니다.</p>
                </div>
            )}
        </div>
    );
};

export default MyNovelDetails;
