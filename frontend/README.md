# दृष्टि (Drishti) — Full Project Summary
**Updated to include this session's work: Practice Mode (voice-dictated coding sandbox).**

---

## 1. What Drishti Is

Drishti is a voice-first Python/programming tutor built for visually impaired students in India. The core interaction model is **spoken, not visual** — "Pyra," an AI voice assistant, teaches lessons, asks quiz questions, reads out generated code, and confirms answers, all through speech synthesis (TTS) and speech recognition (STT), with keyboard shortcuts as the primary navigation method instead of mouse/visual interaction. Content is delivered in Hindi (Devanagari script), English, or Marathi, selected once at the very first screen.

---

## 2. Folder Structure (current state)

```
Drishti/
├── backend/
│   ├── main.py                     ← MODIFIED this session (/run-code added)
│   ├── database.py
│   ├── drishti.db                  ← gitignored
│   ├── requirements.txt
│   ├── venv/
│   ├── .env
│   └── .gitignore
└── frontend/
    └── src/
        ├── App.jsx                             ← MODIFIED this session (/practice route)
        ├── components/
        │   ├── Navbar.jsx                      ← MODIFIED this session (Practice link, labels, help text)
        │   ├── ProgressBar.jsx
        │   ├── LessonSidebar.jsx
        │   ├── translations.js                 ← MODIFIED this session (practice* keys)
        │   ├── useTheme.js
        │   ├── offlineSync.js
        │   └── RouteFocusHandler.jsx
        └── pages/
            ├── InstructionLanguagePage.jsx
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── IntroPage.jsx
            ├── LanguagePage.jsx
            ├── LessonsPage.jsx
            ├── MCQPage.jsx
            ├── AgentPage.jsx
            ├── PracticePage.jsx                ← NEW this session
            └── CertificatePage.jsx
```

---

## 3. Current Backend Endpoints (`main.py`)

| Endpoint | Method | Notes |
|---|---|---|
| `/chat` | POST | Pyra chatbot (Groq, Hindi Devanagari system prompt) |
| `/generate-code` | POST | Natural language → Python code → executed → output. Used by Agent page. |
| `/run-code` | POST | **NEW this session.** Takes raw `{code: string}`, executes it via subprocess, returns `{output: string}`. Reuses the exact execution logic from `/generate-code` but skips the generation step — used by Practice Mode to run student-dictated code. |
| `/get-lesson` | POST | AI-generated personalized lesson (Hindi, Groq) |
| `/register` | POST | Creates user; returns `{success, user_id, name}` |
| `/login` | POST | Verifies credentials; returns `streak_days`, `speech_rate`, `voice_pitch` |
| `/progress/update` | POST | Writes progress fields; updates + returns `streak_days` |
| `/progress/{user_id}` | GET | Reads all progress rows for a user; returns `streak_days` |
| `/settings/speech-rate` | POST | Saves a user's preferred TTS speed to their account |
| `/settings/voice-pitch` | POST | Saves a user's preferred TTS pitch to their account (already existed; confirmed working this session) |

All core CRUD endpoints use FastAPI's `Depends(get_db)` dependency-injection pattern.

---

## 4. Current Database Schema (`database.py`)

```python
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    streak_days = Column(Integer, default=0)
    last_active_date = Column(String, nullable=True)
    speech_rate = Column(Float, default=0.85)
    voice_pitch = Column(Float, default=1.0)

class Progress(Base):
    __tablename__ = "progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    language = Column(String, nullable=False)
    instruction_language = Column(String, default="hindi")
    lessons_done = Column(Boolean, default=False)
    current_lesson_index = Column(Integer, default=0)
    mcq_done = Column(Boolean, default=False)
    current_mcq_index = Column(Integer, default=0)
    mcq_score = Column(Integer, default=0)
    agent_done = Column(Boolean, default=False)
```

**Migration note (recurring, well understood):** every new column on `User`/`Progress` needs either a fresh `.db` file (dev-only, loses accounts) or an `ALTER TABLE` migration.

---

## 5. Features From Before This Session (stable, unchanged)

