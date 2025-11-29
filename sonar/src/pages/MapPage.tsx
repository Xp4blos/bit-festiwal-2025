import React, { useState, useMemo } from "react";
import {
  MapPin,
  Navigation,
  ArrowLeft,
  Bug,
  Sparkles,
  Radio,
  CalendarDays,
  Crosshair,
  X,
  RotateCcw,
} from "lucide-react";
import type { Activity, Location } from "../types";
import { INITIAL_ACTIVITIES } from "../data/mockData";
import useGeoLocation from "../hooks/useGeoLocation";
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
  // --- GEOLOKALIZACJA ---
  const locationState = useGeoLocation();

  // Stan dla ręcznie wybranej lokalizacji
  const [manualLocation, setManualLocation] = useState<Location | null>(null);

  // Stan trybu wybierania (czy użytkownik właśnie klika w mapę?)
  const [isChoosingLocation, setIsChoosingLocation] = useState(false);

  // Ostateczna lokalizacja: Ręczna > GPS > Domyślna
  const currentLocation = useMemo(() => {
    if (manualLocation) return manualLocation;

    // Jeśli GPS jeszcze nie dostarczył współrzędnych, użyj domyślnych (Warszawa)
    const lat = locationState.coordinates?.latitude ?? 52.2297;
    const lng = locationState.coordinates?.longitude ?? 21.0122;

    return {
      lat,
      lng,
    };
  }, [locationState.coordinates, manualLocation]);

  // --- POZOSTAŁE STANY ---
  const [activities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [radius, setRadius] = useState<number>(2);
  const [isCustomRadius, setIsCustomRadius] = useState<boolean>(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [isDevMode, setDevMode] = useState<boolean>(false);

  // --- FILTROWANIE ---
  const visibleActivities = useMemo(() => {
    return activities.filter((activity) => {
      const dist = calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        activity.lat,
        activity.lng
      );
      return dist <= radius;
    });
  }, [activities, radius, currentLocation]);

  const { recommended, live, upcoming } = useMemo(() => {
    const now = new Date();
    const activeActivities = visibleActivities.filter((a) => !a.isEnded);
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

    liveActivities.sort(
      (a, b) =>
        new Date(`${b.date}T${b.time}`).getTime() -
        new Date(`${a.date}T${a.time}`).getTime()
    );
    upcomingActivities.sort(
      (a, b) =>
        new Date(`${a.date}T${a.time}`).getTime() -
        new Date(`${b.date}T${b.time}`).getTime()
    );

    const shuffledUpcoming = [...upcomingActivities].sort(
      // eslint-disable-next-line react-hooks/purity
      () => 0.5 - Math.random()
    );
    const recommendedSelection = shuffledUpcoming.slice(0, 3);
    const recommendedIds = new Set(recommendedSelection.map((a) => a.id));
    const finalUpcoming = upcomingActivities.filter(
      (a) => !recommendedIds.has(a.id)
    );

    return {
      recommended: recommendedSelection,
      live: liveActivities,
      upcoming: finalUpcoming,
    };
  }, [visibleActivities]);

  // --- OBSŁUGA UI ---
  const handleRadiusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "custom") {
      setIsCustomRadius(true);
    } else {
      setIsCustomRadius(false);
      setRadius(Number(val));
    }
  };

  const handleManualLocationSelect = (lat: number, lng: number) => {
    setManualLocation({ lat, lng });
    setIsChoosingLocation(false); // Wyłączamy tryb wybierania po kliknięciu
  };

  const resetLocationToGPS = () => {
    setManualLocation(null);
    setIsChoosingLocation(false);
  };

  // --- RENDEROWANIE: WIDOK MAPY (Single / Dev / Choosing) ---
  if (selectedActivity || isDevMode || isChoosingLocation) {
    return (
      <div className="relative h-screen w-full bg-gray-100 flex flex-col">
        {/* Pasek górny w trybie wybierania */}
        {isChoosingLocation && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-4 animate-fade-in w-[90%] md:w-auto justify-between">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <Crosshair className="text-orange-500 animate-pulse" />
              <span className="text-sm">
                Kliknij na mapie, aby ustawić środek
              </span>
            </div>
            <button
              onClick={() => setIsChoosingLocation(false)}
              className="bg-gray-100 p-1 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Przycisk powrotu (jeśli nie wybieramy lokalizacji) */}
        {!isDevMode && !isChoosingLocation && (
          <div className="absolute top-4 left-4 z-[1000]">
            <button
              onClick={() => setSelectedActivity(null)}
              className="bg-white text-slate-800 px-4 py-3 rounded-xl shadow-lg font-bold flex items-center gap-2 hover:bg-gray-50 transition border border-gray-200"
            >
              <ArrowLeft size={20} /> Wróć do listy
            </button>
          </div>
        )}

        {/* Dev Mode Badge */}
        {isDevMode && !isChoosingLocation && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-red-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
            TRYB DEWELOPERSKI
          </div>
        )}

        <div className="flex-1">
          <MapView
            userLocation={currentLocation}
            activities={
              isDevMode
                ? activities
                : selectedActivity
                ? [selectedActivity]
                : []
            }
            radius={radius}
            // Jeśli wybieramy lokalizację, tryb mapy to 'dev' (widzimy radar), w p.p. 'single'
            mode={isDevMode || isChoosingLocation ? "dev" : "single"}
            selectedActivity={selectedActivity}
            onSelectActivity={setSelectedActivity}
            // Nowe propsy
            isSelectingLocation={isChoosingLocation}
            onLocationSelect={handleManualLocationSelect}
          />
        </div>

        {/* Wyjście z Dev Mode */}
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

  // --- RENDEROWANIE: WIDOK LISTY ---
  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col font-sans overflow-hidden">
      {/* HEADER */}
      <header className="flex-none bg-white shadow-sm z-20 px-4 py-4">
        <div className="max-w-md mx-auto">
          {/* Lokalizacja + Przycisk zmiany */}
          <div className="flex justify-between items-start mb-3">
            <div
              className={`flex items-center gap-2 font-medium text-sm transition-colors ${
                manualLocation ? "text-orange-600" : "text-blue-600"
              }`}
            >
              <MapPin size={16} />
              <span className="truncate max-w-[200px]">
                {manualLocation
                  ? "Wybrana lokalizacja"
                  : locationState.error
                  ? "Warszawa (Domyślna)"
                  : "Twoja lokalizacja (GPS)"}
              </span>
            </div>

            <div className="flex gap-2">
              {/* Reset do GPS (widoczny tylko gdy manualna) */}
              {manualLocation && (
                <button
                  onClick={resetLocationToGPS}
                  className="text-xs bg-blue-50 text-blue-600 px-2 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-blue-100 transition"
                >
                  <RotateCcw size={12} /> GPS
                </button>
              )}

              {/* Zmień lokalizację */}
              <button
                onClick={() => setIsChoosingLocation(true)}
                className="text-xs bg-gray-100 text-slate-700 px-2 py-1.5 rounded-lg font-bold hover:bg-gray-200 transition"
              >
                Zmień
              </button>
            </div>
          </div>

          {/* Radius Selector */}
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

      {/* CONTENT LIST */}
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

      {/* Dev Button */}
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
