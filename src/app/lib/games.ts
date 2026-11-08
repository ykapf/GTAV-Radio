export type GameId = "gta-v" | "gta-3" | "vice-city" | "san-andreas" | "gta-4";

export interface Game {
  id: GameId;
  /** Shown in the top bar and the game picker. */
  title: string;
  href: string;
  stationList: string;
  /** Ad breaks are GTA V commercials, so only GTA V has them. */
  ads: boolean;
  /** Where this game remembers its last station. */
  stationKey: string;
}

export const GAMES: Game[] = [
  { id: "gta-v", title: "GTA V Radio", href: "/", stationList: "/radio_list.csv", ads: true, stationKey: "gtav-radio:station" },
  { id: "gta-4", title: "GTA IV Radio", href: "/gta-4", stationList: "/radio_list_gta-4.csv", ads: false, stationKey: "gtav-radio:station:gta-4" },
  {
    id: "san-andreas",
    title: "San Andreas Radio",
    href: "/san-andreas",
    stationList: "/radio_list_san-andreas.csv",
    ads: false,
    stationKey: "gtav-radio:station:san-andreas",
  },
  { id: "vice-city", title: "Vice City Radio", href: "/vice-city", stationList: "/radio_list_vice-city.csv", ads: false, stationKey: "gtav-radio:station:vice-city" },
  { id: "gta-3", title: "GTA III Radio", href: "/gta-3", stationList: "/radio_list_gta-3.csv", ads: false, stationKey: "gtav-radio:station:gta-3" },
];

export const gameById = (id: GameId) => GAMES.find((g) => g.id === id) ?? GAMES[0];
