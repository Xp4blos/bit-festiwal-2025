import type { Activity, Location } from "../types";

export const CURRENT_USER_LOCATION: Location = { lat: 52.2297, lng: 21.0122 };

// Helper do generowania daty (dzisiaj/jutro)
const getFutureDate = (daysToAdd: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
};

// Baza danych (tytuły i lokacje z poprzedniego kroku)
const rawActivities = [
  // --- ŚRÓDMIEŚCIE ---
  {
    id: 1,
    lat: 52.231,
    lng: 21.006,
    title: "Szybki basket 3vs3",
    desc: "Szukamy 1 osoby do składu. Poziom średni.",
    type: "Sport",
    author: "Marek",
  },
  {
    id: 2,
    lat: 52.225,
    lng: 21.011,
    title: "Nauka Reacta + TS",
    desc: "Code review i wspólna nauka frontend.",
    type: "Nauka",
    author: "Anna",
  },
  {
    id: 3,
    lat: 52.235,
    lng: 21.025,
    title: "Spacer z psami - Bulwary",
    desc: "Idę z moim Goldenem wzdłuż Wisły.",
    type: "Relaks",
    author: "Piotr",
  },
  {
    id: 4,
    lat: 52.222,
    lng: 21.015,
    title: "Planszówki w Paradoxie",
    desc: "Gramy w Catan. Szukamy 2 osób.",
    type: "Relaks",
    author: "Tomek",
  },
  {
    id: 5,
    lat: 52.23,
    lng: 21.02,
    title: "Joga w plenerze",
    desc: "Park Świętokrzyski, darmowa sesja.",
    type: "Sport",
    author: "Kasia",
  },
  {
    id: 6,
    lat: 52.228,
    lng: 21.0,
    title: "Wspólne bieganie 5km",
    desc: "Tempo 5:30, start Centralny.",
    type: "Sport",
    author: "Marcin",
  },
  {
    id: 7,
    lat: 52.237,
    lng: 21.018,
    title: "Konwersacje po hiszpańsku",
    desc: "Luźne rozmowy, poziom B1.",
    type: "Nauka",
    author: "Elena",
  },
  {
    id: 8,
    lat: 52.219,
    lng: 21.012,
    title: "Fotografia uliczna",
    desc: "Spacer z aparatem.",
    type: "Relaks",
    author: "Jan",
  },
  {
    id: 9,
    lat: 52.233,
    lng: 21.002,
    title: "Szachy w parku",
    desc: "Ogród Saski, szukam rywala.",
    type: "Nauka",
    author: "Wiesław",
  },
  {
    id: 10,
    lat: 52.226,
    lng: 21.03,
    title: "Rowerem wzdłuż Wisły",
    desc: "Trasa 20km.",
    type: "Sport",
    author: "Robert",
  },

  // --- MOKOTÓW ---
  {
    id: 11,
    lat: 52.2,
    lng: 21.025,
    title: "Tenis na Warszawiance",
    desc: "Mam kort, szukam partnera.",
    type: "Sport",
    author: "Adam",
  },
  {
    id: 12,
    lat: 52.195,
    lng: 21.01,
    title: "Kawa i praca zdalna",
    desc: "Co-working Wierzbno.",
    type: "Nauka",
    author: "Zosia",
  },
  {
    id: 13,
    lat: 52.205,
    lng: 21.005,
    title: "Spacer Pola Mokotowskie",
    desc: "Długi spacer.",
    type: "Relaks",
    author: "Magda",
  },
  {
    id: 14,
    lat: 52.189,
    lng: 21.03,
    title: "Squash Sadyba",
    desc: "Szukam na 1h grania.",
    type: "Sport",
    author: "Patryk",
  },
  {
    id: 15,
    lat: 52.198,
    lng: 21.015,
    title: "Klub książki",
    desc: "Omawiamy kryminały.",
    type: "Relaks",
    author: "Ewa",
  },
  {
    id: 16,
    lat: 52.18,
    lng: 21.0,
    title: "Siłownia Calypso",
    desc: "Trening klatki.",
    type: "Sport",
    author: "Darek",
  },
  {
    id: 17,
    lat: 52.21,
    lng: 21.02,
    title: "Rolki na Polu",
    desc: "Nauka jazdy.",
    type: "Sport",
    author: "Monika",
  },
  {
    id: 18,
    lat: 52.192,
    lng: 21.04,
    title: "Warsztaty ceramiki",
    desc: "Szukam towarzystwa.",
    type: "Relaks",
    author: "Ola",
  },

  // --- PRAGA ---
  {
    id: 19,
    lat: 52.25,
    lng: 21.04,
    title: "Zwiedzanie Pragi",
    desc: "Spacer z przewodnikiem.",
    type: "Relaks",
    author: "Krzysztof",
  },
  {
    id: 20,
    lat: 52.24,
    lng: 21.05,
    title: "Piłka nożna Orlik",
    desc: "Park Skaryszewski, brakuje 2 os.",
    type: "Sport",
    author: "Sebastian",
  },
  {
    id: 21,
    lat: 52.245,
    lng: 21.035,
    title: "Ognisko Poniatówka",
    desc: "Gitara i kiełbaski.",
    type: "Relaks",
    author: "Studenci",
  },
  {
    id: 22,
    lat: 52.238,
    lng: 21.06,
    title: "Nauka Pythona",
    desc: "Wspólne kodowanie.",
    type: "Nauka",
    author: "Michał",
  },
  {
    id: 23,
    lat: 52.255,
    lng: 21.03,
    title: "Wyjście do ZOO",
    desc: "Idę z dziećmi.",
    type: "Inne",
    author: "Agnieszka",
  },
  {
    id: 24,
    lat: 52.242,
    lng: 21.08,
    title: "Szukanie mieszkania",
    desc: "Spacer Grochów.",
    type: "Inne",
    author: "Student",
  },

  // --- WOLA ---
  {
    id: 25,
    lat: 52.235,
    lng: 20.98,
    title: "Basen Delfin",
    desc: "Pływanie 7:00 rano.",
    type: "Sport",
    author: "Jacek",
  },
  {
    id: 26,
    lat: 52.24,
    lng: 20.96,
    title: "Bieganie Moczydło",
    desc: "Trening 10km.",
    type: "Sport",
    author: "Ania",
  },
  {
    id: 27,
    lat: 52.23,
    lng: 20.95,
    title: "Spacer z wózkiem",
    desc: "Park Szymańskiego.",
    type: "Relaks",
    author: "Mama_Jasia",
  },
  {
    id: 28,
    lat: 52.225,
    lng: 20.97,
    title: "Nauka Excela",
    desc: "Pomoc z tabelami.",
    type: "Nauka",
    author: "Bartek",
  },
  {
    id: 29,
    lat: 52.245,
    lng: 20.92,
    title: "Rowerowe Bemowo",
    desc: "Puszcza Kampinoska.",
    type: "Sport",
    author: "Klub",
  },

  // --- ŻOLIBORZ / BIELANY ---
  {
    id: 30,
    lat: 52.265,
    lng: 20.98,
    title: "Targ śniadaniowy",
    desc: "Wspólne jedzenie.",
    type: "Relaks",
    author: "Smakosz",
  },
  {
    id: 31,
    lat: 52.27,
    lng: 20.96,
    title: "Joga Kępa Potocka",
    desc: "Relaks przy kanale.",
    type: "Sport",
    author: "Guru",
  },
  {
    id: 32,
    lat: 52.28,
    lng: 20.94,
    title: "Las Bielański",
    desc: "Marsz 2h.",
    type: "Sport",
    author: "Senior",
  },
  {
    id: 33,
    lat: 52.26,
    lng: 20.97,
    title: "Kino Wisła",
    desc: "Nowy Tarantino.",
    type: "Relaks",
    author: "KinoMan",
  },

  // --- URSYNÓW / WILANÓW ---
  {
    id: 34,
    lat: 52.14,
    lng: 21.05,
    title: "Górka Kazurka MTB",
    desc: "Zjazdy rowerowe.",
    type: "Sport",
    author: "Rider",
  },
  {
    id: 35,
    lat: 52.16,
    lng: 21.03,
    title: "Bieganie Kabaty",
    desc: "Las Kabacki.",
    type: "Sport",
    author: "Biegacz",
  },
  {
    id: 36,
    lat: 52.165,
    lng: 21.08,
    title: "Pałac Wilanów",
    desc: "Niedzielny spacer.",
    type: "Relaks",
    author: "Turystka",
  },
  {
    id: 37,
    lat: 52.15,
    lng: 21.04,
    title: "Multikino Horror",
    desc: "Maraton filmowy.",
    type: "Relaks",
    author: "Fan",
  },

  // --- POZOSTAŁE ---
  {
    id: 38,
    lat: 52.22,
    lng: 20.9,
    title: "Giełda Koło",
    desc: "Szukam staroci.",
    type: "Inne",
    author: "Kolekcjoner",
  },
  {
    id: 39,
    lat: 52.21,
    lng: 21.1,
    title: "Kajaki Wawer",
    desc: "Spływ Świdrem.",
    type: "Sport",
    author: "Wodniak",
  },
  {
    id: 40,
    lat: 52.232,
    lng: 20.99,
    title: "Pizza Nocą",
    desc: "Gastrofaza.",
    type: "Relaks",
    author: "Głodny",
  },
  {
    id: 41,
    lat: 52.2285,
    lng: 21.0135,
    title: "Deskorolka PKiN",
    desc: "Nauka jazdy.",
    type: "Sport",
    author: "Skater",
  },
  {
    id: 42,
    lat: 52.2315,
    lng: 21.0095,
    title: "Wymiana językowa",
    desc: "PL-UA.",
    type: "Nauka",
    author: "Olena",
  },
  {
    id: 43,
    lat: 52.227,
    lng: 21.018,
    title: "Przeprowadzka",
    desc: "Pomoc w noszeniu.",
    type: "Inne",
    author: "Nowy",
  },
  {
    id: 44,
    lat: 52.234,
    lng: 21.022,
    title: "Murale Tour",
    desc: "Street art w centrum.",
    type: "Relaks",
    author: "Art",
  },
  {
    id: 45,
    lat: 52.22,
    lng: 21.01,
    title: "Robotyka PW",
    desc: "Arduino.",
    type: "Nauka",
    author: "StudentPW",
  },
  {
    id: 46,
    lat: 52.215,
    lng: 20.98,
    title: "Badminton",
    desc: "Hala OSiR.",
    type: "Sport",
    author: "Kometka",
  },
  {
    id: 47,
    lat: 52.25,
    lng: 21.0,
    title: "Powązki",
    desc: "Spacer historyczny.",
    type: "Relaks",
    author: "Historyk",
  },
  {
    id: 48,
    lat: 52.24,
    lng: 21.02,
    title: "Ścianka Murall",
    desc: "Szukam asekuracji.",
    type: "Sport",
    author: "Climber",
  },
  {
    id: 49,
    lat: 52.228,
    lng: 21.015,
    title: "Piwo Pawilony",
    desc: "Integracja IT.",
    type: "Relaks",
    author: "DevOps",
  },
  {
    id: 50,
    lat: 52.236,
    lng: 21.005,
    title: "Medytacja",
    desc: "Park Mirowski.",
    type: "Relaks",
    author: "Zen",
  },
];

