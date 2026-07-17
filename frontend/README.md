# दृष्टि (Drishti) — Full Project Summary
**Updated through this session's work: Practice Mode hardening (mishearing tolerance, full symbol set, indentation, undo) + Guardian/Mentor progress sharing (in progress).**

---

## 1. What Drishti Is

Drishti is a voice-first Python/programming tutor built for visually impaired students in India. The core interaction model is **spoken, not visual** — "Pyra," an AI voice assistant, teaches lessons, asks quiz questions, reads out generated code, and confirms answers, all through speech synthesis (TTS) and speech recognition (STT), with keyboard shortcuts as the primary navigation method instead of mouse/visual interaction. Content is delivered in Hindi (Devanagari script), English, or Marathi, selected once at the very first screen.

---

## 2. Folder Structure (current state)

```
Drishti/
├── backend/
│   ├── main.py                     ← MODIFIED this session (guardian endpoints)
│   ├── database.py                 ← MODIFIED this session (guardian_token column, speech_rate dedup)
│   ├── drishti.db                  ← gitignored — needs migration, see §8
│   ├── requirements.txt
│   ├── venv/
│   ├── .env
│   └── .gitignore
└── frontend/
    ├── README.md                   ← still flagged modified across sessions, never reviewed
    └── src/
        ├── App.jsx                             ← NEEDS UPDATE: /guardian/:token route not yet added
        ├── components/
        │   ├── Navbar.jsx                      ← IN PROGRESS this session, see §6.2 (delivery failed, needs redo)
        │   ├── ProgressBar.jsx
        │   ├── LessonSidebar.jsx
        │   ├── translations.js                 ← MODIFIED this session (practice* keys expanded)
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
            ├── PracticePage.jsx                ← HEAVILY MODIFIED this session, see §6.1
            ├── CertificatePage.jsx
            └── GuardianViewPage.jsx             ← NOT YET CREATED, see §7
```

---

## 3. Current Backend Endpoints (`main.py`)

| Endpoint | Method | Notes |
|---|---|---|
| `/chat` | POST | Pyra chatbot (Groq, Hindi Devanagari system prompt) |
| `/generate-code` | POST | Natural language → Python code → executed → output. Used by Agent page. |
| `/run-code` | POST | Takes raw `{code: string}`, executes via subprocess, returns `{output: string}`. Used by Practice Mode. |
| `/get-lesson` | POST | AI-generated personalized lesson (Hindi, Groq) |
| `/register` | POST | Creates user; returns `{success, user_id, name}` |
| `/login` | POST | Verifies credentials; returns `streak_days`, `speech_rate`, `voice_pitch` |
| `/progress/update` | POST | Writes progress fields; updates + returns `streak_days` |
| `/progress/{user_id}` | GET | Reads all progress rows for a user; returns `streak_days` |
| `/settings/speech-rate` | POST | Saves a user's preferred TTS speed to their account |
| `/settings/voice-pitch` | POST | Saves a user's preferred TTS pitch to their account |
| `/guardian/status/{user_id}` | GET | **NEW this session.** Checks whether sharing is currently on and returns the existing token, without regenerating it (avoids accidentally invalidating a link already shared). |
| `/guardian/enable` | POST | **NEW this session.** Generates a fresh random token (`secrets.token_urlsafe(24)`), saves it to the student's account. Calling again silently overwrites the old token — doubles as "regenerate / revoke old link." |
| `/guardian/disable` | POST | **NEW this session.** Clears the token entirely — turns sharing off, any existing link stops working. |
| `/guardian/{token}` | GET | **NEW this session.** Public, no login required — the token itself is the credential. Returns a deliberately high-level summary only: student name, streak, last active date, and per-language progress (lessons/MCQ done, MCQ score, agent used). Does **not** expose email, password data, in-progress navigation state (`current_lesson_index`/`current_mcq_index`), or anything from Practice Mode (which was never persisted to the database). |

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
    guardian_token = Column(String, unique=True, index=True, nullable=True)  # ← NEW this session

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

