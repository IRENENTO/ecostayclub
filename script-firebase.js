import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, collection, onSnapshot } from 'firebase/firestore';

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
let firebaseReady = false;

// Check if config is actually set
if (firebaseConfig.projectId !== "YOUR_PROJECT_ID") {
    firebaseReady = true;
    console.log("✓ Firebase initialized successfully");
} else {
    console.warn("⚠ Firebase not configured. Using LocalStorage as fallback.");
}

// ===== DEFAULT SITE CONFIG =====
const defaultSiteConfig = {
  theme: {
    primaryColor: "#1A4D2E",
    secondaryColor: "#4F6F52",
    accentColor: "#FF9F1C",
    bgColor: "#F8FAF8",
    textColor: "#2D3436",
    textMuted: "#64748B",
    cardBg: "#FFFFFF",
    navBg: "rgba(255, 255, 255, 0.95)",
    borderColor: "#E2E8F0",
    siteName: "EcoStay"
  },
  navbar: {
    visible: true,
    logo: "/img/ecostay-logo.png",
    navItems: [
      { label: "Home", link: "#home" },
      { label: "Mission", link: "#mission" },
      { label: "Impact", link: "#impact" },
      { label: "Team", link: "#team" },
      { label: "Events", link: "#events" },
      { label: "Contact", link: "#contact" }
    ]
  },
  hero: {
    visible: true,
    backgroundImage: "linear-gradient(135deg, rgba(26, 77, 46, 0.85) 0%, rgba(79, 111, 82, 0.85) 100%)",
    headline: "EcoStay Student for Climate Action",
    subheading: "Join Rwanda's student movement to build climate resilience and create Green Havens through campus reforestation.",
    ctaButtonText: "Join Our Movement",
    ctaButtonLink: "#events",
    ctaButtonVisible: true
  },
  mission: {
    visible: true,
    title: "Our Mission & Vision",
    subtitle: "Driving Sustainable Change from the Heart of Rwanda",
    missionText: "To cultivate Green Havens across university campuses, empowering students to build climate resilience through hands-on conservation and indigenous reforestation.",
    visionText: "A Rwanda where every student leads the creation of Green Havens, fostering a culture of climate resilience and environmental stewardship.",
    whoWeAre: "We are a diverse group of students, faculty, and environmental activists from the University of Rwanda, united by a single goal: protecting our planet for future generations through innovation and community action."
  },
  impact: {
    visible: true,
    title: "Our Impact By The Numbers",
    stats: [
      { label: "Trees Planted", value: 1240, icon: "fa-tree" },
      { label: "CO₂ Offset (kg)", value: 31000, icon: "fa-leaf" },
      { label: "Active Members", value: 450, icon: "fa-users" }
    ]
  },
  team: {
    visible: true,
    title: "Meet Our Leadership",
    description: "Passionate students and faculty driving climate action at the University of Rwanda.",
    members: [
      { id: 1, name: "Niyigaba Heritier", role: "Founder", department: "UR - CST (Spatial Planning)", image: "/img/niyigaba heritier founder tel number +250 784 095 661.jpeg", phone: "+250 784 095 661", email: "niyigaba@ecostay.org", visible: true },
      { id: 2, name: "Byukusenge Rebecca", role: "President", department: "UR - CST (Spatial Planning)", image: "/img/byukusenge rebecca tel number +250 798 741 856 role president.jpeg", phone: "+250 798 741 856", email: "rebecca@ecostay.org", visible: true },
      { id: 3, name: "Niyogisubizo Jean Dedier", role: "General Coordinator", department: "UR - CST (Spatial Planning)", image: "/img/niyogisubizo jean dedier tel nbr+250 722 227 775 role general coordinator.jpeg", phone: "+250 722 227 775", email: "jean@ecostay.org", visible: true },
      { id: 4, name: "Uwase Diane", role: "General Secretary", department: "UR - CST (Spatial Planning)", image: "/img/uwase diane tel number +250 793 105 787 role secretair.jpeg", phone: "+250 793 105 787", email: "diane@ecostay.org", visible: true },
      { id: 5, name: "Irene Irumva", role: "IT & Communication", department: "INES Ruhengeri (Software Engineering)", image: "/img/irene irumva role it and communication tel number 0787427123.jpg", phone: "+250 787 427 123", email: "irene@ecostay.org", visible: true },
      { id: 6, name: "Niyonsenga Claudine", role: "Accountant", department: "UR - CST (Spatial Planning)", image: "/img/Niyonsenga claudine tel number +250 798 268 955 accountant.jpeg", phone: "+250 798 268 955", email: "claudine@ecostay.org", visible: true },
      { id: 7, name: "Prof. Gaspard Rwanyiziri", role: "Faculty Advisor", department: "UR - CST (Spatial Planning)", image: "/img/adviser prof gaspard RWANYIZIRI tel nber +250 788 681 438.jpeg", phone: "+250 788 681 438", email: "gaspard@ecostay.org", visible: true }
    ]
  },
  testimonials: {
    visible: true,
    title: "What Our Leaders Say",
    items: [
      { id: 1, text: "Leading EcoStay has been an incredible journey of growth and impact. Seeing students take ownership of environmental initiatives is truly inspiring.", author: "Byukusenge Rebecca", role: "President, UR - CST (Spatial Planning)", image: "/img/byukusenge rebecca tel number +250 798 741 856 role president.jpeg", visible: true },
      { id: 2, text: "As our IT lead, I've been able to blend my tech skills with environmental activism. The digital tools we've implemented have helped us reach more students than ever before.", author: "Irene Irumva", role: "IT & Communication, INES Ruhengeri", image: "/img/irene irumva role it and communication tel number 0787427123.jpg", visible: true }
    ]
  },
  events: {
    visible: true,
    title: "Our Recent & Upcoming Events",
    description: "See what we've accomplished and what's coming next.",
    items: [
      { id: 1, title: "Campus Forest Initiative", date: "OCT 05, 2026", location: "UR-Huye Campus", description: "Planted over 500 indigenous trees to restore the campus green belt.", status: "Completed", image: "/img/events 1.jpeg", impact: "We successfully restored 2 hectares of land with the help of 100 student volunteers.", visible: true },
      { id: 2, title: "Umuganda for Nature", date: "NOV 12, 2026", location: "Kigali Neighborhoods", description: "Community cleaning and landscape restoration in local neighborhoods.", status: "Upcoming", image: "/img/events 2.jpeg", impact: "", visible: true }
    ]
  },
  history: {
    visible: true,
    title: "Our Journey",
    items: [
      { id: 1, year: "2024", title: "The Germination", description: "The concept was born at the University of Rwanda by a group of passionate students determined to restore biodiversity on our campuses." },
      { id: 2, year: "2025", title: "Rooting & Growth", description: "We established our first student-led tree nurseries and partnered with local communities for our first major reforestation projects." },
      { id: 3, year: "2026", title: "Branching Out", description: "Expanding our EcoStay Hubs to universities nationwide, empowering thousands of students to take direct climate action." }
    ]
  },
  footer: {
    visible: true,
    phone: "+250 784 095 661",
    email: "info@ecostay.org",
    address: "Kigali, Rwanda",
    copyright: "© 2026 EcoStay Club. All rights reserved.",
    socials: { twitter: "#", facebook: "#", instagram: "#" }
  }
};

