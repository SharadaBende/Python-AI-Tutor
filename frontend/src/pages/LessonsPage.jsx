import { useLocation } from "react-router-dom"
import { useEffect } from "react"

function LessonsPage() {
  const location = useLocation()
  const name = location.state?.name || "दोस्त"

  function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "hi-IN"
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
  }

  useEffect(() => {
    speak("वाह " + name + "! अब हम Python सीखना शुरू करते हैं!")
  }, [])

  return (
    <main style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>📚 Lessons</h1>
      <p style={{ fontSize: "1.2rem" }}>नमस्ते {name}! Lessons जल्द आ रहे हैं...</p>
    </main>
  )
}

export default LessonsPage