import type { Track } from "../broadcast";

/** GTA Liberty City Stories stations' songs and talk segments, keyed by YouTube playlist id. */
export const LCS_TRACKS: Record<string, Track[]> = {
  // Head Radio
  PLffQpMcmLcI_c2NLlZrClcFGfMonHNkdI: [
    { id: "q485BxJkZ4c", title: "Conor & Jay - Train", duration: 192 },
    { id: "IYYT0CKN9B4", title: "Cloud Nineteen - The One For Me", duration: 153 },
    { id: "2vMMYyuy-hY", title: "Purser - Feel The Pain", duration: 170 },
    { id: "BqES9Yi5gvg", title: "L. Marie (feat. Raff) - Free Yourself", duration: 221 },
    { id: "l421iJhOOfU", title: "15 Ways - Drive", duration: 195 },
    { id: "pGXHsGaBRiI", title: "Rosco Stow - Welcome to the Real World", duration: 143 },
    { id: "O9sKM9ObkBw", title: "Vanilla Smoothie - Keep Dreaming", duration: 168 },
  ],
  // Double Clef FM
  "PLffQpMcmLcI-ocUynUvrj90BoVTFw-mCj": [
    { id: "29AoTUHOyS8", title: "Wolfgang Amadeus Mozart - E amore un ladroncello", duration: 236 },
    { id: "eMVbLDgrYTg", title: "Giuseppe Verdi - Anvil Chorus", duration: 165 },
    { id: "CxmAhQeSUYU", title: "Wolfgang Amadeus Mozart - Overture", duration: 256 },
    { id: "ZAOPvRfhLZo", title: "Giuseppe Verdi - Chorus of the Hebrew Slaves", duration: 259 },
    { id: "sD2tQAKlXro", title: "Giuseppe Verdi - Tacea la notte placida", duration: 360 },
    { id: "f_q5Vf0JqAY", title: "Ruggiero Leoncavallo - Vesti la giubba", duration: 199 },
  ],
  // K-Jah
  PLffQpMcmLcI9l_UoK0TKuEB2c6gXu6iJq: [
    { id: "3iNYVuiNi9A", title: "Peter Bouncer - Ready for the Dancehall Tonight", duration: 239 },
    { id: "l5UyHWL_xAY", title: "Kenny Knots - Ring My Number", duration: 199 },
    { id: "19C2M_o1Gds", title: "Richie Davis - You Ha Fe Cool", duration: 183 },
    { id: "8MPuWkXav2Y", title: "Selah Collins - Pick a Sound", duration: 204 },
    { id: "xy5M0TJ6mfE", title: "Kenny Knots - Watch How the People Dancing", duration: 207 },
    { id: "DHKQYnbu6TY", title: "Richie Davis - Lean Boot", duration: 184 },
    { id: "nuVcPlx-mzA", title: "Errol Bellot - What a Wonderful Feeling", duration: 194 },
    { id: "r_E0_ysX7U8", title: "Kenny Knots - Run Come, Call Me", duration: 204 },
  ],
  // Rise FM
  PLffQpMcmLcI_KozKeCkeGERAn6at8VSXx: [
    { id: "LH9F1rvtXK0", title: "Moloko - Sing it Back (Boris Musical Mix)", duration: 278 },
    { id: "8jcRaqvIWNo", title: "Ultra Naté - Free", duration: 231 },
    { id: "96kJaCWOMsg", title: "Happy Clappers - I Believe", duration: 341 },
    { id: "7YIEYADe5fs", title: "Eddie Amador - House Music", duration: 357 },
    { id: "ikhxJjZtwtc", title: "Kristine W - Feel What You Want", duration: 328 },
    { id: "hPkURi2Wnvo", title: "De'Lacy - Hideaway (Deep Dish Vocal Remix)", duration: 710 },
    { id: "4h-QzqesZ6M", title: "Sneaker Pimps - Spin Spin Sugar (Armand's Dark Garage Mix)", duration: 230 },
    { id: "ASktiEjXLvc", title: "Jaydee - Plastic Dreams", duration: 185 },
    { id: "ALqCu3ApzIg", title: "Ron Trent - Altered States", duration: 482 },
    { id: "jAdaCkWAskY", title: "The Absolute - There Will Come A Day (Half Tab Dub)", duration: 462 },
    { id: "cOpLJJ8Ay6g", title: "Slam - Positive Education", duration: 525 },
    { id: "E5WUSUn1aH0", title: "Green Velvet - Flash", duration: 430 },
    { id: "I0eXTHpnHXc", title: "Robert Armani - Circus Bells (Hardfloor Remix)", duration: 537 },
    { id: "QTcPqv0k4Y4", title: "Josh Wink - Higher State of Consciousness", duration: 376 },
  ],
  // Lips 106
  PLffQpMcmLcI8Fnlou5geQVYdE1CfsfrGS: [
    { id: "D0dISjrXD6M", title: "Rudy La Fontaine - Funk in Time", duration: 210 },
    { id: "9h1nWdIxZfw", title: "Sawaar - Love is the Feeling", duration: 183 },
    { id: "kv-joSWC3Co", title: "Sunshine Shine - Mine Until Monday", duration: 160 },
    { id: "OVnGTSVkolg", title: "Credit Check - Get Down", duration: 197 },
    { id: "EDEcIxTonjw", title: "Cool Timers - Tonight", duration: 200 },
    { id: "eow6VpAvRVk", title: "Nina Barry - Bassmatic", duration: 230 },
    { id: "OiRsXwb6g2Q", title: "The Jackstars - Into Something (Come on, Get Down)", duration: 200 },
  ],
  // Radio Del Mundo
  PLffQpMcmLcI8QmpGy22OTiq2EA_tKolC1: [
    { id: "0vXgHrsNIZw", title: "Ahmed Mneimneh - Aini Bet Ref", duration: 242 },
    { id: "_KJ-WZfXtUA", title: "Salatin El Tarab Orchestra - Ah Ya Zein", duration: 167 },
    { id: "iE5YGYezGfM", title: "Ofra Haza - Im Nin'Alu", duration: 241 },
    { id: "pDNdGu71bAI", title: "Michel Nahme - Marmara", duration: 192 },
    { id: "Og4FXsvL7pc", title: "Farid El Attrach - Hebeena Hebeena", duration: 450 },
    { id: "Pu4ylwFyeeY", title: "Natacha Atlas - Kidda", duration: 307 },
    { id: "f5ke4TDxjW0", title: "Mohamad Hussein - Mariam Mariamti", duration: 402 },
    { id: "Cc8ZNNXvzMU", title: "Vijaya Anand - Neeve Nanna (Only You Were Mine)", duration: 237 },
    { id: "G8C4CYRpve8", title: "Samira Tewfik - Ballaa Tsoubou Hal Kahwa", duration: 173 },
    { id: "OEkHz0YyymY", title: "Mohamed Eskandar - La Tisalouni", duration: 217 },
    { id: "9vi4XK99ilo", title: "Asha Bhonsle - Dum Maro Dum", duration: 155 },
    { id: "bMUHt_YuHKY", title: "Ananda Shankar - Raghupati", duration: 204 },
  ],
  // MSX 98
  "PLffQpMcmLcI-NKVzsXVePYQ96ETnDagW4": [
    { id: "LWiV3Zzc4Hw", title: "Omni Trio - Renegade Snares", duration: 393 },
    { id: "AdAY_4lo34M", title: "Renegade - Terrorist", duration: 373 },
    { id: "uS7kxS4I7MI", title: "Foul Play - Finest Illusion (Legal Mix)", duration: 341 },
    { id: "n1NCXUvPuBM", title: "Omni Trio - Living For The Future (FBD Project Remix)", duration: 374 },
    { id: "KZs0mTU8PNs", title: "DJ Pulse - Stay Calm (Foul Play Remix)", duration: 447 },
    { id: "JloCoCYQqgg", title: "Hyper-On Experience - Disturbance (Tango Remix)", duration: 337 },
    { id: "k9cy4oGqkw0", title: "Higher Sense - Cold Fresh Air", duration: 361 },
    { id: "v4Ybg6jyDxM", title: "Omni Trio - Living For The Future", duration: 401 },
    { id: "CPzrFdbCcJw", title: "Omni Trio - Thru The Vibe (2 on 1 Remix)", duration: 350 },
    { id: "AAlilQGKLjs", title: "Deep Blue - The Helicopter Tune", duration: 323 },
    { id: "a20gt1AfqwE", title: "Dead Dred - Dred Bass", duration: 351 },
  ],
  // Flashback FM
  "PLffQpMcmLcI-62CHeoG3kSJMpQRnLgzo0": [
    { id: "T9wc8F5IOeA", title: "Giorgio Moroder - I Wanna Rock You", duration: 325 },
    { id: "boycRXVwJyw", title: "Giorgio Moroder - E=MC²", duration: 273 },
    { id: "y27BmtEfQck", title: "Giorgio Moroder - From Here to Eternity", duration: 350 },
    { id: "xv74fEY9xtM", title: "Giorgio Moroder - First Hand Experience in Second Hand", duration: 298 },
    { id: "hyutT339feQ", title: "Giorgio Moroder - Chase", duration: 501 },
    { id: "_Oe2_Qbbe8A", title: "Giorgio Moroder - I'm Left, You're Right, She's Gone", duration: 304 },
  ],
  // The Liberty Jam
  PLffQpMcmLcI9di8Pjf51PELpPMBtYBtGG: [
    { id: "Vcaa1k0kXFw", title: "Method Man - All I Need", duration: 196 },
    { id: "orxZIzun3-Q", title: "Big Pun feat. Fat Joe - Twinz (Deep Cover '98)", duration: 223 },
    { id: "FYq_NCYOL7o", title: "DMX feat. DJ Clue, Drag-On, Jadakiss, Styles P. & Eve - Ruff Ryders Anthem", duration: 233 },
    { id: "j7IfW0pkVJs", title: "DMX feat. Sheek Louch - Get At Me Dog", duration: 185 },
    { id: "oWF52bIjpWs", title: "Big Pun - Beware", duration: 195 },
    { id: "2pgOzgY1qO4", title: "Redman feat. Method Man - Do What Ya Feel", duration: 254 },
    { id: "b4h7RPKhi1Y", title: "The L.O.X. feat. Black Rob - Chain Gang Freestyle", duration: 224 },
    { id: "ExepFjG71Yg", title: "Noreaga - N.O.R.E.", duration: 192 },
    { id: "CMJYJNvtgBc", title: "Mobb Deep - Shook Ones (Pt. II)", duration: 323 },
    { id: "3C1f3YGtd6A", title: "The L.O.X. feat. DJ Clue - Chest2Chest Freestyle", duration: 207 },
    { id: "Uh7O4x7pDSA", title: "Onyx feat. Big Pun & Noreaga - Shut 'em Down (Remix)", duration: 255 },
    { id: "b1YO9kopfeg", title: "Raekwon - Incarcerated Scarfaces", duration: 253 },
  ],
  // LCFR
  "PLffQpMcmLcI-FzET9nxv4NzMW13nT7Esh": [
    { id: "Lgl__KY1Sjw", title: "Heartland Values with Nurse Bob", duration: 656 },
    { id: "7XbL6FRhBp0", title: "Electron Zone Radio", duration: 487 },
    { id: "Tv3JBeAPi38", title: "Breathing World", duration: 605 },
    { id: "YPzF9ZZCYtw", title: "Coq O Vin", duration: 567 },
    { id: "oDeQYXZ4zQw", title: "Chatterbox", duration: 699 },
  ],
};

/** Talk stations keep their segments in broadcast order instead of shuffling them. */
export const LCS_TALK = ["PLffQpMcmLcI-FzET9nxv4NzMW13nT7Esh"];
