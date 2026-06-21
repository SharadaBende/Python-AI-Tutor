function ProgressBar({ lessons, mcq, agent, theme }) {
  const total = 3
  const completed = (lessons ? 1 : 0) + (mcq ? 1 : 0) + (agent ? 1 : 0)
  const percent = Math.round((completed / total) * 100)

  const mutedColor = theme === "dark" ? "#888" : "#666"

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
      <span style={{ color: mutedColor, fontSize: "0.75rem", whiteSpace: "nowrap" }}>Progress</span>
      <div style={{ flex: 1, background: theme === "dark" ? "#2a2a4e" : "#d0d0ee", borderRadius: "8px", height: "6px" }}>
        <div style={{ background: "#a0a0ff", width: percent + "%", height: "6px", borderRadius: "8px", transition: "width 0.5s" }} />
      </div>
      <span style={{ color: "#a0a0ff", fontSize: "0.75rem", whiteSpace: "nowrap" }}>{percent}%</span>
    </div>
  )
}

export default ProgressBar