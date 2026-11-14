/**
 * Playlist stations as "live" broadcasts: every listener hears the same song at
 * the same position, derived only from the (server-corrected) UTC clock.
 * Ported from the portfolio's Non-Stop-Pop radio with the same tracks, ads, seed
 * and on-air date, so with ad breaks on both sites play the same thing.
 * With ad breaks off the songs follow their own schedule, still clock-derived.
 */

export interface Track {
  id: string;
  title: string;
  /** Seconds. */
  duration: number;
}

/**
 * Real YouTube lengths of each playlist's videos, keyed by playlist id. A playlist
 * only becomes a synced broadcast once its tracks are listed here.
 */
export const PLAYLIST_TRACKS: Record<string, Track[]> = {
  // Non-Stop-Pop 100.7 FM (DJ Cara)
  PLv2IGBk7nw2N7ibp1azSzGAAHYRncfaFN: [
    { id: "T8sWgUzuTo0", title: "1 Thing", duration: 229 },
    { id: "6N3JQkMFK2M", title: "6 Underground", duration: 233 },
    { id: "Qq3u0UWIX2s", title: "Adult Education", duration: 250 },
    { id: "ec2Dvm9QvZg", title: "Alright", duration: 223 },
    { id: "1GKX53eJHQc", title: "Anthem", duration: 247 },
    { id: "_mjgdUBhvnM", title: "Applause", duration: 212 },
    { id: "Xl9ORbZkWS8", title: "Bad Girls", duration: 233 },
    { id: "ypi5Lyv_aSA", title: "Cooler Than Me", duration: 218 },
    { id: "alaUJKV7t94", title: "Days Go By", duration: 224 },
    { id: "6V_ZMZbeT6c", title: "Don't Wanna Fall In Love", duration: 238 },
    { id: "Q7OaKc9eiX0", title: "Everything She Wants", duration: 207 },
    { id: "LD1s3afd9kU", title: "Feel Good Inc.", duration: 225 },
    { id: "47KrNuGWeLU", title: "Gimme More", duration: 209 },
    { id: "UrLwlqy2hY0", title: "Glamorous", duration: 239 },
    { id: "D9LL3B8xL5E", title: "I Want It That Way", duration: 218 },
    { id: "XDibRgVpBzo", title: "Kids", duration: 264 },
    { id: "mdA5x-f_nWE", title: "Lady (Hear Me Tonight)", duration: 229 },
    { id: "jNJ6uKeoAik", title: "Let's Go All The Way", duration: 221 },
    { id: "8S4gIGc652o", title: "Living In A Box", duration: 188 },
    { id: "LZexOk4us1M", title: "Me & U", duration: 197 },
    { id: "wBAMAawyi20", title: "Meet Me Halfway", duration: 257 },
    { id: "9_7hTRoPRF8", title: "Midnight City", duration: 246 },
    { id: "jRg-i57w_f4", title: "Moves Like Jagger", duration: 205 },
    { id: "9fL7L75Ez5g", title: "Music Sounds Better With You", duration: 264 },
    { id: "zqb3iI21dyc", title: "New Sensation", duration: 225 },
    { id: "cwU5qJv-4DQ", title: "On Our Own", duration: 286 },
    { id: "r_46nwoB6uQ", title: "Only Girl (In The World)", duration: 238 },
    { id: "u2NDyds48ek", title: "Promises, Promises", duration: 228 },
    { id: "N2kBYUhW_cc", title: "Pure Shores", duration: 275 },
    { id: "fKsm6cw1b5g", title: "Scandalous", duration: 242 },
    { id: "ivKosHJM0Io", title: "Send Me An Angel", duration: 234 },
    { id: "qhzlIZdBsmo", title: "Smalltown Boy", duration: 278 },
    { id: "dpSTP_5WNW0", title: "Something Got Me Started", duration: 300 },
    { id: "CelMDlpTbDs", title: "Tape Loop", duration: 231 },
    { id: "h4igSWmbGO4", title: "Tell It To My Heart", duration: 224 },
    { id: "Oe-OkX-rEv4", title: "Tennis Court", duration: 202 },
    { id: "pntr19zqj-k", title: "The Rhythm Of The Night", duration: 216 },
    { id: "Hofep767nOI", title: "The Time Is Now", duration: 218 },
    { id: "jBT0h_IssjU", title: "Wait", duration: 193 },
    { id: "AsNH1k60TLM", title: "West End Girls", duration: 236 },
    { id: "EPHWnaoNKf0", title: "Work", duration: 196 },
    { id: "rTYlbJ0iSzQ", title: "With Every Heartbeat", duration: 253 },
  ],
  // Los Santos Rock Radio 102.3 FM
  "PLcOvg8kw-meF4-lVO88lRrb_uE6zsqOmj": [
    { id: "dy9Cm9TTqK4", title: "Humble Pie - 30 Days In the Hole", duration: 239 },
    { id: "FvcgFvcymNM", title: "Alannah Myles - Black Velvet", duration: 302 },
    { id: "a1ONVYFjMyE", title: "Simple Minds - All the Things She Said", duration: 260 },
    { id: "LXvz4qSu4aE", title: "Belinda Carlisle - Circle in the Sand", duration: 232 },
    { id: "-syaG_kLJIA", title: "Bob Seger & The Silver Bullet Band - Night Moves", duration: 337 },
    { id: "xLSBfzGfEEM", title: "Harry Chapin - Cat's In the Cradle", duration: 239 },
    { id: "BFkoPrQNn0w", title: "Chicago - If You Leave Me Now", duration: 246 },
    { id: "6NKW_f4A4GU", title: "Broken English - Comin' On Strong", duration: 218 },
    { id: "GnYoHWGwT1Q", title: "Creedence Clearwater Revival - Fortunate Son", duration: 148 },
    { id: "BJuYF0puMBA", title: "Def Leppard - Photograph", duration: 253 },
    { id: "IJ7j_Bfg1p4", title: "Foreigner - Dirty White Boy", duration: 232 },
    { id: "DmDYbL4h-Ew", title: "Don Johnson - Heartbeat", duration: 246 },
    { id: "-JCFiOpLVgM", title: "Gerry Rafferty - Baker Street", duration: 260 },
    { id: "_jMgfKNt1IE", title: "ZZ Top - Gimme All Your Lovin'", duration: 253 },
    { id: "nruSjRGTXhw", title: "Bob Seger & The Silver Bullet Band - Hollywood Nights", duration: 309 },
    { id: "OeR6a6kvTeo", title: "Stevie Nicks - I Can't Wait", duration: 288 },
    { id: "aAwXS_nJ6_o", title: "The Alan Parsons Project - I Wouldn't Want To Be Like You", duration: 204 },
    { id: "DPzkG7nHjeg", title: "Kenny Loggins - I'm Free (Heaven Helps the Man)", duration: 232 },
    { id: "tSQhSKPlRu4", title: "Julian Lennon - Too Late for Goodbyes", duration: 225 },
    { id: "6xR_CnqSulg", title: "Kansas - Carry On Wayward Son", duration: 330 },
    { id: "R3U4yuJ5dkE", title: "Kenny Loggins - Danger Zone", duration: 225 },
    { id: "0uXo5aLis4s", title: "Billy Squier - Lonely Is the Night", duration: 288 },
    { id: "Vhdlpgp-Blg", title: "Mountain - Mississippi Queen", duration: 162 },
    { id: "dNYV5fttqVI", title: "The Small Faces - Ogdens' Nut Gone Flake", duration: 155 },
    { id: "RnxnplxnOuU", title: "Boston - Peace Of Mind", duration: 316 },
    { id: "2ooiI8n_GNM", title: "Phil Collins - I Don't Care Anymore", duration: 316 },
    { id: "NVmksUAhVms", title: "The Cult - Rain", duration: 239 },
    { id: "7dSsM54ycBo", title: "Robert Plant - Big Log", duration: 316 },
    { id: "YrMu_TDvHG0", title: "Steve Miller Band - Rock'n Me", duration: 190 },
    { id: "w-0JkQfyi_Q", title: "Yes - Roundabout", duration: 526 },
    { id: "DXzIWYaozng", title: "Elton John - Saturday Night's Alright for Fighting", duration: 302 },
    { id: "YgGV4DHvQvM", title: "Pat Benatar - Shadows of the Night", duration: 232 },
    { id: "ZKYPM3HFvF8", title: "Steve Winwood - Higher Love", duration: 267 },
    { id: "AvMipmR2RUE", title: "Survivor - Burning Heart", duration: 239 },
    { id: "3zWCz6uGAGA", title: "The Greg Kihn Band - The Breakup Song", duration: 204 },
    { id: "vRzUAAa4evA", title: "Starship - We Built This City", duration: 288 },
    { id: "lX_yWUgNYtM", title: "The Doobie Brothers - What a Fool Believes", duration: 225 },
  ],
  // iFruit Radio
  "PLcOvg8kw-meGC5bfYFigH1XiJ0DzPj2UB": [
    { id: "ZH7ZpyxTVrY", title: "Alkaline - With the Thing", duration: 232 },
    { id: "GFDwgzzbFho", title: "Baauer and Channel Tres ft. Danny Brown - Ready to Go", duration: 183 },
    { id: "9IjRNeRhbNk", title: "City Girls - Act Up", duration: 169 },
    { id: "QrPWnaPU-Yo", title: "DaBaby - BOP", duration: 169 },
    { id: "jYrsyk_d8nw", title: "DaBaby ft. Kevin Gates - POP STAR", duration: 190 },
    { id: "FPtbSNm9w8U", title: "Danny Brown - Dance in the Water", duration: 169 },
    { id: "L7zxlmIZ4w0", title: "Denzel Curry and YBN Cordae - Alienz", duration: 155 },
    { id: "BP_aRl1Lh2Q", title: "The Egyptian Lover - Everything She Wants", duration: 281 },
    { id: "_TCLgWjhOLU", title: "Freddie Gibbs & Madlib - Crime Pays", duration: 190 },
    { id: "L4g3ssgHImM", title: "Koffee ft. Gunna - W", duration: 274 },
    { id: "m1s8sz3ILJs", title: "Megan Thee Stallion ft. DaBaby - Cash Shit", duration: 204 },
    { id: "McnItd2A3tA", title: "ScHoolboy Q - Numb Numb Juice", duration: 127 },
    { id: "BGVXUmqPpAE", title: "Shoreline Mafia - Wings", duration: 155 },
    { id: "J5FeI1Lu_cE", title: "Travis Scott - HIGHEST IN THE ROOM", duration: 183 },
    { id: "eR4ImOKtDaA", title: "Young Thug ft. Gunna and Travis Scott - Hot", duration: 323 },
    { id: "VJ4561pHc7s", title: "Skepta & AJ Tracey - Kiss and Tell", duration: 204 },
    { id: "kycrDqZcSAw", title: "Burna Boy ft. Zlatan - Killin Dem", duration: 232 },
    { id: "Tm99pGlv9_8", title: "D Double E & Watch the Ride - Original Format (ft. DJ Die, Dismantle & DJ Randall)", duration: 225 },
    { id: "mk-BNMINy5k", title: "D-Block Europe - Kitchen Kings", duration: 204 },
    { id: "MS22DZutJV8", title: "ESSIE GANG ft. SQ Diesel - Pattern Chanel", duration: 155 },
    { id: "W4goU7hdTPQ", title: "Headie One ft. Skepta - Back to Basics (Floating Points Remix)", duration: 204 },
    { id: "HBz6r4K0O0k", title: "J Hus - Must Be", duration: 218 },
    { id: "4sWHQGA4GzI", title: "JME ft. Giggs - Knock Your Block Off", duration: 225 },
    { id: "0jRVgZfYbVQ", title: "Kranium ft. AJ Tracey - Money in the Bank", duration: 169 },
    { id: "f5SEAGnb510", title: "Naira Marley - Opotoyi", duration: 225 },
    { id: "q04PqW8iEdk", title: "Pop Smoke - 100K on the Coupe", duration: 120 },
    { id: "nHl75EhJ5KM", title: "Skepta & Nafe Smalls - Greaze Mode", duration: 176 },
    { id: "nZjpJqxDwQI", title: "Slowthai - I Need", duration: 127 },
  ],
  // Radio Los Santos 106.1 FM
  "PLgbI0QcBNn5jsj7Ju1BEgGbT0bn4bLOdS": [
    { id: "o3Gea10Lh6E", title: "100s - Life Of A Mack", duration: 208 },
    { id: "B9Pe3-CH80Q", title: "AB Soul ft. Kendrick Lamar - Illuminate", duration: 303 },
    { id: "is8C2O50HZE", title: "Clyde Carson ft. The Team - Slow Down", duration: 219 },
    { id: "QISg_MWLJqk", title: "Freddie Gibbs - Still Livin'", duration: 124 },
    { id: "QerK-6ic0Oc", title: "Gangrene - Bassheads", duration: 166 },
    { id: "jcWRFWGZXhE", title: "Gucci Mane ft. Ciara - Too Hood", duration: 217 },
    { id: "pQhZVbYUQj8", title: "Jay Rock ft. Kendrick Lamar - Hood Gone Love It", duration: 246 },
    { id: "6eWx3wA78g8", title: "Kendrick Lamar - A.D.H.D", duration: 216 },
    { id: "p0sNdvVqliw", title: "Marion Band$ ft. Nipsey Hussle - Hold Up", duration: 230 },
    { id: "XNSl5-rNvt4", title: "Problem ft. Glasses Malone - Say That Then", duration: 173 },
    { id: "5TGIyZwbkNc", title: "The Game ft. 2Chainz & Rick Ross - Ali Bomaye", duration: 322 },
    { id: "ByNhCB86Igg", title: "YG - I'm a Real 1", duration: 169 },
    { id: "HHbdxqOzSRc", title: "Young Scooter Feat. Trinidad James - I Can't Wait", duration: 190 },
    { id: "nHwg8tlNalo", title: "Young Scooter - Work Feat. Gucci Mane", duration: 174 },
    { id: "c9n5m2sNyrg", title: "Travi$ Scott feat. T.I. and 2 Chainz - Upper Echelon", duration: 242 },
    { id: "cvUnX1AI_J8", title: "Skeme - Millions", duration: 249 },
    { id: "b2sedR9Aj5o", title: "ScHoolboy Q feat. Kendrick Lamar - Collard Greens", duration: 304 },
    { id: "3h4Ncf3Gj6A", title: "Problem & Iamsu! feat. Bad Lucc and Sage the Gemini - Do It", duration: 206 },
    { id: "CO8u1Cz-GSg", title: "G-Side - Relaxin'", duration: 183 },
    { id: "lS_Slrv06kQ", title: "Freddie Gibbs - Sellin' Dope", duration: 253 },
    { id: "0Jx1cotrdzY", title: "Danny Brown feat. A$AP Rocky and Zelooperz - Kush Coma", duration: 285 },
    { id: "quFJT88wDQo", title: "Chuck Inglish feat. Mac Miller & Ab-Soul - Came Thru/Easily", duration: 278 },
    { id: "FT8MYCqjFik", title: "A$AP Ferg - Work", duration: 179 },
    { id: "OOPiW6c4We0", title: "Action Bronson feat. Danny Brown - Bad News", duration: 155 },
    { id: "v7wQPnD2Li4", title: "Ace Hood feat. Future and Rick Ross - Bugatti", duration: 274 },
  ],
  // Channel X 99.1 FM
  "PLcOvg8kw-meE9dHV55Pcz2iDPN-MRqlKQ": [
    { id: "22SaklBOHEM", title: "T.S.O.L. - Abolish Government/Silent Majority", duration: 127 },
    { id: "DHQJUYb4Px4", title: "Adolescents - Amoeba", duration: 197 },
    { id: "Potcd6v8YX0", title: "Youth Brigade - Blown Away", duration: 169 },
    { id: "qm-CCD7K7zg", title: "Agent Orange - Bored of You", duration: 113 },
    { id: "sdaUfRVLvbk", title: "Circle Jerks - Rock House", duration: 155 },
    { id: "ZXtBgnCkJAI", title: "D.R.I. - I Don't Need Society", duration: 99 },
    { id: "XOCPRX3Hs3E", title: "MDC - John Wayne Was a Nazi", duration: 127 },
    { id: "o2n9_MiMW_s", title: "The Germs - Lexicon Devil", duration: 134 },
    { id: "gQjzGK2vo2E", title: "The Weirdos - Life of Crime", duration: 141 },
    { id: "me3xxeR8uzA", title: "Redd Kross - Linda Blair", duration: 127 },
    { id: "JEZul6LspHM", title: "Black Flag - My War", duration: 232 },
    { id: "zbUOGVy6Z0M", title: "Descendents - Pervert", duration: 113 },
    { id: "FDUzdL3Na6A", title: "Suicidal Tendencies - Subliminal", duration: 190 },
    { id: "z_j0-9-YxtA", title: "D.O.A. - The Enemy", duration: 176 },
    { id: "ug7G3qEcEVQ", title: "Fear - The Mouth Don't Stop (The Trouble With Women Is)", duration: 141 },
    { id: "Bs1dPQt02Nk", title: "The Zeros - Don't Push Me Around", duration: 155 },
    { id: "9cwUBUBFXYg", title: "OFF! - What's Next", duration: 134 },
    { id: "UQ0M0lH2MnY", title: "X - Los Angeles", duration: 148 },
  ],
  // Rebel Radio 101.9 FM
  "PLcOvg8kw-meHnACtO6RQbM1oHBd_luvFA": [
    { id: "xvktggwK_rE", title: "C.W. McCall - Convoy", duration: 253 },
    { id: "PTKPCiA6aJE", title: "Charlie Feathers - Can't Hardly Stand It", duration: 176 },
    { id: "aMtGZ5384K4", title: "Charlie Feathers - Get With It", duration: 127 },
    { id: "0nN3SVHOj8w", title: "Hasil Adkins - Get Outta My Car", duration: 239 },
    { id: "vKA_a2cBzLg", title: "Hank Thompson - I Don't Hurt Anymore", duration: 176 },
    { id: "IHa1tVq2eDc", title: "Waylon Jennings - I Ain't Living Long Like This", duration: 295 },
    { id: "iOSEl2Sqi_4", title: "Jerry Reed - You Took All the Ramblin' Out of Me", duration: 141 },
    { id: "0Huk3bVE4mc", title: "Johnny Cash - The General Lee", duration: 183 },
    { id: "kZt0bPZkCw0", title: "Johnny Paycheck - (It Won't Be Long) And I'll Be Hating You", duration: 155 },
    { id: "RNRNdTQtqhM", title: "Marvin Jackson - Dippin' Snuff", duration: 155 },
    { id: "lYp7QL6x8HA", title: "Ozark Mountain Daredevils - If You Wanna Get to Heaven", duration: 204 },
    { id: "1vIKDi-h4Kc", title: "Ray Price - Crazy Arms", duration: 162 },
    { id: "es9QVwetZps", title: "Homer & Jethro - She Made Toothpicks Of The Timber Of My Heart", duration: 141 },
    { id: "KOBhJgOyxDU", title: "Tammy Wynette - D-I-V-O-R-C-E", duration: 183 },
    { id: "qpLTv0nhTvo", title: "The Highwaymen - Highwayman", duration: 190 },
    { id: "HWCiMLLn0_A", title: "Waylon Jennings - Are You Sure Hank Done It This Way", duration: 176 },
    { id: "BzTdXyAMq-g", title: "Willie Nelson - Whiskey River", duration: 253 },
  ],
  // Blue Ark
  "PLcOvg8kw-meGqHiXO400mHqsCHjeses2Q": [
    { id: "f5KM9D4-DD4", title: "Vybz Kartel - Addi Truth", duration: 183 },
    { id: "DBlBk99-Kkc", title: "Busy Signal feat. Damian \"Jr. Gong\" Marley - Kingston Town (Remix)", duration: 225 },
    { id: "bfhRMEBJNtw", title: "Joe Gibbs & The Professionals - Chapter Three", duration: 225 },
    { id: "V0buaJRf6A4", title: "Half Pint - Crazy Girl", duration: 239 },
    { id: "WUbxIQpEyBA", title: "Danny Hensworth - Mr. Money Man", duration: 239 },
    { id: "LX8h4uX878k", title: "Demarco - Loyal (Royals Remix)", duration: 148 },
    { id: "ErawNJC3Hbc", title: "Lee \"Scratch\" Perry & The Full Experience - Disco Devil", duration: 491 },
    { id: "seZee6_rLPc", title: "Gregory Isaacs - Night Nurse", duration: 253 },
    { id: "QBKHI4DOils", title: "The Upsetters - Grumblin' Dub", duration: 211 },
    { id: "HJ9AOHj2Dgw", title: "Konshens - Gun Shot A Fire", duration: 204 },
    { id: "muLwR2u3h2g", title: "Lee \"Scratch\" Perry & The Upsetters - I Am A Madman", duration: 351 },
    { id: "5okt_4MAY3M", title: "Junior Delgado - Sons Of Slaves", duration: 407 },
    { id: "plqZNULlQ9M", title: "Lee \"Scratch\" Perry - Roast Fish & Cornbread", duration: 435 },
    { id: "pq5ou7x80s0", title: "Lee \"Scratch\" Perry - Money Come and Money Go", duration: 295 },
    { id: "M9zRH6au9DM", title: "Dennis Brown - Money In My Pocket", duration: 239 },
    { id: "WynMS141mjA", title: "Yellowman - Nobody Move, Nobody Get Hurt", duration: 225 },
    { id: "4Q_FdM6Dn5I", title: "Chronixx - Odd Ras", duration: 183 },
    { id: "beizH2Jz1Y0", title: "Protoje - Kingston Be Wise", duration: 260 },
    { id: "Qdw36zz7FIc", title: "Tommy Lee Sparta - Psycho", duration: 162 },
    { id: "7fJs8fNmJ1s", title: "I-Octane - Topic of the Day", duration: 225 },
    { id: "_ozlLaXF7mI", title: "Vybz Kartel feat. Popcaan - We Never Fear Dem", duration: 176 },
  ],
  // East Los FM 106.2 FM
  "PLcOvg8kw-meGIx5lHhmyShUtHsmMdw4Fy": [
    { id: "OeV5TgMW4i4", title: "Criminal Sound - El Hijo De La Cumbia Remix", duration: 260 },
    { id: "Rd4WYZAc3DE", title: "Don Cheto - El Tatuado", duration: 204 },
    { id: "Q-eNjcF9Z2A", title: "Fandango - Autos Moda y Rock and Roll", duration: 197 },
    { id: "Oj3p16-kgfs", title: "Milkman - Fresco", duration: 232 },
    { id: "OjDOH0OdimE", title: "Hechizeros Band - El Sonidito", duration: 211 },
    { id: "_tD9qvhParI", title: "Instituto Mexicano del Sonido - Es Toy", duration: 211 },
    { id: "APid3Ocd_QU", title: "LA LIGA FT ALIKA NUEVA ALIANZA - TENGO EL DON", duration: 190 },
    { id: "5FGdC2hgY-E", title: "La Sonora Dinamita - Se Me Perdio La Cadenita", duration: 162 },
    { id: "IHrDNlf_OCg", title: "La Vida Boheme - Radio Capital", duration: 281 },
    { id: "39KZftyh_uU", title: "Los ángeles negros - El rey y yo", duration: 134 },
    { id: "ohnXxdgCrQo", title: "Los Buitres De Culiacan Sinaloa - El Cocaino", duration: 162 },
    { id: "ldkqlxuS3BA", title: "Los Tigres Del Norte - La Granja", duration: 239 },
    { id: "hYAcmUP8Yr0", title: "Maldita Vecindad y los Hijos del 5to Patio - Pachuco", duration: 204 },
    { id: "YzGQ6DH4lfg", title: "Jessy Bulbo - Maldito", duration: 190 },
    { id: "H5DfpbCzl_0", title: "She's A Tease - Fiebre de Jack", duration: 211 },
  ],
  // Soulwax FM
  "PLcOvg8kw-meGZKfa_n7B3y3f0EdLHlxJu": [
    { id: "N4hYi9oVKAY", title: "Daniel Maloso - Body Music", duration: 386 },
    { id: "6uY5sfUdmns", title: "Daniel Avery - Naive Response", duration: 337 },
    { id: "GyuRGiEBcpw", title: "Fatal Error - Fatal Error", duration: 365 },
    { id: "aQ6rs7fkvtQ", title: "FKClub - The Strange Art", duration: 365 },
    { id: "-pLP_gnoTdU", title: "Goose - Synrise", duration: 232 },
    { id: "p032Wr2a0Qk", title: "Green Velvet & Harvard Bass - Lazer Beams", duration: 393 },
    { id: "LYP8HBIX8TM", title: "Jackson and His Computerband - Arp #1", duration: 323 },
    { id: "0QpUA58I4aA", title: "Joe Goddard feat. Valentina - Gabriel", duration: 281 },
    { id: "uviKqF71E5A", title: "Matias Aguayo - El Sucu Tucu", duration: 246 },
    { id: "9M8i15hWQWY", title: "Mim Suleiman - Mingi", duration: 337 },
    { id: "o7bXRkbyMsM", title: "Palmbomen - Stock", duration: 190 },
    { id: "LDoGD1IEPcU", title: "Pulp - After You", duration: 442 },
    { id: "JuZmoKnlNyA", title: "Supersempfft - Let's Beam Him Up", duration: 225 },
    { id: "8cWzS31nvW0", title: "The Hacker - Shockwave", duration: 414 },
    { id: "F55Dw0jfu3E", title: "Tiga - Plush", duration: 288 },
    { id: "W-luWnMqBm8", title: "Tom Rowlands - Nothing But Pleasure", duration: 519 },
    { id: "OkI4DP01i8w", title: "Transistorcake - Mr. Croissant Taker", duration: 281 },
    { id: "xd-w3Fhx-Bg", title: "Zombie Nation - Tryouts", duration: 253 },
  ],
  // West Coast Classics 95.6 FM
  "PLcOvg8kw-meG4xgi88d60gNuQvw0lsuzb": [
    { id: "syTxH6g2iZQ", title: "Bone Thugs-N-Harmony - 1st of Tha Month", duration: 330 },
    { id: "-rC11J7MekA", title: "2Pac - Ambitionz Az a Ridah", duration: 288 },
    { id: "2HTiLFA8VO0", title: "The Lady of Rage feat. Snoop Dogg - Afro Puffs", duration: 295 },
    { id: "RTFfggT7UNg", title: "N.W.A - Appetite for Destruction", duration: 211 },
    { id: "WmcqgxfyBQk", title: "CPO feat. MC Ren - Ballad Of A Menace", duration: 281 },
    { id: "j5aq7Pvr7go", title: "Westside Connection - Bow Down", duration: 218 },
    { id: "13nP6JK3MDk", title: "Kurupt - C-Walk", duration: 316 },
    { id: "9xQmydgsF0o", title: "DJ Quik - Dollaz + Sense", duration: 358 },
    { id: "gOudeZhreEI", title: "Dr. Dre feat. Snoop Dogg - Still D.R.E", duration: 295 },
    { id: "a8Xy0M62HKM", title: "Dr. Dre feat. Snoop Dogg, Kurupt & Nate Dogg - The Next Episode", duration: 204 },
    { id: "aPZhbAI2YTg", title: "E-40 feat. The Click - Captain Save a Hoe", duration: 302 },
    { id: "g7WBjCnbxTM", title: "Eazy-E feat. Ice Cube - No More ?'s", duration: 253 },
    { id: "HkIrhJW1ZmE", title: "N.W.A - Gangsta Gangsta", duration: 351 },
    { id: "IwqO6YAum_Y", title: "Jayo Felony - Sherm Stick", duration: 197 },
    { id: "8k-qDcHhfq8", title: "King Tee - Played Like a Piano", duration: 302 },
    { id: "rFLM963VU3I", title: "Compton's Most Wanted - Late Night Hype", duration: 302 },
    { id: "1gdtvZFoR1U", title: "Luniz feat. Michael Marshall - I Got 5 On It", duration: 260 },
    { id: "w-iOKvhU1Os", title: "Mack 10 & Tha Dogg Pound - Nothin' But the Cavi Hit", duration: 246 },
    { id: "el8OK3qMZzM", title: "Geto Boys - Mind Playing Tricks on Me", duration: 323 },
    { id: "qukmLxo1vBg", title: "South Central Cartel - Servin' 'Em Heat", duration: 267 },
    { id: "DjUr_CPmqt0", title: "Snoop Dogg - Gin and Juice", duration: 225 },
    { id: "zPGw8VeAalU", title: "Too $hort - So You Want to Be a Gangster", duration: 253 },
    { id: "Kv7Emz-2-DU", title: "Spice 1 feat. MC Eiht - The Murda Show", duration: 267 },
    { id: "31UaHt1GjkE", title: "MC Eiht - Streiht Up Menace", duration: 281 },
    { id: "E5czDJiN1go", title: "Tha Dogg Pound - What Would U Do?", duration: 316 },
    { id: "cgsoH2MJkFY", title: "The Conscious Daughters - We Roll Deep", duration: 267 },
    { id: "78Zpp9eTnR0", title: "Warren G - This D.J.", duration: 218 },
    { id: "i-ApCtONkjQ", title: "Kausion feat. Ice Cube - What You Wanna Do?", duration: 253 },
    { id: "EMZKYkrWE9Q", title: "Ice Cube - You Know How We Do It", duration: 239 },
  ],
  // MOTOMAMI
  "PLcOvg8kw-meHE8LZMiBQ7qcUKA9VVOIL6": [
    { id: "Xo2Jud26CsE", title: "Armando - 100% of Disin' You", duration: 407 },
    { id: "0DJImZLKSSw", title: "DJ Slugo - 418 (Bounce Mix)", duration: 190 },
    { id: "XLfoRxFnb68", title: "Kaydy Cain - Algo Como Tú feat. Los Del Control", duration: 197 },
    { id: "JREJ6YViOrs", title: "Aventura - Mi Corazoncito", duration: 253 },
    { id: "cEFucxlmWPI", title: "DJ Spinn - Bounce N Break Yo Back", duration: 162 },
    { id: "HiRv4ylhvxQ", title: "Willie Colón & Héctor Lavoe - Calle Luna Calle Sol", duration: 232 },
    { id: "-2ctsOrtWTU", title: "Caroline Polachek - Bunny Is A Rider", duration: 197 },
    { id: "IOCQgnfNmOc", title: "Chucky73 - Dominicana", duration: 155 },
    { id: "-2yQbVzDf8A", title: "Monchy & Alexandra - Dos Locos", duration: 253 },
    { id: "zLRb5Mtgje8", title: "Daddy Yankee - Salgo Pa’ la Calle", duration: 274 },
    { id: "kJfyK82OJlw", title: "Justice - Stress", duration: 302 },
    { id: "wIILaywGVyk", title: "Arca feat. ROSALÍA - KLK", duration: 239 },
    { id: "QeWDYJTtv0U", title: "La Goony Chonga - Duro 2005", duration: 162 },
    { id: "1VraxEhqoRs", title: "Likkle Vybz & Likkle Addi - Skinny Jeans", duration: 204 },
    { id: "ZSoRowomhnA", title: "Arca - Machote", duration: 176 },
    { id: "yZVW__1eno8", title: "Bad Gyal - A La Mía", duration: 176 },
    { id: "Rq5xBFbeiYo", title: "Mr. Fingers - Mystery of Love", duration: 435 },
    { id: "y2l77rdRNrQ", title: "Playboi Carti - Rockstar Made", duration: 204 },
    { id: "aOFZ5igebjo", title: "Popcaan - Body So Good", duration: 232 },
    { id: "5mcfSL4pUtY", title: "Q - Take Me Where Your Heart Is", duration: 204 },
    { id: "1goLpyPx4ms", title: "Rauw Alejandro - Nubes", duration: 190 },
    { id: "c3OTeprmrRQ", title: "ROSALÍA - A Palé", duration: 148 },
    { id: "T51s4CAlXr4", title: "ROSALÍA - DI MI NOMBRE (Cap.8: Éxtasis)", duration: 190 },
    { id: "7VFQJPnlITg", title: "ROSALÍA feat. The Weeknd - LA FAMA", duration: 197 },
    { id: "tnJv78xq4WY", title: "ROSALÍA & J Balvin - Con Altura feat. El Guincho", duration: 169 },
    { id: "N2m9YTWTRoo", title: "Soulja Boy - Snap And Roll", duration: 232 },
    { id: "7YMl1U4PSO4", title: "Tokischa, Haraca Kiko, El Cherry Scom - Tukuntaso", duration: 204 },
    { id: "i4v0d6ZlXlU", title: "Tokischa & ROSALÍA - Linda", duration: 148 },
    { id: "HICC9w784So", title: "Alberto Stylee - Tumbando Fronte", duration: 176 },
    { id: "Lgk_BKkrqpo", title: "Ñejo & Dalmata - Vacilar Contigo", duration: 197 },
    { id: "v7mearaHENc", title: "Las Guanábanas - Vamos Pa la Disco", duration: 176 },
    { id: "uf95l-0zpv4", title: "Camarón de la Isla - Volando Voy", duration: 218 },
    { id: "5C0nJ9deHQs", title: "Young Cister - XULITA feat. Kaydy Cain", duration: 190 },
  ],
  // WorldWide FM
  "PLcOvg8kw-meEzc4o-VMBoFWsWI38MJ2A0": [
    { id: "c5Cw1aLuxo8", title: "Anushka - World in a Room", duration: 337 },
    { id: "cJDD1uERN3Y", title: "Trickski - Beginning", duration: 421 },
    { id: "6-BkJZ6WD54", title: "Jon Wayne - Black Magic", duration: 190 },
    { id: "3UqX3YMyhuk", title: "Kyodai - Breaking", duration: 421 },
    { id: "pjVh8GVfV3g", title: "Cashmere Cat - Mirror Maru", duration: 253 },
    { id: "AH8hKJpfdic", title: "CHVRCHES - Recover (Cid Rim Remix)", duration: 358 },
    { id: "wraG3MliIIs", title: "Django Django - Waveforms", duration: 281 },
    { id: "miXzgBeE_bw", title: "Clap! Clap! - Viajero", duration: 246 },
    { id: "r8GAOWvWLZw", title: "Flume - What You Need", duration: 260 },
    { id: "7owF0IMqb60", title: "Swindle - Forest Funk", duration: 288 },
    { id: "45lU9cniKsc", title: "Hackman - Forgotten Notes", duration: 281 },
    { id: "tKV4mylJ0DQ", title: "Four Tet - Kool FM", duration: 323 },
    { id: "5oJ4av6RPrY", title: "Guts - Brand New Revolution", duration: 302 },
    { id: "zIJzI8AChEo", title: "Toro Y Moi - Harm in Change", duration: 253 },
    { id: "41bD1DwKKbg", title: "Earl Sweatshirt feat. Vince Staples & Casey Veggies - Hive", duration: 288 },
    { id: "R8X6joNCQM0", title: "inc. - The Place", duration: 232 },
    { id: "Lm-1_pfq6Q8", title: "Jamie Lidell - Runaway", duration: 239 },
    { id: "brWj7OoObcw", title: "Dam-Funk - Killdat", duration: 428 },
    { id: "7-UKVVGv-Hw", title: "Jimmy Edgar - Let Yrself Be", duration: 386 },
    { id: "AQ24CtPoymY", title: "Lion Babe - Treat Me Like Fire", duration: 260 },
    { id: "MasyK_iVV5k", title: "Maga Bo feat. Rosangela Macedo and Marcelo Yuka - No Balanço da Canoa", duration: 274 },
    { id: "9_3OrWv4YKk", title: "Mala - Ghost", duration: 260 },
    { id: "_xR6flnUMJY", title: "Mount Kimbie - Made To Stray", duration: 302 },
    { id: "mb5hmNT6l5U", title: "Owiny Sigoma Band - Harpoon Land", duration: 148 },
    { id: "-RPuY89AP3s", title: "Portishead - Numb", duration: 246 },
    { id: "oFaCaL1IV8Q", title: "Richard Spaven - 1759", duration: 274 },
    { id: "4UQKbSqLaS8", title: "Roman GianArthur - I-69", duration: 253 },
    { id: "Fkf4yRAnsgM", title: "Sinkane feat. Salvatore Principato - Shark Week", duration: 141 },
    { id: "Ivptx7phdBE", title: "Randy Crawford - Street Life", duration: 267 },
    { id: "VDtGLWpkZwI", title: "The Gaslamp Killer - Nissim", duration: 281 },
    { id: "APcS7f2lwF0", title: "The Hics - Cold Air", duration: 246 },
    { id: "KvHrfjwTdeI", title: "Candido - Thousand Finger Man", duration: 568 },
    { id: "6-L-ZoUKj0w", title: "Tom Browne - Throw Down", duration: 246 },
    { id: "jcl1RozNj_E", title: "Tucillo & Kiko Navarro feat. Amor - Lovery (Slow Cuban Vibe Mix)", duration: 435 },
    { id: "JM2yV_hqMQ0", title: "Smokey Robinson - Why You Wanna See My Bad Side?", duration: 239 },
    { id: "y-sG49s8WaY", title: "William Onyeabor - Body & Soul", duration: 631 },
    { id: "N9YLIk1ZzyU", title: "Donald Byrd - You And The Music", duration: 337 },
    { id: "FbWs3w1sDRE", title: "Yuna - Live Your Life (MELO-X MOTHERLAND GOD MIX)", duration: 281 },
  ],
  // FlyLo FM
  "PLcOvg8kw-meGOL5oFLvoMHfr8z2WkdU5a": [
    { id: "9pAMzfP4dSw", title: "Aphex Twin - Windowlicker", duration: 358 },
    { id: "_kklHwYZoWI", title: "Captain Murphy - Evil Grin", duration: 134 },
    { id: "jadUtO7fC5c", title: "Clams Casino - Crystals", duration: 211 },
    { id: "wDLX1-HJ4a0", title: "Curtis Mayfield - Eddie You Should Know Better", duration: 141 },
    { id: "Y6wz1De91YY", title: "Dabrye - Encoded Flow", duration: 183 },
    { id: "LLJekKYEPHE", title: "Dimlite - Into Vogon Skulls", duration: 211 },
    { id: "YtAyGqunQLc", title: "Doris - You Never Come Closer", duration: 267 },
    { id: "N8308QyxKao", title: "Flying Lotus - Be Spin", duration: 211 },
    { id: "ySu5MLAs_bs", title: "Flying Lotus - Catapult Man", duration: 204 },
    { id: "5ooiFJvz5Zw", title: "Flying Lotus - Computer Face Rmx", duration: 211 },
    { id: "_ykCG3S07Gw", title: "Flying Lotus - Crosswerved", duration: 148 },
    { id: "L397YG71_Ps", title: "Flying Lotus - Early Mountain", duration: 113 },
    { id: "XrPEl3rhRUU", title: "Flying Lotus feat. Niki Randa - Getting There", duration: 120 },
    { id: "bpFZmIvrXlo", title: "DOOM - Masquatch", duration: 120 },
    { id: "Hpr3BIh7Llk", title: "Flying Lotus - Osaka Trade", duration: 169 },
    { id: "r9eMdR1-4dU", title: "Flying Lotus feat. Erykah Badu - See Thru To U", duration: 155 },
    { id: "TCKykX5vVHQ", title: "Flying Lotus - The Diddler", duration: 309 },
    { id: "L9wiVIz9nyg", title: "Flying Lotus feat. Krayzie Bone - Medication Medication", duration: 141 },
    { id: "Edf6Ppx2-LQ", title: "Flying Lotus feat. Niki Randa - The Kill", duration: 218 },
    { id: "uWGNFIbGL3o", title: "KNOWER - Fuck the Makeup, Skip the Shower", duration: 134 },
    { id: "pSlLwBU16eM", title: "Tyler, the Creator - Garbage", duration: 218 },
    { id: "O3nAXq0szBM", title: "The Gaslamp Killer - Shred You To Bits", duration: 162 },
    { id: "uYYoeUHmPLY", title: "Hudson Mohawke - 100hm", duration: 204 },
    { id: "pNaMT4s-35c", title: "DJ Rashad - It's Wack", duration: 309 },
    { id: "gpXpcfB_dt4", title: "Kaskade - 4 AM (Araabmuzik Remix)", duration: 274 },
    { id: "ZpGj2BGy2gg", title: "Kingdom - Stalker Ha", duration: 239 },
    { id: "qpACQSs1mc0", title: "Lapalux - Make Money", duration: 113 },
    { id: "6wOT_Vq2Muc", title: "Alain Goraguer - Meditation Des Enfants", duration: 99 },
    { id: "uru4GYxd7uo", title: "Mono/Poly & Thundercat - B Adams", duration: 106 },
    { id: "S0SaZ3nt5oY", title: "Outkast - Elevators (Me & You)", duration: 281 },
    { id: "lR9MQZ5pxyg", title: "Shadow Child - 23", duration: 351 },
    { id: "i14ZiwPb-ro", title: "Machinedrum - She Died There", duration: 253 },
    { id: "tSlzR8s0QM0", title: "Flying Lotus - Stonecutters", duration: 267 },
    { id: "gKRfd73LVg8", title: "Alain Goraguer - Ten Et Tiwa Dorment", duration: 113 },
    { id: "Y7G2gN_DsNE", title: "Thundercat - Oh Sheit It's X", duration: 239 },
    { id: "RmCAPYKt9gE", title: "XXYYXX - Work Title: What We Want", duration: 225 },
  ],
  // The Lowdown 91.1
  "PLcOvg8kw-meH0qwiyzV-5YeqBTHBxrahO": [
    { id: "59eeL-u-I18", title: "The Soul Searchers - Ashley's Roachclip", duration: 344 },
    { id: "FqnNY-yY4Aw", title: "B.T. Express - Do It ('Til You're Satisfied)", duration: 198 },
    { id: "VK35C7vr0as", title: "Brass Construction - Changin'", duration: 505 },
    { id: "IvgAps4Ty5s", title: "The Chakachas - Stories", duration: 261 },
    { id: "mdxNjp6ezHE", title: "George McCrae - I Get Lifted", duration: 167 },
    { id: "_aHXEL3KrDY", title: "Aaron Neville - Hercules", duration: 260 },
    { id: "VzHP7Pq5-Qc", title: "Jackson Sisters - I Believe In Miracles", duration: 190 },
    { id: "vkhr3c-oG3Q", title: "Johnny Guitar Watson - Superman Lover", duration: 351 },
    { id: "S08GR_Xvjto", title: "Marlena Shaw - California Soul", duration: 190 },
    { id: "JOmygI6Asmk", title: "Ohio Players - Climax", duration: 260 },
    { id: "_JzyS91rRtA", title: "Pleasure - Bouncy Lady", duration: 239 },
    { id: "SW-H40A0_yM", title: "Smokey Robinson - Cruisin", duration: 365 },
    { id: "5x5_mLQfTXg", title: "The Delfonics - Funny Feeling", duration: 302 },
    { id: "LQGplsP5biQ", title: "The Delfonics - Ready or Not Here I Come", duration: 127 },
    { id: "V41DeiyyDfY", title: "The Five Stairsteps - O-o-h Child", duration: 204 },
    { id: "5TQfiMNxy_4", title: "The Trammps - Rubberband", duration: 323 },
    { id: "bHf3GUSHC4M", title: "The Undisputed Truth - Smiling Faces Sometimes", duration: 197 },
    { id: "WIH7AyIYrvk", title: "El Chicano - Viva Tirado", duration: 288 },
    { id: "m1gIkqjDqCA", title: "War - Cisco Kid", duration: 281 },
    { id: "hRAMiSPST6k", title: "War feat Eric Burdon - Magic Mountain", duration: 260 },
  ],
  // The Lab 94.5 FM
  "PLcOvg8kw-meHaJErGnltFCxFNlrwpTJYE": [
    { id: "dkeGpLJkAsc", title: "Ab-Soul feat. Aloe Blacc - Trouble", duration: 232 },
    { id: "gSh3xvXCfm8", title: "Popcaan feat. Freddie Gibbs - Born Bad", duration: 218 },
    { id: "d29S7cfxfgs", title: "Curren$y & Freddie Gibbs - Fetti", duration: 288 },
    { id: "ybusMbY05Jw", title: "E-40 feat. Dam-Funk & Ariel Pink - California", duration: 246 },
    { id: "L-0IlDOaDRM", title: "Gangrene feat. Samuel T. Herring & Earl Sweatshirt - Play It Cool", duration: 246 },
    { id: "_bFgmCDWicw", title: "Phantogram - K.Y.S.A", duration: 274 },
    { id: "2CHeW8Kwo4M", title: "King Avriel feat. A$AP Ferg - 20's 50's 100's", duration: 274 },
    { id: "jU7PS5kmiTA", title: "Wavves - Leave", duration: 204 },
    { id: "wQW-QKhw8e4", title: "MNDR feat. Killer Mike - Lock & Load", duration: 274 },
    { id: "IjTD3-3aioE", title: "MC Eiht & Freddie Gibbs feat. Kokane - Welcome to Los Santos", duration: 239 },
    { id: "O-VGUTj0LQA", title: "Tunde Adebimpe feat. Sal P & Sinkane - Speedline Miracle Masterpiece", duration: 260 },
    { id: "pma4fqIS18k", title: "Vybz Kartel - Fast Life", duration: 218 },
    { id: "5yVVY7yL0mY", title: "Little Dragon - Wanderer", duration: 288 },
  ],
  // Radio Mirror Park 88.9 FM
  "PLcOvg8kw-meGZWEOwNC-Pmf8nOAUsQaDO": [
    { id: "Mwbb60VouYk", title: "!!! - One Girl/One Boy", duration: 218 },
    { id: "IHJytpcdk9s", title: "Age of Consent - Colours", duration: 267 },
    { id: "L34CZjCrZSQ", title: "Age of Consent - Heartbreak", duration: 225 },
    { id: "QwtkmFl1F34", title: "Battle Tapes - Feel the Same", duration: 281 },
    { id: "CFed_5cYteg", title: "Black Strobe - Boogie in Zero Gravity", duration: 211 },
    { id: "unnQAH0p0o4", title: "Neon Indian - Change Of Coast", duration: 204 },
    { id: "l8Suka4mfHk", title: "Dan Croll - From Nowhere (Baardsen Remix)", duration: 274 },
    { id: "Q_dn8aDBzNc", title: "Feathers - Dark Matter", duration: 239 },
    { id: "MHUsufBOFmA", title: "DJ Mehdi - Lucky Boy (Outlines Remix)", duration: 274 },
    { id: "aHz3G6GUsH8", title: "Dom - Living In America", duration: 197 },
    { id: "4JJpD9F1bmU", title: "Yeasayer - Don't Come Close", duration: 218 },
    { id: "7-jwdfT7ZII", title: "HEALTH - High Pressure Dave", duration: 197 },
    { id: "hRfpmBwgN4U", title: "Holy Ghost! - Hold On", duration: 365 },
    { id: "W5BPMvfEwxY", title: "Hot Chip - Flutes", duration: 477 },
    { id: "5qsJBpUTfL8", title: "Jai Paul - Jasmine (Demo Version)", duration: 260 },
    { id: "-nlOYgUUkPE", title: "Little Dragon - Crystalfilm", duration: 267 },
    { id: "ttdfUH8CoPM", title: "Living Days - Little White Lie", duration: 176 },
    { id: "jOJRBF4PLKs", title: "Mitzi - Truly Alive", duration: 316 },
    { id: "anrQXv_8WoQ", title: "Neon Indian - Polish Girl", duration: 267 },
    { id: "H4c42bscBjw", title: "Niki and the Dove - The Drummer", duration: 239 },
    { id: "E6mr4aXuAeM", title: "Nite Jewel - Nowhere To Go", duration: 246 },
    { id: "Zsk5elXd2VA", title: "Panama - Always", duration: 246 },
    { id: "FaALSwG_llo", title: "Poolside - Do You Believe?", duration: 260 },
    { id: "3dGvq-Lw9Wg", title: "SBTRKT feat. Roses Gabor - Pharaohs", duration: 225 },
    { id: "8FPPYLxAoes", title: "Scenic - Mesmerised", duration: 225 },
    { id: "o4uaENOLiqM", title: "Twin Shadow - Shooting Holes", duration: 211 },
    { id: "w0lHQpfOsGA", title: "The Chain Gang of 1974 - Sleepwalking", duration: 225 },
    { id: "uW17Sypofzo", title: "Toro Y Moi - So Many Details", duration: 295 },
    { id: "-vjIVTDXzrU", title: "Miami Horror - Sometimes", duration: 260 },
    { id: "nAa6O0rlatw", title: "Cut Copy - Strangers in the Wind", duration: 288 },
    { id: "p5ojpTXIsCw", title: "The C90s - Shine A Light (Flight Facilities Remix)", duration: 351 },
    { id: "m65r38wWYnE", title: "The Ruby Suns - In Real Life", duration: 253 },
    { id: "vgbOeVhWmYQ", title: "Favored Nations - The Set Up", duration: 211 },
    { id: "XYSOejrYlFo", title: "Tony Castles - Heart In The Pipes (KAUF Remix)", duration: 295 },
    { id: "UkiQguOZAm0", title: "Toro Y Moi - New Beat", duration: 253 },
    { id: "KqkKSpgjaRc", title: "Twin Shadow - Forget", duration: 232 },
    { id: "oKwLtOthfYE", title: "Twin Shadow - Old Love - New Love", duration: 232 },
    { id: "TzBa4XAR_yo", title: "KAUF - When You're Out", duration: 316 },
    { id: "wGIxJ1G2JAE", title: "Y.A.C.H.T. - Psychic City (Classixx Remix)", duration: 260 },
    { id: "y5_cKIr_D20", title: "Yeasayer - O.N.E.", duration: 323 },
  ],
  // K.U.L.T 99.1 FM
  "PLcOvg8kw-meHKk-0CTqIKNFURtcMN2-vk": [
    { id: "4OgC-3dgutM", title: "Joy Division - She's Lost Control", duration: 246 },
    { id: "FJm6z2bk9Ro", title: "Automatic - Too Much Money", duration: 141 },
    { id: "r2Up2FXpUJY", title: "Colourbox - Baby I Love You So", duration: 414 },
    { id: "4c70g2CqNJA", title: "Icky Blossoms - Cycle", duration: 197 },
    { id: "dNdZ31BNG64", title: "Danzig - Deep", duration: 246 },
    { id: "S8FYa9HM3Cg", title: "The Stooges - Down On The Street", duration: 232 },
    { id: "NjmXcmraCog", title: "Crack Cloud - Drab Measure", duration: 288 },
    { id: "Yts6mdFzax8", title: "Grauzone - Eisbär", duration: 302 },
    { id: "ONem2TD37BA", title: "Certain Ratio - Faceless", duration: 148 },
    { id: "Ys7iT-TbPR8", title: "Ariel Pink - Four Shadows", duration: 232 },
    { id: "09hSrZEpj-g", title: "Viagra Boys - Girls and Boys", duration: 288 },
    { id: "hce5ZrVU9NI", title: "The Strokes - Hard to Explain", duration: 232 },
    { id: "GllCjH_nFbM", title: "The Cramps - Human Fly", duration: 141 },
    { id: "42ZXWig7I84", title: "T La Rock - It's Yours", duration: 274 },
    { id: "kvZwBMC95Og", title: "The Voidz - Where No Eagles Fly", duration: 295 },
    { id: "NgPjV_OSKLI", title: "Charanjit Singh - Madhuvanti", duration: 316 },
    { id: "fDNtgiGLxPc", title: "MC Shan Feat. TJ Swan - Left Me Lonely", duration: 267 },
    { id: "Mh2OFHny7QU", title: "DAF - Liebe Auf Den Ersten Blick", duration: 246 },
    { id: "wvTQ615gA6Y", title: "LL Cool J - Going Back to Cali", duration: 239 },
    { id: "EFE1KDKYfKU", title: "Mac DeMarco - On the Level", duration: 239 },
    { id: "ycEB17Bwsx4", title: "Connie Francis - Many Tears Ago", duration: 120 },
    { id: "5AOyp-a8fx8", title: "New Order - Age of Consent", duration: 330 },
    { id: "bDJl3pmt8tY", title: "Nick Lowe - So It Goes", duration: 162 },
    { id: "VoyDiOHBfBE", title: "Iggy Pop - Nightclubbing", duration: 267 },
    { id: "YjrhFjys09o", title: "Lea Porcelain - Pool Song", duration: 246 },
    { id: "fYov2Br0o1U", title: "Ramones - Time Bomb", duration: 134 },
    { id: "LlJWEs260BU", title: "Gloria Jones - Tainted Love", duration: 169 },
    { id: "tsbiY9U7BWg", title: "Promiseland - Take Down The House", duration: 197 },
    { id: "g48QtNwzSTk", title: "The Strokes - The Adults Are Talking", duration: 323 },
    { id: "srDwxhSPTd4", title: "The The - This is the Day", duration: 309 },
    { id: "FzBTm4WNbCQ", title: "The Voidz - Alien Crime Lord", duration: 281 },
    { id: "ZS3BQ7M8rts", title: "Misfits - TV Casualty", duration: 155 },
    { id: "Wumb1enyo3s", title: "The Slits - Typical Girls", duration: 246 },
  ],
  // Space 103.2
  "PLcOvg8kw-meGL15-BOEy5y7iA59PxtZ4x": [
    { id: "P1VTot8rKLw", title: "Cameo - Back and Forth", duration: 239 },
    { id: "zQIHYkwhHC0", title: "Billy Ocean - Nights (Feel Like Gettin' Down)", duration: 288 },
    { id: "-lkwFKn9JjE", title: "Bootsy's Rubber Band - I'd Rather Be With You", duration: 309 },
    { id: "p3Gj707dSw4", title: "Kano - Can't Hold Back (Your Loving)", duration: 470 },
    { id: "Auipg1VkXiE", title: "Central Line - Walking Into Sunshine", duration: 477 },
    { id: "GU3o4zkcs1I", title: "D-Train - You're the One for Me", duration: 442 },
    { id: "UJTlr4uekQU", title: "Roger - Do It Roger", duration: 512 },
    { id: "MdK42yH8bEE", title: "Eddie Murphy - Party All the Time", duration: 267 },
    { id: "TsXODaEm-rM", title: "The Fatback Band - Gotta Get My Hands On Some (Money)", duration: 491 },
    { id: "jLizn_C85G8", title: "Sho Nuff - Funkasize You", duration: 176 },
    { id: "3NLGBruKDIY", title: "Bernard Wright - Haboglabotribin’", duration: 274 },
    { id: "NfeRvTiNl0s", title: "Zapp - Heartbreaker, Pts. 1-2", duration: 260 },
    { id: "sb9cnBLySXI", title: "Evelyn \"Champagne\" King - I'm in Love (12\" Version)", duration: 365 },
    { id: "nrLCaC6n5Tc", title: "Imagination - Flashback", duration: 274 },
    { id: "cUd5dvJ-RGY", title: "Dazz Band - Joystick", duration: 316 },
    { id: "XGnro6IHfSs", title: "Kleeer - Tonight", duration: 323 },
    { id: "QBsnTXB9Y2w", title: "One Way - Cutie Pie", duration: 344 },
    { id: "x2wUtxDJ-y0", title: "Parliament - Flash Light", duration: 281 },
    { id: "BbTiXaDz-no", title: "Parliament - Mothership Connection (Star Child)", duration: 379 },
    { id: "QQ94nGJbEZ0", title: "Rick James - Give It to Me Baby", duration: 253 },
    { id: "MR8KVFp4pzc", title: "Stevie Wonder - Skeletons", duration: 309 },
    { id: "3UEm_TjXVd8", title: "Taana Gardner - Heartbeat (Club Version)", duration: 610 },
  ],
  // Vinewood Boulevard Radio
  "PLcOvg8kw-meG82hpkH24t1LWbIkK-eRoN": [
    { id: "ODu9mP9EOpU", title: "Bass Drum of Death - Crawling After You", duration: 239 },
    { id: "NxA2VI21mZQ", title: "Bleached - Next Stop", duration: 162 },
    { id: "8hjczn4VxkE", title: "Ceremony - Hysteria", duration: 162 },
    { id: "_LF56YCM-ds", title: "Coliseum - Used Blood", duration: 239 },
    { id: "j0wUOBovyIM", title: "FIDLAR - Cocaine", duration: 204 },
    { id: "HIbkq8YoEHc", title: "JEFF the Brotherhood - Sixpack", duration: 162 },
    { id: "DeEYCBt-YNk", title: "Hot Snakes - This Mystic Decade", duration: 197 },
    { id: "avXNzHQu92k", title: "METZ - Wet Blanket", duration: 246 },
    { id: "7RjhDk0uvSI", title: "Mind Spiders - Fall in Line", duration: 225 },
    { id: "G7sttKOdyb4", title: "Moon Duo - Sleepwalker", duration: 309 },
    { id: "p1E5dZnUjN4", title: "Nobunny - Gone For Good", duration: 211 },
    { id: "dppfS2T_Ves", title: "Sam Flax - Fire Doesn't Burn Itself", duration: 337 },
    { id: "iE0EqVaHgI0", title: "Shark? - California Grrls", duration: 190 },
    { id: "L2F2B8fp1TQ", title: "The Black Angels - Black Grease", duration: 281 },
    { id: "Q8sVNQmAQt8", title: "The Men - Turn It Around", duration: 246 },
    { id: "xMQkp8VBdbM", title: "The Orwells - Who Needs You", duration: 211 },
    { id: "fw61Et3xkKg", title: "The Soft Pack - Answer to Yourself", duration: 211 },
    { id: "G6t1Qvg7sbo", title: "Thee Oh Sees - The Dream", duration: 428 },
    { id: "qEJ0nr73gnw", title: "Ty Segall Band - Diddy Wah Diddy", duration: 155 },
    { id: "j2Qz7Di9n4E", title: "Wavves - Nine Is God", duration: 309 },
  ],
  // Blonded Radio 97.8 FM
  "PLcOvg8kw-meHQIDTWDnRBiQp74YyD9q3a": [
    { id: "EMh85xr7U-w", title: "Aphex Twin - IZ-US", duration: 183 },
    { id: "ODQk0pvDaug", title: "Burial - Hiders", duration: 288 },
    { id: "dWRnszCPIOI", title: "Frank Ocean - Crack Rock", duration: 232 },
    { id: "S4uV-J_Tig8", title: "Curtis Mayfield - So In Love", duration: 323 },
    { id: "iOyouETsz7A", title: "Jay-Z - Dead Presidents II", duration: 274 },
    { id: "-pnupjc-o78", title: "Drexciya - Andreaen Sand Dunes", duration: 386 },
    { id: "JNiZbjJXHCY", title: "Frank Ocean - Chanel", duration: 218 },
    { id: "JFjS3JFaj10", title: "Frank Ocean - Ivy", duration: 260 },
    { id: "cL-lXo-aSmc", title: "Frank Ocean - Nights", duration: 316 },
    { id: "8YzuEaWFkkI", title: "Frank Ocean - Pretty Sweet", duration: 169 },
    { id: "PnUooa1nY2Y", title: "Frank Ocean - Provider", duration: 253 },
    { id: "fgTCzQhTh2E", title: "Future - Codeine Crazy", duration: 358 },
    { id: "5CQgfZLSiAg", title: "Gunna feat. Playboi Carti - YSL", duration: 162 },
    { id: "HN2AV1gF0p4", title: "Todd Rundgren - International Feel", duration: 176 },
    { id: "_KM-CMSZS88", title: "Jme feat. Giggs - Man Don't Care", duration: 218 },
    { id: "1jZ_qVVCOQ0", title: "Joy Again - On A Farm", duration: 113 },
    { id: "jhg4rgosICw", title: "Les Ya Toupas Du Zaire - Je ne bois pas beaucoup", duration: 554 },
    { id: "0GW2D01Nw_w", title: "Lil Uzi Vert - For Real", duration: 183 },
    { id: "zlDxAUExbjo", title: "MC Mack - EZ Come, EZ Go", duration: 246 },
    { id: "nhFs2WQZnDg", title: "Marvin Gaye - When Did You Stop Loving Me", duration: 386 },
    { id: "xUafJIO9N3E", title: "(Sandy) Alex G - Master", duration: 120 },
    { id: "jyY2Y9o04ro", title: "Lil Sko - Miss White Cocaine", duration: 218 },
    { id: "neOmMVKr6IU", title: "Panda Bear - Mr Noah", duration: 225 },
    { id: "DovFbsAinFk", title: "ScHoolboy Q feat. Lance Skiiiwalker - Kno Ya Wrong", duration: 337 },
    { id: "RquI-8Ljf6c", title: "Suspect - FBG", duration: 197 },
    { id: "rjxHlEJVSJw", title: "SWV - Rain", duration: 260 },
    { id: "uKBrHMerrlM", title: "Chief Keef feat. King Louie - Winnin", duration: 253 },
    { id: "bx0JQZuoiGY", title: "Migos - First 48", duration: 218 },
  ],
  // Los Santos Underground Radio
  "PLcOvg8kw-meFHacXowIl8VdIEdNGmV81t": [
    { id: "dRtl08hqGi8", title: "Adam Port - Planet 9", duration: 456 },
    { id: "d_w3M1-eUGs", title: "Am$trad Billionaire - The Plan", duration: 456 },
    { id: "Onj6Inot-EQ", title: "Ara Koufax - Natural States", duration: 393 },
    { id: "-PMA90NY4lI", title: "Cevin Fisher - The Freaks Come Out", duration: 610 },
    { id: "K1Rt_555ZJ4", title: "Solomun - Customer Is King", duration: 491 },
    { id: "JTqWSy5vxmE", title: "D. Lynnwood - Bitcoins", duration: 267 },
    { id: "PhcRA3Ppkrw", title: "Floorplan - Spin", duration: 372 },
    { id: "au3yoB1FhL8", title: "Solomun - Ich Muss Los", duration: 456 },
    { id: "GJ8nFtIkm8o", title: "Johannes Brecht - Incoherence", duration: 407 },
    { id: "xNMlcHA0KPg", title: "Leonard Cohen - You Want It Darker", duration: 582 },
    { id: "fB2kqcYVwAM", title: "Denis Horvat - Madness Of Many", duration: 435 },
    { id: "_CxWqdh-OKU", title: "Matthew Dear - Monster", duration: 323 },
    { id: "J6-p5iLfQ8A", title: "Bryan Ferry - Don't Stop The Dance (Todd Terje Remix)", duration: 645 },
    { id: "CjNQwidpViU", title: "Chris Lum - You're Mine", duration: 498 },
    { id: "PW3dlBCDJg0", title: "Swayzak - In The Car Crash", duration: 372 },
    { id: "-kkvR8S-J_g", title: "Dubfire - The End To My Beginning", duration: 533 },
    { id: "SrkZ_Q8wrKM", title: "Alex Metric & Ten Ven - The Q", duration: 379 },
    { id: "EqatnZGoicI", title: "Truncate - WRKTRX3", duration: 323 },
    { id: "Xx6676kF30Y", title: "Sharif Laffrey - And Dance", duration: 876 },
    { id: "__7tb5ATlEE", title: "Caravaca - Yes I Do", duration: 330 },
    { id: "ECjIUNQz8Hs", title: "Carl Finlow - Convergence", duration: 351 },
    { id: "-w9ITLZMFEs", title: "AUX 88 - Sharivari", duration: 337 },
    { id: "1U7XBpIiz0w", title: "Future Four - Connection", duration: 400 },
    { id: "Ed-zIrWY_IE", title: "Tuff City Kids ft. Joe Goddard - Reach Out", duration: 351 },
    { id: "0I34zh1_XfY", title: "Mashrou' Leila - Roman", duration: 365 },
    { id: "xOXtrQQUQ-0", title: "Oni Ayhun - OAR03-B", duration: 694 },
    { id: "zQbSLPrtiIo", title: "Rite De Passage - Quinquerime", duration: 169 },
    { id: "Bn_hYxmK-cw", title: "Ron Hardy - Sensation", duration: 589 },
    { id: "5zkThpci60g", title: "Romanthony - Bring U Up", duration: 428 },
    { id: "2_1W23qzVNc", title: "Solar - 5 Seconds", duration: 435 },
    { id: "NkvsKuUxX2A", title: "Marcus L. - Telstar", duration: 421 },
    { id: "hqpGCigolFA", title: "Warp Factor 9 - The Atmospherian", duration: 281 },
    { id: "2ukGRz6eWOo", title: "The Egyptian Lover - Electro Pharaoh", duration: 449 },
    { id: "mbl-CrX0o5o", title: "Tale of Us - 1911", duration: 421 },
    { id: "SJ3Sbo-eaKw", title: "Tale of Us - Another World", duration: 414 },
    { id: "pUb9NbaZR4Q", title: "Tale of Us - Anywhere", duration: 351 },
    { id: "DVwzJYaUFEU", title: "Tale of Us - Disgracelands", duration: 337 },
    { id: "9JUisj9Xv_w", title: "Tale of Us - Endless Journey", duration: 386 },
    { id: "OIblUTMZ2Dc", title: "Tale of Us - Fisherman's Horizon", duration: 435 },
    { id: "RRZdmKPjTlo", title: "Tale of Us - Heart Of Darkness", duration: 372 },
    { id: "wlnUsDBm_ys", title: "Tale of Us - In Hyrule", duration: 449 },
    { id: "okcZRBrOPO4", title: "Tale of Us - Morgan's Fate", duration: 463 },
    { id: "V3JDwfT6LgE", title: "Tale of Us - Myst", duration: 505 },
    { id: "396UiQkyGf4", title: "Tale of Us - Overture", duration: 274 },
    { id: "COuW5RWWSrU", title: "Tale of Us - Seeds", duration: 470 },
    { id: "jCp6m4V_87k", title: "Tale of Us - Solitude", duration: 421 },
    { id: "skPeqlxLj1o", title: "Tale of Us - Symphony Of The Night", duration: 428 },
    { id: "jc5rafNZbzY", title: "Tale of Us - The Portal", duration: 295 },
    { id: "-zijM6oVCV4", title: "Tale of Us - Trevor's Dream", duration: 400 },
    { id: "gbMQWTulo44", title: "Tale of Us - Valkyr", duration: 421 },
    { id: "DI-p2xUBZFE", title: "Tale of Us - Vinewood Blues", duration: 463 },
    { id: "-7l4_4zVJTc", title: "Art Of Noise - Beat Box", duration: 302 },
    { id: "2hejWh6i3r4", title: "Joe Jackson - Steppin' Out", duration: 225 },
    { id: "rykfQwIaIC4", title: "Metro Area - Miura", duration: 421 },
    { id: "re9Fw8_puzI", title: "Nancy Martin - Can't Believe", duration: 400 },
    { id: "m7yrX_Kzjac", title: "P-Funk All Stars - Hydraulic Pump Pt. 3", duration: 540 },
    { id: "9q5jzulkDaU", title: "Ron Hardy - Sensation", duration: 589 },
    { id: "vaLf-yvjTQ8", title: "Steve Poindexter - Computer Madness", duration: 260 },
    { id: "QE1mqCSrBNU", title: "Ten City - Devotion", duration: 442 },
    { id: "bNPO4oaa9yQ", title: "The Black Madonna - A Jealous Heart Never Rests", duration: 505 },
    { id: "127Mdp98MUk", title: "The Black Madonna - He Is The Voice I Hear", duration: 652 },
    { id: "Q44Q0HB3zAA", title: "The Black Madonna - We Can Never Be Apart", duration: 463 },
    { id: "PagQa6VU2S8", title: "The Black Madonna ft. Jamie Principle - We Still Believe", duration: 421 },
    { id: "T8UOVvQ9HE0", title: "Tiga - Bugatti", duration: 330 },
    { id: "7LJADPWqwlI", title: "Derrick Carter - Where U At", duration: 400 },
  ],
  // Still Slipping Los Santos
  "PLcOvg8kw-meFIt3Q1_cOJ3pQrCBn9tZhH": [
    { id: "SdVtAqgRfoY", title: "DJ N**** Fox - 5 Violinos", duration: 267 },
    { id: "nfl0Q1RYwzE", title: "Kemikal - A Wah!", duration: 246 },
    { id: "2YZsTmsnLsw", title: "Mez - Babylon Can't Roll", duration: 183 },
    { id: "ciSKeWxLEHY", title: "Joy Orbison - Coyp", duration: 344 },
    { id: "KG-tHEMOD08", title: "Cruel Santino - Sparky", duration: 155 },
    { id: "cahuLhEMCYM", title: "DJ Byano - Digdim Patrol", duration: 127 },
    { id: "HTYTCuSzT18", title: "DJ Scud - No Love", duration: 218 },
    { id: "JeYKYKgm06s", title: "Frank Ocean - Cayendo (Sango Remix)", duration: 183 },
    { id: "KkyGEeFORoc", title: "Frankel & Harper - Trimmers (Instinct Remix)", duration: 330 },
    { id: "fXA8dE4ojKM", title: "Horsepower Productions - Givin' Up On Love", duration: 442 },
    { id: "6VWGf7Hv-DU", title: "Josi Devil - The Devil's Dance", duration: 239 },
    { id: "MPketZ5xS3U", title: "Joy Orbison & Overmono - Bromley", duration: 421 },
    { id: "ls6kFTgpgwc", title: "KO - Whip", duration: 183 },
    { id: "pYwBzkGctfA", title: "KO & Joy Orbison - Movements", duration: 190 },
    { id: "l6qeY4bJ8F4", title: "Kwengface - Mad About Bars", duration: 274 },
    { id: "qJ0iIVunU88", title: "L U C Y - Almost Blue", duration: 183 },
    { id: "G387VYKmbWg", title: "M1llionz - No Rap Cap", duration: 197 },
    { id: "QnsQ6FaR5B8", title: "Mr. Mankwa - Feediback", duration: 183 },
    { id: "MnRJR2K2h2E", title: "Mr. Mitch - Not Modular", duration: 400 },
    { id: "tBhDs7n1KUQ", title: "PA Salieu - No Warnin'", duration: 204 },
    { id: "e4TtDkiJMTA", title: "Instinct - Operation", duration: 358 },
    { id: "UraNQ23W56E", title: "Overmono - Pieces of 8", duration: 337 },
    { id: "QvN-v201gGM", title: "Backroad Gee feat. Ambush & PA Salieu - Party Popper", duration: 225 },
    { id: "X3xhlzPJxuI", title: "Pearly - Polar", duration: 197 },
    { id: "oie62p-fnwU", title: "RAP - Mad Friday", duration: 267 },
    { id: "AWhM75ebVJ8", title: "Blanco - Shippuden", duration: 190 },
    { id: "7W5tgDkGSis", title: "Spooky - Joyride", duration: 260 },
    { id: "9SpmfJIc_Tg", title: "Poison Anna - Submission", duration: 183 },
    { id: "3g3aZ0BoN1A", title: "Thomas Bush - Presence: Martin", duration: 190 },
    { id: "NtmrY4Y3fkA", title: "Time Cow & RTKAL - Elephant Man", duration: 428 },
    { id: "NVMe9jX2AJk", title: "Waifer - Shower Hour", duration: 197 },
    { id: "22HMxUYc_Gw", title: "Céline Gillain - Wealthy Humans", duration: 295 },
  ],
};

