import type { AIAnalysisResult } from "../types";

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
