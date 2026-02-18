/* --- CONFIGURATION --- */
const EMAILJS_SERVICE_ID = "service_jjh15de";
const EMAILJS_TEMPLATE_ID = "template_1a3m2xk";



// Initialize Global Site Data if not exists
if (!localStorage.getItem('ecostay_site_data')) {
  const initialData = {
    mission: {
      title: "Our Mission & Vision",
      sub: "Driving Sustainable Change from the Heart of Rwanda",
      text_mission: "To cultivate Green Havens across university campuses, empowering students to build climate resilience through hands-on conservation and indigenous reforestation.",
      text_vision: "A Rwanda where every student leads the creation of Green Havens, fostering a culture of climate resilience and environmental stewardship."
    },
    impact: {
      trees: 1240,
      carbon: 31000,
      members: 450
    },
    team: [
      { name: "Niyigaba Heritier", role: "Founder", dept: "UR - CST (Spatial Planning)", image: "/img/niyigaba-heritier.jpeg", phone: "+250 784 095 661", email: "niyigaba@ecostay.org" },
      { name: "Byukusenge Rebecca", role: "President", dept: "UR - CST (Spatial Planning)", image: "/img/rebecca-byukusenge.jpeg", phone: "+250 798 741 856" },
      { name: "Niyogisubizo Jean Dedier", role: "General Coordinator", dept: "UR - CST (Spatial Planning)", image: "/img/jean-dedier.jpeg", phone: "+250 722 227 775" },
      { name: "Uwase Diane", role: "General Secretary", dept: "UR - CST (Spatial Planning)", image: "/img/diane-uwase.jpeg", phone: "+250 793 105 787" },
      { name: "Irene Irumva", role: "IT & Communication", dept: "INES Ruhengeri (Software Engineering)", image: "/img/irene-irumva.jpg", phone: "+250 787 427 123" },
      { name: "Niyonsenga Claudine", role: "Accountant", dept: "UR - CST (Spatial Planning)", image: "/img/claudine-niyonsenga.jpeg", phone: "+250 798 268 955" },
      { name: "Prof. Gaspard Rwanyiziri", role: "Faculty Advisor", dept: "UR - CST (Spatial Planning)", image: "/img/gaspard-rwanyiziri.jpeg", phone: "+250 788 681 438" }
    ],
    testimonials: [
      { text: "Leading EcoStay has been an incredible journey of growth and impact. Seeing students take ownership of environmental initiatives is truly inspiring.", name: "Byukusenge Rebecca", role: "President, UR - CST (Spatial Planning)", image: "/img/rebecca-byukusenge.jpeg" },
      { text: "As our IT lead, I've been able to blend my tech skills with environmental activism. The digital tools we've implemented have helped us reach more students than ever before.", name: "Irene Irumva", role: "IT & Communication, INES Ruhengeri (Software Engineering)", image: "/img/irene-irumva.jpg" }
    ],
    events: [
      { title: "Campus Forest Initiative", date: "OCT 05, 2026", location: "UR-Huye Campus", desc: "Planted over 500 indigenous trees to restore the campus green belt.", status: "Completed", image: "/img/events-1.jpeg", impact: "We successfully restored 2 hectares of land with the help of 100 student volunteers." },
      { title: "Umuganda for Nature", date: "NOV 12, 2026", location: "Kigali Neighborhoods", desc: "Community cleaning and landscape restoration in local neighborhoods.", status: "Upcoming", image: "/img/events-2.jpeg" }
    ],
    history: [
      { year: "2024", title: "The Germination", desc: "The concept was born at the University of Rwanda by a group of passionate students determined to restore biodiversity on our campuses." },
      { year: "2025", title: "Rooting & Growth", desc: "We established our first student-led tree nurseries and partnered with local communities for our first major reforestation projects." },
      { year: "2026", title: "Branching Out", desc: "Expanding our EcoStay Hubs to universities nationwide, empowering thousands of students to take direct climate action." }
    ],
    who: "We are a diverse group of students, faculty, and environmental activists from the University of Rwanda, united by a single goal: protecting our planet for future generations through innovation and community action.",
    footer: {
      phone: "+250 784 095 661",
      email: "info@ecostay.org",
      address: "Kigali, Rwanda",
      socials: {
        twitter: "#",
        facebook: "#",
        instagram: "#"
      }
    }
  };
  localStorage.setItem('ecostay_site_data', JSON.stringify(initialData));
}

// Initialize demo users if no users exist (Permanent fallback)
const existingUsers = localStorage.getItem('ecostay_users');
if (!existingUsers || existingUsers === '[]') {
  const demoUsers = [
    { id: 1, name: "Demo User", email: "user@ecostay.rw", password: "user1234", avatar: "https://i.pravatar.cc/150?img=1", is_member: true },
    { id: 2, name: "Test Member", email: "test@ecostay.rw", password: "test1234", avatar: "https://i.pravatar.cc/150?img=2", is_member: true },
    { id: 3, name: "Club Admin", email: "admin@ecostay.rw", password: "admin123", avatar: "https://i.pravatar.cc/150?img=3", is_member: true }
  ];
  localStorage.setItem('ecostay_users', JSON.stringify(demoUsers));
  console.log("✅ Demo users initialized.");
}

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.error('Service Worker registration failed', err));
  });
}

// EARLY SESSION CHECK (Restore user immediately, before full page load)
document.addEventListener('DOMContentLoaded', () => {
  console.log('📱 DOM ready, checking for active session...');
  const userStr = localStorage.getItem('ecostay_user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      console.log('✅ Active session found:', user.email);
    } catch (e) {
      console.warn('Invalid session data, will re-check on full load');
      localStorage.removeItem('ecostay_user');
    }
  }
});

// Initialize Map & Data on Load
window.addEventListener('load', async () => {
  console.log('✅ Page loaded, initializing...');
  initMap();
  await loadSiteData();
  checkLogin(); // Restore user dashboard if logged in
  console.log('✅ Initialization complete');
});

function mapFirestoreToLocal(localData, firestoreData) {
  const data = { ...localData, ...firestoreData };

  // Handle structure differences
  if (firestoreData.impact && firestoreData.impact.stats) {
    data.impact = {
      ...data.impact,
      trees: firestoreData.impact.stats.find(s => s.label.includes('Trees'))?.value || (data.impact ? data.impact.trees : 0),
      carbon: firestoreData.impact.stats.find(s => s.label.includes('CO'))?.value || (data.impact ? data.impact.carbon : 0),
      members: firestoreData.impact.stats.find(s => s.label.includes('Members'))?.value || (data.impact ? data.impact.members : 0),
      visible: firestoreData.impact.visible !== undefined ? firestoreData.impact.visible : true
    };
  }

  if (firestoreData.team) {
    data.team = Array.isArray(firestoreData.team) ? firestoreData.team : (firestoreData.team.members || []);
    data.team_visible = firestoreData.team.visible !== undefined ? firestoreData.team.visible : true;
  }

  if (firestoreData.testimonials) {
    data.testimonials = Array.isArray(firestoreData.testimonials) ? firestoreData.testimonials : (firestoreData.testimonials.items || []);
    data.testimonials_visible = firestoreData.testimonials.visible !== undefined ? firestoreData.testimonials.visible : true;
  }

  if (firestoreData.events) {
    data.events = Array.isArray(firestoreData.events) ? firestoreData.events : (firestoreData.events.items || []);
    data.events_visible = firestoreData.events.visible !== undefined ? firestoreData.events.visible : true;
  }

  if (firestoreData.history) {
    data.history = firestoreData.history.items || firestoreData.history;
  }

  if (firestoreData.mission) {
    data.mission = {
      ...data.mission,
      title: firestoreData.mission.title || (data.mission ? data.mission.title : ""),
      text_mission: firestoreData.mission.missionText || (data.mission ? data.mission.text_mission : ""),
      text_vision: firestoreData.mission.visionText || (data.mission ? data.mission.text_vision : ""),
      visible: firestoreData.mission.visible !== undefined ? firestoreData.mission.visible : true
    };
    if (firestoreData.mission.whoWeAre) data.who = firestoreData.mission.whoWeAre;
  }

  if (firestoreData.footer) {
    data.footer = { ...data.footer, ...firestoreData.footer };
  }

  if (firestoreData.hero) {
    data.hero = { ...data.hero, ...firestoreData.hero };
    // Also update hardcoded hero text if elements exist
    const heroTitle = document.querySelector('[data-lang="hero_title"]');
    const heroDesc = document.querySelector('.hero-content p');
    const heroBtn = document.querySelector('.hero-content .btn');

    if (heroTitle && firestoreData.hero.headline) heroTitle.innerText = firestoreData.hero.headline;
    if (heroDesc && firestoreData.hero.subheading) heroDesc.innerText = firestoreData.hero.subheading;
    if (heroBtn && firestoreData.hero.ctaButtonText) heroBtn.innerText = firestoreData.hero.ctaButtonText;
  }

  // Apply theme colors
  if (firestoreData.theme) {
    const root = document.documentElement;
    if (firestoreData.theme.primaryColor) root.style.setProperty('--primary', firestoreData.theme.primaryColor);
    if (firestoreData.theme.secondaryColor) root.style.setProperty('--secondary', firestoreData.theme.secondaryColor);
    if (firestoreData.theme.accentColor) root.style.setProperty('--accent', firestoreData.theme.accentColor);
  }

  return data;
}

