# दृष्टि (Drishti) — Voice-Based Coding Tutor for Visually Impaired People
## Full Project Summary & Continuation Notes (Updated)

---

## What it is

**दृष्टि (Drishti)** — meaning "vision" in Hindi, tagline *"जहाँ code बोलता है"* ("where code speaks") — is a **voice-first coding education platform built for visually impaired learners** in India. It teaches programming through voice interaction, keyboard shortcuts, and screen-reader-friendly design, with no reliance on visual UI.

The learner is guided throughout by **Pyra**, an AI tutor voiced via the browser's Web Speech API.

---

## The experience, end to end (current flow)

```
Intro → Instruction Language → Programming Language → Lessons → MCQ Quiz → AI Code Agent → Certificate
```

1. **Intro (`/`)** — Pyra introduces herself, asks for the learner's name (typed or spoken). Shortcuts: P (hear intro), T (speak name), N (advance), R (repeat), H (confirm yes).
2. **Instruction Language (`/instruction-language`)** — Hindi / English / Marathi.
3. **Programming Language (`/language`)** — Python / SQL / JavaScript (Java/C++ "coming soon"). **Now fully localized** — speaks and displays in the chosen instruction language.
4. **Lessons (`/lessons`)** — 15 lessons (Python) / 10 lessons (SQL, JavaScript), each with explanation + analogy + code example, in all 3 languages.
5. **MCQ Quiz (`/mcq`)** — 40 questions per subject, in all 3 languages.
6. **AI Code Agent (`/agent`)** — Learner describes a task; Groq's Llama 3.1 generates and runs real Python code server-side.
7. **Certificate (`/certificate`)** — Printable certificate with name, score, grade, date, certificate ID.

**⚠️ This flow is about to change** — see "In Progress" section below; we are adding Register/Login as new first steps, and may reorder language selection to come even earlier for accessibility reasons (see Known Issues).

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite (`http://localhost:5173`) |
| Backend | Python + FastAPI (`http://127.0.0.1:8000`) |
| AI | Groq API (free tier), model `llama-3.1-8b-instant` |
| Voice | Browser-native Web Speech API |
| Routing / State | React Router v6, `location.state` |
| Persistence (legacy) | `localStorage` — being phased out in favor of a real database (see below) |
| Database (new, in progress) | SQLite via SQLAlchemy |
| Password security (new, in progress) | passlib (bcrypt) |

### Backend endpoints (`backend/main.py`)
- `POST /chat` — general Pyra chatbot (lightly used)
- `POST /get-lesson` — AI-generated personalized lesson explanation
- `POST /generate-code` — natural language → generated Python code → executed via `subprocess` → returns code + output
- `POST /register` **(new, just added)** — creates a user account (name, email, bcrypt-hashed password) in the database
- `POST /login` **(new, just added)** — verifies email/password against the database

The Groq API key lives in `backend/.env` as `GROQ_API_KEY` (private, not shared).

---

## Folder structure (current)

```
CODE/
├── .gitignore
├── backend/
│   ├── main.py            # FastAPI app — /chat, /get-lesson, /generate-code, /register, /login
│   ├── database.py        # NEW — SQLAlchemy models (User, Progress) + SQLite setup
│   ├── drishti.db          # NEW — SQLite database file (auto-created on first run)
│   ├── .env                # GROQ_API_KEY (private)
│   └── .gitignore
└── frontend/
    ├── public/
    │   ├── favicon.svg
    │   └── icons.svg
    └── src/
        ├── App.jsx
        ├── App.css
        ├── main.jsx
        ├── index.css
        ├── assets/
        ├── components/
        │   ├── Navbar.jsx         # Compacted — smaller padding/fonts (recent fix)
        │   ├── ProgressBar.jsx    # Simplified to compact single-line bar (recent fix)
        │   ├── LessonSidebar.jsx
        │   ├── speak.js           # Shared TTS helper (still Hindi-only — see Known Issues)
        │   ├── translations.js    # UI strings: Hindi / English / Marathi + pressT/pressC/pressF keys (added)
        │   └── useTheme.js
        └── pages/
            ├── IntroPage.jsx               # "Python" mentions removed; still Hindi-only by design (pre-language-choice)
            ├── InstructionLanguagePage.jsx # Has its own multi-language speak(); Marathi routed to Hindi voice
            ├── LanguagePage.jsx            # Rewritten — fully localized, proper voice-finish-then-navigate, emoji stripped from speech
            ├── LessonsPage.jsx            # instructionLang threading fixed; layout fixed; voice priority fixed (Zira)
            ├── MCQPage.jsx                # Score now saved to localStorage; hardcoded "20" fixed to questions.length; voice fixed; layout fixed
            ├── AgentPage.jsx              # pressT/C/F localized; voice fixed; certificate button now passes instructionLang; agent_visited now requires actually generating code; layout fixed
            └── CertificatePage.jsx        # Own multi-language speak() added (Zira/Hindi voice); no longer uses shared speak.js
```

