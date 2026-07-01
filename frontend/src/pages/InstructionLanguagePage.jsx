import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const instructionLanguages = [
  { id: "hindi",   label: "हिंदी",   desc: "Hindi medium — सबसे popular",    key: "1", flag: "🇮🇳", voiceLang: "hi-IN" },
  { id: "english", label: "English", desc: "English medium — for all users",  key: "2", flag: "🌍", voiceLang: "en-US" },
  { id: "marathi", label: "मराठी",   desc: "Marathi + English mix",           key: "3", flag: "🇮🇳", voiceLang: "mr-IN" },
]

// Design tokens — consistent with full redesign
const ACCENT        = "#1cb0f6"
const ACCENT_SOFT   = "rgba(28,176,246,0.10)"
const ACCENT_HOVER  = "rgba(28,176,246,0.18)"
const ACCENT_BORDER = "rgba(28,176,246,0.28)"
const ACCENT_SHADOW = "#0a8fd4"
const CREAM         = "#f1f5f9"
const MUTED         = "#94a3b8"

// Small Pyra mascot for the very first screen
function PyraMini() {
  return (
    <svg width="52" height="52" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <style>{`
        @keyframes ilAnt { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
        @keyframes ilEye { 0%,88%,100%{transform:scaleY(1)} 94%{transform:scaleY(0.1)} }
        @keyframes ilFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        .ilAnt { animation: ilAnt 2s ease-in-out infinite; transform-origin: 28px 10px; }
        .ilEye { animation: ilEye 3.5s ease-in-out infinite; transform-origin: center; }
        .ilBody { animation: ilFloat 3s ease-in-out infinite; }
      `}</style>
      <g className="ilBody">
        <g className="ilAnt">
          <line x1="28" y1="10" x2="28" y2="4" stroke={ACCENT} strokeWidth="2" strokeLinecap="round"/>
          <circle cx="28" cy="3" r="2.5" fill={ACCENT}/>
        </g>
        <rect x="10" y="12" width="36" height="30" rx="8" fill={ACCENT}/>
        <rect x="14" y="16" width="28" height="20" rx="5" fill="#0a8fd4"/>
        <ellipse className="ilEye" cx="21" cy="24" rx="3.5" ry="3.5" fill="white"/>
        <ellipse className="ilEye" cx="35" cy="24" rx="3.5" ry="3.5" fill="white"/>
        <circle cx="21" cy="24" r="1.5" fill="#003d6b"/>
        <circle cx="35" cy="24" r="1.5" fill="#003d6b"/>
        <path d="M19 31 Q28 35 37 31" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <rect x="6" y="20" width="4" height="8" rx="2" fill="#0a8fd4"/>
        <rect x="46" y="20" width="4" height="8" rx="2" fill="#0a8fd4"/>
        <rect x="17" y="42" width="8" height="6" rx="3" fill="#0a8fd4"/>
        <rect x="31" y="42" width="8" height="6" rx="3" fill="#0a8fd4"/>
      </g>
    </svg>
  )
}