/** The GTA V Radio Commercials video; each ad is one of its chapters. */
const COMMERCIALS_VIDEO = "2QF_sZa-qk0";
const COMMERCIALS_END = 4452;

/** [chapter start in seconds, ad name]; an ad runs until the next chapter starts. */
const ADS: [number, string][] = [
  [0, "Alcoholla"],
  [69, "Up 'n' Atom"],
  [93, "Vinewood Health"],
  [152, "San Andreas Water & Power"],
  [190, "Righteous Slaughter 7"],
  [220, "Appropriate Associates"],
  [276, "Rehab Island"],
  [325, "Fly US"],
  [346, "Sue Murry For Governor"],
  [391, "DigiFarm"],
  [440, "Whiz Wireless"],
  [482, "Pride Not Prejudice"],
  [531, "Proposition 208"],
  [564, "Serious Cougar"],
  [594, "Epsilon Program"],
  [621, "Toeshoes"],
  [647, "Hitting Kids Works Wonders"],
  [690, "San Andreas Tourism Board"],
  [743, "LS Benders"],
  [794, "Jay's Bail Bonds"],
  [836, "Ammunation Apocalypse Kit"],
  [908, "Bravado"],
  [971, "Proposition 14"],
  [1008, "Crevis"],
  [1050, "Ovine Human Resources Academy"],
  [1099, "13 Steps To Heaven"],
  [1159, "Jock Cranley For Governor"],
  [1217, "Pisswasser"],
  [1302, "Fly US"],
  [1319, "P.I.C Prison Industrial Complex"],
  [1358, "Shark Credit Cards"],
  [1405, "Life Invader Tablet"],
  [1439, "FLEECA"],
  [1482, "Proposition 208"],
  [1508, "Cuckold Therapy"],
  [1570, "Unlock The Power"],
  [1630, "San Andreas State Lottery"],
  [1657, "Righteous Slaughter 7"],
  [1714, "YouTool"],
  [1770, "Chains of Intimacy"],
  [1806, "Preservex"],
  [1848, "Toilet Cleaner"],
  [1879, "Rectify Holistic"],
  [1927, "Hammerstein & Faust Employment Law"],
  [1972, "Darwinian Yoga"],
  [2013, "13 Steps To Heaven"],
  [2037, "Pride Not Prejudice"],
  [2097, "Lorenzo O'houlihan Dream Maker"],
  [2162, "M.M.A"],
  [2203, "Windsor Real Estate"],
  [2247, "Pontius Advanced Hand Sanitizer"],
  [2300, "Flow Water"],
  [2352, "Donate Your Car"],
  [2394, "FLEECA"],
  [2440, "Egochaser Energy Bar"],
  [2492, "Proposition 43"],
  [2527, "Night Lights"],
  [2580, "Menopause Adventures"],
  [2651, "Gastro Band Surgery"],
  [2711, "Hitting Kids Works Wonders"],
  [2736, "San Andreas Flight School"],
  [2792, "LS Benders"],
  [2851, "Floyd's Scrap Metal Emporium"],
  [2904, "Fly US"],
  [2926, "Stop Paying Your Mortgage"],
  [2970, "Bravado"],
  [3004, "Implant Outsource"],
  [3042, "Los Santos Chamber of Commerce"],
  [3102, "Larry's Used RV Sales"],
  [3155, "13 Steps To Heaven"],
  [3184, "Grand Senora Desert Tourism Board"],
  [3223, "Blaine County Savings Bank"],
  [3257, "P.I.C Prison Industrial Complex"],
  [3325, "Unlock The Power"],
  [3372, "Smoked Dreams"],
  [3435, "Epsilon Program"],
  [3464, "Buddy's Trucking"],
  [3515, "Jock Cranley For Governor"],
  [3562, "Queensbury Boxing"],
  [3611, "Crevis"],
  [3651, "DigiFarm Spin-offs"],
  [3708, "Righteous Slaughter 7"],
  [3759, "Economic Recovery Group"],
  [3794, "Lombank"],
  [3858, "Proposition 45"],
  [3909, "Chains of Intimacy"],
  [3958, "Race To Pluto"],
  [3988, "Ammunation Apocalypse Kit"],
  [4070, "San Andreas State Lottery"],
  [4094, "Grain Of Truth Food Stores"],
  [4158, "Electrotoke E-Pipe"],
  [4208, "13 Steps To Heaven"],
  [4236, "Windsor Real Estate"],
  [4297, "San Andreas Labotomy"],
  [4337, "Don's Country Store"],
  [4382, "Cumulonimbus Computing"],
];

