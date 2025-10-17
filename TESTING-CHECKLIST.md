# ✅ Pre-Launch Checklist

## Before Testing

### Backend Setup
- [ ] Backend server is running on port 3000
- [ ] MongoDB is connected and running
- [ ] JWT secret is configured
- [ ] Test with: `curl http://localhost:3000`

### Frontend Setup
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file exists with correct URLs
- [ ] Port 5173 is available

### Environment Variables
```bash
# Check .env file contains:
VITE_API_URL=http://localhost:3000
VITE_WS_URL=http://localhost:3000
```

---

## Testing Phase 1: Authentication

### Register New User
- [ ] Navigate to http://localhost:5173/register
- [ ] Fill form: username (min 3 chars), email, password (min 6 chars)
- [ ] Click "Register"
- [ ] **Expected**: Redirect to `/games`
- [ ] **Console Check**: `localStorage.getItem('token')` returns JWT
- [ ] **No errors** in browser console

### Login Existing User
- [ ] Navigate to http://localhost:5173/login
- [ ] Enter credentials
- [ ] Click "Login"
- [ ] **Expected**: Redirect to `/games`
- [ ] **Console Check**: Token in localStorage
- [ ] **No errors** in browser console

---

## Testing Phase 2: Game Creation

### Create Game - Player 1
- [ ] On `/games` page, select time control (e.g., 10+0)
- [ ] Click "Create Game"
- [ ] **Console Check**:
  ```
  🎮 Create Game Response: {...}
  🎮 Unwrapped: {...}
  🎮 Normalized Game: {...}
  Created game with ID: <some-id>
  ```
- [ ] **Expected**: Navigate to `/games/<id>` (NOT `/games/undefined`)
- [ ] **Expected**: Chessboard displays
- [ ] **Expected**: Shows "Waiting for opponent"
- [ ] **No 404 errors**

### Verify Game in Database (Optional)
```bash
# If you have MongoDB access:
mongo
> use lila-game
> db.games.find().pretty()
# Should show game with _id field
```

---

## Testing Phase 3: Join Game

### Join Game - Player 2 (use Incognito)
- [ ] Open **incognito window**
- [ ] Navigate to http://localhost:5173/register
- [ ] Register with different email (e.g., player2@test.com)
- [ ] On `/games` page, find the waiting game
- [ ] Click "Join Game"
- [ ] **Console Check**:
  ```
  🎮 Joining game with ID: <id>
  🎮 Join Game Response: {...}
  🎮 Normalized Game: {...}
  ```
- [ ] **Expected**: Navigate to `/games/<id>`
- [ ] **Expected**: Both players see the board
- [ ] **No errors**

### WebSocket Connection
- [ ] **Normal window**: Should see "Player joined" (if notifications enabled)
- [ ] **Incognito window**: Board should be from black's perspective
- [ ] **Console Check** (both windows): "✅ Connected to WebSocket server"

---

## Testing Phase 4: Gameplay

### Make Moves
- [ ] **Player 1 (white)**: Drag a piece (e.g., e2 pawn to e4)
- [ ] **Expected**: Piece moves
- [ ] **Expected**: Turn indicator changes to "black"
- [ ] **Player 2 (black)**: Board should update automatically
- [ ] **Player 2**: Make a move (e.g., e7 to e5)
- [ ] **Expected**: Both boards update
- [ ] **Expected**: Turn indicator changes to "white"

### Invalid Moves
- [ ] Try to move opponent's piece
- [ ] **Expected**: Piece snaps back
- [ ] Try to make illegal move
- [ ] **Expected**: Piece snaps back
- [ ] Try to move when it's not your turn
- [ ] **Expected**: Piece doesn't move

### Move History
- [ ] After a few moves, check move history panel
- [ ] **Expected**: Shows moves in algebraic notation
- [ ] **Expected**: Move numbers are correct

---

## Testing Phase 5: Game List

### View Active Games
- [ ] Navigate to `/games`
- [ ] **Console Check**:
  ```
  🎮 Get Active Games Response: {...}
  🎮 Unwrapped: [...]
  🎮 Normalized Games: [...]
  ```
- [ ] **Expected**: Shows list of active games
- [ ] **Expected**: Each game shows correct player names
- [ ] **Expected**: Each game shows correct status (waiting/in_progress)
- [ ] **Expected**: Time control displays correctly (e.g., "10+0")

### Game Actions
- [ ] "Join Game" button only on waiting games
- [ ] "Join Game" disabled for your own games
- [ ] "Resume Game" button only on your in-progress games
- [ ] Click "Refresh Games" updates the list

---

## Testing Phase 6: Edge Cases

### Token Expiration
- [ ] Clear localStorage: `localStorage.clear()`
- [ ] Try to access `/games`
- [ ] **Expected**: Redirect to `/login`

### Invalid Game ID
- [ ] Navigate to `/games/invalid-id-12345`
- [ ] **Expected**: "Game not found" message
- [ ] **Expected**: "Back to Lobby" button works

