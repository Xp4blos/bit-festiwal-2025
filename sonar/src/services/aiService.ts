import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Activity, AIAnalysisResult, SuggestedActivity } from "../types";
// Usuwamy import INITIAL_ACTIVITIES, ponieważ pobieramy dane z API
// import { INITIAL_ACTIVITIES } from "../data/mockData";

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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

/**
 * Analizuje dopasowanie użytkownika do aktywności za pomocą Gemini (pojedyncze dopasowanie)
 */
export async function analyzeMatchWithAI(
  userInterests: string[],
  activityDesc: string,
  activityType: string
): Promise<AIAnalysisResult> {
  const prompt = `
Jesteś asystentem AI, który pomaga użytkownikom znaleźć odpowiednie wydarzenia społeczne.

Użytkownik wypełnił ankietę: ${userInterests.join(", ")}
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
    const jsonText = response
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const result = JSON.parse(jsonText);
    return result as AIAnalysisResult;
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return mockAnalyzeMatch(userInterests, activityDesc);
  }
}

/**
 * Sugeruje 5 najlepszych aktywności na podstawie ankiety użytkownika i AKTUALNYCH wydarzeń z API
 */
export async function getSuggestedActivities(
  userId?: number
): Promise<SuggestedActivity[]> {
  // Zmienna przechowująca pobrane aktywności, aby użyć ich w fallbacku w razie błędu AI
  let fetchedActivities: Activity[] = [];

  try {
    if (!userId) {
      console.warn("User ID not provided");
      return [];
    }

    // 1. Pobierz dane użytkownika (preferencje)
    const userResponse = await fetch(
      `https://kokos-api.grayflower-7f624026.polandcentral.azurecontainerapps.io/api/Users/${userId}`
    );

    if (!userResponse.ok) {
      console.error("Failed to fetch user data");
      return [];
    }

    const userData = await userResponse.json();
    const surveyAnswersString = userData.preferencje;

    if (!surveyAnswersString || surveyAnswersString.trim() === "") {
      console.warn("No preferences found for user");
      return [];
    }

    console.log("User preferences from API:", surveyAnswersString);

    // 2. Pobierz wszystkie dostępne wydarzenia z API
    const eventsResponse = await fetch(
      "https://kokos-api.grayflower-7f624026.polandcentral.azurecontainerapps.io/api/Events"
    );

    if (!eventsResponse.ok) {
      console.error("Failed to fetch events data");
      return [];
    }

    const rawEvents = await eventsResponse.json();

    // Mapowanie danych z API na format Activity (naprawa dat i typów)
    fetchedActivities = rawEvents.map((item: any) => ({
      ...item,
      // Naprawa formatu godziny jeśli brakuje daty w stringu
      godzina: item.godzina.includes("T")
        ? item.godzina
        : `${item.data}T${item.godzina}`,
      szerokosc: Number(item.szerokosc),
      wysokosc: Number(item.wysokosc),
    }));

    // Filtrujemy tylko niezakończone wydarzenia
    const activeActivities = fetchedActivities.filter((a) => !a.zakonczone);

    // Jeśli mało wydarzeń, nie pytamy AI, tylko zwracamy co jest
    if (activeActivities.length === 0) return [];

    // 3. Przygotuj uproszczone dane dla Promptu (oszczędność tokenów)
    const activitiesData = activeActivities.map((activity) => ({
      id: activity.id,
      title: activity.nazwa,
      desc: activity.opis,
      type: activity.typ,
      date: activity.data,
      time: activity.godzina,
    }));

    const prompt = `
Jesteś asystentem AI. Pomóż użytkownikowi znaleźć najlepsze wydarzenia.

Preferencje użytkownika:
${surveyAnswersString}

Dostępne wydarzenia (JSON):
${JSON.stringify(activitiesData)}

Zadanie:
Wybierz maksymalnie 5 wydarzeń, które najlepiej pasują do preferencji.
Dla każdego zwróć obiekt JSON.

Format odpowiedzi (tylko czysta tablica JSON, bez markdown):
[
  {
    "id": <id wydarzenia>,
    "score": <liczba 0-100>,
    "reason": "<krótki powód dlaczego pasuje>",
    "icebreaker": "<luźne zdanie na powitanie>"
  }
]
`;

    // 4. Zapytanie do Gemini
    const response = await sendPromptToGemini(prompt);

    // Czyszczenie odpowiedzi
    const jsonText = response
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    type Suggestion = {
      id: number;
      score: number;
      reason: string;
      icebreaker: string;
    };
    const suggestions: Suggestion[] = JSON.parse(jsonText) as Suggestion[];

    // 5. Łączenie sugestii AI z pełnymi danymi aktywności
    const result: SuggestedActivity[] = suggestions
      .map((suggestion) => {
        const activity = fetchedActivities.find((a) => a.id === suggestion.id);
        if (!activity) return null;

        return {
          ...activity,
          score: suggestion.score,
          reason: suggestion.reason,
          icebreaker: suggestion.icebreaker,
        };
      })
      .filter((x): x is SuggestedActivity => Boolean(x));

    console.log("AI Suggested activities:", result);
    return result;
  } catch (error) {
    console.error("Error getting suggested activities (AI fail):", error);

    // Fallback: Jeśli AI zawiedzie, ale mamy dane z API, zwróć 5 losowych wydarzeń
    if (fetchedActivities.length > 0) {
      console.log("Using fallback: Random API activities");
      const active = fetchedActivities.filter((a) => !a.zakonczone);
      const shuffled = active.sort(() => 0.5 - Math.random()).slice(0, 5);

      return shuffled.map((activity) => ({
        ...activity,
        score: Math.floor(Math.random() * 20 + 60), // Losowy score 60-80
        reason: "Polecane wydarzenie w Twojej okolicy",
        icebreaker: `Cześć! Wybierasz się na "${activity.nazwa}"?`,
      }));
    }

    return [];
  }
}

/**
 * Mock funkcja (używana tylko w analyzeMatchWithAI jako fallback)
 */
export const mockAnalyzeMatch = (
  userInterests: string[],
  activityDesc: string
): AIAnalysisResult => {
  const keywords = ["sport", "kodowanie", "muzyka", "taniec", "książka"];
  const score = Math.floor(Math.random() * (90 - 40) + 40);

  return {
    score,
    reason: "Analiza offline (brak połączenia z AI)",
    icebreaker: "Hej, wygląda na ciekawe wydarzenie!",
  };
};
