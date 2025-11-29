import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, LogOut, BarChart3, Users, Calendar, TrendingUp, Sparkles } from 'lucide-react';
import { getSuggestedActivities } from '../services/aiService';
import { useAuth } from '../context/AuthContext';
import type { SuggestedActivity } from '../types';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [suggestedActivities, setSuggestedActivities] = useState<SuggestedActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [todos, setTodos] = useState<any[]>([]);

useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await fetch('https://kokos-api.grayflower-7f624026.polandcentral.azurecontainerapps.io/api/Users/10', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: 'twojLogin',
          preferencje: 'twojePreferencje'
        }),
      });

      const text = await response.text();
      if (text) {
        const data = JSON.parse(text);
        setTodos(data);
        console.log('Fetched user:', data);
      } else {
        setTodos([]);
        console.log('No content returned from API');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  fetchUser();
}, []);


  const handleSuggestActivities = async () => {
    setIsLoading(true);
    try {
      const activities = await getSuggestedActivities(user?.id);
      setSuggestedActivities(activities);
      console.log('Loaded suggested activities:', activities);
    } catch (error) {
      console.error('Error loading suggested activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const stats = [
    { label: 'Aktywne Wydarzenia', value: '12', icon: Calendar, color: 'bg-blue-500' },
    { label: 'Uczestnicy', value: '248', icon: Users, color: 'bg-green-500' },
    { label: 'Odwiedziny', value: '1.2k', icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'Lokalizacje', value: '8', icon: Map, color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              {user && <p className="text-sm text-gray-600 mt-1">Zalogowany jako: <span className="font-semibold">{user.login}</span></p>}
            </div>
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
            className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all hover:scale-105 group"
            onClick={() => navigate('/survey')}
          >
            <div className="flex items-center gap-4">
              <div className="bg-green-500 p-4 rounded-lg group-hover:bg-green-600 transition-colors">
                <Sparkles className="text-white" size={32} />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Wypełnij ankietę</h3>
                <p className="text-gray-600">Zaktualizuj swoje preferencje i zainteresowania</p>
              </div>
            </div>
          </button>

        </div>

        {/* Suggested Activities */}

        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-indigo-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Sugerowane dla Ciebie</h2>
            <button
              onClick={handleSuggestActivities}
              className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Ładowanie...' : 'Pokaż sugerowane aktywności'}
            </button>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : suggestedActivities.length > 0 ? (
            <div className="space-y-4">
              {suggestedActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate('/map')}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{activity.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{activity.desc}</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                          {activity.type}
                        </span>
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          {activity.date} {activity.time}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-2xl font-bold text-indigo-600">{activity.score}</div>
                      <div className="text-xs text-gray-500">dopasowanie</div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-semibold">Powód:</span> {activity.reason}
                    </p>
                    <p className="text-sm text-indigo-600 italic">
                      💬 {activity.icebreaker}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Brak sugerowanych aktywności. Wypełnij ankietę, aby otrzymać personalizowane rekomendacje!</p>
              <button
                onClick={() => navigate('/survey')}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Wypełnij ankietę
              </button>
            </div>
          )}
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
