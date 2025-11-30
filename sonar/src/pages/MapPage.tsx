import React, { useState, useMemo, useEffect } from "react";
import {
  useLocation as useRouterLocation,
  useNavigate,
} from "react-router-dom";
import {
  MapPin,
  Navigation,
  ArrowLeft,
  Bug,
  Sparkles,
  CalendarDays,
  Crosshair,
  X,
  RotateCcw,
  Loader2,
  Plus,
  LogOut,
  User,
  RefreshCw,
} from "lucide-react";
import type { Activity, Location } from "../types";
import { useAuth } from "../context/AuthContext";
import { useActivities } from "../context/ActivityContext";
import useGeoLocation from "../hooks/useGeoLocation";
import MapView from "../components/map/MapView";
import ActivityCard from "../components/activity/ActivityCard";

// Helper distance
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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const routerLocation = useRouterLocation();
  const locationState = useGeoLocation();

  // Pobieramy dane z kontekstu
  const {
    activities: allActivities,
    suggestedActivities,
    isLoading,
    refreshActivities,
    refreshSuggestions,
  } = useActivities();

  // Local state
  const [manualLocation, setManualLocation] = useState<Location | null>(null);
  const [isChoosingLocation, setIsChoosingLocation] = useState(false);
  const [radius, setRadius] = useState<number>(2);
  const [isCustomRadius, setIsCustomRadius] = useState<boolean>(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [isDevMode, setDevMode] = useState<boolean>(false);

  // Stan lokalny dla odświeżania, aby pokazać spinner na przycisku
  const [isRefreshingLocal, setIsRefreshingLocal] = useState(false);

  const currentLocation = useMemo(() => {
    if (manualLocation) return manualLocation;
    return {
      lat: locationState.coordinates?.latitude ?? 52.2297,
      lng: locationState.coordinates?.longitude ?? 21.0122,
    };
  }, [locationState, manualLocation]);

  // Odśwież po powrocie z tworzenia
  useEffect(() => {
    if (routerLocation.state?.refresh) {
      refreshActivities();
    }
  }, [routerLocation.state]);

  // AI Logic
  useEffect(() => {
    if (
      suggestedActivities.length === 0 &&
      !isLoading &&
      user &&
      allActivities.length > 0
    ) {
      refreshSuggestions();
    }
  }, [suggestedActivities.length, isLoading, user, allActivities.length]);

  const handleJoinActivity = async (activityId: number) => {
    if (!user) {
      alert("Musisz być zalogowany!");
      return;
    }
    try {
      const url = `https://kokos-api.grayflower-7f624026.polandcentral.azurecontainerapps.io/api/Events/${activityId}/addUser/${user.id}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "",
      });
      if (!response.ok) throw new Error("Błąd join");
      await refreshActivities();
    } catch (err) {
      console.error(err);
      alert("Błąd dołączania.");
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshingLocal(true);
    await refreshActivities();
    setIsRefreshingLocal(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  // --- SORTOWANIE ---
  const { finalActivitiesList } = useMemo(() => {
    const inRadius = allActivities.filter((a) => {
      if (a.szerokosc === 0 && a.wysokosc === 0) return false;
      return (
        calculateDistance(
          currentLocation.lat,
          currentLocation.lng,
          a.szerokosc,
          a.wysokosc
        ) <= radius
      );
    });

    const active = inRadius.filter((a) => !a.zakonczone);

    const suggestedIds = new Set(suggestedActivities.map((s) => s.id));
    const recommendedList = active.filter((a) => suggestedIds.has(a.id));

    const recommendedWithMeta = recommendedList.map((a) => {
      const meta = suggestedActivities.find((s) => s.id === a.id);
      return { ...a, _isRecommended: true, _aiMeta: meta };
    });

    const others = active.filter((a) => !suggestedIds.has(a.id));

    others.sort((a, b) => {
      const getScore = (act: Activity) => {
        const participation = act.uczestnicy.find((u) => u.id === user?.id);
        if (act.organizator.id === user?.id) return 4; // Moje (admin)
        if (participation?.potwierdzony) return 3; // Dołączono
        if (participation && !participation.potwierdzony) return 2; // Oczekuje
        return 1; // Inne
      };
      return getScore(b) - getScore(a);
    });

    return {
      finalActivitiesList: {
        recommended: recommendedWithMeta,
        others: others,
      },
    };
  }, [allActivities, suggestedActivities, radius, currentLocation, user]);

  // --- RENDER LISTY ---
  const renderListContent = () => {
    if (isLoading && allActivities.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          <p className="font-medium animate-pulse">Ładowanie aktywności...</p>
        </div>
      );
    }

    if (
      finalActivitiesList.recommended.length === 0 &&
      finalActivitiesList.others.length === 0
    ) {
      return (
        <div className="text-center py-10 opacity-80 flex flex-col items-center gap-4">
          <div className="bg-gray-100 p-4 rounded-full">
            <Navigation size={32} className="text-gray-400" />
          </div>
          <div>
            <p className="text-gray-600 font-bold mb-1">
              Brak aktywności w pobliżu
            </p>
            <p className="text-gray-400 text-sm">
              Spróbuj zwiększyć zasięg lub odświeżyć listę.
            </p>
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={isRefreshingLocal}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 transition flex items-center gap-2"
          >
            {isRefreshingLocal ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <RefreshCw size={16} />
            )}
            {isRefreshingLocal ? "Pobieranie..." : "Odśwież aktywności"}
          </button>
        </div>
      );
    }

    return (
      <>
        {/* SEKCJA AI */}
        {finalActivitiesList.recommended.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="text-indigo-600" size={18} />
              <h2 className="text-lg font-black text-indigo-900">
                Proponowane dla Ciebie
              </h2>
            </div>
            <div className="space-y-3">
              {finalActivitiesList.recommended.map((item: any) => (
                <ActivityCard
                  key={item.id}
                  activity={item}
                  currentUserId={user?.id || 0}
                  onSelect={() => setSelectedActivity(item)}
                  onJoin={handleJoinActivity}
                  isFeatured={true}
                />
              ))}
            </div>
          </section>
        )}

        {/* SEKCJA RESZTA */}
        {finalActivitiesList.others.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays className="text-slate-500" size={18} />
              <h2 className="text-lg font-black text-slate-700">
                Wszystkie Aktywności
              </h2>
            </div>
            <div className="space-y-3">
              {finalActivitiesList.others.map((item) => (
                <ActivityCard
                  key={item.id}
                  activity={item}
                  currentUserId={user?.id || 0}
                  onSelect={() => setSelectedActivity(item)}
                  onJoin={handleJoinActivity}
                />
              ))}
            </div>
          </section>
        )}
      </>
    );
  };

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
    setIsChoosingLocation(false);
  };
  const resetLocationToGPS = () => {
    setManualLocation(null);
    setIsChoosingLocation(false);
  };

  if (selectedActivity || isDevMode || isChoosingLocation) {
    return (
      <div className="relative h-screen w-full bg-gray-100 flex flex-col">
        {isChoosingLocation && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-4 animate-fade-in w-[90%] md:w-auto justify-between">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <Crosshair className="text-orange-500 animate-pulse" />
              <span className="text-sm">Wybierz punkt</span>
            </div>
            <button
              onClick={() => setIsChoosingLocation(false)}
              className="bg-gray-100 p-1 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
        )}
        {!isDevMode && !isChoosingLocation && (
          <div className="absolute top-4 left-4 z-[1000]">
            <button
              onClick={() => setSelectedActivity(null)}
              className="bg-white text-slate-800 px-4 py-3 rounded-xl shadow-lg font-bold flex items-center gap-2 hover:bg-gray-50 transition border border-gray-200"
            >
              <ArrowLeft size={20} /> Wróć
            </button>
          </div>
        )}
        {isDevMode && !isChoosingLocation && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-red-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
            TRYB DEWELOPERSKI
          </div>
        )}

        <div className="flex-1 relative">
          <MapView
            userLocation={currentLocation}
            activities={
              isDevMode
                ? allActivities
                : selectedActivity
                ? [selectedActivity]
                : allActivities.filter(
                    (a) =>
                      !a.zakonczone &&
                      calculateDistance(
                        currentLocation.lat,
                        currentLocation.lng,
                        a.szerokosc,
                        a.wysokosc
                      ) <= radius
                  )
            }
            radius={radius}
            mode={isDevMode || isChoosingLocation ? "dev" : "single"}
            selectedActivity={selectedActivity}
            onSelectActivity={setSelectedActivity}
            isSelectingLocation={isChoosingLocation}
            onLocationSelect={handleManualLocationSelect}
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

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col font-sans overflow-hidden">
      <header className="flex-none bg-white shadow-sm z-20 px-4 py-4">
        <div className="max-w-md mx-auto">
          {user && (
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-slate-700">
                <div className="bg-blue-100 p-1.5 rounded-full">
                  <User size={16} className="text-blue-600" />
                </div>
                <span className="text-sm font-bold truncate max-w-[150px]">
                  {user.login}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-red-500 font-medium flex items-center gap-1 hover:bg-red-50 px-2 py-1 rounded transition"
              >
                <LogOut size={14} /> Wyloguj
              </button>
            </div>
          )}
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
              {manualLocation && (
                <button
                  onClick={resetLocationToGPS}
                  className="text-xs bg-blue-50 text-blue-600 px-2 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-blue-100 transition"
                >
                  <RotateCcw size={12} /> GPS
                </button>
              )}
              <button
                onClick={() => setIsChoosingLocation(true)}
                className="text-xs bg-gray-100 text-slate-700 px-2 py-1.5 rounded-lg font-bold hover:bg-gray-200 transition"
              >
                Zmień
              </button>
            </div>
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

      <main className="flex-1 overflow-y-auto p-4 scroll-smooth">
        <div className="max-w-md mx-auto pb-20 space-y-8">
          {renderListContent()}
        </div>
      </main>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        {/* <button
          onClick={() => navigate("/create")}
          className="bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition transform hover:scale-105 flex items-center justify-center"
        >
          <Plus size={32} />
        </button> */}
      </div>
      <div className="fixed bottom-26 right-14 z-50">
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