// Mieszamy dane i dodajemy nowe pola
export const INITIAL_ACTIVITIES: Activity[] = rawActivities.map(
  (item, index) => {
    // Losowe daty
    const daysOffset = Math.floor(Math.random() * 3);
    const hour = Math.floor(Math.random() * 12) + 8; // 8:00 - 20:00
    const minute = Math.random() > 0.5 ? "00" : "30";

    // Symulacja uczestników (Zaakceptowani)
    const acceptedCount = Math.floor(Math.random() * 6); // 0-5 osób
    const acceptedParticipants = Array.from(
      { length: acceptedCount },
      (_, i) => `User${i + 1}`
    );

    // Symulacja uczestników (Oczekujący)
    const pendingCount = Math.floor(Math.random() * 4); // 0-3 osoby
    const pendingParticipants = Array.from(
      { length: pendingCount },
      (_, i) => `Pending${i + 1}`
    );

    // Co 10-te wydarzenie jest już rozpoczęte
    const isStarted = index % 10 === 0;

    // Ustalamy, czy wydarzenie się zakończyło (jeżeli już się rozpoczęło, losowo część może być zakończona)
    const isEnded = isStarted ? Math.random() > 0.5 : false;

    return {
      ...item,
      type: item.type as Activity["type"],
      date: getFutureDate(daysOffset),
      time: `${hour}:${minute}`,
      acceptedParticipants: acceptedParticipants,
      pendingParticipants: pendingParticipants, // Dodajemy wygenerowanych oczekujących
      isStarted: isStarted,
      isEnded: isEnded,
    };
  }
);
