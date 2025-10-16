# 🚀 Quick Start - Frontend

## Get Up and Running in 2 Minutes!

### Step 1: Make sure Backend is Running
```bash
cd /Users/prathamnigam/lila-game-project
docker-compose up -d
# OR
npm run start:dev
```

The backend should be at: http://localhost:3000

### Step 2: Start Frontend
```bash
cd /Users/prathamnigam/lila-game-frontend
npm run dev
```

The frontend will be at: http://localhost:5173

### Step 3: Play Chess!
1. Open http://localhost:5173
2. Click "Register" and create an account
3. Go to "Games"
4. Click "Create Game"
5. Open another browser/incognito window
6. Register another user
7. Join the game
8. Play chess in real-time!

## That's It! 🎉

You now have a fully functional chess platform with:
- ✅ Real-time gameplay
- ✅ WebSocket communication
- ✅ User authentication
- ✅ Interactive chess board
- ✅ Live chat
- ✅ Move history

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Troubleshooting
npm install              # Reinstall dependencies
rm -rf node_modules dist # Clean and reinstall
npm install
```

## URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api/docs
- **MongoDB UI**: http://localhost:8081

## Need Help?

Check:
1. Backend is running: `curl http://localhost:3000`
2. Frontend .env file is correct
3. Browser console for errors
4. README.md for detailed docs

---

**Have fun playing chess!** ♟️