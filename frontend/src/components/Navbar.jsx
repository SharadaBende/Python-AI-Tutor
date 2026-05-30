import { useNavigate, useLocation } from "react-router-dom"

function Navbar({ name, theme, toggleTheme }) {
  const navigate = useNavigate()
  const location = useLocation()

  const pages = [
    { path: "/lessons", label: "📚 Lessons", key: "1" },
    { path: "/mcq", label: "🧠 MCQ", key: "2" },
    { path: "/agent", label: "🤖 Agent", key: "3" },
  ]

  function goTo(path) {
    navigate(path, { state: { name } })
  }

  return (
    <nav aria-label="Main navigation" style={{
      background: theme === "dark" ? "#1a1a2e" : "#f0f0ff",
      border: "1px solid " + (theme === "dark" ? "#2a2a5e" : "#c0c0ff"),
      borderRadius: "12px",
      padding: "0.8rem 1rem",
      marginBottom: "1rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "0.5rem"
    }}>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {pages.map(({ path, label, key }) => (
          <button
            key={path}
            onClick={() => goTo(path)}
            aria-label={label + " — " + key + " दबाएं"}
            aria-current={location.pathname === path ? "page" : undefined}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.85rem",
              borderRadius: "8px",
              border: "1.5px solid",
              cursor: "pointer",
              fontWeight: "bold",
              background: location.pathname === path
                ? "#a0a0ff"
                : theme === "dark" ? "#0f0f1a" : "#fff",
              borderColor: location.pathname === path ? "#a0a0ff" : (theme === "dark" ? "#2a2a5e" : "#c0c0ff"),
              color: location.pathname === path
                ? "#000"
                : theme === "dark" ? "#aaa" : "#444",
            }}>
            {label}<br />
            <span style={{ fontSize: "0.7rem", opacity: 0.7 }}>({key})</span>
          </button>
        ))}
      </div>

      <button
        onClick={toggleTheme}
        aria-label={"Theme toggle — M दबाएं. अभी " + (theme === "dark" ? "dark" : "light") + " mode है"}
        style={{
          padding: "0.5rem 1rem",
          fontSize: "0.85rem",
          borderRadius: "8px",
          border: "1.5px solid " + (theme === "dark" ? "#2a2a5e" : "#c0c0ff"),
          cursor: "pointer",
          fontWeight: "bold",
          background: theme === "dark" ? "#0f0f1a" : "#fff",
          color: theme === "dark" ? "#aaa" : "#444",
        }}>
        {theme === "dark" ? "☀️ Light" : "🌙 Dark"}<br />
        <span style={{ fontSize: "0.7rem", opacity: 0.7 }}>(M)</span>
      </button>
    </nav>
  )
}

export default Navbar