import React, { useState, useEffect, useRef } from 'react';
import { Play, SkipForward, SkipBack, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import '../styles/PlayBar.css';

const PlayBar: React.FC = () => {
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [currentTrackTime, setCurrentTrackTime] = useState<number>(0);
  const [trackDuration, setTrackDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState<number>(50);
  const [isMuted, setIsMuted] = useState(false);
  const token = localStorage.getItem('spotifyToken');

  // Referencia para la barra de progreso
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const volumeBarRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isVolumeDragging, setIsVolumeDragging] = useState(false);

  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  useEffect(() => {
    if (!token) {
      setError('No se encontró el token');
      setLoading(false);
      return;
    }

    const fetchTopTracks = async () => {
      try {
        const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=10', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const tracksData = await response.json();
          setTopTracks(tracksData.items);
        } else {
          const errorData = await response.json();
          setError(`Error: ${response.status} - ${errorData.error.message}`);
        }
      } catch (error) {
        setError('Error al cargar las canciones');
      } finally {
        setLoading(false);
      }
    };

    fetchTopTracks();
  }, [token]);

  useEffect(() => {
    if (topTracks.length > 0 && currentTrackIndex === null) {
      setCurrentTrackIndex(0);
    }
  }, [topTracks, currentTrackIndex]);

  useEffect(() => {
    if (currentTrackIndex !== null) {
      const currentTrack = topTracks[currentTrackIndex];
      setTrackDuration(currentTrack.duration_ms);
      setCurrentTrackTime(0);
    }
  }, [currentTrackIndex, topTracks]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    if (currentTrackIndex !== null && currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    } else {
      setCurrentTrackIndex(topTracks.length - 1);
    }
  };

  const handleNext = () => {
    if (currentTrackIndex !== null && currentTrackIndex < topTracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    } else {
      setCurrentTrackIndex(0);
    }
  };

  const handleVolumeBarClick = (e: React.MouseEvent) => {
    if (volumeBarRef.current) {
      const clickPosition = e.nativeEvent.offsetX;
      const newVolume = (clickPosition / volumeBarRef.current.offsetWidth) * 100;
      setVolume(Math.min(100, Math.max(0, newVolume)));
    }
  };

  // Manejador para iniciar arrastre de volumen
  const handleVolumeDragStart = (e: React.MouseEvent) => {
    setIsVolumeDragging(true);
  };

  // Manejador para mover arrastre de volumen
  const handleVolumeDragMove = (e: React.MouseEvent) => {
    if (isVolumeDragging && volumeBarRef.current) {
      const dragPosition = e.nativeEvent.offsetX;
      const newVolume = (dragPosition / volumeBarRef.current.offsetWidth) * 100;
      setVolume(Math.min(100, Math.max(0, newVolume)));
    }
  };

  // Manejador para terminar arrastre de volumen
  const handleVolumeDragEnd = () => {
    setIsVolumeDragging(false);
  };

  // Alternar mute
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };


  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying && currentTrackIndex !== null) {
      interval = setInterval(() => {
        setCurrentTrackTime((prevTime) => {
          if (prevTime < trackDuration) {
            return prevTime + 1000; // Incrementa el tiempo en 1 segundo (1000 ms)
          } else {
            clearInterval(interval!); // Detén el intervalo cuando la canción termina
            return trackDuration;
          }
        });
      }, 1000); // El intervalo se ejecuta cada 1 segundo
    } else if (!isPlaying) {
      clearInterval(interval!); // Detiene el intervalo si no se está reproduciendo
    }

    return () => {
      if (interval) clearInterval(interval); // Limpia el intervalo cuando el componente se desmonta
    };
  }, [isPlaying, currentTrackIndex, trackDuration]);

  // Manejador para el arrastre de la barra de progreso
  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (isDragging && progressBarRef.current) {
      const dragPosition = e.nativeEvent.offsetX;
      const newTime = (dragPosition / progressBarRef.current.offsetWidth) * trackDuration;
      setCurrentTrackTime(newTime);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  if (loading) return null;
  if (error) return null;
  if (currentTrackIndex === null || !topTracks[currentTrackIndex]) return null;

  const currentTrack = topTracks[currentTrackIndex];
  const progress = (currentTrackTime / trackDuration) * 100;

  return (
    <footer className="playback-bar1">

      <div className="track-info1">

        <img
          src={currentTrack.album.images[2].url}
          alt={currentTrack.name}
          className="album-art1"
        />

        <div className="track-details1">
          <p className="track-name1">{currentTrack.name}</p>
          <p className="track-artist1">{currentTrack.artists[0].name}</p>
        </div>

        {/* Añadir botón de like de Spotify */}
        <button
          className={`like-button1 ${isLiked ? "liked" : ""}`}
          onClick={toggleLike}
        >
          <svg
            className="icon1"
            role="img"
            height="24"
            width="24"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            ></path>
          </svg>
        </button>

      </div>

      <div className="controls1">
        <div className="control-buttons1">
          <button className="control-button1 shuffle-button1">
            <svg role="img" height="18" width="18" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.696 8.854l-4.5 4.5a.75.75 0 0 1-1.061-1.061L9.803 9H1a.75.75 0 0 1 0-1.5h8.803L6.135 3.707a.75.75 0 0 1 1.061-1.061l4.5 4.5a.75.75 0 0 1 0 1.061z"></path>
            </svg>
          </button>
          <button className="control-button1" onClick={handlePrevious}>
            <SkipBack size={24} />
          </button>
          <button className="control-button1 play-pause1" onClick={handlePlayPause}>
            {isPlaying ? <Pause size={24} fill='black'/> : <Play size={24} fill='black'/>}
          </button>
          <button className="control-button1" onClick={handleNext}>
            <SkipForward size={24} />
          </button>
          <button className="control-button1 repeat-button1">
            <svg role="img" height="16" width="16" viewBox="0 0 16 16">
              <path fill="currentColor" d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.018 1.018a.75.75 0 1 1-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 1 1 1.06 1.06L9.811 12h2.439a2.25 2.25 0 0 0 2.25-2.25v-5a2.25 2.25 0 0 0-2.25-2.25h-8.5A2.25 2.25 0 0 0 1.5 4.75v5A2.25 2.25 0 0 0 3.75 12H5v1.5H3.75A3.75 3.75 0 0 1 0 9.75v-5z"></path>
            </svg>
          </button>
        </div>
        <div className="progress-container1">
          <span className="time-elapsed1">{formatTime(currentTrackTime)}</span>
          <div
            ref={progressBarRef}
            className="progress-bar1"
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            <div className="progress1" style={{ width: `${progress}%` }} />
          </div>
          <span className="time-total1">{formatTime(trackDuration)}</span>
        </div>
      </div>

      <div className="volume-controls1">
        <button
          className="control-button1 lyrics-button1"
          title="Lyrics"
        >
        </button>
        <button
          className="control-button1"
          onClick={handleToggleMute}
          title="Mute"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <div
          className="volume-bar1"
          ref={volumeBarRef}
          onClick={handleVolumeBarClick}
          onMouseDown={handleVolumeDragStart}
          onMouseMove={handleVolumeDragMove}
          onMouseUp={handleVolumeDragEnd}
          onMouseLeave={handleVolumeDragEnd}
        >
          <div
            className="volume-progress1"
            style={{
              width: `${isMuted ? 0 : volume}%`,
              backgroundColor: isVolumeDragging ? '#1db954' : '#ffffff'
            }}
          />
        </div>
        <button className="control-button1">
          <Maximize2 size={16} />
        </button>
      </div>
    </footer>
  );
};

export default PlayBar;