async function loadSiteData() {
  let data = JSON.parse(localStorage.getItem('ecostay_site_data'));
  const syncedData = JSON.parse(localStorage.getItem('siteConfig'));

  // If syncedData exists, it might be newer (from admin.html)
  if (syncedData) {
    console.log("✓ Found synced siteConfig in LocalStorage");
  }

  // Try to load from Firestore if available
  try {
    const fs = await getFirestoreHelpers();
    const docRef = fs.doc(fs.db, 'siteConfig', 'main');

    // Real-time listener for live updates
    fs.onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const firestoreData = docSnap.data();
        console.log("✓ Site data synced from Firestore (Real-time)");

        // Get current local data
        let currentLocalData = JSON.parse(localStorage.getItem('ecostay_site_data')) || {};

        // Map Firestore structure to script.js structure
        const updatedData = mapFirestoreToLocal(currentLocalData, firestoreData);

        // Save to LocalStorage
        localStorage.setItem('ecostay_site_data', JSON.stringify(updatedData));
        localStorage.setItem('siteConfig', JSON.stringify(firestoreData));

        // Refresh UI components
        applyDataToUI(updatedData);
      }
    });

    const docSnap = await fs.getDoc(docRef);
    if (docSnap.exists()) {
      const firestoreData = docSnap.data();
      data = mapFirestoreToLocal(data || {}, firestoreData);
      localStorage.setItem('ecostay_site_data', JSON.stringify(data));
      localStorage.setItem('siteConfig', JSON.stringify(firestoreData));
    } else if (syncedData) {
      data = mapFirestoreToLocal(data || {}, syncedData);
    }
  } catch (err) {
    console.warn("Firestore data load failed, using local storage:", err);
    if (syncedData) {
      data = mapFirestoreToLocal(data || {}, syncedData);
    }
  }

  if (!data) return;
  applyDataToUI(data);
}

function toggleSectionVisibility(id, visible) {
  const el = document.getElementById(id);
  if (!el) return;
  if (visible === false) {
    el.style.setProperty('display', 'none', 'important');
    el.classList.add('u-hidden');
  } else {
    el.style.setProperty('display', '', '');
    el.classList.remove('u-hidden');
  }
}

function applyDataToUI(data) {
  // Handle Section Visibility
  if (data.navbar) toggleSectionVisibility('navbar', data.navbar.visible);
  if (data.hero) toggleSectionVisibility('home', data.hero.visible);
  if (data.mission) toggleSectionVisibility('mission', data.mission.visible);
  if (data.impact) toggleSectionVisibility('impact', data.impact.visible);
  if (data.team_visible !== undefined) toggleSectionVisibility('team', data.team_visible);
  if (data.testimonials_visible !== undefined) toggleSectionVisibility('testimonials', data.testimonials_visible);
  if (data.events_visible !== undefined) toggleSectionVisibility('events', data.events_visible);
  if (data.footer) toggleSectionVisibility('footer-container', data.footer.visible);

  if (document.getElementById('counter-trees')) {
    document.getElementById('counter-trees').innerText = (data.impact.trees || 0).toLocaleString();
    document.getElementById('counter-carbon').innerText = (data.impact.carbon || 0).toLocaleString();
    document.getElementById('counter-members').innerText = (data.impact.members || 0).toLocaleString();
  }

  // Load dynamic mission text if elements exist
  const missionTitle = document.querySelector('[data-lang="mission_title"]');
  const missionText = document.querySelector('[data-lang="text_mission"]');

  if (missionTitle && data.mission.title) missionTitle.innerText = data.mission.title;
  if (missionText && data.mission.text_mission) missionText.innerText = data.mission.text_mission;

  // Load dynamic history text if elements exist
  const journeyTitle = document.querySelector('[data-lang="journey_title"]');
  if (journeyTitle && data.history && data.history.title) journeyTitle.innerText = data.history.title;

  // Render Dynamic Sections
  renderTeam(data.team);
  renderTestimonials(data.testimonials);
  renderEvents(data.events);
  renderHistory(data.history);
  renderWho(data.who);
  renderFooter(data.footer);
}

function renderHistory(historyData) {
  const container = document.getElementById('history-container');
  if (!container || !historyData) return;

  // Handle both array and object with items property
  const items = Array.isArray(historyData) ? historyData : (historyData.items || []);

  container.innerHTML = items.map(item => `
        <div class="card">
          <h3>${item.year}</h3>
          <h4 class="u-text-primary u-mb-10">${item.title}</h4>
          <p>${item.description || item.desc || ''}</p>
        </div>
    `).join('');
}

function renderWho(whoData) {
  const container = document.getElementById('who-container');
  if (!container || !whoData) return;
  container.innerHTML = `<p>${whoData}</p>`;
}

function renderFooter(footerData) {
  const container = document.getElementById('footer-container');
  if (!container || !footerData) return;
  container.innerHTML = `
    <div class="footer-top-row">
      <img src="/img/ecostay-logo.png" alt="EcoStay" class="footer-logo-small">
      <div class="footer-social-links">
        <a href="${footerData.socials.twitter}" target="_blank" class="u-text-white"><i class="fa-brands fa-twitter"></i></a>
        <a href="${footerData.socials.facebook}" target="_blank" class="u-text-white"><i class="fa-brands fa-facebook-f"></i></a>
        <a href="${footerData.socials.instagram}" target="_blank" class="u-text-white"><i class="fa-brands fa-instagram"></i></a>
      </div>
    </div>
    
    <div class="footer-contact-row">
      <div class="footer-contact-item">
        <i class="fa-solid fa-phone footer-icon-accent"></i>
        <a href="tel:${footerData.phone.replace(/\s/g, '')}" class="footer-link-white">${footerData.phone}</a>
      </div>
      <div class="footer-contact-item">
        <i class="fa-solid fa-envelope footer-icon-accent"></i>
        <a href="mailto:${footerData.email}" class="footer-link-white">${footerData.email}</a>
      </div>
      <div class="footer-contact-item">
        <i class="fa-solid fa-location-dot footer-icon-accent"></i>
        <span>${footerData.address}</span>
      </div>
    </div>
    `;
}

// ONE-TIME SYSTEM RESET (Clears old data to ensure new updates are loaded)
if (!localStorage.getItem('system_reset_feb17_v3')) {
  localStorage.removeItem('ecostay_site_data'); // Force reload of site data
  localStorage.removeItem('siteConfig'); // Clear potentially stale synced config
  localStorage.setItem('system_reset_feb17_v3', 'true');
  console.log("System storage reset for Feb 17 v3 updates.");
}

function renderTeam(teamData) {
  console.log("Rendering Team Data:", teamData); // Debugging: Check what data is being used
  const container = document.getElementById('team-container');
  if (!container || !teamData) return;

  container.innerHTML = teamData.filter(m => m.visible !== false).map(member => {
    // Use a fallback image if no image is provided
    const imgUrl = member.image || '/img/ecostay-logo.png';

    return `
        <div class="card team-card">
          <div class="team-image" style="background-image: url('${imgUrl}');"></div>
          <div class="team-info">
            <h3>${member.name}</h3>
            <p class="role">${member.role}</p>
            <p class="dept">${member.department || member.dept || ''}</p>
            <div class="team-socials">
              ${member.phone ? `<a href="tel:${member.phone}" title="Call"><i class="fa-solid fa-phone"></i></a>` : ''}
              ${member.phone ? `<a href="https://wa.me/${member.phone.replace(/\+/g, '').replace(/\s/g, '')}" target="_blank"><i class="fa-brands fa-whatsapp"></i></a>` : ''}
              ${member.email ? `<a href="mailto:${member.email}"><i class="fa-solid fa-envelope"></i></a>` : ''}
            </div>
          </div>
        </div>
    `}).join('');
}

function renderTestimonials(testiData) {
  const container = document.getElementById('testimonials-container');
  if (!container || !testiData) return;
  container.innerHTML = testiData.filter(t => t.visible !== false).map(testi => `
        <div class="card testimonial-card">
          <p class="quote">"${testi.text}"</p>
          <div class="user-info">
            <div class="testimonial-image" style="background-image: url('${testi.image}');"></div>
            <div>
              <h4>${testi.author || testi.name}</h4>
              <span>${testi.role}</span>
            </div>
          </div>
        </div>
    `).join('');
}

