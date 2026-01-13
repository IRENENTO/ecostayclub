/* --- CONFIGURATION --- */
const EMAILJS_SERVICE_ID = "default_service"; 
const EMAILJS_TEMPLATE_ID = "template_123456";

// Initialize Global Site Data if not exists
if (!localStorage.getItem('ecostay_site_data')) {
    const initialData = {
        mission: {
            title: "Our Mission & Vision",
            sub: "Driving Sustainable Change from the Heart of Rwanda",
            text_mission: "To transform university campuses into green havens through student-led planting and conservation.",
            text_vision: "A Rwanda where every student is a guardian of biodiversity."
        },
        impact: {
            trees: 1240,
            carbon: 31000,
            members: 450
        },
        team: [
            { name: "Niyigaba Heritier", role: "Founder", dept: "UR - CST (Spatial Planning)", image: "img/niyigaba heritier founder tel number +250 784 095 661.jpeg", phone: "+250 784 095 661", email: "niyigaba@ecostay.org" },
            { name: "Byukusenge Rebecca", role: "President", dept: "UR - CST (Spatial Planning)", image: "img/byukusenge rebecca tel number +250 798 741 856 role president.jpeg", phone: "+250 798 741 856" },
            { name: "Niyogisubizo Jean Dedier", role: "General Coordinator", dept: "UR - CST (Spatial Planning)", image: "img/niyogisubizo jean dedier tel nbr+250 722 227 775 role general coordinator.jpeg", phone: "+250 722 227 775" },
            { name: "Uwase Diane", role: "General Secretary", dept: "UR - CST (Spatial Planning)", image: "img/uwase diane tel number +250 793 105 787 role secretair.jpeg", phone: "+250 793 105 787" },
            { name: "Irene Irumva", role: "IT & Communication", dept: "INES Ruhengeri (Software Engineering)", image: "img/irene irumva role it and communication tel number 0787427123.jpg", phone: "+250 787 427 123" },
            { name: "Niyonsenga Claudine", role: "Accountant", dept: "UR - CST (Spatial Planning)", image: "img/Niyonsenga claudine tel number +250 798 268 955 accountant.jpeg", phone: "+250 798 268 955" },
            { name: "Prof. Gaspard Rwanyiziri", role: "Faculty Advisor", dept: "UR - CST (Spatial Planning)", image: "img/adviser prof gaspard RWANYIZIRI tel nber +250 788 681 438.jpeg", phone: "+250 788 681 438" }
        ],
        testimonials: [
            { text: "Leading EcoStay has been an incredible journey of growth and impact. Seeing students take ownership of environmental initiatives is truly inspiring.", name: "Byukusenge Rebecca", role: "President, UR - CST (Spatial Planning)", image: "img/byukusenge rebecca tel number +250 798 741 856 role president.jpeg" },
            { text: "As our IT lead, I've been able to blend my tech skills with environmental activism. The digital tools we've implemented have helped us reach more students than ever before.", name: "Irene Irumva", role: "IT & Communication, INES Ruhengeri (Software Engineering)", image: "img/irene irumva role it and communication tel number 0787427123.jpg" }
        ],
        events: [
            { title: "Campus Forest Initiative", date: "OCT 05, 2026", location: "UR-Huye Campus", desc: "Planted over 500 indigenous trees to restore the campus green belt.", status: "Completed", image: "img/events 1.jpeg", impact: "We successfully restored 2 hectares of land with the help of 100 student volunteers." },
            { title: "Umuganda for Nature", date: "NOV 12, 2026", location: "Kigali Neighborhoods", desc: "Community cleaning and landscape restoration in local neighborhoods.", status: "Upcoming", image: "img/events 2.jpeg" }
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

// ONE-TIME SYSTEM RESET (Clears old users to fix login issues)
if (!localStorage.getItem('system_reset_jan13')) {
    localStorage.removeItem('ecostay_users');
    localStorage.removeItem('ecostay_user');
    localStorage.removeItem('ecostay_admin');
    localStorage.setItem('system_reset_jan13', 'true');
    console.log("System storage reset successfully.");
}

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.error('Service Worker registration failed', err));
    
    // Initialize Map
    initMap();
    loadSiteData();
  });
}

