export interface Activity {
  id: number;
  lat: number;
  lng: number;
  title: string;
  desc: string;
  type:
    | "Edukacja i rozwój"
    | "Sport i aktywność fizyczna"
    | "Zdrowie i lifestyle"
    | "Kultura i rozrywka"
    | "Społeczność i networking"
    | "Kariera i biznes"
    | "Technologie i innowacje";
  author: string;
  authorId: string;
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
