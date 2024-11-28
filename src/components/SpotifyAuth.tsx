import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SpotifyAuth.css';
import logoSpotify from '../assets/logo.svg';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
const AUTH_ENDPOINT = process.env.REACT_APP_AUTH_ENDPOINT;
const RESPONSE_TYPE = process.env.REACT_APP_RESPONSE_TYPE;
const SCOPES = 'user-read-private user-read-email user-top-read';

const AUTH_URL = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPES)}`;

const SpotifyAuth: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [, setUserProfile] = useState<any>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const navigate = useNavigate();

  const getTokenFromUrl = () => {
    const token = window.location.hash.split('&')[0].split('=')[1];
    return token ? token : null;
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('Perfil de usuario obtenido:', userData);
        setUserProfile(userData);
        navigate('/user-profile');
      } else if (response.status === 401) {
        console.error('Token caducado, intentando renovar...');
        if (refreshToken) {
          await refreshAccessToken(refreshToken);
        } else {
          console.error('No se dispone de un refresh token, redirigiendo al login...');
          window.location.href = AUTH_URL;
        }
      } else {
        console.error('Error al obtener perfil de usuario', response.status);
      }
    } catch (error) {
      console.error('Error al obtener perfil de usuario:', error);
    }
  };

  const refreshAccessToken = async (refreshToken: string) => {
    const url = 'https://accounts.spotify.com/api/token';
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: CLIENT_ID || '',
      client_secret: CLIENT_SECRET || '',
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        body,
      });

      if (response.ok) {
        const data = await response.json();
        const newAccessToken = data.access_token;
        const newRefreshToken = data.refresh_token;
        localStorage.setItem('spotifyToken', newAccessToken);
        localStorage.setItem('spotifyRefreshToken', newRefreshToken);
        setToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        console.log('Token renovado con éxito');
        fetchUserProfile();
      } else {
        console.error('Error al renovar el token de acceso');
        window.location.href = AUTH_URL;
      }
    } catch (error) {
      console.error('Error al renovar el token:', error);
    }
  };

  useEffect(() => {
    if (window.location.hash) {
      const tokenFromUrl = getTokenFromUrl();
      console.log('Token desde la URL:', tokenFromUrl);
      setToken(tokenFromUrl);
      if (tokenFromUrl) {
        localStorage.setItem('spotifyToken', tokenFromUrl);
      }
      window.location.hash = '';
    } else {
      const savedToken = localStorage.getItem('spotifyToken');
      const savedRefreshToken = localStorage.getItem('spotifyRefreshToken');
      if (savedToken) {
        console.log('Token recuperado desde localStorage:', savedToken);
        setToken(savedToken);
      }
      if (savedRefreshToken) {
        setRefreshToken(savedRefreshToken);
      }
    }

    if (token) {
      console.log('Token disponible, obteniendo perfil...');
      fetchUserProfile();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('spotifyToken');
    localStorage.removeItem('spotifyRefreshToken');
    setToken(null);
    setUserProfile(null);
    setRefreshToken(null);
    navigate('/');
  };

  if (!token) {
    return (
      <div className="spotify-auth-container">
        <div className="spotify-auth-card">
          <img src={logoSpotify} alt="Spotify Logo" className="spotify-logo" />
          <h1 className="spotify-title">Inicia sesión en Globify</h1>
          <button className="spotify-login-button" onClick={() => window.location.href = AUTH_URL}>
            Iniciar sesión
          </button>
        </div>

        <footer>
          <div className="spotify-footer">
            <p>
              Este sitio está protegido por reCAPTCHA. Se aplican los <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Términos del servicio</a> y la <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Política de privacidad</a> de Google.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="spotify-loading">
      Cargando perfil del usuario...
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
};

export default SpotifyAuth;
