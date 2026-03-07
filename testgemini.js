import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  const model = genAI.getGenerativeModel({
    model: "gemini-pro", // ✅ CORRECT MODEL
  });

  const result = await model.generateContent(
    "Say hello in one short sentence"
  );

  console.log("Gemini says:", result.response.text());
}

test();