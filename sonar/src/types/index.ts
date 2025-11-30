export interface Organizator {
  id: number;
  login: string;
}

export interface Uczestnik {
  id: number;
  login: string;
  potwierdzony: boolean;
}

export type ActivityCategory =
  | "Edukacja i rozwój"
  | "Sport i aktywność fizyczna"
  | "Zdrowie i lifestyle"
  | "Kultura i rozrywka"
  | "Społeczność i networking"
  | "Kariera i biznes"
  | "Technologie i innowacje";

export interface Activity {
  id: number;
  nazwa: string;
  opis: string;
  organizator: Organizator;
  typ: ActivityCategory;
  data: string;
  godzina: string;
  wysokosc: number;
  szerokosc: number;
  zakonczone: boolean;
  uczestnicy: Uczestnik[];
}

export interface Location {
  lat: number;
  lng: number;
}

// NOWY TYP: Opinia
export interface Opinion {
  id: number;
  komentarz: string;
  rating: number;
  autor: {
    id: number;
    login: string;
  };
}

// AI Analysis Result
export interface AIAnalysisResult {
  score: number;
  reason: string;
  icebreaker: string;
}

// Suggested Activity with AI recommendations
export interface SuggestedActivity extends Activity {
  score: number;
  reason: string;
  icebreaker: string;
}
