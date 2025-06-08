const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, 'flashcards.db'), (err) => {
    if (err) console.error('Database error:', err.message);
    else console.log('Connected to flashcards.db');
});

module.exports = db;