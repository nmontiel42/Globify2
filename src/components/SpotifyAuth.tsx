import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CLIENT_ID = '8dd4cfb515cf4929b141f028721625b6'; 
const REDIRECT_URI = 'http://localhost:3000/callback'; 
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';
const SCOPES = 'user-read-private user-read-email';

const AUTH_URL = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPES)}`;

const SpotifyAuth: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hash) {
      const tokenFromUrl = window.location.hash.split('&')[0].split('=')[1];
      setToken(tokenFromUrl);
      localStorage.setItem('spotifyToken', tokenFromUrl);
      window.location.hash = '';
    } else {
      const savedToken = localStorage.getItem('spotifyToken');
      if (savedToken) {
        setToken(savedToken);
      }
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUserProfile(userData);
        navigate('/user-profile'); // Redirige al perfil del usuario
      } else {
        console.error('Error al obtener perfil de usuario', response.status);
      }
    } catch (error) {
      console.error('Error al obtener perfil de usuario:', error);
    }
  };

  // Función de cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('spotifyToken'); // Eliminar el token
    setToken(null); // Limpiar el estado de token
    setUserProfile(null); // Limpiar el perfil de usuario
    navigate('/'); // Redirigir al inicio o página de inicio de sesión
  };

  if (!token) {
    return (
      <div>
        <button onClick={() => window.location.href = AUTH_URL}>Iniciar sesión con Spotify</button>
      </div>
    );
  }

  return (
    <div>
      {userProfile && (
        <div>
          <h2>Bienvenido, {userProfile.display_name}</h2>
          <img src={userProfile.images[0]?.url || 'placeholder.jpg'} alt="Profile" width={100} />
          <p>{userProfile.email}</p>
        </div>
      )}
      <div>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </div>
  );
};

export default SpotifyAuth;
