import React, { useState } from "react";
import {
  ArrowRight,
  Calendar,
  Clock,
  Users,
  PlayCircle,
  Sparkles,
  Hourglass,
  CheckCircle2,
  Map,
  Loader2,
  ShieldCheck, // Ikona dla admina
} from "lucide-react";
import type { Activity } from "../../types";

interface ActivityCardProps {
  activity: Activity;
  currentUserId: number;
  onSelect: (activity: Activity) => void;
  onJoin: (activityId: number) => Promise<void>;
  isFeatured?: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  currentUserId,
  onSelect,
  onJoin,
  isFeatured = false,
}) => {
  const [isJoining, setIsJoining] = useState(false);

  const acceptedCount = activity.uczestnicy.filter(
    (u) => u.potwierdzony
  ).length;
  const pendingCount = activity.uczestnicy.filter(
    (u) => !u.potwierdzony
  ).length;

  const displayTime = activity.godzina.includes("T")
    ? activity.godzina.split("T")[1].substring(0, 5)
    : activity.godzina.substring(0, 5);

  const eventDateTime = new Date(activity.godzina);
  const now = new Date();
  const isLive = !activity.zakonczone && eventDateTime <= now;

  // --- LOGIKA STATUSU ---
  const myParticipation = activity.uczestnicy.find(
    (u) => u.id === currentUserId
  );

  // Czy jestem organizatorem?
  const isOrganizer = activity.organizator.id === currentUserId;

  const isPending = myParticipation && !myParticipation.potwierdzony;
  const isConfirmed = myParticipation && myParticipation.potwierdzony;

  const handleJoinClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsJoining(true);
    try {
      await onJoin(activity.id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsJoining(false);
    }
  };

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

        <div className="flex gap-2">
          {/* OPCJA 1: JESTEŚ ORGANIZATOREM (ADMIN) */}
          {isOrganizer && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(activity);
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-red-200 transition"
            >
              <ShieldCheck size={16} /> Administrator
            </button>
          )}

          {/* OPCJA 2: DOŁĄCZONO (ale nie jesteś orgiem) */}
          {!isOrganizer && isConfirmed && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(activity);
              }}
              className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg transition"
            >
              <Map size={16} /> Mapa
            </button>
          )}

          {/* OPCJA 3: OCZEKUJESZ */}
          {!isOrganizer && isPending && (
            <button
              disabled
              className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 cursor-wait"
            >
              <Hourglass size={16} /> Oczekuję...
            </button>
          )}

          {/* OPCJA 4: MOŻESZ DOŁĄCZYĆ */}
          {!isOrganizer && !myParticipation && (
            <button
              onClick={handleJoinClick}
              disabled={activity.zakonczone || isJoining}
              className={`
                 px-5 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 shadow-lg
                 ${
                   activity.zakonczone
                     ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                     : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100"
                 }
               `}
            >
              {isJoining ? (
                <Loader2 size={16} className="animate-spin" />
              ) : null}
              {activity.zakonczone
                ? "Zakończone"
                : isJoining
                ? "Zapisywanie..."
                : "Dołącz"}
              {!activity.zakonczone && !isJoining && <ArrowRight size={16} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
