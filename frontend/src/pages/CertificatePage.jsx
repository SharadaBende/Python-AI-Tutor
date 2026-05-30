import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { speak as speakUtil } from "../components/speak"
import { useTheme } from "../components/useTheme"

function CertificatePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const name = location.state?.name || "दोस्त"
  const score = location.state?.score || 0
  const { theme, bg, cardBg, cardBorder, textColor, mutedColor } = useTheme()
  const [lastMessage, setLastMessage] = useState("")
  const date = new Date().toLocaleDateString("hi-IN", {
    year: "numeric", month: "long", day: "numeric"
  })

  function speak(text, onEnd) {
    speakUtil(text, onEnd, setLastMessage)
  }

  useEffect(() => {
    setTimeout(() => {
      speak(
        "बहुत बहुत बधाई हो " + name + "! " +
        "आपने Pyra Python Tutor का पूरा course पूरा कर लिया! " +
        "आपने 20 में से " + score + " सही जवाब दिए। " +
        "यह certificate आपकी मेहनत का प्रमाण है। " +
        "S दबाएं certificate save करने के लिए। " +
        "R दबाएं दोबारा सुनने के लिए।"
      )
    }, 1000)
  }, [])

  useEffect(() => {
    function handleKey(e) {
      const key = e.key.toLowerCase()
      if (key === "s") window.print()
      if (key === "r") speak(lastMessage)
      if (key === "h") navigate("/", { state: { name } })
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [lastMessage])

  return (
    <main style={{
      minHeight: "100vh",
      background: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", padding: "2rem"
    }}>
      <div style={{ width: "100%", maxWidth: "700px" }}>

        <div id="certificate" style={{
          background: theme === "dark" ? "#1a1a2e" : "#fff",
          border: "3px solid #a0a0ff",
          borderRadius: "20px",
          padding: "3rem",
          textAlign: "center",
          position: "relative",
          marginBottom: "2rem"
        }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🏆</div>
          <p style={{ color: "#a0a0ff", fontSize: "0.9rem", letterSpacing: "3px", textTransform: "uppercase", margin: "0 0 0.5rem" }}>Certificate of Completion</p>
          <h1 style={{ color: textColor, fontSize: "1.5rem", margin: "0 0 1.5rem" }}>Pyra Python Tutor</h1>

          <div style={{ border: "1px solid " + cardBorder, borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
            <p style={{ color: mutedColor, margin: "0 0 0.5rem", fontSize: "0.9rem" }}>यह प्रमाणित करता है कि</p>
            <h2 style={{ color: "#a0a0ff", fontSize: "2rem", margin: "0 0 0.5rem" }}>{name}</h2>
            <p style={{ color: textColor, margin: "0" }}>ने सफलतापूर्वक Python Programming का course पूरा किया</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
            {[["📚", "15 Lessons", "पूरे किए"], ["🧠", score + "/20", "MCQ Score"], ["🤖", "Code Agent", "इस्तेमाल किया"]].map(([icon, val, label]) => (
              <div key={label} style={{ background: cardBg, border: "1px solid " + cardBorder, borderRadius: "12px", padding: "1rem" }}>
                <div style={{ fontSize: "1.5rem" }}>{icon}</div>
                <div style={{ color: "#a0a0ff", fontWeight: "bold", fontSize: "1.1rem" }}>{val}</div>
                <div style={{ color: mutedColor, fontSize: "0.8rem" }}>{label}</div>
              </div>
            ))}
          </div>

          <p style={{ color: mutedColor, fontSize: "0.85rem", margin: "0" }}>दिनांक: {date}</p>
          <p style={{ color: "#a0a0ff", fontSize: "1.2rem", margin: "1rem 0 0" }}>🎓 Pyra — आपकी Python Tutor</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
          <button onClick={() => speak(lastMessage)} aria-label="R — दोबारा सुनें"
            style={{ padding: "1rem", fontSize: "1rem", borderRadius: "12px", background: "#4a4af4", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
            🔁 दोबारा सुनें<br /><span style={{ fontSize: "0.75rem" }}>(R)</span>
          </button>
          <button onClick={() => window.print()} aria-label="S — Certificate Save करें"
            style={{ padding: "1rem", fontSize: "1rem", borderRadius: "12px", background: "#22c55e", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
            💾 Save करें<br /><span style={{ fontSize: "0.75rem" }}>(S)</span>
          </button>
          <button onClick={() => navigate("/")} aria-label="H — Home पर जाएं"
            style={{ padding: "1rem", fontSize: "1rem", borderRadius: "12px", background: "#f4a261", color: "#000", border: "none", cursor: "pointer", fontWeight: "bold" }}>
            🏠 Home<br /><span style={{ fontSize: "0.75rem" }}>(H)</span>
          </button>
        </div>

        <div style={{ background: cardBg, border: "1px solid " + cardBorder, borderRadius: "12px", padding: "1rem", textAlign: "center" }}>
          <p style={{ color: mutedColor, fontSize: "0.85rem", margin: "0 0 0.5rem" }}>Keyboard Shortcuts</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
            {[["R", "दोबारा सुनें"], ["S", "Save करें"], ["H", "Home"]].map(([key, desc]) => (
              <div key={key} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <span style={{ background: "#2a2a5e", color: "#a0a0ff", padding: "0.2rem 0.6rem", borderRadius: "6px", fontWeight: "bold" }}>{key}</span>
                <span style={{ color: mutedColor, fontSize: "0.85rem" }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}

export default CertificatePage