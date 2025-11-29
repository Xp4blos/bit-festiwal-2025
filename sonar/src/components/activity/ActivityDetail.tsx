import React from "react";
import { X, MapPin, Zap } from "lucide-react";
import type { Activity } from "../../types";
import { mockAnalyzeMatch } from "../../services/aiService";

interface ActivityDetailProps {
  activity: Activity;
  onClose: () => void;
}

const ActivityDetail: React.FC<ActivityDetailProps> = ({
  activity,
  onClose,
}) => {
  const aiAnalysis = mockAnalyzeMatch([], activity.desc);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-1 text-gray-900">
          {activity.title}
        </h2>
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
          <MapPin size={16} />
          <span>~200m od Ciebie • {activity.author}</span>
        </div>

        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mb-6 relative">
          <div className="absolute -top-3 left-4 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
            <Zap size={12} /> AI Sugestia
          </div>
          <p className="text-indigo-900 text-sm italic mt-2">
            "{aiAnalysis.icebreaker}"
          </p>
          <button className="mt-3 w-full bg-white border border-indigo-200 text-indigo-700 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition shadow-sm">
            Skopiuj i wyślij na czacie
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="col-span-1 border-2 border-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-50 transition"
          >
            Wróć
          </button>
          <button className="col-span-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            Dołącz
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;
