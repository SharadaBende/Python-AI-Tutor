import { useState, useEffect } from "react"

export function useTheme() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  )
  const [fontSize, setFontSize] = useState(
    parseInt(localStorage.getItem("fontSize") || "16")
  )
  const [speed, setSpeed] = useState(
    parseFloat(localStorage.getItem("speed") || "0.85")
  )

  useEffect(() => {
    localStorage.setItem("theme", theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem("fontSize", fontSize)
  }, [fontSize])

  useEffect(() => {
    localStorage.setItem("speed", speed)
  }, [speed])

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  const isDark = theme === "dark"

  const bg = isDark ? "#05080f" : "#f5f7fa"
  const cardBg = isDark ? "#0d1117" : "#ffffff"
  const cardBorder = isDark ? "#4da6ff" : "#0b5394"
  const borderWidth = "3px"
  const textColor = isDark ? "#ffffff" : "#111111"
  const mutedColor = isDark ? "#cfcfcf" : "#3a3a3a"
  const codeBg = isDark ? "#081420" : "#eaf2fb"
  const codeText = isDark ? "#9ed2ff" : "#0b3d66"
  const accent = isDark ? "#4da6ff" : "#0b5394"
  const accentText = isDark ? "#06141f" : "#ffffff"
  const accentSoft = isDark ? "#13283d" : "#e8f1fb"
  const success = isDark ? "#22c55e" : "#15803d"
  const danger = isDark ? "#f87171" : "#b91c1c"

  return {
    theme, toggleTheme,
    bg, cardBg, cardBorder, borderWidth,
    textColor, mutedColor,
    codeBg, codeText,
    accent, accentText, accentSoft,
    success, danger,
    fontSize, setFontSize,
    speed, setSpeed,
  }
}