// ===== STATE MANAGEMENT =====
async function initializeSiteConfig() {
  try {
    if (firebaseReady) {
      const docRef = doc(db, 'siteConfig', 'main');
      
      // Real-time listener for automatic updates
      onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const config = docSnap.data();
          localStorage.setItem('siteConfig', JSON.stringify(config));
          console.log("✓ Site config synced from Firestore (Real-time)");
          
          // Re-render website sections if on main page
          if (typeof renderWebsite === 'function') renderWebsite();
          
          // Trigger custom event for other scripts (like script.js) to respond
          window.dispatchEvent(new CustomEvent('siteConfigUpdated', { detail: config }));
        }
      });

      // Initial fetch to ensure we have data immediately
      const initialSnap = await getDoc(docRef);
      if (initialSnap.exists()) {
        localStorage.setItem('siteConfig', JSON.stringify(initialSnap.data()));
        return;
      }
    }
  } catch (error) {
    console.warn("⚠ Error in Firestore sync:", error.message);
  }
  
  if (!localStorage.getItem('siteConfig')) {
    localStorage.setItem('siteConfig', JSON.stringify(defaultSiteConfig));
  }
}

function getSiteConfig() {
  return JSON.parse(localStorage.getItem('siteConfig')) || defaultSiteConfig;
}

