import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyD8JzXoc7yBNJgSoix8l8Xbkgvb7iuxcL8"; // 🔑 replace with your API key

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    // ✅ Correct working model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = "Hey Gemini! Just say hi if you can hear me.";

    const result = await model.generateContent(prompt);
    console.log("✅ Gemini response:");
    console.log(result.response.text());
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testGemini();