**Also fixed this session:** `speech_rate` was accidentally declared twice in `User` (harmless — Python just kept the second one — but redundant). Deduplicated to a single declaration.

**Migration note (recurring, well understood):** every new column on `User`/`Progress` needs either a fresh `.db` file (dev-only, loses accounts) or an `ALTER TABLE` migration. For `guardian_token` specifically:
```sql
ALTER TABLE users ADD COLUMN guardian_token VARCHAR;
```
**Status: unconfirmed whether this migration has actually been run against the live `drishti.db`** — needs verification before the backend is restarted with the new model, or `/login`, `/register`, etc. will error on any query touching the `users` table.

---

## 5. Features From Before This Session (stable, unchanged)

1. "Where Am I" voice breadcrumb (W key)
2. Voice confirmation loop for MCQ answers
3. Line-by-line code read-back (AI Agent)
4. Universal Help command (H key) — page-specific shortcuts + general nav fallback
5. Low-bandwidth/offline resilience — queued progress POSTs
6. Daily streak tracking
7. Screen reader compatibility fixes (TTS double-speak prevention, skip-to-content, focus-on-route-change)
8. `Depends(get_db)` refactor
9. Speech rate persistence per-user
10. Audio cue on page load
11. Corrected Help text
12. Session resume-or-restart choice — Lessons page
13. Session resume-or-restart choice — MCQ page
14. Voice pitch control (backend column, endpoint, Navbar UI)
15. Practice Mode (Dictate-only voice coding sandbox) — built in an earlier session, hardened extensively in this one (see §6.1)

---

## 6. Features Built / Modified THIS Session

### 6.1 Practice Mode — hardening pass (multiple rounds)

Starting point: Practice Mode worked for simple single-line dictation but had no error tolerance, a limited symbol vocabulary, no indentation support, and (it turned out) a real underlying audio-capture bug.

**a. Spoken punctuation-convention hint**
- Added to the welcome flow in all three languages: explains that Python symbols must be spoken as words ("open paren," "quote," "colon," etc.) with a worked example, so a first-time student doesn't hit an unexplained `SyntaxError`.

**b. `H` key — on-demand full symbol reference**
- New translation key `practiceSymbolHelp`, speakable anytime, listing every supported symbol word.
- Fixed a real bug found during this: the first version embedded raw glyphs like `(` `)` `[` `]` directly in the Hindi spoken string, which browser TTS engines skip/mumble — producing an audible "के लिए के लिए" stutter. Rewrote to describe symbols verbally ("round bracket," "square bracket," etc.) instead of embedding the literal characters.

**c. Expanded symbol/operator set**
Original set: paren, bracket, brace (open/close each), quote, colon, comma, equals, plus, minus, dot, underscore.
Added this session: comparison operators (`<`, `>`, `<=`, `>=`, `!=`), arithmetic (`%`, `*`, `/`), apostrophe (`'`), semicolon (`;`), exclamation (`!`) — 20 symbols total, all tested (e.g. "x not equal to y colon" → `x != y:`).

**d. Mishearing tolerance (`convertSpokenPunctuation`)**
Iteratively expanded based on real transcripts the student reported:
- "paren" mishearings handled: `parent`, `pattern`, `parren`, `karen`, `parrot`, `paris`, `parents` (plural)
- "quote" mishearings handled: `quotes`, `court`, `coat`, `quart`, `code`
- Process: student reports a failed phrase → debug logging (temporarily added, later removed) shows the exact raw transcript → new alias added → verified against the literal failing case before shipping.

**e. Indentation support (previously the largest structural gap)**
- **Auto-indent:** any confirmed line ending in `:` automatically indents the next line one level — covers `if`/`for`/`while`/`def`/`class`/`try` with zero extra student effort.
- **Manual `dedent`** — spoken as its own line, applied immediately (no Y/N confirmation needed) — steps the indent level back by one. Used before `else`/`elif`, or after leaving a loop body.
- **Manual `indent`** — for the rare case auto-indent isn't enough.
- On-screen "Indent level: N (N×4 spaces)" indicator next to the code buffer, so it's not purely audio-only.
- Verified end-to-end with a real `if`/`else` dictation producing correctly-nested Python.

