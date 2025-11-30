import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { Navigation } from "lucide-react";
import "leaflet/dist/leaflet.css";
import type { Activity, Location } from "../../types";

// --- KOMPONENTY POMOCNICZE ---

// 1. Obsługa kliknięć w mapę
const LocationSelector = ({
  onSelect,
  isActive,
}: {
  onSelect: (lat: number, lng: number) => void;
  isActive: boolean;
}) => {
  useMapEvents({
    click(e) {
      if (isActive) {
        onSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
};

// 2. Automatyczne przesuwanie mapy przy zmianie lokalizacji
// (Leaflet nie centruje automatycznie po zmianie propsa center w MapContainer, trzeba to wymusić)
const RecenterMap = ({
  lat,
  lng,
  zoom,
}: {
  lat: number;
  lng: number;
  zoom: number;
}) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], zoom, { duration: 1.5 });
  }, [lat, lng, zoom, map]);
  return null;
};

interface MapViewProps {
  userLocation: Location;
  activities: Activity[];
  onSelectActivity: (activity: Activity) => void;
  radius: number;
  mode: "single" | "dev";
  selectedActivity: Activity | null;
  isSelectingLocation?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
}

const MapView: React.FC<MapViewProps> = ({
  userLocation,
  activities,
  onSelectActivity,
  radius,
  mode,
  selectedActivity,
  isSelectingLocation = false,
  onLocationSelect,
}) => {
  const handleOpenGoogleMaps = (targetLat: number, targetLng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${targetLat},${targetLng}&travelmode=walking`;
    window.open(url, "_blank");
  };

  const mapCenter: [number, number] =
    mode === "single" && selectedActivity
      ? [selectedActivity.szerokosc, selectedActivity.wysokosc]
      : [userLocation.lat, userLocation.lng];

  return (
    <div
      className={`w-full h-full relative ${
        isSelectingLocation ? "cursor-crosshair" : ""
      }`}
    >
      <MapContainer
        center={mapCenter}
        zoom={mode === "single" ? 16 : 14}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full outline-none"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
        />

        {/* Helper do przesuwania widoku, gdy zmieni się userLocation */}
        {!selectedActivity && (
          <RecenterMap
            lat={userLocation.lat}
            lng={userLocation.lng}
            zoom={14}
          />
        )}

        {/* Logika klikania w mapę */}
        {onLocationSelect && (
          <LocationSelector
            onSelect={onLocationSelect}
            isActive={isSelectingLocation}
          />
        )}

        {/* --- RADAR (Strefa) --- */}
        {mode === "dev" && (
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={radius * 1000}
            pathOptions={{
              color: isSelectingLocation ? "#f59e0b" : "#3b82f6",
              fillColor: isSelectingLocation ? "#f59e0b" : "#3b82f6",
              fillOpacity: 0.05,
              weight: 1,
              dashArray: "5, 10",
              // KLUCZOWA POPRAWKA:
              // Kiedy wybieramy lokalizację, wyłączamy interakcję z kółkiem,
              // żeby kliknięcie "przeszło" do mapy pod spodem.
              interactive: !isSelectingLocation,
            }}
          />
        )}

        {/* --- POZYCJA UŻYTKOWNIKA --- */}
        <Circle
          center={[userLocation.lat, userLocation.lng]}
          radius={mode === "single" ? 10 : 30}
          pathOptions={{
            color: "white",
            fillColor: isSelectingLocation ? "#f59e0b" : "#10b981",
            fillOpacity: 0.8,
            weight: 2,
            // KLUCZOWA POPRAWKA:
            interactive: !isSelectingLocation,
          }}
        >
          {/* Popup pokazujemy tylko gdy NIE wybieramy lokalizacji */}
          {!isSelectingLocation && <Popup>To Ty</Popup>}
        </Circle>

        {/* --- MARKERY --- */}
        {activities.map((activity) => (
          <Marker
            key={activity.id}
            position={[activity.szerokosc, activity.wysokosc]}
            eventHandlers={{
              click: () => {
                // Zapobiegamy klikaniu w markery podczas wybierania lokalizacji
                if (!isSelectingLocation) {
                  onSelectActivity(activity);
                }
              },
            }}
            // Markery też mogą być "przezroczyste" podczas wyboru, jeśli wolisz:
            // interactive={!isSelectingLocation}
          >
            {mode === "single" && (
              <Popup autoPan={false}>
                <span className="font-bold">{activity.nazwa}</span>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>

      {mode === "single" && selectedActivity && (
        <div className="absolute bottom-8 left-0 right-0 px-4 z-[500] flex justify-center">
          <button
            onClick={() =>
              handleOpenGoogleMaps(
                selectedActivity.szerokosc,
                selectedActivity.wysokosc
              )
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
