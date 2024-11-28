
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderBar from './HeaderBar';
import PlayBar from './Playbar';
import '../styles/Track.css';

const Track: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [track, setTrack] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('spotifyToken');
      if (!token) {
        navigate('/');
        return;
      }

      try {
        // Obtener perfil de usuario
        const profileResponse = await fetch('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setUserProfile(profileData);
        }

        // Obtener información de la canción
        const trackResponse = await fetch(
          `https://api.spotify.com/v1/tracks/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (trackResponse.ok) {
          const trackData = await trackResponse.json();
          setTrack(trackData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        navigate('/');
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('spotifyToken');
    navigate('/');
  };

  if (!track || !userProfile) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="track-page">
      <HeaderBar 
        userProfile={userProfile}
        onSongSelect={() => {}}
        handleLogout={handleLogout}
      />
      <main className="track-container">
        <div className="track-detail">
          <img 
            src={track.album.images[0]?.url} 
            alt={track.name} 
            className="track-cover"
          />
          <div className="track-info">
            <h1>{track.name}</h1>
            <p className="artists">
              {track.artists.map((artist: any) => artist.name).join(', ')}
            </p>
            <p className="album">{track.album.name}</p>
          </div>
          <iframe
            style={{ borderRadius: '12px', marginTop: '20px' }}
            src={`https://open.spotify.com/embed/track/${track.id}`}
            width="100%"
            height="352"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>
      </main>
      <PlayBar />
    </div>
  );
};

export default Track;