import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

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
    <div className="profile-container">
      <h2>Bienvenido/a, {userProfile.display_name}</h2>
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
             <button onClick={handleLogout} className="logout-button">Cerrar sesión</button>
          </ul>
        )}
      </div>
     
    </div>
  );
};

export default UserProfile;
