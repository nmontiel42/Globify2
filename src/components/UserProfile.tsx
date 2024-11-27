import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';
import PlayBar from './Playbar';
import HeaderBar from './Headerbar';
import Sidebar from './Sidebar'; // Importamos el componente Sidebar

const UserProfile: React.FC = () => {
	const [userProfile, setUserProfile] = useState<any>(null);
	const [topTracks, setTopTracks] = useState<any[]>([]);
	const [playlists, setPlaylists] = useState<any[]>([]);
	const [selectedPlaylist, setSelectedPlaylist] = useState<any>(null); // Estado para la playlist seleccionada
	const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado para controlar la visibilidad de la sidebar
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

		const fetchTopTracks = async () => {
			try {
				const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=10', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				if (response.ok) {
					const data = await response.json();
					setTopTracks(data.items);
				} else {
					console.error('Error al obtener top tracks', response.status);
				}
			} catch (error) {
				console.error('Error al obtener top tracks:', error);
			}
		};

		const fetchPlaylists = async () => {
			try {
				const response = await fetch('https://api.spotify.com/v1/me/playlists', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				if (response.ok) {
					const data = await response.json();
					setPlaylists(data.items); // Guardar las playlists en el estado
				} else {
					console.error('Error al obtener playlists', response.status);
				}
			} catch (error) {
				console.error('Error al obtener playlists:', error);
			}
		};

		if (token) {
			fetchUserProfile();
			fetchTopTracks();
			fetchPlaylists(); // Obtener las playlists
		} else {
			navigate('/');
		}
	}, [token, navigate]);

	const handleLogout = () => {
		localStorage.removeItem('spotifyToken');
		setUserProfile(null);
		navigate('/'); // Redirigir a la página principal o de inicio de sesión
	};

	const handlePlaylistClick = (playlist: any) => {
		setSelectedPlaylist(playlist); // Mostrar la información completa de la playlist
	};

	const toggleSidebar = () => {
		setIsSidebarOpen(prevState => !prevState);
	};

	const closeSidebar = () => {
		setIsSidebarOpen(false);
	};

	if (!userProfile) {
		return <p>Cargando perfil...</p>;
	}

	return (
		<div className="user-profile-container">
			<header>
				<HeaderBar
					userProfile={userProfile}
					onSongSelect={() => { }}
					handleLogout={handleLogout}
				/>
			</header>

			<main className={`main-container ${isSidebarOpen? 'sidebar-open' : ''}`}>
				<div className="profile-container">
					<div className="show-playlist">
						<div className="library-icon" onClick={toggleSidebar}>
							<h3>Librería</h3>
						</div>

						{/* Mostrar Sidebar solo si está abierta */}
						<Sidebar
							isOpen={isSidebarOpen}
							playlists={playlists}
							onPlaylistClick={(playlist) => console.log(playlist)}
							onClose={closeSidebar}
							onToggle={toggleSidebar} // Pasar el toggle aquí
						/>

						{/* CONTENIDO PRINCIPAL */}
						<h2 className="welcome-msg">Bienvenido/a, {userProfile.display_name}</h2>
					</div>

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
				</div>
			</main>

			<footer className="footer-index">
				<PlayBar />
			</footer>
		</div>
	);
};

export default UserProfile;
