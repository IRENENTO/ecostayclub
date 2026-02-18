/**
 * API Integration Module for EcoStay
 * Handles all communication between frontend and backend
 */

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit
} from 'firebase/firestore';

// ===== FIREBASE CONFIGURATION =====
const firebaseConfig = {
  apiKey: "AIzaSyDvSCCsd7O6Vx98blakHXBG8ettLBKHuZE",
  authDomain: "ecostayclub.firebaseapp.com",
  projectId: "ecostayclub",
  storageBucket: "ecostayclub.firebasestorage.app",
  messagingSenderId: "526186667158",
  appId: "1:526186667158:web:064f152db79ec24983f6b7",
  measurementId: "G-45R2WPSCZH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ====== UTILITY FUNCTIONS ======
export async function apiCall(endpoint, method = 'GET', data = null) {
  // Legacy API call - replaced by Firestore but kept for compatibility
  console.warn(`Legacy API call to ${endpoint} intercepted. Use Firestore helpers instead.`);
  return { error: "Legacy API disabled" };
}

// Function to ensure local data exists (Fallback for offline/demo mode)
function ensureLocalData() {
  const users = JSON.parse(localStorage.getItem('ecostay_users') || '[]');
  if (users.length === 0) {
    console.log("Initializing local demo users...");
    const demoUsers = [
      { id: 1, name: "Demo User", email: "user@ecostay.rw", password: "user1234", avatar: "https://i.pravatar.cc/150?img=1", is_member: true, createdAt: new Date().toISOString() },
      { id: 2, name: "Test Member", email: "test@ecostay.rw", password: "test1234", avatar: "https://i.pravatar.cc/150?img=2", is_member: true, joinedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
      { id: 3, name: "Club Admin", email: "admin@ecostay.rw", password: "admin123", avatar: "https://i.pravatar.cc/150?img=3", is_member: true, createdAt: new Date().toISOString() }
    ];
    localStorage.setItem('ecostay_users', JSON.stringify(demoUsers));
  }
}
// Run immediately
if (typeof window !== 'undefined') { ensureLocalData(); }

// ====== AUTHENTICATION API ======
export const authAPI = {
  register: async (name, email, password) => {
    const userRef = doc(db, 'users', email);
    const newUser = {
      name,
      email,
      password, // Note: In production use Firebase Auth
      createdAt: new Date().toISOString()
    };
    await setDoc(userRef, newUser);
    return { success: true };
  },

  login: async (email, password) => {
    const userRef = doc(db, 'users', email);
    const snap = await getDoc(userRef);
    if (snap.exists() && snap.data().password === password) {
      const user = snap.data();
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('ecostay_user', JSON.stringify(user));
      return { success: true, user };
    }
    throw new Error("Invalid credentials");
  },

  logout: () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  }
};

// ====== MEMBERS API (Club Joiners) ======
export const membersAPI = {
  getAll: async () => {
    let members = [];
    try {
      const q = query(collection(db, 'members'), orderBy('joinedAt', 'desc'));
      const snap = await getDocs(q);
      members = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.warn("Firestore members fetch failed, falling back to local:", e);
    }

    // Fallback/Merge with LocalStorage
    const localUsers = JSON.parse(localStorage.getItem('ecostay_users') || '[]');
    const localMembers = localUsers.filter(u => u.is_member).map(u => ({
      id: 'local_' + u.id,
      ...u,
      joinedAt: u.joinedAt || new Date().toISOString(),
      status: u.status || 'Pending'
    }));

    // Combine unique by email (prefer Firestore)
    const combined = [...members];
    localMembers.forEach(lm => {
      if (!combined.find(c => c.email === lm.email)) {
        combined.push(lm);
      }
    });

    return combined;
  },

  create: async (data) => {
    await addDoc(collection(db, 'members'), {
      ...data,
      joinedAt: new Date().toISOString(),
      status: 'Pending'
    });
  },

  update: async (id, data) => {
    // Try Firestore
    try {
      if (!id.startsWith('local_')) {
        const docRef = doc(db, 'members', id);
        await updateDoc(docRef, data);
      }
    } catch (e) { }

    // Update Local
    const localUsers = JSON.parse(localStorage.getItem('ecostay_users') || '[]');
    const idx = localUsers.findIndex(u => ('local_' + u.id) === id || u.firestoreId === id);
    if (idx !== -1) {
      localUsers[idx] = { ...localUsers[idx], ...data };
      localStorage.setItem('ecostay_users', JSON.stringify(localUsers));
    }
  },

  delete: async (id) => {
    try {
      if (!id.startsWith('local_')) {
        await deleteDoc(doc(db, 'members', id));
      }
    } catch (e) { }

    // Update Local
    const localUsers = JSON.parse(localStorage.getItem('ecostay_users') || '[]');
    const newLocalUsers = localUsers.filter(u => ('local_' + u.id) !== id);
    localStorage.setItem('ecostay_users', JSON.stringify(newLocalUsers));
  }
};

// ====== USERS API (Registered Users) ======
export const usersAPI = {
  getAll: async () => {
    let users = [];
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      users = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.warn("Firestore users fetch failed, falling back to local:", e);
    }

    // Fallback/Merge with LocalStorage
    const localUsers = JSON.parse(localStorage.getItem('ecostay_users') || '[]');
    const mappedLocal = localUsers.map(u => ({
      id: 'local_' + u.id,
      ...u,
      createdAt: u.createdAt || new Date().toISOString()
    }));

    // Combine unique by email
    const combined = [...users];
    mappedLocal.forEach(lm => {
      if (!combined.find(c => c.email === lm.email)) {
        combined.push(lm);
      }
    });

    return combined;
  },

  delete: async (id) => {
    try {
      if (!id.startsWith('local_')) {
        await deleteDoc(doc(db, 'users', id));
      }
    } catch (e) { }

    // Update Local
    const localUsers = JSON.parse(localStorage.getItem('ecostay_users') || '[]');
    const newLocalUsers = localUsers.filter(u => ('local_' + u.id) !== id);
    localStorage.setItem('ecostay_users', JSON.stringify(newLocalUsers));
  }
};

