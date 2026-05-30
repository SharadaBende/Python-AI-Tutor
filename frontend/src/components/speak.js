function getBestHindiVoice() {
  const voices = window.speechSynthesis.getVoices()
  const preferred = [
    "Google हिन्दी",
    "Google Hindi",
    "Microsoft Swara",
    "Microsoft Hemant",
    "hi-IN",
  ]
  for (const name of preferred) {
    const found = voices.find(
      (v) => v.name.includes(name) || v.lang === name
    )
    if (found) return found
  }
  return voices.find((v) => v.lang.startsWith("hi")) || null
}

export function speak(text, onEnd, setLastMessage) {
  window.speechSynthesis.cancel()
  if (setLastMessage) setLastMessage(text)

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = "hi-IN"
  utterance.rate = 0.85
  utterance.pitch = 1.1
  utterance.volume = 1

  const trySpeak = () => {
    const voice = getBestHindiVoice()
    if (voice) utterance.voice = voice
    if (onEnd) utterance.onend = onEnd
    window.speechSynthesis.speak(utterance)
  }

  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = trySpeak
  } else {
    trySpeak()
  }
}