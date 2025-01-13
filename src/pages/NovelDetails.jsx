import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, Heart, Bell, Share, MessageCircle } from 'lucide-react';
import Header from '../components/Header';
import { getRequest } from '../utils/apiHelpers';
import { API_URLS } from '../constants/apiUrls';
import { ClipLoader } from 'react-spinners';
import { format } from 'date-fns'

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const formatDate = (isoDate) => {
    if (!isoDate) return 'Invalid Date';
    const date = new Date(isoDate);
    return format(date, 'yyyy.MM.dd');
}

const NovelDetails = () => {
    const query = useQuery();
    const id = query.get('id');
    const navigate = useNavigate();

    const [isProfileOpen, setProfileOpen] = useState(false);
    const [episodes, setEpisodes] = useState([]);
    const [novelDetails, setNovelDetails] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const MAX_PAGE_SIZE = 20;

    const fetchNovelDetails = async () => {
        const response = await getRequest(API_URLS.GET_NOVEL_DETAILS(id));
        setNovelDetails(response.data);
    };

    const fetchEpisodes = async (p) => {
        setLoading(true)
        const response = await getRequest(API_URLS.GET_EPISODE(id), { page: p, size: MAX_PAGE_SIZE });
        console.log(response)
        setEpisodes(response.data.content);
        setCurrentPage(response.data.pageNumber + 1);
        setTotalPages(response.data.totalPages + 1);
        setLoading(false)
    }

    useEffect(() => {
        fetchNovelDetails();
        fetchEpisodes(currentPage);
    }, [currentPage]);

    if (loading || !novelDetails) {
        return (
            <div className="flex justify-center items-center h-screen">
                <ClipLoader color="#4A90E2" loading={true} size={50} />
            </div>
        );
    }

    const handleShare = async () => {
        try {
            const url = window.location.href;
            await navigator.clipboard.writeText(url);
            alert('URL이 클립보드에 복사되었습니다!');
        } catch (err) {
            console.error('클립보드 복사 실패', err);
        }
    };

    const recommendedNovels = [
        {
            title: '히로인이 되기 전에..',
            tags: ['판타지', '회귀', '환생'],
            isPLUS: true,
            isExclusive: true,
            coverUrl: '/api/placeholder/120/160'
        },
        {
            title: '미소녀 작가랑 같이 방위했다',
            tags: ['로맨스', '일상', '드라마'],
            isPLUS: true,
            isExclusive: true,
            coverUrl: '/api/placeholder/120/160'
        }
    ];

    return (
        <div>
            <Header isProfileOpen={isProfileOpen} onProfileToggle={() => setProfileOpen(!isProfileOpen)} />
            <div className="container mx-auto p-8">
                {/* Header Section */}
                <div className="flex gap-6 mb-8">
                    {/* Novel Cover */}
                    <div className="w-48 h-64 overflow-hidden rounded-lg">
                        <div className="w-48 h-64 overflow-hidden rounded-lg">
                            <img
                                src={novelDetails.coverImageUrl || '/cover.jpg'}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    {/* Novel Info */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-bold">{novelDetails.title}</h1>
                            <div className="flex gap-3">
                                <Share className="w-6 h-6 cursor-pointer" onClick={handleShare} />
                                <Heart className="w-6 h-6 cursor-pointer" onClick={() => alert("준비중입니다.")} />
                                <Bell className="w-6 h-6 cursor-pointer" onClick={() => alert("준비중입니다.")} />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-m text-gray-600 mb-4">
                            <span className="text-black font-bold">작가명</span>
                            <span className="text-blue-600">{novelDetails.authorNickname}</span>
                        </div>

                        <div className="flex gap-6 text-m text-gray-600">
                            <div><span className="text-black font-bold">조회</span> {novelDetails.totalViewCount}</div>
                            <div>총 {novelDetails.totalEpisodeCount}화</div>
                        </div>

                        <div className="flex gap-2 flex-wrap mt-4">
                            {novelDetails.tags.map((tag) => (
                                <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        {/* Synopsis Card */}
                        <div className="p-4 border rounded-lg mb-8 bg-white mt-6">
                            <div className="flex gap-4">
                                <Heart className="w-4 h-4" /> {novelDetails.totalPreferenceCount}
                                <Bell className="w-4 h-4" /> {novelDetails.totalSubscriberCount}
                                <MessageCircle className="w-4 h-4" /> {novelDetails.totalCommentCount}
                            </div>
                            <p className="text-gray-700 mb-4">
                                {novelDetails.synopsis.split('\n').map((line, index) => (
                                    <React.Fragment key={index}>
                                        {line}
                                        <br />
                                    </React.Fragment>
                                ))}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content Area with Chapter List and Recommended Works */}
                <div className="flex gap-8">
                    {/* Chapter List */}
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-4">회차리스트</h2>
                        <div className='border-gray-500 border-b border-2 mb-4' />
                        <div>
                            {episodes.length > 0 ? episodes.map((episode) => (
                                <div
                                    key={episode.id}
                                    className="flex items-start hover:bg-gray-50 cursor-pointer border-b"
                                    onClick={() => navigate(`/viewer/${episode.id}`)}
                                >
                                    <div className="min-w-[50px] text-gray-500 p-2">
                                        <div className="text-sm text-gray-500 bg-gray-100 rounded-full px-3 py-1 flex items-center justify-center">
                                            EP.{episode.episodeNumber}
                                        </div>
                                    </div>
                                    <div className="flex-1 p-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="bg-[#0D9DE9] text-white px-2 py-0.5 rounded text-xs">무료</div>
                                            <span className="font-bold text-xl">{episode.title}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500 gap-4">
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-4 h-4" />
                                                {episode.viewCount}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Heart className="w-4 h-4" />
                                                {episode.recommendationCount}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MessageCircle className="w-4 h-4" />
                                                {episode.commentCount}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-m text-gray-500 p-2 font-bold">
                                        {formatDate(episode.createdAt) || '00.00.00'}
                                    </div>
                                </div>
                            )) : (
                                <p>회차가 없습니다.</p>
                            )}
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-200 rounded mr-4"
                            >
                                이전
                            </button>
                            <span>
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-gray-200 rounded ml-4"
                            >
                                다음
                            </button>
                        </div>
                    </div>
                    {/* Recommended Works Panel */}
                    <div className="w-72">
                        <h2 className="text-2xl font-bold mb-4">추천 작품</h2>
                        <div className="space-y-4">
                            {recommendedNovels.map((novel, index) => (
                                <div key={index} className="border rounded-lg p-3 bg-white">
                                    <div className="flex gap-3">
                                        <img
                                            src={novel.coverImageUrl}
                                            alt={novel.title}
                                            className="w-20 h-28 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-sm mb-2">{novel.title}</h3>
                                            <div className="flex flex-wrap gap-1">
                                                {novel.tags.map((tag, tagIndex) => (
                                                    <span key={tagIndex} className="text-xs px-2 py-1 bg-gray-100 rounded">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex gap-1 mt-2">
                                                {novel.isPLUS && (
                                                    <span className="px-2 py-0.5 bg-purple-600 text-white rounded text-xs">PLUS</span>
                                                )}
                                                {novel.isExclusive && (
                                                    <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-xs">독점</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NovelDetails;