function renderEvents(eventsData) {
  const container = document.getElementById('events-container');
  if (!container || !eventsData) return;
  container.innerHTML = eventsData.filter(e => e.visible !== false).map(event => `
        <div class="card event-card">
          <div class="status-badge ${(event.status || 'Upcoming').toLowerCase()}">
            <i class="fa-solid ${event.status === 'Completed' ? 'fa-check' : event.status === 'Upcoming' ? 'fa-clock' : 'fa-xmark'}"></i> 
            <span>${event.status}</span>
          </div>
          <div class="card-image" style="background-image: url('${event.image || '/img/event-placeholder.jpg'}');"></div>
          <div class="card-content">
            <div class="date">${event.date}</div>
            <h3>${event.title}</h3>
            <p class="location"><i class="fa-solid fa-map-marker-alt"></i> ${event.location}</p>
            <p class="u-fs-0-9 u-text-muted u-m-10-0">${event.description || event.desc || ''}</p>
            ${event.status === 'Completed'
      ? `<button class="btn outline full-width" onclick="openReportModal('${event.title.replace(/'/g, "\\'")}', '${(event.impact || '').replace(/'/g, "\\'")}')">View Impact</button>`
      : event.status === 'Upcoming'
        ? `<button class="btn primary full-width" onclick="openEventRegModal('${event.title.replace(/'/g, "\\'")}')">Register to Join</button>`
        : `<button class="btn outline full-width btn-disabled" disabled>Unavailable</button>`
    }
          </div>
        </div>
    `).join('');
}

let leafletMap;

function initMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement || leafletMap) return;
  if (typeof L === 'undefined') {
    console.error('Leaflet is not loaded');
    return;
  }

  console.log('Initializing Leaflet map...');
  // Center on Rwanda
  leafletMap = L.map('map').setView([-1.9403, 29.8739], 9);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(leafletMap);

  // Add some demo markers for EcoStay Hubs
  const sites = [
    { name: "UR Huye Campus Hub", coords: [-2.6000, 29.7400] },
    { name: "UR Nyarugenge Hub", coords: [-1.9441, 30.0619] },
    { name: "UR Busogo Hub", coords: [-1.5500, 29.5500] }
  ];

  sites.forEach(site => {
    L.marker(site.coords).addTo(leafletMap)
      .bindPopup(`<b>${site.name}</b><br>Active Reforestation Site`);
  });
}

/* --- 1. TRANSLATION SYSTEM (EN / FR / RW) --- */
const translations = {
  en: {
    nav_home: "Home", nav_about: "About Us", nav_mission: "Mission & Vision",
    nav_history: "Our History", nav_who: "Who We Are", nav_testimonials: "Testimonials",
    nav_donate: "Donate", nav_events: "Events", nav_team: "Team", nav_contact: "Contact",
    btn_darkmode: "Dark Mode", btn_login_signup: "Login / Sign Up", btn_login: "Login", btn_logout: "Logout", btn_edit_profile: "Edit Profile",
    hero_title: "EcoStay Student for Climate Action", hero_desc: "Join Rwanda's leading student network dedicated to biodiversity and campus reforestation.", hero_btn: "Join EcoStay Club",
    mission_title: "Our Mission & Vision", mission_sub: "Driving Sustainable Change from the Heart of Rwanda", card_mission: "Our Mission", text_mission: "To cultivate Green Havens across university campuses, empowering students to build climate resilience through hands-on conservation and indigenous reforestation.", card_vision: "Our Vision", text_vision: "A Rwanda where every student leads the creation of Green Havens, fostering a culture of climate resilience and environmental stewardship.",
    journey_title: "Our Journey", journey_sub: "From a Seed of an Idea to a National Movement",
    year_2024_title: "The Germination", year_2024_desc: "The concept was born at the University of Rwanda by students determined to restore biodiversity.",
    year_2025_title: "Rooting & Growth", year_2025_desc: "We established student-led nurseries and partnered with local communities.",
    year_2026_title: "Branching Out", year_2026_desc: "Expanding our EcoStay Hubs to universities nationwide.",
    who_desc: "We are a diverse group of students, faculty, and environmental activists from the University of Rwanda, united by a single goal: protecting our planet.",
    team_sub: "The Passionate Minds Behind EcoStay",
    role_president: "President", role_vice: "Vice President", role_secretary: "General Secretary",
    role_treasurer: "Accountant", role_coordinator: "General Coordinator", role_comm: "IT & Communication",
    role_it: "IT Lead", role_logistics: "Logistics Manager", role_advisor: "Faculty Advisor", role_legal: "Legal Officer", role_founder: "Founder",
    test_1: '"EcoStay gave me the platform to apply my classroom knowledge."',
    test_2: '"The networking opportunities have been incredible."',
    donate_title: "Support Our Impact", donate_box_title: "Help Us Green Rwanda", donate_box_desc: "Your contribution directly supports tree planting and nursery maintenance.",
    donate_momo: "Choose Amount (Mobile Money)", donate_pay_btn: "Pay with Mobile Money",
    activities_title: "Our Activities", activities_sub: "Hands-on Action for a Greener Rwanda",
    status_done: "Completed", status_pending: "Upcoming", status_canceled: "Canceled",
    event_1_title: "Campus Forest Initiative", event_1_desc: "Mass tree planting event focused on restoring native species.",
    event_2_title: "Umuganda for Nature", event_2_desc: "Community cleaning and landscape restoration in local neighborhoods.",
    event_3_title: "Eco-Workshop: Sustainable Living", event_3_desc: "Learning how to reduce waste and use renewable energy at home.",
    btn_register_event: "Register to Join",
    btn_view_impact: "View Impact",
    footer_phone: "Phone", footer_email: "Email", footer_location: "Address",
    label_name: "Full Name", label_email: "Email", label_pass: "Password",
    label_whatsapp: "WhatsApp Number", label_faculty: "Faculty", label_year: "Year of Study", label_interests: "Interests",
    btn_create_acc: "Create Account", btn_save: "Save Changes", btn_confirm: "Confirm",
    dashboard_welcome: "Welcome back", dashboard_impact: "Ready to make an impact?", dashboard_desc: "Join EcoStay Club today and be part of a vibrant community of students leading climate action.",
    impact_title: "Our Collective Impact", trees_planted: "Trees Planted", carbon_saved: "CO2 Sequestered (kg)", active_members: "Active Guardians",
    toast_welcome: "Welcome to EcoStay!", toast_invalid_auth: "Invalid email or password.", toast_reg_success: "Account created successfully!",
    toast_email_taken: "Email already registered.", toast_pass_short: "Password must be at least 8 characters.",
    toast_login_first: "Please login to join.", toast_sending: "Processing...", toast_fill_all: "Please fill all required fields.",
    toast_invalid_email: "Please enter a valid email.", toast_invalid_phone: "Please enter a valid phone number.",
    hint_photo: "Click camera to update photo", auth_title: "Account Access", tab_login: "Login", tab_register: "Register"
  },
  fr: {
    nav_home: "Accueil", nav_about: "À Propos", nav_mission: "Mission & Vision",
    nav_history: "Notre Histoire", nav_who: "Qui Sommes-Nous", nav_testimonials: "Témoignages",
    nav_donate: "Faire un Don", nav_events: "Événements", nav_team: "Équipe", nav_contact: "Contact",
    btn_darkmode: "Mode Sombre", btn_login_signup: "Connexion / Inscription", btn_login: "Connexion", btn_logout: "Déconnexion", btn_edit_profile: "Modifier le profil",
    hero_title: "EcoStay Étudiants pour l'Action Climat", hero_desc: "Rejoignez le premier réseau étudiant du Rwanda dédié à la biodiversité et au reboisement des campus.", hero_btn: "Rejoindre le Club EcoStay",
    mission_title: "Notre Mission & Vision", mission_sub: "Conduire le Changement Durable depuis le Cœur du Rwanda", card_mission: "Notre Mission", text_mission: "Cultiver des Havres Verts dans les campus universitaires, permettant aux étudiants de renforcer la résilience climatique par la conservation pratique et le reboisement indigène.", card_vision: "Notre Vision", text_vision: "Un Rwanda où chaque étudiant dirige la création de Havres Verts, favorisant une culture de résilience climatique et de gérance environnementale.",
    journey_title: "Notre Parcours", journey_sub: "D'une Graine d'Idée à un Mouvement National",
    year_2024_title: "La Germination", year_2024_desc: "Le concept est né à l'Université du Rwanda par des étudiants déterminés à restaurer la biodiversité.",
    year_2025_title: "Enracinement & Croissance", year_2025_desc: "Nous avons établi des pépinières gérées par des étudiants et établi des partenariats avec les communautés locales.",
    year_2026_title: "Expansion", year_2026_desc: "Extension de nos centres EcoStay aux universités de tout le pays.",
    who_desc: "Nous sommes un groupe diversifié d'étudiants, de professeurs et d'activistes environnementaux de l'Université du Rwanda, unis par un seul but : protéger notre planète.",
    team_sub: "Les Esprits Passionnés Derrière EcoStay",
    role_president: "Président", role_vice: "Vice-Président", role_secretary: "Secrétaire Général",
    role_treasurer: "Comptable", role_coordinator: "Coordinateur Général", role_comm: "IT & Communication",
    role_it: "Responsable IT", role_logistics: "Gestionnaire Logistique", role_advisor: "Conseiller Facultaire", role_legal: "Conseiller Juridique", role_founder: "Fondateur",
    test_1: '"EcoStay m\'a donné la plateforme pour appliquer mes connaissances en classe."',
    test_2: '"Les opportunités de réseautage ont été incroyables."',
    donate_title: "Soutenez Notre Impact", donate_box_title: "Aidez-nous à Verdir le Rwanda", donate_box_desc: "Votre contribution soutient directement la plantation d'arbres et l'entretien des pépinières.",
    donate_momo: "Choisir le Montant (Mobile Money)", donate_pay_btn: "Payer avec Mobile Money",
    activities_title: "Nos Activités", activities_sub: "Action Concrète pour un Rwanda plus Vert",
    status_done: "Terminé", status_pending: "À venir", status_canceled: "Annulé",
    event_1_title: "Initiative Forêt Campus", event_1_desc: "Événement de plantation massive d'arbres axé sur la restauration des espèces indigènes.",
    event_2_title: "Umuganda pour la Nature", event_2_desc: "Nettoyage communautaire et restauration des paysages dans les quartiers locaux.",
    event_3_title: "Éco-Atelier : Vie Durable", event_3_desc: "Apprendre à réduire les déchets et à utiliser les énergies renouvelables à la maison.",
    btn_register_event: "S'inscrire pour Participer",
    btn_view_impact: "Voir l'Impact",
    footer_phone: "Téléphone", footer_email: "Email", footer_location: "Adresse",
    label_name: "Nom Complet", label_email: "Email", label_pass: "Mot de passe",
    label_whatsapp: "Numéro WhatsApp", label_faculty: "Faculté", label_year: "Année d'étude", label_interests: "Intérêts",
    btn_create_acc: "Créer un compte", btn_save: "Enregistrer", btn_confirm: "Confirmer",
    dashboard_welcome: "Bon retour", dashboard_impact: "Prêt à avoir un impact ?", dashboard_desc: "Rejoignez le club EcoStay dès aujourd'hui et faites partie d'une communauté dynamique d'étudiants menant l'action pour le climat.",
    impact_title: "Notre Impact Collectif", trees_planted: "Arbres Plantés", carbon_saved: "CO2 Séquestré (kg)", active_members: "Gardiens Actifs",
    toast_welcome: "Bienvenue sur EcoStay !", toast_invalid_auth: "Email ou mot de passe invalide.", toast_reg_success: "Compte créé avec succès !",
    toast_email_taken: "Email déjà enregistré.", toast_pass_short: "Le mot de passe doit comporter au moins 8 caractères.",
    toast_login_first: "Veuillez vous connecter pour rejoindre.", toast_sending: "Traitement en cours...", toast_fill_all: "Veuillez remplir tous les champs obligatoires.",
    toast_invalid_email: "Veuillez entrer un email valide.", toast_invalid_phone: "Veuillez entrer un numéro de téléphone valide.",
    hint_photo: "Cliquez sur la caméra pour mettre à jour la photo", auth_title: "Accès au Compte", tab_login: "Connexion", tab_register: "S'inscrire"
  },
  rw: {
    nav_home: "Ahabanza", nav_about: "Turi Bamwe", nav_mission: "Intego n'Icyerekezo",
    nav_history: "Amateka Yacu", nav_who: "Abo Turi Bo", nav_testimonials: "Ubuhamya",
    nav_donate: "Shyigikira", nav_events: "Ibikorwa", nav_team: "Ikipe", nav_contact: "Twandikire",
    btn_darkmode: "Uburyo bw'Ijoro", btn_login_signup: "Injira / Iyandikishe", btn_login: "Injira", btn_logout: "Sohoka", btn_edit_profile: "Hindura Umwirondoro",
    hero_title: "EcoStay Abanyeshuri mu Bikorwa by'Ibihe", hero_desc: "Injira mu muryango mugari w'abanyeshuri mu Rwanda baharanira kubungabunga ibidukikije no gutera ibiti ku mashuri.", hero_btn: "Injira muri EcoStay Club",
    mission_title: "Intego n'Icyerekezo", mission_sub: "Guhindura Ibidukikije uhereye mu Mutima w'u Rwanda", card_mission: "Intego Yacu", text_mission: "Guhanga Ahantu Hatoshye (Green Havens) muri kaminuza, guha ubushobozi abanyeshuri bwo kubaka ubwirinzi bw'ibihe (climate resilience) binyuze mu kubungabunga ibidukikije no gutera ibiti by'umwimerere.", card_vision: "Icyerekezo Cyacu", text_vision: "u Rwanda aho buri munyeshuri ayobora ishyirwaho ry'Ahantu Hatoshye, guteza imbere umuco w'ubwirinzi bw'ibihe no kwita ku bidukikije.",
    journey_title: "Urugendo Rwacu", journey_sub: "Uhereye ku Gitekerezo Kugeza ku Muryango Mugari w'Igihugu",
    year_2024_title: "Igutera ry'Igitekerezo", year_2024_desc: "Iki gitekerezo cyavutse muri Kaminuza y'u Rwanda cyizwe n'abanyeshuri bashakaga kugarura urusobe rw'ibinyabuzima.",
    year_2025_title: "Gushinga Imizi", year_2025_desc: "Twashizeho pepiniyeri zicungwa n'abanyeshuri kandi dufatanya n'abaturage mu gutera ibiti.",
    year_2026_title: "Gushibuka", year_2026_desc: "Kwaguza amashami ya EcoStay muri kaminuza zitandukanye mu gihugu hose.",
    who_desc: "Turi itsinda ry'abanyeshuri, abarimu, n'abaharanira ibidukikije bo muri Kaminuza y'u Rwanda, bunze ubumwe ku ntego imwe: kurinda isi yacu.",
    team_sub: "Abanyamutima Bari Inyuma ya EcoStay",
    role_president: "Perezida", role_vice: "Visi-Perezida", role_secretary: "Umunyamabanga Mukuru",
    role_treasurer: "Umubitsi", role_coordinator: "Umuhuzabikorwa Mukuru", role_comm: "IT n'Itumanaho",
    role_it: "Ushinzwe IT", role_logistics: "Ushinzwe Ibikoresho", role_advisor: "Umuyobozi mu Barimu", role_legal: "Ushinzwe Amategeko", role_founder: "Uwahanze Igitekerezo",
    test_1: '"EcoStay yampaye urubuga rwo gushyira mu bikorwa ibyo nize mu ishuri."',
    test_2: '"Amahirwe yo kumenyana n\'abandi yari ahebuje."',
    donate_title: "Shyigikira Ibikorwa Byacu", donate_box_title: "Dufe guhindura u Rwanda rutoshye", donate_box_desc: "Inkunga yawe idufasha gutera ibiti no kwitaho pepiniyeri zacu.",
    donate_momo: "Hitamo Umubare (Mobile Money)", donate_pay_btn: "Ishyura na Mobile Money",
    activities_title: "Ibikorwa Byacu", activities_sub: "Ibikorwa Bifashije mu Gutunganya u Rwanda Rutoshye",
    status_done: "Byarangiye", status_pending: "Ibiteganyijwe", status_canceled: "Byahagaritswe",
    event_1_title: "Gutera Ibiti kuri Kaminuza", event_1_desc: "Igikorwa rusange cyo gutera ibiti by'umwimerere ku mashuri.",
    event_2_title: "Umuganda w'Ibidukikije", event_2_desc: "Isuku rusange no gutunganya ibidukikije mu midugudu itandukanye.",
    event_3_title: "Inama: Kubaho mu buryo burinda Ibidukikije", event_3_desc: "Kwigira hamwe uko wagabanya imyanda n'uko wakoresha ingufu zisubira.",
    btn_register_event: "Iyandikishe Kwitabira",
    btn_view_impact: "Reba Ibyagezweho",
    footer_phone: "Terefoni", footer_email: "Imeri", footer_location: "Aho duherereye",
    label_name: "Amazina Yose", label_email: "Imeri", label_pass: "Ijambo ry'ibanga",
    label_whatsapp: "Nimero ya WhatsApp", label_faculty: "Ishami", label_year: "Umwaka w'ishuri", label_interests: "Ibyo ukunda",
    btn_create_acc: "Fungura konti", btn_save: "Bika Impinduka", btn_confirm: "Emeza",
    dashboard_welcome: "Murakaza neza", dashboard_impact: "Witeguye guhindura ibidukikije ?", dashboard_desc: "Injira muri EcoStay Club uyu munsi ube mu itsinda ry'abanyeshuri bari imbere mu bikorwa by'ibihe.",
    impact_title: "Ibyo Twagezeho Twese", trees_planted: "Ibiti Byatewe", carbon_saved: "CO2 Yakuwe (kg)", active_members: "Abanyamuryango Bakora",
    toast_welcome: "Murakaza neza kuri EcoStay!", toast_invalid_auth: "Imeri cyangwa ijambo ry'ibanga si byo.", toast_reg_success: "Konti yawe yafunguwe neza!",
    toast_email_taken: "Iyi imeri yaranditswe.", toast_pass_short: "Ijambo ry'ibanga rigomba kugira inyuguti 8.",
    toast_login_first: "Banza winjire ubashe kwiyandikisha.", toast_sending: "Biracyatunganywa...", toast_fill_all: "Uzuza imyanya yose isabwa.",
    toast_invalid_email: "Andika imeri itunganye.", toast_invalid_phone: "Andika nimero ya terefoni itunganye.",
    hint_photo: "Kanda kuri kamera uhindure ifoto", auth_title: "Injira mu Konti", tab_login: "Injira", tab_register: "Iyandikishe"
  }
};

function setLanguage(lang) {
  const elements = document.querySelectorAll('[data-lang]');
  elements.forEach(el => {
    const key = el.getAttribute('data-lang');
    if (translations[lang] && translations[lang][key]) {
      el.innerText = translations[lang][key];
    }
  });

  document.querySelectorAll('.lang-opt').forEach(btn => btn.classList.remove('active-lang'));
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));

  const langIndex = lang === 'en' ? 0 : lang === 'fr' ? 1 : 2;
  const desktopOpts = document.querySelectorAll('.lang-opt');
  if (desktopOpts[langIndex]) desktopOpts[langIndex].classList.add('active-lang');

  const mobileOpts = document.querySelectorAll('.lang-btn');
  if (mobileOpts[langIndex]) mobileOpts[langIndex].classList.add('active');

  localStorage.setItem('lang', lang);
}

// Init Language
const savedLang = localStorage.getItem('lang') || 'en';
setLanguage(savedLang);

/* --- 2. IMAGE COMPRESSION --- */
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 150;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    };
    reader.onerror = (error) => reject(error);
  });
}

/* --- 3. HELPER FUNCTIONS --- */
function showToast(message, type = 'success') {
  const lang = localStorage.getItem('lang') || 'en';
  // Check if message is a translation key
  const langDict = translations[lang] || translations['en'];
  const translatedMessage = langDict[message] || message;

  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = type === 'success' ? `<i class="fa-solid fa-circle-check"></i> <span>${translatedMessage}</span>` : `<i class="fa-solid fa-circle-exclamation"></i> <span>${translatedMessage}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 3500);
}

