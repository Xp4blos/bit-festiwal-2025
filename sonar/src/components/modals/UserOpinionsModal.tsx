import React, { useState, useEffect, useMemo } from "react";
import { X, Star, Send, Loader2, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import type { Opinion } from "../../types";

interface UserOpinionsModalProps {
  userId: number;
  userName: string;
  onClose: () => void;
}

const UserOpinionsModal: React.FC<UserOpinionsModalProps> = ({
  userId,
  userName,
  onClose,
}) => {
  const { user } = useAuth();
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State formularza
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- FETCH OPINIONS ---
  const fetchOpinions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://kokos-api.grayflower-7f624026.polandcentral.azurecontainerapps.io/api/Users/${userId}/opinie`
      );
      if (response.ok) {
        const data = await response.json();
        setOpinions(data);
      }
    } catch (error) {
      console.error("Błąd pobierania opinii:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOpinions();
  }, [userId]);

  // --- ADD OPINION ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const payload = {
        komentarz: newComment,
        rating: newRating,
        autorId: user.id,
      };

      const response = await fetch(
        `https://kokos-api.grayflower-7f624026.polandcentral.azurecontainerapps.io/api/Users/${userId}/opinie`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        setNewComment("");
        setNewRating(10);
        await fetchOpinions(); // Odśwież listę
      } else {
        alert("Nie udało się dodać opinii.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- KALKULACJA ŚREDNIEJ ---
  const averageRating = useMemo(() => {
    if (opinions.length === 0) return 0;
    const sum = opinions.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / opinions.length).toFixed(1);
  }, [opinions]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* HEADER */}
        <div className="bg-slate-900 p-6 flex justify-between items-start text-white">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <User size={20} /> {userName}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center text-yellow-400">
                <Star fill="currentColor" size={16} />
                <span className="ml-1 font-bold text-lg">{averageRating}</span>
                <span className="text-slate-400 text-sm ml-1">/ 10</span>
              </div>
              <span className="text-slate-500 text-sm">
                ({opinions.length} opinii)
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* LISTA OPINII */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-slate-400" />
            </div>
          ) : opinions.length === 0 ? (
            <p className="text-center text-gray-400 py-4">
              Brak opinii o tym użytkowniku.
            </p>
          ) : (
            opinions.map((op) => (
              <div
                key={op.id}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-sm text-slate-700">
                    {op.autor.login}
                  </span>
                  <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <Star size={10} fill="currentColor" /> {op.rating}
                  </span>
                </div>
                <p className="text-sm text-gray-600 italic">"{op.komentarz}"</p>
              </div>
            ))
          )}
        </div>

        {/* FORMULARZ DODAWANIA */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-600">
                Twoja ocena:
              </span>
              <input
                type="number"
                min="1"
                max="10"
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                className="w-16 p-2 border rounded-lg text-center font-bold outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-400">/ 10</span>
            </div>
            <div className="relative">
              <textarea
                placeholder="Napisz opinię..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
                className="w-full p-3 pr-12 border rounded-xl resize-none outline-none focus:ring-2 focus:ring-blue-500 text-sm h-20"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="absolute right-2 bottom-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserOpinionsModal;
