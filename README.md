# Flashcard Revision App

A modern, interactive flashcard revision platform for students, featuring subject-wise flashcards, daily MCQ quizzes, PDF notes upload, and a full admin dashboard.

## Features

- **Modern UI/UX**: Responsive, animated interface using Tailwind CSS.
- **Subjects & Chapters**: DBMS, Java, IPCV, Data Analysis, Probability Theory (5 chapters each, 15 flashcards per chapter).
- **Daily Quiz**: Randomized MCQ quiz for daily practice, with backend tracking.
- **Admin Dashboard**: Add/edit/delete subjects, chapters, flashcards, and upload PDF notes per chapter.
- **PDF Notes Upload**: Admins can upload and overwrite chapter notes (PDFs) with error handling.
- **User Authentication**: Login/signup system (with planned user progress tracking).
- **Leaderboard**: Track top quiz performers.
- **Robust Error Handling**: User-friendly feedback for all actions.

## Major Libraries & Tools

- **Backend**: Node.js, Express.js, SQLite3
- **Frontend**: HTML, Tailwind CSS, Vanilla JS
- **Database**: SQLite (seeded with schema.sql and seed.sql)
- **PDF Upload**: Multer (Express middleware)
- **Local Server**: [http-server](https://www.npmjs.com/package/http-server) for frontend (optional)

## Project Structure

```
flashcard-backend/
  ├── index.js           # Express backend API
  ├── db.js              # DB connection logic
  ├── schema.sql         # DB schema
  ├── seed.sql           # Seed data (subjects, chapters, flashcards, MCQs)
  └── flashcards.db      # SQLite database
html/
  ├── index.html         # Home page
  ├── dashboard.html     # User dashboard
  ├── subject.html       # Subject/chapter view
  ├── flashcard.html     # Flashcard study UI
  ├── daily-quiz.html    # Daily quiz UI
  ├── admin.html         # Admin dashboard
  └── ...                # Other pages (login, signup, profile, leaderboard)
js/
  └── auth.js            # Auth logic (if used)
notes/
  └── *.pdf              # Uploaded notes
```

## How to Run

1. **Install dependencies** (in `flashcard-backend/`):
   ```
   npm install
   ```
2. **(Optional) Reseed the database** (only if you want to reset data):
   ```
   # WARNING: This will erase all current data!
   sqlite3 flashcard-backend/flashcards.db < flashcard-backend/seed.sql
   ```
3. **Start the backend server**:
   ```
   node flashcard-backend/index.js
   ```
4. **Serve the frontend** (recommended):
   ```
   npx http-server html -p 5501
   # Then open http://localhost:5501 in your browser
   ```

## API Endpoints (Major)

- `GET /api/subjects` — List all subjects
- `GET /api/chapters/:subjectId` — List chapters for a subject
- `GET /api/flashcards/:chapterId` — List flashcards for a chapter
- `POST /api/admin/subjects` — Add subject (admin)
- `POST /api/admin/chapters` — Add chapter (admin)
- `POST /api/admin/flashcards` — Add flashcard (admin)
- `POST /api/admin/upload-notes` — Upload PDF notes (admin)
- `GET /api/quiz/daily` — Get daily quiz questions

## Major Functions

- **loadSubjects, loadChapters, loadFlashcardsByChapter**: Dynamic loading of data in admin and user UIs.
- **PDF Upload Handler**: Handles PDF upload, overwrite, and error feedback.
- **Quiz Logic**: Random MCQ selection and answer validation.
- **CRUD Operations**: For subjects, chapters, flashcards (admin only).

## Notes
- Do NOT re-run `seed.sql` unless you want to reset all data.
- Starting the backend server does NOT duplicate data.
- All admin actions are available at `/admin.html`.

---

© 2025 Flashcard Revision. All rights reserved.
