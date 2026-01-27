/**
 * Update script to populate initial data
 * Run this once to seed the database with sample data
 */

const fs = require('fs');
const path = require('path');

// Sample data
const initialData = {
  users: [
    {
      id: 1,
      name: "Admin User",
      email: "admin@ecostay.org",
      password: Buffer.from("Admin123").toString('base64'),
      role: "Admin",
      createdAt: new Date().toISOString(),
      avatar: "https://ui-avatars.com/api/?name=Admin+User"
    }
  ],
  members: [
    {
      id: 1,
      name: "Niyigaba Heritier",
      email: "niyigaba@ecostay.org",
      department: "UR - CST (Spatial Planning)",
      phone: "+250 784 095 661",
      role: "Founder",
      avatar: "https://ui-avatars.com/api/?name=Niyigaba+Heritier",
      joinedDate: "2024-01-15",
      status: "Active"
    },
    {
      id: 2,
      name: "Byukusenge Rebecca",
      email: "rebecca@ecostay.org",
      department: "UR - CST (Spatial Planning)",
      phone: "+250 798 741 856",
      role: "President",
      avatar: "https://ui-avatars.com/api/?name=Byukusenge+Rebecca",
      joinedDate: "2024-02-10",
      status: "Active"
    },
    {
      id: 3,
      name: "Irene Irumva",
      email: "irene@ecostay.org",
      department: "INES Ruhengeri (Software Engineering)",
      phone: "+250 787 427 123",
      role: "IT Coordinator",
      avatar: "https://ui-avatars.com/api/?name=Irene+Irumva",
      joinedDate: "2024-03-05",
      status: "Active"
    }
  ],
  events: [
    {
      id: 1,
      title: "Campus Forest Initiative",
      date: "2026-02-15T09:00:00",
      location: "UR-Huye Campus",
      description: "Plant 500+ indigenous trees to restore campus green belt",
      category: "Planting",
      image: "https://via.placeholder.com/400x300?text=Campus+Forest",
      createdAt: new Date().toISOString(),
      attendees: 125,
      status: "Upcoming"
    },
    {
      id: 2,
      title: "Umuganda for Nature",
      date: "2026-01-25T08:00:00",
      location: "Kigali Neighborhoods",
      description: "Community cleaning and landscape restoration",
      category: "Cleanup",
      image: "https://via.placeholder.com/400x300?text=Umuganda",
      createdAt: new Date().toISOString(),
      attendees: 85,
      status: "Upcoming"
    },
    {
      id: 3,
      title: "Biodiversity Awareness Workshop",
      date: "2026-02-28T14:00:00",
      location: "University of Rwanda",
      description: "Educational workshop on local biodiversity and conservation",
      category: "Workshop",
      image: "https://via.placeholder.com/400x300?text=Workshop",
      createdAt: new Date().toISOString(),
      attendees: 60,
      status: "Upcoming"
    }
  ],
  posts: [
    {
      id: 1,
      content: "Just planted 50 trees at campus! 🌱 Join us next week for more greening activities.",
      image: "https://via.placeholder.com/400x300?text=Tree+Planting",
      authorId: 2,
      authorName: "Byukusenge Rebecca",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      likes: 45,
      comments: 8
    },
    {
      id: 2,
      content: "Our latest impact report shows 1,240 trees planted and 31,000kg of carbon offset! 🌍",
      image: null,
      authorId: 1,
      authorName: "Niyigaba Heritier",
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      likes: 78,
      comments: 15
    }
  ],
  roles: ['Admin', 'Coordinator', 'Member'],
  stats: {
    totalMembers: 450,
    treesPlanted: 1240,
    carbonReduced: 31000,
    eventCount: 15
  }
};

// Write to db.json
const dbFile = path.join(__dirname, 'db.json');
fs.writeFileSync(dbFile, JSON.stringify(initialData, null, 2));

console.log('✅ Database initialized with sample data');
console.log('📊 Stats:');
console.log(`   - Total Members: ${initialData.members.length}`);
console.log(`   - Total Events: ${initialData.events.length}`);
console.log(`   - Total Posts: ${initialData.posts.length}`);
console.log('');
console.log('👤 Default Admin Login:');
console.log('   Email: admin@ecostay.org');
console.log('   Password: Admin123');
console.log('');