async function saveSiteConfig(config) {
  localStorage.setItem('siteConfig', JSON.stringify(config));
  renderWebsite();
  
  if (firebaseReady) {
    try {
      const docRef = doc(db, 'siteConfig', 'main');
      await setDoc(docRef, config);
      showToast("✓ Changes saved to Firebase!", "success");
    } catch (error) {
      showToast("⚠ Saved locally, but Firebase sync failed: " + error.message, "warning");
    }
  } else {
    showToast("💾 Changes saved locally (Firebase not configured)", "info");
  }
}

async function resetSiteConfig() {
  if (confirm('Are you sure you want to reset all settings to default? This cannot be undone.')) {
    localStorage.setItem('siteConfig', JSON.stringify(defaultSiteConfig));
    if (firebaseReady) {
      try {
        const docRef = doc(db, 'siteConfig', 'main');
        await setDoc(docRef, defaultSiteConfig);
      } catch (error) {
        console.warn("⚠ Firebase reset failed:", error.message);
      }
    }
    renderWebsite();
    alert('Settings reset to default!');
  }
}

// ===== RENDER ENGINE =====
function renderWebsite() {
  const config = getSiteConfig();
  applyTheme(config.theme);
  
  // Show the main content area (which has all the hardcoded HTML)
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.style.display = 'block';
  }
  
  // Show the body
  document.body.style.display = 'block';
}

function applyTheme(theme) {
  const root = document.documentElement;
  root.style.setProperty('--primary', theme.primaryColor);
  root.style.setProperty('--secondary', theme.secondaryColor);
  root.style.setProperty('--accent', theme.accentColor);
  root.style.setProperty('--bg-color', theme.bgColor);
  root.style.setProperty('--text-color', theme.textColor);
  root.style.setProperty('--text-muted', theme.textMuted);
  root.style.setProperty('--card-bg', theme.cardBg);
  root.style.setProperty('--nav-bg', theme.navBg);
  root.style.setProperty('--border-color', theme.borderColor);
}

function renderNavbar(navbarConfig) {
  const navContainer = document.getElementById('navbar-container');
  if (!navContainer || !navbarConfig.visible) return;
  navContainer.innerHTML = `
    <nav class="navbar" style="background: var(--nav-bg); border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; padding: 1rem 5%; position: sticky; top: 0; z-index: 1000;">
      <div class="logo"><img src="${navbarConfig.logo}" alt="Logo" style="height: 40px;"></div>
      <div class="nav-links" style="display: flex; gap: 2rem;">
        ${navbarConfig.navItems.map(item => `<a href="${item.link}" style="color: var(--text-color); text-decoration: none; font-weight: 500;">${item.label}</a>`).join('')}
      </div>
      <div class="nav-actions">
        <a href="admin.html" class="btn primary" style="background: var(--primary); color: white; padding: 0.5rem 1rem; border-radius: 5px; text-decoration: none;">Admin</a>
      </div>
    </nav>
  `;
}