function toggleMobileMenu() { document.getElementById('navLinks').classList.toggle('active'); }
function closeMobileMenu() { document.getElementById('navLinks').classList.remove('active'); }
function openModal(id) {
  if ((id === 'joinModal' || id === 'eventRegModal') && !localStorage.getItem("ecostay_user")) {
    showToast("toast_login_first", "error");
    openModal('authModal');
    return;
  }
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('u-flex');
    el.classList.remove('u-hidden');
  }
  closeMobileMenu();
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove('u-flex');
    el.classList.add('u-hidden');
  }
}
window.onclick = e => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('u-flex');
    e.target.classList.add('u-hidden');
  }
};

function switchTab(tab, isLanding = false) {
  const prefix = isLanding ? "landing" : "";
  const loginForm = document.getElementById(isLanding ? "landingLoginForm" : "loginForm");
  const regForm = document.getElementById(isLanding ? "landingRegisterForm" : "registerForm");

  // Select tabs within the correct context
  const container = isLanding ? document.getElementById("auth-landing") : document.getElementById("authModal");
  if (!container) return;
  const btns = container.querySelectorAll(".tab-btn");

  if (tab === 'login') {
    if (loginForm) {
      loginForm.style.display = 'block';
      loginForm.classList.remove('u-hidden');
    }
    if (regForm) {
      regForm.style.display = 'none';
      regForm.classList.add('u-hidden');
    }
    if (btns[0]) btns[0].classList.add("active");
    if (btns[1]) btns[1].classList.remove("active");
  }
  else {
    if (loginForm) {
      loginForm.style.display = 'none';
      loginForm.classList.add('u-hidden');
    }
    if (regForm) {
      regForm.style.display = 'block';
      regForm.classList.remove('u-hidden');
    }
    if (btns[0]) btns[0].classList.remove("active");
    if (btns[1]) btns[1].classList.add("active");
  }
}

