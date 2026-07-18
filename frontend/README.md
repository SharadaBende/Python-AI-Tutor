# दृष्टि (Drishti)

**A voice-first programming tutor for visually impaired students in India.**

Drishti teaches Python, SQL, JavaScript, Java, C++, HTML, CSS, Tailwind, and TypeScript entirely through speech — no mouse, no visual navigation required. An AI tutor named **Pyra** teaches lessons, asks quiz questions, reads code aloud, and takes voice commands, in **Hindi, English, or Marathi**.

> Built solo as a full-stack accessibility project — not a tutorial clone. Every core interaction (lesson delivery, quiz confirmation, code dictation) was designed around one constraint: **the user cannot see the screen.**

---

## Why this exists

Most "accessible" coding platforms bolt screen-reader support onto a visual-first UI as an afterthought. Drishti flips that: the primary interaction model *is* speech and keyboard shortcuts, and visual elements exist as a secondary layer for sighted collaborators (like the Guardian view — see below). This forces different design decisions at every level, from how errors are communicated to how a student can even *write code* without looking at a screen (see Practice Mode).

---

## Core Features

### 🎧 Voice-First Lesson Delivery
- Lessons, quiz questions, and generated code are read aloud via the Web Speech API (TTS)
- Full keyboard shortcut navigation (`L` listen, `N` next, `R` repeat, `W` "where am I", `H` help) — no shortcut requires sight to discover, since `H` always announces the current page's available commands
- Content delivered in Hindi (Devanagari), English, or Marathi — selected once, persisted across the session

### 🗣️ Practice Mode — Dictate-Only Coding Sandbox
The hardest problem in the whole project: **how does someone write syntactically valid code by voice alone?**

- Custom spoken-punctuation parser converts natural phrases into Python syntax — "open paren", "quote", "colon", "greater than or equal to", etc. (20 symbols total)
- **Mishearing-tolerant**: iteratively hardened against real Web Speech API transcription errors — "paren" gets misheard as "karen"/"parrot"/"pattern"; "quote" as "coat"/"cote"/"cope"; each alias added only after reproducing the actual failing transcript, not guessed speculatively
- **Auto-indent**: any line ending in `:` automatically indents the next line — `if`/`for`/`while`/`def`/`class`/`try` all handled with zero extra student effort
- Manual `indent`/`dedent` voice commands for everything auto-indent can't infer (e.g. stepping back before `else`)
- `U` to undo the last dictated line, with indent level correctly rolled back
- Line-by-line Y/N spoken confirmation before code is committed to the buffer
- Real Python execution via a backend sandbox, with output read back aloud

### 👪 Guardian/Mentor Sharing
- Students can generate a shareable, read-only progress link for a parent or mentor — no separate login system, no password reset flow to build
- The student fully controls the link: regenerating it instantly invalidates the old one
- Deliberately minimal data exposure by design: streak, lesson/quiz completion status, and last-active date only — never raw code, quiz content, or credentials, since some students using this platform may be minors
- The Guardian view itself is a plain, sighted-friendly page — the one part of the app that intentionally *isn't* voice-first, because the target reader is assumed sighted

### 🎨 Accessibility-First Visual Design
- Even though the app is voice-first, the visual layer isn't neglected: solid (non-translucent) color tokens, high-contrast light/dark themes, and a centralized `useTheme()` hook so every page pulls from one source of truth instead of scattered hardcoded colors
- Font size, speech rate, and voice pitch are all user-adjustable and persisted per-account

### 📊 Progress Tracking & Streaks
- Per-language, per-instruction-language progress (a student learning Python in Hindi and English has separately tracked progress)
- Daily streak counter, resume-or-restart choice when returning to an in-progress lesson or quiz
- Offline resilience: progress updates queue locally and flush automatically when connectivity returns

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router |
| Backend | FastAPI |
| Database | SQLite via SQLAlchemy (Postgres-ready for production) |
| AI | Groq API (`llama-3.1-8b-instant`) — powers Pyra's conversational responses and code generation |
| Speech | Browser Web Speech API (STT + TTS) — no third-party speech service, works offline-capable and free |
| Deployment target | Vercel (frontend) + Render (backend) |

---

## Project Structure

```
Drishti/
├── backend/
│   ├── main.py              # All API routes
│   ├── database.py          # SQLAlchemy models (User, Progress)
│   └── requirements.txt
└── frontend/
    └── src/
        ├── components/
        │   ├── Navbar.jsx           # Global nav, settings, Guardian panel
        │   ├── useTheme.js          # Centralized design tokens (light/dark)
        │   ├── translations.js      # hi/en/mr copy
        │   └── offlineSync.js       # Queued progress sync
        └── pages/
            ├── LessonsPage.jsx
            ├── MCQPage.jsx
            ├── AgentPage.jsx
            ├── PracticePage.jsx     # Dictate-only coding sandbox
            └── GuardianViewPage.jsx # Public read-only progress view
```

---

## API Overview

| Endpoint | Method | Purpose |
|---|---|---|
| `/register`, `/login` | POST | Auth |
| `/get-lesson` | POST | AI-generated personalized lesson content |
| `/generate-code`, `/run-code` | POST | Natural-language-to-code and raw code execution |
| `/progress/update`, `/progress/{user_id}` | POST/GET | Per-language progress tracking |
| `/settings/speech-rate`, `/settings/voice-pitch` | POST | Persisted per-user TTS preferences |
| `/guardian/enable`, `/guardian/disable`, `/guardian/status/{user_id}` | POST/GET | Student-controlled sharing toggle |
| `/guardian/{token}` | GET | Public, token-authenticated, read-only progress summary |

---

## Getting Started

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Runs at `http://127.0.0.1:8000` (backend) and the Vite dev server (frontend, typically `http://localhost:5173`).

---

## Notable Engineering Challenges

A few problems worth mentioning in an interview, since they involved real debugging rather than following a tutorial:

- **Chrome's silence-timeout on continuous speech recognition** — Chrome auto-stops STT after a few seconds of silence, cutting students off mid-thought. Fixed by distinguishing student-initiated stops from browser-initiated ones and silently restarting recognition into the same accumulating transcript.
- **A "the mic isn't working" bug that wasn't a code bug at all** — after ruling out every software cause via `onresult` never firing, root cause turned out to be the OS default input device pointing at a virtual webcam-app microphone rather than the real headset. A reminder that not every bug is in your code.
- **Designing minimal-disclosure data sharing** for the Guardian feature, given that some end users may be minors — the token-based, student-revocable link model was chosen deliberately over a full second-account system to minimize both attack surface and unnecessary personal data exposure.

---

## Known Limitations / Honest Roadmap

- Real assistive-technology testing (NVDA, TalkBack) has not yet been performed — testing so far has been code-review-level accessibility auditing, not a live screen-reader session. This is the single most important remaining validation step.
- Practice Mode dictation is tuned against observed Web Speech API mishearings and will keep needing new aliases as more real usage surfaces new failure patterns — this is expected, ongoing maintenance rather than a defect.
- SQLite is used in development; a migration to PostgreSQL is planned before any real production deployment.
- Peer support / buddy pairing and a lesson "simplify/rephrase" button were discussed but are not yet built.

---

## License

MIT