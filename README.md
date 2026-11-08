# GTA V Radio Web App

## Description

This web application replicates the radio wheel from GTA V, allowing users to listen to various GTA V radio stations online. The app streams radio content from YouTube, providing an authentic GTA V radio experience complete with all radio information and currently playing songs. To enhance realism, radios run on a shared clock like real broadcasts, so every listener hears the same song at the same moment, with optional GTA V ad breaks.

## Features

- Stream GTA V radio stations from YouTube.
- Display current playing song and radio details.
- Time-synced playback: no matter the device or how often you refresh, a station plays the same thing for everyone.
- Ad breaks between songs, which can be switched off.
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

After launching the app, you can interact with the radio wheel to choose different GTA V radio stations. Click on a station to begin streaming. The UI displays the current playing song and other relevant information.

## License

This project is licensed under the MIT License.

## Acknowledgements

- GTA V is a trademark of Rockstar Games. This project is a fan-made creation and is not affiliated with Rockstar Games.
- Radio content is streamed from YouTube and is subject to YouTube's terms of service.
- Rockstar Games' copyright information regarding YouTube uploads can be found [here.](https://support.rockstargames.com/articles/204779558/Information-About-Being-Safe-From-Copyright-Strikes-When-Uploading-Rockstar-Editor-Videos)
- Huge thanks to [GTA V Radio FM](https://www.youtube.com/@GtaVRadioFM/playlists) on YouTube, whose station playlists power most of the radios in this app.
