import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';
import PlayBar from './Playbar';
import HeaderBar from './HeaderBar';
import Sidebar from './Sidebar';
import Rightbar from './RightBar';
import '../styles/TopGenres.css';

const UserProfile: React.FC = () => {
    const [userProfile, setUserProfile] = useState<any>(null);
    const [topTracks, setTopTracks] = useState<any[]>([]);
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [topGenres, setTopGenres] = useState<string[]>([]); 
    const [genreImages, setGenreImages] = useState<{ [key: string]: string }>({}); // Almacenar imágenes de géneros
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
    const token = localStorage.getItem('spotifyToken');
    const navigate = useNavigate();

	const getRandomColor = () => {
		const letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	};

    useEffect(() => {

		const fetchTopGenres = async () => {
			try {
				const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=12', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				if (response.ok) {
					const data = await response.json();
					console.log('Artistas favoritos:', data.items);
					if (data.items.length > 0) {
						const genres = data.items.flatMap((artist: any) => artist.genres);
						console.log('Géneros obtenidos:', genres);
						setTopGenres([...new Set(genres)] as string[]);
	
						// Obtener las imágenes de los artistas para cada género
						const genreImagesData = data.items.map((artist: any) => {
							return {
								genre: artist.genres[0], // Usar el primer género del artista como ejemplo
								imageUrl: artist.images[0] ? artist.images[0].url : '', // Obtener la imagen del artista
							};
						});
	
						// Guardar las imágenes asociadas a los géneros
						const genreImagesObject = genreImagesData.reduce((acc: { [key: string]: string }, { genre, imageUrl }: { genre: string, imageUrl: string }) => {
							acc[genre] = imageUrl;
							return acc;
						}, {});
	
						setGenreImages(genreImagesObject); // Establecer las imágenes en el estado
					} else {
						console.warn('No se encontraron artistas favoritos.');
					}
				} else {
					console.error('Error al obtener géneros favoritos', response.status);
				}
			} catch (error) {
				console.error('Error al obtener géneros favoritos:', error);
			}
		};

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
            fetchPlaylists();
            fetchTopGenres(); // Llamar la función para obtener géneros e imágenes
        } else {
            navigate('/');
        }
    }, [token, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('spotifyToken');
        setUserProfile(null);
        navigate('/'); // Redirigir a la página principal o de inicio de sesión
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

            <div className="main-container">
                {/* Sidebar: Siempre visible a la izquierda */}
                <Sidebar
                    isOpen={isSidebarOpen}
                    playlists={playlists}
                    onPlaylistClick={(playlist) => console.log(playlist)}
                    onClose={closeSidebar}
                    onToggle={toggleSidebar} // Pasar el toggle aquí
                />
                {/* Contenido principal: Géneros y Rightbar */}
                <div className="profile-container">
                    {/* Mensaje de bienvenida */}
                    <div className="welcome-container">
                        <h2 className="welcome-msg">Bienvenido/a, {userProfile.display_name}</h2>
                    </div>

                    {/* Sección de géneros */}
                    <div className="top-genres">
                        {topGenres.length > 0 ? (
                            <ul className="genres-list">
							{topGenres.map((genre, index) => (
								<li
									key={index}
									className="genre-tag"
									style={{
									backgroundImage: genreImages[genre] ? `url(${genreImages[genre]})` : 'none',
									backgroundColor: genreImages[genre] ? 'transparent' : getRandomColor(), // Color aleatorio si no hay imagen
									}}
								>
									<span>{genre}</span>
								</li>
							  
							))}
						</ul>
                        ) : (
                            <p className="no-genres">No se encontraron géneros favoritos.</p>
                        )}
                    </div>
                </div>
                <div className="rightbar-container">
                    <Rightbar topTracks={topTracks} />
                </div>
            </div>

            <footer className="footer-index">
                <PlayBar />
            </footer>
        </div>
    );
};

export default UserProfile;
