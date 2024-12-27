import { Route, Routes } from 'react-router-dom';  // Import routing components
import Login from './pages/Login';  // Import Login page
import Signup from './pages/Signup';  // Import Signup page
import Home from './pages/Home';  // Import Home page
import LoginSuccess from './components/LoginSuccess';
import PrivateRoute from './components/PrivateRoute';

const RoutesConfig = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/login/oauth2.0/" element={<LoginSuccess />}/>
    <Route path="/signup" element={<Signup />} />

    {/* 인증이 필요한 페이지 */}
    {/* <Route path="/home" element={<PrivateRoute element={<Home />} />} /> */}
  </Routes>
);

export default RoutesConfig;  // Default export