function loadSiteData() {
    let data = JSON.parse(localStorage.getItem('ecostay_site_data'));
    if (!data) return;

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
    container.innerHTML = historyData.map(item => `
        <div class="card">
          <h3>${item.year}</h3>
          <h4 style="color: var(--primary); margin-bottom: 10px;">${item.title}</h4>
          <p>${item.desc}</p>
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
    <div style="display: flex; align-items: center; margin-bottom: 1rem;">
      <img src="img/ecostay-logo.png" alt="EcoStay" style="height: 30px; margin-right: 10px;">
      <div class="social-icons" style="display: flex; gap: 8px; margin-left: 1rem;">
        <a href="${footerData.socials.twitter}" target="_blank" style="color: #fff;"><i class="fa-brands fa-twitter"></i></a>
        <a href="${footerData.socials.facebook}" target="_blank" style="color: #fff;"><i class="fa-brands fa-facebook-f"></i></a>
        <a href="${footerData.socials.instagram}" target="_blank" style="color: #fff;"><i class="fa-brands fa-instagram"></i></a>
      </div>
    </div>
    
    <div style="display: flex; gap: 20px; font-size: 0.85rem; margin-bottom: 1rem;">
      <div style="display: flex; align-items: center;">
        <i class="fa-solid fa-phone" style="margin-right: 8px; color: #4CAF50;"></i>
        <a href="tel:${footerData.phone.replace(/\s/g, '')}" style="color: #fff; text-decoration: none;">${footerData.phone}</a>
      </div>
      <div style="display: flex; align-items: center;">
        <i class="fa-solid fa-envelope" style="margin-right: 8px; color: #4CAF50;"></i>
        <a href="mailto:${footerData.email}" style="color: #fff; text-decoration: none;">${footerData.email}</a>
      </div>
      <div style="display: flex; align-items: center;">
        <i class="fa-solid fa-location-dot" style="margin-right: 8px; color: #4CAF50;"></i>
        <span>${footerData.address}</span>
      </div>
    </div>
    `;
}

function renderTeam(teamData) {
    const container = document.getElementById('team-container');
    if (!container || !teamData) return;
    container.innerHTML = teamData.map(member => `
        <div class="card team-card">
          <div class="team-image" style="background-image: url('${member.image}');"></div>
          <div class="team-info">
            <h3>${member.name}</h3>
            <p class="role">${member.role}</p>
            <p class="dept">${member.dept}</p>
            <div class="team-socials">
              ${member.phone ? `<a href="tel:${member.phone}" title="Call"><i class="fa-solid fa-phone"></i></a>` : ''}
              ${member.phone ? `<a href="https://wa.me/${member.phone.replace(/\+/g, '').replace(/\s/g, '')}" target="_blank"><i class="fa-brands fa-whatsapp"></i></a>` : ''}
              ${member.email ? `<a href="mailto:${member.email}"><i class="fa-solid fa-envelope"></i></a>` : ''}
            </div>
          </div>
        </div>
    `).join('');
}

function renderTestimonials(testiData) {
    const container = document.getElementById('testimonials-container');
    if (!container || !testiData) return;
    container.innerHTML = testiData.map(testi => `
        <div class="card testimonial-card">
          <p class="quote">"${testi.text}"</p>
          <div class="user-info">
            <div class="testimonial-image" style="background-image: url('${testi.image}');"></div>
            <div>
              <h4>${testi.name}</h4>
              <span>${testi.role}</span>
            </div>
          </div>
        </div>
    `).join('');
}

function renderEvents(eventsData) {
    const container = document.getElementById('events-container');
    if (!container || !eventsData) return;
    container.innerHTML = eventsData.map(event => `
        <div class="card event-card">
          <div class="status-badge ${(event.status || 'Upcoming').toLowerCase()}">
            <i class="fa-solid ${event.status === 'Completed' ? 'fa-check' : event.status === 'Upcoming' ? 'fa-clock' : 'fa-xmark'}"></i> 
            <span>${event.status}</span>
          </div>
          <div class="card-image" style="background-image: url('${event.image || 'img/event-placeholder.jpg'}');"></div>
          <div class="card-content">
            <div class="date">${event.date}</div>
            <h3>${event.title}</h3>
            <p class="location"><i class="fa-solid fa-map-marker-alt"></i> ${event.location}</p>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin: 10px 0;">${event.desc}</p>
            ${event.status === 'Completed' 
                ? `<button class="btn outline full-width" onclick="openReportModal('${event.title.replace(/'/g, "\\'")}', '${(event.impact || '').replace(/'/g, "\\'")}')">View Impact</button>`
                : event.status === 'Upcoming'
                ? `<button class="btn primary full-width" onclick="openEventRegModal('${event.title.replace(/'/g, "\\'")}')">Register to Join</button>`
                : `<button class="btn outline full-width" disabled style="opacity: 0.6; cursor: not-allowed;">Unavailable</button>`
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
    mission_title: "Our Mission & Vision", mission_sub: "Driving Sustainable Change from the Heart of Rwanda", card_mission: "Our Mission", text_mission: "To transform university campuses into green havens through student-led planting and conservation.", card_vision: "Our Vision", text_vision: "A Rwanda where every student is a guardian of biodiversity.",
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
    footer_desc: "Follow our journey and stay updated on our latest green initiatives across Rwanda.",
    footer_rights: "© 2026 EcoStay Club Rwanda. All rights reserved.",
    footer_reach: "Connect With Us",
    auth_title: "Account Access", tab_login: "Login", tab_register: "Register", label_email: "Email", label_pass: "Password", label_confirm_pass: "Confirm Password", label_name: "Full Name", btn_create_acc: "Create Account",
    hint_photo: "Click camera to update photo", btn_save: "Save Changes", btn_submit_app: "Submit Application",
    label_whatsapp: "WhatsApp Number", label_faculty: "Faculty / Department", label_year: "Year of Study", label_interests: "Areas of Interest",
    dashboard_welcome: "Welcome back", dashboard_impact: "Ready to make an impact?", dashboard_desc: "Join EcoStay Club today and be part of a vibrant community of students leading climate action.",
    impact_title: "Our Collective Impact", trees_planted: "Trees Planted", carbon_saved: "CO2 Sequestered (kg)", active_members: "Active Guardians",
    resource_hub_title: "Green Resource Hub", resource_hub_sub: "Learn how to be a Guardian of Nature",
    resource_1_title: "Nursery Management", resource_1_desc: "A guide to starting and maintaining student-led nurseries.",
    resource_2_title: "Native Species Guide", resource_2_desc: "Learn about the trees that belong in Rwanda's ecosystems.",
    resource_3_title: "Climate Advocacy", resource_3_desc: "How to speak up for the planet in your local community.",
    map_title: "Reforestation Map", map_sub: "Explore our active restoration sites across Rwanda",
    btn_join: "Join", btn_close: "Close", btn_confirm: "Confirm",
    label_phone: "Phone Number", label_school: "School / University", label_motivation: "Why do you want to join?",
    toast_welcome: "Welcome back!", toast_invalid_auth: "Invalid email or password.", toast_email_taken: "Email already registered.",
    toast_reg_success: "Registration successful!", toast_login_first: "Please login or register first.",
    toast_fill_all: "Please fill in all required fields.", toast_invalid_phone: "Please enter a valid phone number.",
    toast_invalid_email: "Please enter a valid email address.", toast_sending: "Sending Application...",
    toast_app_sent: "Thank you! Your application has been submitted.", toast_app_fail: "Failed to submit application. Please try again.",
    toast_pass_short: "Password must be at least 8 characters long.", toast_pass_mismatch: "Passwords do not match."
  },
  fr: {
    nav_home: "Accueil", nav_about: "À propos", nav_mission: "Mission & Vision", 
    nav_history: "Notre Histoire", nav_who: "Qui sommes-nous", nav_testimonials: "Témoignages",
    nav_donate: "Faire un don", nav_events: "Événements", nav_team: "Équipe", nav_contact: "Contact",
    btn_darkmode: "Mode Sombre", btn_login_signup: "Connexion / Inscription", btn_login: "Connexion", btn_logout: "Déconnexion", btn_edit_profile: "Modifier Profil",
    hero_title: "Étudiants EcoStay pour l'Action Climatique", hero_desc: "Rejoignez le premier réseau étudiant du Rwanda dédié à la biodiversité et au reboisement des campus.", hero_btn: "Rejoindre EcoStay",
    mission_title: "Mission & Vision", mission_sub: "Impulser un changement durable au cœur du Rwanda", card_mission: "Notre Mission", text_mission: "Transformer les campus universitaires en havres de paix grâce à la plantation et à la conservation menées par les étudiants.", card_vision: "Notre Vision", text_vision: "Un Rwanda où chaque étudiant est un gardien de la biodiversité.",
    journey_title: "Our Journey", journey_sub: "D'une graine d'idée à un mouvement national",
    year_2024_title: "La Germination", year_2024_desc: "Le concept est né à l'Université du Rwanda par des étudiants déterminés à restaurer la biodiversité.",
    year_2025_title: "Enracinement & Croissance", year_2025_desc: "Nous avons établi des pépinières gérées par les étudiants et collaboré avec les communautés locales.",
    year_2026_title: "Expansion", year_2026_desc: "Extension de nos hubs EcoStay aux universités de tout le pays.",
    who_desc: "Nous sommes un groupe diversifié d'étudiants, de professeurs et de militants écologistes de l'Université du Rwanda, unis par un seul but : protéger notre planète.",
    team_sub: "Les esprits passionnés derrière EcoStay",
    role_president: "Président", role_vice: "Vice-président", role_secretary: "Secrétaire général",
    role_treasurer: "Comptable", role_coordinator: "Coordinateur général", role_comm: "IT & Communication",
    role_it: "Chef IT", role_logistics: "Responsable logistique", role_advisor: "Conseiller pédagogique", role_legal: "Conseiller juridique", role_founder: "Fondateur",
    test_1: '"EcoStay m\'a donné la plateforme pour appliquer mes connaissances théoriques."',
    test_2: '"Les opportunités de réseautage ont été incroyables."',
    donate_title: "Soutenez notre impact", donate_box_title: "Aidez-nous à verdir le Rwanda", donate_box_desc: "Votre contribution soutient directement la plantation d'arbres et l'entretien des pépinières.",
    donate_momo: "Choisir le montant (Mobile Money)", donate_pay_btn: "Payer avec Mobile Money",
    activities_title: "Nos Activités", activities_sub: "Action concrète pour un Rwanda plus vert",
    status_done: "Terminé", status_pending: "À venir", status_canceled: "Annulé",
    event_1_title: "Initiative Forêt Campus", event_1_desc: "Événement de plantation massive d'arbres axé sur la restauration des espèces indigènes.",
    event_2_title: "Umuganda pour la Nature", event_2_desc: "Nettoyage communautaire et restauration paysagère dans les quartiers locaux.",
    event_3_title: "Atelier Éco : Vie Durable", event_3_desc: "Apprendre à réduire les déchets et à utiliser les énergies renouvelables.",
    btn_register_event: "S'inscrire pour participer",
    footer_desc: "Suivez notre parcours et restez informés de nos dernières initiatives écologiques au Rwanda.",
    footer_rights: "© 2026 EcoStay Club Rwanda. Tous droits réservés.",
    footer_reach: "Contactez-nous",
    auth_title: "Accès Compte", tab_login: "Connexion", tab_register: "S'inscrire", label_email: "Email", label_pass: "Mot de passe", label_confirm_pass: "Confirmez le mot de passe", label_name: "Nom Complet", btn_create_acc: "Créer un compte",
    hint_photo: "Cliquez pour changer la photo", btn_save: "Enregistrer", btn_submit_app: "Envoyer demande",
    label_whatsapp: "Numéro WhatsApp", label_faculty: "Faculté / Département", label_year: "Année d'étude", label_interests: "Centres d'intérêt",
    dashboard_welcome: "Bon retour !", dashboard_impact: "Prêt à avoir un impact ?", dashboard_desc: "Rejoignez EcoStay Club dès aujourd'hui et faites partie d'une communauté dynamique d'étudiants.",
    impact_title: "Notre Impact Collectif", trees_planted: "Arbres Plantés", carbon_saved: "CO2 Séquestré (kg)", active_members: "Gardiens Actifs",
    resource_hub_title: "Centre de Ressources Vertes", resource_hub_sub: "Apprenez à devenir un gardien de la nature",
    resource_1_title: "Gestion des Pépinières", resource_1_desc: "Un guide pour démarrer et entretenir des pépinières gérées par des étudiants.",
    resource_2_title: "Guide des Espèces Indigènes", resource_2_desc: "Découvrez les arbres qui appartiennent aux écosystèmes du Rwanda.",
    resource_3_title: "Plaidoyer Climatique", resource_3_desc: "Comment s'exprimer pour la planète dans votre communauté locale.",
    map_title: "Carte de Reboisement", map_sub: "Explorez nos sites de restauration actifs à travers le Rwanda",
    btn_join: "Rejoindre", btn_close: "Fermer", btn_confirm: "Confirmer",
    label_phone: "Numéro de téléphone", label_school: "École / Université", label_motivation: "Pourquoi voulez-vous nous rejoindre ?",
    toast_welcome: "Bon retour !", toast_invalid_auth: "Email ou mot de passe invalide.", toast_email_taken: "Cet email est déjà enregistré.",
    toast_reg_success: "Inscription réussie !", toast_login_first: "Veuillez vous connecter ou vous inscrire d'abord.",
    toast_fill_all: "Veuillez remplir tous les champs obligatoires.", toast_invalid_phone: "Veuillez entrer un numéro de téléphone valide.",
    toast_invalid_email: "Veuillez entrer une adresse email valide.", toast_sending: "Envoi de la demande...",
    toast_app_sent: "Merci ! Votre demande a été soumise.", toast_app_fail: "Échec de l'envoi. Veuillez réessayer.",
    toast_pass_short: "Le mot de passe doit contenir au moins 8 caractères.", toast_pass_mismatch: "Les mots de passe ne correspondent pas."
  },
  rw: {
    nav_home: "Ahabanza", nav_about: "Turi Bande", nav_mission: "Intego & Icyerekezo", 
    nav_history: "Amateka Yacu", nav_who: "Abo Turi Bo", nav_testimonials: "Ubuhamya",
    nav_donate: "Tanga Inkunga", nav_events: "Ibikorwa", nav_team: "Ikipe yacu", nav_contact: "Tuvugishe",
    btn_darkmode: "Ibara ry'ijoro", btn_login_signup: "Injira / Iyandikishe", btn_login: "Injira", btn_logout: "Sohoka", btn_edit_profile: "Hindura Umwirondoro",
    hero_title: "Abanyeshuri ba EcoStay ku Ihindagurika ry'Ikirere", hero_desc: "Injira mu rugaga rw'abanyeshuri ruyoboye abandi mu Rwanda mu kurengera ibidukikije.", hero_btn: "Injira Muri EcoStay",
    mission_title: "Intego & Icyerekezo", mission_sub: "Guhindura ibintu mu mutima w'u Rwanda", card_mission: "Intego Yacu", text_mission: "Guhindura amakampusi ya kaminuza ahantu hacyeye binyuze mu gutera ibiti no kubibungabunga.", card_vision: "Icyerekezo Cyacu", text_vision: "U Rwanda aho buri munyeshuri ari umurinzi w'urusobe rw'ibunyamaswa n'ibimera.",
    journey_title: "Amateka Yacu", journey_sub: "Kuva ku gitekerezo kugeza ku muryango mugari w'igihugu",
    year_2024_title: "Gutangira", year_2024_desc: "Igitekerezo cyavutse muri Kaminuza y'u Rwanda cyatangijwe n'abanyeshuri bashakaga gusubiranya ibidukikije.",
    year_2025_title: "Gushinga Imizi", year_2025_desc: "Twashizeho pepiniyeri ziyoborwa n'abanyeshuri kandi dukorana n'abaturage.",
    year_2026_title: "Kwambuka Imbibi", year_2026_desc: "Kwongera EcoStay Hubs mu zindi kaminuza mu gihugu hose.",
    who_desc: "Turi itsinda ry'abanyeshuri, abarimu, n'abaharanira kurengera ibidukikije bo muri Kaminuza y'u Rwanda.",
    team_sub: "Abantu bitanga inyuma ya EcoStay",
    role_president: "Perezida", role_vice: "Visi-Perezida", role_secretary: "Umunyamabanga Mukuru",
    role_treasurer: "Umucungamari", role_coordinator: "Umuhuzabikorwa Mukuru", role_comm: "Ikoranabuhanga n'Itumanaho",
    role_it: "Ushinzwe Ikoranabuhanga", role_logistics: "Ushinzwe Ibikoresho", role_advisor: "Umujyanama w'Abarimu", role_legal: "Ushinzwe Amateka", role_founder: "Uwabitangije",
    test_1: '"EcoStay yampaye amahirwe yo gushyira mu bikorwa ibyo nize mu ishuri."',
    test_2: '"Amahirwe yo kumenyana n\'abandi yari ahebuje."',
    donate_title: "Shyigikira Ibikorwa Byacu", donate_box_title: "Duashe gutunganya u Rwanda", donate_box_desc: "Inkunga yawe idufasha gutera ibiti no kwita kuri pepiniyeri zacu.",
    donate_momo: "Hitamo Umubare (Mobile Money)", donate_pay_btn: "Ishyura na Mobile Money",
    activities_title: "Ibikorwa Byacu", activities_sub: "Ibikorwa by'amaboko ku Rwanda rumboshye",
    status_done: "Byarangiye", status_pending: "Ibiri imbere", status_canceled: "Byasubitswe",
    event_1_title: "Gushyira Amashyamba muri Kaminuza", event_1_desc: "Igikorwa cyo gutera ibiti byinshi hibandwa ku by'umwimerere.",
    event_2_title: "Umuganda ku bw'Isi", event_2_desc: "Isuku rusange no gusana ibidukikije mu duce dutandukanye.",
    event_3_title: "Inyigisho ku Kubaho neza", event_3_desc: "Kwiga kugabanya imyanda no gukoresha ingufu zisubira.",
    btn_register_event: "Iyandikishe uze dufatanye",
    btn_view_impact: "Reba ibyagezweho",
    footer_desc: "Kurikira urugendo rwacu kandi umenye amakuru mashya ku bikorwa byacu mu Rwanda.",
    footer_rights: "© 2026 EcoStay Club Rwanda. Uburenganzira bwose burasigasira.",
    footer_reach: "Tuvugishe",
    auth_title: "Kwinjira muri Konti", tab_login: "Injira", tab_register: "Iyandikishe", label_email: "Imeli", label_pass: "Ijambo ry'ibanga", label_confirm_pass: "Subiramo Ijambo ry'ibanga", label_name: "Amazina Yose", btn_create_acc: "Fungura Konti",
    hint_photo: "Kanda kamera uhindure ifoto", btn_save: "Bika Impinduka", btn_submit_app: "Ohereza Ubusabe",
    label_whatsapp: "Nimero ya WhatsApp", label_faculty: "Ishami / Fakarite", label_year: "Umwaka w'amashuri", label_interests: "Ibyo ukunda",
    dashboard_welcome: "Murakaza neza", dashboard_impact: "Witeguye guhindura ibintu ?", dashboard_desc: "Injira muri EcoStay Club uyu munsi ube mu muryango w'abanyeshuri biyemeje kurengera ibidukikije.",
    impact_title: "Umumusaruro wacu twese", trees_planted: "Ibiti Bimaze Guterwa", carbon_saved: "CO2 Yakuwe mu Kirere (kg)", active_members: "Abanyamuryango Bakora",
    resource_hub_title: "Isomero ryo Kubungabunga Ibidukikije", resource_hub_sub: "Yigire uko waba Umurinzi wa Kamere",
    resource_1_title: "Gucunga Pepiniyeri", resource_1_desc: "Igitabo kigufasha gutangira no kwita kuri pepiniyeri ziyoborwa n'abanyeshuri.",
    resource_2_title: "Ibiti gakondo by'u Rwanda", resource_2_desc: "Menya amoko y'ibiti biboneka mu rusobe rw'ibidukikije by'u Rwanda.",
    resource_3_title: "Guharanira Ikirere", resource_3_desc: "Uko wavugira isi mu gace utuyemo.",
    map_title: "Ikarita y'Aho Dutera Ibiti", map_sub: "Reba aho EcoStay ikorera mu Rwanda hose",
    btn_join: "Injira", btn_close: "Funga", btn_confirm: "Emeza",
    label_phone: "Nimero ya Telefone", label_school: "Ishuri / Kaminuza", label_motivation: "Kubera iki ushaka kwinjira?",
    toast_welcome: "Murakaza neza !", toast_invalid_auth: "Imeli cyangwa ijambo ry'ibanga ntabwo ari byo.", toast_email_taken: "Iyi meli isanzwe ikoreshwa.",
    toast_reg_success: "Kwiyandikisha byagenze neza !", toast_login_first: "Banza winjire muri konti yawe.",
    toast_fill_all: "Uzuza ibyo usabwa byose.", toast_invalid_phone: "Shyiramo nimero ya telefone yo mu Rwanda.",
    toast_invalid_email: "Shyiramo imeli yo mu Rwanda.", toast_sending: "Turimo kohereza ubusabe bwawe...",
    toast_app_sent: "Murakoze! Ubusabe bwanyu bwakiriwe.", toast_app_fail: "Kohereza ubusabe ntabwo byakunze. Ongera ugerageze.",
    toast_pass_short: "Ijambo ry'ibanga rigomba kuba rifite inyuguti 8.", toast_pass_mismatch: "Amagambo y'ibanga ntabwo ahuye."
  }
};

