# EcoStay Club - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All authenticated endpoints require an `Authorization` header:
```
Authorization: Bearer <token>
```

## Endpoints

### 🔐 Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Member",
    "avatar": "https://ui-avatars.com/api/?name=John+Doe"
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Member",
    "avatar": "https://ui-avatars.com/api/?name=John+Doe"
  },
  "token": "base64encodedtoken"
}
```

---

### 👥 Members

#### Get All Members
```http
GET /members
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Niyigaba Heritier",
    "email": "niyigaba@ecostay.org",
    "department": "UR - CST",
    "phone": "+250 784 095 661",
    "role": "Founder",
    "status": "Active",
    "joinedDate": "2024-01-15"
  }
]
```

#### Get Member by ID
```http
GET /members/:id
```

#### Create Member
```http
POST /members
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "department": "Engineering",
  "phone": "+250 700 000 000",
  "role": "Member"
}
```

#### Update Member
```http
PUT /members/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Jane Doe Updated",
  "role": "Coordinator"
}
```

#### Delete Member
```http
DELETE /members/:id
Authorization: Bearer <token>
```

---

### 📅 Events

#### Get All Events
```http
GET /events
```

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Campus Forest Initiative",
    "date": "2026-02-15T09:00:00",
    "location": "UR-Huye Campus",
    "description": "Plant trees...",
    "category": "Planting",
    "status": "Upcoming",
    "attendees": 125
  }
]
```

#### Create Event
```http
POST /events
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Tree Planting Campaign",
  "date": "2026-03-01T10:00:00",
  "location": "Campus Grounds",
  "description": "Join us in planting 500 trees",
  "category": "Planting"
}
```

#### Update Event
```http
PUT /events/:id
Authorization: Bearer <token>
```

#### Delete Event
```http
DELETE /events/:id
Authorization: Bearer <token>
```

---

### 📝 Posts

#### Get All Posts
```http
GET /posts
```

#### Create Post
```http
POST /posts
Content-Type: application/json
Authorization: Bearer <token>

{
  "content": "Just planted 50 trees! 🌱",
  "image": "https://example.com/image.jpg",
  "authorId": 1,
  "authorName": "John Doe"
}
```

#### Delete Post
```http
DELETE /posts/:id
Authorization: Bearer <token>
```

---

### 📊 Statistics

#### Get Stats
```http
GET /stats
```

**Response (200):**
```json
{
  "totalMembers": 450,
  "treesPlanted": 1240,
  "carbonReduced": 31000,
  "eventCount": 15,
  "totalUsers": 10,
  "totalPosts": 5
}
```

#### Update Stats
```http
POST /stats/update
Content-Type: application/json
Authorization: Bearer <token>

{
  "type": "treesPlanted",
  "value": 50
}
```

---

### 🎛️ Admin Dashboard

#### Get Dashboard Data
```http
GET /admin/dashboard
Authorization: Bearer <token>
```

---

### 🔍 Search

#### Search
```http
GET /search?q=query
```

**Response (200):**
```json
{
  "members": [...],
  "events": [...],
  "posts": [...]
}
```

---

### 💾 Export

#### Export Members
```http
GET /export/members
Authorization: Bearer <token>
```

#### Export Events
```http
GET /export/events
Authorization: Bearer <token>
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "All fields required"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 404 Not Found
```json
{
  "error": "Member not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

Current implementation doesn't have rate limiting. Recommended to implement:
- 100 requests per minute per IP
- 1000 requests per hour per IP

---

## Pagination (Recommended Future Addition)

```
GET /members?page=1&limit=10
GET /events?page=1&limit=20
GET /posts?page=1&limit=15
```

---

## Examples

### Create Event and Get Stats
```bash
# Create event
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_token" \
  -d '{
    "title": "Tree Planting",
    "date": "2026-03-01T10:00:00",
    "location": "Campus",
    "description": "Plant trees"
  }'

# Get updated stats
curl http://localhost:5000/api/stats
```

### Register and Login
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "SecurePass123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "SecurePass123"
  }'
```

---

## Webhooks (Future Implementation)

Coming soon:
- Event created webhook
- Member joined webhook
- Post published webhook
- Stats updated webhook

---

**Last Updated**: January 20, 2026