### Abandoned Game
- [ ] In an in-progress game, click "Abandon Game"
- [ ] **Expected**: Confirmation dialog
- [ ] Confirm abandon
- [ ] **Expected**: Navigate back to `/games`
- [ ] **Expected**: Game status updates

---

## Browser Console Checks

### No Errors ✅
Look for these and fix if found:
- ❌ TypeError: Cannot read property 'id' of undefined
- ❌ 401 Unauthorized
- ❌ 404 Not Found (except for invalid IDs)
- ❌ WebSocket connection failed

### Expected Logs ✅
You should see:
- ✅ 🎮 Create Game Response: ...
- ✅ 🎮 Unwrapped: ...
- ✅ 🎮 Normalized Game: ...
- ✅ Created game with ID: ...
- ✅ ✅ Connected to WebSocket server

---

## Network Tab Checks

### Successful Requests ✅
- ✅ POST `/auth/register` → 201 Created
- ✅ POST `/auth/login` → 200 OK
- ✅ POST `/games` → 201 Created
- ✅ GET `/games` → 200 OK
- ✅ POST `/games/<id>/join` → 200 OK
- ✅ GET `/games/<id>` → 200 OK

### Headers ✅
All protected requests should have:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response Format ✅
All responses should have:
```json
{
  "data": {
    "_id": "...",
    ...
  }
}
```

---

## Final Verification

### URLs ✅
- [ ] No `/games/undefined` URLs
- [ ] All game URLs have proper MongoDB ObjectId
- [ ] Navigation works correctly

### Data Integrity ✅
- [ ] User IDs match correctly
- [ ] Game IDs are consistent
- [ ] Player data displays correctly
- [ ] Moves are saved and synced

### UI/UX ✅
- [ ] No blank screens
- [ ] Loading states show when appropriate
- [ ] Error messages are helpful
- [ ] Buttons are enabled/disabled correctly

---

## Performance Checks

### Load Times
- [ ] Initial page load < 2 seconds
- [ ] Game creation < 1 second
- [ ] Game joining < 1 second
- [ ] Move response < 500ms

### Memory
- [ ] No memory leaks (check in DevTools Performance)
- [ ] WebSocket connections close properly on page leave
- [ ] No duplicate event listeners

---

## Multi-Player Test Scenario

### Full Game Flow
1. [ ] **Browser 1**: Register as player1@test.com
2. [ ] **Browser 1**: Create game (10+0)
3. [ ] **Browser 2**: Register as player2@test.com
4. [ ] **Browser 2**: Join the game
5. [ ] **Browser 1**: Make move (e2→e4)
6. [ ] **Browser 2**: See move update
7. [ ] **Browser 2**: Make move (e7→e5)
8. [ ] **Browser 1**: See move update
9. [ ] Continue for 5-10 moves
10. [ ] Verify move history in both browsers
11. [ ] Check no lag or sync issues

---

## Rollback Plan

If something breaks:

### Quick Fixes
```bash
# Clear browser data
localStorage.clear()
# Hard refresh
Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

### Restart Services
```bash
# Backend
cd lila-game-backend
npm run start:dev

# Frontend
cd lila-game-frontend
npm run dev
```

### Check Versions
```bash
# Node version
node --version  # Should be >= 16

# Dependencies
npm list
```

---

## Success Criteria

### All Green ✅
- ✅ Users can register and login
- ✅ JWT tokens work correctly
- ✅ Games can be created
- ✅ Games can be joined
- ✅ Moves sync between players
- ✅ No `undefined` in URLs
- ✅ No console errors
- ✅ WebSocket connects
- ✅ Game state persists

### Ready for Production 🚀
When all checks pass:
- [ ] Document any remaining issues
- [ ] Create backlog for enhancements
- [ ] Set up monitoring (optional)
- [ ] Deploy to staging (if applicable)

---

## Troubleshooting Guide

### Issue: Can't create game
**Check**:
1. Console logs for error messages
2. Network tab for 401/403 errors
3. localStorage for token
4. Backend logs for database errors

### Issue: Can't join game
**Check**:
1. Game ID in URL
2. Game status (must be "waiting")
3. Not trying to join own game
4. Backend logs

### Issue: Moves don't sync
**Check**:
1. WebSocket connection status
2. Both clients connected
3. Network tab for WebSocket frames
4. Backend WebSocket gateway logs

### Issue: URL shows undefined
**Check**:
1. Console for normalization logs
2. API response structure
3. Game object has `id` or `_id`
4. Clear cache and refresh

---

## Documentation

- 📄 `COMPLETE-FIX-DOCUMENTATION.md` - Full detailed guide
- 📄 `QUICK-FIX-SUMMARY.md` - Quick reference
- 📄 `DATA-FLOW-VISUALIZATION.md` - Visual flow diagrams
- 🧪 `test-frontend.sh` - Automated test script

---

**Status**: Ready for testing! 🎉  
**Date**: October 17, 2025  
**Version**: 1.0.0 (All fixes applied)
