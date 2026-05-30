function ProgressBar({ lessons, mcq, agent, theme }) {
  const total = 3
  const completed = (lessons ? 1 : 0) + (mcq ? 1 : 0) + (agent ? 1 : 0)
  const percent = Math.round((completed / total) * 100)

  const cardBg = theme === "dark" ? "#1a1a2e" : "#fff"
  const cardBorder = theme === "dark" ? "#2a2a5e" : "#c0c0ff"
  const mutedColor = theme === "dark" ? "#888" : "#666"

  return (
    <div style={{
      background: cardBg, border: "1px solid " + cardBorder,
      borderRadius: "12px", padding: "0.8rem 1rem", marginBottom: "1rem"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
        <span style={{ color: mutedColor, fontSize: "0.85rem" }}>Overall Progress</span>
        <span style={{ color: "#a0a0ff", fontSize: "0.85rem" }}>{percent}% पूरा</span>
      </div>
      <div style={{ background: theme === "dark" ? "#2a2a4e" : "#d0d0ee", borderRadius: "8px", height: "8px", marginBottom: "0.8rem" }}>
        <div style={{ background: "#a0a0ff", width: percent + "%", height: "8px", borderRadius: "8px", transition: "width 0.5s" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
        {[["📚 Lessons", lessons], ["🧠 MCQ", mcq], ["🤖 Agent", agent]].map(([label, done]) => (
          <div key={label} style={{
            textAlign: "center", padding: "0.4rem", borderRadius: "8px",
            background: done ? "#14532d" : (theme === "dark" ? "#0f0f1a" : "#f0f0ff"),
            border: "1px solid " + (done ? "#22c55e" : cardBorder)
          }}>
            <span style={{ fontSize: "0.8rem", color: done ? "#22c55e" : mutedColor }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProgressBar