export interface Activity {
  id: number;
  lat: number;
  lng: number;
  title: string;
  desc: string;
  type: "Sport" | "Nauka" | "Relaks" | "Inne";
  author: string;
  acceptedParticipants: string[];
  pendingParticipants: string[];
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  isEnded: boolean; // ZMIANA: true (1) jeśli zakończone, false (0) jeśli trwa lub nadchodzi
}
export interface Location {
  lat: number;
  lng: number;
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