function toggleTheme() {
  const isDark = document.body.getAttribute('data-theme') === 'dark';
  document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

/* --- 4. AUTH & USER LOGIC --- */
function getSafeAvatar(user) {
  if (user && user.avatar && user.avatar.length > 50) return user.avatar;
  const safeName = user ? user.name : "User";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(safeName)}&background=1A4D2E&color=fff&size=128`;
}

function checkLogin() {
  const userStr = localStorage.getItem("ecostay_user");
  const isAdmin = localStorage.getItem("ecostay_admin") === "true";

  console.log("🔍 checkLogin() called");
  console.log("  - User session:", userStr ? "✅ Found" : "❌ Not found");
  console.log("  - Is admin:", isAdmin ? "✅ Yes" : "❌ No");

  // REDIRECT ADMIN TO CMS IMMEDIATELY
  if (isAdmin && !window.location.pathname.includes('admin.html')) {
    console.log("🛡️ Admin detected on main site, redirecting to CMS...");
    window.location.replace("admin.html");
    return;
  }

  const desktopGuest = document.getElementById("guest-actions");
  const desktopUser = document.getElementById("user-actions");
  const mobileGuest = document.getElementById("mobile-guest");
  const mobileUser = document.getElementById("mobile-user");
  const dashboard = document.getElementById("dashboard");
  const hero = document.getElementById("home");
  const authLanding = document.getElementById("auth-landing");
  const mainContent = document.getElementById("main-content");

  // If logged in as admin but no user session yet, we still show the main site
  if (userStr || isAdmin) {
    let user = { name: "Admin", email: "admin@ecostay.rw" };
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch (e) {
        console.error("Failed to parse user data", e);
        if (!isAdmin) {
          localStorage.removeItem("ecostay_user");
          location.reload();
          return;
        }
      }
    }
    const avatarSrc = getSafeAvatar(user);

    // 1. Landing vs Content
    if (authLanding) {
      authLanding.style.setProperty('display', 'none', 'important');
      authLanding.classList.add('u-hidden');
    }
    if (mainContent) {
      mainContent.style.setProperty('display', 'block', 'important');
      mainContent.classList.remove('u-hidden');
    }

    // 2. Navbar Visibility
    const navLoginBtns = document.querySelectorAll('.navbar .btn.primary, #guest-actions, #mobile-guest');
    navLoginBtns.forEach(btn => {
      btn.style.setProperty('display', 'none', 'important');
      btn.classList.add('u-hidden');
    });

    if (desktopUser) {
      desktopUser.style.setProperty('display', 'flex', 'important');
      desktopUser.classList.remove('u-hidden');
    }
    if (mobileUser) {
      mobileUser.style.setProperty('display', 'block', 'important');
      mobileUser.classList.remove('u-hidden');
    }

    // 3. Update User Info
    const navName = document.getElementById("nav-name");
    const navAvatar = document.getElementById("nav-avatar");
    const menuName = document.getElementById("menu-name");
    const menuEmail = document.getElementById("menu-email");
    const mobName = document.getElementById("mobile-name");
    const mobEmail = document.getElementById("mobile-email");
    const mobAvatar = document.getElementById("mobile-avatar");

    if (navName) navName.innerText = user.name.split(" ")[0];
    if (navAvatar) navAvatar.src = avatarSrc;
    if (menuName) menuName.innerText = user.name;
    if (menuEmail) menuEmail.innerText = user.email;
    if (mobName) mobName.innerText = user.name;
    if (mobEmail) mobEmail.innerText = user.email;
    if (mobAvatar) mobAvatar.src = avatarSrc;

    // 4. Dashboard Population
    if (dashboard) {
      dashboard.style.setProperty('display', 'block', 'important');
      dashboard.classList.remove('u-hidden');

      const lang = localStorage.getItem('lang') || 'en';
      const welcomePrefix = translations[lang]['dashboard_welcome'] || "Welcome back";
      const dashWelcome = document.getElementById("dashboard-welcome");
      if (dashWelcome) dashWelcome.innerText = `${welcomePrefix}, ${user.name}!`;

      const quickActionsTitle = document.getElementById("quick-actions-title");
      // Set default title
      if (quickActionsTitle) quickActionsTitle.innerText = "Quick Actions";
    }

    // 5. Join Button Visibility (Hide if already a member)
    const heroBtn = document.getElementById('heroJoinBtn');
    if (heroBtn) {
      if (user.is_member) {
        heroBtn.style.display = 'none';
      } else {
        heroBtn.style.display = 'inline-flex';
      }
    }

    // 6. Cloud Sync Check
    checkCloudSyncStatus(user);

  } else {
    // No user logged in
    if (authLanding) {
      authLanding.style.setProperty('display', 'flex', 'important');
      authLanding.classList.remove('u-hidden');
    }
    if (mainContent) {
      mainContent.style.setProperty('display', 'none', 'important');
      mainContent.classList.add('u-hidden');
    }
    if (desktopGuest) {
      desktopGuest.style.setProperty('display', 'flex', 'important');
      desktopGuest.classList.remove('u-hidden');
    }
    if (desktopUser) {
      desktopUser.style.setProperty('display', 'none', 'important');
      desktopUser.classList.add('u-hidden');
    }
    if (mobileGuest) {
      mobileGuest.style.setProperty('display', 'block', 'important');
      mobileGuest.classList.remove('u-hidden');
    }
    if (mobileUser) {
      mobileUser.style.setProperty('display', 'none', 'important');
      mobileUser.classList.add('u-hidden');
    }
    if (dashboard) {
      dashboard.style.setProperty('display', 'none', 'important');
      dashboard.classList.add('u-hidden');
    }
    if (hero) hero.classList.remove('u-hidden');
  }
}

// REDIRECT TO DASHBOARD
function scrollToDashboard() {
  const dashboard = document.getElementById('dashboard');
  const mainContent = document.getElementById('main-content');
  const authLanding = document.getElementById('auth-landing');

  // Force hide landing and show main content
  if (authLanding) {
    authLanding.style.setProperty('display', 'none', 'important');
    authLanding.classList.add('u-hidden');
  }
  if (mainContent) {
    mainContent.style.setProperty('display', 'block', 'important');
    mainContent.classList.remove('u-hidden');
  }

  if (dashboard) {
    dashboard.style.setProperty('display', 'block', 'important');
    dashboard.classList.remove('u-hidden');
    setTimeout(() => {
      dashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
}

// LOGIN
const handleLogin = async (email, password) => {
  console.log('🔐 Login attempt:', email);
  const loginEmail = email.trim().toLowerCase();
  const loginPass = password.trim();

  // --- 1. Admin Bypass ---
  if ((loginEmail === "admin@ecostay.rw" || loginEmail === "admin@ecostay.org") && (loginPass === "admin123" || loginPass === "Admin123")) {
    const adminUser = { id: 'admin', name: "Admin", email: loginEmail, is_member: true };
    localStorage.setItem("ecostay_admin", "true");
    localStorage.setItem("ecostay_user", JSON.stringify(adminUser));
    localStorage.setItem("currentUser", JSON.stringify(adminUser));
    showToast("Welcome Admin!");

    // Explicitly hide landing if it exists
    const authLanding = document.getElementById("auth-landing");
    if (authLanding) {
      authLanding.style.setProperty('display', 'none', 'important');
      authLanding.classList.add('u-hidden');
    }

    setTimeout(() => {
      console.log("🚀 Redirecting Admin to CMS...");
      window.location.replace("admin.html");
    }, 100);
    return true;
  }

  // --- 2. Local Login (Fast & Offline-friendly) ---
  const localUsers = JSON.parse(localStorage.getItem('ecostay_users') || '[]');
  const localUser = localUsers.find(u => u.email === loginEmail && u.password === loginPass);

  if (localUser) {
    const isAdmin = localUser.email === "admin@ecostay.org" || localUser.email === "admin@ecostay.rw" || localUser.role === "Admin";

    const userSession = {
      id: localUser.id || Date.now(),
      name: localUser.name,
      email: localUser.email,
      avatar: localUser.avatar,
      is_member: localUser.is_member || isAdmin
    };

    if (isAdmin) localStorage.setItem("ecostay_admin", "true");

    localStorage.setItem("ecostay_user", JSON.stringify(userSession));
    localStorage.setItem("currentUser", JSON.stringify(userSession));

    showToast("toast_welcome");
    closeModal('authModal');
    setTimeout(() => {
      if (isAdmin) {
        console.log("🚀 Redirecting Admin to CMS...");
        window.location.replace("admin.html");
      } else {
        checkLogin();
        // Redirect normal user to main site home
        setTimeout(() => {
          const mainContent = document.getElementById('main-content');
          const authLanding = document.getElementById('auth-landing');
          if (authLanding) authLanding.classList.add('u-hidden');
          if (mainContent) {
            mainContent.classList.remove('u-hidden');
            mainContent.style.setProperty('display', 'block', 'important');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      }
    }, 100);
    return true;
  }

  // --- 3. Firestore Fallback (If not found locally) ---
  try {
    const fs = await getFirestoreHelpers();
    const docRef = fs.doc(fs.db, 'users', loginEmail);
    const docSnap = await fs.getDoc(docRef);

    if (docSnap.exists()) {
      const user = docSnap.data();
      if (user.password === loginPass) {
        const isAdmin = user.email === "admin@ecostay.org" || user.email === "admin@ecostay.rw" || user.role === "Admin";

        const userSession = {
          id: user.id || Date.now(),
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          is_member: user.is_member || isAdmin
        };

        if (isAdmin) localStorage.setItem("ecostay_admin", "true");

        // Sync to local storage for future offline access
        if (!localUsers.some(u => u.email === loginEmail)) {
          localUsers.push(user);
          localStorage.setItem('ecostay_users', JSON.stringify(localUsers));
        }

        localStorage.setItem("ecostay_user", JSON.stringify(userSession));
        localStorage.setItem("currentUser", JSON.stringify(userSession));

        showToast("toast_welcome");
        closeModal('authModal');
        setTimeout(() => {
          if (isAdmin) {
            window.location.replace("admin.html");
          } else {
            checkLogin();
            // Redirect normal user to main site home
            setTimeout(() => {
              const mainContent = document.getElementById('main-content');
              const authLanding = document.getElementById('auth-landing');
              if (authLanding) authLanding.classList.add('u-hidden');
              if (mainContent) {
                mainContent.classList.remove('u-hidden');
                mainContent.style.setProperty('display', 'block', 'important');
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
          }
        }, 100);
        return true;
      }
    }
  } catch (err) {
    console.warn("Firestore login failed:", err);
    if (localUsers.length === 0 || !localUser) {
        showToast("Cloud sync failed. If you registered recently, ensure you are online and not in incognito if your account wasn't synced.", "warning");
    }
  }

  showToast("toast_invalid_auth", "error");
  return false;
};

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log('📝 Login form submitted');
  await handleLogin(document.getElementById("loginEmail").value.trim(), document.getElementById("loginPass").value);
});

const landingLoginForm = document.getElementById("landingLoginForm");
if (landingLoginForm) {
  console.log('✅ Landing login form found');
  landingLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log('📝 Landing login form submitted');
    await handleLogin(document.getElementById("landEmail").value.trim(), document.getElementById("landPass").value);
  });
} else {
  console.error('❌ Landing login form NOT found');
}

// REGISTER
const handleRegister = async (name, email, password, confirmPass, formElement) => {
  console.log("Register attempt:", email);
  if (!name || !email || !password) {
    showToast("toast_fill_all", "error");
    return;
  }
  const cleanEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    showToast("toast_invalid_email", "error");
    return;
  }
  if (password.length < 8) {
    showToast("toast_pass_short", "error");
    return;
  }
  if (confirmPass && password !== confirmPass) {
    showToast("toast_pass_mismatch", "error");
    return;
  }

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1A4D2E&color=fff`;
  const newUser = {
    id: Date.now(),
    name,
    email: cleanEmail,
    password: password.trim(),
    avatar: defaultAvatar,
    joined: new Date().toISOString(),
    is_member: false
  };

  // 1. Local Persistence (Ensures it works even if Firestore is slow/offline)
  const localUsers = JSON.parse(localStorage.getItem('ecostay_users') || '[]');
  if (localUsers.some(u => u.email === cleanEmail)) {
    showToast("toast_email_taken", "error");
    return;
  }
  localUsers.push(newUser);
  localStorage.setItem('ecostay_users', JSON.stringify(localUsers));

  showToast("Creating account...", "info");

  try {
    // 2. Firestore Sync
    const fs = await getFirestoreHelpers();
    const docRef = fs.doc(fs.db, 'users', cleanEmail);
    console.log("📤 Attempting cloud sync for:", cleanEmail);
    await fs.setDoc(docRef, newUser);
    console.log("✅ Cloud sync success!");
    showToast("Account synced to cloud!", "success");
  } catch (err) {
    console.error("❌ Cloud sync failed:", err);
    // Explicitly notify that it's LOCAL ONLY
    alert(`IMPORTANT: Cloud sync failed (${err.message}). Your account is ONLY saved on this browser. Do not use Incognito or clear your cache if you want to keep this account.`);
  }

  const userSession = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    avatar: newUser.avatar,
    is_member: false
  };

  localStorage.setItem("ecostay_user", JSON.stringify(userSession));
  localStorage.setItem("currentUser", JSON.stringify(userSession));

  showToast("toast_reg_success");
  
  // IMPORTANT: Close modal and trigger UI update
  closeModal('authModal');
  if (formElement) formElement.reset();

  // Force UI update with proper async flow
  setTimeout(() => {
    console.log("✅ Registration complete, updating UI...");
    
    checkLogin(); // Updates navbar and hides landing
    
    // Ensure main content is visible and scroll to top
    const mainContent = document.getElementById('main-content');
    const authLanding = document.getElementById('auth-landing');
    if (authLanding) authLanding.classList.add('u-hidden');
    
    if (mainContent) {
      mainContent.style.setProperty('display', 'block', 'important');
      mainContent.classList.remove('u-hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, 150);
};

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  await handleRegister(
    document.getElementById("regName").value.trim(),
    document.getElementById("regEmail").value.trim(),
    document.getElementById("regPass").value,
    null,
    e.target
  );
});

const landingRegForm = document.getElementById("landingRegisterForm");
if (landingRegForm) {
  landingRegForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await handleRegister(
      document.getElementById("landRegName").value.trim(),
      document.getElementById("landRegEmail").value.trim(),
      document.getElementById("landRegPass").value,
      null,
      e.target
    );
  });
}

