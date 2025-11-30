import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Activity, SuggestedActivity } from "../types";
import { getSuggestedActivities } from "../services/aiService";
import { useAuth } from "./AuthContext";

interface ActivityContextType {
  activities: Activity[];
  suggestedActivities: SuggestedActivity[];
  isLoading: boolean;
  refreshActivities: () => Promise<void>;
  refreshSuggestions: () => Promise<void>;
}

const ActivityContext = createContext<ActivityContextType | undefined>(
  undefined
);

export const ActivityProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [suggestedActivities, setSuggestedActivities] = useState<
    SuggestedActivity[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper do mapowania danych z API
  const mapApiDataToActivity = (item: any): Activity => ({
    ...item,
    godzina: item.godzina.includes("T")
      ? item.godzina
      : `${item.data}T${item.godzina}`,
    szerokosc: Number(item.szerokosc),
    wysokosc: Number(item.wysokosc),
  });

  const fetchActivities = async () => {
    try {
      const response = await fetch(
        "https://kokos-api.grayflower-7f624026.polandcentral.azurecontainerapps.io/api/Events"
      );
      if (!response.ok) throw new Error("Błąd pobierania");
      const data = await response.json();
      const mapped = data.map(mapApiDataToActivity);
      setActivities(mapped);
      return mapped; // Zwracamy dla łańcuchowania
    } catch (err) {
      console.error("Błąd fetch:", err);
      return [];
    }
  };

  // Pobranie danych przy starcie
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await fetchActivities();
      setIsLoading(false);
    };
    init();
  }, []);

  // Funkcja generująca sugestie AI (zapisuje je w stanie globalnym)
  const refreshSuggestions = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // AI service teraz sam pobiera eventy wewnątrz, ale zapiszemy wynik tutaj
      const suggestions = await getSuggestedActivities(user.id);
      setSuggestedActivities(suggestions);
    } catch (error) {
      console.error("AI Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ActivityContext.Provider
      value={{
        activities,
        suggestedActivities,
        isLoading,
        refreshActivities: fetchActivities,
        refreshSuggestions,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useActivities = () => {
  const context = useContext(ActivityContext);
  if (!context)
    throw new Error("useActivities must be used within ActivityProvider");
  return context;
};
