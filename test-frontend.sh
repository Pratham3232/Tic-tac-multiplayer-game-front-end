#!/bin/bash

# Frontend Testing Script for Game Creation and Join
# This script helps you verify the fixes are working

echo "🧪 Testing Frontend Fixes..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "📋 Pre-flight Checklist:"
echo ""

# Check if backend is running
echo -n "1. Checking if backend is running on port 3000... "
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${RED}❌ Backend is NOT running${NC}"
    echo "   Start backend with: cd ../lila-game-backend && npm run start:dev"
    exit 1
fi

# Check if .env file exists
echo -n "2. Checking .env configuration... "
if [ -f ".env" ]; then
    echo -e "${GREEN}✅ .env file exists${NC}"
    echo "   VITE_API_URL=$(grep VITE_API_URL .env | cut -d '=' -f2)"
    echo "   VITE_WS_URL=$(grep VITE_WS_URL .env | cut -d '=' -f2)"
else
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo "   Creating .env file..."
    echo "VITE_API_URL=http://localhost:3000" > .env
    echo "VITE_WS_URL=http://localhost:3000" >> .env
    echo -e "${GREEN}✅ Created .env file${NC}"
fi

# Check if node_modules exists
echo -n "3. Checking dependencies... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ Dependencies NOT installed${NC}"
    echo "   Installing dependencies..."
    npm install
fi

echo ""
echo "🚀 Starting Frontend Development Server..."
echo ""
echo -e "${YELLOW}📝 Testing Instructions:${NC}"
echo ""
echo "1️⃣  Registration Test:"
echo "   - Open http://localhost:5173/register"
echo "   - Create account: testuser1@test.com / password123"
echo "   - Should redirect to /games"
echo "   - Check console: localStorage.getItem('token')"
echo ""
echo "2️⃣  Create Game Test:"
echo "   - On /games page, select time control"
echo "   - Click 'Create Game'"
echo "   - Check console for: 🎮 Create Game Response"
echo "   - Should navigate to /games/<id> (NOT /games/undefined)"
echo ""
echo "3️⃣  Join Game Test (use incognito):"
echo "   - Open incognito: http://localhost:5173/register"
echo "   - Create account: testuser2@test.com / password123"
echo "   - Click 'Join Game' on waiting game"
echo "   - Check console for: 🎮 Joining game with ID"
echo "   - Should navigate to /games/<id>"
echo ""
echo "4️⃣  Play Game Test:"
echo "   - Drag and drop pieces on your turn"
echo "   - Moves should sync between browsers"
echo "   - Check console for WebSocket messages"
echo ""
echo -e "${GREEN}✅ All fixes have been applied!${NC}"
echo ""
echo "Press Ctrl+C to stop the server when done testing."
echo ""
echo "---------------------------------------------------"
echo ""

# Start the dev server
npm run dev
