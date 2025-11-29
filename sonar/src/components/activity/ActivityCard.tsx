import React, { useMemo } from "react";
import { BrainCircuit } from "lucide-react";
import type { Activity } from "../../types";
import { mockAnalyzeMatch } from "../../services/aiService";

interface ActivityCardProps {
  activity: Activity;
  onSelect: (activity: Activity) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onSelect }) => {
  const aiAnalysis = useMemo(
    () => mockAnalyzeMatch([], activity.desc),
    [activity.desc]
  );

  return (
    <div
      onClick={() => onSelect(activity)}
      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3 hover:shadow-md transition-all cursor-pointer group hover:border-blue-200"
    >
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
          {activity.title}
        </h3>
        <span className="text-[10px] uppercase font-bold tracking-wider bg-gray-100 text-gray-500 px-2 py-1 rounded">
          {activity.type}
        </span>
      </div>
      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{activity.desc}</p>

      {/* Pasek AI Match */}
      <div className="mt-3 flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 p-2 rounded-lg border border-blue-100">
        <BrainCircuit size={16} className="text-indigo-600 flex-shrink-0" />
        <div className="w-full">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-indigo-700">
              Dopasowanie AI
            </span>
            <span className="text-xs font-bold text-indigo-700">
              {aiAnalysis.score}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${aiAnalysis.score}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