// EDIT PROFILE
function openEditProfile() {
  const user = JSON.parse(localStorage.getItem("ecostay_user"));
  if (user) {
    const modal = document.getElementById('editProfileModal');
    if (!modal) return;

    document.getElementById("editName").value = user.name;
    document.getElementById("editEmail").value = user.email;
    document.getElementById("editProfilePreview").src = getSafeAvatar(user);
    openModal('editProfileModal');
  }
}

let compressedAvatarData = null;
const editImgInput = document.getElementById("editProfileImg");
if (editImgInput) {
  editImgInput.addEventListener("change", function () {
    if (this.files && this.files[0]) {
      if (!this.files[0].type.match('image.*')) { showToast("Select an image file.", "error"); return; }
      showToast("Processing image...", "success");
      compressImage(this.files[0]).then(base64 => {
        compressedAvatarData = base64;
        document.getElementById("editProfilePreview").src = base64;
      }).catch(() => showToast("Error processing image.", "error"));
    }
  });
}

const editProfileForm = document.getElementById("editProfileForm");
if (editProfileForm) {
  editProfileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("editName").value;
    const email = document.getElementById("editEmail").value.trim().toLowerCase();
    const user = JSON.parse(localStorage.getItem("ecostay_user"));
    const finalAvatar = compressedAvatarData || user.avatar;

    const oldEmail = user.email;

    // 1. Immediate Local Update (UI responsiveness)
    const updatedUser = {
      name,
      email,
      avatar: finalAvatar,
      is_member: user.is_member || false
    };

    localStorage.setItem("ecostay_user", JSON.stringify(updatedUser));

    // Update ecostay_users array
    const localUsers = JSON.parse(localStorage.getItem('ecostay_users') || '[]');
    const uIdx = localUsers.findIndex(u => u.email === oldEmail);
    if (uIdx !== -1) {
      localUsers[uIdx].name = name;
      localUsers[uIdx].email = email;
      localUsers[uIdx].avatar = finalAvatar;
      localStorage.setItem('ecostay_users', JSON.stringify(localUsers));
    }

    checkLogin();
    closeModal('editProfileModal');
    showToast("Profile Updated!");

    // 2. Background Firestore Sync
    try {
      const fs = await getFirestoreHelpers();
      const docRef = fs.doc(fs.db, 'users', email);
      await fs.setDoc(docRef, {
        name,
        email,
        avatar: finalAvatar
      }, { merge: true });
      console.log("Firestore sync successful");
    } catch (err) {
      console.warn("Firestore sync failed, but local update persistent:", err);
    }
  });
}

