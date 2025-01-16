import { Route, Routes } from 'react-router-dom';  // Import routing components
import Login from './pages/Login';  // Import Login page
import Signup from './pages/Signup';  // Import Signup page
import Home from './pages/Home';  // Import Home page
import MyNovel from './pages/MyNovel'
import MyNovelDetails from './pages/MyNovelDetails'
import MyNovelEpisode from './pages/MyNovelEpisode'
import EpisodeCreate from './pages/episode/EpisodeCreate'
import EpisodeViewer from './pages/episode/EpisodeViewer'
import EpisodeEdit from './pages/episode/EpisodeEdit'
import NovelPatch from './pages/NovelPatch'
import NovelDetails from './pages/NovelDetails'
import SearchPage from './pages/SearchPage'
import Publishing from './pages/Publishing'
import LoginSuccess from './components/LoginSuccess';
import PrivateRoute from './components/PrivateRoute';

const RoutesConfig = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/login/oauth2.0/" element={<LoginSuccess />}/>
    <Route path="/signup" element={<Signup />} />
    <Route path="/mynovels" element={<MyNovel />} />
    <Route path="/mynovels/details" element={<MyNovelDetails />} />
    <Route path="/publishing/new" element={<Publishing />} />
    <Route path="/publishing/update" element={<NovelPatch />} />
    <Route path="/mynovels/:novelId/episodes" element={<MyNovelEpisode />} />
    <Route path="/mynovels/:novelId/episodes/create" element={<EpisodeCreate />} />
    <Route path="/mynovels/:novelId/episodes/edit/:episodeId" element={<EpisodeEdit />} />
    <Route path="/viewer/:episodeId" element={<EpisodeViewer/>}/>
    <Route path="/novels/details" element={<NovelDetails />} />
    <Route path="/novels/search" element= {<SearchPage />} />
    <Route path="/*" element={<Home />} />

    {/* 인증이 필요한 페이지 */}
    {/* <Route path="/home" element={<PrivateRoute element={<Home />} />} /> */}
  </Routes>
);

export default RoutesConfig;  // Default export
