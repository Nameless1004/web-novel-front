import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getRequest, postRequest, deleteRequest, patchRequest } from "../../utils/apiHelpers";
import { API_URLS } from "../../constants/apiUrls";
import { motion, AnimatePresence } from 'framer-motion';
import { ClipLoader } from "react-spinners";
import { FaHome } from 'react-icons/fa';
import { Eye, Heart, MessageCircle } from "lucide-react";
import useAuthStore from "../../store/authStore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EpisodeViewer = () => {
  const { episodeId } = useParams();
  const navigate = useNavigate();
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [novelId, setNovelId] = useState(0);
  const [recommendationCount, setRecommendationCount] = useState(0);
  const userId = Number(useAuthStore().userId);

  // 상태 추가: 커버 이미지 접기
  const [isCoverImageVisible, setIsCoverImageVisible] = useState(true);

  const fetchEpisodeDetails = async () => {
    try {
      setLoading(true);
      const response = await getRequest(API_URLS.GET_EPISODE_DETAILS(episodeId));
      setEpisode(response.data);
      setNovelId(response.data.novelId);
      setRecommendationCount(response.data.recommendationCount);
      await patchRequest(API_URLS.INCREASE_VIEW(episodeId))
    } catch (err) {
      setError("회차 정보를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    const response = await getRequest(API_URLS.GET_COMMENTS(novelId, episodeId));
    setComments(response.data);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      await postRequest(API_URLS.CREATE_COMMENT(novelId, episodeId), { content: commentContent });
      setCommentContent("");
      fetchComments();
      toast.success("댓글이 성공적으로 작성되었습니다!"); // Success Toast
    } catch (err) {
      toast.error("댓글 작성에 실패했습니다."); // Error Toast
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteRequest(API_URLS.DELETE_COMMENT(novelId, episodeId, commentId));
      fetchComments(); // Refresh comments after deletion
      toast.success("댓글이 삭제되었습니다."); // Success Toast
    } catch (err) {
      toast.error("댓글 삭제에 실패했습니다."); // Error Toast
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    try {
      await patchRequest(API_URLS.UPDATE_COMMENT(novelId, episodeId, commentId), { content: newContent });
      fetchComments(); // Refresh comments after editing
      toast.success("댓글이 수정되었습니다."); // Success Toast
    } catch (err) {
      toast.error("댓글 수정에 실패했습니다."); // Error Toast
    }
  };

  const handleRecommend = async () => {
    const response = await patchRequest(API_URLS.INCREASE_RECOMMENDATION(episodeId));

    if (response.data != null && response.data.recommendationCount != null) {
      setRecommendationCount(response.data.recommendationCount);
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 1000); // 1초 후 하트 숨기기
    }
  };

  const [showHeart, setShowHeart] = useState(false);

  useEffect(() => {
    fetchEpisodeDetails();
    fetchComments();
  }, [episodeId]);

  const goToPreviousEpisode = () => {
    if (episode?.prevEpisodeId) {
      navigate(`/viewer/${episode.prevEpisodeId}`);
    }
  };

  const goToNextEpisode = () => {
    if (episode?.nextEpisodeId) {
      navigate(`/viewer/${episode.nextEpisodeId}`);
    }
  };

  const goBack = () => {
    navigate(`/novels/details?id=${novelId}`); // 홈으로 이동
  };

  // 커버 이미지 접기/펼치기 함수
  const toggleCoverImage = () => {
    setIsCoverImageVisible(!isCoverImageVisible);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#4A90E2" loading={true} size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      {/* 홈 버튼 추가 */}
      <motion.button onClick={goBack} className="flex flex-col items-center" whileHover={{ scale: 1.1 }}>
        <FaHome className="w-6 h-6 mb-2" />
      </motion.button>

      <div className="mb-8">
        <h1 className="text-gray-800 text-2xl font-bold">{`EP${episode.episodeNumber}. ${episode.title}`}</h1>
        <div className="flex items-center gap-4 text-gray-600 mt-2">
          <span className="flex items-center gap-1">
            <Eye className="w-5 h-5" />
            {episode.viewCount} 조회
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-5 h-5" />
            {recommendationCount}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-5 h-5" />
            {episode.commentCount} 댓글
          </span>
        </div>
        <div className="border-2 border-gray-200 mt-2 border-b"></div>
      </div>
      {/* 커버 이미지 */}
      {isCoverImageVisible && (
        <div className="mb-8 flex justify-center">
          <img
            src={episode.coverImageUrl}
            alt="Cover"
            className="h-[720px] w-auto object-contain aspect-[3/4] max-w-full"
          />
        </div>
      )}

      {/* 커버 이미지 접기/펼치기 버튼 */}
      <div className="flex justify-center mb-6">
        <button
          onClick={toggleCoverImage}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg"
        >
          {isCoverImageVisible ? "커버 이미지 접기" : "커버 이미지 펼치기"}
        </button>
      </div>



      <div className="mb-8">
        <div className="text-xl p-4 border rounded-lg bg-white leading-relaxed text-black whitespace-pre-wrap">
          {episode.content.split("\n").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </div>
      </div>

      {episode.authorReview && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">작가의 한 마디</h2>
          <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg text-gray-800">
            {episode.authorReview.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <div className="relative flex justify-between mt-8 items-center">
        <button
          onClick={goToPreviousEpisode}
          disabled={!episode.prevEpisodeId}
          className={`px-4 py-2 bg-gray-200 rounded ${!episode.prevEpisodeId ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          이전 회차
        </button>

        <motion.button
          onClick={handleRecommend}
          className="flex items-center relative px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          whileHover={{ scale: 1.1 }}
        >
          <Heart className="w-5 h-5 mr-2" />
          {recommendationCount}

          {/* 하트 애니메이션 */}
          <AnimatePresence>
            {showHeart && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 0 }}
                animate={{ opacity: 1, scale: 1.2, y: -50 }}
                exit={{ opacity: 0, scale: 0.8, y: -80 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <Heart className="w-8 h-8 text-red-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
        <button
          onClick={goToNextEpisode}
          disabled={!episode.nextEpisodeId}
          className={`px-4 py-2 bg-gray-200 rounded ${!episode.nextEpisodeId ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          다음 회차
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">댓글 작성</h2>
        <form onSubmit={handleCommentSubmit} className="flex flex-col gap-4">
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="댓글을 입력하세요..."
            rows="4"
            className="p-2 border rounded-lg bg-white"
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
            댓글 작성
          </button>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">댓글</h2>
        {comments.length > 0 ? (
          <div>
            {comments.map((comment) => (
              <div key={comment.id} className="mb-4 p-4 border rounded-lg bg-white shadow-sm">
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{comment.authorUserName}</span>
                  <span>{new Date(comment.commentedAt).toLocaleString()}</span>
                </div>
                <p className="mt-2">{comment.content}</p>
                {
                  comment.userId === userId && (
                    <div className="mt-2 flex space-x-2">
                      <button
                        onClick={() => handleEditComment(comment.id, prompt('Edit comment:', comment.content))}
                        className="text-blue-500"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-500"
                      >
                        삭제
                      </button>
                    </div>
                  )}
              </div>
            ))}
          </div>
        ) : (
          <p>댓글이 아직 없습니다.</p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default EpisodeViewer;
