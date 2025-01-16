import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { API_URLS } from '../constants/apiUrls';
import { getRequest } from '../utils/apiHelpers';
import Pagination from '@mui/material/Pagination';
import { Select, MenuItem, FormControl, InputLabel, Tabs, Tab } from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchPage = () => {
    const [keyword, setKeyword] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchType, setSearchType] = useState('all'); // Default 'all'
    const [sortOption, setSortOption] = useState('view');
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isProfileOpen, setProfileOpen] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [tabValue, setTabValue] = useState(0); // To track the active tab
    const [showTabs, setShowTabs] = useState(false); // Hide tabs initially
    const navigate = useNavigate();
    const location = useLocation(); // Get current location for handling URL params

    // Fetch search results based on current parameters
    const fetchSearchResults = async () => {
        try {
            const response = await getRequest(
                `${API_URLS.NOVEL_SEARCH}?sort_dir=desc&sc=${searchType}&keyword=${searchKeyword}&oc=${sortOption}&page=${page}&size=10`
            );

            if (response.statusCode === 200) {
                setResults(response.data.content);
                setTotalPages(response.data.totalPages);
                setTotalElements(response.data.totalElements);
            } else {
                console.error('Error fetching search results:', response.message);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    useEffect(() => {
        // Extract query params from URL to set initial state
        if (!location.search) {
            setKeyword('');
            setShowResult(false)
            setSearchKeyword('');
            setSearchType('all');
            setSortOption('view');
            setTotalElements(0)
            setTotalPages(1)
            setTabValue(0)
            setShowTabs(false)
            setProfileOpen(false)
            setResults([]);
            setPage(1);
            return;
        }

        const params = new URLSearchParams(location.search);

        const keywordParam = params.get('keyword') || ''; // If no keyword, default to empty string
        const searchTypeParam = params.get('sc') || 'all'; // Default search type to 'all'
        const sortOptionParam = params.get('oc') || 'view'; // Default sort option to 'view'
        const pageParam = parseInt(params.get('page')) || 1; // Default to first page

        setShowResult(true)
        setKeyword(keywordParam);
        setSearchKeyword(keywordParam);
        setSearchType(searchTypeParam);
        setSortOption(sortOptionParam);
        setShowTabs(true)
        setPage(pageParam);

    }, [location.search]); // Update when location changes

    useEffect(() => {
        fetchSearchResults();
    }, [searchKeyword, sortOption, searchType, page])
    const handleSearch = (e) => {
        e.preventDefault();

        if (keyword.trim() === '') {
            // 검색어가 비어있으면 알림을 띄운다.
            alert('검색어를 입력해주세요.');
            return;
        }

        setShowResult(true)
        setPage(1);
        setShowTabs(true); // Show tabs when search is performed
        setSearchKeyword(keyword);

        const params = new URLSearchParams();
        params.set('keyword', keyword);
        params.set('sc', searchType); // 'sc' instead of 'searchType'
        params.set('oc', sortOption); // 'oc' instead of 'sortOption'
        params.set('sort_dir', 'desc'); // Added sort_dir
        params.set('page', 1);
        params.set('size', 10); // Added size as well

        // When user searches, ensure the URL includes /search
        navigate(`/novels/search?${params.toString()}`);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
        const params = new URLSearchParams();
        params.set('keyword', keyword);
        params.set('sc', searchType); // 'sc' instead of 'searchType'
        params.set('oc', sortOption); // 'oc' instead of 'sortOption'
        params.set('sort_dir', 'desc'); // Added sort_dir
        params.set('page', value);
        params.set('size', 10);

        navigate(`/novels/search?${params.toString()}`);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        const newSearchType = newValue === 0 ? 'all' : newValue === 1 ? 'title' : 'author';
        setSearchType(newSearchType);
        setPage(1);

        const params = new URLSearchParams();
        params.set('keyword', keyword);
        params.set('sc', newSearchType); // 'sc' instead of 'searchType'
        params.set('oc', sortOption); // 'oc' instead of 'sortOption'
        params.set('sort_dir', 'desc'); // Added sort_dir
        params.set('page', 1);
        params.set('size', 10); // Added size as well

        navigate(`/novels/search?${params.toString()}`);
    };

    const onClickNovel = (novelId) => {
        navigate(`/novels/details?id=${novelId}`);
    };

    return (
        <div>
            <Header isProfileOpen={isProfileOpen} onProfileToggle={() => setProfileOpen(!isProfileOpen)} />
            <main className="container mx-auto p-8">
                <div className="mb-6">
                    <form onSubmit={handleSearch} className="flex items-center gap-4 border-2 border-black p-2">
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="작품명, 작가 검색"
                            className="ml-3 w-full p-2 rounded-md border-2 border-transparent focus:border-black focus:outline-none"
                        />
                        <div
                            onClick={handleSearch}
                            className="w-16 h-16 flex justify-center items-center cursor-pointer"
                            aria-label="검색"
                            style={{ fontSize: '1.5rem' }}
                        >
                            <FaSearch style={{ transition: 'none' }} />
                        </div>
                    </form>
                </div>

                {showTabs && (
                    <div className="mb-6">
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            aria-label="검색 기준 탭"
                            className="w-full md:w-auto"
                        >
                            <Tab label="전체" />
                            <Tab label="제목" />
                            <Tab label="작가" />
                        </Tabs>
                    </div>
                )}
                {
                    showResult && (
                        <div className="container mx-auto p-6">
                            <div>
                                <div className='text-3xl'>
                                    <span className='font-bold text-purple-500'>{searchKeyword}</span>
                                    검색 결과입니다.
                                </div>

                                <div className="flex items-center justify-between mb-4">
                                    <div className='text-lg'>
                                        총 {totalElements}개 작품
                                    </div>
                                    <FormControl variant="outlined" className="w-40">
                                        <InputLabel>정렬 기준</InputLabel>
                                        <Select
                                            value={sortOption}
                                            onChange={(e) => {
                                                setSortOption(e.target.value);
                                                const params = new URLSearchParams();
                                                params.set('keyword', keyword);
                                                params.set('sc', searchType); // 'sc' instead of 'searchType'
                                                params.set('oc', e.target.value); // 'oc' instead of 'sortOption'
                                                params.set('sort_dir', 'desc'); // Added sort_dir
                                                params.set('page', page);
                                                params.set('size', 10);

                                                navigate(`/novels/search?${params.toString()}`);
                                            }}
                                            label="정렬 기준"
                                        >
                                            <MenuItem value="new">공개일자 순</MenuItem>
                                            <MenuItem value="view">조회순</MenuItem>
                                            <MenuItem value="update">업데이트 순</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>

                                <div className='border border-black' />

                                <ul className="space-y-6">
                                    {results.map((novel) => (
                                        <li
                                            onClick={() => onClickNovel(novel.novelId)}
                                            key={novel.novelId}
                                            className="flex bg-white p-6 border-b border-gray-200 cursor-pointer"
                                        >
                                            <img
                                                src={novel.coverImageUrl || '/cover.jpg'}
                                                className="w-32 h-48 object-cover rounded-md mr-6"
                                                alt={novel.title}
                                            />
                                            <div className="flex-1">
                                                <h3 className="text-xl font-semibold">{novel.title}</h3>
                                                <p className="text-gray-600">작가: {novel.authorNickname}</p>
                                                <p className="text-gray-600">공개일자: {novel.publishDate}</p>
                                                <p className="text-gray-600">업데이트일자: {novel.lastUpdateDate}</p>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {novel.tags.map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
                                                        >
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex justify-center border-t-2 border-gray-700 pt-4">
                                    <Pagination
                                        count={totalPages}
                                        page={page}
                                        onChange={handlePageChange}
                                        size="large"
                                    />
                                </div>
                            </div>
                        </div>
                    )
                }

            </main>
        </div>
    );
};

export default SearchPage;