function setLanguage(lang) {
  const elements = document.querySelectorAll('[data-lang]');
  elements.forEach(el => {
    const key = el.getAttribute('data-lang');
    if (translations[lang][key]) {
      el.innerText = translations[lang][key];
    }
  });

  document.querySelectorAll('.lang-opt').forEach(btn => btn.classList.remove('active-lang'));
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  
  const langIndex = lang === 'en' ? 0 : lang === 'fr' ? 1 : 2;
  const desktopOpts = document.querySelectorAll('.lang-opt');
  if(desktopOpts[langIndex]) desktopOpts[langIndex].classList.add('active-lang');
  
  const mobileOpts = document.querySelectorAll('.lang-btn');
  if(mobileOpts[langIndex]) mobileOpts[langIndex].classList.add('active');

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
  const translatedMessage = translations[lang][message] || message;
  
  const container = document.getElementById('toast-container');
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
  document.getElementById(id).style.display = "block"; 
  closeMobileMenu(); 
}
function closeModal(id) { document.getElementById(id).style.display = "none"; }
window.onclick = e => { if (e.target.classList.contains('modal')) e.target.style.display = "none"; };

function switchTab(tab, isLanding = false) {
  const prefix = isLanding ? "landing" : "";
  const loginForm = document.getElementById(isLanding ? "landingLoginForm" : "loginForm");
  const regForm = document.getElementById(isLanding ? "landingRegisterForm" : "registerForm");
  
  // Select tabs within the correct context
  const container = isLanding ? document.getElementById("auth-landing") : document.getElementById("authModal");
  const btns = container.querySelectorAll(".tab-btn");

  if (tab === 'login') { 
    loginForm.style.display = "block"; 
    regForm.style.display = "none"; 
    btns[0].classList.add("active"); 
    btns[1].classList.remove("active"); 
  } 
  else { 
    loginForm.style.display = "none"; 
    regForm.style.display = "block"; 
    btns[0].classList.remove("active"); 
    btns[1].classList.add("active"); 
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
  const desktopGuest = document.getElementById("guest-actions");
  const desktopUser = document.getElementById("user-actions");
  const mobileGuest = document.getElementById("mobile-guest");
  const mobileUser = document.getElementById("mobile-user");
  const dashboard = document.getElementById("dashboard");
  const hero = document.getElementById("home");
  
  const authLanding = document.getElementById("auth-landing");
  const mainContent = document.getElementById("main-content");

  if (userStr) {
    const user = JSON.parse(userStr);
    const avatarSrc = getSafeAvatar(user);

    if(authLanding) authLanding.style.display = "none";
    if(mainContent) mainContent.style.display = "block";

    // Refresh Map
    setTimeout(() => {
      initMap();
      if (leafletMap) leafletMap.invalidateSize();
    }, 100);

    desktopGuest.style.display = "none"; desktopUser.style.display = "block";
    document.getElementById("nav-name").innerText = user.name.split(" ")[0];
    document.getElementById("nav-avatar").src = avatarSrc;
    document.getElementById("menu-name").innerText = user.name;
    document.getElementById("menu-email").innerText = user.email;
    
    if (dashboard) {
        dashboard.style.display = "block";
        const lang = localStorage.getItem('lang') || 'en';
        const welcomePrefix = translations[lang]['dashboard_welcome'] || "Welcome back";
        document.getElementById("dashboard-welcome").innerText = `${welcomePrefix}, ${user.name}!`;
    }
    if (hero) hero.style.display = "none";

    // Hide Join Buttons if already a member
    const joinBtns = document.querySelectorAll('button[onclick*="joinModal"]');
    if (user.is_member) {
      joinBtns.forEach(btn => btn.style.display = "none");
      // If there's a specific "Join Hub" card on dashboard, we might want to hide the whole container or change text
    } else {
      joinBtns.forEach(btn => btn.style.display = "inline-flex");
    }

    if(mobileGuest) mobileGuest.style.display = "none";
    if(mobileUser) {
      mobileUser.style.display = "block";
      document.getElementById("mobile-name").innerText = user.name;
      document.getElementById("mobile-email").innerText = user.email;
      document.getElementById("mobile-avatar").src = avatarSrc;
    }
  } else {
    if(authLanding) authLanding.style.display = "flex";
    if(mainContent) mainContent.style.display = "none";

    desktopGuest.style.display = "flex"; desktopUser.style.display = "none";
    if(mobileGuest) mobileGuest.style.display = "block";
    if(mobileUser) mobileUser.style.display = "none";
    if(dashboard) dashboard.style.display = "none";
    if(hero) hero.style.display = "flex";
  }
  document.body.style.display = "block"; // Show body after determining state
}

// LOGIN
const handleLogin = (email, password) => {
  const loginEmail = email.trim().toLowerCase();
  const loginPass = password.trim();

  // DEBUG LOG (Safe to remove after testing)
  console.log("Attempting login with:", loginEmail, loginPass);

  // --- Admin Bypass ---
  if(loginEmail === "admin@ecostay.rw" && loginPass === "admin123") {
    console.log("Admin match found!");
    localStorage.setItem("ecostay_admin", "true");
    showToast("Welcome Admin!");
    window.location.href = "admin.html";
    return true;
  }

  const users = JSON.parse(localStorage.getItem("ecostay_users") || "[]");
  const user = users.find(u => u.email.trim().toLowerCase() === loginEmail && u.password === password);

  if(user) { 
    localStorage.setItem("ecostay_user", JSON.stringify({ name: user.name, email: user.email, avatar: user.avatar, is_member: user.is_member || false }));
    showToast("toast_welcome"); 
    checkLogin(); 
    closeModal('authModal'); 
    return true;
  } 
  showToast("toast_invalid_auth", "error"); 
  return false;
};

document.getElementById("loginForm").addEventListener("submit", (e) => { 
  e.preventDefault(); 
  handleLogin(document.getElementById("loginEmail").value.trim(), document.getElementById("loginPass").value);
});

if(document.getElementById("landingLoginForm")) {
  document.getElementById("landingLoginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    handleLogin(document.getElementById("landEmail").value.trim(), document.getElementById("landPass").value);
  });
}

