import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

// GuardianViewPage — the page a parent/mentor sees when they open a
// shared guardian link (GET /guardian/:token). Unlike every other
// page in this app, this one is NOT voice-first: guardians are
// assumed sighted, so this is a plain, readable summary page with no
// keyboard-shortcut/TTS machinery.
//
// NOTE ON API SHAPE: the exact field names returned by
// GET /guardian/{token} weren't available while building this, so
// the parsing below tries a couple of reasonable key-name variants
// (e.g. streak_days vs streak, mcq_score vs score). If nothing
// renders after a real backend call, log the raw response and adjust
// the field names in normalizeSummary() below to match.

const LANGUAGE_DISPLAY_NAMES = {
  python: "Python",
  sql: "SQL",
  javascript: "JavaScript",
}

function normalizeSummary(data) {
  const languagesRaw = data.languages || data.progress || data.per_language || []
  const languages = languagesRaw.map((entry) => ({
    language: entry.language || entry.lang || "Unknown",
    lessonsDone: Boolean(entry.lessons_done ?? entry.lessonsDone),
    mcqDone: Boolean(entry.mcq_done ?? entry.mcqDone),
    mcqScore: entry.mcq_score ?? entry.mcqScore ?? null,
    agentDone: Boolean(entry.agent_done ?? entry.agentDone),
  }))

  return {
    name: data.name || data.student_name || "Student",
    streakDays: data.streak_days ?? data.streak ?? 0,
    lastActiveDate: data.last_active_date || data.last_active || null,
    languages,
  }
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f9fc",
    color: "#1c2733",
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
    padding: "2rem 1.25rem",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: "560px",
  },
  header: {
    marginBottom: "1.5rem",
  },
  eyebrow: {
    fontSize: "0.8rem",
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "#5b6b7c",
    marginBottom: "0.35rem",
  },
  title: {
    fontSize: "1.6rem",
    fontWeight: 800,
    margin: 0,
  },
  statsRow: {
    display: "flex",
    gap: "0.75rem",
    marginTop: "1.25rem",
    marginBottom: "1.75rem",
    flexWrap: "wrap",
  },
  statCard: {
    flex: "1 1 140px",
    background: "#fff",
    border: "1px solid #e3e8ee",
    borderRadius: "14px",
    padding: "0.9rem 1rem",
  },
  statValue: {
    fontSize: "1.5rem",
    fontWeight: 800,
    color: "#1cb0f6",
  },
  statLabel: {
    fontSize: "0.78rem",
    color: "#5b6b7c",
    marginTop: "0.2rem",
  },
  sectionTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    marginBottom: "0.75rem",
  },
  langCard: {
    background: "#fff",
    border: "1px solid #e3e8ee",
    borderRadius: "14px",
    padding: "1rem 1.1rem",
    marginBottom: "0.75rem",
  },
  langName: {
    fontWeight: 700,
    fontSize: "0.95rem",
    marginBottom: "0.5rem",
  },
  progressRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.85rem",
    color: "#3a4753",
    marginBottom: "0.3rem",
  },
  badgeDone: {
    display: "inline-block",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#58cc02",
    flexShrink: 0,
  },
  badgePending: {
    display: "inline-block",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#d6dde3",
    flexShrink: 0,
  },
  emptyState: {
    textAlign: "center",
    padding: "3rem 1rem",
  },
  emptyTitle: {
    fontSize: "1.2rem",
    fontWeight: 700,
    marginBottom: "0.5rem",
  },
  emptyText: {
    color: "#5b6b7c",
    fontSize: "0.9rem",
  },
  footer: {
    marginTop: "2rem",
    fontSize: "0.75rem",
    color: "#8593a1",
    textAlign: "center",
  },
}

function GuardianViewPage() {
  const { token } = useParams()
  const [status, setStatus] = useState("loading") // loading | ok | not_found | error
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!token) {
        setStatus("not_found")
        return
      }
      setStatus("loading")
      try {
        const res = await fetch(`http://127.0.0.1:8000/guardian/${token}`)
        if (res.status === 404) {
          if (!cancelled) setStatus("not_found")
          return
        }
        if (!res.ok) {
          if (!cancelled) setStatus("error")
          return
        }
        const data = await res.json()
        if (!cancelled) {
          setSummary(normalizeSummary(data))
          setStatus("ok")
        }
      } catch {
        if (!cancelled) setStatus("error")
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [token])

  if (status === "loading") {
    return (
      <div style={styles.page}>
        <div style={{ ...styles.card, ...styles.emptyState }}>
          <p style={styles.emptyText}>Loading progress…</p>
        </div>
      </div>
    )
  }

  if (status === "not_found") {
    return (
      <div style={styles.page}>
        <div style={{ ...styles.card, ...styles.emptyState }}>
          <div style={styles.emptyTitle}>This link isn't valid</div>
          <p style={styles.emptyText}>
            It may have expired, been turned off, or replaced by a newer link.
            Ask the student to share their current guardian link.
          </p>
        </div>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div style={styles.page}>
        <div style={{ ...styles.card, ...styles.emptyState }}>
          <div style={styles.emptyTitle}>Couldn't load this right now</div>
          <p style={styles.emptyText}>
            There was a problem reaching the server. Please try again in a moment.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.eyebrow}>Drishti · Guardian view</div>
          <h1 style={styles.title}>{summary.name}'s progress</h1>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{summary.streakDays}</div>
            <div style={styles.statLabel}>day streak</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>
              {summary.lastActiveDate || "—"}
            </div>
            <div style={styles.statLabel}>last active</div>
          </div>
        </div>

        <div style={styles.sectionTitle}>By subject</div>

        {summary.languages.length === 0 && (
          <p style={styles.emptyText}>No progress recorded yet.</p>
        )}

        {summary.languages.map((lang) => (
          <div key={lang.language} style={styles.langCard}>
            <div style={styles.langName}>
              {LANGUAGE_DISPLAY_NAMES[lang.language] || lang.language}
            </div>
            <div style={styles.progressRow}>
              <span style={lang.lessonsDone ? styles.badgeDone : styles.badgePending} />
              Lessons {lang.lessonsDone ? "completed" : "in progress"}
            </div>
            <div style={styles.progressRow}>
              <span style={lang.mcqDone ? styles.badgeDone : styles.badgePending} />
              Quiz {lang.mcqDone ? `completed — score ${lang.mcqScore ?? "—"}` : "not started"}
            </div>
            <div style={styles.progressRow}>
              <span style={lang.agentDone ? styles.badgeDone : styles.badgePending} />
              AI Agent {lang.agentDone ? "used" : "not used yet"}
            </div>
          </div>
        ))}

        <div style={styles.footer}>
          This is a read-only summary shared by the student. It does not show
          quiz questions or written code.
        </div>
      </div>
    </div>
  )
}

export default GuardianViewPage
