<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const open = ref(false)
const selection = ref(1)

const options = [
  { value: 0, label: 'ABOUT' },
  { value: 6, label: 'PROJECT PROPOSAL' },
  { value: 5, label: 'NEWS & EVENTS' },
  { value: 2, label: 'PROTOTYPES' },
  { value: 3, label: 'PEOPLE' },
]

function choose(v) {
  selection.value = v
  open.value = false
  if (v === 1) {
    router.push('/')
  } else if (v === 2) {
    router.push('/prototypes')
  } else if (v === 3) {
    router.push('/people')
  } else if (v === 4) {
    router.push('/contact')
  } else if (v === 5) {
    router.push('/news')
  } else if (v === 6) {
    router.push('/projects')
  } else if (v === 0) {
    window.open('https://shilei.me/', '_blank')
  }
}

function toggle() {
  open.value = !open.value
}

function onDocClick(e) {
  if (!e.target.closest('.dropdown')) open.value = false
}

document.addEventListener('click', onDocClick)
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <div class="app-root">
    <!-- Header -->
    <header>
      <div class="home-icon" @click="choose(1)"></div>
      <nav class="dropdown">
        <div class="mask-contact" :class="{ active: open }" @click="choose(4)"></div>
        <div class="mask-menu" :class="{ active: open }" @click.stop="toggle"></div>
      </nav>
    </header>

    <!-- Dropdown Menu - outside header for mobile document flow -->
    <div v-if="open" class="dropdown-menu dropdown">
      <div
        v-for="o in options"
        :key="o.value"
        class="dropdown-item"
        :class="{ active: o.value === selection }"
        @click="choose(o.value)"
      >
        {{ o.label }}
      </div>
    </div>

    <!-- Main Content -->
    <RouterView />

    <!-- Footer -->
    <footer>
      <div class="footer-title">
        <img src="@/assets/special_fonts/footer content.png" alt="Brazil Research Lab" />
      </div>
      <div class="footer-contents">
        <div class="footer-more-info">
          <h3 class="footer-heading">More ways to explore</h3>
          <hr />
          <ul class="footer-links">
            <li @click="choose(0)">About</li>
            <li @click="choose(6)">Project Proposal</li>
            <li @click="choose(5)">News + Events</li>
            <li @click="choose(2)">Prototypes</li>
            <li @click="choose(3)">People</li>
            <li @click="choose(4)">Contact</li>
          </ul>
        </div>
        <div class="footer-logos">
          <img src="@/assets/special_fonts/HAII LAB.png" alt="HAII LAB" class="footer-logo-haii" />
          <div class="footer-learn-about" @click="choose(0)">
            <span>Learn more about the lab</span>
            <span class="arrow">→</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* ============================================
   APP LAYOUT
   ============================================ */
.app-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: var(--color-white); /* White background shows through transparent header */
}

/* ============================================
   HEADER
   Desktop-first: default styles for large screens
   ============================================ */
header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: transparent; /* Transparent so dropdown shows behind nav */
  padding: clamp(12px, 1.5vw, 24px) clamp(16px, 4vw, 64px);
  z-index: 300; /* Above dropdown so nav stays clickable */
}

/* Home icon - PNG mask */
.home-icon {
  width: clamp(70px, 6.88vw, 120px);
  height: clamp(20px, 1.64vw, 28px);
  background-color: var(--color-black);
  mask-image: url('@/assets/special_fonts/home.png');
  mask-repeat: no-repeat;
  mask-size: contain;
  mask-position: center;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  z-index: 100;
}

.home-icon:hover {
  background-color: var(--color-red);
  transform: scale(1.02);
}

/* Navigation */
header nav {
  position: relative; /* For dropdown positioning */
  display: flex;
  align-items: center;
  gap: clamp(24px, 3vw, 50px);
}

/* Contact icon - PNG mask */
.mask-contact {
  width: clamp(110px, 10.2vw, 160px);
  height: clamp(20px, 1.64vw, 28px);
  background-color: var(--color-black);
  mask-image: url('@/assets/special_fonts/contact.png');
  mask-repeat: no-repeat;
  mask-size: contain;
  mask-position: center;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  z-index: 300; /* Above dropdown so it stays clickable */
}

.mask-contact.active {
  background-color: var(--color-white);
}

/* Menu icon - PNG mask */
.mask-menu {
  width: clamp(70px, 6.88vw, 120px);
  height: clamp(20px, 1.64vw, 28px);
  background-color: var(--color-black);
  mask-image: url('@/assets/special_fonts/menu.png');
  mask-repeat: no-repeat;
  mask-size: contain;
  mask-position: center;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  z-index: 300; /* Above dropdown so it stays clickable */
}

.mask-menu.active {
  background-color: var(--color-red); /* White on black background */
}

.mask-menu.active:hover {
  background-color: var(--color-white);
  transform: scale(1.02);
}

.mask-contact:hover,
.mask-menu:hover {
  background-color: var(--color-red);
  transform: scale(1.02);
}

