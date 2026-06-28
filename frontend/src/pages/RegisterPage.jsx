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

// Design tokens — identical to LoginPage
const ACCENT        = "#1cb0f6"
const ACCENT_SOFT   = "rgba(28,176,246,0.12)"
const ACCENT_BORDER = "rgba(28,176,246,0.28)"
const ACCENT_SHADOW = "#0a8fd4"
const DANGER        = "#ff4b4b"
const CREAM         = "#f1f5f9"
const CREAM_MUTED   = "rgba(241,245,249,0.55)"

function PyraMini() {
  return (
    <svg width="48" height="48" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <style>{`
        @keyframes antBob2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
        @keyframes blinkEye2 { 0%,88%,100%{transform:scaleY(1)} 94%{transform:scaleY(0.1)} }
        .ant2 { animation: antBob2 2s ease-in-out infinite; transform-origin: 28px 10px; }
        .eye2 { animation: blinkEye2 3.5s ease-in-out infinite; transform-origin: center; }
      `}</style>
      <g className="ant2">
        <line x1="28" y1="10" x2="28" y2="4" stroke={ACCENT} strokeWidth="2" strokeLinecap="round"/>
        <circle cx="28" cy="3" r="2.5" fill={ACCENT}/>
      </g>
      <rect x="10" y="12" width="36" height="30" rx="8" fill={ACCENT}/>
      <rect x="14" y="16" width="28" height="20" rx="5" fill="#0a8fd4"/>
      <ellipse className="eye2" cx="21" cy="24" rx="3.5" ry="3.5" fill="white"/>
      <ellipse className="eye2" cx="35" cy="24" rx="3.5" ry="3.5" fill="white"/>
      <circle cx="21" cy="24" r="1.5" fill="#003d6b"/>
      <circle cx="35" cy="24" r="1.5" fill="#003d6b"/>
      <path d="M19 31 Q28 35 37 31" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <rect x="6" y="20" width="4" height="8" rx="2" fill="#0a8fd4"/>
      <rect x="46" y="20" width="4" height="8" rx="2" fill="#0a8fd4"/>
      <rect x="17" y="42" width="8" height="6" rx="3" fill="#0a8fd4"/>
      <rect x="31" y="42" width="8" height="6" rx="3" fill="#0a8fd4"/>
    </svg>
  )
}

function RegisterPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const instructionLang = location.state?.instructionLang || "english"
  const t = translations[instructionLang]
  const lang = voiceLang[instructionLang]
  const { bg } = useTheme()

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
    <>
      <style>{`
        .reg-submit-btn {
          padding: 0.9rem; border-radius: 12px; border: none;
          background: ${ACCENT}; color: #fff; font-weight: 700; font-size: 1rem;
          cursor: pointer;
          box-shadow: 0 4px 0 0 ${ACCENT_SHADOW};
          transition: box-shadow 0.1s, transform 0.1s, opacity 0.1s;
        }
        .reg-submit-btn:active:not(:disabled) {
          box-shadow: 0 0px 0 0 transparent;
          transform: translateY(4px);
        }
        .reg-submit-btn:disabled { opacity: 0.65; cursor: default; }

        .reg-login-btn {
          padding: 0.75rem; border-radius: 12px;
          border: 1px solid ${ACCENT_BORDER};
          background: transparent; color: ${CREAM_MUTED};
          font-size: 0.9rem; cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .reg-login-btn:hover { background: ${ACCENT_SOFT}; color: ${CREAM}; }

        .reg-input {
          width: 100%; padding: 0.8rem; border-radius: 8px;
          border: 1px solid ${ACCENT_BORDER};
          background: rgba(28,176,246,0.06);
          color: ${CREAM}; font-size: 1rem;
          box-sizing: border-box; outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .reg-input:focus {
          border-color: ${ACCENT};
          box-shadow: 0 0 0 3px rgba(28,176,246,0.18);
        }
      `}</style>

      <main aria-label="Register" style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at 80% 20%, #0d1b2a 0%, #0a0a0a 70%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', sans-serif",
        padding: "2rem",
      }}>

        {/* Glow blobs — blue, mirrored positions vs LoginPage */}
        <div style={{
          position: "absolute", top: "-120px", right: "-80px",
          width: "320px", height: "320px", borderRadius: "50%",
          background: ACCENT, opacity: 0.07, filter: "blur(90px)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-140px", left: "-100px",
          width: "360px", height: "360px", borderRadius: "50%",
          background: ACCENT, opacity: 0.05, filter: "blur(100px)",
          pointerEvents: "none",
        }} />

        <div style={{ width: "100%", maxWidth: "460px", position: "relative", zIndex: 1 }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem" }}>
              <PyraMini />
            </div>
            <div style={{ fontSize: "1.5rem", color: CREAM_MUTED, letterSpacing: "0.05em", fontWeight: 300 }}>
              दृष्टि
            </div>
            <h1 style={{ color: CREAM, fontSize: "1.9rem", margin: "0.3rem 0 0", fontWeight: 700 }}>
              {t.title}
            </h1>
            <p style={{ color: ACCENT, fontSize: "0.82rem", margin: "0.35rem 0 0", letterSpacing: "0.02em" }}>
              जहाँ code बोलता है
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${ACCENT_BORDER}`,
            borderRadius: "16px",
            padding: "2rem",
            backdropFilter: "blur(12px)",
            display: "flex",
            flexDirection: "column",
            gap: "1.2rem",
          }}>

            {/* Name */}
            <div>
              <label style={{ color: ACCENT, fontSize: "0.82rem", display: "block", marginBottom: "0.4rem", fontWeight: 600 }}>
                {t.nameLabel}
              </label>
              <input
                className="reg-input"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                aria-label={t.nameLabel}
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div>
              <label style={{ color: ACCENT, fontSize: "0.82rem", display: "block", marginBottom: "0.4rem", fontWeight: 600 }}>
                {t.emailLabel}
              </label>
              <input
                className="reg-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                aria-label={t.emailLabel}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ color: ACCENT, fontSize: "0.82rem", display: "block", marginBottom: "0.4rem", fontWeight: 600 }}>
                {t.passwordLabel}
              </label>
              <input
                className="reg-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                aria-label={t.passwordLabel}
                autoComplete="new-password"
              />
            </div>

            {/* Error */}
            {error && (
              <p role="alert" style={{
                color: DANGER,
                fontSize: "0.88rem",
                margin: 0,
                padding: "0.5rem 0.75rem",
                background: "rgba(255,75,75,0.1)",
                border: "1px solid rgba(255,75,75,0.25)",
                borderRadius: "8px",
              }}>
                {error}
              </p>
            )}

            {/* Register button — 3D press */}
            <button className="reg-submit-btn" onClick={handleRegister} disabled={loading}>
              {loading ? "..." : t.registerBtn}
            </button>

            {/* Login link */}
            <button className="reg-login-btn" onClick={() => navigate("/login", { state: { instructionLang } })}>
              {t.loginLink}
            </button>

          </div>
        </div>
      </main>
    </>
  )
}

export default RegisterPage