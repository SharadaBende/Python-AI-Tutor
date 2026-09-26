# दृष्टि (Drishti)

**Where code speaks.**

![Drishti — Language Selection](frontend/docs/images/hero.png)

Drishti is a voice-first coding education platform built for visually impaired students in India. It teaches programming through spoken lessons, voice-driven quizzes, an AI coding assistant, and a fully hands-free code dictation mode — all in Hindi, English, or Marathi.

---

## Table of Contents

- [About](#about)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Languages Taught](#languages-taught)
- [Instruction Languages](#instruction-languages)
- [Application Flow](#application-flow)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [API Reference](#api-reference)
- [Accessibility Features](#accessibility-features)
- [Guardian / Mentor Sharing](#guardian--mentor-sharing)
- [Offline Support](#offline-support)
- [Known Limitations](#known-limitations)
- [Contributing](#contributing)

---

## About

Most coding education platforms assume the learner can see the screen. Drishti doesn't. Every page is designed to be fully usable by a blind or low-vision student using only keyboard shortcuts and text-to-speech (TTS) / speech-to-text (STT) — no mouse required.

The platform is guided by **Pyra**, an animated AI mascot who narrates lessons, reads quiz questions, explains generated code line-by-line in plain spoken language (not raw symbols), and walks the student through the entire learning journey from language selection to a final certificate.

## Key Features

- 🎙️ **Fully voice-first UI** — every page speaks its content aloud and responds to voice commands or keyboard shortcuts
- 🌐 **Trilingual instruction** — Hindi, English, and Marathi, selectable at the very first screen
- 📚 **9 programming languages** — Python, SQL, JavaScript, Java, C++, HTML, CSS, Tailwind CSS, and TypeScript, each with 10–15 structured lessons
- ✅ **40-question MCQ quizzes** per language, with voice-answer confirmation before submitting
- 🤖 **AI Code Agent** — describe what you want in plain language (voice or text) and get real, runnable code back, powered by Groq's LLM API
- 🗣️ **Practice Mode** — dictate Python code line-by-line using spoken punctuation ("open paren", "colon", "dedent", etc.), with auto-indentation and instant execution
- 🔥 **Streak tracking** — daily login/activity streaks to encourage consistency
- 👪 **Guardian/Mentor Sharing** — students can generate a read-only, token-based link so a parent or mentor can view (but not edit) their progress
- 📡 **Offline-resilient progress sync** — progress updates queue in `localStorage` when offline and flush automatically on reconnect
- 🏆 **Certificates** — auto-generated, printable completion certificates with grade and score
- ♿ **Screen-reader friendly navigation** — route changes announce themselves via focus management and an audio cue, plus a skip-to-content link

## Tech Stack

**Backend**
- [FastAPI](https://fastapi.tiangolo.com/) (Python)
- [SQLAlchemy](https://www.sqlalchemy.org/) + SQLite
- [Groq API](https://groq.com/) (LLM inference for chat, lessons, and code generation)
- `passlib` (sha256_crypt) for password hashing

**Frontend**
- [React 19](https://react.dev/) + [React Router 7](https://reactrouter.com/)
- [Vite 8](https://vitejs.dev/) as build tool
- Web Speech API (`SpeechSynthesisUtterance` for TTS, `SpeechRecognition` for STT) — no external voice service
- Plain CSS-in-JS (inline styles) — no UI framework dependency

## Project Structure

```
Drishti/
├── backend/
│   ├── main.py              # FastAPI app — all routes
│   ├── database.py          # SQLAlchemy models (User, Progress) + DB setup
│   ├── requirements.txt
│   └── .env                 # GROQ_API_KEY (not committed)
│
└── frontend/
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx                    # Router + skip link + route focus handler
    │   ├── pages/
    │   │   ├── InstructionLanguagePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── IntroPage.jsx
    │   │   ├── LanguagePage.jsx
    │   │   ├── LessonsPage.jsx
    │   │   ├── MCQPage.jsx
    │   │   ├── AgentPage.jsx
    │   │   ├── PracticePage.jsx
    │   │   ├── CertificatePage.jsx
    │   │   └── GuardianViewPage.jsx
    │   └── components/
    │       ├── Navbar.jsx
    │       ├── LessonSidebar.jsx
    │       ├── ProgressBar.jsx
    │       ├── RouteFocusHandler.jsx
    │       ├── useTheme.js
    │       ├── translations.js
    │       └── offlineSync.js
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- A [Groq API key](https://console.groq.com/) (free tier works)

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
```

Create a `.env` file in `backend/`:

```
GROQ_API_KEY=your_groq_api_key_here
```

Start the server:

```bash
uvicorn main:app --reload
```

The API will run at `http://127.0.0.1:8000`. Visit `http://127.0.0.1:8000/docs` for the interactive Swagger UI listing every route.

A SQLite database file (`drishti.db`) is created automatically on first run.

### Frontend Setup

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Visit the printed local URL (typically `http://localhost:5173`).

> **Note:** The frontend calls the backend at the hardcoded address `http://127.0.0.1:8000`. Both servers must be running locally for the app to function — there is no dev proxy configured in `vite.config.js`.

## Languages Taught

| Language | Lessons | MCQ Questions |
|---|---|---|
| Python | 15 | 40 |
| Java | 15 | 40 |
| C++ | 15 | 40 |
| SQL | 10 | 40 |
| JavaScript | 10 | 40 |
| HTML | 10 | 40 |
| CSS | 10 | 40 |
| Tailwind CSS | 10 | 40 |
| TypeScript | 10 | 40 |

Every lesson and every quiz question exists fully translated in Hindi, English, and Marathi.

## Instruction Languages

Chosen once at the very first screen and carried through the whole session:

- **हिंदी (Hindi)** — voice: `hi-IN`
- **English** — voice: `en-US`
- **मराठी (Marathi)** — voice: `hi-IN` (Marathi text spoken with Hindi TTS voice, since dedicated Marathi voices are rarely available on end-user devices)

## Application Flow

```
Instruction Language → Login/Register → Intro (Pyra greeting)
        → Language Selection → Lessons → MCQ Quiz → Code Agent → Certificate
                           ↘ Practice Mode (voice code dictation, side branch)                
```

Guardian links (`/guardian/:token`) are a separate, public, non-voice entry point — accessible without logging in.

## Keyboard Shortcuts

Every page is fully operable by keyboard. Global shortcuts (available on every logged-in page via the Navbar):

| Key | Action |
|---|---|
| `1` / `2` / `3` / `4` | Jump to Lessons / MCQ / Agent / Practice |
| `M` | Toggle light/dark theme |
| `W` | Announce current page ("Where am I?") |
| `H` | Repeat page-specific help |

Page-specific shortcuts (examples):

- **Lessons:** `L` listen, `N` next, `R` repeat, `T` voice answer, `B` toggle sidebar
- **MCQ:** `Q` hear question, `1`–`4` select answer, `T` voice answer, `R` repeat
- **Agent:** `T` speak command, `C` generate code, `R` repeat, `L` read code line-by-line, `F` certificate
- **Practice Mode:** `T` toggle dictation, `Y`/`N` confirm/reject line, `P` run code, `U` undo last line, `X` clear buffer, `H` symbol-word help
- **Certificate:** `S` save/print, `R` repeat, `H` home

## API Reference

Base URL: `http://127.0.0.1:8000`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Create a new account |
| `POST` | `/login` | Log in, returns streak and voice settings |
| `POST` | `/chat` | General chat with Pyra (Groq-powered) |
| `POST` | `/get-lesson` | Fetch an AI-generated lesson explanation |
| `POST` | `/generate-code` | Generate code from a natural-language command and run it |
| `POST` | `/run-code` | Execute a raw code string and return output |
| `GET` | `/progress/{user_id}` | Fetch all progress records for a user |
| `POST` | `/progress/update` | Update lesson/quiz/agent progress for a language |
| `POST` | `/settings/speech-rate` | Update saved TTS speed |
| `POST` | `/settings/voice-pitch` | Update saved TTS pitch |
| `POST` | `/guardian/enable` | Generate (or regenerate) a guardian sharing token |
| `POST` | `/guardian/disable` | Revoke guardian sharing |
| `GET` | `/guardian/status/{user_id}` | Check current guardian sharing status |
| `GET` | `/guardian/{token}` | Public read-only progress summary for a shared token |

Full request/response schemas are available at `/docs` once the backend is running.

## Accessibility Features

- Skip-to-main-content link (visible on first `Tab` press)
- Programmatic focus shift to `<main>` on every route change
- Short audio cue on navigation, played immediately (before TTS starts) so a page change is never silent
- `aria-live` regions that go quiet while Pyra is speaking, to avoid double narration
- Adjustable font size, speech rate, and voice pitch — all persisted across sessions
- Light/dark theme toggle
- Every interactive element has a descriptive `aria-label`

## Guardian / Mentor Sharing

A student can generate a shareable, read-only link from the Navbar's "Guardian" panel. The link:

- Requires no login for the guardian/parent to view
- Shows only high-level, subject-merged progress (streak, last active, lessons/quiz/agent completion per subject)
- Never exposes email, password data, or in-progress navigation state
- Can be revoked or regenerated at any time, instantly invalidating the old link

## Offline Support

Progress updates are never silently lost on a flaky connection:

- `offlineSync.js` attempts each `/progress/update` call immediately
- On failure (offline, timeout, server error), the payload is queued in `localStorage`
- Multiple queued updates for the same `(user_id, language)` collapse into just the latest one
- The queue automatically flushes when the browser regains connectivity

## Known Limitations

- Practice Mode's code buffer is **not persisted** — it exists only in that session's local state
- Certificates are **not saved server-side** — they're generated client-side from navigation state, so there's no permanent record of a certificate beyond printing/saving it as a PDF
- Voice recognition (`SpeechRecognition`) quality depends entirely on the browser and OS — best supported in Chrome
- Marathi and Hindi both currently rely on the `hi-IN` system voice for TTS; output quality depends on what voices are installed on the user's device
- The frontend calls a hardcoded `http://127.0.0.1:8000` — no environment-based API URL configuration yet, so production deployment requires this to be parameterized

## Contributing

This is currently a learning/portfolio project. Issues and pull requests are welcome if you'd like to extend language support, add new lesson content, or improve accessibility further.

---

*दृष्टि — जहाँ code बोलता है.*