**f. Undo last line (`U` key)**
- Deliberately scoped to *only* undo the most recent line — not arbitrary mid-buffer editing — because indentation for everything after a given line depends on the full sequence up to that point (colons, manual indent/dedent). Correctly reprocessing an arbitrary deletion is a much bigger, bug-prone job for comparatively little real-world benefit; "undo my last mistake" covers the actual pain point.
- Correctly rolls back the auto-indent bump if the removed line ended in `:` — verified with a dry-run: dictating a wrong nested `if`, undoing it, and confirming the next line lands back at the correct (shallower) indent.
- Visible "Undo last line" button added below the main action grid, disabled when buffer is empty.

**g. Fixed real speech-recognition bugs (not just vocabulary)**
- **Chrome silence-timeout cutoff:** Chrome auto-stops "continuous" recognition after a few seconds of silence (e.g. a natural pause mid-sentence) — cutting students off before they pressed T to stop. Fixed by detecting whether a stop was student-requested (via a `stopRequestedRef`) vs. browser-initiated; browser-initiated stops now silently trigger a fresh recognition session that keeps accumulating into the same transcript, invisible to the student.
- **Finalization-timing race:** if a student pressed T to stop right as they finished talking, Chrome sometimes hadn't yet "finalized" the last words, and the old code discarded anything not finalized — producing a false "could not hear" even though the mic worked. Fixed by tracking the live interim transcript as a fallback, used only if nothing got finalized by stop time.

**h. Root-cause diagnosis: the real "it's not listening" bug**
- After the above fixes, dictation was still silently failing. Used temporary `console.log` debug instrumentation (later removed) to discover `onresult` was never firing at all — meaning no audio was reaching the recognizer, despite Chrome's mic icon showing active.
- Root cause found via the user's Windows Sound Settings screenshot: the **default microphone was set to "DroidCam Audio"** (a virtual device from a phone-as-webcam app), not the real headset — so Windows itself was capturing silence.
- **Not a code bug.** Fixed by the student switching the default input device in Windows Settings → System → Sound → Input to their actual headset mic. Confirmed working via the input meter moving when speaking.

---

### 6.2 Guardian/Mentor progress view — IN PROGRESS, not yet complete

