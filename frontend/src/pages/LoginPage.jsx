import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useTheme } from "../components/useTheme"

const translations = {
  hindi: {
    title: "लॉगिन करें",
    emailLabel: "Email",
    passwordLabel: "Password",
    loginBtn: "लॉगिन",
    registerLink: "नया account बनाएं",
    welcome: "लॉगिन पेज पर आपका स्वागत है। Email टाइप करें, Tab दबाएं, Password टाइप करें, फिर Enter दबाएं।",
    errorNotFound: "Email नहीं मिली। कृपया register करें।",
    errorWrong: "Password गलत है। फिर कोशिश करें।",
    errorServer: "Server error। बाद में कोशिश करें।",
    success: "लॉगिन सफल! स्वागत है ",
  },
  english: {
    title: "Login",
    emailLabel: "Email",
    passwordLabel: "Password",
    loginBtn: "Login",
    registerLink: "Create a new account",
    welcome: "Welcome to the login page. Type your email, press Tab, type your password, then press Enter.",
    errorNotFound: "Email not found. Please register.",
    errorWrong: "Wrong password. Please try again.",
    errorServer: "Server error. Please try again later.",
    success: "Login successful! Welcome ",
  },
  marathi: {
    title: "लॉगिन करा",
    emailLabel: "Email",
    passwordLabel: "Password",
    loginBtn: "लॉगिन",
    registerLink: "नवीन account तयार करा",
    welcome: "लॉगिन पेजवर आपले स्वागत आहे। Email टाइप करा, Tab दाबा, Password टाइप करा, मग Enter दाबा।",
    errorNotFound: "Email सापडली नाही। कृपया register करा।",
    errorWrong: "Password चुकीचा आहे। पुन्हा प्रयत्न करा।",
    errorServer: "Server error। नंतर प्रयत्न करा।",
    success: "लॉगिन यशस्वी! स्वागत आहे ",
  },
}

const voiceLang = { hindi: "hi-IN", english: "en-US", marathi: "hi-IN" }

// New brand palette — dark + saffron (replaces old purple theme)
const ACCENT = "#f4a261"
const ACCENT_SOFT = "rgba(244, 162, 97, 0.15)"
const CREAM = "#f1ede4"
const CREAM_MUTED = "rgba(241, 237, 228, 0.6)"
const ERROR = "#e76f51"

function LoginPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const instructionLang = location.state?.instructionLang || "english"
  const t = translations[instructionLang]
  const lang = voiceLang[instructionLang]
  const { bg } = useTheme()

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

  async function handleLogin() {
    if (!email || !password) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (data.success) {
        speak(t.success + data.name, () => {
          navigate("/intro", { state: { name: data.name, user_id: data.user_id, instructionLang } })
        })
      } else {
        const msg = data.error?.includes("not found") ? t.errorNotFound : t.errorWrong
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
      if (e.key === "Enter") handleLogin()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [email, password])

  return (
    <main aria-label="Login" style={{
      minHeight: "100vh",
      background: bg || "radial-gradient(circle at 20% 20%, #1a1410 0%, #0d0d0d 60%)",
      position: "relative", overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", padding: "2rem"
    }}>
      {/* subtle saffron glow blobs, matches InstructionLanguagePage */}
      <div style={{
        position: "absolute", top: "-120px", left: "-80px", width: "320px", height: "320px",
        borderRadius: "50%", background: ACCENT, opacity: 0.08, filter: "blur(90px)"
      }} />
      <div style={{
        position: "absolute", bottom: "-140px", right: "-100px", width: "360px", height: "360px",
        borderRadius: "50%", background: ACCENT, opacity: 0.06, filter: "blur(100px)"
      }} />

      <div style={{ width: "100%", maxWidth: "480px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "1.6rem", color: CREAM_MUTED, letterSpacing: "0.05em" }}>दृष्टि</div>
          <h1 style={{ color: CREAM, fontSize: "2rem", margin: "0.4rem 0 0", fontWeight: 600 }}>{t.title}</h1>
          <p style={{ color: ACCENT, fontSize: "0.85rem", margin: "0.4rem 0 0", letterSpacing: "0.02em" }}>
            जहाँ code बोलता है
          </p>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${ACCENT_SOFT}`,
          borderRadius: "16px",
          padding: "2rem",
          backdropFilter: "blur(12px)",
          display: "flex", flexDirection: "column", gap: "1.2rem"
        }}>
          <div>
            <label style={{ color: ACCENT, fontSize: "0.85rem", display: "block", marginBottom: "0.4rem", fontWeight: 500 }}>
              {t.emailLabel}
            </label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              aria-label={t.emailLabel}
              style={{
                width: "100%", padding: "0.8rem", borderRadius: "8px",
                border: `1px solid ${ACCENT_SOFT}`, background: "rgba(255,255,255,0.04)",
                color: CREAM, fontSize: "1rem", boxSizing: "border-box", outline: "none"
              }}
            />
          </div>
          <div>
            <label style={{ color: ACCENT, fontSize: "0.85rem", display: "block", marginBottom: "0.4rem", fontWeight: 500 }}>
              {t.passwordLabel}
            </label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              aria-label={t.passwordLabel}
              style={{
                width: "100%", padding: "0.8rem", borderRadius: "8px",
                border: `1px solid ${ACCENT_SOFT}`, background: "rgba(255,255,255,0.04)",
                color: CREAM, fontSize: "1rem", boxSizing: "border-box", outline: "none"
              }}
            />
          </div>

          {error && <p style={{ color: ERROR, fontSize: "0.9rem", margin: 0 }}>{error}</p>}

          <button onClick={handleLogin} disabled={loading}
            style={{
              padding: "0.9rem", borderRadius: "10px", border: "none",
              background: ACCENT, color: "#1a1410", fontWeight: 700, fontSize: "1rem",
              cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1
            }}>
            {loading ? "..." : t.loginBtn}
          </button>

          <button onClick={() => navigate("/register", { state: { instructionLang } })}
            style={{
              padding: "0.7rem", borderRadius: "10px", border: `1px solid ${ACCENT_SOFT}`,
              background: "transparent", color: CREAM_MUTED, fontSize: "0.9rem", cursor: "pointer"
            }}>
            {t.registerLink}
          </button>
        </div>
      </div>
    </main>
  )
}

export default LoginPage


