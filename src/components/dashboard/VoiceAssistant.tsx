import React, { useEffect, useRef, useState } from "react";
import { Mic, Volume2 } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const VoiceAssistantGemini = () => {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  useEffect(() => {
  const testGemini = async () => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent("Say hello");
      console.log("Gemini OK:", result.response.text());
    } catch (e) {
      console.error("Gemini FAILED:", e);
    }
  };

  testGemini();
}, []);

  // ✅ Use your working Gemini API key (ensure it's in .env)
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition API");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = async (event: any) => {
      const userSpeech = event.results[0][0].transcript;
      console.log("🎤 User said:", userSpeech);
      await handleVoiceCommand(userSpeech);
    };

    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
  }, []);

  // 🗣️ Speak function (with smoother tone)
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.05;
    utterance.rate = 1;
    utterance.volume = 1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    speechSynthesis.speak(utterance);
  };

  // 💬 Handle voice input and get Gemini reply
  const handleVoiceCommand = async (text: string) => {
    speak("Let me check that for you...");

    try {
      // ✅ Use your working model
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
      You are an AI voice assistant for a UV disinfection dashboard.
      The user said: "${text}".
      Respond briefly, conversationally, and relevantly about:
      hygiene scores, contamination forecasts, sensor health, ROI, or analytics.
      `;

      console.log("🚀 Sending prompt to Gemini...");
      const result = await model.generateContent(prompt);

      // ✅ Safely extract the response text
      const aiResponse = result.response?.text?.() || "I couldn’t generate a response.";
      console.log("🤖 Gemini replied:", aiResponse);

      speak(aiResponse);
    } catch (error: any) {
      console.error("❌ Gemini API error:", error);
      speak("Sorry, I couldn't reach Gemini right now. Please try again.");
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
      speak("I’m listening. What would you like to know about the dashboard?");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2">
      <button
        onClick={toggleListening}
        className={`p-4 rounded-full shadow-lg transition ${
          listening ? "bg-red-500" : "bg-blue-500"
        } text-white hover:scale-105`}
      >
        {listening ? (
          <Mic className="w-6 h-6 animate-pulse" />
        ) : (
          <Volume2 className="w-6 h-6" />
        )}
      </button>
      <p className="text-sm text-muted-foreground">
        {speaking ? "Speaking..." : listening ? "Listening..." : "Tap to talk"}
      </p>
    </div>
  );
};

export default VoiceAssistantGemini;
