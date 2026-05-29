import { useState, useEffect, useRef } from "react"

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    sendMessage("hello")
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function sendMessage(userInput) {
    const history = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }))

    if (userInput !== "hello") {
      setMessages((prev) => [...prev, { role: "user", content: userInput }])
    }

    setLoading(true)

    const res = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userInput, conversation_history: history }),
    })

    const data = await res.json()
    console.log("Response:", data)
    if (data.reply) {
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }])
    } else {
      setMessages((prev) => [...prev, { role: "assistant", content: "Error: " + JSON.stringify(data) }])
    }
    setLoading(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage(input)
    setInput("")
  }

  return (
    <main aria-label="Python tutor chat">
      <h1>Pyra — Python Tutor</h1>
      <div aria-live="polite" aria-label="Chat messages">
        {messages.map((m, i) => (
          <div key={i} className={m.role}>
            <strong>{m.role === "assistant" ? "Pyra" : "You"}:</strong>
            <p>{m.content}</p>
          </div>
        ))}
        {loading && <p aria-live="assertive">Pyra is typing...</p>}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="userInput">Your message</label>
        <input
          id="userInput"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type here..."
          autoFocus
        />
        <button type="submit">Send</button>
      </form>
    </main>
  )
}

export default App