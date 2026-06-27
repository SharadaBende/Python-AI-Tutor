import { useState, useEffect } from "react"

export function useTheme() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
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

  // Page + cards
  const bg = isDark ? "#11161d" : "#f7f9fc"
  const cardBg = isDark ? "#1a212b" : "#ffffff"
  const cardBorder = isDark ? "#2a3340" : "#e9edf2"
  const borderWidth = "1px"
  const textColor = isDark ? "#f3f5f7" : "#111827"
  const mutedColor = isDark ? "#9aa7b5" : "#6b7280"
  const codeBg = isDark ? "#10151c" : "#fafaf9"
  const codeText = isDark ? "#8ecdfb" : "#0b3d66"

  // Primary accent (blue) — links, focus, "repeat" action, mic
  const accent = "#1cb0f6"
  const accentHover = "#0e8fd9"
  const accentText = "#ffffff"
  const accentSoft = isDark ? "#16273a" : "#e8f7ff"
  const accentShadow = "#0e8fd9"

  // Success (green) — correct answers, "generate" action, progress bar
  const success = "#58cc02"
  const successSoft = isDark ? "#162a0a" : "#f0fdf4"
  const successShadow = "#3ea000"
  const successText = isDark ? "#86efac" : "#3ea000"

  // Danger (red) — wrong answers
  const danger = "#ff4b4b"
  const dangerSoft = isDark ? "#2a1212" : "#ffe0e0"
  const dangerText = isDark ? "#fca5a5" : "#b00000"

  // Gold — certificate / streak / rewards
  const gold = "#ffc800"
  const goldShadow = "#d99000"
  const goldText = isDark ? "#ffe69a" : "#7a4f00"

  return {
    theme, toggleTheme,
    bg, cardBg, cardBorder, borderWidth,
    textColor, mutedColor,
    codeBg, codeText,
    accent, accentHover, accentText, accentSoft, accentShadow,
    success, successSoft, successShadow, successText,
    danger, dangerSoft, dangerText,
    gold, goldShadow, goldText,
    fontSize, setFontSize,
    speed, setSpeed,
  }
}