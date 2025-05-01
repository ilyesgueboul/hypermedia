const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const db = require('./database');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/api/index', async (req, res) => {
  const channelInput = req.query.channel;
  const apiKey = process.env.YOUTUBE_API_KEY;

  let channelId = channelInput;

  if (!channelInput.startsWith('UC')) {
  try {
    const query = channelInput.replace('@', '').trim();

    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: apiKey,
        q: query,
        type: 'channel',
        part: 'snippet',
        maxResults: 3
      }
    });

    if (response.data.items.length === 0) {
      return res.status(404).json({ error: 'Chaîne non trouvée' });
    }

    const result = response.data.items[0];
    channelId = result.id.channelId;

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur lors de la recherche du nom de chaîne' });
  }
}


  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        key: apiKey,
        channelId: channelId,
        part: 'snippet',
        maxResults: 20,
        order: 'date',
		type: 'video'
      }
    });

    const videos = response.data.items
  .filter(item => item.id.videoId)
  .map(item => ({
    id: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails.medium.url,
    publishedAt: item.snippet.publishedAt,
    channelId: item.snippet.channelId,
    channelTitle: item.snippet.channelTitle
  }));


    const stmt = db.prepare(`
  INSERT OR IGNORE INTO videos (id, title, description, thumbnail, publishedAt, channelId, channelTitle)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);


    videos.forEach(video => {
  stmt.run(
    video.id,
    video.title,
    video.description,
    video.thumbnail,
    video.publishedAt,
    video.channelId,
    video.channelTitle
  );
});


    stmt.finalize();

    res.json({ success: true, videosAdded: videos.length, videos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l’indexation' });
  }
});

app.get('/api/search', (req, res) => {
  const keyword = req.query.q;

  if (!keyword || keyword.trim() === '') {
    return res.status(400).json({ error: 'Aucun mot-clé fourni' });
  }

  db.all(
    `SELECT * FROM videos WHERE title LIKE ? OR description LIKE ? ORDER BY publishedAt DESC`,
    [`%${keyword}%`, `%${keyword}%`],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur lors de la recherche' });
      }

      res.json(rows);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});

app.delete('/api/clear', (req, res) => {
  db.run('DELETE FROM videos', function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur lors du vidage de la base' });
    }

    db.run('VACUUM', (vacuumErr) => {
      if (vacuumErr) {
        console.error(vacuumErr);
        return res.status(500).json({ error: 'Erreur lors du compactage de la base' });
      }

      res.json({ success: true, message: 'Base vidée et compactée avec succès' });
    });
  });
});


