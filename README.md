# GTA Radio Web App

## Description

This web application replicates the radio wheel from GTA V, allowing users to listen to the radio stations from GTA VI (station previews), GTA V, GTA Chinatown Wars, GTA IV (including Episodes from Liberty City), GTA Vice City Stories, GTA Liberty City Stories, GTA San Andreas, GTA Vice City, GTA III, GTA 2, GTA London (1969 and 1961) and the original GTA. The app plays radio content from self-hosted MP3s, with YouTube as a fail-safe, providing an authentic GTA V radio experience complete with all radio information and currently playing songs. To enhance realism, radios run on a shared clock like real broadcasts, so every listener hears the same song at the same moment, with optional GTA V and GTA IV ad breaks that open with a Weazel News bulletin.

## Features

- Listen to radio stations from GTA V, GTA Chinatown Wars, GTA IV, GTA Vice City Stories, GTA Liberty City Stories, GTA San Andreas, GTA Vice City, GTA III, GTA 2, GTA London and the original GTA.
- GTA VI is coming soon: its page has a live countdown to launch (November 19, 2026) and plays Rockstar's official previews of six stations (Cocoteo FM, Back Country Radio, AfroBank FM, The Chamber 106.6, Flash FM and Dirty South Classics), with the songs heard in each preview. GTA IV stations include their songs from The Lost and Damned and The Ballad of Gay Tony, plus Lazlow's talk station Integrity 2.0.
- Each game has its own page, picked from the dropdown in the top bar: GTA VI at `/gta-6`, GTA V on the home page, then `/chinatown-wars`, `/gta-4`, `/vice-city-stories`, `/liberty-city-stories`, `/san-andreas`, `/vice-city`, `/gta-3`, `/gta-2`, `/gta-london` and `/gta-1`, listed newest to oldest.
- GTA V and GTA IV ad breaks each open with one of that game's 101 Weazel News bulletins, played in rotation on the shared clock. Turning ad breaks off also turns the news off.
- Display current playing song and radio details.
- Time-synced playback: no matter the device or how often you refresh, a station plays the same thing for everyone.
- In-game commercials between songs on GTA V and GTA IV stations, which can be switched off.
- Plays self-hosted MP3s where they're uploaded, with YouTube as a fail-safe. MP3s keep playing on a locked phone, including into ad breaks, with the station logo and song on the lock screen.
- An audio source switch next to the volume button: Auto (the default) plays the MP3 and moves to YouTube if it hasn't started within about 3 seconds (on a locked phone it waits for the MP3 instead, because iOS won't start YouTube there), MP3 always uses MP3s, and YouTube never does. Songs without an MP3 always play from YouTube.
- Remembers your volume, mute, ad breaks setting, audio source and the last station you played in each game.
- Elegant and responsive UI mimicking GTA V's style.

## Technologies Used

- React
- Next.js
- TypeScript
- Tailwind CSS

## Installation and Setup

