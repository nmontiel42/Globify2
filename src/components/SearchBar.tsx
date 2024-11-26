import React, { useState } from 'react';

interface SearchBarProps {
  onSongSelect: (uri: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSongSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]); // Lista de canciones

  const token = localStorage.getItem('spotifyToken');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data.tracks.items); // Actualizar los resultados
      } else {
        console.error('Error al buscar canciones:', response.status);
      }
    } catch (error) {
      console.error('Error al buscar canciones:', error);
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Buscar canción..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>
      <div className="search-results">
        {results.map((track) => (
          <div key={track.id} className="search-result-item">
            <p>{track.name} - {track.artists.map((artist: any) => artist.name).join(', ')}</p>
            <button onClick={() => onSongSelect(track.uri)}>Seleccionar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