/** One thing on air: a whole song, or one ad cut out of the commercials video. */
export interface Item {
  videoId: string;
  title: string;
  /** Seconds into the video where this item begins. */
  start: number;
  /** Seconds. */
  duration: number;
  ad: boolean;
  /** A Weazel News bulletin, which opens each ad break. */
  news?: boolean;
}

const AD_ITEMS: Item[] = ADS.map(([start, title], i) => ({
  videoId: COMMERCIALS_VIDEO,
  title,
  start,
  duration: (i + 1 < ADS.length ? ADS[i + 1][0] : COMMERCIALS_END) - start,
  ad: true,
}));

/** Weazel News bulletins (GTA V); each ad break opens with one, in rotation. */
const NEWS: [string, string, number][] = [
  ["5wxaQai1zxM", "#1", 150],
  ["_DKogYCbmGI", "#2: Repossession", 151],
  ["0-Vj6vgtGfU", "#3: Complications", 104],
  ["lW7DgiAIUr0", "#4: Father/Son", 149],
  ["U9wtBZjnxto", "#5: Marriage Counseling", 121],
  ["rQMYbvBGbeE", "#6: The Long Stretch", 142],
  ["HjC7qfBYCL4", "#7: Friend Request", 100],
  ["tduQRoKwRUA", "#8: The Jewel Store Job [Smart Approach]", 132],
  ["yYpUS1nCKn0", "#9: The Jewel Store Job [Loud Approach]", 126],
  ["rkGldBBfadk", "#10: Nervous Ron", 103],
  ["WoKeCdDsae0", "#11: Trevor Philips Industries", 122],
  ["o6lMMW8gPdY", "#12", 124],
  ["Wgg9Rb8sclA", "#13: Friends Reunited", 83],
  ["rHF1cTe7t9w", "#14: Fame or Shame", 150],
  ["YG_Kfk93RYU", "#15: Three's Company", 131],
  ["fkGZgmcESIg", "#16: By the Book", 74],
  ["niIKL28aLhw", "#17: Hood Safari/Blitz Play Version 1", 88],
  ["1-yOuJkyY0U", "#18: Hood Safari/Blitz Play Version 2", 101],
  ["jRkT7SmaFjw", "#19: Blitz Play", 112],
  ["Lb2EZzJkzTk", "#20", 67],
  ["YdGVpS2gE78", "#21: The Merryweather Heist [Freighter]", 121],
  ["qY15kwDijTs", "#22: Eye in the Sky Version 1", 116],
  ["PzJQytD4doA", "#23: Eye in the Sky Version 2", 117],
  ["EVOA1pu-5qM", "#24", 87],
  ["g_n3D3GScfM", "#25: Caida Libre", 97],
  ["lT9kAMCrhAg", "#26: Deep Inside", 90],
  ["lDAWNYrQ8sY", "#27: Minor Turbulence", 81],
  ["lUuACp8RzzM", "#28: The Paleto Score", 106],
  ["z8UDG6IpOa8", "#29: Derailed", 113],
  ["-zMJxTbKghw", "#30: Monkey Business", 81],
  ["k3uTEMZvgf4", "#31: Bury the Hatchet", 105],
  ["o__CNLvPf-Q", "#32: The Ballad of Rocco", 50],
  ["saNCcV8IU8k", "#33: Reuniting the Family", 50],
  ["0y06K_8yC48", "#34: The Bureau Raid [Fire Crew]", 102],
  ["BoyGBU8fjDU", "#35: The Bureau Raid [Roof Entry]", 98],
  ["53wfcmJgq2U", "#36: The Wrap Up", 78],
  ["HZDogcgV4FM", "#37: Legal Trouble", 86],
  ["x5AIKHfCCRU", "#38: Meltdown", 63],
  ["qKFSkkBGIMQ", "#39: The Big Score [Subtle]", 91],
  ["oGKGbzavVI8", "#40: The Big Score [Obvious]", 91],
  ["4YT1oPOtUFc", "#41: The Third Way", 86],
  ["4YDQ80eoRp8", "#42: Paparazzo", 45],
  ["fJ2qWpKpbRo", "#43", 71],
  ["7TZEkinjQDw", "#44: Paparazzo - The Meltdown", 56],
  ["djVouRYst88", "#45: Paparazzo - The Highness", 58],
  ["n38aeWtX02c", "#46: A Starlet in Vinewood [Kill Dreyfuss]", 59],
  ["YnT-Sf9504g", "#47: Unknowing the Truth", 47],
  ["GdODclCsBjU", "#48: Vinewood Souvenirs - Willy", 58],
  ["cFGFuTjZ6AY", "#49", 64],
  ["2nObl2QyT64", "#50: Vinewood Souvenirs - Kerry", 48],
  ["gyPIkYSHW-g", "#51", 64],
  ["Vqjg54PSoQQ", "#52: Vinewood Souvenirs - Al Di Napoli", 56],
  ["hQy-IvB1fQg", "#53: Vinewood Souvenirs - The Last Act [Kill Al Di Napoli]", 48],
  ["Szbyw2QtgaM", "#54: Vinewood Souvenirs - The Last Act [Save Al Di Napoli]", 58],
  ["PREfkH67hnU", "#55: Uncalculated Risk", 59],
  ["AH745BQ5q20", "#56: The Hotel Assassination", 50],
  ["0sX9yhOGoN0", "#57: The Multi Target Assassination", 52],
  ["MCmzgyKRFrY", "#58: The Vice Assassination", 62],
  ["hI-2M7BMy74", "#59: The Bus Assassination", 58],
  ["3PPLenKTZHA", "#60: The Construction Assassination", 71],
  ["jbNlwMNScTs", "#61", 47],
  ["p7_PX7uuJ44", "#62", 75],
  ["cO5dr_AZg8A", "#63", 62],
  ["UAkmF56MuQg", "#64: Altruist Cult Shootout", 56],
  ["pGawqTVTPaU", "#65", 59],
  ["Cei-HErwhnE", "#66", 65],
  ["Vmgqef8Zf0c", "#67", 55],
  ["y90R0vxcI_E", "#68", 49],
  ["Mrf3jemVAyI", "#69", 78],
  ["vu6QG8a2dC0", "#70", 67],
  ["gzV213vvoPI", "#71", 64],
  ["XslBpHY7nfk", "#72", 38],
  ["fwKIgyqipRM", "#73", 57],
  ["a1WqdfSBxIw", "#74", 64],
  ["xpELom5XjQs", "#75", 70],
  ["tYn3kb-dGtw", "#76", 63],
  ["zR80n4OOB5s", "#77", 57],
  ["XDm_MeqOUf4", "#78", 62],
  ["zewtw5xbEWE", "#79", 67],
  ["NCJ4aLb2CO8", "#80", 62],
  ["KwdFhE3I9vQ", "#81", 62],
  ["5mfm22k8De8", "#82", 62],
  ["huSxcVYPpP4", "#83", 62],
  ["PyTw_yedBKE", "#84", 62],
  ["RS8mb_k7i-U", "#85", 62],
  ["NtNXhXnmVHU", "#86", 62],
  ["njUuQG0vhkk", "#87", 62],
  ["XjgsdFlnd38", "#88", 62],
  ["kfOlOoVhKqE", "#89", 62],
  ["b22aXb3pHLc", "#90", 62],
  ["NLlBdgJk9gs", "#91", 62],
  ["lt7PF91kgIw", "#92", 62],
  ["ziOIwpmTfjs", "#93", 47],
  ["N74xGegSbOY", "#94", 38],
  ["L7AOzPevl_I", "#95", 46],
  ["1DcUF5Cix5Q", "#96", 56],
  ["hh17xdGCSg4", "#97", 62],
  ["a5sxSUDW8D8", "#98", 59],
  ["HRtPJaBoslM", "#99", 74],
  ["MnI_P1uyZQg", "#100", 36],
  ["UAP1bLh8A1c", "#101", 61],
];