**Design decided (Claude's recommendation, accepted):**
- **Access method:** shareable read-only link with a random token, not a separate guardian login system — lighter to build correctly, and the *student* controls it (regenerating the token instantly kills an old link, no password-reset flow needed).
- **Data exposed:** deliberately high-level only — streak, lessons/MCQ completion status, MCQ score, last active date. No raw dictated code, no quiz question content, no email/password. Chosen conservatively since some students may be minors.

**Backend — DONE:**
- `database.py`: `guardian_token` column added to `User` (see §4). Migration not yet confirmed run against the live DB.
- `main.py`: four endpoints added — `/guardian/enable`, `/guardian/disable`, `/guardian/status/{user_id}`, `/guardian/{token}` (see §3 for full detail). Syntax-verified, all original endpoints confirmed still intact.

**Frontend — INCOMPLETE, needs redo:**
- A `Navbar.jsx` update was drafted this session: a "👪 Guardian" button opening a small panel with generate-link / copy-link / regenerate / turn-off-sharing controls, plus spoken confirmations in all three languages (`GUARDIAN_LABELS` dictionary written for hi/en/mr).
- **This file delivery failed** — the `create_file` tool call errored out (`path: Field required`) and the updated `Navbar.jsx` was never actually generated or handed to the student. **This needs to be redone from scratch in a follow-up turn** — nothing from this attempt currently exists as a deliverable file.
- `GuardianViewPage.jsx` (the actual page a guardian sees when they open the link) — **not started at all.**
- `App.jsx` route for `/guardian/:token` — **not started at all.**

---

## 7. Known Open Items / Immediate Next Steps

1. **Redo the `Navbar.jsx` guardian-sharing panel** — the previous attempt failed to save; needs to be regenerated and actually delivered this time.
2. **Build `GuardianViewPage.jsx`** — a plain, sighted-friendly (not voice-first) page at `/guardian/:token` that calls `GET /guardian/{token}` and displays the summary: student name, streak, per-language lesson/MCQ/agent progress, last active date. Needs a friendly "link not found/expired" state for invalid tokens.
3. **Wire the `/guardian/:token` route into `App.jsx`.**
4. **Confirm the `guardian_token` migration has actually been run** against the live `drishti.db` before restarting the backend with the new model — otherwise queries touching `users` will error.
5. **Verify Practice Mode end-to-end** with the corrected microphone selection and the full run of fixes from this session (mishearing tolerance, indentation, undo) — last confirmed working test was a single corrected line; a longer multi-line session with indentation and an undo hasn't been retested back-to-back by the student yet.

---

## 8. Features Discussed, Explicitly Skipped (unchanged from before)

- **WhatsApp reminders** — skipped, no free tier exists for production messaging (Twilio + Meta fees apply regardless of provider). In-app spoken streak announcement remains the sole reminder mechanism.
- **Vibration feedback** (`navigator.vibrate()`) — skipped, redundant given the app is already audio-first with verbal confirmation of every action; no iOS Safari support.
- **Describe Mode within Practice** — cut in an earlier session after recognizing near-total overlap with the existing Agent page. Practice Mode is Dictate-only.
- **Arbitrary mid-buffer line editing in Practice Mode** — deliberately scoped down to "undo last line only" this session (see §6.1f) — full arbitrary-position editing would need to correctly recompute indentation for everything downstream of the edit, which is a much larger and more error-prone job for comparatively marginal benefit over "undo the mistake I just made."

---

## 9. Features Discussed But Not Yet Built

**From the original brainstorm, still open:**
- Peer support / buddy system pairing
- Actual hands-on testing with real screen readers (NVDA/JAWS/TalkBack) — code-review-level audit only so far. **Needs a human at the keyboard — Sharada specifically — not buildable by AI.**
- Braille display verification
- Guardian/mentor progress view — **in progress this session, see §6.2, not complete.**
- Rephrase/simplify button for lessons

**Also still open:**
- Server timezone for streaks — recommend pinning to `Asia/Kolkata` for production, not yet done
- Shortcut key collisions with screen readers — intentionally left unresolved by design
- `H` key double-duty on IntroPage/CertificatePage — harmless, unresolved, noted for future
- `frontend/README.md` — still flagged modified in git status across many sessions now, contents never actually reviewed
- A handful of unused Describe-mode translation keys (`practiceModeExplain`, `practiceDescribeMode`, `practiceHeardCommand`, `practiceNoCommand`, `practiceGenerating`, `practiceCodeReady`, `practiceYourCommand`) — harmless leftover from when Practice Mode had a Describe sub-mode that was later cut; safe to clean up whenever, not urgent

---

## 10. Suggested Next Steps, In Priority Order

1. **Redo `Navbar.jsx`** — the guardian panel that failed to save last time. This is the immediate unblocker for the rest of the guardian feature.
2. **Build `GuardianViewPage.jsx` and wire the route** — completes the guardian/mentor feature end-to-end.
3. **Confirm the database migration** for `guardian_token` was actually applied.
4. **Full end-to-end retest of Practice Mode** with the real microphone now correctly selected, covering: mishearing-tolerant dictation, the `H` symbol reference, an `if`/`else` block using auto-indent + manual `dedent`, and an `U` undo mid-session.
5. Once guardian view is stable: decide on **real screen-reader testing** (needs Sharada with NVDA or TalkBack) as the next major milestone — this is the one item on the whole roadmap that fundamentally cannot be done by AI and needs a human tester.