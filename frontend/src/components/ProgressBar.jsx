function ProgressBar({ lessons, mcq, agent, theme }) {
  const isDark = theme === "dark"

  const accent       = "#1cb0f6"
  const success      = "#58cc02"
  const successShadow = "#46a302"
  const mutedColor   = isDark ? "#94a3b8" : "#64748b"
  const trackBg      = isDark ? "rgba(28,176,246,0.10)" : "#e8f7fe"

  const steps = [
    { label: "Lessons", done: lessons },
    { label: "MCQ",     done: mcq },
    { label: "Agent",   done: agent },
  ]

  const completed = steps.filter(s => s.done).length
  const percent   = Math.round((completed / steps.length) * 100)

  return (
    <div style={{ marginBottom: "1.1rem" }}>
      {/* Bar row */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
        <span style={{ color: mutedColor, fontSize: "0.75rem", whiteSpace: "nowrap", fontWeight: 500 }}>
          Overall
        </span>

        <div style={{
          flex: 1,
          background: trackBg,
          borderRadius: "8px",
          height: "7px",
          overflow: "hidden",
        }}>
          <div style={{
            background: percent === 100
              ? `linear-gradient(90deg, ${success}, #78e08f)`
              : `linear-gradient(90deg, ${accent}, ${success})`,
            width: percent + "%",
            height: "7px",
            borderRadius: "8px",
            transition: "width 0.6s ease",
          }} />
        </div>

        <span style={{
          color: percent === 100 ? success : accent,
          fontSize: "0.75rem",
          fontWeight: 700,
          whiteSpace: "nowrap",
          minWidth: "32px",
          textAlign: "right",
        }}>
          {percent}%
        </span>
      </div>

      {/* Step pills */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {steps.map(({ label, done }) => (
          <span key={label} style={{
            fontSize: "0.7rem",
            fontWeight: 600,
            padding: "0.2rem 0.6rem",
            borderRadius: "20px",
            background: done
              ? (isDark ? "rgba(88,204,2,0.15)" : "rgba(88,204,2,0.12)")
              : (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"),
            color: done ? success : mutedColor,
            border: `1px solid ${done ? "rgba(88,204,2,0.3)" : "transparent"}`,
            transition: "all 0.3s",
          }}>
            {done ? "✓ " : ""}{label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default ProgressBar