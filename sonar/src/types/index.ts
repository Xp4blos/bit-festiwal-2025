export interface Activity {
  id: number;
  lat: number;
  lng: number;
  title: string;
  desc: string;
  type: "Technologie i innowacje" | "Sport i aktywność fizyczna" | "Kariera i biznes" | "Kultura i rozrywka" | "Zdrowie i lifestyle" | "Edukacja i rozwój" | "Społeczność i networking";
  author: string;
  acceptedParticipants: string[];
  pendingParticipants: string[];
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  isEnded: boolean; // ZMIANA: true (1) jeśli zakończone, false (0) jeśli trwa lub nadchodzi
}

export interface SuggestedActivity extends Activity {
  score: number;
  reason: string;
  icebreaker: string;
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
