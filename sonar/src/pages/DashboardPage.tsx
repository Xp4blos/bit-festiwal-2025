import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  CheckCircle2,
  Hourglass,
  History,
  Sparkles,
  ArrowRight,
  Loader2,
  Search,
  ShieldCheck,
  ClipboardList,
  Navigation, // Ikona do ankiety
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useActivities } from "../context/ActivityContext";
import type { Activity } from "../types";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const {
    activities: allActivities,
    suggestedActivities,
    isLoading,
    refreshSuggestions,
  } = useActivities();

  // --- FILTROWANIE ---
  const { createdEvents, confirmedEvents, pendingEvents, historyEvents } =
    useMemo(() => {
      if (!user)
        return {
          createdEvents: [],
          confirmedEvents: [],
          pendingEvents: [],
          historyEvents: [],
        };

      const created: Activity[] = [];
      const confirmed: Activity[] = [];
      const pending: Activity[] = [];
      const history: Activity[] = [];

      allActivities.forEach((act) => {
        // 1. Czy to moje wydarzenie?
        if (act.organizator.id === user.id) {
          if (act.zakonczone) {
            history.push(act);
          } else {
            created.push(act);
          }
          return;
        }

        // 2. Jeśli nie moje, to czy uczestniczę?
        const participation = act.uczestnicy.find((u) => u.id === user.id);

        if (participation) {
          if (act.zakonczone) {
            history.push(act);
          } else {
            if (participation.potwierdzony) {
              confirmed.push(act);
            } else {
              pending.push(act);
            }
          }
        }
      });

      const sortByDate = (a: Activity, b: Activity) =>
        new Date(a.godzina).getTime() - new Date(b.godzina).getTime();

      const sortByDateDesc = (a: Activity, b: Activity) =>
        new Date(b.godzina).getTime() - new Date(a.godzina).getTime();

      return {
        createdEvents: created.sort(sortByDate),
        confirmedEvents: confirmed.sort(sortByDate),
        pendingEvents: pending.sort(sortByDate),
        historyEvents: history.sort(sortByDateDesc),
      };
    }, [allActivities, user]);

  const handleOpenGoogleMaps = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;
    window.open(url, "_blank");
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("pl-PL", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading && allActivities.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-3">
        <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
        <p className="text-gray-500 font-medium animate-pulse">
          Ładowanie dashboardu...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <header className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
              {user && (
                <p className="text-sm text-gray-500 mt-1">
                  Witaj,{" "}
                  <span className="font-bold text-blue-600">{user.login}</span>!
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium text-sm"
            >
              <LogOut size={18} />
              Wyloguj
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* SEKCJA GŁÓWNYCH AKCJI */}
        <div className="space-y-4">
          {/* Przycisk Mapy */}
          <button
            onClick={() => navigate("/map")}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white p-6 rounded-3xl shadow-xl shadow-slate-200 transition-all transform hover:-translate-y-1 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-slate-800 p-3 rounded-2xl group-hover:bg-slate-700 transition">
                <Search size={32} className="text-blue-400" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold">Przeglądaj Aktywności</h2>
                <p className="text-slate-400 text-sm">
                  Otwórz mapę i znajdź wydarzenia
                </p>
              </div>
            </div>
            <div className="bg-white/10 p-2 rounded-full">
              <ArrowRight size={24} />
            </div>
          </button>

          {/* Przycisk Ankiety */}
          <button
            onClick={() => navigate("/survey")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-6 rounded-3xl shadow-xl shadow-indigo-200 transition-all transform hover:-translate-y-1 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-indigo-500 p-3 rounded-2xl group-hover:bg-indigo-400 transition">
                <ClipboardList size={32} className="text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold">Dostosuj Preferencje</h2>
                <p className="text-indigo-200 text-sm">
                  Wypełnij quiz ponownie, aby ulepszyć AI
                </p>
              </div>
            </div>
            <div className="bg-white/10 p-2 rounded-full">
              <ArrowRight size={24} />
            </div>
          </button>
        </div>

        {/* STATYSTYKI */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-red-50 p-3 rounded-xl text-red-600">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Utworzone</p>
              <p className="text-2xl font-black text-gray-800">
                {createdEvents.length}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-yellow-50 p-3 rounded-xl text-yellow-600">
              <Hourglass size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Oczekiwanie</p>
              <p className="text-2xl font-black text-gray-800">
                {pendingEvents.length}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-green-50 p-3 rounded-xl text-green-600">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Dołączono</p>
              <p className="text-2xl font-black text-gray-800">
                {confirmedEvents.length}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-gray-100 p-3 rounded-xl text-gray-600">
              <History size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Historia</p>
              <p className="text-2xl font-black text-gray-800">
                {historyEvents.length}
              </p>
            </div>
          </div>
        </section>

        {/* AI SUGESTIE */}
        <section className="bg-indigo-50/50 rounded-3xl border border-indigo-100 p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-200">
                <Sparkles className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Rekomendacje Sonar AI
                </h2>
                <p className="text-xs text-indigo-600 font-medium">
                  Na podstawie Twoich preferencji
                </p>
              </div>
            </div>
            <button
              onClick={refreshSuggestions}
              disabled={isLoading}
              className="w-full md:w-auto text-sm font-bold bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-200 px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : null}
              {isLoading ? "Analizowanie..." : "Odśwież propozycje"}
            </button>
          </div>

          {suggestedActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestedActivities.map((activity) => (
                <div
                  key={activity.id}
                  onClick={() => navigate("/")}
                  className="bg-white p-4 rounded-xl border border-indigo-100 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                      {activity.nazwa}
                    </h3>
                    <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded font-bold">
                      {activity.score}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {activity.opis}
                  </p>
                  <div className="text-xs font-medium text-indigo-500 bg-indigo-50 p-2 rounded-lg">
                    💡 {activity.reason}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-indigo-300">
              <p className="text-sm">
                Kliknij przycisk, aby wygenerować propozycje.
              </p>
            </div>
          )}
        </section>

        {/* LISTY WYDARZEŃ (Bez zmian w logice) */}
        {/* 1. OCZEKUJĄCE */}
        <section>
          <div className="flex items-center gap-2 mb-4 px-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <h2 className="text-lg font-black text-gray-800 uppercase tracking-wide">
              Oczekujące na akceptację
            </h2>
          </div>
          {pendingEvents.length === 0 ? (
            <p className="text-sm text-gray-400 px-2">
              Brak oczekujących zgłoszeń.
            </p>
          ) : (
            <div className="space-y-4">
              {pendingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-l-4 border-l-yellow-400 border-gray-100 opacity-90"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-md font-bold text-gray-800">
                        {event.nazwa}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDateTime(event.godzina)}
                      </p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                      <Hourglass size={12} /> Oczekuje
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 2. DOŁĄCZONO */}
        <section>
          <div className="flex items-center gap-2 mb-4 px-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <h2 className="text-lg font-black text-gray-800 uppercase tracking-wide">
              Dołączono
            </h2>
          </div>
          {confirmedEvents.length === 0 ? (
            <p className="text-sm text-gray-400 px-2">
              Brak nadchodzących wydarzeń, w których uczestniczysz.
            </p>
          ) : (
            <div className="space-y-4">
              {confirmedEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-l-4 border-l-green-500 border-gray-100 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {event.nazwa}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDateTime(event.godzina)}
                      </p>
                    </div>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                      <CheckCircle2 size={12} /> Dołączono
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end">
                    <button
                      onClick={() =>
                        handleOpenGoogleMaps(event.szerokosc, event.wysokosc)
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 transition flex items-center gap-2"
                    >
                      <Navigation size={16} />
                      Nawiguj
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 3. UTWORZONE */}
        <section>
          <div className="flex items-center gap-2 mb-4 px-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <h2 className="text-lg font-black text-gray-800 uppercase tracking-wide">
              Utworzone przez Ciebie
            </h2>
          </div>
          {createdEvents.length === 0 ? (
            <p className="text-sm text-gray-400 px-2">
              Nie utworzyłeś jeszcze żadnych wydarzeń.
            </p>
          ) : (
            <div className="space-y-4">
              {createdEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-l-4 border-l-red-500 border-gray-100 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {event.nazwa}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {formatDateTime(event.godzina)}
                      </p>
                    </div>
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                      <ShieldCheck size={12} /> Administrator
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end">
                    <button
                      onClick={() =>
                        handleOpenGoogleMaps(event.szerokosc, event.wysokosc)
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 transition flex items-center gap-2"
                    >
                      <Navigation size={16} />
                      Nawiguj
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 4. HISTORIA */}
        <section>
          <div className="flex items-center gap-2 mb-4 px-2">
            <History size={16} className="text-gray-400" />
            <h2 className="text-lg font-bold text-gray-500 uppercase tracking-wide">
              Historia
            </h2>
          </div>
          {historyEvents.length === 0 ? (
            <p className="text-sm text-gray-400 px-2">Historia pusta.</p>
          ) : (
            <div className="space-y-3">
              {historyEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-gray-100 p-4 rounded-xl border border-gray-200 grayscale opacity-75"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-700">{event.nazwa}</h3>
                    <span className="text-xs font-medium text-gray-500">
                      {formatDateTime(event.godzina)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
