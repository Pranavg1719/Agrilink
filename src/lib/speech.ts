// AgriLink Audio Speech Helper for Rural Accessibility (NFR-ACC-001)
export function speakText(text: string, lang: 'en' | 'hi' = 'en') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser')
    return
  }

  window.speechSynthesis.cancel() // Stop any current speech

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'
  utterance.rate = 0.95 // slightly slower for clarity in rural environments
  utterance.pitch = 1.0

  window.speechSynthesis.speak(utterance)
}
