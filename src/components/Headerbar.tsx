import React, { useState } from "react";
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
  const [isInfoVisible, setInfoVisibility] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleInfoVisibility = () => {
    setInfoVisibility((prev) => !prev);
  };

  return (
    <div className="header-bar">
      <div className="header-profile">
        <div className="btns-home">

		  {/* LOGO SPOTIFY */}	
          <button className="logoButton">
            <img
              src={logoSpoity}
              alt="Spotify Logo"
              className="spotify-logo"
            />
          </button>          
        </div>

		<div className="search-section">
			{/* BOTON HOME */}
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

			{/* BARRA DE BUSQUEDA */}
			<div className="search-bar">
			<input
				type="text"
				placeholder="¿Qué quieres escuchar?"
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>
			</div>
		</div>
		

		{/* IMAGEN DE PERFIL */}
        <div className="profile-info">
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
              <li>
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
