import React from "react";
import { X, Sun, Moon, Eye, Type, RefreshCcw } from "lucide-react";
import { useAccessibility } from "../../context/AccessibilityContext";

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { settings, updateSettings, resetSettings } = useAccessibility();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-end md:items-center justify-center animate-fade-in">
      {/* Kliknięcie w tło zamyka */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="bg-white w-full md:max-w-md md:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden relative z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 p-5 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Eye className="text-blue-400" /> Ułatwienia Dostępu
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 overflow-y-auto">
          {/* 1. Wielkość czcionki */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-700 flex items-center gap-2">
                <Type size={20} /> Wielkość tekstu
              </label>
              <span className="text-blue-600 font-bold">
                {settings.fontSize}%
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs">A</span>
              <input
                type="range"
                min="80"
                max="150"
                step="10"
                value={settings.fontSize}
                onChange={(e) =>
                  updateSettings({ fontSize: Number(e.target.value) })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-xl font-bold">A</span>
            </div>
          </div>

          {/* 3. Wysoki Kontrast */}
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
            <span className="font-bold text-slate-700">
              Zwiększony Kontrast
            </span>
            <button
              onClick={() =>
                updateSettings({ isHighContrast: !settings.isHighContrast })
              }
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
                settings.isHighContrast ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ${
                  settings.isHighContrast ? "translate-x-6" : ""
                }`}
              ></div>
            </button>
          </div>

          {/* 4. Tryb dla Daltonistów */}
          <div className="space-y-3">
            <label className="font-bold text-slate-700 block">
              Tryb dla Daltonistów
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Wyłączony", value: "none" },
                { label: "Protanopia", value: "protanopia" },
                { label: "Deuteranopia", value: "deuteranopia" },
                { label: "Tritanopia", value: "tritanopia" },
                { label: "Monochrom.", value: "achromatopsia" },
              ].map((mode) => (
                <button
                  key={mode.value}
                  onClick={() =>
                    updateSettings({ colorBlindness: mode.value as any })
                  }
                  className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                    settings.colorBlindness === mode.value
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-white text-slate-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex justify-center">
          <button
            onClick={resetSettings}
            className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition text-sm font-medium"
          >
            <RefreshCcw size={16} /> Przywróć domyślne
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
