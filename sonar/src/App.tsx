import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import SurveyPage from "./pages/SurveyPage";
import DashboardPage from "./pages/DashboardPage";
import MapPage from "./pages/MapPage";
import CreateEventPage from "./pages/CreateEventPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout"; // <--- NOWY IMPORT
import { AuthProvider } from "./context/AuthContext";
import { ActivityProvider } from "./context/ActivityContext";
import { setupLeafletIcons } from "./utils/leafletSetup";
import "./App.css";
import EventDetailsPage from "./pages/EventDetailsPage";

setupLeafletIcons();

function App() {
  return (
    <AuthProvider>
      <ActivityProvider>
        <BrowserRouter>
          <Routes>
            {/* Strony bez paska nawigacji */}
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/event/:id/manage"
              element={
                <ProtectedRoute>
                  <EventDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/survey"
              element={
                <ProtectedRoute>
                  <SurveyPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreateEventPageWrapper />
                </ProtectedRoute>
              }
            />

            {/* Strony Z PASKIEM NAWIGACJI (Dashboard i Mapa) */}
            <Route element={<AppLayout />}>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/map"
                element={
                  <ProtectedRoute>
                    <MapPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ActivityProvider>
    </AuthProvider>
  );
}

function CreateEventPageWrapper() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  return <CreateEventPage />;
}

export default App;
