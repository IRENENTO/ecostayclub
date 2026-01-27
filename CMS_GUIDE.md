# EcoStay Dynamic SPA CMS - Implementation Guide

## Overview
Your EcoStay website has been completely refactored into a **fully dynamic Single Page Application (SPA)** with a comprehensive Content Management System (CMS) dashboard. No code changes needed—edit everything from the admin dashboard!

---

## Project Structure

### Files Created/Modified:
1. **index.html** - Clean container-based structure (all dynamic rendering)
2. **script.js** - The heart of the system:
   - `defaultSiteConfig` - Complete site configuration object
   - `getSiteConfig()` / `saveSiteConfig()` - LocalStorage management
   - `renderWebsite()` - Main render engine
   - Individual render functions for each section
3. **admin.html** - Professional admin dashboard with tabs for:
   - General Settings
   - Hero Section
   - Mission & Vision
   - Team Management  
   - Testimonials
   - Events Manager
   - Theme Editor
4. **styles.css** - Already using CSS variables for theming

---

## Architecture Overview

### Centralized State Management (`defaultSiteConfig`)
```javascript
{
  theme: { primaryColor, secondaryColor, accentColor, ... },
  navbar: { visible, logo, navItems[] },
  hero: { visible, headline, subheading, ctaButtonText, ... },
  mission: { visible, title, missionText, visionText, whoWeAre },
  impact: { visible, stats[] },
  team: { visible, title, members[] },
  testimonials: { visible, title, items[] },
  events: { visible, title, items[] },
  footer: { visible, phone, email, address, socials }
}
```

### The Render Engine
- **`renderWebsite()`** - Called on page load and after any saves
- **`applyTheme(config.theme)`** - Updates CSS variables in real-time
- **`renderNavbar()`, `renderHero()`, `renderMission()`, etc.** - Dynamically inject HTML based on config
- **Container-based HTML** - `index.html` has empty divs that get populated:
  - `<div id="navbar-container"></div>`
  - `<div id="hero-container"></div>`
  - `<div id="mission-container"></div>`
  - etc.

### LocalStorage Flow
1. Site loads → `renderWebsite()` reads `siteConfig` from LocalStorage
2. User edits in admin.html → Changes saved to LocalStorage
3. User clicks "Preview" → Opens `index.html` which auto-reads updated config
4. Live updates!

---

## How to Use the Admin Dashboard

### Access the Admin Panel
- Navigate to `/admin.html`
- Click any tab in the sidebar to edit that section

### Available Sections

#### 1. General Settings
- Toggle section visibility on/off for the entire site
- Show/hide Navbar, Hero, Mission, Impact, Team, Testimonials, Events, Footer

#### 2. Hero Section
- Change headline and subheading
- Edit CTA button text and link target
- Update background image/gradient

#### 3. Mission & Vision
- Edit mission title and subtitle
- Update mission statement and vision statement
- Edit "Who We Are" description

#### 4. Team Management
- Click "Add Member" to add new team members
- Edit or delete existing members
- Each member has: name, role, department, email, phone, image URL

#### 5. Testimonials
- Add new testimonials with quotes
- Edit author name, role, and image
- Delete old testimonials

#### 6. Events Manager
- Create new events with title, date, location, description
- Set status (Upcoming/Completed)
- Add event image URLs
- Edit and delete events

#### 7. Theme Editor
- Change primary color (affects buttons, links, headers)
- Change secondary color (affects accents)
- Change accent color (affects highlights)
- Color changes apply in real-time to the live site

### Save Changes
- Click **"Save All"** button in top-right
- Changes are saved to browser's LocalStorage
- Click **"Preview Site"** to see changes live
- Click **"Go to Site"** to visit the public website

---

## Key Features

### ✅ Dynamic Rendering
- Every section renders from `siteConfig`
- Change a text value = instant update across the site
- No hardcoded content

### ✅ Toggle Visibility
- Hide entire sections without deleting content
- Perfect for seasonal/temporary content

### ✅ Theme Customization
- Change primary color to blue/red/purple instantly
- CSS variables update in real-time
- Affects all buttons, headings, links

### ✅ Team Management
- Full CRUD (Create, Read, Update, Delete) for team members
- Upload image URLs, phone numbers, emails
- Individual member visibility toggle

### ✅ Event Management
- Create/edit/delete events
- Mark as Upcoming/Completed/Cancelled
- Track impact for completed events

### ✅ Testimonials System
- Add member quotes
- Link to author profile image
- Edit/delete as needed

### ✅ Responsive Design
- Mobile-friendly admin dashboard
- All containers responsive on mobile

---

## Technical Details

### Data Storage
- **LocalStorage Key**: `siteConfig`
- **Size**: ~50-100KB depending on content
- **Persistence**: Data persists across browser sessions

### CSS Variables Used
```css
--primary: Primary color (buttons, headings)
--secondary: Secondary accent
--accent: Highlight/CTA color
--bg-color: Page background
--text-color: Default text
--text-muted: Subtle/secondary text
--card-bg: Card/component background
--nav-bg: Navigation background
--border-color: Borders
--shadow: Drop shadows
--transition: Animation timing
```

### JavaScript Functions (Public API)
```javascript
getSiteConfig()              // Get current config
saveSiteConfig(config)       // Save config to LocalStorage
resetSiteConfig()            // Reset to defaults
renderWebsite()              // Render all sections
```

---

## Common Tasks

### Change the Site Name
1. Go to Admin → General Settings
2. Find "Site Name" field
3. Update and save

### Add a New Team Member
1. Go to Admin → Team Management
2. Click "Add Team Member"
3. Fill in name, role, department, contact info, image URL
4. Click "Save Member"
5. Member appears on live site instantly

### Hide a Section (e.g., Events)
1. Go to Admin → General Settings
2. Toggle "Events" OFF
3. Click "Save All"
4. Events section disappears from public site

### Change Brand Colors
1. Go to Admin → Theme Editor
2. Click color picker next to "Primary Color"
3. Select new color (or paste hex code)
4. Save
5. All buttons, headers, and accents update instantly

### Add a New Event
1. Go to Admin → Events Manager
2. Click "Add Event"
3. Fill in: title, date, location, description, status, image URL
4. Click "Save Event"
5. Event appears on public site

---

## Important Notes

⚠️ **Browser LocalStorage Only**
- Data is stored locally in each browser
- To backup: Export localStorage as JSON
- To sync across devices: Consider adding backend database later

⚠️ **Image URLs**
- Use full URLs (http://example.com/image.jpg)
- Or relative paths (img/team-member.jpg)
- Admin cannot upload files—must link to existing URLs

⚠️ **Reset Function**
- "Reset to Defaults" cannot be undone
- Always save/backup before resetting

---

## Future Enhancements

Possible additions (not included):
- Backend database integration
- Image upload functionality
- Multi-language support
- Advanced analytics
- Email notifications
- User role management
- Version history

---

## Support

All changes you make are automatically saved to LocalStorage. The system works entirely offline and doesn't require an internet connection to function (except for loading external images/CDN resources).

**Happy editing! 🌱**