// --- NEW: FIREBASE (Modular v10+) helper: dynamic import and single initialisation ---
// This function dynamically imports the modular Firebase SDK (v10+) and returns
// helper functions to interact with Firestore. It expects a global
// `FIREBASE_CONFIG` object to be defined (insert your Firebase config in HTML).
async function getFirestoreHelpers() {
  // Return cached helpers if already initialised
  if (window._ecostay_fs) return window._ecostay_fs;

  try {
    const appModule = await import('https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js');
    const firestoreModule = await import('https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js');

    if (!window.FIREBASE_CONFIG) throw new Error('Missing FIREBASE_CONFIG (set window.FIREBASE_CONFIG in your HTML)');

    const app = appModule.initializeApp(window.FIREBASE_CONFIG);
    const db = firestoreModule.getFirestore(app);

    // Cache and expose the commonly used functions we need
    window._ecostay_fs = {
      db,
      collection: firestoreModule.collection,
      addDoc: firestoreModule.addDoc,
      serverTimestamp: firestoreModule.serverTimestamp,
      doc: firestoreModule.doc,
      getDoc: firestoreModule.getDoc,
      setDoc: firestoreModule.setDoc,
      query: firestoreModule.query,
      where: firestoreModule.where,
      getDocs: firestoreModule.getDocs,
      onSnapshot: firestoreModule.onSnapshot
    };

    return window._ecostay_fs;
  } catch (err) {
    console.error('Firestore init error:', err);
    showToast(`Firebase Init Error: ${err.message}. Please check your internet connection.`, "error");
    throw err;
  }
}

// Helper: create or update a local 'ecostay_users' entry and 'ecostay_user' session
function persistLocalUser(fullName, email) {
  const users = JSON.parse(localStorage.getItem('ecostay_users') || '[]');
  const idx = users.findIndex(u => u.email === email);
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=1A4D2E&color=fff`;

  if (idx !== -1) {
    users[idx].name = fullName;
    users[idx].is_member = true;
    users[idx].avatar = users[idx].avatar || defaultAvatar;
  } else {
    users.push({ name: fullName, email, password: '', avatar: defaultAvatar, is_member: true, joined: new Date().toISOString() });
  }
  localStorage.setItem('ecostay_users', JSON.stringify(users));

  // Update session so the UI recognises them as a member immediately
  localStorage.setItem('ecostay_user', JSON.stringify({ name: fullName, email, avatar: defaultAvatar, is_member: true }));

  // Call checkLogin and scroll to dashboard
  checkLogin();
  scrollToDashboard();
}

// --- UI: Join Form Validation & Email Hint ---
(function () {
  const form = document.getElementById('joinClubForm');
  const submitBtn = document.getElementById('joinSubmitBtn');
  const emailInput = document.getElementById('joinEmail');
  const hint = document.getElementById('joinEmailHint');
  const valueEl = document.getElementById('joinEmailValue');

  if (!form || !submitBtn || !emailInput || !hint || !valueEl) return;

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const checkFormValidity = () => {
    const fullName = document.getElementById('joinName').value.trim();
    const whatsapp = document.getElementById('joinWhatsApp').value.trim();
    const email = emailInput.value.trim();
    const faculty = document.getElementById('joinFaculty').value.trim();
    const year = document.getElementById('joinYear').value.trim();

    const isEmailValid = validateEmail(email);
    const isValid = fullName !== '' &&
      whatsapp !== '' &&
      isEmailValid &&
      faculty !== '' &&
      year !== '';

    submitBtn.disabled = !isValid;

    // Update Email Hint
    if (isEmailValid) {
      valueEl.textContent = email;
      hint.classList.add('u-block');
      hint.classList.remove('u-hidden');
    } else {
      hint.classList.add('u-hidden');
      hint.classList.remove('u-block');
    }
  };

  // Add listeners to all required fields
  const fields = ['joinName', 'joinWhatsApp', 'joinEmail', 'joinFaculty', 'joinYear'];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', checkFormValidity);
      // Ensure onChange also triggers for autofill or select changes
      el.addEventListener('change', checkFormValidity);
    }
  });

  // Initial check (in case of browser autofill)
  checkFormValidity();

  // Also update when join modal opens (observe class changes)
  const modal = document.getElementById('joinModal');
  if (modal) {
    const observer = new MutationObserver(() => {
      if (!modal.classList.contains('u-hidden')) {
        // Pre-fill if fields are empty
        const userStr = localStorage.getItem("ecostay_user");
        if (userStr) {
          const user = JSON.parse(userStr);
          const nameInput = document.getElementById("joinName");
          const emailInput = document.getElementById("joinEmail");
          if (nameInput && !nameInput.value) nameInput.value = user.name || "";
          if (emailInput && !emailInput.value) emailInput.value = user.email || "";
        }
        checkFormValidity();
      }
    });
    observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
  }
})();

// JOIN CLUB FORM SUBMISSION (Enhanced)
document.getElementById('joinClubForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const fullName = document.getElementById('joinName').value.trim();
  const whatsapp = document.getElementById('joinWhatsApp').value.trim();
  const email = document.getElementById('joinEmail').value.trim();
  const faculty = document.getElementById('joinFaculty').value.trim();
  const year = document.getElementById('joinYear').value.trim();
  const interests = document.getElementById('joinInterests').value.trim();
  const formEl = e.target;

  if (!fullName || !email || !whatsapp) {
    showToast('toast_fill_all', 'error');
    return;
  }

  showToast('Processing your membership...', 'success');

  try {
    const memberData = {
      fullName,
      email,
      whatsapp,
      faculty: faculty || 'N/A',
      year: year || 'N/A',
      interests: interests || 'N/A',
      status: 'Pending',
      joinedAt: new Date().toISOString()
    };

    // 1. Save to Firestore (via API Integration)
    let docRefId = null;
    try {
      if (window.membersAPI) {
        // Create returns promise, but api-integration.js currently doesn't return the ID.
        // We can update api-integration.js later if strict ID tracking is needed.
        await window.membersAPI.create(memberData);
        console.log('✓ Saved to Firestore via API');
        // docRefId = ... (skipped for now as api doesn't return it)
      } else {
        console.warn("membersAPI not found, saving locally only.");
      }
    } catch (err) {
      console.error('⚠ Firestore Error:', err);
    }

    // 2. Update Local User & Users List
    const currentUser = JSON.parse(localStorage.getItem('ecostay_user') || '{}');
    if (currentUser.email === email || !currentUser.email) {
      currentUser.is_member = true; // Mark as member (pending)
      currentUser.firestoreId = docRefId;
      localStorage.setItem('ecostay_user', JSON.stringify(currentUser));
    }

    const localUsers = JSON.parse(localStorage.getItem('ecostay_users') || '[]');
    const uIdx = localUsers.findIndex(u => u.email === email);
    if (uIdx !== -1) {
      localUsers[uIdx].is_member = true;
      localUsers[uIdx].firestoreId = docRefId;
      localStorage.setItem('ecostay_users', JSON.stringify(localUsers));
    }

    // 3. Send welcome email via EmailJS
    try {
      const ejs = window.emailjs || emailjs;
      const templateParams = {
        to_email: email,  // CRITICAL: This must match your template's "To Email" field
        to_name: fullName,
        user_name: fullName,
        user_email: email,
        fullName: fullName,
        email: email,
        whatsapp: whatsapp,
        faculty: faculty,
        year: year,
        interests: interests,
        message: 'Welcome to EcoStay Club! We have received your membership request. Your status is currently: Pending Admin Approval.'
      };
      
      console.log('📧 Sending email with params:', templateParams);
      console.log('🔍 Debug Info:', {
        email_to: email,
        fullname: fullName,
        formValues: {
          fullName,
          email,
          whatsapp,
          faculty,
          year,
          interests
        }
      });
      const response = await ejs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      console.log('✅ Email sent successfully!', response);
      console.log('✅ Check your email:', email);
      showToast('Joined successfully! Welcome email sent.');
    } catch (err) {
      console.error('❌ Email Error Details:', {
        status: err.status,
        text: err.text,
        message: err.message,
        serviceId: EMAILJS_SERVICE_ID,
        templateId: EMAILJS_TEMPLATE_ID
      });
      showToast('Joined! (Email may be delayed)', 'info');
    }

    // 4. UI Cleanup
    checkLogin();
    closeModal('joinModal');
    scrollToDashboard();
    if (formEl) formEl.reset();
    const subBtn = document.getElementById('joinSubmitBtn');
    if (subBtn) subBtn.disabled = true;

  } catch (err) {
    console.error('⚠ Join Club Global Error:', err);
    showToast('Join request failed. Please try again.', 'error');
  }
});
function logout() { if (confirm("Logout?")) { localStorage.removeItem("ecostay_user"); checkLogin(); showToast("Logged out."); } }

function togglePasswordVisibility(inputId, icon) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
}

let selectedAmount = 0;
function selectAmount(amount, btn) {
  selectedAmount = amount;
  // Highlight selected button
  document.querySelectorAll('.donate-grid .btn').forEach(b => b.classList.remove('active-amount'));
  btn.classList.add('active-amount');
  showToast(`${amount.toLocaleString()} RWF Selected`);
}

function payMomo() {
  if (selectedAmount === 0) {
    showToast("Please select an amount first", "error");
    return;
  }
  showToast("Opening Mobile Money USSD...", "success");
  // USSD: *182*1*1*0784095661*AMOUNT#
  const ussdCode = `*182*1*1*0784095661*${selectedAmount}#`;
  // Using tel: link to trigger dialer on mobile
  window.location.href = `tel:${ussdCode}`;
}