/** The GTA IV Radio Commercials video; each ad is one of its chapters (the Russian and Spanish repeats at the end are left out). */
const GTA_4_COMMERCIALS_VIDEO = "wF2m4B1ubtw";
const GTA_4_COMMERCIALS_END = 4013;

/** [chapter start in seconds, ad name]; an ad runs until the next chapter starts. */
const GTA_4_ADS: [number, string][] = [
  [0, "Full Robo Hickey Hurry Mech Battle Suit"],
  [66, "Feinburg & Van Wyck International Realty"],
  [124, "Excelsior Extreme 9"],
  [187, "Trackify tracking beacon"],
  [237, "Whiz wireless"],
  [284, "Mas Fuego energy drink"],
  [326, "Mollis Pills"],
  [389, "Mummification"],
  [449, "Trackify tracking beacon"],
  [480, "Ambulate's Motorized Scooter"],
  [537, "Alcopatch"],
  [574, "Electrolyte sports drink"],
  [638, "Al Dente's"],
  [700, "El Chamuco Roboto"],
  [767, "Wing It computer software"],
  [804, "Eugenics Inc. International"],
  [857, "Vindication Angel Curse Buster BC"],
  [924, "The Horn deodorant"],
  [963, "Radio Carbon Dating"],
  [1026, "Liberty City Gun Club"],
  [1095, "Mummification"],
  [1148, "Ambulate's Motorized Scooter"],
  [1211, "Nuca Museum"],
  [1262, "Im Rich promo"],
  [1326, "America's Next Top Hooker"],
  [1386, "VIP Luxury Ringtones"],
  [1435, "Babiesovernight.com"],
  [1484, "Banging Trash Can Lids For An Hour"],
  [1541, "Bittersweet Personal E-mail Device"],
  [1590, "Princess Robot Bubblegum"],
  [1641, "Ambulate's Motorized Scooter"],
  [1700, "Wing It computer software"],
  [1753, "Karin Dilettante"],
  [1794, "Whiz Flip cellphone"],
  [1826, "Lipurgex pill"],
  [1873, "Poppin'"],
  [1966, "Beatrix Fontaine"],
  [2022, "Waning With The Stars tv show"],
  [2057, "Weazel News promo"],
  [2103, "Male Aromatherapy Inc."],
  [2163, "Medicate Me tv show"],
  [2200, "The Science Of Crime tv show"],
  [2253, "The Horn deodorant"],
  [2302, "Alcotine Patch"],
  [2347, "Eugenics Inc. International"],
  [2408, "FLEECA credit card"],
  [2440, "VIG Insurance"],
  [2478, "Dragon Brain"],
  [2571, "Pißwasser"],
  [2621, "WTF musical"],
  [2663, "The Men's Room tv show Bas promo"],
  [2702, "Brucie's Executive Lifestyle Autos"],
  [2747, "Cryogenics"],
  [2783, "The Men's Room tv show Jeremy promo"],
  [2801, "The Serrated Edge tv show"],
  [2857, "John Hunter campaign ad"],
  [2913, "Babiesovernight.com"],
  [2955, "Bittersweet Personal E-mail Device"],
  [2989, "VIP Luxury Ringtones"],
  [3041, "Mas Fuego energy drink"],
  [3086, "Ventura's Poker Challenge tv show"],
  [3118, "The Science Of Crime tv show"],
  [3164, "Michael Graves campaign ad"],
  [3204, "Double Helix DNA Search"],
  [3240, "Hamster Harem"],
  [3276, "Medicate Me tv show"],
  [3333, "Lipurgex pill"],
  [3373, "Waning With The Stars tv show"],
  [3424, "Nuca Museum"],
  [3471, "America's Next Top Hooker"],
  [3532, "The Suburbs tv show"],
  [3584, "Civil Service computer game"],
  [3641, "FLEECA credit card"],
  [3661, "John Hunter campaign ad"],
  [3709, "ZiT"],
  [3748, "FLEECA credit card"],
  [3770, "The Science Of Crime tv show"],
  [3802, "Swinging Puppets"],
  [3834, "Pißwasser"],
  [3866, "Brucie's Executive Lifestyle Autos"],
  [3916, "Michael Graves campaign ad"],
  [3952, "FLEECA credit card"],
  [3973, "Babiesovernight.com"],
];

