require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function testar() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Responda apenas OK"
  });

  console.log(response.text);
}

testar();
