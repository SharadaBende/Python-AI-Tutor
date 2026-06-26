function ProgressBar({ lessons, mcq, agent, theme }) {
  const total = 3
  const completed = (lessons ? 1 : 0) + (mcq ? 1 : 0) + (agent ? 1 : 0)
  const percent = Math.round((completed / total) * 100)
  const ACCENT = "#f4a261"
  const mutedColor = theme === "dark" ? "#888" : "#666"
  const trackBg = theme === "dark" ? "rgba(244, 162, 97, 0.12)" : "#f0e3d3"

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
      <span style={{ color: mutedColor, fontSize: "0.75rem", whiteSpace: "nowrap" }}>Progress</span>
       
       <div style={{ flex: 1, background: trackBg, borderRadius: "8px", height: "6px" }}>
  <div style={{ background: ACCENT, width: percent + "%", height: "6px", borderRadius: "8px", transition: "width 0.5s" }} />
</div>
<span style={{ color: ACCENT, fontSize: "0.75rem", whiteSpace: "nowrap" }}>{percent}%</span>
          </div>
  )
}

export default ProgressBar