// REGISTER
const handleRegister = (name, email, password, confirmPass, formElement) => {
    // Validation
    if (!name || !email || !password || !confirmPass) {
        showToast("toast_fill_all", "error");
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast("toast_invalid_email", "error");
        return;
    }
    if (password.length < 8) {
        showToast("toast_pass_short", "error");
        return;
    }
    if (password !== confirmPass) {
        showToast("toast_pass_mismatch", "error");
        return;
    }

    const users = JSON.parse(localStorage.getItem("ecostay_users") || "[]");
    if (users.find(u => u.email === email)) {
        showToast("toast_email_taken", "error");
        return;
    }

    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1A4D2E&color=fff`;
    const newUser = { name, email, password, avatar: defaultAvatar, joined: new Date().toISOString() };
    
    users.push(newUser);
    localStorage.setItem("ecostay_users", JSON.stringify(users));
    localStorage.setItem("ecostay_user", JSON.stringify({ name: newUser.name, email: newUser.email, avatar: newUser.avatar }));
    
    showToast("toast_reg_success");
    const modal = document.getElementById("authModal");
    if (modal) modal.style.display = "none";
    checkLogin();
    formElement.reset();
};

document.getElementById("registerForm").addEventListener("submit", (e) => { 
    e.preventDefault();
    handleRegister(
      document.getElementById("regName").value.trim(),
      document.getElementById("regEmail").value.trim(),
      document.getElementById("regPass").value,
      document.getElementById("regConfirmPass").value,
      e.target
    );
});

if(document.getElementById("landingRegisterForm")) {
  document.getElementById("landingRegisterForm").addEventListener("submit", (e) => {
    e.preventDefault();
    handleRegister(
      document.getElementById("landRegName").value.trim(),
      document.getElementById("landRegEmail").value.trim(),
      document.getElementById("landRegPass").value,
      document.getElementById("landRegConfirmPass").value,
      e.target
    );
  });
}

// EDIT PROFILE
function openEditProfile() { 
  const user = JSON.parse(localStorage.getItem("ecostay_user")); 
  if(user) { 
    document.getElementById("editName").value = user.name; 
    document.getElementById("editEmail").value = user.email; 
    document.getElementById("editProfilePreview").src = getSafeAvatar(user); 
    openModal('editProfileModal'); 
  } 
}

let compressedAvatarData = null;
document.getElementById("editProfileImg").addEventListener("change", function() {
    if (this.files && this.files[0]) {
        if (!this.files[0].type.match('image.*')) { showToast("Select an image file.", "error"); return; }
        showToast("Processing image...", "success");
        compressImage(this.files[0]).then(base64 => {
            compressedAvatarData = base64;
            document.getElementById("editProfilePreview").src = base64;
        }).catch(() => showToast("Error processing image.", "error"));
    }
});

document.getElementById("editProfileForm").addEventListener("submit", (e) => { 
  e.preventDefault(); 
  const name = document.getElementById("editName").value; 
  const email = document.getElementById("editEmail").value;
  const user = JSON.parse(localStorage.getItem("ecostay_user"));
  const finalAvatar = compressedAvatarData || user.avatar; 

  try {
      localStorage.setItem("ecostay_user", JSON.stringify({ name, email, avatar: finalAvatar })); 
      checkLogin(); closeModal('editProfileModal'); showToast("Profile Updated!"); 
  } catch (err) { showToast("Storage full! Try a smaller photo.", "error"); }
});

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
      setDoc: firestoreModule.setDoc
    };

    return window._ecostay_fs;
  } catch (err) {
    console.error('Firestore init error:', err);
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
}

// --- UI: Join email hint (updates as user types and when modal opens) ---
(function() {
  const emailInput = document.getElementById('joinEmail');
  const hint = document.getElementById('joinEmailHint');
  const valueEl = document.getElementById('joinEmailValue');

  if (!emailInput || !hint || !valueEl) return;

  const updateHint = () => {
    const val = emailInput.value.trim();
    if (val && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      valueEl.textContent = val;
      hint.style.display = 'block';
    } else {
      hint.style.display = 'none';
    }
  };

  emailInput.addEventListener('input', updateHint);

  // Update initially (in case browser autofills)
  updateHint();

  // Also update when join modal opens (observe style changes)
  const modal = document.getElementById('joinModal');
  if (modal) {
    const observer = new MutationObserver(() => { if (modal.style.display === 'block') updateHint(); });
    observer.observe(modal, { attributes: true, attributeFilter: ['style'] });
  }
})();

// JOIN CLUB FORM SUBMISSION (Enhanced)
document.getElementById('joinClubForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Extract inputs
  const fullName = document.getElementById('joinName').value.trim();
  const phone = document.getElementById('joinWhatsApp').value.trim();
  const email = document.getElementById('joinEmail').value.trim();
  const faculty = document.getElementById('joinFaculty').value.trim();
  const year = document.getElementById('joinYear').value.trim();
  const interests = document.getElementById('joinInterests').value.trim();
  const formEl = e.target;

  // Basic validation
  if (!fullName || !email) {
    showToast('toast_fill_all', 'error');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('toast_invalid_email', 'error');
    return;
  }
  if (phone && !/^[0-9+\s\-()]{7,20}$/.test(phone)) {
    showToast('toast_invalid_phone', 'error');
    return;
  }

  showToast('toast_sending', 'success');

  // Prepare payload for Firestore
  const memberData = {
    fullName,
    email,
    phone: phone || null,
    faculty: faculty || null,
    year: year || null,
    interests: interests || null,
    joinedAt: null // will set serverTimestamp when saving
  };

  // Try to save to Firestore first (non-blocking for UX but prefer to complete before sending email)
  let firestoreSaved = false;
  let docRefId = null;

  try {
    const fs = await getFirestoreHelpers();
    const colRef = fs.collection(fs.db, 'members');
    const added = await fs.addDoc(colRef, { ...memberData, joinedAt: fs.serverTimestamp() });
    firestoreSaved = true;
    docRefId = added.id;
    console.log('Saved member to Firestore with ID:', docRefId);
  } catch (err) {
    console.warn('Could not save to Firestore:', err);
    // Continue — we still attempt to send email and persist local state
  }

  // Persist locally so returning users are recognised
  persistLocalUser(fullName, email);

  // Send welcome email via EmailJS with variables fullName and email
  try {
    // --- EmailJS: send welcome email ---
    // Important: set from_email to our club address and to_email to the user's submitted email.
    // These template variables must match the variables configured in your EmailJS template.
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_email: 'ecostayrwanda@gmail.com', // Sender (fixed)
      to_email: email,                        // Receiver (dynamic from form)
      fullName: fullName,
      email: email
    });

    showToast('Joined successfully! Check your email.');

    // Optionally attach Firestore doc id to local user record for later reference
    if (firestoreSaved && docRefId) {
      const users = JSON.parse(localStorage.getItem('ecostay_users') || '[]');
      const u = users.find(u => u.email === email);
      if (u) { u.firestoreId = docRefId; localStorage.setItem('ecostay_users', JSON.stringify(users)); }
    }

    checkLogin();
    closeModal('joinModal');
    formEl.reset();
  } catch (err) {
    console.error('EmailJS send error:', err);
    // Even if email fails, we consider the user joined and saved locally for UX
    showToast('Joined! (Email service unavailable)', 'success');
    checkLogin();
    closeModal('joinModal');
    formEl.reset();
  }
});
function logout() { if(confirm("Logout?")) { localStorage.removeItem("ecostay_user"); checkLogin(); showToast("Logged out."); } }

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
function openReportModal(title, content) {
    document.getElementById("reportTitle").innerText = title;
    document.getElementById("reportContent").innerText = content;
    openModal("reportModal");
}

function openEventRegModal(eventTitle) {
    document.getElementById("eventRegTitle").innerText = `Register for: ${eventTitle}`;
    openModal("eventRegModal");
}

if(document.getElementById("eventRegForm")) {
    document.getElementById("eventRegForm").addEventListener("submit", (e) => {
        e.preventDefault();
        showToast("Registration successful! See you there.");
        closeModal("eventRegModal");
        e.target.reset();
    });
}

// INITIALIZATION
checkLogin();
if(localStorage.getItem('theme') === 'dark') document.body.setAttribute('data-theme', 'dark');