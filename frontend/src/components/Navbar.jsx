import { useEffect, useRef, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { setupAutoFlush } from "./offlineSync"

// Page names spoken by Pyra when the user asks "where am I" (W key).
// Keyed by instructionLang so the announcement matches whatever
// language the learner picked on the Language Selection page.
const PAGE_LABELS = {
  hi: {
    "/lessons": "पाठ पेज",
    "/mcq": "प्रश्नोत्तरी पेज",
    "/agent": "एआई एजेंट पेज",
    "/practice": "प्रैक्टिस पेज",
  },
  en: {
    "/lessons": "Lessons page",
    "/mcq": "MCQ Quiz page",
    "/agent": "AI Agent page",
    "/practice": "Practice page",
  },
  mr: {
    "/lessons": "धडे पान",
    "/mcq": "प्रश्नमंजुषा पान",
    "/agent": "एआय एजंट पान",
    "/practice": "प्रॅक्टिस पान",
  },
}

const WHERE_AM_I_PROMPT = {
  hi: "कहाँ हूँ बताने के लिए W दबाएं",
  en: "Press W to hear where you are",
  mr: "मी कुठे आहे हे ऐकण्यासाठी W दाबा",
}

// Fallback shortcuts spoken by "H = help" when a page hasn't supplied
// its own helpText prop. Covers the global navigation shortcuts that
// exist on every page.
const GENERAL_HELP = {
  hi: "M = Theme बदलें, W = कहाँ हूँ, H = यह मदद दोबारा सुनें। Lessons, MCQ, Agent, या Practice पर जाने के लिए ऊपर दिए गए buttons दबाएं",
  en: "M to toggle theme, W to hear where you are, H to hear this help again. Use the buttons at the top to go to Lessons, MCQ, Agent, or Practice",
  mr: "M = Theme बदला, W = मी कुठे आहे, H = ही मदत परत ऐका। Lessons, MCQ, Agent, किंवा Practice वर जाण्यासाठी वरील buttons दाबा",
}

const HELP_PROMPT = {
  hi: "मदद के लिए H दबाएं",
  en: "Press H for help",
  mr: "मदतीसाठी H दाबा",
}

const OFFLINE_LABEL = {
  hi: "आप offline हैं — progress वापस आते ही save होगी",
  en: "You're offline — progress will save when back online",
  mr: "तुम्ही offline आहात — connection परत आल्यावर progress save होईल",
}

function speakWhereAmI(text, lang, rate) {
  if (typeof window === "undefined" || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  utter.rate = rate || 1
  utter.lang = lang === "hi" ? "hi-IN" : lang === "mr" ? "mr-IN" : "en-IN"
  window.speechSynthesis.speak(utter)
}

function Navbar({
  name, theme, toggleTheme, fontSize, setFontSize, speed, setSpeed,
  pitch, setPitch,
  language, instructionLang, userId,
  cardBg, cardBorder, borderWidth, textColor, mutedColor,
  accent, accentText, accentSoft,
  pageContext,
  // Optional: page-specific list of keyboard shortcuts spoken when the
  // user presses H. Pass this down from each page (e.g. "L = Listen,
  // N = Next, R = Repeat, T = Voice answer"). Falls back to
  // GENERAL_HELP (nav-only shortcuts) if not provided.
  helpText,
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const pageContextRef = useRef(pageContext)
  pageContextRef.current = pageContext
  const helpTextRef = useRef(helpText)
  helpTextRef.current = helpText

  const [isOnline, setIsOnline] = useState(
    typeof navigator === "undefined" ? true : navigator.onLine
  )

  useEffect(() => {
    setupAutoFlush()
    const goOnline = () => setIsOnline(true)
    const goOffline = () => setIsOnline(false)
    window.addEventListener("online", goOnline)
    window.addEventListener("offline", goOffline)
    return () => {
      window.removeEventListener("online", goOnline)
      window.removeEventListener("offline", goOffline)
    }
  }, [])

  const pages = [
    { path: "/lessons", label: "Lessons", key: "1" },
    { path: "/mcq",     label: "MCQ",     key: "2" },
    { path: "/agent",   label: "Agent",   key: "3" },
    { path: "/practice",label: "Practice",key: "4" },
  ]

  function announceWhereAmI() {
    const lang = instructionLang || "en"
    const labels = PAGE_LABELS[lang] || PAGE_LABELS.en
    const pageName = labels[location.pathname] || location.pathname
    const extra = pageContextRef.current
    const text = extra ? `${pageName}. ${extra}` : pageName
    speakWhereAmI(text, lang, speed)
  }

  function announceHelp() {
    const lang = instructionLang || "en"
    const specific = helpTextRef.current
    const general = GENERAL_HELP[lang] || GENERAL_HELP.en
    const text = specific ? `${specific}. ${general}` : general
    speakWhereAmI(text, lang, speed)
  }

  // Global "W" shortcut — works from anywhere on the page, not just
  // when the navbar has focus, so it behaves like the existing M
  // (theme) shortcut. Ignored while typing in an input/textarea so it
  // doesn't fire while someone is filling out a form field.
  useEffect(() => {
    function handleKeyDown(e) {
      const tag = document.activeElement && document.activeElement.tagName
      if (tag === "INPUT" || tag === "TEXTAREA") return
      const key = e.key.toLowerCase()
      if (key === "w") {
        e.preventDefault()
        announceWhereAmI()
      }
      if (key === "h") {
        e.preventDefault()
        announceHelp()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, instructionLang, speed])

  function goTo(path) {
    navigate(path, { state: { name, language, instructionLang, user_id: userId } })
  }

  function increaseFontSize() {
    setFontSize(Math.min(fontSize + 2, 24))
  }

  function decreaseFontSize() {
    setFontSize(Math.max(fontSize - 2, 12))
  }

  function saveSpeedToServer(newSpeed) {
  if (!userId) return
  fetch("http://127.0.0.1:8000/settings/speech-rate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, speech_rate: newSpeed }),
  }).catch(() => {
    // Silently ignore — if offline or the request fails, the change
    // still applies locally via setSpeed above.
  })
}

function increaseSpeed() {
  const newSpeed = Math.min(parseFloat((speed + 0.1).toFixed(1)), 1.5)
  setSpeed(newSpeed)
  saveSpeedToServer(newSpeed)
}

function decreaseSpeed() {
  const newSpeed = Math.max(parseFloat((speed - 0.1).toFixed(1)), 0.5)
  setSpeed(newSpeed)
  saveSpeedToServer(newSpeed)
}

function savePitchToServer(newPitch) {
  if (!userId) return
  fetch("http://127.0.0.1:8000/settings/voice-pitch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, voice_pitch: newPitch }),
  }).catch(() => {
    // Silently ignore — same as speed, change still applies locally.
  })
}

function increasePitch() {
  const newPitch = Math.min(parseFloat((pitch + 0.05).toFixed(2)), 1.15)
  setPitch(newPitch)
  savePitchToServer(newPitch)
}

function decreasePitch() {
  const newPitch = Math.max(parseFloat((pitch - 0.05).toFixed(2)), 0.85)
  setPitch(newPitch)
  savePitchToServer(newPitch)
}

  const controlBtn = {
    padding: "0.32rem 0.6rem",
    fontSize: "0.78rem",
    borderRadius: "9px",
    border: "none",
    background: "transparent",
    color: mutedColor,
    cursor: "pointer",
  }

  return (
    <>
      <style>{`
        .navbtn { transition: transform 0.1s, background 0.15s, color 0.15s; cursor: pointer; }
        .navbtn:active { transform: scale(0.94); }
        @keyframes navFlame {
          0%, 100% { transform: scale(1) rotate(-3deg); }
          50% { transform: scale(1.12) rotate(3deg); }
        }
        .navFlame { display: inline-block; animation: navFlame 1.3s ease-in-out infinite; }
      `}</style>
      <nav
        aria-label="Main navigation"
        style={{
          background: cardBg,
          border: `${borderWidth} solid ${cardBorder}`,
          boxShadow: `0 2px 0 0 ${cardBorder}`,
          borderRadius: "14px",
          padding: "0.55rem 0.85rem",
          marginBottom: "0.9rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        {/* Page links */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {pages.map(({ path, label, key }) => {
            const isActive = location.pathname === path
            return (
              <button
                key={path}
                className="navbtn"
                onClick={() => goTo(path)}
                aria-label={`${label} — ${key} दबाएं`}
                aria-current={isActive ? "page" : undefined}
                style={{
                  padding: "0.4rem 0.85rem",
                  fontSize: "0.8rem",
                  borderRadius: "10px",
                  border: "none",
                  fontWeight: isActive ? "700" : "600",
                  background: isActive ? accent : "transparent",
                  color: isActive ? accentText : mutedColor,
                }}
              >
                {label}{" "}
                <span style={{ fontSize: "0.62rem", opacity: 0.7 }}>({key})</span>
              </button>
            )
          })}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>

          {/* Font size */}
          <div style={{ display: "flex", gap: "0.2rem", alignItems: "center" }}>
            <span style={{ color: mutedColor, fontSize: "0.7rem" }}>A</span>
            <button className="navbtn" onClick={decreaseFontSize} aria-label="Font size कम करें" style={controlBtn}>−</button>
            <button className="navbtn" onClick={increaseFontSize} aria-label="Font size बढ़ाएं" style={controlBtn}>+</button>
            <span style={{ color: mutedColor, fontSize: "0.85rem", fontWeight: "600" }}>A</span>
          </div>

          {/* Speech speed */}
          <div style={{ display: "flex", gap: "0.2rem", alignItems: "center" }}>
            <span style={{ color: mutedColor, fontSize: "0.7rem" }}>🔊</span>
            <button className="navbtn" onClick={decreaseSpeed} aria-label="Speed कम करें" style={controlBtn}>−</button>
            <span style={{
              color: accent, fontSize: "0.75rem", fontWeight: "700",
              minWidth: "30px", textAlign: "center"
            }}>{speed}x</span>
            <button className="navbtn" onClick={increaseSpeed} aria-label="Speed बढ़ाएं" style={controlBtn}>+</button>
          </div>

          {/* Voice pitch */}
          <div style={{ display: "flex", gap: "0.2rem", alignItems: "center" }}>
            <span style={{ color: mutedColor, fontSize: "0.7rem" }}>🎵</span>
            <button className="navbtn" onClick={decreasePitch} aria-label="Pitch कम करें" style={controlBtn}>−</button>
            <span style={{
              color: accent, fontSize: "0.75rem", fontWeight: "700",
              minWidth: "30px", textAlign: "center"
            }}>{pitch}x</span>
            <button className="navbtn" onClick={increasePitch} aria-label="Pitch बढ़ाएं" style={controlBtn}>+</button>
          </div>

          {/* Theme toggle */}
          <button
            className="navbtn"
            onClick={toggleTheme}
            aria-label={`Theme toggle — M दबाएं. अभी ${theme === "dark" ? "dark" : "light"} mode है`}
            style={{
              ...controlBtn,
              border: `${borderWidth} solid ${cardBorder}`,
              fontWeight: "600",
            }}
          >
            {theme === "dark" ? "☀ Light" : "🌙 Dark"}{" "}
            <span style={{ fontSize: "0.62rem", opacity: 0.7 }}>(M)</span>
          </button>

          {/* Where am I? */}
          <button
            className="navbtn"
            onClick={announceWhereAmI}
            aria-label={WHERE_AM_I_PROMPT[instructionLang] || WHERE_AM_I_PROMPT.en}
            title={WHERE_AM_I_PROMPT[instructionLang] || WHERE_AM_I_PROMPT.en}
            style={{
              ...controlBtn,
              border: `${borderWidth} solid ${cardBorder}`,
              fontWeight: "600",
            }}
          >
            📍{" "}
            <span style={{ fontSize: "0.62rem", opacity: 0.7 }}>(W)</span>
          </button>

         {/* Help */}
          <button
            className="navbtn"
            onClick={announceHelp}
            aria-label={HELP_PROMPT[instructionLang] || HELP_PROMPT.en}
            title={HELP_PROMPT[instructionLang] || HELP_PROMPT.en}
            style={{
              ...controlBtn,
              border: `${borderWidth} solid ${cardBorder}`,
              fontWeight: "600",
            }}
          >
            ❓{" "}
            <span style={{ fontSize: "0.62rem", opacity: 0.7 }}>(H)</span>
          </button>

          {/* Offline indicator — only shown when actually offline */}
          {!isOnline && (
            <span
              role="status"
              aria-live="polite"
              title={OFFLINE_LABEL[instructionLang] || OFFLINE_LABEL.en}
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "#ff4b4b",
                background: "rgba(255,75,75,0.1)",
                border: "1px solid rgba(255,75,75,0.3)",
                borderRadius: "8px",
                padding: "0.3rem 0.6rem",
              }}
            >
              📡 Offline
            </span>
          )}

        </div>
      </nav> 
      
    </>
  )
}

export default Navbar