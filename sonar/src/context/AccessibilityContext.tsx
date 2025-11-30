import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

type ColorBlindnessMode =
  | "none"
  | "protanopia"
  | "deuteranopia"
  | "tritanopia"
  | "achromatopsia";

interface AccessibilitySettings {
  fontSize: number; // Procentowa wielkość (domyślnie 100)
  isDarkMode: boolean;
  isHighContrast: boolean;
  colorBlindness: ColorBlindnessMode;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  isDarkMode: false,
  isHighContrast: false,
  colorBlindness: "none",
};

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

export const AccessibilityProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // Pobierz ustawienia z localStorage lub użyj domyślnych
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem("wcag-settings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem("wcag-settings", JSON.stringify(updated));
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem("wcag-settings", JSON.stringify(defaultSettings));
  };

  // --- EFEKTY WIZUALNE (Aplikowanie stylów do DOM) ---
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // 1. Font Size (Zmieniamy font-size na root, co skaluje jednostki 'rem' w Tailwind)
    // Domyślny font w przeglądarce to zazwyczaj 16px. 100% = 16px.
    html.style.fontSize = `${settings.fontSize}%`;

    // 2. Dark Mode
    if (settings.isDarkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }

    // 3. High Contrast & Color Blindness
    // Czyścimy poprzednie klasy filtrów
    body.classList.remove(
      "wcag-high-contrast",
      "wcag-protanopia",
      "wcag-deuteranopia",
      "wcag-tritanopia",
      "wcag-achromatopsia"
    );

    if (settings.isHighContrast) {
      body.classList.add("wcag-high-contrast");
    }

    if (settings.colorBlindness !== "none") {
      body.classList.add(`wcag-${settings.colorBlindness}`);
    }
  }, [settings]);

  return (
    <AccessibilityContext.Provider
      value={{ settings, updateSettings, resetSettings }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context)
    throw new Error(
      "useAccessibility must be used within AccessibilityProvider"
    );
  return context;
};
