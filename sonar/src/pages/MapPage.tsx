import React, { useState } from "react";
import { Users } from "lucide-react";
import type { Activity } from "../types";
import { INITIAL_ACTIVITIES, CURRENT_USER_LOCATION } from "../data/mockData";

// Komponenty
import Sidebar from "../components/layout/Sidebar";
import MapView from "../components/map/MapView";
import ActivityDetail from "../components/activity/ActivityDetail";

const MapPage: React.FC = () => {
  // Stan
  const [activities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [filterText, setFilterText] = useState<string>("");

  // Logika filtrowania
  const filteredActivities = activities.filter(
    (a) =>
      a.title.toLowerCase().includes(filterText.toLowerCase()) ||
      a.type.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleSelectActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    // Na mobile zamykamy sidebar po kliknięciu
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activities={filteredActivities}
        filterText={filterText}
        onFilterChange={setFilterText}
        onSelectActivity={handleSelectActivity}
      />

      <main className="flex-1 relative h-full w-full">
        {/* Przycisk otwierania menu na mobile */}
        {!isSidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-4 left-4 z-[1000] bg-white p-3 rounded-xl shadow-lg text-slate-800 hover:text-blue-600 transition"
          >
            <Users size={24} />
          </button>
        )}

        <MapView
          userLocation={CURRENT_USER_LOCATION}
          activities={activities}
          onSelectActivity={handleSelectActivity}
        />
      </main>

      {selectedActivity && (
        <ActivityDetail
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      )}
    </div>
  );
};

export default MapPage;
