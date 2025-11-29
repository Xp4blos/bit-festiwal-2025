import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, LogOut, BarChart3, Users, Calendar, TrendingUp } from 'lucide-react';
import { sendPromptToGemini, analyzeMatchWithAI } from '../services/aiService';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
//   const [todos, setTodos] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchTodos = async () => {
//       try {
//         const response = await fetch('https://kokos-api.grayflower-7f624026.polandcentral.azurecontainerapps.io/api/todos');
//         const data = await response.json();
//         setTodos(data);
//         console.log('Fetched todos:', data);
//       } catch (error) {
//         console.error('Error fetching todos:', error);
//       }
//     };

//     fetchTodos();
//   }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/auth');
  };

  const stats = [
    { label: 'Aktywne Wydarzenia', value: '12', icon: Calendar, color: 'bg-blue-500' },
    { label: 'Uczestnicy', value: '248', icon: Users, color: 'bg-green-500' },
    { label: 'Odwiedziny', value: '1.2k', icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'Lokalizacje', value: '8', icon: Map, color: 'bg-orange-500' },
  ];

  const handleGeminiTest = async () => {
    setIsLoading(true);
    try {
      // Prosty test - wysłanie promptu
      const response = await sendPromptToGemini("Napisz krótką wiadomość powitalną dla użytkownika aplikacji społecznościowej.");
      setAiResponse(response);
      console.log("Gemini response:", response);

      // Test analizy dopasowania
      const analysis = await analyzeMatchWithAI(
        ["sport", "programowanie", "muzyka"],
        "Hackathon programistyczny z elementami gamifikacji",
        "Tech Event"
      );
      console.log("Match analysis:", analysis);
    } catch (error) {
      console.error("Error:", error);
      setAiResponse(`Błąd: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Wyloguj</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>



        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate('/map')}
            className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all hover:scale-105 group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 p-4 rounded-lg group-hover:bg-blue-600 transition-colors">
                <Map className="text-white" size={32} />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Mapa Wydarzeń</h3>
                <p className="text-gray-600">Przejdź do interaktywnej mapy z aktywnościami</p>
              </div>
            </div>
          </button>

          <button className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all hover:scale-105 group">
            <div className="flex items-center gap-4">
              <div className="bg-purple-500 p-4 rounded-lg group-hover:bg-purple-600 transition-colors">
                <BarChart3 className="text-white" size={32} />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Statystyki</h3>
                <p className="text-gray-600">Zobacz szczegółowe analizy i raporty</p>
              </div>
            </div>
          </button>

          <button 
            className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all hover:scale-105 group disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleGeminiTest}
            disabled={isLoading}
          >
            <div className="flex items-center gap-4">
              <div className="bg-green-500 p-4 rounded-lg group-hover:bg-green-600 transition-colors">
                <BarChart3 className="text-white" size={32} />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {isLoading ? 'Testowanie...' : 'Test Gemini AI'}
                </h3>
                <p className="text-gray-600">
                  {aiResponse ? aiResponse.substring(0, 50) + '...' : 'Kliknij aby przetestować API'}
                </p>
              </div>
            </div>
          </button>

        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ostatnia Aktywność</h2>
          <div className="space-y-4">
            {[
              { title: 'Nowe wydarzenie dodane', time: '5 min temu', type: 'success' },
              { title: 'Użytkownik dołączył do wydarzenia', time: '12 min temu', type: 'info' },
              { title: 'Aktualizacja lokalizacji', time: '1 godz. temu', type: 'warning' },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === 'success'
                        ? 'bg-green-500'
                        : activity.type === 'info'
                        ? 'bg-blue-500'
                        : 'bg-yellow-500'
                    }`}
                  />
                  <span className="text-gray-900">{activity.title}</span>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