/* --- 5. EVENT FUNCTIONS --- */
checkLogin();
if (localStorage.getItem('theme') === 'dark') document.body.setAttribute('data-theme', 'dark');

console.log('✅ Script.js loaded successfully');
console.log('📋 Available functions:', {
  switchTab: typeof switchTab,
  handleLogin: typeof handleLogin,
  checkLogin: typeof checkLogin,
  togglePasswordVisibility: typeof togglePasswordVisibility
});

/* --- 6. CHATBOT FUNCTIONS --- */
function toggleChatbot() {
  const chatbot = document.getElementById('chatbot-container');
  const button = document.getElementById('chatbot-button');
  if (!chatbot || !button) return;
  if (chatbot.classList.contains('active')) {
    chatbot.classList.remove('active');
    button.classList.remove('active');
  } else {
    chatbot.classList.add('active');
    button.classList.add('active');
  }
}

function addMessage(message, isBot = false) {
  const messages = document.getElementById('chatbot-messages');
  if (!messages) return;
  const messageDiv = document.createElement('div');
  messageDiv.className = `chatbot-message ${isBot ? 'bot' : 'user'}`;
  messageDiv.innerHTML = `<p>${message}</p>`;
  messages.appendChild(messageDiv);
  messages.scrollTop = messages.scrollHeight;
}

function handleChatbotInput(event) {
  if (event.key === 'Enter') {
    sendChatbotMessage();
  }
}

function sendChatbotMessage() {
  const input = document.getElementById('chatbot-input');
  if (!input) return;
  const message = input.value.trim().toLowerCase();

  if (message) {
    addMessage(message, false);
    input.value = '';

    setTimeout(() => {
      let response = "";
      if (message.includes('event') || message.includes('activit') || message.includes('project')) {
        response = "We have many upcoming activities! Check out our 'Our Activities' section to see our reforestation projects and workshops like the Campus Forest Initiative.";
      } else if (message.includes('join') || message.includes('member') || message.includes('register')) {
        response = "You can join EcoStay Club by registering an account and then clicking the 'Join EcoStay Club' button on your dashboard. We're always looking for new Guardians!";
      } else if (message.includes('donat') || message.includes('support') || message.includes('money') || message.includes('pay')) {
        response = "Thank you for wanting to support us! You can donate via Mobile Money in the 'Support Our Impact' section. Every contribution helps us plant more trees.";
      } else if (message.includes('mission') || message.includes('vision') || message.includes('goal')) {
        response = "Our mission is to cultivate Green Havens across university campuses and empower students to build climate resilience through hands-on conservation.";
      } else if (message.includes('team') || message.includes('founder') || message.includes('who')) {
        response = "EcoStay was founded by Niyigaba Heritier. Our team includes passionate students like Rebecca (President), Jean Dedier (Coordinator), and many others dedicated to climate action.";
      } else if (message.includes('contact') || message.includes('location') || message.includes('address') || message.includes('email') || message.includes('phone')) {
        response = "You can contact us at info@ecostay.rw or call +250 784 095 661. We are based at the University of Rwanda.";
      } else if (message.includes('tree') || message.includes('impact') || message.includes('co2') || message.includes('planted')) {
        response = "So far, we've planted over 1,240 trees and sequestered approximately 31,000kg of CO2! Check our Impact section for real-time stats.";
      } else if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
        response = "Hello! I'm the EcoStay assistant. You can ask me about our mission, events, team, or how you can get involved!";
      } else if (message.includes('thank')) {
        response = "You're welcome! Feel free to ask if you have any other questions. Let's green Rwanda together!";
      } else {
        response = "I'm not sure I understand that. Try asking about our 'events', 'how to join', 'our mission', or 'how to donate'.";
      }
      addMessage(response, true);
    }, 600);
  }
}

function openReportModal(title, content) {
  const modal = document.getElementById('reportModal');
  const titleEl = document.getElementById('reportTitle');
  const contentEl = document.getElementById('reportContent');
  if (modal && titleEl && contentEl) {
    titleEl.innerText = title;
    contentEl.innerText = content;
    modal.style.display = 'block';
  }
}

function openEventRegModal(eventTitle) {
  const modal = document.getElementById('eventRegModal');
  const titleEl = document.getElementById('eventRegTitle');
  if (modal && titleEl) {
    titleEl.innerText = `Register for: ${eventTitle}`;
    modal.style.display = 'block';
  }
}

/* --- 7. CLOUD SYNC HELPERS --- */
async function checkCloudSyncStatus(user) {
  const syncText = document.getElementById('sync-status-text');
  const syncBtn = document.getElementById('sync-now-btn');
  const syncIcon = document.getElementById('sync-icon');
  if (!syncText || !user) return;

  try {
    const fs = await getFirestoreHelpers();
    const docRef = fs.doc(fs.db, 'users', user.email);
    const docSnap = await fs.getDoc(docRef);

    if (docSnap.exists()) {
      syncText.innerText = "Cloud Sync Active";
      syncText.style.color = "var(--primary)";
      if (syncIcon) {
        syncIcon.className = "fa-solid fa-cloud-check u-text-success";
        syncIcon.style.color = "#22c55e";
      }
      if (syncBtn) syncBtn.classList.add('u-hidden');
    } else {
      syncText.innerText = "Local Only (Not Synced)";
      syncText.style.color = "#ef4444";
      if (syncIcon) syncIcon.className = "fa-solid fa-cloud-slash u-text-danger";
      if (syncBtn) syncBtn.classList.remove('u-hidden');
    }
  } catch (err) {
    syncText.innerText = "Sync Status Unknown";
    if (syncBtn) syncBtn.classList.remove('u-hidden');
  }
}

async function syncAccountToCloud() {
  const user = JSON.parse(localStorage.getItem('ecostay_user'));
  const allUsers = JSON.parse(localStorage.getItem('ecostay_users') || '[]');
  const fullUser = allUsers.find(u => u.email === user.email);

  if (!fullUser) {
    showToast("User data not found locally.", "error");
    return;
  }

  showToast("Syncing to cloud...", "info");
  try {
    const fs = await getFirestoreHelpers();
    const docRef = fs.doc(fs.db, 'users', fullUser.email);
    await fs.setDoc(docRef, fullUser);
    showToast("Successfully synced to cloud!", "success");
    checkCloudSyncStatus(user);
  } catch (err) {
    alert("Manual sync failed: " + err.message);
  }
}

// EXPOSE FUNCTIONS TO GLOBAL SCOPE
window.syncAccountToCloud = syncAccountToCloud;

// EXPOSE FUNCTIONS TO GLOBAL SCOPE FOR ONCLICK HANDLERS
window.switchTab = switchTab;
window.setLanguage = setLanguage;
window.toggleTheme = toggleTheme;
window.openModal = openModal;
window.closeModal = closeModal;
window.togglePasswordVisibility = togglePasswordVisibility;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.logout = logout;
window.openEditProfile = openEditProfile;
window.openReportModal = openReportModal;
window.openEventRegModal = openEventRegModal;
window.selectAmount = selectAmount;
window.payMomo = payMomo;
window.handleChatbotInput = handleChatbotInput;
window.sendChatbotMessage = sendChatbotMessage;
window.toggleChatbot = toggleChatbot;

// --- EMAILJS TEST FUNCTION ---
async function testEmailJS() {
  console.log('🧪 Testing EmailJS...');
  console.log('Service ID:', EMAILJS_SERVICE_ID);
  console.log('Template ID:', EMAILJS_TEMPLATE_ID);
  
  try {
    const testEmail = prompt('Enter test email address:', 'ecostaychallenge@gmail.com');
    if (!testEmail) return;
    
    const testName = prompt('Enter test name:', 'EcoStay Tester');
    if (!testName) return;
    
    showToast('📧 Sending test email...', 'info');
    
    const ejs = window.emailjs || emailjs;
    const templateParams = {
      to_name: testName,
      to_email: testEmail,
      fullName: testName,
      whatsapp: '+250787654321',
      faculty: 'Test Faculty',
      year: '2026',
      interests: 'Testing EmailJS Integration',
      message: '✅ This is a TEST email. EmailJS is working correctly!'
    };
    
    const response = await ejs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    console.log('✅ Email sent successfully!', response);
    showToast('✅ Test email sent! Check your inbox.', 'success');
    
  } catch (error) {
    console.error('❌ EmailJS Error:', error);
    showToast(`❌ Email failed: ${error.text || error.message}`, 'error');
  }
}

// Make test function available globally
window.testEmailJS = testEmailJS;

// --- HOT RELOAD FOR ADMIN CHANGES ---
// Listen for changes from admin panel (via script-firebase.js dispatching 'storage' event or direct localStorage updates)
window.addEventListener('storage', (e) => {
  if (e.key === 'ecostay_site_data' || e.key === 'siteConfig') {
    console.log(' Configuration changed! Reloading data...');
    loadSiteData(); // Re-fetch from localStorage and re-render
  }
});

// Also listen for custom event dispatched by same-window script-firebase.js
window.addEventListener('siteConfigUpdated', (e) => {
  console.log(' Config updated via custom event. Reloading...');
  loadSiteData();
});
