const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./videos.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS videos (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    thumbnail TEXT,
    publishedAt TEXT,
    channelId TEXT,
    channelTitle TEXT
  )`);
});

module.exports = db;