1. **"Where Am I" voice breadcrumb (W key)** — Navbar-wide, announces current page + context.
2. **Voice confirmation loop for MCQ answers** — repeats back recognized option before submitting.
3. **Line-by-line code read-back (AI Agent)** — parses Python into plain-language descriptions.
4. **Universal Help command (H key)** — page-specific shortcuts + general nav fallback.
5. **Low-bandwidth/offline resilience** — queues failed progress POSTs, retries when back online.
6. **Daily streak tracking** — backend logic + spoken celebration on Lessons page.
7. **Screen reader compatibility fixes** — TTS double-speak prevention, skip-to-content link + focus-on-route-change.
8. **`Depends(get_db)` refactor** — closed off the leaked-connection bug class permanently.
9. **Speech rate persistence per-user** — account-level, not per-browser.
10. **Audio cue on page load** — 880Hz Web Audio tone, fills the TTS-loading gap.
11. **Corrected Help text** — no longer claims 1/2/3 are universal nav shortcuts.
12. **Session resume-or-restart choice — Lessons page** — full C/S keyboard + voice choice, chained via `speakQueue`.
13. **Session resume-or-restart choice — MCQ page** — same pattern, adapted for MCQ fields (`current_mcq_index`, `mcq_score`). **Completed and fully tested this session** (was left broken/incomplete at the start of this session — now confirmed working via both keyboard and voice, both continue and restart paths).
14. **Voice pitch control** — discovered this session to already be fully built (backend column, `/settings/voice-pitch` endpoint, Navbar UI with 🎵 +/− buttons, `savePitchToServer`). Nothing further needed here; the project's internal tracking doc was out of date on this point.

---

## 6. Features Built THIS Session

### ① MCQ resume/restart — completed and tested
- The `useState`/`useEffect`/`resolveResumeChoice`/`listenForResumeChoice` block was missing at the start of this session, causing a `resumeChoicePending is not defined` crash.
- Pasted in, mirroring the working Lessons pattern exactly. `handleKey` checks `resumeChoicePending` before `confirmPending` (correct precedence — resume choice always takes priority over an in-flight answer confirmation).
- **Fully tested**: keyboard `C`/`S` and voice ("continue"/"जारी"/"चालू" vs "restart"/"शुरुआत"/"पुन्हा") — all four paths confirmed working.

### ② Practice Mode — new page, Dictate-only sandbox
- **New route:** `/practice`, new file `PracticePage.jsx`.
- **Concept evolution:** originally scoped as two modes — "Describe" (natural language → generated code, reusing `/generate-code`) and "Dictate" (speak code line-by-line, confirm, run). **Describe mode was cut** after recognizing it heavily overlapped with the existing Agent page (which already does describe → generate → explain). Practice Mode now does **one thing only**: line-by-line voice code dictation and execution — genuinely new functionality not covered elsewhere in the app.
- **Backend:** new `/run-code` endpoint (`main.py`) — accepts raw code, executes via the same subprocess pattern as `/generate-code`, returns output. No code generation involved; this just runs what the student built.
- **Flow:**
  1. `T` — start listening (continuous recognition, not single-utterance)
  2. Student speaks one line, including spoken punctuation (see below)
  3. `T` again — stop listening; transcript is finalized and read back
  4. `Y` — accept the line into the code buffer / `N` — reject and re-dictate
  5. Repeat to build up multiple lines
  6. `P` — run the accumulated code via `/run-code`, hear the real output spoken aloud
  7. `X` — clear the buffer and start over
- **Key fixes made during this session's testing:**
  - **Speech cutting off mid-sentence:** default Web Speech API behavior (`continuous: false`) stops listening after a brief pause, truncating natural speech. Fixed by switching to `continuous: true` + `interimResults: true`, accumulating final chunks in a ref, and letting the student explicitly press `T` again to stop — putting them in control of when they're done talking instead of the browser guessing.
  - **Wrong recognition language:** Dictate mode was inheriting `recognition.lang` from `instructionLang` (e.g. `hi-IN` for Hindi-medium students), which caused English code phrases like "print hello" to be phonetically transcribed into Devanagari (`प्रिंट हेलो`) instead of staying as English text — since Python syntax is always English regardless of the student's instruction language. **Fixed by hardcoding `recognition.lang = "en-US"`** in Dictate mode specifically, independent of the student's chosen instruction language.
  - **Spoken punctuation conversion:** added a `convertSpokenPunctuation()` function that maps spoken words to symbols (`"open paren"` → `(`, `"close paren"` → `)`, `"quote"` → `"`, `"colon"` → `:`, `"comma"` → `,`, `"equals"` → `=`, `"plus"` → `+`, `"minus"` → `-`, `"dot"` → `.`, `"underscore"` → `_`, plus bracket/brace variants), applied to the transcript before it's shown as a pending line. This is what makes voice-dictated Python syntactically valid — e.g. saying "print open paren quote hello quote close paren" now correctly becomes `print("hello")`.
