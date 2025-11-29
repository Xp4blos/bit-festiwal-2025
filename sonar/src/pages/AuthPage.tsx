import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Rejestracja - wysyła dane do API
  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const email = emailRef.current?.value || '';
      const response = await fetch('https://kokos-api.grayflower-7f624026.polandcentral.azurecontainerapps.io/api/Users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: email,
          preferencje: ''
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Zapisz użytkownika w context
        setUser({ 
          id: data.id || Date.now(), 
          login: email, 
          preferencje: data.preferencje || '' 
        });
        
        // Utwórz sesję (mock)
        const sessionToken = `session_${data.id || Date.now()}_${Date.now()}`;
        localStorage.setItem('sessionToken', sessionToken);
        localStorage.setItem('sessionUser', JSON.stringify({
          id: data.id || Date.now(),
          login: email,
          preferencje: data.preferencje || '',
          loginTime: new Date().toISOString()
        }));
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.removeItem('surveyCompleted');
        
        console.log('User registered successfully', data);
        console.log('Session created:', sessionToken);
        navigate('/survey');
      } else {
        console.error('Registration failed:', response.statusText);
        alert('Rejestracja nie powiodła się');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Błąd podczas rejestracji');
    } finally {
      setIsLoading(false);
    }
  };

  // Logowanie - pobiera użytkownika z API po loginie
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const email = emailRef.current?.value || '';
      
      const response = await fetch('https://kokos-api.grayflower-7f624026.polandcentral.azurecontainerapps.io/api/Users/bylogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: email
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Zapisz użytkownika w context
        setUser({ 
          id: data.id, 
          login: data.login, 
          preferencje: data.preferencje || '' 
        });
        
        // Utwórz sesję (mock)
        const sessionToken = `session_${data.id}_${Date.now()}`;
        localStorage.setItem('sessionToken', sessionToken);
        localStorage.setItem('sessionUser', JSON.stringify({
          id: data.id,
          login: data.login,
          preferencje: data.preferencje || '',
          loginTime: new Date().toISOString()
        }));
        localStorage.setItem('isAuthenticated', 'true');
        
        // Jeśli użytkownik już wypełnił ankietę, zapisz preferencje
        if (data.preferencje && data.preferencje.trim() !== '') {
          localStorage.setItem('userPreferencesString', data.preferencje);
          localStorage.setItem('surveyCompleted', 'true');
        }
        
        console.log('User logged in successfully', data);
        console.log('Session created:', sessionToken);
        // Zawsze idź do dashboard przy logowaniu
        navigate('/dashboard');
      } else if (response.status === 404) {
        console.error('User not found');
        alert('Użytkownik nie istnieje. Proszę się zarejestrować.');
      } else {
        console.error('Login failed:', response.statusText);
        alert('Logowanie nie powiodło się');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Błąd podczas logowania');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin(e);
    } else {
      handleRegistration(e);
    }
  };  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {isLogin ? 'Zaloguj się' : 'Zarejestruj się'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Email</label>
            <input
              ref={emailRef}
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="twoj@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Hasło</label>
            <input
              ref={passwordRef}
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Przetwarzanie...' : (isLogin ? 'Zaloguj' : 'Zarejestruj')}
          </button>
        </form>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          {isLogin ? 'Nie masz konta? Zarejestruj się' : 'Masz konto? Zaloguj się'}
        </button>
      </div>
    </div>
  );
}
