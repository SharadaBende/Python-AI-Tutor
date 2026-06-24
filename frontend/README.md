दृष्टि (Drishti) — Full Project Summary
Updated: June 24, 2026

What it is
दृष्टि (Drishti) — meaning "vision" in Hindi, tagline "जहाँ code बोलता है" ("where code speaks") — is a voice-first coding education platform built for visually impaired learners in India. It teaches programming through voice interaction, keyboard shortcuts, and screen-reader-friendly design, with no reliance on visual UI.
The learner is guided throughout by Pyra, an AI tutor voiced via the browser's Web Speech API.

The experience, end to end (current flow)
Language Selection → Login → (new user?) → Register → Intro → Programming Language → Lessons → MCQ Quiz → AI Code Agent → Certificate

Language Selection (/) — NOW FIRST PAGE. Pyra speaks all 3 languages back-to-back ("1 दबाएं हिंदी के लिए... For English press 2... मराठीसाठी 3 दाबा"). User picks instruction language before anything else.
Login (/login) — Voice-guided in chosen language. Email + password. Link to Register.
Register (/register) — Voice-guided in chosen language. Name + email + password. On success goes to Intro.
Intro (/intro) — Pyra greets user by name (from account). No name entry needed. H to proceed.
Programming Language (/language) — Python / SQL / JavaScript. Fully localized.
Lessons (/lessons) — 15 lessons (Python) / 10 lessons (SQL, JavaScript).
MCQ Quiz (/mcq) — 40 questions per subject, all 3 languages.
AI Code Agent (/agent) — Natural language → real Python code via Groq.
Certificate (/certificate) — Printable with name, score, grade, date, certificate ID.


Tech stack
LayerTechnologyFrontendReact + Vite (http://localhost:5173)BackendPython + FastAPI (http://127.0.0.1:8000)AIGroq API (free tier), model llama-3.1-8b-instantVoiceBrowser-native Web Speech APIRouting / StateReact Router v6, location.statePersistenceSQLite via SQLAlchemy (replaced localStorage for auth)Password securitypasslib with sha256_crypt (bcrypt had Windows dependency issue)
Backend endpoints (backend/main.py)

POST /chat — general Pyra chatbot
POST /get-lesson — AI-generated personalized lesson
POST /generate-code — natural language → Python code → executed → returns output
POST /register — creates user (name, email, sha256-hashed password) in SQLite
POST /login — verifies email + password, returns {success, user_id, name}


Folder structure (current)
CODE/
├── backend/
│   ├── main.py            # FastAPI — all endpoints including /register, /login
│   ├── database.py        # SQLAlchemy models: User, Progress + SQLite setup
│   ├── drishti.db         # SQLite database (auto-created)
│   ├── .env               # GROQ_API_KEY
│   └── .gitignore
└── frontend/
    └── src/
        ├── App.jsx                        # Updated routing
        ├── components/
        │   ├── Navbar.jsx
        │   ├── ProgressBar.jsx
        │   ├── LessonSidebar.jsx
        │   ├── speak.js                   # Legacy, mostly unused
        │   ├── translations.js
        │   └── useTheme.js
        └── pages/
            ├── InstructionLanguagePage.jsx  # NOW FIRST — redesigned
            ├── LoginPage.jsx                # NEW
            ├── RegisterPage.jsx             # NEW
            ├── IntroPage.jsx                # Rewritten — greets by account name
            ├── LanguagePage.jsx
            ├── LessonsPage.jsx
            ├── MCQPage.jsx
            ├── AgentPage.jsx
            └── CertificatePage.jsx
Routing (App.jsx) — current:
/               → InstructionLanguagePage  (first page)
/login          → LoginPage
/register       → RegisterPage
/intro          → IntroPage
/language       → LanguagePage
/lessons        → LessonsPage
/mcq            → MCQPage
/agent          → AgentPage
/certificate    → CertificatePage
Route state passed through the app:
instructionLang → from / onwards
user_id + name  → from /login or /register onwards
language        → from /language onwards

Everything completed so far
Backend

database.py created — User and Progress SQLAlchemy models, SQLite setup
/register endpoint — duplicate email check, sha256 password hash, returns {success, user_id, name}
/login endpoint — verifies email + password hash, returns {success, user_id, name}
Switched from bcrypt to sha256_crypt — bcrypt had a Windows dependency issue
Both endpoints tested and verified via PowerShell

Frontend — flow changes

InstructionLanguagePage.jsx — made first page, speaks all 3 languages on load, navigates to /login
LoginPage.jsx — NEW, voice-guided in chosen language, calls /login, passes user_id + name + instructionLang forward
RegisterPage.jsx — NEW, voice-guided in chosen language, calls /register, same state forward
IntroPage.jsx — rewritten, gets name from account (no voice name entry), greets directly, H key → /language
App.jsx — routing updated with all new pages and paths

Frontend — design (in progress)

InstructionLanguagePage.jsx — redesigned with new visual style:

Dark background with subtle glow blobs
Title shows all 3 languages: दृष्टि · Drishti · दृष्टী
Tagline in all 3 languages
Glassmorphism language cards with hover lift
Saffron orange accent color for badges and highlights
Shortcut pills at bottom
Removed purple gradient text (was clipping Devanagari)
Removed eye emoji




🚧 IN PROGRESS — Design redesign
Problem
The current design across all pages is too "default dark purple" — looks generic, not like a personal project. The purple theme is overused and heavy.
Agreed new design direction

Background — very dark navy/charcoal (#0d0d0d to #111827), not purple
Primary accent — saffron/orange (#f4a261) — Drishti brand color
Text — soft white/cream, no gradient text on Devanagari
Cards — dark glass, subtle border, no purple tint
Buttons — saffron primary, dark secondary
Overall feel — dark + saffron, premium Indian ed-tech, less gaming purple

Pages redesigned so far:

✅ InstructionLanguagePage.jsx

Pages still to redesign (in order):

⬜ LoginPage.jsx
⬜ RegisterPage.jsx
⬜ IntroPage.jsx
⬜ LanguagePage.jsx
⬜ LessonsPage.jsx
⬜ MCQPage.jsx
⬜ AgentPage.jsx
⬜ CertificatePage.jsx


Known issues / not yet fixed
IssueNotesspeak.js still hardcoded hi-INMostly unused now but still imported in some places — clean up lateruseTheme.js doesn't persist fontSize/speed on changeLow priority cosmetic bugProgress tracking still uses localStorageWill be replaced by /progress backend endpointsNo password reset / email verificationDeliberately skipped — helper types credentials for learneruser_id not yet used for progress savingBackend Progress table exists but no endpoints wired up yet

Roadmap — next steps in order

Finish design redesign — apply dark + saffron theme to all remaining 8 pages
Add progress endpoints — POST /progress/update, GET /progress/{user_id}
Wire progress to account — Lessons/MCQ/Agent write to DB instead of localStorage
More programming languages — Java, C++, HTML/CSS
Public deployment — Vercel (frontend) + Render (backend), SQLite → PostgreSQL