**Routing (`App.jsx`)** — current, will change once Register/Login are added:
```
/                       → IntroPage
/instruction-language   → InstructionLanguagePage
/language               → LanguagePage
/lessons                → LessonsPage
/mcq                    → MCQPage
/agent                  → AgentPage
/certificate            → CertificatePage
```

---

## Everything fixed so far (chronological)

1. **MCQ score persistence** — `localStorage.setItem("mcq_score", ...)` added; certificate was always showing 0.
2. **Hardcoded "20 questions"** in MCQ completion message fixed to use `questions.length` (actual count is 40).
3. **`MCQPage.jsx` brace bug** — a duplicated/malformed `nextQuestion()` function broke the Vite build; cleaned up.
4. **Voice input language** — `SpeechRecognition.lang` changed from hardcoded `"hi-IN"` to `lang.voiceLang` in Lessons/MCQ/Agent pages.
5. **`LanguagePage.jsx` fully rewritten** — was 100% hardcoded Hindi; now speaks/displays correctly per `instructionLang`.
6. **Cut-off speech on page navigation** — pages were using `setTimeout` with a guessed delay before navigating; changed to navigate only inside the `onEnd` callback of `speak()`, so sentences finish before the page changes. Fixed in `IntroPage.jsx`, `InstructionLanguagePage.jsx`, `LanguagePage.jsx`.
7. **Premature "Python" mentions removed** from `IntroPage.jsx` (both `welcomeMessage()`, `hearIntro()`, and `handleNameSubmit()` — spoken and on-screen text) since the programming language hasn't been chosen yet at that point.
8. **English voice was male ("Microsoft David")** — fixed by explicitly preferring `"Microsoft Zira - English (United States)"` in the voice-matching logic. Had to fix a **logic bug** where `.find()`'s OR-chain let `v.lang === lang.voiceLang` match David before Zira was ever checked — rewritten with explicit priority (try exact name match first, fall back to language-only match). Applied to `LessonsPage.jsx`, `MCQPage.jsx`, `AgentPage.jsx`, `CertificatePage.jsx`.
9. **Marathi has no installed system voice** — routed Marathi speech through the Hindi female voice ("Google हिन्दी") instead of leaving it unmatched. Fixed in `InstructionLanguagePage.jsx`, `LanguagePage.jsx` (Lessons/MCQ/Agent already did this correctly via `translations.js`).
10. **`AgentPage.jsx` partially hardcoded Hindi instructions** — added `pressT`, `pressC`, `pressF` keys to `translations.js` (all 3 languages) and updated the welcome `useEffect` to use them instead of raw Hindi strings.
11. **Certificate button (not the F key) was missing `instructionLang`** in its navigation state — fixed.
12. **Certificate page voice always Hindi** — was using the shared `speak.js` (hardcoded `hi-IN`); gave `CertificatePage.jsx` its own proper multi-language `speak()` matching the other pages.
13. **Emoji being read aloud** ("snake Python selected", "globe JavaScript selected") — added a clean `name` field (no emoji) to each language object in `LanguagePage.jsx`, used for speech instead of the emoji-containing `label`.
14. **Removed "Keyboard Shortcuts" reference boxes** from all 7 pages (Intro, InstructionLanguage, Language, Lessons, MCQ, Agent, Certificate) — purely cosmetic, the actual shortcuts still work.
15. **Layout gap after removing shortcuts boxes** — Lessons/MCQ/Agent pages used a 2-column grid (`auto 1fr 300px` or `1fr 300px`) where the right column became nearly empty; collapsed to single/two-column layout and moved `ProgressBar` into the main column.
16. **`ProgressBar` simplified** — was a large card with a 3-box grid; now a compact single-line bar with percentage.
17. **`ProgressBar` repositioned** — moved from above the page heading to below it, on Lessons/MCQ/Agent pages.
18. **`Navbar` shrunk** — reduced padding, font sizes, and removed `<br />` line breaks in buttons to reduce vertical height.
19. **`agent_visited` logic fixed** — was set to `"true"` just by opening the Agent page; now only set after a code generation request actually succeeds.

---

## Known issues / not yet fixed

