#!/bin/bash

# EcoStay Club - Complete Setup Script
# This script automates the entire setup process

echo "🌱 EcoStay Club - Complete Setup Script"
echo "======================================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js $(node -v) found"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please configure .env file with your API keys"
else
    echo "✅ .env file already exists"
fi

# Create logs directory
mkdir -p logs

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start development:"
echo "   - Frontend only:    npm run dev"
echo "   - Backend only:     npm run dev:server"
echo "   - Both (recommended): npm run dev:full"
echo ""
echo "📊 Dashboard: http://localhost:5000/dashboard.html"
echo "🌐 Main site: http://localhost:3000"
echo ""
