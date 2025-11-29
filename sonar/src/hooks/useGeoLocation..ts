import { useState, useEffect } from "react";

// Interfejsy (bez zmian)
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface GeolocationState {
  loaded: boolean;
  coordinates?: Coordinates;
  error?: {
    code: number;
    message: string;
  };
}

const useGeoLocation = () => {
  // POPRAWKA: Przenosimy logikę sprawdzania wsparcia do inicjalizacji stanu.
  // Dzięki temu stan jest poprawny już przy pierwszym renderze,
  // a useEffect nie musi wywoływać natychmiastowej aktualizacji.
  const [location, setLocation] = useState<GeolocationState>(() => {
    // Sprawdzamy, czy kod uruchamia się w przeglądarce (dla bezpieczeństwa SSR)
    const isBrowser =
      typeof window !== "undefined" && typeof navigator !== "undefined";

    if (isBrowser && !("geolocation" in navigator)) {
      return {
        loaded: true,
        error: {
          code: 0,
          message: "Geolokalizacja nie jest wspierana.",
        },
      };
    }

    // Domyślny stan ładowania
    return {
      loaded: false,
    };
  });

  const onSuccess = (position: GeolocationPosition) => {
    setLocation({
      loaded: true,
      coordinates: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
    });
  };

  const onError = (error: GeolocationPositionError) => {
    setLocation({
      loaded: true,
      error: {
        code: error.code,
        message: error.message,
      },
    });
  };

  useEffect(() => {
    // 1. Jeśli brak wsparcia, stan został już ustawiony w useState.
    // Przerywamy, aby nie wykonywać reszty kodu.
    if (!("geolocation" in navigator)) return;

    // 2. Pobieramy lokalizację (to jest asynchroniczne, więc jest OK w useEffect)
    navigator.geolocation.getCurrentPosition(onSuccess, onError);

    // Opcjonalnie: można dodać czyszczenie, jeśli używasz watchPosition
  }, []);

  return location;
};

export default useGeoLocation;
