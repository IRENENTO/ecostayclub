# 🌱 EcoStay Club - Quick Start Guide

## ⚡ Get Running in 5 Minutes

### Step 1: Clone & Install
```bash
cd c:/my-projects/club
npm install
```

### Step 2: Initialize Database
```bash
node init-db.js
```

### Step 3: Start Development (Windows)
```bash
# Option A: Run setup script (easiest)
setup.bat

# Or manually:
npm run dev:full
```

### Step 4: Open in Browser
- **Frontend**: http://localhost:3000
- **Dashboard**: http://localhost:5000/dashboard.html
- **API**: http://localhost:5000/api

---

## 🔐 Default Login

**Admin Dashboard:**
- Email: `admin@ecostay.org`
- Password: `Admin123`

---

## 📊 Dashboard Features

### Overview Tab
- Real-time statistics with 4 key metrics
- Activity trend chart (6 months)
- Growth distribution pie chart

### Members Tab
- View all members
- Add new members
- Edit member details
- Delete members
- Export member list

### Events Tab
- Create new events
- View event list with attendees
- Edit event details
- Delete events

### Posts Tab
- View community feed
- Create new posts
- Delete posts
- Like and comment tracking

### Statistics Tab
- Monthly growth chart
- Member distribution chart
- Advanced analytics

### Settings Tab
- Configure organization name
- Change primary color
- Email notification settings

---

## 🔌 API Usage Examples

### 1. Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### 3. Create Event
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Tree Planting Campaign",
    "date": "2026-03-01T10:00:00",
    "location": "Campus Grounds",
    "description": "Plant 500 trees"
  }'
```

### 4. Get All Events
```bash
curl http://localhost:5000/api/events
```

### 5. Get Statistics
```bash
curl http://localhost:5000/api/stats
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `server.js` | Express backend server |
| `api-integration.js` | Frontend API client |
| `dashboard.html` | Admin dashboard |
| `index.html` | Main landing page |
| `.env` | Environment configuration |
| `db.json` | Local database |
| `init-db.js` | Database initialization |

---

## 🛠️ Common Tasks

### Add a New Member via Dashboard
1. Open http://localhost:5000/dashboard.html
2. Go to Members tab
3. Click "Add Member" button
4. Fill in the form
5. Click Save

### Create a New Event via API
```javascript
const response = await fetch('http://localhost:5000/api/events', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    title: 'Event Name',
    date: '2026-03-01T10:00:00',
    location: 'Location',
    description: 'Event description'
  })
});
const event = await response.json();
```

### Get Dashboard Data
```javascript
const dashboardData = await fetch('http://localhost:5000/api/admin/dashboard')
  .then(r => r.json());
```

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Set strong `JWT_SECRET` in `.env`
- [ ] Change all default passwords
- [ ] Enable HTTPS
- [ ] Configure database (MongoDB/PostgreSQL)
- [ ] Update CORS origins
- [ ] Set up email notifications
- [ ] Configure Firebase keys
- [ ] Test all API endpoints
- [ ] Run security audit
- [ ] Set up monitoring

---

## 📚 Documentation Files

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Full deployment instructions
- **[API_DOCS.md](./API_DOCS.md)** - Complete API reference
- **[ROADMAP.md](./ROADMAP.md)** - Feature roadmap
- **[FIREBASE_INTEGRATION.md](./FIREBASE_INTEGRATION.md)** - Firebase setup

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Dependencies Not Installed
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database Issues
```bash
node init-db.js
```

### CORS Errors
Make sure you're using the correct API URL in `api-integration.js`

---

## 📞 Support & Community

- **Email**: support@ecostay.org
- **GitHub Issues**: Report bugs and request features
- **Documentation**: See additional markdown files in project root

---

## 🎯 Next Steps

1. ✅ Understand the project structure
2. ✅ Get the server running
3. ✅ Login to the dashboard
4. ✅ Create test events and members
5. ✅ Explore the API endpoints
6. ✅ Review deployment guides
7. ✅ Deploy to production

---

**Happy coding! 🌱**
