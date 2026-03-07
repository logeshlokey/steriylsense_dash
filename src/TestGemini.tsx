import React, { useState, useEffect, useRef } from "react";
// 👇 Add this before your component
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

export default function VoiceGeminiAssistant() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hey there 👋 I'm your AI assistant. How can I help you today?" },
  ]);
  const [loading, setLoading] = useState(false);

  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;

  const apiKey = "AIzaSyD8JzXoc7yBNJgSoix8l8Xbkgvb7iuxcL8"; // 🔑 Replace with your Gemini API key
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  // 🗣️ Voice recognition setup
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript);
    };

    recognitionRef.current = recognition;
  }, []);

  const speak = (text) => {
    if (!text || synth.speaking) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1.1;
    utterance.pitch = 1;
    synth.speak(utterance);
  };

  const handleListen = () => {
    recognitionRef.current?.start();
  };

  const handleSend = async (customInput) => {
    const userText = customInput || input;
    if (!userText.trim()) return;

    const newMessages = [...messages, { from: "user", text: userText }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userText }] }],
        }),
      });

      const data = await res.json();
      console.log("Gemini raw response:", data);

      const text =
        data?.candidates?.[0]?.content?.parts?.map((p) => p.text)?.join(" ") ||
        "Hmm, I didn’t quite catch that.";

      const updatedMessages = [...newMessages, { from: "bot", text }];
      setMessages(updatedMessages);
      speak(text);
    } catch (err) {
      console.error("Gemini API error:", err);
      const errorMsg = "❌ Sorry, I couldn't connect to the Gemini API.";
      setMessages([...newMessages, { from: "bot", text: errorMsg }]);
      speak(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-gray-50 p-6 rounded-2xl shadow-lg font-sans">
      <h2 className="text-2xl font-bold mb-4 text-center text-indigo-600">
        🎙️ Gemini Voice Assistant
      </h2>

      <div className="h-80 overflow-y-auto mb-4 space-y-3 p-3 border rounded-lg bg-white">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-xl max-w-[80%] ${
                msg.from === "user"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-gray-500 italic animate-pulse">
            Typing...
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Say or type something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={() => handleSend(input)}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
          disabled={loading}
        >
          Send
        </button>
        <button
          onClick={handleListen}
          className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition"
        >
          🎤
        </button>
      </div>
    </div>
  );
}
