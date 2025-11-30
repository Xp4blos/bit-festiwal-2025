export interface Organizator {
  id: number;
  login: string;
}

export interface Uczestnik {
  id: number;
  login: string;
  potwierdzony: boolean;
}

export interface Activity {
  id: number;
  nazwa: string;
  opis: string;
  organizator: Organizator;
  typ: string; // Zachowujemy string dla elastyczności, lub Union Type jeśli wolisz
  data: string; // YYYY-MM-DD
  godzina: string; // ISO string np. 2025-11-29T22:08:40.186Z lub HH:MM:SS
  wysokosc: number; // Traktujemy jako Longitude (lng)
  szerokosc: number; // Traktujemy jako Latitude (lat)
  zakonczone: boolean;
  uczestnicy: Uczestnik[];
}

export interface Location {
  lat: number;
  lng: number;
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