Ensure you have [Node.js](https://nodejs.org/) installed on your system to run this project.

1. **Clone the Repository**

   ```bash
   git clone https://github.com/ykapf/GTAV-Radio.git
   cd gtav-radio

   ```

2. **Install Dependencies**

   Inside the project directory, run:

   ```bash
   npm install
   ```

   or if you are using yarn:

   ```bash
   yarn
   ```

3. **Run the Application Locally**

   To start the development server, run:

   ```bash
   npm run dev
   ```

   or with yarn:

   ```bash
   yarn dev
   ```

   The application will be available at http://localhost:3000.

## MP3 Library

Every song, ad, news bulletin and talk show can play from an MP3 instead of YouTube. The schedule doesn't change, so MP3 and YouTube listeners still hear the same thing at the same second.

**Folder layout.** Files live in `public/audio/<game>/<station>/<song>.mp3`, for example `public/audio/gta-5/non-stop-pop-100-7-fm/1-thing.mp3`. Game folders are named after their pages (`gta-5`, `gta-4`, `san-andreas` and so on).

- Every folder has a `_files.txt` checklist with the exact file name for each MP3 it expects, plus the song's title, length and YouTube link.
- Commercials are one file per game (`<game>/ads/commercials.mp3`), ripped from the whole commercials video. Ad breaks are cut from it at the same timestamps as on YouTube. GTA IV's Weazel News is one file too (`gta-4/weazel-news/weazel-news.mp3`). GTA V's bulletins are one file each.
- Single-video stations, such as West Coast Talk Radio, are one file named after the station.

**Adding files.**

1. Run `npm run audio`. It creates any missing folders and checklists.
2. Drop MP3s into the folders, named as in each `_files.txt`.
3. Run `npm run audio` again. It ticks off what it found, reads each file's real length, warns about files that are more than 5 seconds off the YouTube length or have the wrong name, and writes `public/audio-manifest.json`.
4. Commit `public/audio-manifest.json`. The site only plays the MP3s listed in it, so missing ones never cause a delay.

The MP3 folders are ignored by git (only the GTA VI previews are committed), because the full library is around 10 GB. That's too big for GitHub, and serving it from Vercel would use up its bandwidth quickly.

**Hosting the files.** In development, `npm run dev` serves them straight from `public/audio`. For the live site, upload the folders to file storage such as [Cloudflare R2](https://developers.cloudflare.com/r2/), which has no download fees:

1. Create an R2 bucket and turn on its public access (a `r2.dev` address or your own domain).
2. Upload the contents of `public/audio` to the root of the bucket, keeping the folders. For example, `gta-5/non-stop-pop-100-7-fm/1-thing.mp3` should sit at `https://<your-bucket-address>/gta-5/non-stop-pop-100-7-fm/1-thing.mp3`.
3. In Vercel, under Settings → Environment Variables, set `NEXT_PUBLIC_AUDIO_BASE_URL` to the bucket address, then redeploy.

If the storage can't be reached, the radio notices after a few failed files and carries on from YouTube for the rest of the visit.

## Usage

After launching the app, pick a game from the dropdown in the top bar, then use the radio wheel or list view to choose a station. Click on a station to begin streaming. The UI displays the current playing song and other relevant information.

## License

This project is licensed under the MIT License.

## Acknowledgements

- Grand Theft Auto, GTA VI, GTA V, GTA Chinatown Wars, GTA IV, GTA Vice City Stories, GTA Liberty City Stories, GTA San Andreas, GTA Vice City, GTA III, GTA 2 and GTA London are trademarks of Rockstar Games. This project is a fan-made creation and is not affiliated with Rockstar Games.
- Radio content is streamed from YouTube, or from self-hosted MP3s where uploaded. YouTube playback is subject to YouTube's terms of service.
- Rockstar Games' copyright information regarding YouTube uploads can be found [here.](https://support.rockstargames.com/articles/204779558/Information-About-Being-Safe-From-Copyright-Strikes-When-Uploading-Rockstar-Editor-Videos)
- Huge thanks to [GTA V Radio FM](https://www.youtube.com/@GtaVRadioFM/playlists) on YouTube, whose station playlists power the GTA V radios in this app.
- Thanks to the YouTube uploaders whose playlists power the Chinatown Wars, GTA IV, Vice City Stories, Liberty City Stories, San Andreas, Vice City, GTA III, GTA 2, GTA London and GTA 1 stations and the Weazel News bulletins, and to LPX Lonit for the Integrity 2.0 recording.
- GTA VI station previews and station icons are from [Rockstar Games' GTA VI music page](https://www.rockstargames.com/VI/music).
- Station names, hosts and logos come from the [GTA Wiki](https://gta.fandom.com/), with GTA London's station names from [Grand Theft Wiki](https://www.grandtheftwiki.com/Radio_Stations_in_GTA_London).
