import React, { useState, useMemo } from "react";
import {
  MapPin,
  Navigation,
  ArrowLeft,
  Bug,
  Sparkles,
  Radio,
  CalendarDays,
} from "lucide-react";
import type { Activity } from "../types";
import { INITIAL_ACTIVITIES, CURRENT_USER_LOCATION } from "../data/mockData";

import MapView from "../components/map/MapView";
import ActivityCard from "../components/activity/ActivityCard";

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const MapPage: React.FC = () => {
  const [activities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [radius, setRadius] = useState<number>(2);
  const [isCustomRadius, setIsCustomRadius] = useState<boolean>(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [isDevMode, setDevMode] = useState<boolean>(false);

  // 1. Najpierw filtrujemy po radiusie
  const visibleActivities = useMemo(() => {
    return activities.filter((activity) => {
      const dist = calculateDistance(
        CURRENT_USER_LOCATION.lat,
        CURRENT_USER_LOCATION.lng,
        activity.lat,
        activity.lng
      );
      return dist <= radius;
    });
  }, [activities, radius]);

  // 2. Dzielimy na sekcje: Proponowane, Live, Nadchodzące
  const { recommended, live, upcoming } = useMemo(() => {
    const now = new Date();

    // Filtrujemy tylko aktywne (nie zakończone) do głównych list
    // isEnded === false (0)
    const activeActivities = visibleActivities.filter((a) => !a.isEnded);

    // Dzielimy aktywne na Live (start w przeszłości) i Upcoming (start w przyszłości)
    const liveActivities: Activity[] = [];
    const upcomingActivities: Activity[] = [];

    activeActivities.forEach((activity) => {
      const eventDate = new Date(`${activity.date}T${activity.time}`);
      if (eventDate <= now) {
        liveActivities.push(activity);
      } else {
        upcomingActivities.push(activity);
      }
    });

    // Sortujemy Live: od najnowszych
    liveActivities.sort((a, b) => {
      return (
        new Date(`${b.date}T${b.time}`).getTime() -
        new Date(`${a.date}T${a.time}`).getTime()
      );
    });

    // Sortujemy Upcoming: od najbliższych
    upcomingActivities.sort((a, b) => {
      return (
        new Date(`${a.date}T${a.time}`).getTime() -
        new Date(`${b.date}T${b.time}`).getTime()
      );
    });

    // --- AI REKOMENDACJE ---
    // Wybieramy 3 losowe z puli NADCHODZĄCYCH
    const shuffledUpcoming = [...upcomingActivities].sort(() => 0.5);
    const recommendedSelection = shuffledUpcoming.slice(0, 3);
    const recommendedIds = new Set(recommendedSelection.map((a) => a.id));

    // Usuwamy rekomendowane z listy ogólnej "Nadchodzące", żeby się nie dublowały
    const finalUpcoming = upcomingActivities.filter(
      (a) => !recommendedIds.has(a.id)
    );

    return {
      recommended: recommendedSelection,
      live: liveActivities,
      upcoming: finalUpcoming,
    };
  }, [visibleActivities]);

  const handleRadiusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "custom") {
      setIsCustomRadius(true);
    } else {
      setIsCustomRadius(false);
      setRadius(Number(val));
    }
  };

  // --- WIDOK MAPY ---
  if (selectedActivity || isDevMode) {
    return (
      <div className="relative h-screen w-full bg-gray-100 flex flex-col">
        {!isDevMode && (
          <div className="absolute top-4 left-4 z-[1000]">
            <button
              onClick={() => setSelectedActivity(null)}
              className="bg-white text-slate-800 px-4 py-3 rounded-xl shadow-lg font-bold flex items-center gap-2 hover:bg-gray-50 transition border border-gray-200"
            >
              <ArrowLeft size={20} /> Wróć do listy
            </button>
          </div>
        )}

        {/* ... (reszta widoku mapy bez zmian) ... */}
        {isDevMode && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-red-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
            TRYB DEWELOPERSKI
          </div>
        )}

        <div className="flex-1">
          <MapView
            userLocation={CURRENT_USER_LOCATION}
            activities={
              isDevMode
                ? activities
                : selectedActivity
                ? [selectedActivity]
                : []
            }
            radius={radius}
            mode={isDevMode ? "dev" : "single"}
            selectedActivity={selectedActivity}
            onSelectActivity={setSelectedActivity}
          />
        </div>

        {isDevMode && (
          <button
            onClick={() => setDevMode(false)}
            className="absolute bottom-8 right-8 z-[1000] bg-slate-800 text-white p-4 rounded-full shadow-xl"
          >
            <ArrowLeft size={24} />
          </button>
        )}
      </div>
    );
  }

  // --- WIDOK LISTY ---
  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="flex-none bg-white shadow-sm z-20 px-4 py-4">
        {/* ... (header bez zmian) ... */}
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 text-blue-600 mb-3 font-medium text-sm">
            <MapPin size={16} />
            <span>Warszawa, Centrum</span>
          </div>

          <div className="flex gap-3 items-center">
            <label className="text-sm font-bold text-gray-700 whitespace-nowrap">
              Szukaj w:
            </label>
            {!isCustomRadius ? (
              <select
                className="bg-gray-100 border-none text-slate-800 text-sm font-bold rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 cursor-pointer flex-1 outline-none"
                value={radius}
                onChange={handleRadiusChange}
              >
                <option value={2}>2 km</option>
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value="custom">Wpisz własny...</option>
              </select>
            ) : (
              <div className="flex gap-2 flex-1 animate-fade-in">
                <input
                  type="number"
                  autoFocus
                  className="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="km"
                  onChange={(e) => setRadius(Number(e.target.value))}
                />
                <button
                  onClick={() => setIsCustomRadius(false)}
                  className="text-gray-400 hover:text-gray-600 px-2"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 scroll-smooth">
        <div className="max-w-md mx-auto pb-20 space-y-8">
          {recommended.length === 0 &&
          live.length === 0 &&
          upcoming.length === 0 ? (
            <div className="text-center py-10 opacity-60">
              <div className="bg-gray-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Navigation size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">
                Brak aktywnych wydarzeń w promieniu {radius} km.
              </p>
              <button
                onClick={() => setRadius(radius + 5)}
                className="mt-4 text-blue-600 font-bold text-sm"
              >
                Zwiększ zasięg
              </button>
            </div>
          ) : (
            <>
              {/* SEKCJA 1: PROPONOWANE */}
              {recommended.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="text-indigo-600" size={18} />
                    <h2 className="text-lg font-black text-indigo-900">
                      Proponowane dla Ciebie
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {recommended.map((activity) => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        onSelect={() => setSelectedActivity(activity)}
                        isFeatured={true}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* SEKCJA 2: LIVE (Started & Not Ended) */}
              {live.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Radio className="text-green-600" size={18} />
                    <h2 className="text-lg font-black text-green-800">
                      Trwają teraz
                    </h2>
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                      LIVE
                    </span>
                  </div>
                  <div className="space-y-3">
                    {live.map((activity) => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        onSelect={() => setSelectedActivity(activity)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* SEKCJA 3: NADCHODZĄCE (Not Started & Not Ended) */}
              {upcoming.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <CalendarDays className="text-slate-500" size={18} />
                    <h2 className="text-lg font-black text-slate-700">
                      Nadchodzące
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {upcoming.map((activity) => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        onSelect={() => setSelectedActivity(activity)}
                      />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>

      {/* (Dev button bez zmian) */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setDevMode(true)}
          className="bg-slate-800 hover:bg-slate-900 text-white p-3 rounded-full shadow-xl transition-transform hover:scale-105 flex items-center gap-2"
        >
          <Bug size={20} />
        </button>
      </div>
    </div>
  );
};

export default MapPage;
