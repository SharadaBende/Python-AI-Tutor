# दृष्टि (Drishti) — Session Summary
**Covers work done in this conversation, on top of the July 2026 project baseline.**

---

## 1. Folder Structure (as of this session)

```
Drishti/
├── backend/
│   ├── main.py                  ← MODIFIED this session
│   ├── database.py              ← MODIFIED this session
│   ├── drishti.db
│   ├── requirements.txt
│   ├── venv/
│   ├── .env
│   └── .gitignore
└── frontend/
    └── src/
        ├── App.jsx                          ← MODIFIED this session
        ├── components/
        │   ├── Navbar.jsx                   ← MODIFIED this session
        │   ├── ProgressBar.jsx
        │   ├── LessonSidebar.jsx
        │   ├── translations.js
        │   ├── useTheme.js
        │   ├── offlineSync.js               ← NEW this session
        │   └── RouteFocusHandler.jsx         ← NEW this session
        └── pages/
            ├── InstructionLanguagePage.jsx
            ├── LoginPage.jsx                 ← MODIFIED this session
            ├── RegisterPage.jsx              ← MODIFIED this session
            ├── IntroPage.jsx                 ← MODIFIED this session
            ├── LanguagePage.jsx               ← MODIFIED this session
            ├── LessonsPage.jsx                ← MODIFIED this session
            ├── MCQPage.jsx                    ← MODIFIED this session
            ├── AgentPage.jsx                  ← MODIFIED this session
            └── CertificatePage.jsx            ← MODIFIED this session
```

**Not touched this session:** `InstructionLanguagePage.jsx` (the very first language-selection screen) — no edits were made to it in this conversation.

---

## 2. Features Built This Session (8 completed)

### ① "Where Am I" — voice breadcrumb (W key)
- **Files:** `Navbar.jsx`, `LessonsPage.jsx`, `MCQPage.jsx`
- Press `W` anywhere → Pyra announces the current page name + context (e.g. "Lessons page. Lesson 6 of 15, Python.")
- `Navbar` accepts an optional `pageContext` prop; each page builds its own context string and passes it down.
- Visible `📍 (W)` button added to the navbar controls row.

### ② Voice confirmation loop for MCQ answers
- **File:** `MCQPage.jsx`
- When answering by voice (🎤 / `T` key), Pyra no longer submits immediately. She repeats back the recognized option ("You chose 2. print(). Is this right?") and waits for yes/no (spoken, or `Y`/`N` keys) before it counts.
- Keyboard answers (`1`–`4` direct press) are unaffected — no misrecognition risk there.
- New state: `confirmPending`. New functions: `confirmAnswer`, `listenForConfirmation`, `finalizeConfirmedAnswer`, `cancelConfirmation`.

### ③ Line-by-line code read-back (AI Agent)
- **File:** `AgentPage.jsx`
- New "📖 पढ़ें / Read Line by Line" button + `L` key, once code is generated.
- `describeCodeLine()` parses common Python patterns (`for`, `while`, `if/elif/else`, `def`, `return`, `print`, `import`, assignments) into plain-language descriptions instead of reading raw punctuation. Falls back to a lightly-cleaned raw read for anything unrecognized.
- `N`/`P` step through lines, `R` repeats current line, `L` again exits. Current line is visually highlighted in the code block for sighted observers.

### ④ Universal "Help" command (H key)
- **Files:** `Navbar.jsx`, `LessonsPage.jsx`, `MCQPage.jsx`, `AgentPage.jsx`
- Press `H` anywhere → Pyra reads page-specific shortcuts (via new `helpText` prop) followed by general nav shortcuts (`GENERAL_HELP` fallback: 1/2/3, M, W, H).
- Visible `❓ (H)` button added to navbar.
- **Known limitation:** `IntroPage.jsx` and `CertificatePage.jsx` each use `H` locally for a different purpose ("yes, start" / "go home"). No actual collision today since neither page renders the shared `<Navbar>`, but flagged as a risk if navbar is ever added to those pages later.

### ⑤ Low-bandwidth / offline resilience
- **New file:** `components/offlineSync.js`
- Progress updates (lesson index, MCQ score, etc.) that fail to POST (offline, timeout, server error) are queued in `localStorage` instead of silently dropped, and auto-retried when the browser regains connectivity (`window.addEventListener("online", ...)`).
- Small "📡 Offline" badge appears in the Navbar when `navigator.onLine` is false.
- **Scope clarified with user:** lesson/MCQ content already works offline (bundled in JS, not fetched). Login/Register and the AI Agent (`/generate-code`, `/get-lesson`, `/chat`) still require a live connection — no offline fallback is possible for those.

