
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { speak as speakUtil } from "../components/speak"
import { useTheme } from "../components/useTheme"

const instructionLanguages = [
  { id: "hindi", label: "हिंदी", desc: "Hindi medium — सबसे popular", key: "1", flag: "🇮🇳", voiceLang: "hi-IN" },
  { id: "english", label: "English", desc: "English medium — for all users", key: "2", flag: "🌍", voiceLang: "en-US" },
  { id: "marathi", label: "मराठी", desc: "Marathi + English mix", key: "3", flag: "🇮🇳", voiceLang: "mr-IN" },
]

const SAFFRON = "#f4a261"
const SAFFRON_DIM = "#f4a26180"
const SAFFRON_BG = "rgba(244, 162, 97, 0.08)"
const SAFFRON_BG_HOVER = "rgba(244, 162, 97, 0.14)"

function InstructionLanguagePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const name = location.state?.name || "Friend"
  const [lastMessage, setLastMessage] = useState("")
  const [hoveredId, setHoveredId] = useState(null)

  function speak(text, lang, onEnd) {
    window.speechSynthesis.cancel()
    setLastMessage({ text, lang })
    const targetLang = lang || "hi-IN"
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = targetLang
    utterance.rate = parseFloat(localStorage.getItem("speed") || "0.85")

    const trySpeak = () => {
      const voices = window.speechSynthesis.getVoices()
      const preferred = voices.find(v =>
        (targetLang === "en-US" && v.name === "Microsoft Zira - English (United States)") ||
        (targetLang === "hi-IN" && v.name === "Google हिन्दी")
      ) || voices.find(v => v.lang === targetLang)
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
      const u1 = new SpeechSynthesisUtterance("1 दबाएं हिंदी के लिए।")
      u1.lang = "hi-IN"
      u1.rate = parseFloat(localStorage.getItem("speed") || "0.85")

      const u2 = new SpeechSynthesisUtterance("For English, press 2.")
      u2.lang = "en-US"
      u2.rate = parseFloat(localStorage.getItem("speed") || "0.85")

      const u3 = new SpeechSynthesisUtterance("मराठीसाठी 3 दाबा.")
      u3.lang = "hi-IN"
      u3.rate = parseFloat(localStorage.getItem("speed") || "0.85")

      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(u1)
      window.speechSynthesis.speak(u2)
      window.speechSynthesis.speak(u3)
    }, 500)
  }, [])

  function selectLanguage(lang) {
    const messages = {
      hindi: { text: "हिंदी चुना! चलिए शुरू करते हैं।", voice: "hi-IN" },
      english: { text: "English selected! Let's get started.", voice: "en-US" },
      marathi: { text: "मराठी निवडली! चला सुरू करूया।", voice: "hi-IN" },
    }
    const msg = messages[lang.id]
    speak(msg.text, msg.voice, () => {
      navigate("/login", { state: { instructionLang: lang.id } })
    })
  }

  useEffect(() => {
    function handleKey(e) {
      const lang = instructionLanguages.find(l => l.key === e.key)
      if (lang) selectLanguage(lang)
      if (e.key.toLowerCase() === "r") {
        if (lastMessage) speak(lastMessage.text, lastMessage.lang)
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [lastMessage])

  return (
    <main aria-label="Instruction Language Selection" style={{
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden",
      background: "linear-gradient(160deg, #0d0d0d 0%, #111827 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", padding: "2rem"
    }}>
      {/* ambient glow blobs */}
      <div style={{
        position: "absolute", top: "-10%", left: "-10%", width: "420px", height: "420px",
        background: "radial-gradient(circle, rgba(244,162,97,0.18) 0%, transparent 70%)",
        filter: "blur(40px)", pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", bottom: "-15%", right: "-10%", width: "480px", height: "480px",
        background: "radial-gradient(circle, rgba(244,162,97,0.10) 0%, transparent 70%)",
        filter: "blur(50px)", pointerEvents: "none"
      }} />

      <div style={{ width: "100%", maxWidth: "700px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ color: SAFFRON, fontSize: "2.2rem", fontWeight: "bold", letterSpacing: "0.02em" }}>दृष्टि</div>
          <h1 style={{ color: "#f5f0e8", fontSize: "2rem", margin: "0.5rem 0 0", fontWeight: 700 }}>Choose Your Language</h1>
          <p style={{ color: SAFFRON, margin: "0.3rem 0 0" }}>अपनी भाषा चुनें / Choose your language</p>
          <p style={{ color: "#a8a8a0", margin: "0.3rem 0 0", fontSize: "0.9rem" }}>दृष्टि में आपका स्वागत है — Welcome to Drishti</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
          {instructionLanguages.map((lang) => {
            const isHovered = hoveredId === lang.id
            return (
              <button
                key={lang.id}
                onClick={() => selectLanguage(lang)}
                onMouseEnter={() => setHoveredId(lang.id)}
                onMouseLeave={() => setHoveredId(null)}
                aria-label={lang.label + " — press " + lang.key}
                style={{
                  padding: "2rem 1rem",
                  borderRadius: "16px",
                  border: "1px solid " + (isHovered ? SAFFRON : "rgba(244,162,97,0.25)"),
                  cursor: "pointer", textAlign: "center",
                  fontFamily: "'Segoe UI', sans-serif",
                  background: isHovered ? SAFFRON_BG_HOVER : SAFFRON_BG,
                  backdropFilter: "blur(10px)",
                  transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                  boxShadow: isHovered ? "0 12px 24px rgba(244,162,97,0.15)" : "none",
                  transition: "all 0.2s ease"
                }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{lang.flag}</div>
                <div style={{ color: SAFFRON, fontWeight: "bold", fontSize: "1.3rem", marginBottom: "0.3rem" }}>{lang.label}</div>
                <div style={{ color: "#a8a8a0", fontSize: "0.85rem", marginBottom: "0.5rem" }}>{lang.desc}</div>
                <div style={{ color: SAFFRON_DIM, fontSize: "0.75rem" }}>(Press {lang.key})</div>
              </button>
            )
          })}
        </div>

        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(244,162,97,0.15)",
          borderRadius: "12px",
          padding: "1rem",
          textAlign: "center",
          backdropFilter: "blur(10px)"
        }}>
          <p style={{ color: "#a8a8a0", fontSize: "0.85rem", margin: "0 0 0.5rem" }}>Keyboard Shortcuts / कीबोर्ड शॉर्टकट</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            {instructionLanguages.map(lang => (
              <div key={lang.key} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <span style={{
                  background: "rgba(244,162,97,0.15)", color: SAFFRON,
                  padding: "0.2rem 0.6rem", borderRadius: "6px", fontWeight: "bold"
                }}>
                  {lang.key}
                </span>
                <span style={{ color: "#a8a8a0", fontSize: "0.85rem" }}>{lang.label}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <span style={{
                background: "rgba(244,162,97,0.15)", color: SAFFRON,
                padding: "0.2rem 0.6rem", borderRadius: "6px", fontWeight: "bold"
              }}>
                R
              </span>
              <span style={{ color: "#a8a8a0", fontSize: "0.85rem" }}>Repeat / दोबारा</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default InstructionLanguagePage