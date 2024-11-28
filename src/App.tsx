import { Routes, Route } from 'react-router-dom';
import SpotifyAuth from './components/SpotifyAuth';
import UserProfile from './components/UserProfile';
import SearchResults from './components/SearchResults';
import Track from './components/Track';

const App = () => (
  <Routes>
    <Route path="/" element={<SpotifyAuth />} />
    <Route path="/callback" element={<SpotifyAuth />} />
    <Route path="/user-profile" element={<UserProfile />} />
    <Route path="/search" element={<SearchResults />} />
    <Route path="/track/:id" element={<Track />} />
  </Routes>
);

export default App;
