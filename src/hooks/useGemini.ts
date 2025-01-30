import { useState, useEffect } from "react";
import { GeminiService } from "@/services/gemini/GeminiService";

export function useGemini(prompt: string, generateContent?: boolean) {
  const [response, setResponse] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (prompt && generateContent == true) {
        try {

          const intermediateResponse = "Lembrando a história...";
          setResponse(intermediateResponse);
          const promptData = await GeminiService(prompt);
          setResponse(promptData);
        } catch (error) {
          console.error("Erro ao chamar o GeminiService:", error);
          setResponse(null);
        }
      }
    };

    fetchData();
  }, [prompt, generateContent]);

  return { response };
}
