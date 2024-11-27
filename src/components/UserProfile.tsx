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
	const [topTracks, setTopTracks] = useState<any[]>([]);
	const [recentTracks, setRecentTracks] = useState<any[]>([]);


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

		const fetchTopTracks = async () => {
			try {
				const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=10', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				if (response.ok) {
					const data = await response.json();
					setTopTracks(data.items); // Guardar las canciones en el estado
				} else {
					console.error('Error al obtener top tracks', response.status);
				}
			} catch (error) {
				console.error('Error al obtener top tracks:', error);
			}
		};

		const fetchRecentlyPlayed = async () => {
            try {
                const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=10', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setRecentTracks(data.items); // Guardar canciones recientes
                } else {
                    console.error('Error al obtener canciones recientes', response.status);
                }
            } catch (error) {
                console.error('Error al obtener canciones recientes:', error);
            }
        };

		if (token) {
			fetchUserProfile();
			fetchTopTracks();
			fetchRecentlyPlayed();
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
					onSongSelect={() => { }}
					handleLogout={handleLogout}
				/>
			</header>

			<main>
                <div className="profile-container">
                    <h2>Bienvenido/a, {userProfile.display_name}</h2>

                    {/* Canciones favoritas */}
                    <div className="top-tracks-container">
                        <h3>Tus canciones favoritas</h3>
                        {topTracks.length > 0 ? (
                            topTracks.map((track) => (
                                <iframe
                                    key={track.id}
                                    style={{ borderRadius: '12px', marginBottom: '12px' }}
                                    src={`https://open.spotify.com/embed/track/${track.id}`}
                                    width="100%"
                                    height="80"
                                    frameBorder="0"
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                    loading="lazy"
                                ></iframe>
                            ))
                        ) : (
                            <p>Cargando tus canciones favoritas...</p>
                        )}
                    </div>

                    {/* Canciones recientes va mal*/}
                    <div className="recent-tracks-container">
                        <h3>Escuchado recientemente</h3>
                        {recentTracks.length > 0 ? (
                            recentTracks.map((track) => (
                                <iframe
                                    key={track.track.id}
                                    style={{ borderRadius: '12px', marginBottom: '12px' }}
                                    src={`https://open.spotify.com/embed/track/${track.track.id}`}
                                    width="100%"
                                    height="80"
                                    frameBorder="0"
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                    loading="lazy"
                                ></iframe>
                            ))
                        ) : (
                            <p>No se encontraron canciones recientes.</p>
                        )}
                    </div>
                </div>
            </main>

			<footer className='footer-index'>
				<PlayBar />
			</footer>
		</body>
	);
};

export default UserProfile;
