import React from 'react';

interface RightBarProps {
  topTracks: any[];
}

const RightBar: React.FC<RightBarProps> = ({ topTracks }) => {
  return (
    <div>
      <h3>Tus canciones más escuchadas</h3>
      {topTracks.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {topTracks.map((track) => (
            <iframe
              key={track.id}
              style={{
                borderRadius: '12px',
                height: '156px', // Increased height
              }}
              src={`https://open.spotify.com/embed/track/${track.id}`}
              width="100%"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
          ))}
        </div>
      ) : (
        <p>Cargando tus canciones favoritas...</p>
      )}
    </div>
  );
};

export default RightBar;