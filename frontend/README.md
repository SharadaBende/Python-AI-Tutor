# दृष्टि (Drishti) — Full Project Summary
**Covers the complete project state, including the original July 2026 baseline and all work done across this conversation.**

---

## 1. What Drishti Is

Drishti is a voice-first Python/programming tutor built for visually impaired students in India. The core interaction model is **spoken, not visual** — "Pyra," an AI voice assistant, teaches lessons, asks quiz questions, reads out generated code, and confirms answers, all through speech synthesis (TTS) and speech recognition (STT), with keyboard shortcuts as the primary navigation method instead of mouse/visual interaction. Content is delivered in Hindi (Devanagari script), English, or Marathi, selected once at the very first screen.

---

## 2. Folder Structure (current state)

```
Drishti/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── drishti.db                 ← now gitignored (was tracked, fixed this session)
│   ├── requirements.txt
│   ├── venv/
│   ├── .env
│   └── .gitignore                 ← fixed this session (drishti.db, __pycache__)
└── frontend/
    └── src/
        ├── App.jsx
        ├── components/
        │   ├── Navbar.jsx                    ← MODIFIED this session
        │   ├── ProgressBar.jsx
        │   ├── LessonSidebar.jsx
        │   ├── translations.js
        │   ├── useTheme.js                   ← speed state lives here
        │   ├── offlineSync.js
        │   └── RouteFocusHandler.jsx          ← MODIFIED this session
        └── pages/
            ├── InstructionLanguagePage.jsx    ← MODIFIED this session (skip-link fix)
            ├── LoginPage.jsx                  ← MODIFIED this session
            ├── RegisterPage.jsx
            ├── IntroPage.jsx
            ├── LanguagePage.jsx
            ├── LessonsPage.jsx                ← MODIFIED this session (major)
            ├── MCQPage.jsx                    ← MODIFIED this session (major, in progress)
            ├── AgentPage.jsx
            └── CertificatePage.jsx
```

---

## 3. Current Backend Endpoints (`main.py`)

| Endpoint | Method | Notes |
|---|---|---|
| `/chat` | POST | Pyra chatbot (Groq, Hindi Devanagari system prompt) |
| `/generate-code` | POST | Natural language → Python code → executed → output |
| `/get-lesson` | POST | AI-generated personalized lesson (Hindi, Groq) |
| `/register` | POST | Creates user; returns `{success, user_id, name}`. Now uses `Depends(get_db)` |
| `/login` | POST | Verifies credentials; returns `streak_days` **and now `speech_rate`**. Uses `Depends(get_db)` |
| `/progress/update` | POST | Writes progress fields; updates + returns `streak_days`. Uses `Depends(get_db)` |
| `/progress/{user_id}` | GET | Reads all progress rows for a user; returns `streak_days`. Connection-leak bug fixed, uses `Depends(get_db)` |
| `/settings/speech-rate` | POST | **NEW this session.** Saves a user's preferred TTS speed to their account |

**All four core CRUD endpoints now use FastAPI's `Depends(get_db)` dependency-injection pattern** — this was a full refactor completed this session, replacing manual `SessionLocal()` + `db.close()` calls. This structurally closes off the entire "leaked database connection" bug class for good, including for any new endpoints added in the future.

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
    speech_rate = Column(Float, default=0.85)          # ← added this session

class Progress(Base):
    __tablename__ = "progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    language = Column(String, nullable=False)
    lessons_done = Column(Boolean, default=False)
    current_lesson_index = Column(Integer, default=0)
    mcq_done = Column(Boolean, default=False)
    current_mcq_index = Column(Integer, default=0)
    mcq_score = Column(Integer, default=0)
    agent_done = Column(Boolean, default=False)
```

```python
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

**Migration note (recurring issue, now well understood):** every time a new column is added to `User` or `Progress`, SQLAlchemy's `create_all()` will NOT retroactively add it to an existing `drishti.db`. Either delete the `.db` file (dev-only, loses all accounts) or run an `ALTER TABLE` migration to preserve data. This has come up twice this session (`streak_days`/`last_active_date`, then `speech_rate`).

---

## 5. Features From Original Baseline (pre-existing, unchanged this session unless noted)

