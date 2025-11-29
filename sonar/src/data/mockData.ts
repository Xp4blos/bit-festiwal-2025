import type { Activity, Location } from "../types";

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 1,
    lat: 52.2297,
    lng: 21.0122,
    title: "Szybki basket 3vs3",
    desc: "Szukamy 1 osoby do składu. Poziom średni.",
    type: "Sport",
    author: "Marek",
  },
  {
    id: 2,
    lat: 52.232,
    lng: 21.008,
    title: "Nauka Reacta + TS",
    desc: "Code review i wspólna nauka frontend.",
    type: "Nauka",
    author: "Anna",
  },
  {
    id: 3,
    lat: 52.225,
    lng: 21.02,
    title: "Spacer z psami",
    desc: "Idę z moim Goldenem, ktoś dołączy?",
    type: "Relaks",
    author: "Piotr",
  },
  {
    id: 4,
    lat: 52.235,
    lng: 21.018,
    title: "Planszówki w pubie",
    desc: "Gramy w Catan i Terraformację Marsa.",
    type: "Relaks",
    author: "Tomek",
  },
];

export const CURRENT_USER_LOCATION: Location = { lat: 52.229, lng: 21.015 };
