import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeaderBar from './HeaderBar';
import PlayBar from './Playbar';
import '../styles/SearchResults.css';

const SearchResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchQuery = new URLSearchParams(location.search).get('q') || '';
  const [results, setResults] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    // Obtener el perfil de usuario al montar el componente
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('spotifyToken');
      if (!token) {
        navigate('/');
        return;
      }

      try {
        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        navigate('/');
      }
    };

    fetchUserProfile();
  }, [navigate]);

  useEffect(() => {
    const fetchResults = async () => {
      const token = localStorage.getItem('spotifyToken');
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=20`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setResults(data.tracks.items);
        }
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };

    if (searchQuery) {
      fetchResults();
    }
  }, [searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem('spotifyToken');
    navigate('/');
  };

  if (!userProfile) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="search-results-page">
      <HeaderBar 
        userProfile={userProfile} 
        onSongSelect={() => {}}
        handleLogout={handleLogout}
      />
      <main className="search-results-container">
        <h2>Resultados para: {searchQuery}</h2>
        <div className="results-grid">
          {results.map((track) => (
            <div key={track.id} className="track-card">
              <img src={track.album.images[0]?.url} alt={track.name} />
              <div className="track-info">
                <h3>{track.name}</h3>
                <p>{track.artists.map((artist: any) => artist.name).join(', ')}</p>
              </div>
              <iframe
                style={{ borderRadius: '12px' }}
                src={`https://open.spotify.com/embed/track/${track.id}`}
                width="100%"
                height="80"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              ></iframe>
            </div>
          ))}
        </div>
      </main>
      <PlayBar />
    </div>
  );
};

export default SearchResults;