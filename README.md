# 🎨 Lila Game Frontend

A modern React-based frontend for the Lila Game chess platform with real-time gameplay.

## Features

- ✅ User Authentication (Register/Login)
- ✅ Game Lobby (Create and Join Games)
- ✅ Interactive Chess Board
- ✅ Real-time Gameplay with WebSocket
- ✅ Live Move Updates
- ✅ In-game Chat
- ✅ Move History Display
- ✅ Responsive Design
- ✅ Dark Mode Support

## Tech Stack

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **React Router** - Navigation
- **Zustand** - State Management
- **Axios** - HTTP Client
- **Socket.IO Client** - WebSocket
- **react-chessboard** - Chess UI Component
- **chess.js** - Chess Logic
- **Tailwind CSS** - Styling

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Lila Game Backend running on http://localhost:3000

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   Edit `.env` if needed:
   ```env
   VITE_API_URL=http://localhost:3000
   VITE_WS_URL=http://localhost:3000
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The app will be available at http://localhost:5173

## Usage

### 1. Start the Backend
Make sure your backend is running:
```bash
cd ../lila-game-project
docker-compose up -d
# OR
npm run start:dev
```

### 2. Start the Frontend
```bash
npm run dev
```

### 3. Access the Application
Open http://localhost:5173 in your browser

### 4. Create an Account
1. Click "Register" 
2. Fill in your details
3. You'll be automatically logged in

### 5. Play Chess!
1. Go to "Games" in the navigation
2. Create a new game or join an existing one
3. Play chess in real-time!

## Project Structure

```
src/
├── components/
│   └── Layout/
│       └── Header.tsx          # Navigation header
├── pages/
│   ├── HomePage.tsx            # Landing page
│   ├── LoginPage.tsx           # Login page
│   ├── RegisterPage.tsx        # Registration page
│   ├── GameLobbyPage.tsx       # Game lobby
│   └── GamePlayPage.tsx        # Chess board & gameplay
├── services/
│   ├── api.ts                  # HTTP API client
│   └── socket.ts               # WebSocket service
├── store/
│   ├── authStore.ts            # Auth state management
│   └── gameStore.ts            # Game state management
├── types/
│   └── index.ts                # TypeScript types
├── App.tsx                     # Main app component
├── main.tsx                    # App entry point
└── index.css                   # Global styles
```

## Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code
```

## Features Explained

### Authentication
- Register with username, email, and password
- Login with username or email
- JWT token management
- Auto-logout on token expiration
- Protected routes

### Game Lobby
- View all active games
- Create new games with custom time controls
- Join waiting games
- Resume ongoing games
- Auto-refresh game list

### Chess Board
- Interactive drag-and-drop
- Legal move validation
- Board orientation (white/black)
- Real-time move synchronization
- Move history display
- Algebraic notation

### Real-time Features
- Instant move updates
- Player presence tracking
- Live chat messages
- Game status changes
- WebSocket reconnection

## Configuration

### Backend URL
Edit `.env` to change the backend URL:
```env
VITE_API_URL=https://your-backend-url.com
VITE_WS_URL=https://your-backend-url.com
```

### Time Controls
Available in the game lobby:
- 1+0 (Bullet)
- 3+0, 3+2 (Blitz)
- 5+0, 5+5 (Blitz)
- 10+0, 10+5 (Rapid)
- 15+0, 15+10 (Rapid)
- 30+0, 30+10 (Classical)

## Styling

The app uses Tailwind CSS with custom configuration:
- Responsive design (mobile-first)
- Dark mode support
- Custom color palette
- Utility classes for rapid development

### Customizing Colors
Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: { /* your colors */ },
    },
  },
}
```

## Troubleshooting

### Backend Connection Issues
1. Ensure backend is running
2. Check `.env` file configuration
3. Check browser console for errors
4. Verify CORS is enabled in backend

### WebSocket Issues
1. Check WebSocket URL in `.env`
2. Ensure token is valid
3. Check browser console for Socket.IO errors
4. Try refreshing the page

### Chess Board Issues
1. Clear browser cache
2. Ensure `chess.js` and `react-chessboard` are installed
3. Check console for move validation errors

## Development Tips

### Hot Reload
Vite provides instant hot module replacement. Changes appear immediately.

### State Management
- Auth state persists to localStorage
- Game state is managed in memory
- WebSocket connections auto-reconnect

### API Calls
All API calls are in `src/services/api.ts`. Axios interceptors handle:
- Token injection
- Token expiration
- Error handling

### Socket Events
All WebSocket events are in `src/services/socket.ts`:
- `joinGame` - Join a game room
- `makeMove` - Send a move
- `sendMessage` - Send chat message
- `gameUpdate` - Receive game updates
- `chatMessage` - Receive chat messages

## Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

The build output will be in the `dist/` directory.

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Traditional Hosting
1. Run `npm run build`
2. Upload `dist/` folder to your hosting
3. Configure environment variables on the host

## Performance

- Code splitting with React Router
- Lazy loading for pages
- Optimized WebSocket reconnection
- Efficient state updates
- Tailwind CSS purging in production

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the code style (ESLint + Prettier)
2. Write meaningful commit messages
3. Test on multiple browsers
4. Ensure responsive design works

## License

Part of the Lila Game project.

## Support

For issues or questions, check the main project documentation or create an issue in the repository.

---

**Ready to play chess!** ♔♕♖♗♘♙

Built with ❤️ using React, TypeScript, and Vite# Tic-tac-multiplayer-game-front-end
