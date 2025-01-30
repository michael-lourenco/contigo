import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();


const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("Erro: API Key não definida. Configure no arquivo .env.");
  process.exit(1);
} else {
  console.log("API Key definida:", API_KEY);
}
async function GeminiService(prompt: string): Promise<string> {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY ? API_KEY : '');

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response?.text();

    console.log("\n🤖 Resposta da Gemini:\n", response);

    return `${response}`;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro ao chamar a API:", error.message);
      return error.message;
    } else {
      console.error("Erro desconhecido:", error);
      return String(error);
    }
  }
}

export { GeminiService };
