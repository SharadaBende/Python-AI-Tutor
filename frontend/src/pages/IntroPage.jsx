import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { speak as speakUtil } from "../components/speak"

function IntroPage() {
  const [name, setName] = useState("")
  const [step, setStep] = useState("askName")
  const [listening, setListening] = useState(false)
  const [status, setStatus] = useState("")
  const [lastMessage, setLastMessage] = useState("")
  const navigate = useNavigate()

  function speak(text, onEnd) {
    speakUtil(text, onEnd, setLastMessage)
  }

  function welcomeMessage() {
    speak(
      "नमस्ते! दृष्टि में आपका स्वागत है — जहाँ code बोलता है। " +
      "यह website आपको coding सिखाएगी, चाहे वो Python हो, SQL हो, या JavaScript। " +
      "Keyboard shortcuts इस प्रकार हैं: " +
      "P दबाएं — Pyra का परिचय सुनने के लिए। " +
      "T दबाएं — अपना नाम बोलने के लिए। " +
      "N दबाएं — आगे बढ़ने के लिए। " +
      "R दबाएं — दोबारा सुनने के लिए। " +
      "कृपया P दबाएं और शुरू करें।"
    )
    setStatus("P = सुनें | T = बोलें | N = आगे | R = दोबारा")
  }

  function hearIntro() {
    speak(
      "नमस्ते! मैं Pyra हूँ, आपकी coding tutor। " +
"मैं आपको coding सिखाऊँगी, बिल्कुल आसान तरीके से। " +
      "कृपया अपना नाम बताइए। " +
      "T दबाएं आवाज़ से नाम बोलने के लिए, " +
      "या नाम type करके N दबाएं।"
    )
    setStatus("T = नाम बोलें | N = आगे बढ़ें")
  }

  function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      speak("आपका browser voice support नहीं करता, कृपया type करें")
      setStatus("कृपया नाम type करें")
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = "hi-IN"
    recognition.start()
    setListening(true)
    setStatus("सुन रही हूँ... अपना नाम बोलिए")
    speak("सुन रही हूँ, अपना नाम बोलिए")
    recognition.onresult = (e) => {
      const spokenName = e.results[0][0].transcript
      setName(spokenName)
      setListening(false)
      setStatus("नाम मिला: " + spokenName + " — N दबाएं आगे बढ़ने के लिए")
      speak("नाम मिला " + spokenName + "। N दबाएं आगे बढ़ने के लिए।")
    }
    recognition.onerror = () => {
      setListening(false)
      setStatus("सुनाई नहीं दिया, दोबारा T दबाएं")
      speak("सुनाई नहीं दिया, दोबारा T दबाएं")
    }
  }

  function handleNameSubmit() {
    if (!name.trim()) {
      speak("कृपया पहले अपना नाम बताइए। T दबाएं बोलने के लिए।")
      setStatus("पहले नाम बताइए")
      return
    }
    setStep("welcome")
    speak(
      "नमस्ते " + name + "! Coding की दुनिया में आपका बहुत स्वागत है! " +
      "अब दो options हैं। " +
      "H दबाएं — हाँ, lessons शुरू करने के लिए। " +
      "R दबाएं — दोबारा सुनने के लिए। " +
      "क्या आप lessons शुरू करना चाहते हैं?"
    )
    setStatus("H = हाँ शुरू करें | R = दोबारा सुनें")
  }

  function startListeningForYes() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return
    const recognition = new SpeechRecognition()
    recognition.lang = "hi-IN"
    recognition.start()
    setListening(true)
    setStatus("सुन रही हूँ... हाँ बोलिए")
    recognition.onresult = (e) => {
      const answer = e.results[0][0].transcript.toLowerCase()
      setListening(false)
      if (answer.includes("हाँ") || answer.includes("हां") || answer.includes("ha") || answer.includes("yes")) {
        goToLessons()
      } else {
        setStatus("H दबाएं या हाँ बोलिए")
        speak("कृपया H दबाएं या हाँ बोलिए")
      }
    }
    recognition.onerror = () => {
      setListening(false)
      setStatus("सुनाई नहीं दिया, H दबाएं")
      speak("सुनाई नहीं दिया, H दबाएं")
    }
  }

  function goToLessons() {
    speak("बहुत अच्छा! चलिए सीखना शुरू करते हैं!", () => {
      navigate("/instruction-language", { state: { name } })
    })
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      welcomeMessage()
    }, 6000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    function handleKey(e) {
      const key = e.key.toLowerCase()
      if (key === "p") hearIntro()
      if (key === "t") startListening()
      if (key === "n") handleNameSubmit()
      if (key === "r") speak(lastMessage)
      if (key === "h" && step === "welcome") goToLessons()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [name, step, lastMessage])

  return (
    <main aria-label="Pyra Python Tutor परिचय पृष्ठ" style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0f1a, #1a1a3e)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif",
      padding: "1rem"
    }}>
      <div style={{ width: "100%", maxWidth: "800px" }}>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
           <div style={{ fontSize: "4rem" }}>🎓</div>
