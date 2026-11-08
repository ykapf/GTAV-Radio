import type { Track } from "../broadcast";

/** GTA III stations' songs and talk segments, keyed by YouTube playlist id. */
export const GTA_III_TRACKS: Record<string, Track[]> = {
  // Head Radio
  "PLffQpMcmLcI-8SiLDpkBX1dNe81qgk5li": [
    { id: "ohUPOeBC440", title: "Dil Don't - Stripe Summer", duration: 163 },
    { id: "qXjDbcQAHU0", title: "Whatever - Good Thing", duration: 181 },
    { id: "-XnoMYyfppw", title: "Craig Gray - Fade Away", duration: 200 },
    { id: "WAAEjdxewCo", title: "Conor and Jay - Change", duration: 241 },
    { id: "XU0QNWHHx88", title: "Frankie Fame - See Through You", duration: 167 },
    { id: "qgjmSLI0cug", title: "Scatwerk - Electronic Go Go", duration: 151 },
    { id: "gUFC8IozzxM", title: "Dezma - Life Is But A Mere Supply", duration: 192 },
  ],
  // Double Clef FM
  "PLffQpMcmLcI_jb06fbtejkgVza0OD-8gw": [
    { id: "j9oscAveRxQ", title: "Wolfgang Amadeus Mozart - Non piu andrai farfallone amoroso", duration: 213 },
    { id: "JHL31KRNgm0", title: "Gaetano Donizetti - Chi mi frena in tal momento", duration: 216 },
    { id: "8bVmRf17jq0", title: "Giuseppe Verdi - Libiamo ne'lieti calici", duration: 180 },
    { id: "3BJilPV6IGA", title: "Wolfgang Amadeus Mozart - Finch'han del vino", duration: 68 },
    { id: "wn03cxdJ6fU", title: "Giacomo Puccini - O mio babbino caro", duration: 128 },
    { id: "-xUmze8Z2HA", title: "Giuseppe Verdi - La donna è mobile", duration: 194 },
  ],
  // K-JAH
  PLffQpMcmLcI9au6JRZyx4GGVWbuLpOlUS: [
    { id: "z2SupnvWmF4", title: "Scientist - Dance of the Vampires", duration: 207 },
    { id: "B6vp7wPJipc", title: "Scientist - Your Teeth In My Neck", duration: 281 },
    { id: "88DLK2z1QtI", title: "Scientist - The Corpse Rises", duration: 207 },
    { id: "CfFtxq3fvAY", title: "Scientist - The Mummy's Shroud", duration: 266 },
    { id: "HdQfxvnYbu8", title: "Scientist - Plague of Zombies", duration: 169 },
  ],
  // Rise FM
  "PLffQpMcmLcI-SdVSaR75TRCC_VO1IA0or": [
    { id: "WSl3GlaW-PM", title: "Chris Walsh - Shake (Revolt Clogrock Remix)", duration: 540 },
    { id: "7OODw9OtwgI", title: "Shiver - Deep Time", duration: 438 },
    { id: "Ov1XKGaqOPo", title: "R.R.D.S. - Innerbattle", duration: 391 },
    { id: "q7vD7gA4fhI", title: "Slyder - Score (Original Mix)", duration: 527 },
    { id: "5IjMt7IPocg", title: "Slyder - Neo (The One)", duration: 567 },
    { id: "4SPXOOq9hHQ", title: "Chris Walsh & Dave Beran & Revolt - Shake (End Mix)", duration: 310 },
  ],
  // Lips 106
  "PLffQpMcmLcI8Oj8ViW-EqOmrboBVGttq7": [
    { id: "W98MoACN5TQ", title: "Fatamarse - Bump To The Music", duration: 157 },
    { id: "bKTqbDP-VJc", title: "April's In Paris - Feels Like I Just Can't Take No More", duration: 201 },
    { id: "VEZeSABtwvo", title: "Lucy - Forever", duration: 203 },
    { id: "oVJkVuB360Y", title: "Boyz 2 Girlz - Pray It Goes Ok?", duration: 230 },
    { id: "rZ2SO73YKgo", title: "Da Shootaz - Grand Theft Auto (Joyride)", duration: 212 },
    { id: "qGTjS_ZAnq8", title: "Funky Bjs - Rubber Tip", duration: 184 },
  ],
  // Game Radio FM
  PLffQpMcmLcI90NP0YVS5h4Smwq32lwAlO: [
    { id: "sXmMxNmZPtg", title: "Rush - Instrumental Bed 1", duration: 44 },
    { id: "4Ni8PNZSui4", title: "Reef - Scary Movies Instrumental", duration: 220 },
    { id: "aAGVdim64Vw", title: "Royce Da 5'9-We're Live Danger\"", duration: 246 },
    { id: "JfeqDtQ2z1w", title: "Nature - Nature Freestyle", duration: 67 },
    { id: "quB_BxRvWLE", title: "JoJo Pellegrino - JoJo Pellegrino Freestyle", duration: 72 },
    { id: "3ySj0a_U-5Q", title: "Royce Da 5'9+ Pretty Ugly -Spit Game\"", duration: 207 },
    { id: "7btW-JcCYI4", title: "Royce Da 5'9-I'm the King\"", duration: 202 },
    { id: "XLflkEc1G4U", title: "Black Rob - By a Stranger", duration: 243 },
    { id: "HSRIvdctCJI", title: "Agallah & Sean Price - Rising to the Top", duration: 244 },
    { id: "IzG2kjD8dDM", title: "Rush - Instrumental Bed 2", duration: 29 },
  ],
  // MSX FM
  "PLffQpMcmLcI-5KFl9ag01x1ogvmUfyXHZ": [
    { id: "UOo7YMlmM2k", title: "Calyx - Quagmire", duration: 171 },
    { id: "9BPsGkvrq6o", title: "Rascal & Klone - Get Wild", duration: 182 },
    { id: "MB4x1HiIGDA", title: "Ryme Tyme - Judgement Day", duration: 194 },
    { id: "hh393a7NxPA", title: "Hex - Force", duration: 279 },
    { id: "UPoK7PqV8d0", title: "Omni Trio - First Contact", duration: 86 },
    { id: "ytxqS-_mvQQ", title: "Aquasky - Spectre", duration: 301 },
    { id: "L7--P5svKmI", title: "Rascal & Klone - Winner Takes All", duration: 161 },
    { id: "CG44fwCv17M", title: "Ryme Tyme - T Minus", duration: 238 },
    { id: "_y8oPsYJnuA", title: "nCode - Spasm", duration: 192 },
    { id: "1OvyVGo8MQY", title: "D. Kay - Monolith", duration: 192 },
    { id: "tsoaEZvdD7Y", title: "Dom & Ryme Tyme - Iceberg", duration: 236 },
    { id: "GxM44lPmt0Y", title: "TJ Rizing - Agent 007", duration: 194 },
  ],
  // Flashback 95.6
  "PLffQpMcmLcI-hbWqiDDFm-XCaffjYKpKp": [
    { id: "vlRpd7_7X0A", title: "Giorgio Moroder & Debbie Harry - Rush Rush", duration: 217 },
    { id: "zig4UerqmDM", title: "Giorgio Moroder & Elizabeth Daily - Shake It Up", duration: 220 },
    { id: "9THRaF1gEIA", title: "Giorgio Moroder & Paul Engemann - Scarface", duration: 182 },
    { id: "g5747Ir-DH0", title: "Giorgio Moroder & Amy Holland - She's On Fire", duration: 224 },
    { id: "iUDHNxmWVQU", title: "Giorgio Moroder & Elizabeth Daily - I'm Hot Tonight", duration: 193 },
  ],
  // Chatterbox FM
  PL16g9T5snpTSq3oGem0tg9XVommdaEOJb: [
    { id: "7n-XLNUQCdc", title: "Killer Bees", duration: 52 },
    { id: "q2-gbXvzhiE", title: "Good Eatin'", duration: 54 },
    { id: "ZdTj9x8ZUCA", title: "Freddy Needs a Nanny", duration: 85 },
    { id: "nM9IhAopOr0", title: "Spanking", duration: 55 },
    { id: "jmqZW9e5sZA", title: "C.R.A.P (Citizens Raging Against Phones)", duration: 79 },
    { id: "ckPoiAvxPQE", title: "Liberty City Cox Rule & Women are Made from Sand", duration: 22 },
    { id: "m9DQpcGrVG0", title: "Life is Not a Game", duration: 57 },
    { id: "GZdOMLg_xto", title: "Short People", duration: 44 },
    { id: "qDNQtZvCfPk", title: "Hi Lazlow, Is That Your Real Name?", duration: 34 },
    { id: "r6vrGEhD9S8", title: "Turnips", duration: 30 },
    { id: "s-sEkbx5ZM0", title: "Guns Don't Kill People", duration: 51 },
    { id: "wij7Yfh8eEc", title: "English People/American Sport", duration: 117 },
    { id: "BqsnF-zv-pk", title: "People Are So Rude", duration: 106 },
    { id: "wXJhw1S6rIc", title: "Taxes", duration: 24 },
    { id: "pgJUFqgdQqQ", title: "Why are People Afraid of Numbers", duration: 49 },
    { id: "uiXX6AOp9cY", title: "Spank/Toothpaste is Evil", duration: 74 },
    { id: "KaG7_6cVtSM", title: "Bob from Pine Creek", duration: 158 },
    { id: "b135exhXRLE", title: "Clothes", duration: 149 },
    { id: "8dm5goiJcR8", title: "International Puppetry Festival", duration: 70 },
    { id: "F34xO-f3WOg", title: "Internet is Amazing", duration: 78 },
    { id: "REs0c25QSww", title: "Col. James/The Military", duration: 86 },
    { id: "VVuo1vVxLg4", title: "Government Propaganda", duration: 62 },
    { id: "H0-ZyYyXiEs", title: "Jeff's Rally", duration: 135 },
    { id: "4f2tEJHtzvA", title: "You Do a Great Show", duration: 58 },
    { id: "IfLepJPe_8Y", title: "Reed Tucker", duration: 334 },
    { id: "B1_2nj3ZRHw", title: "Fernando Martinez", duration: 567 },
    { id: "zSWhHy3rC30", title: "Maria Latore", duration: 107 },
    { id: "6EXiMaCcjmY", title: "Toni Cipriani", duration: 106 },
    { id: "VrG45X7gY7E", title: "Donald Love/Love Media Announcements", duration: 105 },
  ],
};

/** Talk stations keep their segments in broadcast order instead of shuffling them. */
export const GTA_III_TALK = ["PL16g9T5snpTSq3oGem0tg9XVommdaEOJb"];
