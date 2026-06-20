# दृष्टि (Drishti) — Voice-Based Coding Tutor for Visually Impaired People

## What it is

**दृष्टि (Drishti)** — meaning "vision" in Hindi, with the tagline *"जहाँ code बोलता है"* ("where code speaks") — is a **voice-first coding education platform built specifically for visually impaired learners** in India. It teaches programming entirely through voice interaction, keyboard shortcuts, and screen-reader-friendly design, rather than relying on the visual UI that most coding platforms depend on.

The core idea: a blind or low-vision person should be able to learn Python, SQL, or JavaScript from zero, entirely by listening and using the keyboard — no mouse, no need to see the screen.

The learner is guided throughout by **Pyra**, an AI tutor voiced through the browser's built-in text-to-speech.

---

## The experience, end to end

```
Intro → Instruction Language → Programming Language → Lessons → MCQ Quiz → AI Code Agent → Certificate
```

1. **Intro (`/`)** — Pyra introduces herself, asks for the learner's name (typed or spoken). Keyboard shortcuts: P (hear intro), T (speak name), N (advance), R (repeat), H (confirm yes).
2. **Instruction Language (`/instruction-language`)** — Learner chooses the language Pyra will *teach in*: Hindi, English, or Marathi.
3. **Programming Language (`/language`)** — Learner chooses what to learn: Python, SQL, or JavaScript (Java/C++ marked "coming soon").
4. **Lessons (`/lessons`)** — Structured, voice-narrated curriculum: **15 lessons for Python, 10 each for SQL and JavaScript**, each with a plain-language explanation, a relatable real-world analogy, and a runnable code example. Fully written out in **all three instruction languages**. Includes a jump-to-any-lesson sidebar.
5. **MCQ Quiz (`/mcq`)** — **40 multiple-choice questions per subject**, fully localized in all three languages. Questions and options are read aloud; answerable via keyboard (1–4) or voice.
6. **AI Code Agent (`/agent`)** — Learner describes what they want in plain language (typed or spoken: *"add two numbers"*, *"print hello world"*), and an AI (Groq's Llama 3.1) generates real Python code, **executes it server-side**, and reads back the output.
7. **Certificate (`/certificate`)** — A polished, printable completion certificate showing name, score, percentage, letter grade, completion date, and a unique certificate ID.

---

## Accessibility features

- **Full voice interaction** — every page speaks instructions and content aloud (Web Speech API `SpeechSynthesisUtterance`), and supports speech-to-text input (`SpeechRecognition`)
- **Keyboard-only navigation** — every action has a single-key shortcut: `P` `T` `N` `H` `R` `L` `Q` `C` `F` `M` `B` and `1` `2` `3` — no mouse required anywhere
- **Screen-reader support** — `aria-live` regions for dynamic announcements, `aria-label`s on every interactive element
- **Adjustable font size** (A+ / A−, 12–24px) and **speech rate control** (0.5x–1.5x), persisted across sessions
- **Dark / Light mode** toggle
- **Progress tracking** across Lessons / MCQ / Agent sections, persisted in `localStorage`
- Designed to be Braille-keyboard friendly

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite (`http://localhost:5173`) |
| Backend | Python + FastAPI (`http://127.0.0.1:8000`) |
| AI | Groq API (free tier), model `llama-3.1-8b-instant` |
| Voice | Browser-native Web Speech API (speech synthesis + speech recognition) |
| Routing / State | React Router v6, state passed via `location.state` (no Redux/Context) |
| Persistence | `localStorage` for theme, font size, speed, and progress flags |

### Backend endpoints (`backend/main.py`)
- `POST /chat` — general Pyra chatbot (lightly used currently)
- `POST /get-lesson` — generates a personalized AI lesson explanation for a given topic + student name
- `POST /generate-code` — takes a natural-language command, asks the LLM to generate raw Python, strips markdown formatting, **executes it via `subprocess`**, and returns both code and output

The Groq API key is stored in `backend/.env` as `GROQ_API_KEY` (not shared/version-controlled).

---

## Folder structure

```
CODE/
├── .gitignore
├── backend/
│   ├── main.py            # FastAPI app — /chat, /get-lesson, /generate-code
│   ├── .env                # GROQ_API_KEY (private)
│   └── .gitignore
└── frontend/
    ├── public/
    │   ├── favicon.svg
    │   └── icons.svg
    └── src/
        ├── App.jsx          # React Router route definitions
        ├── App.css
        ├── main.jsx         # React entry point
        ├── index.css
        ├── assets/
        │   ├── hero.png
        │   ├── react.svg
        │   └── vite.svg
        ├── components/
        │   ├── Navbar.jsx         # Page nav, font/speed/theme controls
        │   ├── ProgressBar.jsx    # Lessons/MCQ/Agent completion tracker
        │   ├── LessonSidebar.jsx  # Jump-to-lesson list
        │   ├── speak.js           # Shared TTS helper (voice output)
        │   ├── translations.js    # UI strings: Hindi / English / Marathi
        │   └── useTheme.js        # Theme, font size, speed hook
        └── pages/
            ├── IntroPage.jsx               # Name capture, welcome
            ├── InstructionLanguagePage.jsx # Hindi / English / Marathi choice
            ├── LanguagePage.jsx            # Python / SQL / JavaScript choice
            ├── LessonsPage.jsx             # Lesson content (15/10/10 lessons × 3 languages)
            ├── MCQPage.jsx                 # 40-question quiz × 3 subjects × 3 languages
            ├── AgentPage.jsx               # AI code generation + execution
            └── CertificatePage.jsx         # Final certificate display
```

**Routing (`App.jsx`):**
```
/                       → IntroPage
/instruction-language   → InstructionLanguagePage
/language               → LanguagePage
/lessons                → LessonsPage
/mcq                    → MCQPage
/agent                  → AgentPage
/certificate            → CertificatePage
```

State (`name`, `language`, `instructionLang`, `score`) is threaded between pages via React Router's `location.state` — there is no global store.

---

## Current state of completeness

The project is **further along than the original project summary suggested**. All lesson content (15 Python / 10 SQL / 10 JavaScript lessons) and all MCQ content (40 questions per subject) already exist fully written out in **all three instruction languages** — Hindi, English, and Marathi — not just Hindi.

### Known issues / bugs still to fix
| Issue | Severity | Detail |
|---|---|---|
| Certificate score always shows 0 | 🔴 High | `MCQPage.jsx` never writes the final score to `localStorage` (`mcq_score` key), so `AgentPage.jsx` always reads it as 0 when navigating to the certificate |
| MCQ completion message says "20" | 🔴 High | The spoken/displayed completion message in `MCQPage.jsx` hardcodes "20 questions" instead of the actual 40 |
| Voice input stuck on Hindi | 🟡 Medium | Speech-to-text (`SpeechRecognition.lang`) is hardcoded to `"hi-IN"` across Intro, Lessons, MCQ, and Agent pages, even when English/Marathi is selected — only voice *output* correctly switches language |
| Mixed-language UI text | 🟡 Medium | Many on-screen labels and status messages are hardcoded in Hindi regardless of the chosen instruction language |
| Inconsistent state passing | 🟡 Medium | Some navigation paths (e.g. certain keyboard shortcuts, the `Navbar` call inside `LessonsPage.jsx`) drop `language` or `instructionLang` from route state |
| Font size / speed not persisted on change | 🟢 Low | `useTheme.js` reads these from `localStorage` once on load but doesn't write back automatically (only `theme` does) |
| Marathi voice falls back to Hindi | 🟢 Low | No dedicated Marathi TTS voice is configured; `marathi.voiceLang` in `translations.js` is set to `"hi-IN"` |

---

## Roadmap (planned, not yet built)

- More programming languages: Java, C++, HTML/CSS
- Score history tracking across multiple sessions
- Public deployment: frontend on Vercel, backend on Render
- Dedicated Marathi text-to-speech voice support

---

*Document generated from a full code review of the project on June 20, 2026.*