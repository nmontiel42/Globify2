import { Routes, Route } from 'react-router-dom';
import SpotifyAuth from './components/SpotifyAuth';
import UserProfile from './components/UserProfile';

const App = () => (
  <Routes>
    <Route path="/" element={<SpotifyAuth />} />
    <Route path="/callback" element={<SpotifyAuth />} /> {/* Ruta para manejar el callback */}
    <Route path="/user-profile" element={<UserProfile />} />
  </Routes>
);

export default App;
