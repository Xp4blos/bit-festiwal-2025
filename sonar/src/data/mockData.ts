import type { Activity, Location } from "../types";

export const CURRENT_USER_LOCATION: Location = { lat: 52.2297, lng: 21.0122 };

// Helpery
const formatDate = (date: Date) => date.toISOString().split("T")[0];
const formatTime = (date: Date) => date.toTimeString().slice(0, 5);

// Baza danych - 50 aktywności w nowych kategoriach
const rawActivities = [
  // --- TECHNOLOGIE I INNOWACJE ---
  {
    id: 1,
    lat: 52.2297,
    lng: 21.0122,
    title: "Hackathon AI Prep",
    desc: "Burza mózgów przed hackathonem, szukamy backendowca.",
    type: "Technologie i innowacje",
    author: "DevMarek",
  },
  {
    id: 2,
    lat: 52.232,
    lng: 20.98,
    title: "Warsztaty Arduino",
    desc: "Podstawy elektroniki w Fabryce Norblina.",
    type: "Technologie i innowacje",
    author: "RoboClub",
  },
  {
    id: 3,
    lat: 52.245,
    lng: 21.06,
    title: "Spotkanie użytkowników Linuxa",
    desc: "Dyskusja o nowym kernelu, piwo w Koneserze.",
    type: "Technologie i innowacje",
    author: "TuxFan",
  },
  {
    id: 4,
    lat: 52.219,
    lng: 21.015,
    title: "Nauka React Native",
    desc: "Wspólne kodowanie w kawiarni przy Pl. Zbawiciela.",
    type: "Technologie i innowacje",
    author: "FrontendAnna",
  },
  {
    id: 5,
    lat: 52.18,
    lng: 21.0,
    title: "Cybersecurity Talk",
    desc: "Luźne rozmowy o bezpieczeństwie sieci, Mordor.",
    type: "Technologie i innowacje",
    author: "SecOps",
  },
  {
    id: 6,
    lat: 52.25,
    lng: 21.03,
    title: "Drony nad Wisłą",
    desc: "Testowanie nowych dronów FPV (legalna strefa).",
    type: "Technologie i innowacje",
    author: "Pilot",
  },
  {
    id: 7,
    lat: 52.225,
    lng: 21.005,
    title: "Blockchain & Beer",
    desc: "Networking dla entuzjastów krypto.",
    type: "Technologie i innowacje",
    author: "Satoshi",
  },

  // --- SPORT I AKTYWNOŚĆ FIZYCZNA ---
  {
    id: 8,
    lat: 52.21,
    lng: 21.025,
    title: "Bieganie Pole Mokotowskie",
    desc: "Dystans 10km, tempo 5:30.",
    type: "Sport i aktywność fizyczna",
    author: "MarcinBiegacz",
  },
  {
    id: 9,
    lat: 52.239,
    lng: 21.05,
    title: "Siatkówka Plażowa",
    desc: "Plaża Poniatówka, mamy siatkę, brakuje 2 osób.",
    type: "Sport i aktywność fizyczna",
    author: "KasiaVolley",
  },
  {
    id: 10,
    lat: 52.255,
    lng: 20.95,
    title: "Crossfit Wola",
    desc: "Wspólny trening WOD dla początkujących.",
    type: "Sport i aktywność fizyczna",
    author: "TrenerMike",
  },
  {
    id: 11,
    lat: 52.16,
    lng: 21.04,
    title: "Rower MTB Kabaty",
    desc: "Szybka trasa po lesie, 25km.",
    type: "Sport i aktywność fizyczna",
    author: "Rowerzysta",
  },
  {
    id: 12,
    lat: 52.235,
    lng: 21.01,
    title: "Squash Centrum",
    desc: "Szukam sparingpartnera, poziom średni.",
    type: "Sport i aktywność fizyczna",
    author: "Adam",
  },
  {
    id: 13,
    lat: 52.22,
    lng: 21.08,
    title: "Kajaki Jeziorko Kamionkowskie",
    desc: "Relaksacyjne wiosłowanie wieczorem.",
    type: "Sport i aktywność fizyczna",
    author: "Wodniak",
  },
  {
    id: 14,
    lat: 52.27,
    lng: 20.94,
    title: "Joga na trawie",
    desc: "Park Kępa Potocka, weź własną matę.",
    type: "Sport i aktywność fizyczna",
    author: "Joginka",
  },

  // --- KARIERA I BIZNES ---
  {
    id: 15,
    lat: 52.231,
    lng: 21.005,
    title: "Pitch Deck Review",
    desc: "Feedback sesja dla startupów, WeWork.",
    type: "Kariera i biznes",
    author: "InvestorJohn",
  },
  {
    id: 16,
    lat: 52.228,
    lng: 21.015,
    title: "Networking Młodych Przedsiębiorców",
    desc: "Kawa i wymiana wizytówek, Rotunda.",
    type: "Kariera i biznes",
    author: "CEO_Start",
  },
  {
    id: 17,
    lat: 52.19,
    lng: 21.02,
    title: "Mentoring Marketingowy",
    desc: "Szukam mentora od social media, stawiam lunch.",
    type: "Kariera i biznes",
    author: "MarketingJunior",
  },
  {
    id: 18,
    lat: 52.242,
    lng: 20.99,
    title: "Kobiety w Biznesie",
    desc: "Spotkanie motywacyjne, Browary Warszawskie.",
    type: "Kariera i biznes",
    author: "WomenPower",
  },
  {
    id: 19,
    lat: 52.205,
    lng: 21.035,
    title: "Praca w IT - jak zacząć?",
    desc: "Q&A z seniorem, Sadyba.",
    type: "Kariera i biznes",
    author: "Rekruter",
  },
  {
    id: 20,
    lat: 52.233,
    lng: 21.0,
    title: "Coworking w lobby",
    desc: "Wspólna praca w hotelu Marriott, networking.",
    type: "Kariera i biznes",
    author: "Freelancer",
  },
  {
    id: 21,
    lat: 52.17,
    lng: 21.01,
    title: "Sprzedaż B2B - warsztat",
    desc: "Wymiana doświadczeń handlowców.",
    type: "Kariera i biznes",
    author: "SalesPro",
  },

  // --- KULTURA I ROZRYWKA ---
  {
    id: 22,
    lat: 52.222,
    lng: 21.015,
    title: "Planszówki w Paradoxie",
    desc: "Gramy w Terraformację Marsa, brakuje 1 osoby.",
    type: "Kultura i rozrywka",
    author: "GeekBoard",
  },
  {
    id: 23,
    lat: 52.24,
    lng: 21.025,
    title: "Wystawa w Zachęcie",
    desc: "Wspólne zwiedzanie nowej ekspozycji.",
    type: "Kultura i rozrywka",
    author: "ArtLover",
  },
  {
    id: 24,
    lat: 52.235,
    lng: 21.04,
    title: "Koncert Jazzowy na Powiślu",
    desc: "Idziemy grupą do Elektrowni Powiśle.",
    type: "Kultura i rozrywka",
    author: "JazzMan",
  },
  {
    id: 25,
    lat: 52.215,
    lng: 21.005,
    title: "Kino Iluzjon",
    desc: "Stare kino nieme z muzyką na żywo.",
    type: "Kultura i rozrywka",
    author: "Cinefil",
  },
  {
    id: 26,
    lat: 52.252,
    lng: 21.045,
    title: "Stand-up Open Mic",
    desc: "Klub Komediowy, idziemy się pośmiać.",
    type: "Kultura i rozrywka",
    author: "Smieszek",
  },
  {
    id: 27,
    lat: 52.228,
    lng: 20.95,
    title: "Book Club: Sci-Fi",
    desc: "Omawiamy Lema 'Solaris', Wola.",
    type: "Kultura i rozrywka",
    author: "Czytelnik",
  },
  {
    id: 28,
    lat: 52.26,
    lng: 20.98,
    title: "Spacer fotograficzny",
    desc: "Nocne zdjęcia neonów na Żoliborzu.",
    type: "Kultura i rozrywka",
    author: "FotoAmator",
  },

  // --- ZDROWIE I LIFESTYLE ---
  {
    id: 29,
    lat: 52.236,
    lng: 21.005,
    title: "Medytacja Mindfulness",
    desc: "Park Mirowski, wyciszenie po pracy.",
    type: "Zdrowie i lifestyle",
    author: "ZenMaster",
  },
  {
    id: 30,
    lat: 52.212,
    lng: 21.018,
    title: "Warsztaty Zdrowego Żywienia",
    desc: "Gotujemy wege obiad, hala Koszyki.",
    type: "Zdrowie i lifestyle",
    author: "VegeKasia",
  },
  {
    id: 31,
    lat: 52.195,
    lng: 21.05,
    title: "Morsowanie Jeziorko Czerniakowskie",
    desc: "Tylko dla odważnych!",
    type: "Zdrowie i lifestyle",
    author: "IceMan",
  },
  {
    id: 32,
    lat: 52.248,
    lng: 20.99,
    title: "Biohacking Meetup",
    desc: "Optymalizacja snu i suplementacja.",
    type: "Zdrowie i lifestyle",
    author: "BioHacker",
  },
  {
    id: 33,
    lat: 52.225,
    lng: 20.96,
    title: "Spacer leśny (Shinrin-yoku)",
    desc: "Las Młociński (dojazd wspólny).",
    type: "Zdrowie i lifestyle",
    author: "Natura",
  },
  {
    id: 34,
    lat: 52.205,
    lng: 21.015,
    title: "Grupa wsparcia - rzucanie palenia",
    desc: "Spotkanie motywacyjne.",
    type: "Zdrowie i lifestyle",
    author: "Zdrowy",
  },
  {
    id: 35,
    lat: 52.23,
    lng: 21.06,
    title: "Zero Waste Shopping",
    desc: "Spacer po sklepach bez plastiku na Pradze.",
    type: "Zdrowie i lifestyle",
    author: "EcoGirl",
  },

  // --- EDUKACJA I ROZWÓJ ---
  {
    id: 36,
    lat: 52.227,
    lng: 21.012,
    title: "Language Exchange EN/ES",
    desc: "Rozmowy po angielsku i hiszpańsku.",
    type: "Edukacja i rozwój",
    author: "Polyglot",
  },
  {
    id: 37,
    lat: 52.241,
    lng: 21.0,
    title: "Klub Debat Oksfordzkich",
    desc: "Ćwiczymy argumentację, UW.",
    type: "Edukacja i rozwój",
    author: "Speaker",
  },
  {
    id: 38,
    lat: 52.234,
    lng: 21.015,
    title: "Kurs Pierwszej Pomocy",
    desc: "Darmowe szkolenie z RKO.",
    type: "Edukacja i rozwój",
    author: "Ratownik",
  },
  {
    id: 39,
    lat: 52.22,
    lng: 20.98,
    title: "Warsztaty Pisania Kreatywnego",
    desc: "Piszemy krótkie opowiadania.",
    type: "Edukacja i rozwój",
    author: "Pisarz",
  },
  {
    id: 40,
    lat: 52.185,
    lng: 21.025,
    title: "Nauka Gry na Gitarze",
    desc: "Podstawy dla dorosłych, Dom Kultury Kadr.",
    type: "Edukacja i rozwój",
    author: "Muzyk",
  },
  {
    id: 41,
    lat: 52.265,
    lng: 20.96,
    title: "Historia Warszawy",
    desc: "Wykład otwarty o Powstaniu, Cytadela.",
    type: "Edukacja i rozwój",
    author: "Historyk",
  },
  {
    id: 42,
    lat: 52.155,
    lng: 21.05,
    title: "Trening Asertywności",
    desc: "Jak stawiać granice - warsztat psychologiczny.",
    type: "Edukacja i rozwój",
    author: "Coach",
  },

  // --- SPOŁECZNOŚĆ I NETWORKING ---
  {
    id: 43,
    lat: 52.238,
    lng: 21.045,
    title: "Sprzątanie Wisły",
    desc: "Akcja ekologiczna, zapewniamy rękawiczki.",
    type: "Społeczność i networking",
    author: "EcoTeam",
  },
  {
    id: 44,
    lat: 52.21,
    lng: 21.0,
    title: "Expat Meetup Warsaw",
    desc: "Welcome drinks for new residents.",
    type: "Społeczność i networking",
    author: "GlobalCitizen",
  },
  {
    id: 45,
    lat: 52.222,
    lng: 21.03,
    title: "Wolontariat w schronisku",
    desc: "Zbiórka karmy i spacer z psami.",
    type: "Społeczność i networking",
    author: "Pieski",
  },
  {
    id: 46,
    lat: 52.255,
    lng: 21.01,
    title: "Sąsiedzi Starego Miasta",
    desc: "Spotkanie o rewitalizacji podwórka.",
    type: "Społeczność i networking",
    author: "Sasiad",
  },
  {
    id: 47,
    lat: 52.198,
    lng: 21.04,
    title: "Wymiana Roślin",
    desc: "Przynieś szczepkę, weź nową roślinę.",
    type: "Społeczność i networking",
    author: "Monstera",
  },
  {
    id: 48,
    lat: 52.23,
    lng: 20.92,
    title: "Klub Mam Bemowo",
    desc: "Kawa i zabawa dla dzieci.",
    type: "Społeczność i networking",
    author: "Mama",
  },
  {
    id: 49,
    lat: 52.245,
    lng: 21.08,
    title: "Garażówka Sąsiedzka",
    desc: "Grochów, sprzedajemy niepotrzebne rzeczy.",
    type: "Społeczność i networking",
    author: "Zbieracz",
  },
  {
    id: 50,
    lat: 52.2297,
    lng: 21.0122,
    title: "Speed Friending",
    desc: "Szybkie poznawanie nowych znajomych, Centrum.",
    type: "Społeczność i networking",
    author: "Host",
  },
];

export const INITIAL_ACTIVITIES: Activity[] = rawActivities.map(
  (item, index) => {
    const now = new Date();

    // Symulacja czasu: 30% Przeszłość (Live), 70% Przyszłość
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

    const acceptedCount = Math.floor(Math.random() * 8);
    const acceptedParticipants = Array.from(
      { length: acceptedCount },
      (_, i) => `User${i + 1}`
    );
    const pendingCount = Math.floor(Math.random() * 5);
    const pendingParticipants = Array.from(
      { length: pendingCount },
      (_, i) => `Pending${i + 1}`
    );

    // Co 20-te wydarzenie zakończone
    const isEnded = index % 20 === 0;

    return {
      ...item,
      type: item.type as unknown,
      date: formatDate(eventDateObj),
      time: formatTime(eventDateObj),
      acceptedParticipants,
      pendingParticipants,
      isEnded: isEnded,
    };
  }
);
