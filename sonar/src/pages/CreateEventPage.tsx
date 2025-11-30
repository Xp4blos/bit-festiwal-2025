import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import type { Location } from "../types";
import { useAuth } from "../context/AuthContext";
import LocationPicker from "../components/create/LocationPicker";
import useGeoLocation from "../hooks/useGeoLocation";

type ActivityCategory =
  | "Sport i aktywność fizyczna"
  | "Edukacja i rozwój"
  | "Zdrowie i lifestyle"
  | "Kultura i rozrywka"
  | "Społeczność i networking"
  | "Kariera i biznes"
  | "Technologie i innowacje";

const CATEGORIES: ActivityCategory[] = [
  "Sport i aktywność fizyczna",
  "Edukacja i rozwój",
  "Zdrowie i lifestyle",
  "Kultura i rozrywka",
  "Społeczność i networking",
  "Kariera i biznes",
  "Technologie i innowacje",
];

const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userGeo = useGeoLocation();

  const defaultCenter = {
    lat: userGeo.coordinates?.latitude ?? 52.2297,
    lng: userGeo.coordinates?.longitude ?? 21.0122,
  };

  const [formData, setFormData] = useState({
    nazwa: "",
    opis: "",
    typ: "Sport i aktywność fizyczna" as ActivityCategory,
    data: "",
    godzina: "",
  });

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  };

  const goBack = () => {
    navigate("/", { state: { refresh: true } });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLocation) {
      setErrorMessage("Musisz zaznaczyć lokalizację wydarzenia na mapie!");
      setSubmitStatus("error");
      return;
    }

    if (!user) {
      setErrorMessage("Brak autoryzacji.");
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const formattedTime = `${formData.godzina}:00`;

      const payload = {
        nazwa: formData.nazwa,
        opis: formData.opis,
        organizatorId: user.id,
        typ: formData.typ,
        data: formData.data,
        godzina: formattedTime,
        wysokosc: selectedLocation.lng,
        szerokosc: selectedLocation.lat,
      };

      // 1. TWORZENIE WYDARZENIA
      const createResponse = await fetch(
        "https://kokos-api.grayflower-7f624026.polandcentral.azurecontainerapps.io/api/Events",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!createResponse.ok) {
        const text = await createResponse.text();
        throw new Error(text || "Błąd tworzenia wydarzenia");
      }

      const createdEvent = await createResponse.json();
      console.log("Utworzono wydarzenie:", createdEvent);

      // 2. AUTOMATYCZNY ZAPIS ORGANIZATORA (AUTO-JOIN)
      // Dzięki temu twórca od razu jest na liście uczestników
      if (createdEvent && createdEvent.id) {
        try {
          const joinUrl = `https://kokos-api.grayflower-7f624026.polandcentral.azurecontainerapps.io/api/Events/${createdEvent.id}/addUser/${user.id}`;
          await fetch(joinUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: "",
          });
          console.log("Organizator został automatycznie dopisany do listy.");
        } catch (joinError) {
          console.warn(
            "Nie udało się automatycznie dopisać organizatora, ale wydarzenie powstało.",
            joinError
          );
        }
      }

      setSubmitStatus("success");
      setTimeout(goBack, 2000);
    } catch (error: any) {
      console.error("Błąd:", error);
      setSubmitStatus("error");
      setErrorMessage(error.message || "Wystąpił błąd.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-green-50 animate-fade-in p-4 text-center font-sans">
        <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center max-w-sm w-full">
          <div className="bg-green-100 p-4 rounded-full mb-4">
            <CheckCircle className="text-green-600 w-12 h-12" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Sukces!</h2>
          <p className="text-slate-500 mb-6">
            Aktywność <strong>"{formData.nazwa}"</strong> została utworzona.
            <br />
            Jesteś jej administratorem.
          </p>
          <button
            onClick={() => navigate("/map")}
            className="w-full bg-slate-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-900 transition"
          >
            Wróć do mapy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white px-4 py-4 shadow-sm sticky top-0 z-50 flex items-center gap-4">
        <button
          onClick={() => navigate("/map")}
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
        >
          <ArrowLeft size={20} className="text-slate-700" />
        </button>
        <h1 className="text-xl font-black text-slate-800">Nowe Wydarzenie</h1>
      </header>

      <main className="flex-1 p-4 max-w-lg mx-auto w-full pb-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Nazwa aktywności
            </label>
            <input
              required
              name="nazwa"
              type="text"
              placeholder="np. Nocne bieganie"
              className="w-full bg-white border border-gray-200 p-4 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={formData.nazwa}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Kategoria
            </label>
            <div className="relative">
              <select
                name="typ"
                className="w-full bg-white border border-gray-200 p-4 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none cursor-pointer"
                value={formData.typ}
                onChange={handleChange}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                ▼
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-1">
                <Calendar size={14} /> Data
              </label>
              <input
                required
                name="data"
                type="date"
                className="w-full bg-white border border-gray-200 p-3 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                value={formData.data}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-1">
                <Clock size={14} /> Godzina
              </label>
              <input
                required
                name="godzina"
                type="time"
                className="w-full bg-white border border-gray-200 p-3 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                value={formData.godzina}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Opis
            </label>
            <textarea
              required
              name="opis"
              rows={3}
              placeholder="Opisz czego dotyczy spotkanie, kogo szukasz..."
              className="w-full bg-white border border-gray-200 p-4 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
              value={formData.opis}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                <MapPin size={14} /> Lokalizacja
              </label>
              {selectedLocation ? (
                <span className="text-green-600 text-xs font-bold flex items-center gap-1">
                  <CheckCircle size={10} /> Wybrano
                </span>
              ) : (
                <span className="text-orange-500 text-xs font-bold animate-pulse">
                  *Wymagane
                </span>
              )}
            </div>

            <LocationPicker
              initialLocation={defaultCenter}
              selectedLocation={selectedLocation}
              onSelect={handleLocationSelect}
            />
          </div>

          {submitStatus === "error" && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-medium flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none mt-4"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save size={20} />
            )}
            {isSubmitting ? "Publikowanie..." : "Stwórz Wydarzenie"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateEventPage;
