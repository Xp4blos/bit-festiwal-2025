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
import EventDetailsPage from "./pages/EventDetailsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import { AuthProvider } from "./context/AuthContext";
import { ActivityProvider } from "./context/ActivityContext";
import { AccessibilityProvider } from "./context/AccessibilityContext"; // <--- NOWY IMPORT
import { setupLeafletIcons } from "./utils/leafletSetup";
import "./App.css";

setupLeafletIcons();

// --- FILTRY SVG DLA DALTONISTÓW ---
// Niewidoczny komponent zawierający definicje macierzy kolorów
const SvgFilters = () => (
  <svg style={{ display: "none" }}>
    <defs>
      <filter id="protanopia-filter">
        <feColorMatrix
          type="matrix"
          values="0.567, 0.433, 0, 0, 0
                  0.558, 0.442, 0, 0, 0
                  0, 0.242, 0.758, 0, 0
                  0, 0, 0, 1, 0"
        />
      </filter>
      <filter id="deuteranopia-filter">
        <feColorMatrix
          type="matrix"
          values="0.625, 0.375, 0, 0, 0
                  0.7, 0.3, 0, 0, 0
                  0, 0.3, 0.7, 0, 0
                  0, 0, 0, 1, 0"
        />
      </filter>
      <filter id="tritanopia-filter">
        <feColorMatrix
          type="matrix"
          values="0.95, 0.05, 0, 0, 0
                  0, 0.433, 0.567, 0, 0
                  0, 0.475, 0.525, 0, 0
                  0, 0, 0, 1, 0"
        />
      </filter>
    </defs>
  </svg>
);

function App() {
  return (
    <AccessibilityProvider>
      {" "}
      {/* <--- OWIJAMY CAŁĄ APPKĘ */}
      <AuthProvider>
        <ActivityProvider>
          <BrowserRouter>
            {/* Wstrzykujemy filtry do DOM */}
            <SvgFilters />

            <Routes>
              <Route path="/auth" element={<AuthPage />} />

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
                <Route
                  path="/event/:id/manage"
                  element={
                    <ProtectedRoute>
                      <EventDetailsPage />
                    </ProtectedRoute>
                  }
                />
              </Route>

              <Route path="/" element={<Navigate to="/auth" replace />} />
              <Route path="*" element={<Navigate to="/auth" replace />} />
            </Routes>
          </BrowserRouter>
        </ActivityProvider>
      </AuthProvider>
    </AccessibilityProvider>
  );
}

function CreateEventPageWrapper() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  return <CreateEventPage />;
}

export default App;
