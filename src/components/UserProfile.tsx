import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';
import logoSpotify from '../assets/logo.svg';
import SearchBar from './SearchBar';
import PlayBar from './Playbar';
import HeaderBar from './Headerbar';

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
		<HeaderBar 
			userProfile={userProfile} 
			onSongSelect={() => {}} 
			handleLogout={handleLogout} 
		/>
      </header>

      <main>
        <div className="profile-container">
          <h2>Bienvenido/a, {userProfile.display_name}</h2>
		  <h2>Bienvenido/a, {userProfile.display_name}</h2>
		  <h2>Bienvenido/a, {userProfile.display_name}</h2>
		  <h2>Bienvenido/a, {userProfile.display_name}</h2>

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
