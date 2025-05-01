import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState('');
  const [channelInput, setChannelInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const videosPerPage = 6;

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedHistory = JSON.parse(localStorage.getItem('history')) || [];
    if (savedTheme) setTheme(savedTheme);
    setHistory(savedHistory);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('history', JSON.stringify(history));
  }, [history]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleIndexing = async (channel = channelInput) => {
    if (!channel.trim()) {
      alert('Veuillez saisir un nom ou un ID de chaîne.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/index?channel=${channel}`);
      alert(`Indexation terminée. Vidéos ajoutées : ${res.data.videosAdded}`);
      setVideos(res.data.videos);
      setCurrentPage(1);
      if (!history.includes(channel)) {
        setHistory(prev => [...prev, channel]);
      }
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l’indexation.');
    }
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) {
      alert("Veuillez entrer un mot-clé.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/search?q=${search}`);
      setVideos(res.data);
      setCurrentPage(1);
    } catch (err) {
      if (err.response?.status === 404) {
        alert("Aucun résultat trouvé.");
        setVideos([]);
      } else {
        alert("Une erreur est survenue.");
      }
    }
    setLoading(false);
  };

  const handleClearDatabase = async () => {
    if (!window.confirm('Confirmez-vous la suppression de toutes les vidéos de la base ?')) return;
    setLoading(true);
    try {
      await axios.delete('http://localhost:5000/api/clear');
      setVideos([]);
      setCurrentPage(1);
      alert('Base de données vidée avec succès.');
    } catch (err) {
      console.error(err);
      alert('Erreur lors du vidage de la base.');
    }
    setLoading(false);
  };

  const handleClearHistory = () => {
    if (!window.confirm('Voulez-vous vraiment vider l’historique des chaînes ?')) return;
    localStorage.removeItem('history');
    setHistory([]);
    alert('Historique vidé avec succès.');
  };

  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo);
  const totalPages = Math.ceil(videos.length / videosPerPage);

  return (
    <div className={`page-wrapper ${theme}`}>
      <div className="container">
        <div className="header">
          <h1>Recherche YouTube</h1>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️ Thème clair' : '🌙 Thème sombre'}
          </button>
        </div>

        <div className="form-row">
          <input
            type="text"
            value={channelInput}
            onChange={e => setChannelInput(e.target.value)}
            placeholder="Nom de chaîne ou channel-id"
          />
          <button onClick={() => handleIndexing()}>Indexer</button>
        </div>

        {history.length > 0 && (
          <div className="form-row">
            <select onChange={e => handleIndexing(e.target.value)} defaultValue="">
              <option value="" disabled>📜 Historique des chaînes</option>
              {history.map((ch, index) => (
                <option key={index} value={ch}>{ch}</option>
              ))}
            </select>
            <button className="clear-history-btn" onClick={handleClearHistory}>Vider l’historique</button>
          </div>
        )}

        <form onSubmit={handleSearch} className="form-row">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par mots-clés"
          />
          <button type="submit">Rechercher</button>
        </form>

        <div className="form-row">
          <button className="clear-btn" onClick={handleClearDatabase}>🗑️ Vider la base</button>
        </div>

        {loading && <div className="loader"></div>}

        {videos.length > 0 && (
          <>
            <p className="video-count">{videos.length} vidéos trouvées</p>
            <div className="video-grid">
              {currentVideos.map(video => (
                <div key={video.id} className="video-card">
                  <img src={video.thumbnail} alt={video.title} />
                  <h4>{video.title}</h4>
                  <p>{video.description.slice(0, 80)}...</p>
                  <p className="date">📅 {new Date(video.publishedAt).toLocaleDateString()}</p>
                  <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noreferrer">
                    Voir sur YouTube
                  </a>
                </div>
              ))}
            </div>

            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? 'active' : ''}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