- **Known gap, not yet addressed:** Pyra doesn't yet explain the punctuation-word convention up front. A first-time student saying "print hello" naturally (without punctuation words) will get a real Python `SyntaxError` read back to them, which could be confusing without context. **Planned fix for next session:** add a short spoken hint to the Practice Mode welcome message explaining that punctuation must be spoken aloud, with a concrete example.
- **Navbar integration:** added `/practice` to the page-link list (with `4` shown as a visual hint, not an actual bound key), added Hindi/Marathi/English labels to `PAGE_LABELS` for the W-key "where am I" announcement, and extended `GENERAL_HELP` text in all three languages to mention Practice.
- **Translations:** added a full `practice*` key set to `translations.js` for all three languages (Hindi/English/Marathi) — welcome message, mode explanation, listening prompts, confirmation prompts, buffer-empty/cleared messages, etc. Note: a few Describe-mode-specific keys (`practiceModeExplain`, `practiceDescribeMode`, `practiceHeardCommand`, `practiceNoCommand`, `practiceGenerating`, `practiceCodeReady`, `practiceYourCommand`) are now unused after Describe mode was cut — harmless, can be cleaned up later or left as-is.
- **Debugging note:** hit a JSX parse error (`Unexpected token` at a line number far beyond the actual file length) after trimming Describe mode out — root cause was a stale/partial paste-over leaving orphaned JSX fragments beyond what was visible in the editor. Resolved by doing a full select-all-and-replace of the file rather than a partial edit.

---

## 7. Features Discussed, Explicitly Skipped

### WhatsApp reminders — **skipped entirely**
- No free tier for production WhatsApp messaging exists (Twilio + Meta fees apply regardless of provider).
- In-app spoken streak announcement remains the sole reminder mechanism. Off the roadmap, not paused.

### Vibration feedback (`navigator.vibrate()`) — **skipped**
- Redundant given the app is already audio-first with verbal confirmation of every action. No iOS Safari support. Not worth building.

### Describe Mode within Practice — **cut this session**
- Originally planned as one of two Practice sub-modes. Removed after recognizing near-total functional overlap with the existing Agent page. Practice Mode is now Dictate-only, which is the genuinely differentiated feature.

---

## 8. Known Open Items / Immediate Next Steps

1. **Add a spoken punctuation-convention hint to Practice Mode's welcome message.** Currently a first-time user isn't told they need to say "open paren," "quote," "colon," etc. aloud — they'll hit a real Python `SyntaxError` on natural phrasing without warning. Small fix, high clarity value.
2. **Full end-to-end retest of Practice Mode** after the punctuation-conversion and English-recognition fixes — confirm a full multi-line dictation → run → hear real output cycle works cleanly (last tested with a single corrected line: `print open paren quote hello quote close paren` → pending, not yet confirmed run end-to-end with output heard).
3. **Commit and push today's Practice Mode work** (`main.py`, `translations.js`, `App.jsx`, `Navbar.jsx`, new `PracticePage.jsx`) — was committed and pushed once already this session, but the punctuation/language fixes made *after* that commit are not yet pushed.
4. Consider whether `dictatedLines` needs an edit/delete-single-line capability, or whether `X` (clear all) is sufficient for now — currently there's no way to remove just one bad line from the middle of the buffer without clearing everything.
5. `frontend/README.md` — still flagged as modified in git status across sessions, contents never reviewed. Likely harmless, still unconfirmed.

---

## 9. Features Discussed But Not Yet Built

**From the original brainstorm, still open:**
- Peer support / buddy system pairing
- Actual hands-on testing with real screen readers (NVDA/JAWS/TalkBack) — code-review-level audit only so far, not a live test. Needs a human at the keyboard; not buildable by AI.
- Braille display verification
- Guardian/mentor progress view
- Rephrase/simplify button for lessons

**From the "ease of use" brainstorm:**
1. ✅ Persist speech rate per-user — built
2. ✅ Audio cue on page load — built
3. ⏭️ Vibration feedback — skipped
4. ✅ Adjustable Pyra voice/pitch — **discovered already built this session** (was mistakenly tracked as "not started")
5. ✅ Practice mode / audio-only sandbox — **built this session** (Dictate-only version)
6. ✅ Session resume/restart — built for both Lessons and MCQ, fully tested
7. ⬜ Real screen-reader testing (NVDA/TalkBack) — still needs a human tester
8. ⬜ Guardian/mentor progress view — not started

**Also still open:**
- Server timezone for streaks — recommend pinning to `Asia/Kolkata` for production, not yet done
- Shortcut key collisions with screen readers — intentionally left unresolved by design
- `H` key double-duty on IntroPage/CertificatePage — harmless, unresolved, noted for future

---

## 10. Suggested Next Steps, In Priority Order

1. **Add the punctuation-convention spoken hint** to Practice Mode's welcome message (small, high-value fix).
2. **Fully retest Practice Mode end-to-end** with correctly-punctuated multi-line dictation, confirming real code execution and spoken output.
3. **Commit and push the punctuation/language fixes** made after today's first Practice Mode commit.
4. Decide whether per-line editing/deletion is needed in the Practice buffer, or defer.
5. Move to the next major open item: either **real screen-reader testing** (requires Sharada at the keyboard with NVDA or TalkBack — can't be done by AI) or **guardian/mentor progress view** (a new buildable feature, would need scoping: what should a guardian see, how do they get access, is this a separate login role or a shareable read-only link).