function renderHero(heroConfig) {
  const heroContainer = document.getElementById('hero-container');
  if (!heroContainer || !heroConfig.visible) {
    if (heroContainer) heroContainer.style.display = 'none';
    return;
  }
  heroContainer.style.display = 'block';
  heroContainer.innerHTML = `
    <div class="hero" style="background: ${heroConfig.backgroundImage}; min-height: 80vh; display: flex; align-items: center; justify-content: center; text-align: center; color: white; padding: 0 5%;">
      <div class="hero-content">
        <h1 style="font-size: 3.5rem; margin-bottom: 1.5rem;">${heroConfig.headline}</h1>
        <p style="font-size: 1.2rem; margin-bottom: 2rem; max-width: 800px;">${heroConfig.subheading}</p>
        ${heroConfig.ctaButtonVisible ? `<a href="${heroConfig.ctaButtonLink}" class="btn accent" style="background: var(--accent); color: white; padding: 1rem 2rem; border-radius: 5px; text-decoration: none; font-weight: bold;">${heroConfig.ctaButtonText}</a>` : ''}
      </div>
    </div>
  `;
}

function renderMission(missionConfig) {
  const container = document.getElementById('mission-container');
  if (!container || !missionConfig.visible) {
    if (container) container.style.display = 'none';
    return;
  }
  container.style.display = 'block';
  container.innerHTML = `
    <section class="mission" style="padding: 5rem 5%; background: var(--bg-color);">
      <h2 style="text-align: center; font-size: 2.5rem; color: var(--primary); margin-bottom: 1rem;">${missionConfig.title}</h2>
      <p style="text-align: center; color: var(--text-muted); margin-bottom: 3rem;">${missionConfig.subtitle}</p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
        <div class="card" style="background: var(--card-bg); padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <h3 style="color: var(--primary); margin-bottom: 1rem;">Our Mission</h3>
          <p>${missionConfig.missionText}</p>
        </div>
        <div class="card" style="background: var(--card-bg); padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <h3 style="color: var(--primary); margin-bottom: 1rem;">Our Vision</h3>
          <p>${missionConfig.visionText}</p>
        </div>
      </div>
      <div style="margin-top: 3rem; text-align: center; max-width: 900px; margin-left: auto; margin-right: auto;">
        <h3>Who We Are</h3>
        <p>${missionConfig.whoWeAre}</p>
      </div>
    </section>
  `;
}