/** The GTA IV Weazel News Reports video. */
const GTA_4_NEWS_VIDEO = "mcf-zQ8lSFA";

/** [start in seconds, bulletin name, seconds]; each ends where the next bulletin or weather report starts. */
const GTA_4_NEWS: [number, string, number][] = [
  [0, "#1: Chaos at the Bridges", 75],
  [75, "#2: Fight Terrorism at Home", 86],
  [161, "#3: Outlaw Online Poker", 127],
  [303, "#4: Corruption Scandals", 65],
  [368, "#5: Police Brutality", 97],
  [465, "#6: Eastern Europeans", 95],
  [560, "#7: Will The Markets Crash?", 100],
  [678, "#8: Meth Is Awful", 98],
  [776, "#9: Homophobic Rant", 86],
  [862, "#10: War On Terror", 92],
  [968, "#11: Ratings Are Up", 81],
  [1049, "#12: Nightclub Bloodbath", 104],
  [1153, "#13: Are You A Sex Offender?", 115],
  [1286, "#14: Will The Bridges Open?", 93],
  [1379, "#15: Lazlow Is Back!", 108],
  [1487, "#16: Illegal Street Racing", 78],
  [1565, "#17: Biker Wars", 62],
  [1637, "#18: Dogmeat Talks", 85],
  [1722, "#19: Murder In Hove Beach", 89],
  [1811, "#20: Racing Gets Deadly", 90],
  [1901, "#21: Murder In Algonquin", 78],
  [1993, "#22: Chinatown Killing", 89],
  [2082, "#23: Charcoal 8 Alert", 78],
  [2160, "#24: Triangle Club Shootout", 73],
  [2233, "#25: Forgery Alert", 68],
  [2315, "#26: Helicopter Explosion", 100],
  [2415, "#27: Bank Heist Manhunt", 92],
  [2507, "#28: All Bridges Reopen", 83],
  [2590, "#29: Explosion In Northwood", 90],
  [2689, "#30: Prison Break", 100],
  [2789, "#31: Highspeed Subway Chase", 78],
  [2867, "#32: Bad Day For Deputy Commissioner", 68],
  [2935, "#33: Deputy Commissioner Shot Dead", 79],
  [3033, "#34: Dragon Brain Massacre", 81],
  [3114, "#35: Criminal Found Dead", 87],
  [3201, "#36: Fans Of Profesional Wrestling Are Still Breeding", 73],
  [3274, "#37: Is Your Money Fake", 100],
  [3389, "#38: Bloody Massacre In Alderney", 99],
  [3488, "#39: A City In The Midst Of A Mob Rain Of Terror", 87],
  [3575, "#40: Kerry McIntosh Sues Retreat", 93],
  [3668, "#41: Bridges Are Overrated As A Means Of Crossing Rivers", 77],
  [3764, "#42: The War On Fun Is Being Won", 106],
  [3870, "#43: Drugs That Rearrange Your DNA", 83],
  [3953, "#44: Niko Bellic Wanted By Police", 103],
  [4056, "#45: Sadness At Happiness Island", 108],
  [4178, "#46: Dead Russian Gangster", 122],
  [4300, "#47: Serial Killer Found Dead", 80],
  [4380, "#48: Dumpster Diving Can Make You A Millionaire", 100],
  [4492, "#49: Email Could Be Outlawed", 62],
  [4554, "#50: What Are Stem Cells?", 70],
  [4624, "#51: Scooter Sales Are Up 300%", 76],
  [4714, "#52: Pixelated Junk Shots", 88],
  [4802, "#53: No More Rape And Pillage", 61],
  [4863, "#54: Terror In The Skies", 74],
  [4956, "#55: Breaking WASP News", 66],
  [5022, "#56: Cluckin' Bell Eradicates Pigeon Problem", 76],
  [5098, "#57: Gambling Encourages Longevity", 59],
  [5171, "#58: Is Your Scout Leader Touching Your Kids", 58],
  [5229, "#59: Hooker Accused Of Not Being A Hooker", 59],
  [5308, "#60: Nine Hour Orgasm", 72],
  [5380, "#61: Does Email Cause Heart Disease", 61],
  [5441, "#62: Super Kids To Be Showcased", 83],
  [5540, "#63: Slim People Are Starting To Suffer", 63],
  [5603, "#64: Meth S'il Vous Plait", 55],
  [5658, "#65: Drugs Scandal In The Finance Industry", 72],
  [5745, "#66: Beer Shocker", 68],
  [5813, "#67: 450lb Gorilla Kills 4 People", 69],
  [5898, "#68: Bong Hits While Eating Pizza", 67],
  [5965, "#69: Police Found Dead", 143],
  [6108, "#70: Terror Alert", 124],
  [6245, "#71: Prison Convoy Hijacked", 143],
  [6388, "#72: Chaos At The Airport", 120],
  [6508, "#73: The Party Is Over", 144],
  [6666, "#74: Beat These Inmates", 116],
  [6782, "#75: British Official Loses Laptop", 105],
  [6887, "#76: Designer Hybrid Dogs", 128],
  [7027, "#77: Los Santos Teen Badly Burnt", 69],
  [7096, "#78: Dukes Woman Contracts West Nile Virus", 83],
  [7194, "#79: Coked Up Psychopath", 95],
  [7289, "#80: Are You Carpooling With A Rapist", 108],
  [7411, "#81: Bar Snack Becomes Killing Machine", 96],
  [7507, "#82: Meth Lab Found", 78],
  [7604, "#83: Emoticons Are Cancer", 82],
  [7686, "#84: American Porn Industry Suffers", 122],
  [7826, "#85: Murder In The Harbour", 135],
  [7961, "#86: Multiple Blasts Rock The City", 167],
  [8145, "#87: Bahama Mamas Shootout", 132],
  [8290, "#88: Helicopters Of Death", 155],
  [8460, "#89: Murder And Mayhem", 148],
  [8626, "#90: Vinewood Movie", 147],
  [8788, "#91: Shootouts Rage Across The City", 109],
  [8912, "#92: Are You Pregnant App", 88],
  [9016, "#93: Dork News", 98],
  [9127, "#94: Hip And Edgey", 82],
  [9220, "#95: Sucker For Pie Charts", 91],
  [9324, "#96: Female Teen Gymnast", 101],
  [9471, "#97: Los Santos Bulimia Capital", 89],
  [9607, "#98: Designer Cupcake Haters", 90],
  [9743, "#99: Health News", 82],
  [9872, "#100: Titty Magazines Effected By Recession", 92],
  [10007, "#101: Market Executives Are Soulless", 95],
];

