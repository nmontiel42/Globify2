import React from 'react';
import '../styles/Sidebar.css';
import { AiOutlineMenu, AiOutlineLeft } from 'react-icons/ai';

interface SidebarProps {
  isOpen: boolean;
  playlists: any[];
  onPlaylistClick: (playlist: any) => void;
  onClose: () => void;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, playlists, onPlaylistClick, onClose, onToggle }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <button className="toggle-btn" onClick={onToggle}>
          {isOpen ? (
            <>
              <AiOutlineLeft className="toggle-icon" />
              <span className="toggle-text">Tus Playlist</span>
            </>
          ) : (
            <>
              <AiOutlineMenu className="toggle-icon" />
            </>
          )}
        </button>
      </div>
      <div className="sidebar-content">
        <div className="sidebar-nav">
          <div className={`playlist-list ${isOpen ? 'expanded' : ''}`}>
            {playlists.length > 0 ? (
              playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="playlist-thumbnail"
                  onClick={() => onPlaylistClick(playlist)}
                >
                  <img
                    src={playlist.images?.[0]?.url || 'https://via.placeholder.com/60x60?text=No+Image'}
                    alt={playlist.name}
                    className="playlist-image"
                  />
                  {isOpen && <p className="playlist-title">{playlist.name}</p>}
                </div>
              ))
            ) : (
              <p>No playlists available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
