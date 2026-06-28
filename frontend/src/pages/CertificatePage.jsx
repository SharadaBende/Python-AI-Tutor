import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useTheme } from "../components/useTheme"

// Certificate keeps gold — it's a reward artifact, gold is intentional
const GOLD        = "#ffd700"
const GOLD_SHADOW = "#b8960a"

// Action UI uses the design system tokens
const ACCENT        = "#1cb0f6"
const ACCENT_SOFT   = "rgba(28,176,246,0.10)"
const ACCENT_BORDER = "rgba(28,176,246,0.28)"
const ACCENT_SHADOW = "#0a8fd4"

const SUCCESS        = "#58cc02"
const SUCCESS_SHADOW = "#46a302"

// Certificate border/accent — saffron preserved ONLY inside the certificate frame
const CERT_ACCENT     = "#f4a261"
const CERT_ACCENT_DIM = "rgba(244,162,97,0.25)"

function CertificatePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const name           = location.state?.name           || "दोस्त"
  const score          = location.state?.score          || 0
  const language       = location.state?.language       || "python"
  const instructionLang = location.state?.instructionLang || "hindi"
  const { theme, cardBg, cardBorder, textColor, mutedColor } = useTheme()
  const [lastMessage, setLastMessage] = useState("")

  const totalQuestions = 40
  const totalLessons = language === "python" || language === "java" || language === "cpp" ? 15 : 10
  const percentage     = Math.round((score / totalQuestions) * 100)

  const languageLabel = language === "sql"
    ? "SQL Database"
    : language === "javascript"
    ? "JavaScript"
    : "Python Programming"

  const languageEmoji = language === "sql" ? "🗄️"
    : language === "javascript" ? "🌐" : "🐍"

  const gradeInfo = percentage >= 90
    ? { grade: "A+", label: "Outstanding",     color: GOLD }
    : percentage >= 75
    ? { grade: "A",  label: "Excellent",       color: CERT_ACCENT }
    : percentage >= 60
    ? { grade: "B",  label: "Good",            color: "#58cc02" }
    : percentage >= 40
    ? { grade: "C",  label: "Average",         color: CERT_ACCENT }
    : { grade: "D",  label: "Keep Practicing", color: "#ff4b4b" }

  const date   = new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
  const certId = "DRISHTI-" + language.toUpperCase() + "-" + Date.now().toString().slice(-6)

  const voiceLangMap = { hindi: "hi-IN", english: "en-US", marathi: "hi-IN" }
  const voiceLang    = voiceLangMap[instructionLang]

  function speak(text, onEnd) {
    window.speechSynthesis.cancel()
    setLastMessage(text)
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = voiceLang
    utterance.rate = parseFloat(localStorage.getItem("speed") || "0.85")
    const trySpeak = () => {
      const voices = window.speechSynthesis.getVoices()
      let preferred = null
      if (voiceLang === "en-US") preferred = voices.find(v => v.name === "Microsoft Zira - English (United States)")
      else if (voiceLang === "hi-IN") preferred = voices.find(v => v.name === "Google हिन्दी")
      if (!preferred) preferred = voices.find(v => v.lang === voiceLang)
      if (preferred) utterance.voice = preferred
      if (onEnd) utterance.onend = onEnd
      window.speechSynthesis.speak(utterance)
    }
    if (window.speechSynthesis.getVoices().length === 0) window.speechSynthesis.onvoiceschanged = trySpeak
    else trySpeak()
  }

  useEffect(() => {
    setTimeout(() => {
      if (instructionLang === "english") {
        speak(
          "Congratulations " + name + "! " +
          "You have successfully completed the " + languageLabel + " course on Drishti! " +
          "You scored " + score + " out of " + totalQuestions + " in the MCQ test. " +
          "Your grade is " + gradeInfo.grade + " which means " + gradeInfo.label + ". " +
          "Press S to save your certificate. Press R to hear this again. Press H to go home."
        )
      } else if (instructionLang === "marathi") {
        speak(
          "खूप खूप अभिनंदन " + name + "! " +
          "तुम्ही दृष्टी वर " + languageLabel + " course यशस्वीरीत्या पूर्ण केला! " +
          "तुम्ही " + totalQuestions + " पैकी " + score + " बरोबर उत्तरे दिली. " +
          "तुमचा grade " + gradeInfo.grade + " आहे. " +
          "S दाबा certificate save करण्यासाठी. R दाबा दुबारा ऐकण्यासाठी."
        )
      } else {
        speak(
          "बहुत बहुत बधाई हो " + name + "! " +
          "आपने दृष्टि पर " + languageLabel + " का पूरा course सफलतापूर्वक पूरा कर लिया! " +
          "आपने " + totalQuestions + " में से " + score + " सही जवाब दिए। " +
          "आपका grade है " + gradeInfo.grade + " यानी " + gradeInfo.label + "। " +
          "S दबाएं certificate save करने के लिए। R दबाएं दोबारा सुनने के लिए।"
        )
      }
    }, 1000)
  }, [])

  useEffect(() => {
    function handleKey(e) {
      const key = e.key.toLowerCase()
      if (key === "s") window.print()
      if (key === "r") speak(lastMessage)
      if (key === "h") navigate("/")
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [lastMessage])

  const statCard = {
    background: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
    border: `1px solid ${CERT_ACCENT_DIM}`,
    borderRadius: "12px",
    padding: "1rem 0.5rem",
    textAlign: "center",
  }

  return (
    <>
      <style>{`
        .cert-repeat-btn {
          padding: 1rem; font-size: 1rem; border-radius: 12px; font-weight: 700;
          background: ${ACCENT_SOFT}; color: ${ACCENT};
          border: 1px solid ${ACCENT_BORDER};
          box-shadow: 0 4px 0 0 ${ACCENT_SHADOW};
          cursor: pointer;
          transition: box-shadow 0.1s, transform 0.1s;
        }
        .cert-repeat-btn:active {
          box-shadow: 0 0px 0 0 transparent;
          transform: translateY(4px);
        }

        .cert-save-btn {
          padding: 1rem; font-size: 1rem; border-radius: 12px; font-weight: 700;
          background: ${SUCCESS}; color: #fff; border: none;
          box-shadow: 0 4px 0 0 ${SUCCESS_SHADOW};
          cursor: pointer;
          transition: box-shadow 0.1s, transform 0.1s;
        }
        .cert-save-btn:active {
          box-shadow: 0 0px 0 0 transparent;
          transform: translateY(4px);
        }

        .cert-home-btn {
          padding: 1rem; font-size: 1rem; border-radius: 12px; font-weight: 700;
          background: ${GOLD}; color: #000; border: none;
          box-shadow: 0 4px 0 0 ${GOLD_SHADOW};
          cursor: pointer;
          transition: box-shadow 0.1s, transform 0.1s;
        }
        .cert-home-btn:active {
          box-shadow: 0 0px 0 0 transparent;
          transform: translateY(4px);
        }

        @media print {
          .cert-no-print { display: none !important; }
          main { background: white !important; }
        }
      `}</style>

      <main style={{
        minHeight: "100vh",
        background: theme === "dark"
          ? "linear-gradient(135deg, #0d0d0d 0%, #111218 50%, #0d0d0d 100%)"
          : "linear-gradient(135deg, #fdf6ee 0%, #fff8f0 50%, #fdf6ee 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Georgia', serif", padding: "2rem",
      }}>
        <div style={{ width: "100%", maxWidth: "780px" }}>

          {/* ── CERTIFICATE (gold/saffron preserved — reward artifact) ── */}
          <div id="certificate" style={{
            background: theme === "dark"
              ? "linear-gradient(160deg, #111218 0%, #1a1812 100%)"
              : "linear-gradient(160deg, #fffef8 0%, #fff9f3 100%)",
            borderRadius: "4px",
            padding: "0",
            marginBottom: "2rem",
            position: "relative",
            overflow: "hidden",
            boxShadow: theme === "dark"
              ? `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px ${CERT_ACCENT_DIM}`
              : `0 20px 60px rgba(80,40,0,0.12), 0 0 0 1px ${CERT_ACCENT_DIM}`,
          }}>

            {/* Gold-saffron outer border */}
            <div style={{
              position: "absolute", inset: "0",
              border: "8px solid transparent",
              borderImage: `linear-gradient(135deg, ${GOLD}, ${CERT_ACCENT}, ${GOLD}, ${CERT_ACCENT}, ${GOLD}) 1`,
              borderRadius: "4px",
              pointerEvents: "none", zIndex: 2,
            }} />

            {/* Inner border */}
            <div style={{
              position: "absolute", inset: "16px",
              border: `1px solid ${CERT_ACCENT_DIM}`,
              borderRadius: "2px",
              pointerEvents: "none", zIndex: 2,
            }} />

            {/* Corner ornaments */}
            {["top:20px;left:20px","top:20px;right:20px","bottom:20px;left:20px","bottom:20px;right:20px"].map((pos, i) => (
              <div key={i} style={{
                position: "absolute",
                ...Object.fromEntries(pos.split(";").map(p => p.split(":"))),
                color: GOLD, fontSize: "1.2rem", zIndex: 3, opacity: 0.8,
              }}>✦</div>
            ))}

            {/* Watermark */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12rem", opacity: 0.03, zIndex: 1,
              userSelect: "none", pointerEvents: "none",
            }}>{languageEmoji}</div>

            {/* Content */}
            <div style={{ position: "relative", zIndex: 4, padding: "3.5rem" }}>

              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <div style={{
                  display: "inline-block",
                  background: `linear-gradient(135deg, ${GOLD}, #ffaa00)`,
                  borderRadius: "50px", padding: "0.4rem 1.5rem", marginBottom: "1rem",
                }}>
                  <span style={{
                    color: "#000", fontSize: "0.7rem", fontWeight: "bold",
                    letterSpacing: "3px", textTransform: "uppercase",
                    fontFamily: "'Segoe UI', sans-serif",
                  }}>
                    दृष्टि — Drishti Learning Platform
                  </span>
                </div>

                <h1 style={{
                  color: theme === "dark" ? "#f1ede4" : "#1a1008",
                  fontSize: "2rem", margin: "0 0 0.3rem",
                  fontFamily: "'Georgia', serif",
                  letterSpacing: "2px", textTransform: "uppercase",
                }}>
                  Certificate of Completion
                </h1>

                <div style={{
                  width: "120px", height: "2px",
                  background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
                  margin: "0.5rem auto",
                }} />

                <p style={{
                  color: mutedColor, fontSize: "0.85rem",
                  fontFamily: "'Segoe UI', sans-serif",
                  letterSpacing: "1px", margin: 0,
                }}>
                  This is to proudly certify that
                </p>
              </div>

              {/* Name */}
              <div style={{
                textAlign: "center", padding: "1.5rem",
                margin: "0 2rem 2rem",
                borderTop: "1px solid rgba(255,215,0,0.3)",
                borderBottom: "1px solid rgba(255,215,0,0.3)",
              }}>
                <h2 style={{
                  color: GOLD, fontSize: "2.8rem", margin: "0 0 0.5rem",
                  fontFamily: "'Georgia', serif",
                  textShadow: theme === "dark" ? "0 0 30px rgba(255,215,0,0.4)" : "none",
                  letterSpacing: "1px",
                }}>
                  {name}
                </h2>
                <p style={{
                  color: textColor, fontSize: "1rem", margin: 0,
                  fontFamily: "'Segoe UI', sans-serif", lineHeight: "1.6",
                }}>
                  has successfully completed the
                  <strong style={{ color: CERT_ACCENT }}> {languageEmoji} {languageLabel} </strong>
                  course on Drishti,<br />
                  demonstrating dedication and commitment to learning programming.
                </p>
              </div>

              {/* Stats */}
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: "1rem", margin: "0 1rem 2rem",
              }}>
                {[
                  { icon: "📚", value: totalLessons + " Lessons", label: "Completed",   color: CERT_ACCENT },
                  { icon: "🧠", value: score + "/" + totalQuestions, label: "MCQ Score", color: CERT_ACCENT },
                  { icon: "📊", value: percentage + "%",           label: "Accuracy",   color: CERT_ACCENT },
                  { icon: "🏅", value: gradeInfo.grade,            label: gradeInfo.label, color: gradeInfo.color },
                ].map((item, i) => (
                  <div key={i} style={statCard}>
                    <div style={{ fontSize: "1.4rem", marginBottom: "0.3rem" }}>{item.icon}</div>
                    <div style={{ color: item.color, fontWeight: "bold", fontSize: "1.1rem", fontFamily: "'Segoe UI', sans-serif" }}>
                      {item.value}
                    </div>
                    <div style={{ color: mutedColor, fontSize: "0.75rem", fontFamily: "'Segoe UI', sans-serif" }}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                gap: "1rem", margin: "0 2rem",
                paddingTop: "1.5rem",
                borderTop: `1px solid ${CERT_ACCENT_DIM}`,
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: "80px", height: "1px", background: CERT_ACCENT_DIM, margin: "0 auto 0.3rem" }} />
                  <p style={{ color: CERT_ACCENT, fontSize: "0.85rem", margin: 0, fontWeight: "bold", fontFamily: "'Segoe UI', sans-serif" }}>
                    Pyra
                  </p>
                  <p style={{ color: mutedColor, fontSize: "0.7rem", margin: 0, fontFamily: "'Segoe UI', sans-serif" }}>
                    AI Tutor, Drishti
                  </p>
                </div>

                <div style={{ textAlign: "center" }}>
                  <div style={{
                    width: "70px", height: "70px", borderRadius: "50%",
                    background: `linear-gradient(135deg, ${GOLD}, #ffaa00)`,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    margin: "0 auto",
                    boxShadow: "0 4px 15px rgba(255,215,0,0.4)",
                  }}>
                    <span style={{ fontSize: "1.4rem" }}>🏆</span>
                    <span style={{ fontSize: "0.5rem", color: "#000", fontWeight: "bold", letterSpacing: "1px" }}>CERTIFIED</span>
                  </div>
                </div>

                <div style={{ textAlign: "center" }}>
                  <div style={{ width: "80px", height: "1px", background: CERT_ACCENT_DIM, margin: "0 auto 0.3rem" }} />
                  <p style={{ color: textColor, fontSize: "0.85rem", margin: 0, fontFamily: "'Segoe UI', sans-serif" }}>
                    {date}
                  </p>
                  <p style={{ color: mutedColor, fontSize: "0.65rem", margin: "0.2rem 0 0", fontFamily: "'Segoe UI', sans-serif" }}>
                    {certId}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* ── ACTION BUTTONS — 3D press ── */}
          <div className="cert-no-print" style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
            gap: "1rem", marginBottom: "1.5rem",
            fontFamily: "'Segoe UI', sans-serif",
          }}>
            <button className="cert-repeat-btn" onClick={() => speak(lastMessage)} aria-label="R — दोबारा सुनें">
              🔁 दोबारा सुनें<br /><span style={{ fontSize: "0.75rem", opacity: 0.75 }}>(R)</span>
            </button>
            <button className="cert-save-btn" onClick={() => window.print()} aria-label="S — Certificate Save करें">
              💾 Save / Print<br /><span style={{ fontSize: "0.75rem", opacity: 0.75 }}>(S)</span>
            </button>
            <button className="cert-home-btn" onClick={() => navigate("/")} aria-label="H — Home पर जाएं">
              🏠 Home<br /><span style={{ fontSize: "0.75rem", opacity: 0.75 }}>(H)</span>
            </button>
          </div>

          {/* ── KEYBOARD SHORTCUTS ── */}
          <div className="cert-no-print" style={{
            background: cardBg,
            border: `1px solid ${cardBorder}`,
            boxShadow: `0 2px 0 0 ${cardBorder}`,
            borderRadius: "12px", padding: "1rem",
            textAlign: "center", fontFamily: "'Segoe UI', sans-serif",
          }}>
            <p style={{ color: mutedColor, fontSize: "0.8rem", margin: "0 0 0.6rem", fontWeight: 500 }}>
              Keyboard Shortcuts
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "1.25rem", flexWrap: "wrap" }}>
              {[["R", "दोबारा सुनें"], ["S", "Save / Print"], ["H", "Home"]].map(([key, desc]) => (
                <div key={key} style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                  <span style={{
                    background: ACCENT_SOFT,
                    color: ACCENT,
                    border: `1px solid ${ACCENT_BORDER}`,
                    padding: "0.2rem 0.55rem",
                    borderRadius: "6px",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                  }}>{key}</span>
                  <span style={{ color: mutedColor, fontSize: "0.82rem" }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </>
  )
}

export default CertificatePage