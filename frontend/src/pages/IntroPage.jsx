import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useTheme } from "../components/useTheme"

const translations = {
  hindi: {
    greeting: (name) => `नमस्ते ${name}! दृष्टि में आपका स्वागत है। मैं Pyra हूँ, आपकी coding tutor। क्या आप lessons शुरू करना चाहते हैं? H दबाएं हाँ के लिए, R दबाएं दोबारा सुनने के लिए।`,
    confirm: "बहुत अच्छा! चलिए सीखना शुरू करते हैं!",
    subtitle: "आपकी tutor — Pyra",
    question: "क्या आप lessons शुरू करना चाहते हैं?",
    yes: "हाँ!",
    repeat: "दोबारा",
  },
  english: {
    greeting: (name) => `Hello ${name}! Welcome to Drishti. I am Pyra, your coding tutor. Are you ready to start? Press H for yes, press R to hear this again.`,
    confirm: "Great! Let's start learning!",
    subtitle: "Your tutor — Pyra",
    question: "Are you ready to start lessons?",
    yes: "Yes!",
    repeat: "Repeat",
  },
  marathi: {
    greeting: (name) => `नमस्ते ${name}! दृष्टि मध्ये आपले स्वागत आहे। मी Pyra आहे, तुमची coding tutor। तुम्ही lessons सुरू करायला तयार आहात का? H दाबा हो साठी, R दाबा पुन्हा ऐकण्यासाठी।`,
    confirm: "छान! चला शिकायला सुरुवात करूया!",
    subtitle: "तुमची tutor — Pyra",
    question: "तुम्ही lessons सुरू करायला तयार आहात का?",
    yes: "हो!",
    repeat: "पुन्हा",
  },
}

const voiceLang = { hindi: "hi-IN", english: "en-US", marathi: "hi-IN" }

const ACCENT        = "#1cb0f6"
const ACCENT_SOFT   = "rgba(28,176,246,0.12)"
const ACCENT_BORDER = "rgba(28,176,246,0.28)"
const ACCENT_SHADOW = "#0a8fd4"
const CREAM         = "#f1f5f9"
const CREAM_MUTED   = "rgba(241,245,249,0.55)"

// Full Pyra mascot — larger, used as the hero on the intro screen
function PyraHero({ speaking }) {
  return (
    <svg width="90" height="90" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <style>{`
        @keyframes introAntBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        @keyframes introEyeBlink { 0%,88%,100%{transform:scaleY(1)} 94%{transform:scaleY(0.1)} }
        @keyframes introFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes introMouth { 0%,100%{opacity:0.7} 50%{opacity:1} }
        .iAnt { animation: introAntBob 2s ease-in-out infinite; transform-origin: 28px 10px; }
        .iEye { animation: introEyeBlink 3.5s ease-in-out infinite; transform-origin: center; }
        .iBody { animation: introFloat 3s ease-in-out infinite; }
        .iMouth { animation: introMouth 0.5s ease-in-out infinite; }
      `}</style>
      <g className="iBody">
        <g className="iAnt">
          <line x1="28" y1="10" x2="28" y2="3" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="28" cy="2" r="3" fill={ACCENT}/>
        </g>
        <rect x="10" y="12" width="36" height="30" rx="8" fill={ACCENT}/>
        <rect x="14" y="16" width="28" height="20" rx="5" fill="#0a8fd4"/>
        <ellipse className="iEye" cx="21" cy="24" rx="3.5" ry="3.5" fill="white"/>
        <ellipse className="iEye" cx="35" cy="24" rx="3.5" ry="3.5" fill="white"/>
        <circle cx="21" cy="24" r="1.5" fill="#003d6b"/>
        <circle cx="35" cy="24" r="1.5" fill="#003d6b"/>
        {/* Shine dots on eyes */}
        <circle cx="22" cy="23" r="0.7" fill="white" opacity="0.8"/>
        <circle cx="36" cy="23" r="0.7" fill="white" opacity="0.8"/>
        {speaking ? (
          <rect className="iMouth" x="18" y="30" width="20" height="3" rx="1.5" fill="#58cc02"/>
        ) : (
          <path d="M19 31 Q28 36 37 31" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
        )}
        <rect x="6" y="20" width="4" height="8" rx="2" fill="#0a8fd4"/>
        <rect x="46" y="20" width="4" height="8" rx="2" fill="#0a8fd4"/>
        <rect x="17" y="42" width="8" height="7" rx="3" fill="#0a8fd4"/>
        <rect x="31" y="42" width="8" height="7" rx="3" fill="#0a8fd4"/>
      </g>
    </svg>
  )
}

function IntroPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const name = location.state?.name || "Friend"
  const user_id = location.state?.user_id
  const instructionLang = location.state?.instructionLang || "english"
  const t = translations[instructionLang]
  const lang = voiceLang[instructionLang]
  const [lastMessage, setLastMessage] = useState("")
  const [speaking, setSpeaking] = useState(false)
  const { bg } = useTheme()

  function speak(text, onEnd) {
    window.speechSynthesis.cancel()
    setLastMessage(text)
    setSpeaking(true)
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = parseFloat(localStorage.getItem("speed") || "0.85")
    const trySpeak = () => {
      const voices = window.speechSynthesis.getVoices()
      const preferred = voices.find(v =>
        (lang === "en-US" && v.name === "Microsoft Zira - English (United States)") ||
        (lang === "hi-IN" && v.name === "Google हिन्दी")
      ) || voices.find(v => v.lang === lang)
      if (preferred) utterance.voice = preferred
      utterance.onend = () => { setSpeaking(false); if (onEnd) onEnd() }
      utterance.onerror = () => setSpeaking(false)
      window.speechSynthesis.speak(utterance)
    }
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = trySpeak
    } else {
      trySpeak()
    }
  }

  function goToLanguage() {
    speak(t.confirm, () => {
      navigate("/language", { state: { name, user_id, instructionLang } })
    })
  }

  useEffect(() => {
    setTimeout(() => speak(t.greeting(name)), 500)
  }, [])

  useEffect(() => {
    function handleKey(e) {
      const key = e.key.toLowerCase()
      if (key === "h") goToLanguage()
      if (key === "r") speak(lastMessage)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [lastMessage])

  return (
    <>
      <style>{`
        .intro-yes-btn {
          padding: 1rem; border-radius: 12px; border: none;
          background: ${ACCENT}; color: #fff;
          cursor: pointer; font-weight: 700; font-size: 1rem;
          box-shadow: 0 4px 0 0 ${ACCENT_SHADOW};
          transition: box-shadow 0.1s, transform 0.1s;
        }
        .intro-yes-btn:active {
          box-shadow: 0 0px 0 0 transparent;
          transform: translateY(4px);
        }
        .intro-repeat-btn {
          padding: 1rem; border-radius: 12px;
          border: 1px solid ${ACCENT_BORDER};
          background: transparent; color: ${CREAM_MUTED};
          cursor: pointer; font-weight: 600; font-size: 1rem;
          transition: background 0.15s, color 0.15s;
        }
        .intro-repeat-btn:hover { background: ${ACCENT_SOFT}; color: ${CREAM}; }
      `}</style>

      <main id="main-content" tabIndex={-1} aria-label="Drishti Intro" style={{
        outline: "none",
        minHeight: "100vh",
        background: "radial-gradient(circle at 50% 20%, #0d1b2a 0%, #0a0a0a 70%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', sans-serif",
        padding: "1rem",
      }}>

        {/* Glow blobs */}
        <div style={{
          position: "absolute", top: "-130px", left: "10%",
          width: "340px", height: "340px", borderRadius: "50%",
          background: ACCENT, opacity: 0.07, filter: "blur(95px)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-150px", right: "5%",
          width: "360px", height: "360px", borderRadius: "50%",
          background: ACCENT, opacity: 0.05, filter: "blur(100px)",
          pointerEvents: "none",
        }} />

        <div style={{ width: "100%", maxWidth: "560px", position: "relative", zIndex: 1 }}>

          {/* Hero — Pyra + brand name */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
              <PyraHero speaking={speaking} />
            </div>
            <h1 style={{ color: CREAM, fontSize: "2.4rem", margin: 0, fontWeight: 700 }}>दृष्टि</h1>
            <p style={{ color: ACCENT, fontSize: "0.9rem", margin: "0.2rem 0 0", letterSpacing: "3px", textTransform: "uppercase" }}>
              Drishti
            </p>
            <p style={{ color: CREAM_MUTED, margin: "0.35rem 0 0", fontSize: "0.88rem" }}>
              जहाँ code बोलता है
            </p>
            <p style={{ color: CREAM_MUTED, margin: "0.2rem 0 0", fontSize: "0.8rem" }}>
              {t.subtitle}
            </p>
          </div>

          {/* Speech bubble card */}
          <div style={{
            background: "rgba(28,176,246,0.06)",
            border: `1px solid ${ACCENT_BORDER}`,
            backdropFilter: "blur(12px)",
            padding: "1.75rem 2rem",
            borderRadius: "16px",
            textAlign: "center",
            marginBottom: "1.5rem",
            boxShadow: `0 2px 0 0 rgba(28,176,246,0.15)`,
          }}>
            <p style={{ fontSize: "1.25rem", color: CREAM, margin: "0 0 0.5rem", fontWeight: 500 }}>
              नमस्ते <strong style={{ color: ACCENT }}>{name}</strong>!
            </p>
            <p style={{ color: CREAM_MUTED, margin: 0, lineHeight: 1.6 }}>
              {t.question}
            </p>
            {speaking && (
              <p style={{ color: ACCENT, fontSize: "0.8rem", margin: "0.75rem 0 0", opacity: 0.8 }}>
                🔊 Pyra बोल रही है...
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <button className="intro-repeat-btn" onClick={() => speak(lastMessage)} aria-label="R — Repeat">
              {t.repeat}<br />
              <span style={{ fontSize: "0.78rem", color: ACCENT }}>(R)</span>
            </button>
            <button className="intro-yes-btn" onClick={goToLanguage} aria-label="H — Yes, start">
              {t.yes}<br />
              <span style={{ fontSize: "0.78rem", opacity: 0.85 }}>(H)</span>
            </button>
          </div>

        </div>
      </main>
    </>
  )
}

export default IntroPage





