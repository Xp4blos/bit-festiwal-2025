import React from "react";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Activity, Location } from "../../types";

interface MapViewProps {
  userLocation: Location;
  activities: Activity[];
  onSelectActivity: (activity: Activity) => void;
}

const MapView: React.FC<MapViewProps> = ({
  userLocation,
  activities,
  onSelectActivity,
}) => {
  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={15}
      scrollWheelZoom={true}
      zoomControl={false}
      className="w-full h-full outline-none"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
        url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
      />

      {/* Strefa Radaru */}
      <Circle
        center={[userLocation.lat, userLocation.lng]}
        radius={800}
        pathOptions={{
          color: "#3b82f6",
          fillColor: "#3b82f6",
          fillOpacity: 0.08,
          weight: 1,
          dashArray: "5, 10",
        }}
      />

      {/* Pozycja Użytkownika */}
      <Circle
        center={[userLocation.lat, userLocation.lng]}
        radius={30}
        pathOptions={{
          color: "#3b82f6",
          fillColor: "#3b82f6",
          fillOpacity: 0.8,
          weight: 0,
        }}
      />

      {/* Markery */}
      {activities.map((activity) => (
        <Marker
          key={activity.id}
          position={[activity.lat, activity.lng]}
          eventHandlers={{
            click: () => onSelectActivity(activity),
          }}
        />
      ))}
    </MapContainer>
  );
};

export default MapView;
