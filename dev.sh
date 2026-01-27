#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    🌱 EcoStay Club - Full Stack Platform 🌱    ║${NC}"
echo -e "${BLUE}║           Development & Deployment            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found${NC}"
    echo "Please install from: https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v)
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✅ Node.js ${NODE_VERSION}${NC}"
echo -e "${GREEN}✅ npm ${NPM_VERSION}${NC}"
echo ""

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    npm install
    echo ""
fi

# Initialize database
if [ ! -f "db.json" ]; then
    echo -e "${BLUE}🗄️  Initializing database...${NC}"
    node init-db.js
    echo ""
fi

# Create .env if needed
if [ ! -f ".env" ]; then
    echo -e "${BLUE}📝 Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${BLUE}⚠️  Please configure .env with your API keys${NC}"
    echo ""
fi

echo -e "${GREEN}✅ All systems ready!${NC}"
echo ""
echo -e "${BLUE}🚀 Starting Full Stack Application...${NC}"
echo ""
echo -e "${GREEN}📊 Dashboard:${NC}    http://localhost:5000/dashboard.html"
echo -e "${GREEN}🌐 Frontend:${NC}     http://localhost:3000"
echo -e "${GREEN}🔌 API:${NC}          http://localhost:5000/api"
echo ""
echo -e "${GREEN}🔐 Default Login:${NC}"
echo -e "   Email:    admin@ecostay.org"
echo -e "   Password: Admin123"
echo ""
echo -e "${BLUE}Press Ctrl+C to stop${NC}"
echo ""

# Run dev server
npm run dev:full
