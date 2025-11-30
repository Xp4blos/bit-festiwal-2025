import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Location } from "../../types";

// Komponent do obsługi kliknięć
const MapEvents = ({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Komponent do centrowania mapy przy pierwszym załadowaniu
const Recenter = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
};

interface LocationPickerProps {
  initialLocation: Location;
  selectedLocation: Location | null;
  onSelect: (lat: number, lng: number) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  initialLocation,
  selectedLocation,
  onSelect,
}) => {
  return (
    <div className="h-64 w-full rounded-xl overflow-hidden border-2 border-slate-200 mt-2 relative z-0">
      <MapContainer
        center={[initialLocation.lat, initialLocation.lng]}
        zoom={13}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png" />

        <Recenter lat={initialLocation.lat} lng={initialLocation.lng} />
        <MapEvents onLocationSelect={onSelect} />

        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
        )}
      </MapContainer>

      {/* Overlay z instrukcją */}
      {!selectedLocation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/10 z-[400]">
          <span className="bg-white/90 px-3 py-1 rounded-lg text-xs font-bold text-slate-600 shadow-sm">
            Kliknij na mapie, aby ustawić lokalizację
          </span>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
