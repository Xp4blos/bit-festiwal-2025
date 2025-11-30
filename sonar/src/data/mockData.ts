import type { Activity, Location } from "../types";

export const CURRENT_USER_LOCATION: Location = { lat: 52.2297, lng: 21.0122 };

// Helpery
const formatDate = (date: Date) => date.toISOString().split("T")[0];
// Backend zwraca pełny ISO string dla godziny wg Twojego przykładu
const formatTimeISO = (date: Date) => date.toISOString();

const rawActivitiesSource = [
  {
    id: 1,
    nazwa: "Nocne kodowanie w Pythonie",
    opis: "Szukam pary do nauki Django. Poziom podstawowy/średni. Kawa zapewniona.",
    organizator: {
      id: 12,
      login: "Piotrek",
    },
    typ: "Technologie i innowacje",
    data: "2025-11-30",
    godzina: "2025-11-30T18:00:00.000Z",
    szerokosc: 50.2945, // Gliwice Centrum
    wysokosc: 18.6665,
    zakonczone: false,
    uczestnicy: [
      { id: 101, login: "Ania_Dev", potwierdzony: true },
      { id: 102, login: "Marek123", potwierdzony: false },
    ],
  },
  {
    id: 2,
    nazwa: "Rolki na Pogorii III",
    opis: "Szybkie okrążenie dookoła jeziora. Tempo rekreacyjne, ale bez zatrzymywania.",
    organizator: {
      id: 14,
      login: "Marta",
    },
    typ: "Sport i aktywność fizyczna",
    data: "2025-11-29",
    godzina: "2025-11-29T16:00:00.000Z", // Data dzisiejsza/przeszła, ale nie zakończone = LIVE
    szerokosc: 50.345, // Dąbrowa Górnicza
    wysokosc: 19.208,
    zakonczone: false,
    uczestnicy: [{ id: 201, login: "Rolkarz_PL", potwierdzony: true }],
  },
  {
    id: 3,
    nazwa: "Wymiana książek SF",
    opis: "Spotkajmy się na Rynku, żeby wymienić się starymi książkami Lema i Dukaja.",
    organizator: {
      id: 12,
      login: "Piotrek",
    },
    typ: "Kultura i rozrywka",
    data: "2025-12-01",
    godzina: "2025-12-01T12:00:00.000Z",
    szerokosc: 50.292, // Gliwice Rynek
    wysokosc: 18.668,
    zakonczone: false,
    uczestnicy: [],
  },
  {
    id: 4,
    nazwa: "Joga o wschodzie słońca",
    opis: "Park Sielecki. Weź własną matę. Wstęp wolny.",
    organizator: {
      id: 14,
      login: "Marta",
    },
    typ: "Zdrowie i lifestyle",
    data: "2025-11-28",
    godzina: "2025-11-28T06:00:00.000Z",
    szerokosc: 50.284, // Sosnowiec
    wysokosc: 19.12,
    zakonczone: true, // Wydarzenie minione
    uczestnicy: [
      { id: 301, login: "YogaFan", potwierdzony: true },
      { id: 302, login: "Kasia_88", potwierdzony: true },
    ],
  },
  {
    id: 5,
    nazwa: "Networking Freelancerów",
    opis: "Pracujesz zdalnie? Wpadnij na kawę pogadać o zleceniach i klientach.",
    organizator: {
      id: 12,
      login: "Piotrek",
    },
    typ: "Kariera i biznes",
    data: "2025-12-02",
    godzina: "2025-12-02T10:00:00.000Z",
    szerokosc: 50.297, // Gliwice blisko Politechniki
    wysokosc: 18.67,
    zakonczone: false,
    uczestnicy: [{ id: 401, login: "Grafik_Tom", potwierdzony: true }],
  },
  {
    id: 6,
    nazwa: "Spacer z psami - Będzin",
    opis: "Socjalizacja szczeniaków. Idziemy wzdłuż rzeki.",
    organizator: {
      id: 14,
      login: "Marta",
    },
    typ: "Społeczność i networking",
    data: "2025-11-30",
    godzina: "2025-11-30T14:00:00.000Z",
    szerokosc: 50.325, // Będzin
    wysokosc: 19.13,
    zakonczone: false,
    uczestnicy: [
      { id: 501, login: "DogLover", potwierdzony: true },
      { id: 502, login: "Husky_Max", potwierdzony: false },
      { id: 503, login: "Weterynarz", potwierdzony: true },
    ],
  },
  {
    id: 7,
    nazwa: "Korepetycje z Matmy",
    opis: "Pomogę w macierzach i całkach przed kolokwium na Polsl.",
    organizator: {
      id: 12,
      login: "Piotrek",
    },
    typ: "Edukacja i rozwój",
    data: "2025-12-03",
    godzina: "2025-12-03T17:30:00.000Z",
    szerokosc: 50.291, // Gliwice Kampus
    wysokosc: 18.674,
    zakonczone: false,
    uczestnicy: [{ id: 601, login: "Student1", potwierdzony: true }],
  },
  {
    id: 8,
    nazwa: "Mecz Koszykówki 3x3",
    opis: "Szukamy 2 osób do składu. Poziom amatorski. Hala Arena.",
    organizator: {
      id: 14,
      login: "Marta",
    },
    typ: "Sport i aktywność fizyczna",
    data: "2025-11-29",
    godzina: "2025-11-29T19:00:00.000Z",
    szerokosc: 50.2976, // Gliwice Arena
    wysokosc: 18.704,
    zakonczone: false,
    uczestnicy: [
      { id: 701, login: "BasketMike", potwierdzony: true },
      { id: 702, login: "Jordan23", potwierdzony: false },
    ],
  },
  {
    id: 9,
    nazwa: "Warsztaty Zero Waste",
    opis: "Jak robić woskowijki i nie marnować jedzenia.",
    organizator: {
      id: 12,
      login: "Piotrek",
    },
    typ: "Zdrowie i lifestyle",
    data: "2025-12-05",
    godzina: "2025-12-05T18:00:00.000Z",
    szerokosc: 50.288, // Gliwice
    wysokosc: 18.69,
    zakonczone: false,
    uczestnicy: [{ id: 801, login: "EcoGirl", potwierdzony: true }],
  },
  {
    id: 10,
    nazwa: "Gry planszowe - Strategie",
    opis: "Gramy w Scythe. Tłumaczę zasady. Knurów.",
    organizator: {
      id: 14,
      login: "Marta",
    },
    typ: "Kultura i rozrywka",
    data: "2025-11-30",
    godzina: "2025-11-30T15:00:00.000Z",
    szerokosc: 50.22, // Knurów
    wysokosc: 18.68,
    zakonczone: false,
    uczestnicy: [
      { id: 901, login: "GamerOne", potwierdzony: true },
      { id: 902, login: "DiceRoller", potwierdzony: true },
      { id: 903, login: "Newbie", potwierdzony: false },
    ],
  },
];

