import React from "react";
import { Users, Search, Plus, X } from "lucide-react";
import type { Activity } from "../../types";
import ActivityCard from "../activity/ActivityCard";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activities: Activity[];
  filterText: string;
  onFilterChange: (text: string) => void;
  onSelectActivity: (activity: Activity) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activities,
  filterText,
  onFilterChange,
  onSelectActivity,
}) => {
  const { user } = useAuth();
  return (
    <aside
      className={`
      fixed inset-y-0 left-0 z-30 w-full md:w-[400px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      md:relative md:translate-x-0 md:shadow-xl border-r border-gray-200
    `}
    >
      {/* Nagłówek */}
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Users size={20} />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              SkillSync
            </h1>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-2 bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Szukaj: np. tenis, react..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
            value={filterText}
            onChange={(e) => onFilterChange(e.target.value)}
          />
        </div>
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto px-6 pb-4 no-scrollbar">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Radar: 2km
          </h2>
          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold">
            LIVE
          </span>
        </div>

        {activities.length > 0 ? (
          activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onSelect={onSelectActivity}
              currentUserId={user?.id || 0}
              onJoin={async () => {}}
              
            />
          ))
        ) : (
          <div className="text-center text-gray-400 py-10">
            <p>Brak aktywności w tym filtrze.</p>
          </div>
        )}
      </div>

      {/* Stopka */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2">
          <Plus size={20} />
          Stwórz Aktywność
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
