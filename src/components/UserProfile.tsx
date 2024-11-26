import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';
import logoSpotify from '../assets/logo.svg';
import SearchBar from './SearchBar';
import PlayBar from './Playbar';

const UserProfile: React.FC = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isInfoVisible, setIsInfoVisible] = useState<boolean>(false); // Estado para controlar visibilidad
  const token = localStorage.getItem('spotifyToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
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
          console.error('Error al obtener perfil de usuario', response.status);
        }
      } catch (error) {
        console.error('Error al obtener perfil de usuario:', error);
      }
    };

    if (token) {
      fetchUserProfile();
    } else {
      navigate('/');
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('spotifyToken');
    setUserProfile(null);
    navigate('/'); // Redirigir a la página principal o de inicio de sesión
  };

  const toggleInfoVisibility = () => {
    setIsInfoVisible(!isInfoVisible); // Alternar visibilidad al hacer clic en la foto
  };

  if (!userProfile) {
    return <p>Cargando perfil...</p>;
  }

  return (
    <body>
      <header>
		<div className='header-profile'>
			<div className='btns-home'>
				<button>
					<img src={logoSpotify} alt="Spotify Logo" className="spotify-logo"></img>
				</button>

				<button className="homeButton">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className='home-logo'>
						<path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z"/>
					</svg>
				</button>
			</div>
						

			<SearchBar onSongSelect={function (uri: string): void {
				throw new Error('Function not implemented.');
			} } />

			<div className="profile-info">
			<img
				src={userProfile.images[0]?.url || 'placeholder.jpg'}
				alt="Foto de perfil"
				className="profile-picture"
				onClick={toggleInfoVisibility} // Añadimos el evento onClick
			/>
			{isInfoVisible && ( // Mostrar información solo si `isInfoVisible` es true
				<ul className="profile-details">
				<li><strong>Email:</strong> {userProfile.email || 'No disponible'}</li>
				<li><strong>País:</strong> {userProfile.country || 'No disponible'}</li>
				<li><strong>Seguidores:</strong> {userProfile.followers?.total || 0}</li>
				<li>
					<strong>Perfil de Spotify:</strong>{' '}
					<a href={userProfile.external_urls?.spotify} target="_blank" rel="noopener noreferrer">
					Visitar
					</a>
				</li>
				<li>
          <button onClick={handleLogout} className="logout-button">Cerrar sesión</button>
        </li>
				</ul>
			)}
			</div>
		</div>
      </header>

      <main>
        <div className="profile-container">
          <h2>Bienvenido/a, {userProfile.display_name}</h2>
        </div>
      </main>
      <footer>
        <PlayBar />
      </footer>
    </body>
  );
};

export default UserProfile;
