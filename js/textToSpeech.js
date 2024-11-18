let speech = new SpeechSynthesisUtterance();
speech.lang = "en";

function textToSpeech(text) {
    speech.text = text
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel()
    }
    window.speechSynthesis.speak(speech);
}