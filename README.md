# Lazer Player Server (Back-end)

A lightweight back-end media server that hooks directly into your local **osu!lazer** installation to read your beatmap library and stream audio/media directly to connected clients.

---

## Features

- **Direct Integration**: Reads directly from your local osu!lazer database (`client.realm`) and storage directory structure.
- **Audio & Media Streaming**: Stream `.mp3`, `.ogg`, background images directly to remote or local clients.
- **Beatmap Parsing**: Extracts track metadata (title, artist, audio file paths, background images).
- **Fast & Lightweight**: Minimal overhead by leveraging local files without duplicating your song library.
- **RESTful API**: Clean API endpoints for searching tracks and fetching media streams.

---

## How It Works

osu!lazer stores beatmaps and media in a localized Realm database and a hashed storage folder. This server:

1. Locates your local osu!Lazer data directory.
2. Interacts with the local storage files and database structure.
3. Maps hashed track files to readable beatmap metadata.
4. Exposes HTTP/WebSocket endpoints for external clients to browse and play songs.

---

## Prerequisites

- osu!lazer installed on the host machine.
- Read access to the osu!lazer data directory:
  - **Windows**: `%AppData%/osu`
  - **macOS**: `~/Library/Application Support/osu`
  - **Linux**: `~/.local/share/osu`

---

## Quick Start

### 1. Configuration

Copy the sample configuration file and update the path to your osu!lazer data directory:

\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env`:

\`\`\`ini
PORT=8080
OSU_DATA_PATH=/path/to/your/osu/folder
\`\`\`

### 3. Run the Server

\`\`\`bash
npm install
npm start
\`\`\`

---

## API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/songs` | Get a paginated list of all tracks/beatmaps |
| GET | `/api/audio/:id` | Stream the audio file for the specified beatmap |
| GET | `/api/image/:id` | Retrieve the background image |

---

## Contributing

Contributions, issue reports, and feature requests are welcome! Feel free to check the issues page.

---

## License

This project is licensed under the MIT License.