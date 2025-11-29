import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIAnalysisResult } from "../types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("VITE_GEMINI_API_KEY is not defined in .env file");
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/**
 * Wysyła prompt do Gemini i zwraca odpowiedź
 */
export async function sendPromptToGemini(prompt: string): Promise<string> {
  if (!genAI) {
    throw new Error("Gemini API key is not configured");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

/**
 * Analizuje dopasowanie użytkownika do aktywności za pomocą Gemini
 */
export async function analyzeMatchWithAI(
  userInterests: string[],
  activityDesc: string,
  activityType: string
): Promise<AIAnalysisResult> {
  const prompt = `
Jesteś asystentem AI, który pomaga użytkownikom znaleźć odpowiednie wydarzenia społeczne.

Użytkownik wypełnił ankietę a wyniki prezentują się następująco:
${activityDesc}
Zainteresowania użytkownika: ${userInterests.join(", ")}
Typ wydarzenia: ${activityType}
Opis wydarzenia: ${activityDesc}

Na podstawie powyższych informacji:
1. Oceń dopasowanie w skali 0-100 (tylko liczba)
2. Podaj krótki powód (max 50 znaków)
3. Zasugeruj icebreaker - wiadomość startową (max 100 znaków)

Odpowiedz w formacie JSON:
{
  "score": <liczba 0-100>,
  "reason": "<krótki powód>",
  "icebreaker": "<wiadomość startowa>"
}
`;

  try {
    const response = await sendPromptToGemini(prompt);
    // Usuń markdown formatting jeśli istnieje
    const jsonText = response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const result = JSON.parse(jsonText);
    return result as AIAnalysisResult;
  } catch (error) {
    console.error("Error parsing AI response:", error);
    // Fallback do mock data
    return mockAnalyzeMatch(userInterests, activityDesc);
  }
}

/**
 * Mock funkcja (fallback)
 */
export const mockAnalyzeMatch = (
  userInterests: string[],
  activityDesc: string
): AIAnalysisResult => {
  const keywords = [
    "sport",
    "kodowanie",
    "piłka",
    "bieganie",
    "hackathon",
    "react",
  ];
  const hasKeyword = keywords.some((k) =>
    activityDesc.toLowerCase().includes(k)
  );

  const score = hasKeyword
    ? Math.floor(Math.random() * (99 - 75) + 75)
    : Math.floor(Math.random() * (60 - 30) + 30);

  return {
    score,
    reason: hasKeyword
      ? "Wysoka zgodność zainteresowań!"
      : "Nowe doświadczenie dla Ciebie.",
    icebreaker: `Hej! Widzę, że działasz w temacie: "${activityDesc.substring(
      0,
      15
    )}...". Jest jeszcze miejsce?`,
  };
};
