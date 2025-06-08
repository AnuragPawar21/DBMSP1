const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const cors = require('cors');
const db = require('./db');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
    origin: [
        'http://127.0.0.1:5501',
        'http://localhost:3000',
        'http://127.0.0.1:5507',
        'http://localhost:5507'
    ], // include your frontend origin(s)
    credentials: true
}));

app.use(express.json());
app.use(session({
    secret: 'revise123', // use .env for production
    resave: false,
    saveUninitialized: false
}));

// Serve notes folder statically for PDF access
app.use('/notes', express.static(path.join(__dirname, '../notes')));

// Create tables if not exists
const schemaPath = path.join(__dirname, 'schema.sql');
const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
db.exec(schemaSQL, (err) => {
    if (err) console.error('Error creating tables:', err.message);
    else console.log('Tables created or already exist.');
});
// Seed data
/*
const seedPath = path.join(__dirname, 'seed.sql');
const seedSQL = fs.readFileSync(seedPath, 'utf8');

db.exec(seedSQL, (err) => {
    if (err) {
        console.error('Seeding error:', err.message);
    } else {
        console.log('✅ Seed data inserted successfully.');
    }
}); */


// Register
app.post('/api/register', async(req, res) => {
    const { username, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`;
    db.run(sql, [username, email, hash], function(err) {
        if (err) return res.status(400).json({ error: 'User exists or invalid data.' });
        res.json({ id: this.lastID, username });
    });
});

// Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async(err, user) => {
        if (err || !user) return res.status(400).json({ error: 'User not found.' });

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(401).json({ error: 'Invalid credentials.' });

        req.session.user = { id: user.id, username: user.username };
        res.json({ id: user.id, username: user.username });
    });
});

// Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out' });
});

// Check if logged in
app.get('/api/profile', (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });
    res.json(req.session.user);
});
app.get('/api/subjects', (req, res) => {
    db.all(`SELECT * FROM subjects`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/chapters/:subjectId', (req, res) => {
    const subjectId = req.params.subjectId;

    db.all(`SELECT * FROM chapters WHERE subject_id = ?`, [subjectId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/flashcards/:chapterId', (req, res) => {
    const chapterId = req.params.chapterId;

    db.all(`SELECT * FROM flashcards WHERE chapter_id = ?`, [chapterId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Track User Progress
app.post('/api/progress', (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });

    const { chapterId, flashcardsReviewed } = req.body;
    const userId = req.session.user.id;

    const sql = `
    INSERT INTO user_progress (user_id, chapter_id, flashcards_reviewed)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id, chapter_id)
    DO UPDATE SET flashcards_reviewed = ?, last_reviewed = CURRENT_TIMESTAMP
  `;

    db.run(sql, [userId, chapterId, flashcardsReviewed, flashcardsReviewed], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Progress saved' });
    });
});

//Leaderboard
app.get('/api/leaderboard', (req, res) => {
    const sql = `
    SELECT u.username, SUM(p.flashcards_reviewed) AS total_reviewed
    FROM user_progress p
    JOIN users u ON u.id = p.user_id
    GROUP BY p.user_id
    ORDER BY total_reviewed DESC
    LIMIT 10
  `;

    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// --- Admin API - Manage Subjects and Flashcards ---
// Get all subjects
app.get('/api/admin/subjects', (req, res) => {
    db.all('SELECT * FROM subjects', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Add a new subject
app.post('/api/admin/subjects', (req, res) => {
    const { name } = req.body;
    const sql = 'INSERT INTO subjects (name) VALUES (?)';
    db.run(sql, [name], function(err) {
        if (err) return res.status(400).json({ error: 'Subject already exists.' });
        res.json({ id: this.lastID, name });
    });
});

// Update a subject
app.put('/api/admin/subjects/:id', (req, res) => {
    const { name } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE subjects SET name = ? WHERE id = ?';
    db.run(sql, [name, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// Delete a subject (and its chapters and flashcards)
app.delete('/api/admin/subjects/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM subjects WHERE id = ?', [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        db.run('DELETE FROM chapters WHERE subject_id = ?', [id], function(err2) {
            if (err2) return res.status(500).json({ error: err2.message });
            db.run('DELETE FROM flashcards WHERE chapter_id IN (SELECT id FROM chapters WHERE subject_id = ?)', [id], function(err3) {
                if (err3) return res.status(500).json({ error: err3.message });
                res.json({ success: true });
            });
        });
    });
});

// --- Flashcard CRUD for Admin ---
// Get all chapters for a subject (for chapter selection in admin)
app.get('/api/admin/chapters/:subjectId', (req, res) => {
    const subjectId = req.params.subjectId;
    db.all('SELECT id, chapter_number, title FROM chapters WHERE subject_id = ? LIMIT 5', [subjectId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Get all flashcards for a chapter (for editing by chapter)
app.get('/api/admin/flashcards/chapter/:chapterId', (req, res) => {
    const chapterId = req.params.chapterId;
    db.all('SELECT id, question, answer FROM flashcards WHERE chapter_id = ?', [chapterId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Get all flashcards for a subject (across all chapters)
app.get('/api/admin/flashcards/:subjectId', (req, res) => {
    const subjectId = req.params.subjectId;
    const sql = `SELECT f.id, f.question, f.answer FROM flashcards f
                JOIN chapters c ON f.chapter_id = c.id
                WHERE c.subject_id = ?`;
    db.all(sql, [subjectId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Add a flashcard (to a specific chapter if provided, else to the first/default chapter)
app.post('/api/admin/flashcards', (req, res) => {
    const { subjectId, chapterId, question, answer } = req.body;

    function insertFlashcard(chapId) {
        db.run('INSERT INTO flashcards (chapter_id, question, answer) VALUES (?, ?, ?)', [chapId, question, answer], function(err2) {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ id: this.lastID, question, answer });
        });
    }
    if (chapterId) {
        insertFlashcard(chapterId);
    } else if (subjectId) {
        db.get('SELECT id FROM chapters WHERE subject_id = ? LIMIT 1', [subjectId], (err, chapter) => {
            if (err) return res.status(500).json({ error: err.message });
            if (chapter) {
                insertFlashcard(chapter.id);
            } else {
                db.run('INSERT INTO chapters (subject_id, name) VALUES (?, ?)', [subjectId, 'Default'], function(err2) {
                    if (err2) return res.status(500).json({ error: err2.message });
                    insertFlashcard(this.lastID);
                });
            }
        });
    } else {
        res.status(400).json({ error: 'No subject or chapter specified' });
    }
});

// Update a flashcard
app.put('/api/admin/flashcards/:id', (req, res) => {
    const { question, answer } = req.body;
    const flashcardId = req.params.id;
    const sql = `UPDATE flashcards SET question = ?, answer = ? WHERE id = ?`;
    db.run(sql, [question, answer, flashcardId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Flashcard updated successfully' });
    });
});

// Delete a flashcard
app.delete('/api/admin/flashcards/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM flashcards WHERE id = ?', [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// Add a new chapter
app.post('/api/admin/chapters', (req, res) => {
    const { subjectId, chapter_number, title } = req.body;
    const sql = 'INSERT INTO chapters (subject_id, chapter_number, title) VALUES (?, ?, ?)';
    db.run(sql, [subjectId, chapter_number, title], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ id: this.lastID, subjectId, chapter_number, title });
    });
});

// Update a chapter
app.put('/api/admin/chapters/:id', (req, res) => {
    const { chapter_number, title } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE chapters SET chapter_number = ?, title = ? WHERE id = ?';
    db.run(sql, [chapter_number, title, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// Delete a chapter (and its flashcards)
app.delete('/api/admin/chapters/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM flashcards WHERE chapter_id = ?', [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        db.run('DELETE FROM chapters WHERE id = ?', [id], function(err2) {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ success: true });
        });
    });
});
// --- End Admin API ---

// --- User Progress by Subject API ---
app.get('/api/user/progress', (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });
    const userId = req.session.user.id;
    // For each subject, get total flashcards and reviewed flashcards by user
    const sql = `
        SELECT s.id as subjectId, s.name as subjectName,
            COUNT(f.id) as totalFlashcards,
            COALESCE(SUM(up.flashcards_reviewed), 0) as reviewedFlashcards
        FROM subjects s
        LEFT JOIN chapters c ON c.subject_id = s.id
        LEFT JOIN flashcards f ON f.chapter_id = c.id
        LEFT JOIN user_progress up ON up.chapter_id = c.id AND up.user_id = ?
        GROUP BY s.id
    `;
    db.all(sql, [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// --- Upload Notes PDF for a Chapter ---
const notesDir = path.join(__dirname, '../notes');
if (!fs.existsSync(notesDir)) {
    fs.mkdirSync(notesDir);
}

// Helper: get subject key (slug) from subjectId
function getSubjectKey(subjectId, cb) {
    db.get('SELECT name FROM subjects WHERE id = ?', [subjectId], (err, subject) => {
        if (err || !subject) return cb('invalid');
        let key = subject.name.toLowerCase().replace(/ /g, '-');
        cb(key);
    });
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, notesDir);
    },
    filename: function(req, file, cb) {
        const { subjectId, chapterId } = req.body;
        getSubjectKey(subjectId, (key) => {
            cb(null, `${key}-chapter-${chapterId}.pdf`);
        });
    }
});
const upload = multer({ storage: storage });

app.post('/api/admin/upload-notes', upload.single('pdf'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ success: true, filename: req.file.filename });
});

// --- API: Get 5 random MCQs for daily quiz ---
app.get('/api/daily-mcqs', (req, res) => {
    // Get 5 random MCQs from all subjects (or filter by subject if needed)
    db.all('SELECT * FROM mcqs ORDER BY RANDOM() LIMIT 5', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});