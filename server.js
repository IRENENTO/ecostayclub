const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'dist')));

// In-memory database (replace with real DB like MongoDB/Supabase in production)
let database = {
  users: [],
  events: [],
  members: [],
  posts: [],
  roles: ['Admin', 'Coordinator', 'Member'],
  stats: {
    totalMembers: 450,
    treesPlanted: 1240,
    carbonReduced: 31000,
    eventCount: 15
  }
};

// Load initial data from localStorage equivalent (server-side storage)
const fs = require('fs');
const dbFile = path.join(__dirname, 'db.json');
if (fs.existsSync(dbFile)) {
  database = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
}

// Helper function to save database
function saveDatabase() {
  fs.writeFileSync(dbFile, JSON.stringify(database, null, 2));
}

// ====== AUTHENTICATION ROUTES ======
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields required' });
  }

  // Check if user exists
  if (database.users.some(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password: Buffer.from(password).toString('base64'), // Basic encoding (use bcrypt in production)
    role: 'Member',
    createdAt: new Date().toISOString(),
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`
  };

  database.users.push(newUser);
  saveDatabase();

  res.status(201).json({ 
    success: true, 
    message: 'User registered successfully',
    user: { ...newUser, password: undefined }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = database.users.find(u => u.email === email);
  
  if (!user || Buffer.from(password).toString('base64') !== user.password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({ 
    success: true,
    user: { ...user, password: undefined },
    token: Buffer.from(JSON.stringify(user)).toString('base64')
  });
});

// ====== MEMBERS ROUTES ======
app.get('/api/members', (req, res) => {
  res.json(database.members);
});

app.get('/api/members/:id', (req, res) => {
  const member = database.members.find(m => m.id === parseInt(req.params.id));
  if (!member) return res.status(404).json({ error: 'Member not found' });
  res.json(member);
});

app.post('/api/members', (req, res) => {
  const { name, email, department, phone, role } = req.body;
  
  const newMember = {
    id: Date.now(),
    name,
    email,
    department,
    phone,
    role: role || 'Member',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
    joinedDate: new Date().toISOString(),
    status: 'Active'
  };

  database.members.push(newMember);
  saveDatabase();

  res.status(201).json({ success: true, member: newMember });
});

app.put('/api/members/:id', (req, res) => {
  const member = database.members.find(m => m.id === parseInt(req.params.id));
  if (!member) return res.status(404).json({ error: 'Member not found' });

  Object.assign(member, req.body);
  saveDatabase();

  res.json({ success: true, member });
});

app.delete('/api/members/:id', (req, res) => {
  const index = database.members.findIndex(m => m.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Member not found' });

  database.members.splice(index, 1);
  saveDatabase();

  res.json({ success: true, message: 'Member deleted' });
});

// ====== EVENTS ROUTES ======
app.get('/api/events', (req, res) => {
  res.json(database.events);
});

app.get('/api/events/:id', (req, res) => {
  const event = database.events.find(e => e.id === parseInt(req.params.id));
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.json(event);
});

app.post('/api/events', (req, res) => {
  const { title, date, location, description, category, image } = req.body;
  
  const newEvent = {
    id: Date.now(),
    title,
    date,
    location,
    description,
    category: category || 'General',
    image: image || 'https://via.placeholder.com/400x300',
    createdAt: new Date().toISOString(),
    attendees: 0,
    status: 'Upcoming'
  };

  database.events.push(newEvent);
  database.stats.eventCount++;
  saveDatabase();

  res.status(201).json({ success: true, event: newEvent });
});

app.put('/api/events/:id', (req, res) => {
  const event = database.events.find(e => e.id === parseInt(req.params.id));
  if (!event) return res.status(404).json({ error: 'Event not found' });

  Object.assign(event, req.body);
  saveDatabase();

  res.json({ success: true, event });
});

app.delete('/api/events/:id', (req, res) => {
  const index = database.events.findIndex(e => e.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Event not found' });

  database.events.splice(index, 1);
  database.stats.eventCount--;
  saveDatabase();

  res.json({ success: true, message: 'Event deleted' });
});

// ====== POSTS/FEED ROUTES ======
app.get('/api/posts', (req, res) => {
  res.json(database.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.post('/api/posts', (req, res) => {
  const { content, image, authorId, authorName } = req.body;
  
  const newPost = {
    id: Date.now(),
    content,
    image,
    authorId,
    authorName,
    createdAt: new Date().toISOString(),
    likes: 0,
    comments: 0
  };

  database.posts.push(newPost);
  saveDatabase();

  res.status(201).json({ success: true, post: newPost });
});

app.delete('/api/posts/:id', (req, res) => {
  const index = database.posts.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Post not found' });

  database.posts.splice(index, 1);
  saveDatabase();

  res.json({ success: true, message: 'Post deleted' });
});

// ====== DASHBOARD/STATS ROUTES ======
app.get('/api/stats', (req, res) => {
  res.json({
    ...database.stats,
    totalUsers: database.users.length,
    totalMembers: database.members.length,
    totalPosts: database.posts.length
  });
});

app.post('/api/stats/update', (req, res) => {
  const { type, value } = req.body;
  
  if (type === 'treesPlanted') database.stats.treesPlanted += value;
  if (type === 'carbonReduced') database.stats.carbonReduced += value;
  if (type === 'totalMembers') database.stats.totalMembers += value;
  
  saveDatabase();
  res.json({ success: true, stats: database.stats });
});

// ====== ADMIN ROUTES ======
app.get('/api/admin/dashboard', (req, res) => {
  res.json({
    stats: database.stats,
    recentUsers: database.users.slice(-5),
    recentEvents: database.events.slice(-5),
    totalUsers: database.users.length,
    totalMembers: database.members.length,
    totalEvents: database.events.length,
    totalPosts: database.posts.length
  });
});

// ====== MESSAGING/NOTIFICATIONS ROUTES ======
app.get('/api/notifications', (req, res) => {
  const notifications = [
    { id: 1, type: 'event', message: 'New event: Tree Planting Campaign', date: new Date().toISOString() },
    { id: 2, type: 'member', message: 'New member joined: Jane Doe', date: new Date(Date.now() - 3600000).toISOString() }
  ];
  res.json(notifications);
});

// ====== FILE UPLOAD ROUTE ======
app.post('/api/upload', (req, res) => {
  // In production, use multer or similar
  const { file, filename } = req.body;
  
  res.json({
    success: true,
    url: `/uploads/${filename}`,
    message: 'File uploaded successfully'
  });
});

// ====== EXPORT DATA ROUTE ======
app.get('/api/export/members', (req, res) => {
  res.json({ success: true, data: database.members });
});

app.get('/api/export/events', (req, res) => {
  res.json({ success: true, data: database.events });
});

// ====== SEARCH ROUTES ======
app.get('/api/search', (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  
  const results = {
    members: database.members.filter(m => m.name.toLowerCase().includes(query)),
    events: database.events.filter(e => e.title.toLowerCase().includes(query)),
    posts: database.posts.filter(p => p.content.toLowerCase().includes(query))
  };

  res.json(results);
});

// ====== SERVE SPA ======
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📊 Admin Dashboard: http://localhost:${PORT}/admin.html`);
  console.log(`🌱 Main Site: http://localhost:${PORT}`);
});

module.exports = app;