// ====== EVENTS API ======
export const eventsAPI = {
  getAll: async () => {
    const q = query(collection(db, 'events'), orderBy('date', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  create: async (data) => {
    await addDoc(collection(db, 'events'), {
      ...data,
      createdAt: new Date().toISOString()
    });
  },

  update: async (id, data) => {
    await updateDoc(doc(db, 'events', id), data);
  },

  delete: async (id) => {
    await deleteDoc(doc(db, 'events', id));
  }
};

// ====== POSTS API ======
export const postsAPI = {
  getAll: async () => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  create: async (data) => {
    await addDoc(collection(db, 'posts'), {
      ...data,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0
    });
  },

  delete: async (id) => {
    await deleteDoc(doc(db, 'posts', id));
  }
};

// ====== STATS API ======
export const statsAPI = {
  getStats: async () => {
    const docSnap = await getDoc(doc(db, 'siteConfig', 'impact'));
    if (docSnap.exists()) return docSnap.data();

    // Fallback/Default
    const membersSnap = await getDocs(collection(db, 'members'));
    const eventsSnap = await getDocs(collection(db, 'events'));
    return {
      totalMembers: membersSnap.size,
      eventCount: eventsSnap.size,
      treesPlanted: 1240,
      carbonReduced: 31000
    };
  }
};

// ====== EXPORT FUNCTIONS ======
if (typeof window !== 'undefined') {
  window.authAPI = authAPI;
  window.membersAPI = membersAPI;
  window.usersAPI = usersAPI;
  window.eventsAPI = eventsAPI;
  window.postsAPI = postsAPI;
  window.statsAPI = statsAPI;
  window.db = db; // Expose db for direct queries if needed
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ API Integration Module Loaded');
});