<h1 style={{ color: "#a0a0ff", fontSize: "2.5rem", margin: "0.5rem 0 0" }}>दृष्टि</h1>
<p style={{ color: "#a0a0ff", fontSize: "1rem", margin: "0.3rem 0 0", letterSpacing: "2px" }}>Drishti</p>
<p style={{ color: "#888", margin: "0.3rem 0 0" }}>जहाँ code बोलता है</p>
<p style={{ color: "#666", margin: "0.2rem 0 0", fontSize: "0.9rem" }}>आपकी tutor — Pyra</p>
           </div>
       

        <div aria-live="polite" style={{
          background: "#1a1a2e", border: "1px solid #2a2a5e",
          padding: "1.5rem", borderRadius: "16px", marginBottom: "1.5rem", textAlign: "center"
        }}>
          {step === "askName" && (
            <>
              <p style={{ fontSize: "1.2rem", color: "#fff" }}>नमस्ते! मैं <strong style={{ color: "#a0a0ff" }}>Pyra</strong> हूँ</p>
              <p style={{ color: "#ccc" }}>कृपया अपना नाम बताइए</p>
            </>
          )}
          {step === "welcome" && (
            <>
              <p style={{ fontSize: "1.3rem", color: "#fff" }}>नमस्ते <strong style={{ color: "#22c55e" }}>{name}</strong>! 🎉</p>
              <p style={{ color: "#ccc" }}>Coading की दुनिया में आपका स्वागत है!</p>
              <p style={{ color: "#a0a0ff" }}>क्या आप lessons शुरू करना चाहते हैं?</p>
            </>
          )}
          {status !== "" && (
            <p aria-live="assertive" style={{
              marginTop: "1rem", color: "#f4a261", fontSize: "0.95rem",
              background: "#2a1a0e", padding: "0.5rem 1rem", borderRadius: "8px"
            }}>{status}</p>
          )}
        </div>

        {step === "askName" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input
              id="nameInput" type="text" value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
              placeholder="यहाँ अपना नाम लिखें..."
              aria-label="अपना नाम लिखें"
              style={{
                padding: "1rem", fontSize: "1.1rem", borderRadius: "12px",
                border: "2px solid #3a3a6e", background: "#111", color: "#fff",
                outline: "none", width: "100%", boxSizing: "border-box"
              }}
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.8rem" }}>
              <button onClick={hearIntro} aria-label="P — Pyra को सुनें"
                style={{ padding: "1rem", fontSize: "0.95rem", borderRadius: "12px", background: "#f4a261", color: "#000", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                🔊 सुनें<br /><span style={{ fontSize: "0.8rem" }}>(P)</span>
              </button>
              <button onClick={startListening} disabled={listening} aria-label="T — आवाज़ से नाम बोलें"
                style={{ padding: "1rem", fontSize: "0.95rem", borderRadius: "12px", background: listening ? "#333" : "#4a4af4", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                {listening ? "🎙️ सुन रही हूँ" : "🎤 बोलें"}<br /><span style={{ fontSize: "0.8rem" }}>(T)</span>
              </button>
              <button onClick={handleNameSubmit} aria-label="N — आगे बढ़ें"
                style={{ padding: "1rem", fontSize: "0.95rem", borderRadius: "12px", background: "#22c55e", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                आगे बढ़ें<br /><span style={{ fontSize: "0.8rem" }}>(N)</span>
              </button>
            </div>
          </div>
        )}

        {step === "welcome" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.8rem" }}>
            <button onClick={() => speak(lastMessage)} aria-label="R — दोबारा सुनें"
              style={{ padding: "1rem", fontSize: "0.95rem", borderRadius: "12px", background: "#f4a261", color: "#000", border: "none", cursor: "pointer", fontWeight: "bold" }}>
              🔁 दोबारा<br /><span style={{ fontSize: "0.8rem" }}>(R)</span>
            </button>
            <button onClick={startListeningForYes} disabled={listening} aria-label="T — आवाज़ से हाँ बोलें"
              style={{ padding: "1rem", fontSize: "0.95rem", borderRadius: "12px", background: listening ? "#333" : "#4a4af4", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
              {listening ? "🎙️ सुन रही हूँ" : "🎤 बोलें"}<br /><span style={{ fontSize: "0.8rem" }}>(T)</span>
            </button>
            <button onClick={goToLessons} aria-label="H — हाँ lessons शुरू करें"
              style={{ padding: "1rem", fontSize: "0.95rem", borderRadius: "12px", background: "#22c55e", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
              ✅ हाँ!<br /><span style={{ fontSize: "0.8rem" }}>(H)</span>
            </button>
          </div>
        )}

        

      </div>
    </main>
  )
}

export default IntroPage