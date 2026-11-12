/** GTA VI launches at local midnight in each country, so the countdown targets the visitor's own midnight. */
export const GTA_VI_RELEASE = { year: 2026, monthIndex: 10, day: 19, label: "November 19" };

/** The three songs in each of Rockstar's station previews, keyed by station name. */
export const GTA_VI_PREVIEWS: Record<string, string[]> = {
  "Cocoteo FM": ["Bad Bunny - EoO", "Axel Rulay feat. Farruko & El Alfa - Si Es Trucho Es Trucho (Remix)", "Romeo Santos & El Chaval de la Bachata - Canalla"],
  "Back Country Radio": [
    "David Allan Coe - Need a Little Time Off for Bad Behavior",
    "Loretta Lynn - Don't Come Home A-Drinkin' (With Lovin' On Your Mind)",
    "Hank Williams Jr. & Waylon Jennings - The Conversation",
  ],
  "AfroBank FM": ["Asake - Joha", "Pat Thomas feat. Ebo Taylor - Gye Wani", "DJ Lag & Robot Boii feat. Kamo Mphela - Shay'sana"],
  "The Chamber 106.6": ["Black Sabbath - I", "Pantera - I'm Broken", "Slayer - Raining Blood"],
  "Flash FM": ["Charli xcx - Good Ones", "MGMT - Electric Feel", "Zara Larsson & PinkPantheress - Midnight Sun (Girls Trip)"],
  "Dirty South Classics": [
    "David Banner feat. Lil' Flip - Like A Pimp",
    "JT Money feat. Solé - Who Dat",
    "DJ Khaled feat. Trick Daddy, Rick Ross & Pitbull - Born N Raised",
  ],
};
