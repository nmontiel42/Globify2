import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const UserProfile: React.FC = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
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

  if (!userProfile) {
    return <p>Cargando perfil...</p>;
  }

  return (
    <div>
      <h2>Bienvenidoaa, {userProfile.display_name}</h2>
      <img src={userProfile.images[0]?.url || 'placeholder.jpg'} alt="Profile" width={100} />
      <p>{userProfile.email}</p>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
};

export default UserProfile;
