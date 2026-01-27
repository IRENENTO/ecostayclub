# EcoStay Club - Full Stack Web Application

> A complete student-led environmental action platform with admin dashboard, member management, and event tracking.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### 2. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd club

# Install dependencies
npm install
```

### 3. Environment Setup

```bash
# Create .env file from template
cp .env.example .env

# Edit .env with your settings
# IMPORTANT: Configure Firebase, EmailJS, and other API keys
```

### 4. Development

**Option A: Run Frontend Only**
```bash
npm run dev
# Opens at http://localhost:3000
```

**Option B: Run Backend Only**
```bash
npm run dev:server
# Runs at http://localhost:5000
```

**Option C: Run Both (Full Stack)**
```bash
npm run dev:full
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# Dashboard: http://localhost:5000/dashboard.html
```

## 📁 Project Structure

```
club/
├── index.html              # Main landing page
├── admin.html              # Admin panel (legacy)
├── dashboard.html          # New admin dashboard
├── styles.css              # Global styles
├── script.js               # Main frontend logic
├── script-firebase.js      # Firebase integration
├── api-integration.js      # API client
├── server.js               # Express backend
├── sw.js                   # Service worker (PWA)
├── manifest.json           # PWA manifest
├── img/                    # Images directory
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── .env                    # Environment variables
└── README.md               # This file
```

## 🔑 Key Features

### Frontend
- ✅ Responsive landing page
- ✅ Authentication (login/register)
- ✅ User profiles
- ✅ Event discovery and registration
- ✅ Community feed
- ✅ Dark mode support
- ✅ Progressive Web App (PWA)
- ✅ Multi-language support (EN, FR, RW)

### Dashboard
- ✅ Real-time statistics
- ✅ Member management
- ✅ Event management
- ✅ Community posts management
- ✅ Analytics and charts
- ✅ Export data functionality
- ✅ Role-based access control

### Backend API
- ✅ RESTful API endpoints
- ✅ User authentication
- ✅ Member CRUD operations
- ✅ Event management
- ✅ Post/feed system
- ✅ Statistics tracking
- ✅ Search functionality
- ✅ Data export

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Members
- `GET /api/members` - Get all members
- `GET /api/members/:id` - Get specific member
- `POST /api/members` - Create member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get specific event
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create post
- `DELETE /api/posts/:id` - Delete post

### Stats & Dashboard
- `GET /api/stats` - Get statistics
- `GET /api/admin/dashboard` - Get dashboard data

## 🚢 Deployment

### Local Production Build

```bash
# Build for production
npm run build

# Serve production build
npm run start
```

### Heroku Deployment

```bash
# Login to Heroku
heroku login

# Create app
heroku create ecostay-club

# Set environment variables
heroku config:set PORT=5000

# Deploy
git push heroku main
```

### Vercel (Frontend Only)

```bash
# Build
npm run build

# Deploy dist folder to Vercel
vercel --prod
```

### Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init

# Deploy
firebase deploy
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5000
CMD ["npm", "run", "server"]
```

```bash
docker build -t ecostay-club .
docker run -p 5000:5000 ecostay-club
```

## 🔐 Security Checklist

- [ ] Change all default credentials in `.env`
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS in production
- [ ] Set CORS properly for production domain
- [ ] Use environment variables for sensitive data
- [ ] Implement rate limiting on API
- [ ] Add input validation on all endpoints
- [ ] Use password hashing (bcrypt) instead of base64
- [ ] Implement database transactions
- [ ] Set up automated backups

## 📝 Database Setup

### MongoDB (Recommended)

```bash
# Install MongoDB
# https://docs.mongodb.com/manual/installation/

# Create database
mongosh
> use ecostay
> db.createCollection("users")
> db.createCollection("members")
> db.createCollection("events")
> db.createCollection("posts")
```

### Supabase (PostgreSQL)

```bash
# Create account at https://supabase.com
# Create new project
# Copy connection string to .env
# SUPABASE_URL=your_url
# SUPABASE_KEY=your_key
```

## 🛠️ Development Tools

- **Frontend**: Vite, Vanilla JS
- **Backend**: Express.js
- **Database**: JSON (development), MongoDB/PostgreSQL (production)
- **Charts**: Chart.js
- **Maps**: Leaflet
- **Email**: EmailJS
- **PWA**: Service Workers
- **Build**: Vite

## 📊 Analytics

The dashboard includes:
- Real-time member statistics
- Event attendance tracking
- Activity trends (6-month view)
- Member distribution charts
- Export reports to JSON

## 🌍 Internationalization

Supported languages: English (EN), French (FR), Kinyarwanda (RW)

Change language:
```javascript
setLanguage('fr'); // French
setLanguage('rw'); // Kinyarwanda
setLanguage('en'); // English
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### CORS Issues
Update `server.js` CORS configuration:
```javascript
const allowedOrigins = ['http://localhost:3000', 'https://yourdomain.com'];
```

### Database Connection Error
Check `.env` DATABASE_URL and ensure database service is running

## 📚 Documentation

- [Firebase Integration Guide](./FIREBASE_INTEGRATION.md)
- [CMS Guide](./CMS_GUIDE.md)
- [API Documentation](./API_DOCS.md)

## 🤝 Contributing

1. Create feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support, email: support@ecostay.org

---

**Built with ❤️ for the EcoStay community**
