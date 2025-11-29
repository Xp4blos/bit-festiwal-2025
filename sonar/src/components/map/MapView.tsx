import React from "react";
import { MapContainer, TileLayer, Marker, Circle, Popup } from "react-leaflet";
import { Navigation } from "lucide-react";
import "leaflet/dist/leaflet.css";
import type { Activity, Location } from "../../types";

interface MapViewProps {
  userLocation: Location;
  activities: Activity[];
  onSelectActivity: (activity: Activity) => void;
  // Nowe propsy
  radius: number;
  mode: "single" | "dev"; // Tryb działania mapy
  selectedActivity: Activity | null;
}

const MapView: React.FC<MapViewProps> = ({
  userLocation,
  activities,
  onSelectActivity,
  radius,
  mode,
  selectedActivity,
}) => {
  // Funkcja generująca link do Google Maps
  const handleOpenGoogleMaps = (targetLat: number, targetLng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${targetLat},${targetLng}&travelmode=walking`;
    window.open(url, "_blank");
  };

  // Ustalanie środka mapy
  // Jeśli mamy wybraną aktywność (tryb single), centrujemy na niej, w przeciwnym razie na userze
  const mapCenter: [number, number] =
    mode === "single" && selectedActivity
      ? [selectedActivity.lat, selectedActivity.lng]
      : [userLocation.lat, userLocation.lng];

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={mapCenter}
        zoom={mode === "single" ? 16 : 14} // Bliższy zoom dla pojedynczej aktywności
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full outline-none"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
        />

        {/* --- TRYB DEV: Pokaż zasięg radaru --- */}
        {mode === "dev" && (
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={radius * 1000} // radius jest w km, Leaflet chce metry
            pathOptions={{
              color: "#3b82f6",
              fillColor: "#3b82f6",
              fillOpacity: 0.05,
              weight: 1,
              dashArray: "5, 10",
            }}
          />
        )}

        {/* --- ZAWSZE: Pozycja Użytkownika --- */}
        <Circle
          center={[userLocation.lat, userLocation.lng]}
          radius={mode === "single" ? 10 : 30} // Mniejsza kropka w trybie nawigacji
          pathOptions={{
            color: "#10b981", // Zielony dla usera w trybie nawigacji
            fillColor: "#10b981",
            fillOpacity: 0.8,
            weight: 2,
          }}
        >
          <Popup>To Ty</Popup>
        </Circle>

        {/* --- MARKERY --- */}
        {activities.map((activity) => (
          <Marker
            key={activity.id}
            position={[activity.lat, activity.lng]}
            eventHandlers={{
              click: () => onSelectActivity(activity),
            }}
          >
            {/* W trybie single od razu pokazujemy dymek lub custom UI */}
            {mode === "single" && (
              <Popup autoPan={false}>
                <span className="font-bold">{activity.title}</span>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>

      {/* --- UI OVERLAY dla Trybu SINGLE --- */}
      {mode === "single" && selectedActivity && (
        <div className="absolute bottom-8 left-0 right-0 px-4 z-[500] flex justify-center">
          <button
            onClick={() =>
              handleOpenGoogleMaps(selectedActivity.lat, selectedActivity.lng)
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl shadow-xl font-bold flex items-center gap-3 transform transition hover:-translate-y-1 w-full max-w-sm justify-center"
          >
            <Navigation size={24} />
            Nawiguj (Google Maps)
          </button>
        </div>
      )}
    </div>
  );
};

export default MapView;
