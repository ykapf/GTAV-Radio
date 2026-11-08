# GTA Radio Web App

## Description

This web application replicates the radio wheel from GTA V, allowing users to listen to the radio stations from GTA V, GTA III, GTA Vice City and GTA San Andreas online. The app streams radio content from YouTube, providing an authentic GTA V radio experience complete with all radio information and currently playing songs. To enhance realism, radios run on a shared clock like real broadcasts, so every listener hears the same song at the same moment, with optional GTA V ad breaks.

## Features

- Stream radio stations from GTA V, GTA III, GTA Vice City and GTA San Andreas from YouTube.
- Each game has its own page, picked from the dropdown in the top bar: GTA V on the home page, then `/gta-3`, `/vice-city` and `/san-andreas`.
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

- Grand Theft Auto, GTA V, GTA III, GTA Vice City and GTA San Andreas are trademarks of Rockstar Games. This project is a fan-made creation and is not affiliated with Rockstar Games.
- Radio content is streamed from YouTube and is subject to YouTube's terms of service.
- Rockstar Games' copyright information regarding YouTube uploads can be found [here.](https://support.rockstargames.com/articles/204779558/Information-About-Being-Safe-From-Copyright-Strikes-When-Uploading-Rockstar-Editor-Videos)
- Huge thanks to [GTA V Radio FM](https://www.youtube.com/@GtaVRadioFM/playlists) on YouTube, whose station playlists power the GTA V radios in this app.
- Thanks to the YouTube uploaders whose playlists power the GTA III, Vice City and San Andreas stations.
- Station names, hosts and logos come from the [GTA Wiki](https://gta.fandom.com/).