1. **"Where Am I" voice breadcrumb (W key)** — Navbar-wide, announces current page + context.
2. **Voice confirmation loop for MCQ answers** — repeats back recognized option before submitting.
3. **Line-by-line code read-back (AI Agent)** — parses Python into plain-language descriptions.
4. **Universal Help command (H key)** — page-specific shortcuts + general nav fallback. **Help text corrected this session** (see §6).
5. **Low-bandwidth/offline resilience** — queues failed progress POSTs, retries when back online.
6. **Daily streak tracking** — backend logic + spoken celebration on Lessons page.
7. **Screen reader compatibility fixes** — TTS double-speak prevention, skip-to-content link + focus-on-route-change (`RouteFocusHandler.jsx`).
8. **Connection pool exhaustion bug fix** — `get_progress` wrapped in `try/finally` (superseded this session by the full `Depends(get_db)` refactor).

---

## 6. Features Built THIS Session

### ① Persist speech rate per-user (not per-browser)
- **Files:** `database.py`, `main.py`, `LoginPage.jsx`, `Navbar.jsx`
- Added `speech_rate` column to `User`. `/login` now returns it; new `/settings/speech-rate` endpoint saves changes.
- `LoginPage.jsx`: on successful login, `setSpeed(data.speech_rate)` overwrites local device state with the account's saved value.
- `Navbar.jsx`: `increaseSpeed()`/`decreaseSpeed()` now also fire a background POST to save the new value, keyed by `userId` (already available as a prop). Fails silently if offline — local speed still updates.
- **Result:** a student's preferred speaking speed now follows their account across any device, not just the browser they set it on.

### ② Audio cue on page load
- **File:** `RouteFocusHandler.jsx`
- Added a short (~0.2s), soft 880Hz tone generated via the Web Audio API (no audio file, no network request, works offline) that plays the instant a route changes — before Pyra's own speech starts, filling the "is this frozen?" gap while TTS voices load.
- Reuses a single `AudioContext` across route changes. Wrapped in `try/catch` so failures never block navigation or focus handling.
- **Known constraint:** browsers block audio until the user has interacted with the page once — satisfied almost immediately since the very first screen requires a keypress to select a language.

### ③ Fixed misleading Help text
- **File:** `Navbar.jsx`, `GENERAL_HELP` object
- Discovered while debugging a reported "1/2/3 doesn't change page on MCQ" issue: `1`/`2`/`3` were **never** global navigation shortcuts — only page-specific behavior (they navigate on Lessons/Agent, but are dedicated to answer-selection on MCQ, by design). The spoken Help text incorrectly claimed "1 for Lessons, 2 for MCQ, 3 for Agent" as if it always worked.
- **Decision made:** keep `1`–`4` dedicated to MCQ answers (safer — no risk of a student accidentally leaving a quiz mid-question and losing their place). Fixed the Help text to point to the navbar buttons instead of promising a shortcut that doesn't universally exist.

### ④ Session resume-or-restart choice — Lessons page
- **File:** `LessonsPage.jsx`
- On login, if a student has real saved progress (`current_lesson_index > 0`), Pyra now asks: *"Welcome [name]. This is the Lessons page. You were on lesson X. Press C to continue from there, or S to start from the beginning. You can also say it out loud."*
- Waits indefinitely for a response (no timeout/default) — accepts either keypress (`C`/`S`) or spoken answer (via Web Speech API), matching the existing MCQ Y/N confirmation pattern.
- Only after the choice is resolved do the normal welcome/keyboard-instructions message and streak celebration play — all speech is now properly **chained via `onEnd` callbacks** (a `speakQueue()` helper) instead of independent `setTimeout` delays, which were previously causing messages to cut each other off mid-sentence.
- New state: `resumeChoicePending`, `pendingMessagesRef`. New functions: `resolveResumeChoice`, `listenForResumeChoice`.
- **This was more ambitious than the originally planned "just announce it" version** — evolved into a real interactive choice based on user feedback during the build.

### ⑤ Session resume-or-restart choice — MCQ page (IN PROGRESS, not yet fully tested)
- **File:** `MCQPage.jsx`
- Same pattern as Lessons, adapted for MCQ's fields (`current_mcq_index`, `mcq_score`, `mcq_done`).
- Import line fixed (`useRef` added, missing closing quote bug fixed).
- `handleKey` updated to intercept `C`/`S`/`T` via `resumeChoicePending`, placed **above** the existing `confirmPending` (Y/N voice-answer-confirmation) check so the two never conflict.
- **Status at time of writing:** the `handleKey` update was pasted successfully, but the corresponding `useState`/`useEffect`/`resolveResumeChoice`/`listenForResumeChoice` block had NOT yet been pasted in, causing a `resumeChoicePending is not defined` runtime error. **This still needs to be completed and tested** — see §8.

---

## 7. Features Discussed, Explicitly Skipped