/** A game's commercials plus the Weazel News bulletins that open each of its ad breaks. */
export interface AdSet {
  id: string;
  ads: Item[];
  news: Item[];
  newsTotal: number;
  /** newsPrefix[i] is the length of bulletins 0..i-1, so any run of the rotation sums in constant time. */
  newsPrefix: number[];
}

function adSet(id: string, ads: Item[], news: Item[]): AdSet {
  return {
    id,
    ads,
    news,
    newsTotal: news.reduce((s, it) => s + it.duration, 0),
    newsPrefix: news.reduce((acc, it) => (acc.push(acc[acc.length - 1] + it.duration), acc), [0]),
  };
}

const GTA_4_AD_ITEMS: Item[] = GTA_4_ADS.map(([start, title], i) => ({
  videoId: GTA_4_COMMERCIALS_VIDEO,
  title,
  start,
  duration: (i + 1 < GTA_4_ADS.length ? GTA_4_ADS[i + 1][0] : GTA_4_COMMERCIALS_END) - start,
  ad: true,
}));

/** Ad breaks by game; games without an entry have none. */
export const AD_SETS: Record<string, AdSet> = {
  "gta-v": adSet(
    "gta-v",
    AD_ITEMS,
    NEWS.map(([videoId, title, duration]) => ({ videoId, title, start: 0, duration, ad: true, news: true })),
  ),
  "gta-4": adSet(
    "gta-4",
    GTA_4_AD_ITEMS,
    GTA_4_NEWS.map(([start, title, duration]) => ({ videoId: GTA_4_NEWS_VIDEO, title, start, duration, ad: true, news: true })),
  ),
};

