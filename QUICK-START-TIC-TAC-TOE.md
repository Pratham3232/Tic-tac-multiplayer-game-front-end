# 🎮 Tic-Tac-Toe Quick Start Guide

## What Changed?

The game has been converted from **Chess** to **Tic-Tac-Toe** to match the assignment requirements!

---

## 🎯 How to Play

### 1. Start the Application

```bash
# Make sure backend is running first!
npm run dev
```

### 2. Create an Account
- Go to http://localhost:5173/register
- Create your account
- You'll be redirected to the game lobby

### 3. Create a Game
- Click "Create Game" button
- Select time control (optional - for tracking purposes)
- Click "Create Game"
- You are Player **X** (blue)

### 4. Join a Game (Second Player)
- Open an incognito window
- Register another account
- See the waiting game in the lobby
- Click "Join Game"
- You are Player **O** (red)

### 5. Play Tic-Tac-Toe!
- **X** goes first
- Click on any empty cell to place your symbol
- Get 3 in a row to win (horizontal, vertical, or diagonal)
- The game alternates turns automatically

---

## 🎨 Visual Guide

### The Board
```
┌─────┬─────┬─────┐
│  1  │  2  │  3  │
├─────┼─────┼─────┤
│  4  │  5  │  6  │
├─────┼─────┼─────┤
│  7  │  8  │  9  │
└─────┴─────┴─────┘
```

### Winning Combinations
```
Rows:
[1,2,3]  [4,5,6]  [7,8,9]

Columns:
[1,4,7]  [2,5,8]  [3,6,9]

Diagonals:
[1,5,9]  [3,5,7]
```

---

## ✨ Features

### Real-Time Gameplay
- ✅ Instant move updates
- ✅ Both players see moves immediately
- ✅ WebSocket-powered synchronization

### Visual Indicators
- ✅ **X** = Blue color
- ✅ **O** = Red color
- ✅ "You" badge shows your player
- ✅ Turn indicator shows whose move it is
- ✅ Hover effects on empty cells

### Game Info
- ✅ Player names and ratings
- ✅ Current game status
- ✅ Move history
- ✅ Chat with opponent
- ✅ Game rules sidebar

---

## 🎮 Game Rules

1. **X always goes first**
2. **Players alternate turns**
3. **Click an empty cell to place your symbol**
4. **Get 3 in a row to win** (horizontal, vertical, or diagonal)
5. **If all 9 cells are filled with no winner, it's a draw**

---

## 🏆 Winning

### Win Conditions
- **Horizontal**: XXX in any row
- **Vertical**: XXX in any column
- **Diagonal**: XXX from corner to corner

### Game Over Display
```
Game Over!
X Wins! 🎉
Winner: Player1
```

### Draw Condition
```
Game Over!
It's a Draw! 🤝
```

---

## 💬 Chat Feature

- Chat with your opponent in real-time
- Type a message and press Enter or click Send
- Messages appear instantly for both players

---

## 🎯 Example Game

### Turn 1 (X)
```
Player X clicks center (cell 5)

┌───┬───┬───┐
│   │   │   │
├───┼───┼───┤
│   │ X │   │
├───┼───┼───┤
│   │   │   │
└───┴───┴───┘
```

### Turn 2 (O)
```
Player O clicks top-left (cell 1)

┌───┬───┬───┐
│ O │   │   │
├───┼───┼───┤
│   │ X │   │
├───┼───┼───┤
│   │   │   │
└───┴───┴───┘
```

### Turn 3 (X)
```
Player X clicks top-middle (cell 2)

┌───┬───┬───┐
│ O │ X │   │
├───┼───┼───┤
│   │ X │   │
├───┼───┼───┤
│   │   │   │
└───┴───┴───┘
```

### Continue playing...
```
┌───┬───┬───┐
│ O │ X │ O │
├───┼───┼───┤
│   │ X │   │
├───┼───┼───┤
│   │ X │   │
└───┴───┴───┘

X Wins! (vertical middle column)
```

---

## 🔧 Troubleshooting

### Issue: Can't click on cells
**Solution:**
- Make sure it's your turn
- Check if game status is "in progress"
- Verify you're not clicking an occupied cell

### Issue: Moves not syncing
**Solution:**
- Check WebSocket connection in console
- Look for "✅ Connected to WebSocket server"
- Refresh both browser windows

### Issue: Game not starting
**Solution:**
- Make sure second player has joined
- Status should change from "waiting" to "in progress"
- Both players need to be connected

### Issue: Can't see the board
**Solution:**
- Clear browser cache
- Hard refresh (Cmd+Shift+R or Ctrl+Shift+F5)
- Check console for errors

---

## 📊 Console Logs

You should see these logs:
```
🎮 Create Game Response: {...}
🎮 Unwrapped: {...}
🎮 Normalized Game: {...}
Created game with ID: 67890abc...
✅ Connected to WebSocket server
```

---

## ⌨️ Keyboard Shortcuts

- **Enter** - Send chat message
- **Cmd/Ctrl + R** - Refresh page
- **Tab** - Navigate between elements

---

## 🎨 Color Guide

| Element | Color | Meaning |
|---------|-------|---------|
| ✖ (X) | Blue | First player |
| ⭕ (O) | Red | Second player |
| Yellow | Warning | Waiting for opponent |
| Green | Success | Game completed |
| Gray | Neutral | Empty cells |

---

## 📱 Mobile Support

The game is fully responsive and works on:
- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Tablets (iPad, Android tablets)
- ✅ Mobile phones (iOS, Android)

---

## 🎯 Tips for Best Experience

1. **Use two browsers** - Normal + Incognito for testing
2. **Check turn indicator** - Shows whose turn it is
3. **Watch for "Your turn!"** - Text appears when it's your move
4. **Use chat** - Communicate with your opponent
5. **Check move history** - See all previous moves

---

## 🚀 Quick Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## ✅ Verification Checklist

- [ ] Backend is running on port 3000
- [ ] Frontend is running on port 5173
- [ ] Can register new account
- [ ] Can create a game
- [ ] Second player can join
- [ ] Can make moves (X first, then O)
- [ ] Moves sync in real-time
- [ ] Chat messages work
- [ ] Game detects winner
- [ ] Can start a new game

---

## 🎉 You're Ready to Play!

1. Start the backend server
2. Run `npm run dev`
3. Open http://localhost:5173
4. Register and create a game
5. Have fun playing Tic-Tac-Toe! ✖⭕

---

**Need Help?**
- Check `TIC-TAC-TOE-CONVERSION.md` for technical details
- Review `COMPLETE-FIX-DOCUMENTATION.md` for architecture
- Look at browser console for error messages

**Happy Gaming! 🎮**
