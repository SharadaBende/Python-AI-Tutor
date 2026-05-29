import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

function IntroPage() {
  const [name, setName] = useState("")
  const [step, setStep] = useState("askName")
  const [listening, setListening] = useState(false)
  const [status, setStatus] = useState("")
  const navigate = useNavigate()

  function speak(text, onEnd) {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "hi-IN"
    utterance.rate = 0.9
    if (onEnd) utterance.onend = onEnd
    window.speechSynthesis.speak(utterance)
  }

  useEffect(() => {
    setTimeout(() => {
      speak("नमस्ते! मैं Pyra हूँ, आपकी Python tutor। कृपया अपना नाम बताइए।")
      setStatus("Pyra बोल रही है...")
    }, 500)
  }, [])

  function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setStatus("Voice support नहीं है, कृपया type करें")
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = "hi-IN"
    recognition.start()
    setListening(true)
    setStatus("सुन रही हूँ... अपना नाम बोलिए")
    recognition.onresult = (e) => {
      const spokenName = e.results[0][0].transcript
      setName(spokenName)
      setListening(false)
      setStatus("नाम मिला: " + spokenName)
    }
    recognition.onerror = () => {
      setListening(false)
      setStatus("सुनाई नहीं दिया, कृपया दोबारा कोशिश करें")
    }
  }

  function handleNameSubmit() {
    if (!name.trim()) {
      speak("कृपया अपना नाम बताइए")
      setStatus("कृपया अपना नाम बताइए")
      return
    }
    setStep("welcome")
    speak(
      "नमस्ते " + name + "! Python की दुनिया में आपका स्वागत है! क्या आप lessons शुरू करना चाहते हैं?",
    )
    setStatus("Pyra बोल रही है...")
  }

  function startListeningForYes() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return
    const recognition = new SpeechRecognition()
    recognition.lang = "hi-IN"
    recognition.start()
    setListening(true)
    setStatus("सुन रही हूँ...")
    recognition.onresult = (e) => {
      const answer = e.results[0][0].transcript.toLowerCase()
      setListening(false)
      if (answer.includes("हाँ") || answer.includes("हां") || answer.includes("ha") || answer.includes("yes")) {
        goToLessons()
      } else {
        setStatus("मुझे 'हाँ' सुनाई दे तो आगे बढ़ेंगे")
      }
    }
    recognition.onerror = () => {
      setListening(false)
      setStatus("सुनाई नहीं दिया, कृपया button दबाएं")
    }
  }

  function goToLessons() {
    speak("बहुत अच्छा! चलिए शुरू करते हैं!")
    setTimeout(() => {
      navigate("/lessons", { state: { name } })
    }, 2000)
  }

  return (
    <main aria-label="परिचय पृष्ठ" style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem", fontFamily: "sans-serif", color: "#fff", background: "#0f0f1a", minHeight: "100vh" }}>
      <h1 style={{ color: "#a0a0ff" }}>🎓 Pyra — Python Tutor</h1>

      <div aria-live="polite" style={{ background: "#1a1a2e", padding: "1.5rem", borderRadius: "12px", marginBottom: "1.5rem" }}>
        {step === "askName" && (
          <>
            <p style={{ fontSize: "1.2rem" }}>नमस्ते! मैं <strong>Pyra</strong> हूँ, आपकी Python tutor।</p>
            <p>कृपया अपना नाम बताइए।</p>
          </>
        )}
        {step === "welcome" && (
          <>
            <p style={{ fontSize: "1.2rem" }}>नमस्ते <strong>{name}</strong>! 🎉</p>
            <p>Python की दुनिया में आपका स्वागत है!</p>
            <p>क्या आप lessons शुरू करना चाहते हैं?</p>
          </>
        )}
        <p style={{ color: "#a0a0ff", marginTop: "1rem" }}>{status}</p>
      </div>

      {step === "askName" && (
        <>
          <label htmlFor="nameInput" style={{ display: "block", marginBottom: "0.5rem" }}>आपका नाम:</label>
          <input
            id="nameInput"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
            placeholder="यहाँ नाम लिखें..."
            aria-label="अपना नाम लिखें"
            style={{ width: "100%", padding: "0.8rem", fontSize: "1rem", borderRadius: "8px", border: "2px solid #555", background: "#111", color: "#fff", marginBottom: "1rem" }}
          />
          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={startListening} disabled={listening} aria-label="आवाज़ से नाम बोलें"
              style={{ padding: "0.8rem 1.5rem", fontSize: "1rem", borderRadius: "8px", background: listening ? "#555" : "#4a4af4", color: "#fff", border: "none", cursor: "pointer" }}>
              {listening ? "सुन रही हूँ..." : "🎤 आवाज़ से बोलें"}
            </button>
            <button onClick={handleNameSubmit} aria-label="आगे बढ़ें"
              style={{ padding: "0.8rem 1.5rem", fontSize: "1rem", borderRadius: "8px", background: "#22c55e", color: "#fff", border: "none", cursor: "pointer" }}>
              आगे बढ़ें →
            </button>
          </div>
        </>
      )}

      {step === "welcome" && (
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button onClick={startListeningForYes} disabled={listening} aria-label="आवाज़ से हाँ बोलें"
            style={{ padding: "0.8rem 1.5rem", fontSize: "1rem", borderRadius: "8px", background: listening ? "#555" : "#4a4af4", color: "#fff", border: "none", cursor: "pointer" }}>
            {listening ? "सुन रही हूँ..." : "🎤 आवाज़ से बोलें"}
          </button>
          <button onClick={goToLessons} aria-label="हाँ, lessons शुरू करें"
            style={{ padding: "0.8rem 1.5rem", fontSize: "1rem", borderRadius: "8px", background: "#22c55e", color: "#fff", border: "none", cursor: "pointer" }}>
            हाँ, शुरू करें! →
          </button>
        </div>
      )}
    </main>
  )
}

export default IntroPage