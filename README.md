# GTA Radio Web App

## Description

This web application replicates the radio wheel from GTA V, allowing users to listen to the radio stations from GTA VI (station previews), GTA V, GTA IV (including Episodes from Liberty City), GTA San Andreas, GTA Vice City and GTA III online. The app streams radio content from YouTube, providing an authentic GTA V radio experience complete with all radio information and currently playing songs. To enhance realism, radios run on a shared clock like real broadcasts, so every listener hears the same song at the same moment, with optional GTA V ad breaks.

## Features

- Stream radio stations from GTA V, GTA IV, GTA San Andreas, GTA Vice City and GTA III from YouTube.
- GTA VI is coming soon: its page has a live countdown to launch (November 19, 2026) and plays Rockstar's official previews of six stations (Cocoteo FM, Back Country Radio, AfroBank FM, The Chamber 106.6, Flash FM and Dirty South Classics), with the songs heard in each preview. GTA IV stations include their songs from The Lost and Damned and The Ballad of Gay Tony, plus Lazlow's talk station Integrity 2.0.
- Each game has its own page, picked from the dropdown in the top bar: GTA VI at `/gta-6`, GTA V on the home page, then `/gta-4`, `/san-andreas`, `/vice-city` and `/gta-3`, listed newest to oldest.
- Display current playing song and radio details.
- Time-synced playback: no matter the device or how often you refresh, a station plays the same thing for everyone.
- GTA V ad breaks between songs, which can be switched off (GTA V stations only).
- Remembers your volume, mute, ad breaks setting and the last station you played in each game.
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

## Usage

After launching the app, pick a game from the dropdown in the top bar, then use the radio wheel or list view to choose a station. Click on a station to begin streaming. The UI displays the current playing song and other relevant information.

## License

This project is licensed under the MIT License.

## Acknowledgements

- Grand Theft Auto, GTA VI, GTA V, GTA IV, GTA San Andreas, GTA Vice City and GTA III are trademarks of Rockstar Games. This project is a fan-made creation and is not affiliated with Rockstar Games.
- Radio content is streamed from YouTube and is subject to YouTube's terms of service.
- Rockstar Games' copyright information regarding YouTube uploads can be found [here.](https://support.rockstargames.com/articles/204779558/Information-About-Being-Safe-From-Copyright-Strikes-When-Uploading-Rockstar-Editor-Videos)
- Huge thanks to [GTA V Radio FM](https://www.youtube.com/@GtaVRadioFM/playlists) on YouTube, whose station playlists power the GTA V radios in this app.
- Thanks to the YouTube uploaders whose playlists power the GTA IV, San Andreas, Vice City and GTA III stations, and to LPX Lonit for the Integrity 2.0 recording.
- GTA VI station previews and station icons are from [Rockstar Games' GTA VI music page](https://www.rockstargames.com/VI/music).
- Station names, hosts and logos come from the [GTA Wiki](https://gta.fandom.com/).
