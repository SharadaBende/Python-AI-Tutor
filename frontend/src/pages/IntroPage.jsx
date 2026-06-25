
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

// Dark + saffron brand palette — matches Login/Register/InstructionLanguagePage
const ACCENT = "#f4a261"
const ACCENT_SOFT = "rgba(244, 162, 97, 0.15)"
const CREAM = "#f1ede4"
const CREAM_MUTED = "rgba(241, 237, 228, 0.6)"

function IntroPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const name = location.state?.name || "Friend"
  const user_id = location.state?.user_id
  const instructionLang = location.state?.instructionLang || "english"
  const t = translations[instructionLang]
  const lang = voiceLang[instructionLang]
  const [lastMessage, setLastMessage] = useState("")
  const { bg } = useTheme()

  function speak(text, onEnd) {
    window.speechSynthesis.cancel()
    setLastMessage(text)
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
      if (onEnd) utterance.onend = onEnd
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
    <main aria-label="Drishti Intro" style={{
      minHeight: "100vh",
      background: bg || "radial-gradient(circle at 20% 20%, #1a1410 0%, #0d0d0d 60%)",
      position: "relative", overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", padding: "1rem"
    }}>
      {/* subtle saffron glow blobs, matches Login/Register/InstructionLanguagePage */}
      <div style={{
        position: "absolute", top: "-130px", left: "10%", width: "340px", height: "340px",
        borderRadius: "50%", background: ACCENT, opacity: 0.08, filter: "blur(95px)"
      }} />
      <div style={{
        position: "absolute", bottom: "-150px", right: "5%", width: "360px", height: "360px",
        borderRadius: "50%", background: ACCENT, opacity: 0.06, filter: "blur(100px)"
      }} />

      <div style={{ width: "100%", maxWidth: "600px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ color: CREAM, fontSize: "2.5rem", margin: "0", fontWeight: 600 }}>दृष्टि</h1>
          <p style={{ color: ACCENT, fontSize: "1rem", margin: "0.3rem 0 0", letterSpacing: "2px" }}>DRISHTI</p>
          <p style={{ color: CREAM_MUTED, margin: "0.4rem 0 0" }}>जहाँ code बोलता है</p>
          <p style={{ color: CREAM_MUTED, margin: "0.2rem 0 0", fontSize: "0.85rem" }}>{t.subtitle}</p>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${ACCENT_SOFT}`,
          backdropFilter: "blur(12px)",
          padding: "2rem", borderRadius: "16px", textAlign: "center", marginBottom: "1.5rem"
        }}>
          <p style={{ fontSize: "1.3rem", color: CREAM, margin: "0 0 0.5rem" }}>
            नमस्ते <strong style={{ color: ACCENT }}>{name}</strong>!
          </p>
          <p style={{ color: CREAM_MUTED, margin: 0 }}>{t.question}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <button onClick={() => speak(lastMessage)} aria-label="R — Repeat"
            style={{
              padding: "1rem", borderRadius: "12px", border: `1px solid ${ACCENT_SOFT}`,
              background: "transparent", color: CREAM_MUTED, cursor: "pointer",
              fontWeight: 600, fontSize: "1rem"
            }}>
            {t.repeat}<br /><span style={{ fontSize: "0.8rem", color: ACCENT }}>(R)</span>
          </button>
          <button onClick={goToLanguage} aria-label="H — Yes start"
            style={{
              padding: "1rem", borderRadius: "12px", border: "none",
              background: ACCENT, color: "#1a1410", cursor: "pointer",
              fontWeight: 700, fontSize: "1rem"
            }}>
            {t.yes}<br /><span style={{ fontSize: "0.8rem" }}>(H)</span>
          </button>
        </div>
      </div>
    </main>
  )
}

export default IntroPage





