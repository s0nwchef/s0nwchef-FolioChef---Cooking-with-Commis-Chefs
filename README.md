# FolioChef — Cooking with Commis Chefs

A Web Terminal Manager, reimagined as a professional kitchen.  
The **Head Chef** (you) commands the pass. The **Commis Chefs** (your AI assistants) fire up terminals, chop data, and keep every station running.

## The Kitchen

- **Multi-station pass** — Every terminal tab is a station. Fire up as many as you need.
- **Live PTY grills** — Real shell processes searing in real time over WebSocket.
- **Signature themes** — Pick a mood (Expedition 33, Dracula, Nord, Solarized Dark) or craft your own backdrop colour.
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

## Getting to Work

### Sharpening Your Knives

- **Node.js** >= 18
- **npm** >= 9

### Prepping the Station

```bash
# Stock the pantry (server deps)
npm install

# Set up the pass (client deps)
cd client && npm install && cd ..
```

### Building the Menu

```bash
npm run build
```

### Service (Development)

```bash
npm run dev
```

Runs the kitchen (server, port 3001) and the pass (Vite dev server, port 5173) side by side. The pass proxies `/api` and `/ws` straight to the kitchen.

### Service (Production)

```bash
npm run build
npm start
```

Open `http://localhost:3001` — service is live.

## The Kitchen Layout

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
├── data/                      # Walk-in cooler (runtime data)
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

## License

ISC — now get back to the pass, Chef.
