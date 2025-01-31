import { useState, useEffect } from "react";
import { GeminiService } from "@/services/gemini/GeminiService";

function extractTitle(htmlString: string) {
  const match = htmlString.match(/<h2>(.*?)<\/h2>/i);
  return match ? match[1] : "sem titulo";
}
export function useGemini(prompt: string, generateContent?: boolean) {
  const [response, setResponse] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (prompt && generateContent == true) {
        try {

          const intermediateResponse = "Lembrando a estória...";
          setResponse(intermediateResponse);
          const promptData = await GeminiService(prompt);
          const title = extractTitle(promptData);
          setTitle(title);
          setResponse(promptData);
        } catch (error) {
          console.error("Erro ao chamar o GeminiService:", error);
          setResponse(null);
        }
      }
    };

    fetchData();
  }, [prompt, generateContent]);

  return { response, title };
}
