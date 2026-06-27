<p align="center">
  <img src="release/FolioChef_logo_v2.png" alt="FolioChef Logo" width="400" />
</p>

<h1 align="center">FolioChef</h1>

<p align="center">
  <em>Cooking with Commis Chefs</em><br/>
  A Web Terminal Manager, reimagined as a professional kitchen.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/node-%3E%3D18-green" alt="Node.js" />
  <img src="https://img.shields.io/badge/npm-%3E%3D9-blue" alt="npm" />
  <img src="https://img.shields.io/badge/license-ISC-yellow" alt="License" />
  <img src="https://img.shields.io/badge/electron-35-purple" alt="Electron" />
</p>

---

The **Head Chef** (you) commands the pass. The **Commis Chefs** (your AI assistants) fire up terminals, chop data, and keep every station running.

## The Kitchen

- **Multi-station pass** — Every terminal tab is a station. Fire up as many as you need.
- **Live PTY grills** — Real shell processes searing in real time over WebSocket.
- **Signature themes** — Pick a mood (Spotify Dark, Dracula, Nord, Solarized Dark) or craft your own backdrop colour.
- **Mise en place** — Font size, font family — dial in your tools so every station feels right.
- **Walk-in cooler** — Tabs and output history are saved to disk. Walk away, come back — it's all there.
- **Fire / Clean** — Restart a sluggish process or wipe the board without closing the station.
- **Custom order** — Launch any station with a bespoke command and working directory.
- **Open API** — Full REST menu for managing every ticket.

## The Brigade

| Station | Tool |
|---------|------|
| Pass (Frontend) | React 19, Vite, Tailwind CSS, xterm.js, Zustand |
| Kitchen (Backend) | Express 5, ws, node-pty |
| Pantry (Persistence) | JSON files on disk (`data/`) |
| Desktop Shell | Electron 35, electron-builder |

---

## Download

Download the latest portable `.exe` from the [Releases](https://github.com/anomalyco/cli-for-web-view/releases) page.

No installation required — just double-click `FolioChef.exe` to launch.

---

## Running the App

### Option 1 — Desktop App (Electron)

> Recommended. Single portable `.exe`, no Node.js required.

1. Download `FolioChef-x.x.x-portable.exe` from [Releases](https://github.com/anomalyco/cli-for-web-view/releases).
2. Double-click to run. The app starts a local server and opens in its own window.
3. Done.

### Option 2 — Web Browser (Development)

> Requires Node.js >= 18.

```bash
# Clone the repo
git clone https://github.com/anomalyco/cli-for-web-view.git
cd cli-for-web-view

# Install dependencies
npm install
cd client && npm install && cd ..

# Start dev servers (server :3001 + Vite :5173)
npm run dev
```

Open `http://localhost:5173` in your browser.

### Option 3 — Production Build (Self-hosted)

> Requires Node.js >= 18.

```bash
# Build the client
npm run build

# Start the production server
npm start
```

Open `http://localhost:3001`.

### Building from Source (Electron)

> Requires Node.js >= 18, npm >= 9, and Visual Studio Build Tools.

```bash
# Install dependencies
npm install
cd client && npm install && cd ..

# Build client assets
npm run build

# Build portable exe
npx electron-builder --win portable
```

Output: `release\FolioChef-1.0.0-portable.exe`

---

## Project Layout

```
├── client/                    # The Pass (React frontend)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Terminal.jsx       # The grill — xterm.js
│   │   │   ├── Sidebar.jsx        # Station list
│   │   │   ├── SettingsPanel.jsx  # Chef's spice rack
│   │   │   ├── NewTabDialog.jsx   # Open a new station
│   │   │   └── Footer.jsx         # Service status
│   │   ├── App.jsx                # Head chef's console
│   │   ├── store.js               # The order wheel
│   │   └── index.css              # Kitchen rules
│   └── ...
├── server/                    # The Kitchen (Express + WebSocket)
│   ├── index.js               # Head chef's station
│   ├── restRouter.js          # Order tickets (REST)
│   ├── sessionManager.js      # Station rotation
│   ├── ptyManager.js          # The stoves (PTY)
│   └── historyStore.js        # The logbook
├── electron/                  # Electron shell
│   ├── main.js                # Main process
│   ├── icon.ico               # App icon
│   └── icon.png               # App icon source
├── data/                      # Walk-in cooler (runtime data)
├── build.bat                  # Build script (CMD)
├── build.ps1                  # Build script (PowerShell)
└── package.json               # The recipe book
```

## The Menu (API)

| Method | Course | Description |
|--------|--------|-------------|
| GET | `/api/tabs` | List every station on the pass |
| POST | `/api/tabs` | Open a new station |
| DELETE | `/api/tabs/:id` | Close a station |
| PATCH | `/api/tabs/:id` | Rename or swap the order |
| GET | `/api/history/:id` | Read the station's logbook |
| DELETE | `/api/history/:id` | Wipe the station's board |
| POST | `/api/tabs/:id/restart` | Relight the burner |
| WS | `/ws?tabId=&cols=&rows=&command=&cwd=` | Live connection to the stove |

---

## License

ISC — now get back to the pass, Chef.