/** Length of the first `count` bulletins of the endless rotation. */
const newsBefore = (set: AdSet, count: number) =>
  Math.floor(count / set.news.length) * set.newsTotal + set.newsPrefix[count % set.news.length];

const SONGS_PER_BLOCK = [3, 5] as const;
const ADS_PER_BREAK = [3, 6] as const;
/** Two shuffled passes of the songs share one shuffled pass of every ad, which keeps breaks within 3-6 ads. */
const SONG_PASSES = 2;
const sum = (items: Item[]) => items.reduce((s, it) => s + it.duration, 0);

/** Short playlists need more song passes per program, or there aren't enough song blocks to hold every ad break. */
function songPasses(count: number, set: AdSet | null): number {
  let passes = SONG_PASSES;
  if (!set) return passes;
  while (Math.floor((count * passes) / SONGS_PER_BLOCK[0]) < Math.ceil(set.ads.length / ADS_PER_BREAK[1])) passes++;
  return passes;
}

/** The broadcast "went on air" here; changing it reshuffles everyone's schedule. */
const ON_AIR = Date.UTC(2024, 0, 1);

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(items: T[], rand: () => number): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}

/** Splits `total` into `n` random sizes, each within [min, max]. Needs n*min <= total <= n*max. */
function split(total: number, n: number, [min, max]: readonly [number, number], rand: () => number): number[] {
  const sizes = new Array<number>(n).fill(min);
  let rem = total - n * min;
  while (rem > 0) {
    const i = Math.floor(rand() * n);
    if (sizes[i] < max) {
      sizes[i] += 1;
      rem -= 1;
    }
  }
  return sizes;
}

