# 🎮 Lila Game - Multiplayer Tic-Tac-Toe

> A complete real-time multiplayer Tic-Tac-Toe platform with rating system, matchmaking, and leaderboard

**Status**: ✅ Production Ready | **Last Updated**: October 17, 2025

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [How It Works](#-how-it-works)
- [Advanced Features](#-advanced-features)
- [Testing Guide](#-testing-guide)
- [API & Data Flow](#-api--data-flow)
- [Configuration](#-configuration)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Backend running on `http://localhost:3000`

### Get Running in 2 Minutes

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# Navigate to http://localhost:5173
```

### Quick Test Flow

1. **Register** an account at `/register`
2. Go to **Games** lobby
3. Click **"Create Game"** or **"Find Random Match"**
4. Open **incognito window** and register another user
5. **Join the game** or also click **"Find Random Match"**
6. **Play tic-tac-toe** in real-time!

**Backend Setup:**
```bash
cd /path/to/lila-game-project
npm run start:dev
# Backend runs on http://localhost:3000
```

---

## ✨ Features

### 🎯 Core Gameplay
- ✅ **3x3 Tic-Tac-Toe Board** - Interactive click-to-place interface
- ✅ **Real-time Synchronization** - 0.5s polling + WebSocket instant updates
- ✅ **Turn-based Validation** - X always goes first, proper turn enforcement
- ✅ **Win Detection** - Automatic detection of 3-in-a-row (horizontal, vertical, diagonal)
- ✅ **Move History** - Complete game replay with symbol and cell tracking
- ✅ **In-game Chat** - Live messaging between players

### 🎲 Matchmaking System
- ✅ **Named Games** - Create games with custom names for easy identification
- ✅ **Browse & Join** - View and join waiting games from lobby
- ✅ **Random Matchmaking** - Queue-based system with ±100 rating range
- ✅ **Smart Pairing** - Instant matching when compatible opponent found
- ✅ **Game Search** - Find games by name with real-time filtering
- ✅ **Queue System** - Matchmaking games hidden from regular lobby

### 🏆 Rating & Progression
- ✅ **Dynamic Rating System**
  - Win: +200 points
  - Loss: -100 points (minimum 0)
  - Draw: No change
- ✅ **Top 5 Leaderboard** - Auto-refreshes every 10 seconds
- ✅ **Live Rating Display** - Real-time updates in header (5s refresh)
- ✅ **Statistics Tracking** - Win/Loss/Draw records
- ✅ **Medal Rankings** - 🥇🥈🥉 for top 3 players

### 🎨 UI/UX
- ✅ **User Authentication** - Secure JWT-based register/login
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Dark Mode Support** - Automatic theme switching
- ✅ **Sidebar Layout** - 3-column game lobby + leaderboard sidebar
- ✅ **Visual Feedback** - Color-coded players (X=Blue, O=Red)
- ✅ **Loading States** - Smooth transitions and indicators

---

## 🛠 Tech Stack

### Frontend
- **React 18.3.1** - UI framework with hooks
- **TypeScript** - Type-safe development
- **Vite 5.4.20** - Lightning-fast build tool
- **React Router 6** - Client-side routing
- **Zustand** - Lightweight state management
- **Axios** - HTTP client with interceptors
- **Socket.IO Client** - WebSocket real-time communication
- **Tailwind CSS** - Utility-first styling

### Backend Requirements
- **NestJS** - Node.js framework
- **MongoDB** - Database with Mongoose ODM
- **Socket.IO** - WebSocket server
- **JWT** - Authentication tokens

---

## 📦 Installation

### 1. Clone & Install

```bash
# Clone repository
git clone <repository-url>
cd lila-game-frontend

# Install dependencies
npm install
```

### 2. Environment Configuration

Create `.env` file in root:

```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=http://localhost:3000
```

### 3. Start Development

```bash
# Development server (hot reload)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### 4. Verify Setup

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api/docs

**Test Backend Connection:**
```bash
curl http://localhost:3000
```

---

## 📁 Project Structure

```
lila-game-frontend/
├── public/                      # Static assets
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   └── Header.tsx      # Nav header with live rating
│   │   └── Leaderboard.tsx     # Top 5 players component
│   ├── pages/
│   │   ├── HomePage.tsx        # Landing page
│   │   ├── LoginPage.tsx       # Authentication
│   │   ├── RegisterPage.tsx    # User registration
│   │   ├── GameLobbyPage.tsx   # Game listing & creation
│   │   └── GamePlayPage.tsx    # Tic-tac-toe board & gameplay
│   ├── services/
│   │   ├── api.ts              # Axios HTTP client + normalization
│   │   └── socket.ts           # Socket.IO WebSocket service
│   ├── store/
│   │   ├── authStore.ts        # Zustand auth state
│   │   └── gameStore.ts        # Zustand game state
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── App.tsx                 # Root component with routes
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global styles + Tailwind
├── .env                         # Environment variables
├── package.json                 # Dependencies
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS config
└── tsconfig.json               # TypeScript config
```

---

## 🎯 How It Works

### Game Board Representation

```typescript
// 3x3 Grid stored as 9-element array
const board = [null, null, null, null, null, null, null, null, null];

// Visual layout:
// [0, 1, 2]
// [3, 4, 5]
// [6, 7, 8]

// Example mid-game:
["X", "O", null, "X", "X", null, "O", null, null]
// Renders as:
//  X | O |  
// -----------
//  X | X |  
// -----------
//  O |   |  
```

### Player Assignment
- **Player X** = `whitePlayer` (goes first)
- **Player O** = `blackPlayer` (goes second)

### Move Flow

```
1. Player X clicks cell 4 (center)
   ↓
2. Frontend validation (empty cell, correct turn, game in progress)
   ↓
3. Optimistic UI update (instant feedback)
   ↓
4. WebSocket send: { from: "4", to: "4", piece: "X" }
   ↓
5. Backend validates & updates MongoDB
   ↓
6. Backend checks win condition
   ↓
7. Backend broadcasts gameUpdate to both players
   ↓
8. Both clients update board state
   ↓
9. Turn changes to O
```

### Win Detection

```typescript
// Win patterns (8 total)
Rows:      [0,1,2], [3,4,5], [6,7,8]
Columns:   [0,3,6], [1,4,7], [2,5,8]
Diagonals: [0,4,8], [2,4,6]
```

---

## 🚀 Advanced Features

### Rating System

**How it works:**
- Starting rating: **1200**
- Win: **+200 points**
- Loss: **-100 points** (minimum 0)
- Draw: **No change**

**Real-time Updates:**
- Header rating: Refreshes every **5 seconds**
- Leaderboard: Refreshes every **10 seconds**

**Example:**
```
Player A (1200) defeats Player B (1200)
→ Player A: 1200 + 200 = 1400
→ Player B: 1200 - 100 = 1100
```

### Random Matchmaking

**Queue-based System:**

1. **Player A** clicks "Find Random Match" (rating: 1300)
   - Creates queue game (invisible in lobby)
   - Status: Waiting for opponent within ±100 rating (1200-1400)

2. **Player B** clicks "Find Random Match" (rating: 1350)
   - Searches for compatible queue games
   - Finds Player A's game (1350 within 1200-1400 ✓)
   - Instantly joins the game

3. **Both players** redirected to gameplay
   - Game starts immediately
   - No manual joining required

**Key Features:**
- Queue games marked with `isRandomMatch: true`
- Hidden from regular lobby listing
- Only visible to matchmaking system
- ±100 rating tolerance

### Game Search

```typescript
// Frontend
const handleSearch = async () => {
  const games = await gamesAPI.searchGames(searchTerm);
  setActiveGames(games);
};

// Backend
GET /games?search=Quick
// Returns games where gameName matches "Quick"
```

### Leaderboard

**Display Logic:**
```typescript
Top 5 Players:
🥇 #1 Player1 (1800) - 10W-2L-1D
🥈 #2 Player2 (1650) - 8W-3L-0D
🥉 #3 Player3 (1500) - 7W-5L-2D
#4 Player4 (1420) - 6W-6L-1D
#5 Player5 (1350) - 5W-7L-3D
```

---

## 🧪 Testing Guide

### Authentication Tests

**Test 1: Register New User**
```bash
1. Go to /register
2. Enter: username (min 3), email, password (min 6)
3. Click Register
✓ Redirects to /games
✓ Token in localStorage
✓ No console errors
```

**Test 2: Login**
```bash
1. Go to /login
2. Enter credentials
3. Click Login
✓ Redirects to /games
✓ Token persists
✓ User data loads
```

### Gameplay Tests

**Test 3: Create & Join Game**
```bash
Browser 1:
1. Create game (10+0)
2. See empty board
✓ Status: "waiting"

Browser 2 (Incognito):
1. Register different user
2. Join the game
✓ Both see board
✓ Status: "in_progress"
✓ WebSocket connected
```

**Test 4: Make Moves**
```bash
Player 1 (X):
1. Click center cell (4)
✓ X appears instantly
✓ Turn → O

Player 2 (O):
1. Board updates automatically
2. Click top-left (0)
✓ O appears
✓ Turn → X
✓ Both boards synced
```

**Test 5: Win Game**
```bash
Player 1:
1. Get 3 X's in a row (cells 0,1,2)
✓ Game ends
✓ Status: "completed"
✓ "X Wins! 🎉" displayed
✓ Player 1 rating +200
✓ Player 2 rating -100
```

### Feature Tests

**Test 6: Random Matchmaking**
```bash
Player 1 (1200 rating):
1. Click "Find Random Match"
✓ Queue game created
✓ Not visible in lobby

Player 2 (1250 rating):
1. Click "Find Random Match"
✓ Instantly paired with Player 1
✓ Both redirected to game
✓ Game starts immediately
```

**Test 7: Leaderboard**
```bash
1. Win several games
2. Check sidebar leaderboard
✓ Top 5 players shown
✓ Sorted by rating
✓ Shows W-L-D stats
✓ Auto-refreshes (10s)
```

**Test 8: Game Search**
```bash
1. Create game named "Test Match"
2. In lobby, search "Test"
✓ Shows only matching games
3. Click Clear
✓ Shows all games
```

### Edge Cases

**Test 9: Invalid Moves**
```bash
1. Try clicking occupied cell
✓ Nothing happens

2. Try moving on opponent's turn
✓ Move rejected

3. Try moving after game ends
✓ Board disabled
```

**Test 10: Token Expiration**
```bash
1. Clear localStorage
2. Try accessing /games
✓ Redirects to /login
✓ No crashes
```

---

## 📊 API & Data Flow

### API Endpoints

**Authentication:**
```
POST /auth/register - Create account
POST /auth/login    - Authenticate user
GET  /auth/profile  - Get user data
```

**Games:**
```
POST   /games                - Create game
GET    /games                - List active games
GET    /games?search={name}  - Search by name
GET    /games/:id            - Get game details
POST   /games/:id/join       - Join game
POST   /games/:id/move       - Make move
POST   /games/random-match   - Find random match
POST   /games/:id/abandon    - Forfeit game
```

**Users:**
```
GET /users/profile       - Current user
GET /users/leaderboard   - Top 5 players
GET /users/:id           - User details
```

### Data Flow Example

**Creating a Game:**

```
1. Frontend (GameLobbyPage)
   └─> gamesAPI.createGame({ gameName: "Quick", ... })

2. API Service (api.ts)
   └─> POST http://localhost:3000/games
       Authorization: Bearer <jwt>
       Body: { gameName, timeControl... }

3. Backend (NestJS)
   ├─> Validate JWT
   ├─> Create game in MongoDB
   └─> Return { data: { _id, ...game } }

4. API Service Normalization
   ├─> unwrapResponse(data)    // Extract data.data
   ├─> normalizeGame(unwrapped) // Add id from _id
   └─> Return { _id, id, ...game }

5. Frontend
   ├─> const gameId = game.id || game._id
   └─> navigate(`/games/${gameId}`)
```

### MongoDB _id Normalization

**Problem:** Backend returns `_id`, frontend expects `id`

**Solution:** Normalization layer in `api.ts`

```typescript
// Backend response
{
  _id: "67890abc...",
  whitePlayer: { _id: "123...", username: "player1" }
}

// After normalization
{
  _id: "67890abc...",
  id: "67890abc...",  // ← Added
  whitePlayer: {
    _id: "123...",
    id: "123...",     // ← Added
    username: "player1"
  }
}

// Usage in components
const gameId = game.id || game._id; // Always works! ✓
```

### WebSocket Events

**Client → Server:**
```typescript
socket.emit('joinGame', { gameId })
socket.emit('makeMove', { gameId, move })
socket.emit('sendMessage', { gameId, message })
```

**Server → Client:**
```typescript
socket.on('gameUpdate', (game) => { /* Update board */ })
socket.on('playerJoined', (data) => { /* Show notification */ })
socket.on('chatMessage', (msg) => { /* Display message */ })
```

---

## ⚙️ Configuration

### Environment Variables

```env
# Backend URLs
VITE_API_URL=http://localhost:3000
VITE_WS_URL=http://localhost:3000

# Production example
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=https://api.yourdomain.com
```

### Time Controls

Configure in `GameLobbyPage.tsx`:

```typescript
const timeControls = [
  { minutes: 1, increment: 0 },    // Bullet
  { minutes: 3, increment: 0 },    // Blitz
  { minutes: 5, increment: 5 },    // Blitz
  { minutes: 10, increment: 0 },   // Rapid
  { minutes: 15, increment: 10 },  // Rapid
  { minutes: 30, increment: 0 },   // Classical
];
```

### Polling & Refresh Intervals

```typescript
// GamePlayPage.tsx
const POLLING_INTERVAL = 500;        // 0.5s game state

// Header.tsx
const RATING_REFRESH = 5000;         // 5s user rating

// Leaderboard.tsx
const LEADERBOARD_REFRESH = 10000;   // 10s leaderboard
```

### Tailwind Customization

Edit `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          600: '#2563eb', // Main color
          700: '#1d4ed8',
        },
      },
    },
  },
};
```

---

## 🚢 Deployment

### Build for Production

```bash
# Create optimized build
npm run build

# Output directory: dist/

# Test production build locally
npm run preview
```

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in dashboard
VITE_API_URL=https://your-backend.com
VITE_WS_URL=https://your-backend.com
```

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist

# Configure environment in dashboard
```

### Traditional Hosting

```bash
# 1. Build
npm run build

# 2. Upload dist/ folder to your host

# 3. Configure web server
# - Serve index.html for all routes (SPA)
# - Enable gzip compression
# - Set caching headers

# Nginx example
location / {
    try_files $uri $uri/ /index.html;
}
```

### Docker

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🔧 Troubleshooting

### Backend Connection Issues

**Problem:** Can't connect to backend

**Solutions:**
```bash
# 1. Verify backend is running
curl http://localhost:3000

# 2. Check .env file
cat .env
# Should show: VITE_API_URL=http://localhost:3000

# 3. Check CORS settings in backend
# Backend must allow origin: http://localhost:5173

# 4. Check browser console
# Look for network errors
```

### WebSocket Connection Failed

**Problem:** Real-time updates not working

**Solutions:**
```bash
# 1. Check WebSocket URL
echo $VITE_WS_URL

# 2. Verify token is valid
localStorage.getItem('token')

# 3. Check browser console
# Look for: "Connected to WebSocket server"

# 4. Test WebSocket endpoint
# Should upgrade connection to ws://
```

### Game Creation Returns Undefined

**Problem:** URL shows `/games/undefined`

**Solutions:**
```typescript
// 1. Check console for normalization logs
🎮 Create Game Response: {...}
🎮 Normalized Game: { id: "...", _id: "..." }

// 2. Verify API response structure
// Backend should return: { data: { _id: "...", ... } }

// 3. Clear cache and refresh
localStorage.clear()
// Hard refresh: Cmd+Shift+R

// 4. Check backend logs
// Look for successful game creation
```

### Moves Not Syncing

**Problem:** Opponent doesn't see moves

**Solutions:**
```bash
# 1. Check WebSocket connection status
# Both players should see: "Connected to WebSocket"

# 2. Check Network tab
# Look for WebSocket frames with move data

# 3. Verify game room joined
# Console should show: "Joining game room: <gameId>"

# 4. Check backend WebSocket logs
# Verify moveMove events received
```

### Rating Not Updating

**Problem:** Rating doesn't change after game

**Solutions:**
```typescript
// 1. Check game completion
// Game status should be: "completed"

// 2. Verify winner is set
console.log(game.winner, game.result)

// 3. Wait for auto-refresh (5s)
// Or navigate away and back

// 4. Check backend rating service
// Verify updateRating() called
```

### Leaderboard Not Loading

**Problem:** Leaderboard shows "No players yet"

**Solutions:**
```bash
# 1. Check API endpoint
curl http://localhost:3000/users/leaderboard?limit=5

# 2. Verify users exist in database
# At least one user should have rating

# 3. Check console for errors
# Look for: "Failed to load leaderboard"

# 4. Check route order in backend
# /users/leaderboard should be BEFORE /users/:id
```

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `401 Unauthorized` | Expired/invalid token | Login again |
| `404 Not Found` | Invalid game ID | Check URL |
| `Cannot read property 'id' of undefined` | Missing normalization | Update api.ts |
| `WebSocket connection failed` | Backend not running | Start backend |
| `CORS error` | Backend CORS not configured | Enable CORS for localhost:5173 |

---

## 📚 Additional Resources

### Performance Optimization

- **Code Splitting**: Automatic with React Router
- **Lazy Loading**: Pages loaded on demand
- **WebSocket Reconnection**: Automatic with exponential backoff
- **State Optimization**: Zustand with selective subscriptions
- **CSS Purging**: Tailwind removes unused styles in production

### Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome  | 90+ |
| Firefox | 88+ |
| Safari  | 14+ |
| Edge    | 90+ |

### Security Best Practices

- ✅ JWT tokens with expiration
- ✅ HTTPOnly cookies (backend)
- ✅ CORS configured properly
- ✅ Input validation (frontend + backend)
- ✅ SQL injection prevention (Mongoose)
- ✅ XSS protection (React escaping)

### Development Tips

```bash
# Hot reload
# Vite provides instant HMR - changes appear immediately

# Debug WebSocket
# Open DevTools → Network → WS tab

# View state
# React DevTools → Zustand devtools enabled

# Check bundle size
npm run build
# Check dist/ folder size
```

---

## 📄 License

Part of the Lila Game project.

---

## 🤝 Contributing

1. Follow code style (ESLint + Prettier)
2. Write meaningful commit messages
3. Test on multiple browsers
4. Ensure responsive design works
5. Update documentation for new features

---

## 📞 Support

**Need Help?**

1. Check this README thoroughly
2. Review browser console for errors
3. Verify backend is running
4. Check Network tab for API calls
5. Create an issue in the repository

---

## 🎉 Success Checklist

Before considering the project complete:

- [x] ✅ Users can register and login
- [x] ✅ Games can be created with optional names
- [x] ✅ Games can be joined by other players
- [x] ✅ Tic-tac-toe board works perfectly
- [x] ✅ Moves sync in real-time (0.5s polling)
- [x] ✅ Win detection works correctly
- [x] ✅ Rating system updates after games
- [x] ✅ Leaderboard shows top 5 players
- [x] ✅ Random matchmaking pairs players
- [x] ✅ Game search finds by name
- [x] ✅ WebSocket connections stable
- [x] ✅ No console errors in production
- [x] ✅ Responsive on all devices
- [x] ✅ Dark mode supported
- [x] ✅ Documentation complete

---

**Ready to play Tic-Tac-Toe!** ✖⭕

Built with ❤️ using React, TypeScript, Vite, and Socket.IO

**Version**: 1.0.0 | **Last Updated**: October 17, 2025
