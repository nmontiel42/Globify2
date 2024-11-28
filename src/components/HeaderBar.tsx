import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../styles/HeaderBar.css";
import logoSpoity from "../assets/logo.svg";
import iconHeart from "../assets/heart.svg";

interface UserProfile {
  images: { url: string }[];
  email?: string;
  country?: string;
  followers?: { total: number };
  external_urls?: { spotify: string };
}

interface HeaderBarProps {
  userProfile: UserProfile;
  onSongSelect: (uri: string) => void;
  handleLogout: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ userProfile, onSongSelect, handleLogout }) => {
  const navigate = useNavigate();
  const [isInfoVisible, setInfoVisibility] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Refs para detectar clics fuera del perfil
  const profileInfoRef = useRef<HTMLDivElement | null>(null);

  const toggleInfoVisibility = () => {
    setInfoVisibility((prev) => !prev);
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const token = localStorage.getItem('spotifyToken');
    
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.tracks.items);
      }
    } catch (error) {
      console.error('Error al buscar:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Efecto para cerrar el perfil cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Verifica si el clic está fuera del perfil
      if (profileInfoRef.current && !profileInfoRef.current.contains(event.target as Node)) {
        setInfoVisibility(false);
      }
    };

    // Agregar evento para detectar clics fuera del perfil
    document.addEventListener('mousedown', handleClickOutside);

    // Limpiar el evento cuando el componente se desmonte
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="header-bar">
      <div className="header-profile">
        <div className="btns-home">
          <button 
            className="logoButton"
            onClick={() => navigate('/user-profile')}
          >
            <img
              src={logoSpoity}
              alt="Spotify Logo"
              className="spotify-logo"
            />
          </button>          
        </div>

        <div className="search-section">
          <button className="homeButton">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="home-logo"
            >
              <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z" />
            </svg>
          </button>

          <button className="heartButton">
            <img
              src={iconHeart}
              alt="Spotify Logo"
              className="heart-icon"
            />
          </button>  

          <div className="search-bar" ref={searchContainerRef}>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="¿Qué quieres escuchar?"
                value={searchQuery}
                onChange={handleSearch}
              />
            </form>
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((track) => (
                  <div 
                    key={track.id} 
                    className="search-result-item"
                    onClick={() => navigate(`/search?q=${encodeURIComponent(track.name)}`)}
                  >
                    <img src={track.album.images[2]?.url} alt={track.name} />
                    <div className="track-info">
                      <span className="track-name">{track.name}</span>
                      <span className="track-artist">
                        {track.artists.map((artist: any) => artist.name).join(', ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="profile-info" ref={profileInfoRef}>
          <img
            src={userProfile.images[0]?.url || "placeholder.jpg"}
            alt="Foto de perfil"
            className="profile-picture"
            onClick={toggleInfoVisibility}
          />
          {isInfoVisible && (
            <ul className="profile-details">
              <li>
                <strong>Email:</strong> {userProfile.email || "No disponible"}
              </li>
              <li>
                <strong>País:</strong> {userProfile.country || "No disponible"}
              </li>
              <li>
                <strong>Seguidores:</strong>{" "}
                {userProfile.followers?.total || 0}
              </li>
              <li>
                <strong>Perfil de Spotify:</strong>{" "}
                <a
                  href={userProfile.external_urls?.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visitar
                </a>
              </li>
              <li className="line-logout">
                <button onClick={handleLogout} className="logout-button">
                  Cerrar sesión
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderBar;
