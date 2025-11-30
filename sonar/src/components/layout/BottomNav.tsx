import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Map, PlusCircle } from "lucide-react";

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Funkcja sprawdzająca, czy dany link jest aktywny
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 px-6 flex items-center justify-between z-[1000] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {/* Przycisk Dashboard */}
      <button
        onClick={() => navigate("/dashboard")}
        className={`flex flex-col items-center justify-center gap-1 w-16 transition-colors ${
          isActive("/dashboard")
            ? "text-blue-600"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <LayoutDashboard
          size={24}
          strokeWidth={isActive("/dashboard") ? 2.5 : 2}
        />
        <span className="text-[10px] font-medium">Start</span>
      </button>

      {/* Środkowy przycisk dodawania (Wystający) */}
      <button
        onClick={() => navigate("/create")}
        className="relative -top-5 bg-blue-600 text-white p-3 rounded-full shadow-lg shadow-blue-200 hover:bg-blue-700 transition transform active:scale-95 border-4 border-gray-50"
      >
        <PlusCircle size={32} />
      </button>

      {/* Przycisk Mapa */}
      <button
        onClick={() => navigate("/map")}
        className={`flex flex-col items-center justify-center gap-1 w-16 transition-colors ${
          isActive("/map")
            ? "text-blue-600"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <Map size={24} strokeWidth={isActive("/map") ? 2.5 : 2} />
        <span className="text-[10px] font-medium">Mapa</span>
      </button>
    </div>
  );
};

export default BottomNav;
