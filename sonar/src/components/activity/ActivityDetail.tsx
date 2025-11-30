import React from "react";
import {
  ArrowRight,
  Calendar,
  Clock,
  Users,
  PlayCircle,
  Sparkles,
  Hourglass,
  CheckCircle2,
} from "lucide-react";
import type { Activity } from "../../types";

interface ActivityCardProps {
  activity: Activity;
  onSelect: (activity: Activity) => void;
  isFeatured?: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onSelect,
  isFeatured = false,
}) => {
  // Filtrowanie uczestników z tablicy obiektów
  const acceptedCount = activity.uczestnicy.filter(
    (u) => u.potwierdzony
  ).length;
  const pendingCount = activity.uczestnicy.filter(
    (u) => !u.potwierdzony
  ).length;

  // Formatowanie godziny z ISO (wyciągamy HH:MM)
  const displayTime = activity.godzina.includes("T")
    ? activity.godzina.split("T")[1].substring(0, 5)
    : activity.godzina.substring(0, 5);

  // Logika LIVE
  // Łączymy datę i godzinę do porównania
  // Uwaga: activity.godzina to np. "2025-11-29T22:08..." więc new Date() to obsłuży
  const eventDateTime = new Date(activity.godzina);
  const now = new Date();
  const isLive = !activity.zakonczone && eventDateTime <= now;

  return (
    <div
      className={`
        p-5 rounded-2xl shadow-sm border mb-3 transition-all group relative overflow-hidden
        ${
          activity.zakonczone
            ? "bg-gray-100 border-gray-200 opacity-75 grayscale-[0.5]"
            : isFeatured
            ? "bg-gradient-to-br from-indigo-50 to-white border-indigo-200 shadow-indigo-100"
            : isLive
            ? "bg-green-50/40 border-green-200"
            : "bg-white border-gray-100 hover:border-blue-200 hover:shadow-md"
        }
      `}
    >
      {isFeatured && !activity.zakonczone && (
        <div className="absolute top-0 right-0 p-2 opacity-10">
          <Sparkles size={60} className="text-indigo-600" />
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-2 relative z-10">
        <h3
          className={`font-bold text-lg leading-tight ${
            isFeatured ? "text-indigo-900" : "text-slate-800"
          }`}
        >
          {activity.nazwa}
        </h3>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md ${
              isFeatured
                ? "bg-indigo-100 text-indigo-600"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {activity.typ}
          </span>

          {isLive && (
            <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider bg-green-100 text-green-700 px-2 py-1 rounded-md animate-pulse">
              <PlayCircle size={10} /> Trwa
            </span>
          )}

          {activity.zakonczone && (
            <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider bg-gray-200 text-gray-600 px-2 py-1 rounded-md">
              <CheckCircle2 size={10} /> Koniec
            </span>
          )}
        </div>
      </div>

      <p className="text-sm text-slate-500 mb-4 leading-relaxed line-clamp-2 relative z-10">
        {activity.opis}
      </p>

      {/* Info Bar */}
      <div
        className={`flex items-center gap-3 text-xs font-medium mb-4 p-2 rounded-lg relative z-10 ${
          isFeatured ? "bg-white/60" : "bg-slate-50"
        }`}
      >
        <div className="flex items-center gap-3 mr-auto text-slate-600">
          <div className="flex items-center gap-1">
            <Calendar size={14} className="text-blue-500" />
            <span>{activity.data}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-blue-500" />
            <span>{displayTime}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 border-l border-gray-200 pl-3">
          <div
            className="flex items-center gap-1.5"
            title="Zaakceptowani uczestnicy"
          >
            <Users size={14} className="text-slate-500" />
            <span className="text-slate-700 font-bold">{acceptedCount}</span>
          </div>

          {pendingCount > 0 && !activity.zakonczone && (
            <div
              className="flex items-center gap-1.5"
              title="Oczekujący na akceptację"
            >
              <Hourglass size={14} className="text-yellow-500" />
              <span className="text-yellow-600 font-bold">{pendingCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        className={`flex items-center justify-between pt-2 border-t relative z-10 ${
          isFeatured ? "border-indigo-100" : "border-gray-100"
        }`}
      >
        <span className="text-xs font-medium text-gray-400">
          Org:{" "}
          <span className="text-slate-700 font-semibold">
            {activity.organizator.login}
          </span>
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(activity);
          }}
          disabled={activity.zakonczone}
          className={`
            px-5 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 shadow-lg
            ${
              activity.zakonczone
                ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                : isFeatured
                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100"
            }
          `}
        >
          {activity.zakonczone ? "Zakończone" : "Dołącz"}
          {!activity.zakonczone && <ArrowRight size={16} />}
        </button>
      </div>
    </div>
  );
};

export default ActivityCard;
