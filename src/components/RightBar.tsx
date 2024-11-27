import React from 'react';
import '../styles/Profile.css';

interface RightBarProps {
	topTracks: any[];
}

const RightBar: React.FC<RightBarProps> = ({ topTracks }) => {
	return (
		<div className='barright'>
			<h3>Tus canciones más escuchadas</h3>
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
	);
};

export default RightBar;