| Issue | Notes |
|---|---|
| **`IntroPage.jsx` and the very first language-choice screen are Hindi-only** | A blind learner who doesn't understand Hindi has no way to understand the initial instructions to even reach the language picker. **Discussed solution (Option A, agreed but not yet built):** reorder so language selection happens first, with each language name spoken in its own voice back-to-back (e.g. "हिंदी के लिए 1 दबाएं... For English press 2... मराठीसाठी 3 दाबा") so a non-Hindi speaker can recognize their language by ear. Auto-detection via `navigator.language` was also discussed as a future layer on top of this. |
| **`speak.js` (the shared, unused-by-most-pages utility)** | Still hardcoded to `hi-IN` only. Not currently imported anywhere critical anymore (Certificate page removed its dependency on it; Lessons/MCQ/Agent have their own local `speak()`), but worth removing/cleaning up if confirmed unused, or fixing if still referenced somewhere (e.g. `LessonSidebar.jsx` may still receive a `speak` prop from a parent — verify before deleting `speak.js`). |
| **`useTheme.js` doesn't persist `fontSize`/`speed` on change**, only reads them once on load (only `theme` writes back automatically) | Low priority cosmetic bug. |
| **Progress tracking still per-browser via `localStorage`, not per-account** | This is being actively replaced by the new database-backed system (see "In Progress" below). |
| **No password reset / email verification** | Deliberately skipped per your direction — simple email+password only, helper usually types it in for the learner. |

---

## 🚧 IN PROGRESS — Register / Login feature (where we left off)

**Decision made:** Build a real backend-persisted account system (not just local-only), with progress tied to each account, simple email+password (no verification/recovery).

### Completed so far:
1. **Backend packages installed:** `sqlalchemy`, `passlib[bcrypt]`, `python-jose`
2. **`backend/database.py` created** — defines:
   - `User` table: `id`, `name`, `email` (unique), `password_hash`
   - `Progress` table: `id`, `user_id`, `language`, `lessons_done`, `mcq_done`, `mcq_score`, `agent_done` — one row per user **per programming language**
   - `init_db()` function to create the SQLite file/tables on startup
3. **`backend/main.py` updated** with:
   - New imports (`CryptContext` from passlib, `init_db`/`SessionLocal`/`User`/`Progress` from `database`)
   - `init_db()` called on startup, `pwd_context` created for hashing
   - New Pydantic models: `RegisterRequest` (name, email, password), `LoginRequest` (email, password)
   - New endpoint `POST /register` — checks for duplicate email, hashes password, creates user, returns `{success, user_id, name}`
   - New endpoint `POST /login` — verifies email + password against stored hash, returns `{success, user_id, name}`

### Next steps (not yet done):
1. **Test `/register` and `/login` via curl/Postman** before touching the frontend (was about to do this when the conversation ended — run the backend with `uvicorn main:app --reload` and test registration)
2. **Test `/login`** the same way using the registered credentials
3. **Build `RegisterPage.jsx`** — name, email, password fields; voice-guided where possible; calls `/register`; on success, navigates into the app with the returned `user_id`/`name`
4. **Build `LoginPage.jsx`** — email, password fields; calls `/login`; on success, same as above
5. **Update `App.jsx` routing** — add `/register` and `/login` routes; decide what the new "first" route is (likely Login, with a link to Register)
6. **Update `IntroPage.jsx`** — no longer needs to ask for the learner's name via voice/typing (since it now comes from the logged-in account); should just greet them by name directly
7. **Add `user_id` to the route state** passed through the whole app (alongside `name`, `language`, `instructionLang`) so progress can be saved against the right account
8. **Add progress-saving endpoints** (e.g. `POST /progress/update`, `GET /progress/{user_id}`) so Lessons/MCQ/Agent pages read and write to the `Progress` table instead of `localStorage`
9. **Migrate Lessons/MCQ/Agent pages** to call these new endpoints instead of `localStorage.setItem("lessons_done", ...)` etc.
10. **Build the reordered language-selection-first flow** (Option A from Known Issues) — likely slotting in right after login, before the existing Intro/name step (which itself may become unnecessary once accounts exist)

### Important context for continuing:
- We were about to run this test command when the conversation ended:
  ```powershell
  curl -X POST http://127.0.0.1:8000/register -H "Content-Type: application/json" -d "{\"name\": \"Test User\", \"email\": \"test@test.com\", \"password\": \"test123\"}"
  ```
- No frontend work has started yet for Register/Login — only backend.
- The user (project owner) has emphasized going **one step at a time**, testing after each change, since several earlier edits silently failed to save and caused confusing repeated debugging (e.g. the MCQ brace bug, the Zira voice fix not landing in `MCQPage.jsx`/`AgentPage.jsx` initially). **Recommend continuing this careful, incremental style** — always ask to see the current file content before assuming an edit landed correctly, rather than assuming.

---

## Roadmap (longer-term, not started)

- More programming languages: Java, C++, HTML/CSS
- Score history tracking across multiple sessions (partially superseded by the new account-based progress system)
- Public deployment: frontend on Vercel, backend on Render (note: SQLite + `subprocess`-based code execution will need reconsideration for a real public deployment — SQLite file storage and arbitrary code execution both behave differently/riskier in a hosted environment)
- Dedicated Marathi text-to-speech voice support (currently falls back to Hindi voice)
- Possible auto-detection of instruction language via `navigator.language`

---

*Document updated June 23, 2026, reflecting all fixes made through this point and the in-progress Register/Login feature.*