function renderImpact(impactConfig) {
  const container = document.getElementById('impact-container');
  if (!container || !impactConfig.visible) {
    if (container) container.style.display = 'none';
    return;
  }
  container.style.display = 'block';
  container.innerHTML = `
    <section class="impact" style="padding: 5rem 5%; background: var(--primary); color: white; text-align: center;">
      <h2 style="font-size: 2.5rem; margin-bottom: 3rem;">${impactConfig.title}</h2>
      <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 2rem;">
        ${impactConfig.stats.map(stat => `
          <div class="stat-item">
            <i class="fas ${stat.icon}" style="font-size: 3rem; margin-bottom: 1rem;"></i>
            <div style="font-size: 2.5rem; font-weight: bold;">${stat.value}</div>
            <div>${stat.label}</div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function renderTeamSection(teamConfig) {
  const container = document.getElementById('team-container');
  if (!container || !teamConfig.visible) {
    if (container) container.style.display = 'none';
    return;
  }
  container.style.display = 'block';
  container.innerHTML = `
    <section class="team" style="padding: 5rem 5%;">
      <h2 style="text-align: center; font-size: 2.5rem; color: var(--primary); margin-bottom: 1rem;">${teamConfig.title}</h2>
      <p style="text-align: center; color: var(--text-muted); margin-bottom: 3rem;">${teamConfig.description}</p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
        ${teamConfig.members.filter(m => m.visible).map(member => `
          <div class="member-card" style="background: var(--card-bg); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
            <div style="height: 250px; background: url('${member.image}') center/cover no-repeat;"></div>
            <div style="padding: 1.5rem;">
              <h3 style="margin-bottom: 0.5rem;">${member.name}</h3>
              <p style="color: var(--primary); font-weight: bold; margin-bottom: 0.5rem;">${member.role}</p>
              <p style="font-size: 0.85rem; color: var(--text-muted);">${member.department}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function renderTestimonialsSection(testiConfig) {
  const container = document.getElementById('testimonials-container');
  if (!container || !testiConfig.visible) {
    if (container) container.style.display = 'none';
    return;
  }
  container.style.display = 'block';
  container.innerHTML = `
    <section class="testimonials" style="padding: 5rem 5%; background: #f0f4f0;">
      <h2 style="text-align: center; font-size: 2.5rem; color: var(--primary); margin-bottom: 3rem;">${testiConfig.title}</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
        ${testiConfig.items.filter(i => i.visible).map(testi => `
          <div class="testi-card" style="background: var(--card-bg); padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <p style="font-style: italic; margin-bottom: 1.5rem;">"${testi.text}"</p>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="width: 50px; height: 50px; border-radius: 50%; background: url('${testi.image}') center/cover no-repeat;"></div>
              <div>
                <h4 style="margin: 0;">${testi.author}</h4>
                <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted);">${testi.role}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function renderEventsSection(eventsConfig) {
  const container = document.getElementById('events-container');
  if (!container || !eventsConfig.visible) {
    if (container) container.style.display = 'none';
    return;
  }
  container.style.display = 'block';
  container.innerHTML = `
    <section class="events" style="padding: 5rem 5%;">
      <h2 style="text-align: center; font-size: 2.5rem; color: var(--primary); margin-bottom: 1rem;">${eventsConfig.title}</h2>
      <p style="text-align: center; color: var(--text-muted); margin-bottom: 3rem;">${eventsConfig.description}</p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
        ${eventsConfig.items.filter(i => i.visible).map(event => `
          <div class="event-card" style="background: var(--card-bg); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="height: 200px; background: url('${event.image}') center/cover no-repeat;"></div>
            <div style="padding: 1.5rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                <span style="font-size: 0.85rem; font-weight: bold; color: var(--primary);">${event.date}</span>
                <span style="font-size: 0.75rem; padding: 2px 8px; border-radius: 10px; background: ${event.status === 'Completed' ? '#e8f5e9' : '#fff3e0'}; color: ${event.status === 'Completed' ? '#2e7d32' : '#ef6c00'};">${event.status}</span>
              </div>
              <h3 style="margin-bottom: 1rem;">${event.title}</h3>
              <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem;">${event.description}</p>
              <div style="font-size: 0.85rem;"><i class="fas fa-map-marker-alt" style="margin-right: 5px;"></i> ${event.location}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function renderFooter(footerConfig) {
  const container = document.getElementById('footer-container');
  if (!container || !footerConfig.visible) return;
  container.innerHTML = `
    <footer style="background: #1a1a1a; color: white; padding: 4rem 5% 2rem; text-align: center;">
      <div style="margin-bottom: 2rem;">
        <img src="/img/ecostay-logo.png" alt="Logo" style="height: 50px; margin-bottom: 1rem;">
        <p>A sustainable community platform for environmental awareness and action.</p>
      </div>
      <div style="display: flex; justify-content: center; gap: 2rem; margin-bottom: 2rem;">
        <div><i class="fas fa-phone"></i> ${footerConfig.phone}</div>
        <div><i class="fas fa-envelope"></i> ${footerConfig.email}</div>
        <div><i class="fas fa-map-marker-alt"></i> ${footerConfig.address}</div>
      </div>
      <div style="border-top: 1px solid #333; padding-top: 2rem; font-size: 0.85rem; color: #888;">
        ${footerConfig.copyright}
      </div>
    </footer>
  `;
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.style.cssText = `background: white; padding: 1rem 2rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin-bottom: 1rem; border-left: 5px solid ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#ff9800' : '#2196F3'}; animation: slideIn 0.3s forwards;`;
  toast.innerHTML = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
  await initializeSiteConfig();
  renderWebsite();
});

// Expose functions to window for global access (needed by admin.html)
window.getSiteConfig = getSiteConfig;
window.saveSiteConfig = saveSiteConfig;
window.resetSiteConfig = resetSiteConfig;
window.renderWebsite = renderWebsite;
window.showToast = showToast;