// --- KONWERTER NA NOWY FORMAT ---
export const INITIAL_ACTIVITIES: Activity[] = rawActivitiesSource.map(
  (item, index) => {
    const now = new Date();

    // Symulacja czasu
    const isPastTime = Math.random() < 0.3;
    const eventDateObj = new Date(now);

    if (isPastTime) {
      eventDateObj.setMinutes(
        eventDateObj.getMinutes() - Math.floor(Math.random() * 90)
      );
    } else {
      const hoursInFuture = Math.floor(Math.random() * 48) + 1;
      eventDateObj.setHours(eventDateObj.getHours() + hoursInFuture);
    }

    // Generowanie uczestników w nowym formacie
    const participantsCount = Math.floor(Math.random() * 8);
    const uczestnicy = Array.from({ length: participantsCount }, (_, i) => ({
      id: i + 100,
      login: `User${i + 1}`,
      potwierdzony: Math.random() > 0.4, // Część potwierdzona, część nie
    }));

    const isEnded = index % 20 === 0;

    return {
      id: item.id,
      nazwa: item.nazwa,
      opis: item.opis,
      organizator: {
        id: index + 500,
        login: item.organizator.login,
      },
      typ: item.typ,
      data: formatDate(eventDateObj),
      godzina: formatTimeISO(eventDateObj), // Pełny ISO string
      szerokosc: item.szerokosc, // Mapujemy lat -> szerokosc
      wysokosc: item.wysokosc, // Mapujemy lng -> wysokosc
      zakonczone: isEnded,
      uczestnicy: uczestnicy,
    };
  }
);
