import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Loader2,
  Check,
  X,
  User,
} from "lucide-react";
import type { Activity, Uczestnik } from "../types";
import { useAuth } from "../context/AuthContext";
import UserOpinionsModal from "../components/modals/UserOpinionsModal";

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // State do modala opinii
  const [selectedUser, setSelectedUser] = useState<{
    id: number;
    login: string;
  } | null>(null);

  // --- FETCH EVENT ---
  const fetchEventDetails = async () => {
    try {
      // Pobieramy wszystkie i filtrujemy, bo API nie ma endpointu GET /Events/{id}
      // Jeśli jednak ma, można zmienić na fetch(`.../api/Events/${id}`)
      const response = await fetch(
        "https://kokos-api.grayflower-7f624026.polandcentral.azurecontainerapps.io/api/Events"
      );
      if (response.ok) {
        const data = await response.json();
        // Szukamy konkretnego wydarzenia (zakładamy że backend zwraca array)
        // Uwaga: id z URL to string, w danych number
        const found = data.find((e: any) => e.id === Number(id));

        if (found) {
          // Mapowanie danych (fix na godzinę)
          const mappedEvent = {
            ...found,
            godzina: found.godzina.includes("T")
              ? found.godzina
              : `${found.data}T${found.godzina}`,
            szerokosc: Number(found.szerokosc),
            wysokosc: Number(found.wysokosc),
          };
          setEvent(mappedEvent);
        } else {
          alert("Nie znaleziono wydarzenia");
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Błąd pobierania szczegółów:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && id) {
      fetchEventDetails();
    }
  }, [id, user]);

  // --- ACTIONS ---

  const handleConfirmUser = async (userId: number) => {
    try {
      const url = `https://kokos-api.grayflower-7f624026.polandcentral.azurecontainerapps.io/api/Events/${id}/confirmUser/${userId}`;
      const response = await fetch(url, { method: "PUT" });

      if (response.ok) {
        // Odśwież dane
        fetchEventDetails();
      } else {
        alert("Błąd podczas akceptacji użytkownika.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveUser = async (userId: number) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tego użytkownika?")) return;

    try {
      const url = `https://kokos-api.grayflower-7f624026.polandcentral.azurecontainerapps.io/api/Events/${id}/removeUser/${userId}`;
      const response = await fetch(url, { method: "DELETE" });

      if (response.ok || response.status === 204) {
        fetchEventDetails();
      } else {
        alert("Błąd podczas usuwania użytkownika.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (!event) return null;

  // Filtrowanie list
  const pendingUsers = event.uczestnicy.filter((u) => !u.potwierdzony);
  const confirmedUsers = event.uczestnicy.filter((u) => u.potwierdzony);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* HEADER */}
      <header className="bg-white px-4 py-4 shadow-sm sticky top-0 z-50 flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
        >
          <ArrowLeft size={20} className="text-slate-700" />
        </button>
        <h1 className="text-lg font-black text-slate-800 truncate">
          Zarządzaj: {event.nazwa}
        </h1>
      </header>

      <main className="max-w-3xl mx-auto p-4 space-y-6">
        {/* INFO O WYDARZENIU */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-2">{event.nazwa}</h2>
          <p className="text-gray-600 text-sm mb-4">{event.opis}</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
            <span className="flex items-center gap-1">
              <Calendar size={16} /> {event.data}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={16} /> {event.typ}
            </span>
          </div>
        </div>

        {/* OCZEKUJĄCY */}
        <section>
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 px-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            Oczekujący na akceptację ({pendingUsers.length})
          </h3>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {pendingUsers.length === 0 ? (
              <p className="p-6 text-center text-gray-400 text-sm">
                Brak nowych zgłoszeń.
              </p>
            ) : (
              <div className="divide-y divide-gray-100">
                {pendingUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 flex items-center justify-between hover:bg-gray-50 transition"
                  >
                    <div
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() =>
                        setSelectedUser({ id: user.id, login: user.login })
                      }
                    >
                      <div className="bg-yellow-100 p-2 rounded-full text-yellow-700 group-hover:bg-yellow-200 transition">
                        <User size={20} />
                      </div>
                      <span className="font-bold text-slate-700 group-hover:text-blue-600 transition">
                        {user.login}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRemoveUser(user.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                        title="Odrzuć"
                      >
                        <X size={20} />
                      </button>
                      <button
                        onClick={() => handleConfirmUser(user.id)}
                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                        title="Akceptuj"
                      >
                        <Check size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ZAAKCEPTOWANI */}
        <section>
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 px-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            Potwierdzeni uczestnicy ({confirmedUsers.length})
          </h3>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {confirmedUsers.length === 0 ? (
              <p className="p-6 text-center text-gray-400 text-sm">
                Jeszcze nikt nie został potwierdzony.
              </p>
            ) : (
              <div className="divide-y divide-gray-100">
                {confirmedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 flex items-center justify-between hover:bg-gray-50 transition"
                  >
                    <div
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() =>
                        setSelectedUser({ id: user.id, login: user.login })
                      }
                    >
                      <div className="bg-green-100 p-2 rounded-full text-green-700 group-hover:bg-green-200 transition">
                        <User size={20} />
                      </div>
                      <span className="font-bold text-slate-700 group-hover:text-blue-600 transition">
                        {user.login}
                      </span>
                    </div>

                    <button
                      onClick={() => handleRemoveUser(user.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition"
                      title="Usuń z wydarzenia"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* MODAL OPINII */}
      {selectedUser && (
        <UserOpinionsModal
          userId={selectedUser.id}
          userName={selectedUser.login}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default EventDetailsPage;
