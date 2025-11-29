export interface Activity {
  id: number;
  lat: number;
  lng: number;
  title: string;
  desc: string;
  type: "Sport" | "Nauka" | "Relaks" | "Inne";
  author: string;
}

export interface AIAnalysisResult {
  score: number;
  reason: string;
  icebreaker: string;
}

export interface Location {
  lat: number;
  lng: number;
}