/* ============================================
   DROPDOWN MENU
   Desktop: side panel from top, covers header right section
   Mobile: full-width below header, auto height
   ============================================ */
.dropdown-menu {
  position: fixed;
  right: 0;
  top: 0; /* From the very top */
  width: clamp(260px, 28vw, 480px); /* Match header nav area */
  height: 100vh;
  background-color: var(--color-black);
  z-index: 200; /* Below header (300) so nav stays visible */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: clamp(140px, 16vh, 220px); /* Space for header + gap to menu items */
  padding-left: clamp(32px, 4vw, 64px);
  padding-right: clamp(32px, 4vw, 64px);
  gap: clamp(20px, 2.5vw, 40px); /* Responsive gap */
}

.dropdown-item {
  color: var(--color-white);
  font-family: var(--font-family);
  font-size: clamp(18px, 1.8vw, 28px); /* Responsive font size like header */
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.dropdown-item:hover {
  color: var(--color-red);
}

.dropdown-item.active {
  font-weight: 600;
}

/* ============================================
   FOOTER
   ============================================ */
footer {
  margin-top: auto;
  background-color: var(--color-black-soft);
  color: var(--color-white);
  padding: clamp(32px, 4vw, 64px) clamp(24px, 5.5vw, 88px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Footer title image */
.footer-title {
  width: 100%;
  margin-bottom: clamp(32px, 4vw, 64px);
}

.footer-title img {
  width: 100%;
  max-width: 1400px;
  height: auto;
}

/* Footer content - two columns */
.footer-contents {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  max-width: 1400px;
}

/* Left column - navigation links */
.footer-more-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-2); /* Reduced from space-4 (16px) to space-2 (8px) */
}

.footer-heading {
  font-family: var(--font-family);
  font-size: var(--text-sm);
  font-weight: 400;
  color: var(--color-gray);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.footer-more-info hr {
  width: 100%;
  max-width: 320px;
  border: none;
  border-top: 1px solid #555555;
  margin: var(--space-2) 0;
}

.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-2); /* Reduced from space-3 (12px) to space-2 (8px) */
}

.footer-links li {
  font-family: var(--font-family);
  font-size: var(--text-base);
  font-weight: 400;
  color: var(--color-white);
  cursor: pointer;
  transition: color 0.3s ease, transform 0.2s ease;
}

.footer-links li:hover {
  color: var(--color-red);
  transform: translateX(4px);
}

/* Right column - logo */
.footer-logos {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-5);
  padding-top: clamp(48px, 8vw, 120px);
}

.footer-logo-haii {
  width: clamp(120px, 16vw, 240px);
  height: auto;
}

.footer-learn-about {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-family);
  font-size: var(--text-sm);
  color: var(--color-white);
  cursor: pointer;
  transition: color 0.3s ease;
}

.footer-learn-about:hover {
  color: var(--color-red);
}

.footer-learn-about .arrow {
  transition: transform 0.2s ease;
}

.footer-learn-about:hover .arrow {
  transform: translateX(4px);
}

/* ============================================
   TABLET STYLES (max-width: 1024px)
   ============================================ */
@media (max-width: 1024px) {
  header {
    padding: var(--space-4) var(--space-5);
  }

  header nav {
    gap: var(--space-5);
  }


  .footer-logos {
    padding-top: var(--space-7);
  }
}

/* ============================================
   MOBILE STYLES (max-width: 768px)
   ============================================ */
@media (max-width: 768px) {
  header {
    padding: var(--space-3) var(--space-4);
  }

  /* Hide contact on mobile - accessible via dropdown menu */
  .mask-contact {
    display: none;
  }

  header nav {
    gap: var(--space-4);
  }

  /* Mobile dropdown: part of document flow, pushes content down */
  .dropdown-menu {
    position: static; /* Part of document flow */
    width: 100%;
    height: auto;
    padding: var(--space-5) var(--space-4);
    gap: var(--space-2);
    justify-content: flex-start;
    border-radius: 0 0 var(--space-2) var(--space-2); /* Rounded bottom corners */
  }

  .dropdown-item {
    font-size: var(--text-lg);
    padding: var(--space-1) 0; /* Touch-friendly tap targets */
  }

  /* Mobile footer adjustments */
  footer {
    padding: var(--space-5) var(--space-4); /* Reduced padding */
  }

  .footer-title {
    margin-bottom: var(--space-5); /* Reduced margin */
  }

  /* Stack footer vertically */
  .footer-contents {
    flex-direction: column;
    gap: var(--space-5); /* Reduced from space-7 (48px) to space-5 (24px) */
  }

  .footer-more-info hr {
    max-width: 100%; /* Full width on mobile */
  }

  .footer-logos {
    padding-top: 0;
    width: 100%;
  }

  .footer-logo-haii {
    width: clamp(100px, 35vw, 160px);
  }

  .footer-learn-about {
    font-size: var(--text-base); /* Slightly larger for touch */
  }
}
</style>
