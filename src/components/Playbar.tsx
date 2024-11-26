import React, { useState, useEffect } from 'react';
import { Play, SkipForward, SkipBack, Pause, Volume2, Maximize2 } from 'lucide-react';
import '../styles/PlayBar.css';

const PlayBar: React.FC = () => {
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [currentTrackTime, setCurrentTrackTime] = useState<number>(0);
  const [trackDuration, setTrackDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const token = localStorage.getItem('spotifyToken');

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

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) return null;
  if (error) return null;
  if (currentTrackIndex === null || !topTracks[currentTrackIndex]) return null;

  const currentTrack = topTracks[currentTrackIndex];
  const progress = (currentTrackTime / trackDuration) * 100;

  return (
    <footer className="playback-bar">
      <div className="track-info">
        <img
          src={currentTrack.album.images[2].url}
          alt={currentTrack.name}
          className="album-art"
        />
        <div className="track-details">
          <p className="track-name">{currentTrack.name}</p>
          <p className="track-artist">{currentTrack.artists[0].name}</p>
        </div>
      </div>

      <div className="controls">
        <div className="control-buttons">
          <button className="control-button" onClick={handlePrevious}>
            <SkipBack size={24} />
          </button>
          <button className="control-button play-pause" onClick={handlePlayPause}>
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button className="control-button" onClick={handleNext}>
            <SkipForward size={24} />
          </button>
        </div>
        <div className="progress-container">
          <span>{formatTime(currentTrackTime)}</span>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }} />
          </div>
          <span>{formatTime(trackDuration)}</span>
        </div>
      </div>

      <div className="volume-controls">
        <button className="control-button">
          <Volume2 size={20} />
        </button>
        <div className="volume-bar">
          <div className="volume-progress" style={{ width: '50%' }} />
        </div>
        <button className="control-button">
          <Maximize2 size={20} />
        </button>
      </div>
    </footer>
  );
};

export default PlayBar;