function InstructionLanguagePage() {
  const navigate = useNavigate()
  const [lastMessage, setLastMessage] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)
  const [pressedId, setPressedId] = useState(null)

  function speak(text, lang, onEnd) {
    window.speechSynthesis.cancel()
    setLastMessage({ text, lang })
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang || "hi-IN"
    utterance.rate = parseFloat(localStorage.getItem("speed") || "0.85")
    const trySpeak = () => {
      const voices = window.speechSynthesis.getVoices()
      const preferred = voices.find(v =>
        (lang === "en-US" && v.name === "Microsoft Zira - English (United States)") ||
        (lang === "hi-IN" && v.name === "Google हिन्दी")
      ) || voices.find(v => v.lang === lang)
      if (preferred) utterance.voice = preferred
      if (onEnd) utterance.onend = onEnd
      window.speechSynthesis.speak(utterance)
    }
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = trySpeak
    } else {
      trySpeak()
    }
  }

  useEffect(() => {
    setTimeout(() => {
      const rate = parseFloat(localStorage.getItem("speed") || "0.85")
      const u1 = new SpeechSynthesisUtterance("1 दबाएं हिंदी के लिए।")
      u1.lang = "hi-IN"; u1.rate = rate
      const u2 = new SpeechSynthesisUtterance("For English, press 2.")
      u2.lang = "en-US"; u2.rate = rate
      const u3 = new SpeechSynthesisUtterance("मराठीसाठी 3 दाबा.")
      u3.lang = "hi-IN"; u3.rate = rate
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(u1)
      window.speechSynthesis.speak(u2)
      window.speechSynthesis.speak(u3)
    }, 500)
  }, [])

  function selectLanguage(lang) {
    const messages = {
      hindi:   { text: "हिंदी चुना! चलिए शुरू करते हैं।",    voice: "hi-IN" },
      english: { text: "English selected! Let's get started.", voice: "en-US" },
      marathi: { text: "मराठी निवडली! चला सुरू करूया।",      voice: "hi-IN" },
    }
    const msg = messages[lang.id]
    speak(msg.text, msg.voice, () => {
      navigate("/login", { state: { instructionLang: lang.id } })
    })
  }

  useEffect(() => {
    function handleKey(e) {
      const lang = instructionLanguages.find(l => l.key === e.key)
      if (lang) {
        setPressedId(lang.id)
        setTimeout(() => setPressedId(null), 150)
        selectLanguage(lang)
      }
      if (e.key.toLowerCase() === "r" && lastMessage) {
        speak(lastMessage.text, lastMessage.lang)
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [lastMessage])

  return (
    <main id="main-content" tabIndex={-1} aria-label="Instruction Language Selection" style={{
  minHeight: "100vh",
  position: "relative",
  overflow: "hidden",
  background: "linear-gradient(160deg, #0d1b2a 0%, #0a0a0a 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "'Segoe UI', sans-serif",
  padding: "2rem",
  outline: "none",
}}>

      {/* Glow blobs — blue */}
      <div style={{
        position: "absolute", top: "-10%", left: "-10%",
        width: "420px", height: "420px", borderRadius: "50%",
        background: ACCENT, opacity: 0.07, filter: "blur(80px)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-15%", right: "-10%",
        width: "480px", height: "480px", borderRadius: "50%",
        background: ACCENT, opacity: 0.05, filter: "blur(90px)",
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: "640px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.25rem" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem" }}>
            <PyraMini />
          </div>
          <div style={{ color: ACCENT, fontSize: "2rem", fontWeight: 700, letterSpacing: "0.02em" }}>
            दृष्टि
          </div>
          <h1 style={{ color: CREAM, fontSize: "1.75rem", margin: "0.35rem 0 0", fontWeight: 700 }}>
            Choose Your Language
          </h1>
          <p style={{ color: ACCENT, margin: "0.25rem 0 0", fontSize: "0.9rem" }}>
            अपनी भाषा चुनें
          </p>
          <p style={{ color: MUTED, margin: "0.2rem 0 0", fontSize: "0.85rem" }}>
            दृष्टि में आपका स्वागत है — Welcome to Drishti
          </p>
        </div>

        {/* Language cards — 3 columns, 3D press */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
          {instructionLanguages.map((lang) => {
            const isHovered = hoveredId === lang.id
            const isPressed = pressedId === lang.id

            const cardBorder  = isHovered ? ACCENT : ACCENT_BORDER
            const cardBg      = isHovered ? ACCENT_HOVER : ACCENT_SOFT
            const cardShadow  = isPressed
              ? "0 0px 0 0 transparent"
              : isHovered
              ? `0 6px 0 0 ${ACCENT_SHADOW}`
              : `0 3px 0 0 rgba(28,176,246,0.2)`
            const cardTranslate = isPressed
              ? "translateY(6px)"
              : isHovered
              ? "translateY(-2px)"
              : "translateY(0)"

            return (
              <button
                key={lang.id}
                onClick={() => selectLanguage(lang)}
                onMouseEnter={() => setHoveredId(lang.id)}
                onMouseLeave={() => setHoveredId(null)}
                onMouseDown={() => setPressedId(lang.id)}
                onMouseUp={() => setPressedId(null)}
                aria-label={`${lang.label} — press ${lang.key}`}
                style={{
                  padding: "1.75rem 1rem",
                  borderRadius: "16px",
                  border: `1px solid ${cardBorder}`,
                  cursor: "pointer",
                  textAlign: "center",
                  fontFamily: "'Segoe UI', sans-serif",
                  background: cardBg,
                  backdropFilter: "blur(10px)",
                  transform: cardTranslate,
                  boxShadow: cardShadow,
                  transition: "transform 0.1s, box-shadow 0.1s, border-color 0.15s, background 0.15s",
                }}
              >
                <div style={{ fontSize: "2.2rem", marginBottom: "0.4rem" }}>{lang.flag}</div>
                <div style={{ color: ACCENT, fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.25rem" }}>
                  {lang.label}
                </div>
                <div style={{ color: MUTED, fontSize: "0.8rem", marginBottom: "0.4rem" }}>
                  {lang.desc}
                </div>
                <div style={{ color: "rgba(28,176,246,0.5)", fontSize: "0.75rem", fontWeight: 600 }}>
                  (Press {lang.key})
                </div>
              </button>
            )
          })}
        </div>

        {/* Keyboard shortcuts bar */}
        <div style={{
          background: "rgba(28,176,246,0.05)",
          border: `1px solid ${ACCENT_BORDER}`,
          borderRadius: "12px",
          padding: "1rem",
          textAlign: "center",
          backdropFilter: "blur(10px)",
        }}>
          <p style={{ color: MUTED, fontSize: "0.8rem", margin: "0 0 0.6rem", fontWeight: 500 }}>
            Keyboard Shortcuts / कीबोर्ड शॉर्टकट
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            {instructionLanguages.map(lang => (
              <div key={lang.key} style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                <span style={{
                  background: ACCENT_SOFT,
                  color: ACCENT,
                  padding: "0.2rem 0.55rem",
                  borderRadius: "6px",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  border: `1px solid ${ACCENT_BORDER}`,
                }}>
                  {lang.key}
                </span>
                <span style={{ color: MUTED, fontSize: "0.82rem" }}>{lang.label}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
              <span style={{
                background: ACCENT_SOFT,
                color: ACCENT,
                padding: "0.2rem 0.55rem",
                borderRadius: "6px",
                fontWeight: 700,
                fontSize: "0.85rem",
                border: `1px solid ${ACCENT_BORDER}`,
              }}>
                R
              </span>
              <span style={{ color: MUTED, fontSize: "0.82rem" }}>Repeat / दोबारा</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}

export default InstructionLanguagePage