### WhatsApp reminders — **skipped entirely**
- Real per-message cost was researched: Twilio charges ~$0.005/message platform fee plus Meta's own per-template fee (roughly $0.0034–$0.05 depending on country/category); no free tier for production use.
- No free way to reach WhatsApp specifically exists (Meta itself charges regardless of provider).
- **Decision:** skip WhatsApp reminders. The existing in-app streak announcement (spoken "🔥 X-day streak!" on the Lessons page) remains the sole reminder/motivation mechanism.
- Everything previously scoped for this (settings page, phone field, consent UI, scheduler) remains unbuilt and is now off the roadmap, not just paused.

### Vibration feedback (`navigator.vibrate()`) — **skipped**
- Reasoned out loud: Drishti is audio-first and already confirms every action verbally, making vibration mostly redundant. iOS Safari has never supported the Vibration API at all, so it would only work for Android users — inconsistent coverage for a "nice-to-have." Decided not worth building.

---

## 8. Known Open Items / Immediate Next Steps

1. **MCQ resume/restart feature is incomplete.** The `handleKey` interception is in place, but the main `useState`/`useEffect`/`resolveResumeChoice`/`listenForResumeChoice` block (fetch progress, ask resume question, chain welcome+streak speech) still needs to be pasted into `MCQPage.jsx`, replacing the original two separate `useEffect`s (fetch-progress at ~line 1378, welcome-message effect right after it). **This is the very next thing to finish.**
2. Once MCQ resume/restart works, needs the same full test cycle as Lessons: partial progress → resume question asked → test both `C` (continue) and `S` (restart) paths, by keypress and by voice.
3. **Not yet committed:** the speech-rate persistence feature, the audio cue, the help-text fix, and the Lessons resume/restart feature — all built and tested this session but pending `git add`/`commit`/`push` (commit commands were provided but confirmation of running them wasn't given for all).
4. **`InstructionLanguagePage.jsx`** — the skip-link fix (`id="main-content"`, `tabIndex={-1}`, `outline: "none"`) was written and given to the user but not explicitly confirmed as pasted/tested.
5. `frontend/README.md` — flagged as modified in git status multiple times this session; contents were never actually reviewed. Likely harmless scaffolding boilerplate, but unconfirmed.

---

## 9. Features Discussed But Not Yet Built (from original + this session's brainstorm)

**From the original 7-category brainstorm:**
- Sandbox/practice mode with audio-described code output (beyond existing line-by-line read-back)
- Peer support / buddy system pairing
- Actual hands-on testing with real screen readers (NVDA/JAWS/TalkBack) — code-review-level audit only so far, not a live test
- Braille display verification
- Guardian/mentor progress view
- Rephrase/simplify button for lessons

**From this session's "ease of use" brainstorm (numbered list discussed with user):**
1. ✅ Persist speech rate per-user — **built**
2. ✅ Audio cue on page load — **built**
3. ⏭️ Vibration feedback — **skipped** (see §7)
4. ⬜ Adjustable Pyra voice/pitch (not just rate) — not started
5. ⬜ "Practice mode" full audio-only sandbox — not started
6. ✅ Session resume announcement — **built** (evolved into full resume/restart choice), Lessons done, MCQ in progress
7. ⬜ Real screen-reader testing (NVDA/TalkBack) — flagged as needing a human tester, not buildable by AI; a testing checklist was offered but not yet created
8. ⬜ Guardian/mentor progress view — not started

**Also still open from earlier in the project:**
- `Depends(get_db)` refactor — **completed this session** (was open, now resolved)
- Server timezone for streaks — still recommend pinning to `Asia/Kolkata` for production, not yet done
- Shortcut key collisions with screen readers — intentionally left unresolved by design decision
- `H` key double-duty on IntroPage/CertificatePage — still harmless, still unresolved, still just a note for the future

---

## 10. Suggested Next Steps, In Priority Order

1. **Finish the MCQ resume/restart feature** — paste the missing `useEffect`/state block into `MCQPage.jsx`, test both resume and restart paths (keyboard + voice), same as was done for Lessons.
2. **Commit everything built this session** that hasn't been committed yet — speech rate persistence, audio cue, help-text fix, Lessons resume/restart, and (once finished) MCQ resume/restart.
3. **Confirm the `InstructionLanguagePage.jsx` skip-link fix** was actually pasted and works.
4. Decide whether to build #4 (voice/pitch selection) or #5 (audio-only practice sandbox) next from the ease-of-use list.
5. When there's time, actually install NVDA (free, Windows) or use TalkBack (built into Android) for a real hands-on accessibility test — this can't be done by AI and needs a human at the keyboard.