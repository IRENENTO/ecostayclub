#!/usr/bin/env node

/**
 * EcoStay Club - Development Server
 * This script manages the development environment setup and startup
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log(`
╔════════════════════════════════════════════════╗
║         🌱 EcoStay Club - Dev Server 🌱        ║
║              Full Stack Platform               ║
╚════════════════════════════════════════════════╝
`);

// Check if node_modules exists
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
    console.log('📦 Installing dependencies...');
    spawn('npm', ['install'], { 
        cwd: __dirname,
        stdio: 'inherit'
    }).on('close', startServers);
} else {
    startServers();
}

function startServers() {
    console.log(`
✅ Setup Complete! Starting servers...

📊 Dashboard:    http://localhost:5000/dashboard.html
🌐 Frontend:     http://localhost:3000
🔌 API:          http://localhost:5000/api

🔐 Default Login:
   Email:    admin@ecostay.org
   Password: Admin123

📚 Documentation:
   - QUICK_START.md         → Get started in 5 minutes
   - DEPLOYMENT_GUIDE.md    → Deploy to production
   - API_DOCS.md            → API reference
   - PROJECT_SUMMARY.md     → What's been built
`);

    // Start backend server
    console.log('\n🚀 Starting Backend Server...');
    const backend = spawn('npm', ['run', 'dev:server'], { 
        cwd: __dirname,
        stdio: 'inherit'
    });

    // Start frontend dev server (with slight delay)
    setTimeout(() => {
        console.log('\n🚀 Starting Frontend Dev Server...');
        const frontend = spawn('npm', ['run', 'dev'], { 
            cwd: __dirname,
            stdio: 'inherit'
        });

        // Cleanup on exit
        process.on('SIGINT', () => {
            console.log('\n\n👋 Shutting down servers...');
            backend.kill();
            frontend.kill();
            process.exit(0);
        });
    }, 2000);
}