### ⑥ Daily streak tracking with spoken celebration
- **Files:** `database.py`, `main.py`, `LessonsPage.jsx`
- **Schema:** added `streak_days` (Integer) and `last_active_date` (String, ISO date) to the `User` table.
- **Backend logic (`update_streak()` helper in `main.py`):** called on `/login` and `/progress/update`. Compares today's date to `last_active_date` — continues streak if yesterday, resets to 1 if a day was missed, no-ops if already counted today.
- `/login`, `/progress/update`, and `/progress/{user_id}` all now return `streak_days` in their response.
- Frontend: `LessonsPage.jsx` announces "🔥 X-day streak!" (spoken, once, 4.5s after the welcome message) when `streak_days >= 2`, plus a small gold streak badge in the header.
- **Known caveat:** streak day-rollover uses the **server's** local date — if deployed in a different timezone than most users (India), streaks could roll over at an odd local hour. Recommend setting server timezone to `Asia/Kolkata` in production.
- **Migration note:** existing SQLite `.db` files may need the column added manually (`ALTER TABLE` in production, or delete `drishti.db` in dev to let `init_db()` recreate it) since SQLAlchemy's `create_all()` doesn't auto-migrate existing tables.

### ⑦ Screen reader compatibility audit + fixes
Two real fixes were built (a third issue — single-letter shortcut collisions with screen reader quick-nav keys — was audited and discussed, but **intentionally left as-is** per user decision, reasoning: Drishti's voice UI is likely the *primary* assistive technology for most users, not a supplement to an existing screen reader).

**Fix A — TTS double-speaking prevention** (`LessonsPage.jsx`, `MCQPage.jsx`, `AgentPage.jsx`):
- Removed broad `aria-live="polite"` wrappers around entire lesson/question cards (was causing screen readers to read full content aloud *simultaneously* with Pyra's own speech).
- Status banners now use `aria-live={pyraSpeaking ? "off" : "polite"/"assertive"}` — silent while Pyra is actively talking, so a screen reader user doesn't hear two overlapping voices.
- Added `pyraSpeaking` state tracking to `MCQPage.jsx` (didn't exist before; `AgentPage.jsx` already had it).

**Fix B — Skip-to-content link + focus-on-route-change** (`App.jsx`, new `RouteFocusHandler.jsx`, all 9 page files):
- New component `RouteFocusHandler.jsx`: on every route change, moves keyboard focus to `#main-content`, causing screen readers to announce the new page (React Router swaps content silently otherwise).
- `App.jsx`: added a visually-hidden-until-focused "Skip to main content" link (`href="#main-content"`), and mounted `<RouteFocusHandler />` inside `<BrowserRouter>`.
- Every page's outer `<main>` element now has `id="main-content" tabIndex={-1}` (plus `outline: "none"` to hide the default focus ring on a non-interactive container): `LoginPage`, `RegisterPage`, `IntroPage`, `LanguagePage`, `LessonsPage`, `MCQPage`, `AgentPage`, `CertificatePage`.
- **Not touched:** `InstructionLanguagePage.jsx` — the very first screen — was never provided in this session, so it does **not** yet have `id="main-content"`. This is the one gap in otherwise full site coverage.

### ⑧ Backend bug fix — database connection pool exhaustion
- **File:** `main.py`
- **Root cause:** `/progress/{user_id}` (`get_progress`) opened a DB session but only called `db.close()` at the end of the function — if anything threw partway through, the connection leaked. Called on every Lessons/MCQ/Agent page load, so it was the most likely endpoint to exhaust the pool.
- **Symptom:** `sqlalchemy.exc.TimeoutError: QueuePool limit of size 5 overflow 10 reached, connection timed out, timeout 30.00`
- **Fix applied:** wrapped the endpoint body in `try/finally` (matching the pattern already used in `/progress/update`).
- **Immediate unblock:** restarting `uvicorn` clears the leaked connections from the current process.
- **Offered but not yet decided:** converting *all* endpoints to FastAPI's `Depends(get_db)` dependency-injection pattern (guarantees cleanup automatically, closes off this entire bug class for future endpoints too). User gave no preference — **this is still open**.

---

## 3. Current Backend Endpoints (`main.py`)

| Endpoint | Method | Notes |
|---|---|---|
| `/chat` | POST | Pyra chatbot (Groq, Hindi Devanagari system prompt) |
| `/generate-code` | POST | Natural language → Python code → executed → output |
| `/get-lesson` | POST | AI-generated personalized lesson (Hindi, Groq) |
| `/register` | POST | Creates user; returns `{success, user_id, name}` |
| `/login` | POST | Verifies credentials; **now also returns `streak_days`** |
| `/progress/update` | POST | Writes progress fields; **now also updates + returns `streak_days`** |
| `/progress/{user_id}` | GET | Reads all progress rows for a user; **now also returns `streak_days`; connection-leak bug fixed this session** |

---

## 4. Current Database Schema (`database.py`)

```python
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    streak_days = Column(Integer, default=0)              # ← added this session
    last_active_date = Column(String, nullable=True)      # ← added this session

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
    # unchanged this session
```

---

## 5. Features Discussed but NOT Yet Built

### WhatsApp reminders — **paused mid-decision**
Real infrastructure decision, not a simple code task:
- **Open decision:** Twilio (fast setup, ~₹0.35–0.80/message, no business verification needed to start) **vs.** Meta Cloud API direct (free-ish tier, but requires Meta Business verification which can take days–weeks and needs formal business documentation). User asked for the trade-off explanation, then said "let me think about it" — **no provider has been chosen.**
- **Already decided:** phone number + WhatsApp opt-in consent will live on a **new, separate, optional settings/profile page** — not forced at registration.
- **Not built at all:** the settings page itself, phone number field, consent UI, backend field for phone number, the scheduler (no cron/`APScheduler` exists in the backend yet), or any message-sending code.

### Guardian/mentor progress view
- Discussed only in the original brainstorm list at the start of the conversation. Not scoped, not started.

### Rephrase / simplify button for lessons
- Discussed only in the original brainstorm list. Not scoped, not started.

### From the original 7-category brainstorm, still fully untouched:
- Sandbox/practice mode with audio-described code output (beyond the line-by-line read-back already built)
- Peer support / buddy system pairing
- Actual hands-on testing with real screen readers (NVDA/JAWS/TalkBack) — the audit was a code review, not a live test session
- Braille display verification

---

## 6. Known Open Items / Follow-ups

1. **`Depends(get_db)` refactor** — offered after the connection-leak bug fix, no decision made. Current state: only `get_progress` has the `try/finally` patch; other endpoints rely on manual `db.close()` calls that are individually correct today but not structurally protected against the same bug reappearing in future endpoints.
2. **Server timezone for streaks** — currently uses server local time; should likely be pinned to `Asia/Kolkata` for production.
3. **SQLite migration** — `streak_days`/`last_active_date` columns need either a fresh DB (dev) or manual `ALTER TABLE` (production) since existing databases won't auto-migrate.
4. **`InstructionLanguagePage.jsx`** — never provided in this session, so it's missing the `id="main-content"` skip-link target that all 8 other pages now have.
5. **Shortcut key collisions with screen readers** — intentionally left unresolved by design decision, not oversight. If Drishti's user base turns out to include more screen-reader-literate users than assumed, revisit adding `Alt+`/`Ctrl+` modifiers.
6. **`H` key double-duty** — `IntroPage`/`CertificatePage` use local `H` for different actions than the global Navbar `H` (help). Currently harmless since those pages don't render `<Navbar>`, but worth remembering if navigation is ever unified.
7. **WhatsApp reminders** — provider decision + full feature build, entirely pending.

---

## 7. Git Commits Made This Session (in order)
1. Add Where Am I voice shortcut (W key) to Navbar
2. Wire pageContext into Navbar for Where Am I shortcut on Lessons page
3. Wire pageContext into Navbar for Where Am I shortcut on MCQ page
4. Add voice confirmation loop before submitting spoken MCQ answers
5. Add structured line-by-line code read-back for AI Agent
6. Add universal H = help shortcut with per-page context
7. Queue and retry failed progress updates for flaky/offline connections
8. Add daily streak tracking with spoken announcement and badge
9. Prevent screen reader from double-narrating content already spoken by Pyra
10. Add skip-to-content link and focus-on-route-change for screen reader navigation
11. Add main-content focus target to LoginPage / RegisterPage / IntroPage / LanguagePage / CertificatePage (5 separate commits)
12. *(Bug fix, not yet committed by user at time of this summary)* — `try/finally` fix for `get_progress` connection leak

*(Exact commit messages may vary slightly from what you actually ran — this reflects what was recommended at each step.)*

---

## 8. Suggested Next Steps, In Priority Order

1. **Commit the `get_progress` bug fix** if you haven't already — this was actively breaking your dev server.
2. Decide on the `Depends(get_db)` refactor before adding more DB-touching endpoints (relevant the moment WhatsApp/settings work resumes).
3. Add `id="main-content"` to `InstructionLanguagePage.jsx` to close the one gap in skip-link coverage.
4. Resume the WhatsApp reminders decision when ready — Twilio is the recommended starting point given your current project stage.