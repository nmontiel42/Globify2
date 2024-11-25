import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SpotifyAuth.css';
import logoSpotify from '../assets/logo.svg';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID; 
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI; 
const AUTH_ENDPOINT = process.env.REACT_APP_AUTH_ENDPOINT;
const RESPONSE_TYPE = process.env.REACT_APP_RESPONSE_TYPE;
const SCOPES = process.env.REACT_APP_SCOPES || '';

const AUTH_URL = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPES)}`;

const SpotifyAuth: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica si el token está presente en la URL o en el localStorage
    if (window.location.hash) {
      const tokenFromUrl = window.location.hash.split('&')[0].split('=')[1];
      console.log('Token desde la URL:', tokenFromUrl); // Depuración
      setToken(tokenFromUrl);
      localStorage.setItem('spotifyToken', tokenFromUrl);
      window.location.hash = '';
    } else {
      const savedToken = localStorage.getItem('spotifyToken');
      if (savedToken) {
        console.log('Token recuperado desde localStorage:', savedToken); // Depuración
        setToken(savedToken);
      }
    }
  }, []);

  useEffect(() => {
    if (token) {
      console.log('Token disponible, obteniendo perfil...');
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
        console.log('Perfil de usuario obtenido:', userData); // Depuración
        setUserProfile(userData);
        navigate('/user-profile'); // Redirigir al perfil del usuario
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
     /* <div>
        <button onClick={() => window.location.href = AUTH_URL}>Iniciar sesión con Spotify</button>
      </div>
    ) */
   
		<div className="spotify-auth-container">
		<div className="spotify-auth-card">
			<img src={logoSpotify} alt="Spotify Logo" className="spotify-logo"></img>
			<h1 className="spotify-title">Inicia sesión en Spotify</h1>
			<button className="spotify-login-button" onClick={() => window.location.href = AUTH_URL}>
			Iniciar sesión con Spotify
			</button>
		</div>
		</div>
	);
  }

  return (
        <div className="spotify-loading">Loading user profile...</div>
  );
};

export default SpotifyAuth;