/** A playlist's endless schedule, with or without ad breaks. */
export interface Broadcast {
  songs: Item[];
  /** The game's ads and news, or null when ad breaks are off. */
  adSet: AdSet | null;
  /** Talk stations play their segments in order rather than shuffled. */
  ordered: boolean;
  passes: number;
  /** Ad breaks per program; each opens with the next Weazel News bulletin in rotation. */
  breaks: number;
  /** Program length without its news; every program holds the same songs and ads. */
  base: number;
  cachedProgram: number;
  cachedItems: Item[];
}

const broadcasts: Record<string, Broadcast> = {};

export function broadcastFor(playlistId: string, set: AdSet | null, library: Record<string, Track[]>, ordered = false): Broadcast | null {
  const tracks = library[playlistId];
  if (!tracks?.length) return null;
  const key = `${playlistId}:${set ? set.id : "no-ads"}`;
  if (!broadcasts[key]) {
    const songs = tracks.map((t) => ({ videoId: t.id, title: t.title, start: 0, duration: t.duration, ad: false }));
    const passes = songPasses(songs.length, set);
    const count = songs.length * passes;
    const adCount = set?.ads.length ?? 0;
    const fewest = Math.max(Math.ceil(count / SONGS_PER_BLOCK[1]), Math.ceil(adCount / ADS_PER_BREAK[1]));
    const most = Math.min(Math.floor(count / SONGS_PER_BLOCK[0]), Math.floor(adCount / ADS_PER_BREAK[0]));
    broadcasts[key] = {
      songs,
      adSet: set,
      ordered,
      passes,
      breaks: set ? Math.round((fewest + most) / 2) : 0,
      base: passes * sum(songs) + (set ? sum(set.ads) : 0),
      cachedProgram: -1,
      cachedItems: [],
    };
  }
  return broadcasts[key];
}

/** Seconds from going on air to the start of program `index`. */
const programStart = (b: Broadcast, index: number) => index * b.base + (b.adSet ? newsBefore(b.adSet, index * b.breaks) : 0);

/** One full program: song blocks and ad breaks alternating, freshly shuffled each time round. */
function programFor(b: Broadcast, index: number): Item[] {
  if (index === b.cachedProgram) return b.cachedItems;
  const rand = mulberry32(index * 2654435761 + 0x5eed);
  const songs: Item[] = [];
  for (let pass = 0; pass < b.passes; pass++) songs.push(...(b.ordered ? b.songs : shuffled(b.songs, rand)));
  let items: Item[];
  if (!b.adSet) {
    items = songs;
  } else {
    const { news } = b.adSet;
    const ads = shuffled(b.adSet.ads, rand);
    const blockSizes = split(songs.length, b.breaks, SONGS_PER_BLOCK, rand);
    const breakSizes = split(ads.length, b.breaks, ADS_PER_BREAK, rand);
    items = [];
    let s = 0;
    let a = 0;
    for (let k = 0; k < b.breaks; k++) {
      for (let j = 0; j < blockSizes[k]; j++) items.push(songs[s++]);
      items.push(news[(index * b.breaks + k) % news.length]);
      for (let j = 0; j < breakSizes[k]; j++) items.push(ads[a++]);
    }
  }
  b.cachedProgram = index;
  b.cachedItems = items;
  return items;
}

export interface Slot {
  item: Item;
  /** Seconds into the item. */
  offset: number;
  /** Epoch ms at which this item started on air. */
  startMs: number;
}

/** What is on air at `nowMs`. */
export function slotAt(b: Broadcast, nowMs: number): Slot {
  const t = (nowMs - ON_AIR) / 1000;
  const average = b.base + (b.adSet ? (b.breaks * b.adSet.newsTotal) / b.adSet.news.length : 0);
  let index = Math.floor(t / average);
  while (index > 0 && programStart(b, index) > t) index--;
  while (programStart(b, index + 1) <= t) index++;
  let rem = t - programStart(b, index);
  const items = programFor(b, index);
  for (let i = 0; i < items.length; i++) {
    const d = items[i].duration;
    if (rem < d) return { item: items[i], offset: rem, startMs: nowMs - rem * 1000 };
    rem -= d;
  }
  const last = items[items.length - 1];
  return { item: last, offset: last.duration, startMs: nowMs - last.duration * 1000 };
}

/** The slot that follows the one starting at `startMs`. */
export function nextSlot(b: Broadcast, slot: Slot): Slot {
  const boundary = slot.startMs + slot.item.duration * 1000 + 1;
  return { ...slotAt(b, boundary), offset: 0 };
}

let clockOffset = 0;
let clockSynced: Promise<void> | null = null;

/** Corrects for a wrong device clock using the server's time, so devices agree. */
export function syncRadioClock(): Promise<void> {
  if (!clockSynced) {
    clockSynced = (async () => {
      try {
        const sent = Date.now();
        const res = await fetch("/api/radio-clock", { cache: "no-store" });
        const { now } = (await res.json()) as { now: number };
        const received = Date.now();
        clockOffset = now + (received - sent) / 2 - received;
      } catch {
        clockOffset = 0;
      }
    })();
  }
  return clockSynced;
}

export function radioNow(): number {
  return Date.now() + clockOffset;
}

/** Long mixes have no published schedule, so everyone joins at the same point of a clock-derived loop. */
export const loopOffset = (duration: number) => (duration > 0 ? (radioNow() / 1000) % duration : 0);

/** Lengths of the single-video stations, so they load straight onto the shared loop; unlisted ones seek there once playing. */
export const MIX_LENGTHS: Record<string, number> = {
  IhCFJnaYvnI: 5815, // West Coast Talk Radio
  qAmAnyTdXog: 5079, // Blaine County Radio
  [COMMERCIALS_VIDEO]: COMMERCIALS_END, // GTA V Radio Commercials
  O6NoRNcu5Jk: 5185, // VCPR (GTA Vice City)
  dXOzb0krq7g: 2892, // Integrity 2.0 (GTA IV)
};
