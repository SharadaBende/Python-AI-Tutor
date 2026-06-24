import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useTheme } from "../components/useTheme"

const translations = {
  hindi: {
    title: "नया Account बनाएं",
    nameLabel: "आपका नाम",
    emailLabel: "Email",
    passwordLabel: "Password",
    registerBtn: "Account बनाएं",
    loginLink: "पहले से account है? लॉगिन करें",
    welcome: "नया account बनाने के लिए, अपना नाम टाइप करें, Tab दबाएं, Email टाइप करें, Tab दबाएं, Password टाइप करें, फिर Enter दबाएं।",
    errorDuplicate: "यह Email पहले से registered है। लॉगिन करें।",
    errorServer: "Server error। बाद में कोशिश करें।",
    success: "Account बन गया! स्वागत है ",
  },
  english: {
    title: "Create New Account",
    nameLabel: "Your Name",
    emailLabel: "Email",
    passwordLabel: "Password",
    registerBtn: "Create Account",
    loginLink: "Already have an account? Login",
    welcome: "To create a new account, type your name, press Tab, type your email, press Tab, type your password, then press Enter.",
    errorDuplicate: "This email is already registered. Please login.",
    errorServer: "Server error. Please try again later.",
    success: "Account created! Welcome ",
  },
  marathi: {
    title: "नवीन Account तयार करा",
    nameLabel: "तुमचे नाव",
    emailLabel: "Email",
    passwordLabel: "Password",
    registerBtn: "Account तयार करा",
    loginLink: "आधीच account आहे? लॉगिन करा",
    welcome: "नवीन account तयार करण्यासाठी, तुमचे नाव टाइप करा, Tab दाबा, Email टाइप करा, Tab दाबा, Password टाइप करा, मग Enter दाबा।",
    errorDuplicate: "ही Email आधीच registered आहे। लॉगिन करा।",
    errorServer: "Server error। नंतर प्रयत्न करा।",
    success: "Account तयार झाले! स्वागत आहे ",
  },
}

const voiceLang = { hindi: "hi-IN", english: "en-US", marathi: "hi-IN" }

function RegisterPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const instructionLang = location.state?.instructionLang || "english"
  const t = translations[instructionLang]
  const lang = voiceLang[instructionLang]
  const { bg, cardBg, cardBorder, mutedColor } = useTheme()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function speak(text, onEnd) {
    window.speechSynthesis.cancel()
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

  useEffect(() => {
    setTimeout(() => speak(t.welcome), 500)
  }, [])

  async function handleRegister() {
    if (!name || !email || !password) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (data.success) {
        speak(t.success + data.name, () => {
          navigate("/intro", { state: { name: data.name, user_id: data.user_id, instructionLang } })
        })
      } else {
        const msg = t.errorDuplicate
        setError(msg)
        speak(msg)
      }
    } catch {
      setError(t.errorServer)
      speak(t.errorServer)
    }
    setLoading(false)
  }

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Enter") handleRegister()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [name, email, password])

  return (
    <main aria-label="Register" style={{
      minHeight: "100vh", background: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", padding: "2rem"
    }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "3rem" }}>👁️</div>
          <h1 style={{ color: "#a0a0ff", fontSize: "2rem", margin: "0.5rem 0 0" }}>{t.title}</h1>
          <p style={{ color: mutedColor, fontSize: "0.9rem", margin: "0.3rem 0 0" }}>दृष्टि — जहाँ code बोलता है</p>
        </div>

        <div style={{ background: cardBg, border: "1px solid " + cardBorder, borderRadius: "16px", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <div>
            <label style={{ color: "#a0a0ff", fontSize: "0.9rem", display: "block", marginBottom: "0.4rem" }}>{t.nameLabel}</label>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              aria-label={t.nameLabel}
              style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid #a0a0ff", background: "#1a1a3e", color: "#fff", fontSize: "1rem", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ color: "#a0a0ff", fontSize: "0.9rem", display: "block", marginBottom: "0.4rem" }}>{t.emailLabel}</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              aria-label={t.emailLabel}
              style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid #a0a0ff", background: "#1a1a3e", color: "#fff", fontSize: "1rem", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ color: "#a0a0ff", fontSize: "0.9rem", display: "block", marginBottom: "0.4rem" }}>{t.passwordLabel}</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              aria-label={t.passwordLabel}
              style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid #a0a0ff", background: "#1a1a3e", color: "#fff", fontSize: "1rem", boxSizing: "border-box" }}
            />
          </div>

          {error && <p style={{ color: "#ff6b6b", fontSize: "0.9rem", margin: 0 }}>{error}</p>}

          <button onClick={handleRegister} disabled={loading}
            style={{ padding: "0.9rem", borderRadius: "10px", border: "none", background: "#a0a0ff", color: "#0a0a2e", fontWeight: "bold", fontSize: "1rem", cursor: "pointer" }}>
            {loading ? "..." : t.registerBtn}
          </button>

          <button onClick={() => navigate("/login", { state: { instructionLang } })}
            style={{ padding: "0.7rem", borderRadius: "10px", border: "1px solid #a0a0ff", background: "transparent", color: "#a0a0ff", fontSize: "0.9rem", cursor: "pointer" }}>
            {t.loginLink}
          </button>
        </div>
      </div>
    </main>
  )
}

export default RegisterPage



















































