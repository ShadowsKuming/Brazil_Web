<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, watch, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const open = ref(false)
const selection = ref(1)
const showBackToTop = ref(false)
const showComingSoon = ref(false)
const comingSoonPage = ref('')

// Show coming soon dialog for unavailable pages
function showUnavailable(pageName) {
  comingSoonPage.value = pageName
  showComingSoon.value = true
  open.value = false
}

function closeComingSoon() {
  showComingSoon.value = false
}

// Show/hide back to top button based on scroll position
function handleScroll() {
  showBackToTop.value = window.scrollY > 300
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

window.addEventListener('scroll', handleScroll)

// Lock/unlock body scroll when menu opens/closes
watch(open, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
  }
})

const options = [
  { value: 0, label: 'ABOUT' },
  { value: 6, label: 'PROJECTS' },
  { value: 5, label: 'NEWS & EVENTS' },
  { value: 3, label: 'PEOPLE' },
]

function choose(v) {
  selection.value = v
  open.value = false
  if (v === 1) {
    router.push('/')
  } else if (v === 2) {
    showUnavailable('Prototypes')
  } else if (v === 3) {
    router.push('/people')
  } else if (v === 4) {
    showUnavailable('Contact')
  } else if (v === 5) {
    showUnavailable('News & Events')
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
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  window.removeEventListener('scroll', handleScroll)
})
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

    <!-- Dark Overlay - click to close menu -->
    <div v-if="open" class="overlay" @click="open = false"></div>

    <!-- Dropdown Menu -->
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
            <li @click="choose(6)">Projects</li>
            <li @click="choose(5)">News + Events</li>
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
      <div class="footer-copyright">
        © 2026 Brazil Research.
      </div>
    </footer>

    <!-- Back to Top Button -->
    <button
      v-show="showBackToTop"
      class="back-to-top"
      @click="scrollToTop"
      aria-label="Back to top"
    >
      ↑
    </button>

    <!-- Coming Soon Dialog -->
    <div v-if="showComingSoon" class="dialog-overlay" @click="closeComingSoon">
      <div class="dialog-box" @click.stop>
        <button class="dialog-close" @click="closeComingSoon">×</button>
        <div class="dialog-content">
          <h2 class="dialog-title">Coming Soon</h2>
          <div class="dialog-line"></div>
          <p class="dialog-message">
            <strong>{{ comingSoonPage }}</strong> will be available shortly.
          </p>
          <p class="dialog-submessage">We're working on something exciting. Stay tuned!</p>
          <button class="dialog-btn" @click="closeComingSoon">Got it</button>
        </div>
      </div>
    </div>
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
  width: clamp(80px, 6.88vw, 120px);
  height: clamp(30px, 1.64vw, 28px);
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
   OVERLAY - Dark backdrop when menu is open
   ============================================ */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent dark */
  z-index: 150; /* Above content, below dropdown */
  cursor: pointer;
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
  margin-bottom: clamp(24px, 3vw, 48px);
}

.footer-title img {
  width: clamp(240px, 55vw, 800px); /* Smaller on desktop/tablet */
  height: auto;
}

/* Footer content - two columns */
.footer-contents {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  /* max-width: 1400px; */
}

/* Left column - navigation links */
.footer-more-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-2); /* Reduced from space-4 (16px) to space-2 (8px) */
}

.footer-heading {
  font-family: var(--font-family);
  font-size: clamp(12px, 1vw, 14px); /* Responsive like header */
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
  font-size: clamp(14px, 1.2vw, 18px); /* Responsive like header */
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

/* Copyright text */
.footer-copyright {
  margin-top: clamp(24px, 3vw, 48px);
  font-family: var(--font-family);
  font-size: clamp(12px, 0.9vw, 14px);
  color: var(--color-gray);
  text-align: center;
}

/* ============================================
   BACK TO TOP BUTTON
   ============================================ */
.back-to-top {
  position: fixed;
  bottom: clamp(20px, 3vw, 40px);
  right: clamp(20px, 3vw, 40px);
  width: clamp(44px, 4vw, 56px);
  height: clamp(44px, 4vw, 56px);
  border: none;
  border-radius: 50%;
  background-color: var(--color-black);
  color: var(--color-white);
  font-size: clamp(18px, 1.5vw, 24px);
  cursor: pointer;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.back-to-top:hover {
  background-color: var(--color-red);
  transform: scale(1.1);
}

/* ============================================
   COMING SOON DIALOG
   ============================================ */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.dialog-box {
  position: relative;
  background-color: var(--color-white);
  border-radius: clamp(16px, 4vw, 24px);
  max-width: 480px;
  width: 100%;
  padding: clamp(32px, 5vw, 48px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: dialogSlideIn 0.3s ease;
}

@keyframes dialogSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dialog-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  font-size: 28px;
  color: var(--color-black);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.dialog-close:hover {
  color: var(--color-red);
}

.dialog-content {
  text-align: center;
}

.dialog-title {
  font-family: var(--font-family);
  font-size: clamp(28px, 5vw, 36px);
  font-weight: 600;
  color: var(--color-black);
  margin-bottom: var(--space-3);
}

.dialog-line {
  width: 60px;
  height: 3px;
  background-color: var(--color-red);
  margin: 0 auto var(--space-5);
}

.dialog-message {
  font-family: var(--font-family);
  font-size: clamp(16px, 2vw, 18px);
  font-weight: 400;
  color: var(--color-black);
  line-height: 1.6;
  margin-bottom: var(--space-2);
}

.dialog-message strong {
  font-weight: 600;
}

.dialog-submessage {
  font-family: var(--font-family);
  font-size: clamp(14px, 1.5vw, 16px);
  font-weight: 400;
  color: #666;
  margin-bottom: var(--space-6);
}

.dialog-btn {
  font-family: var(--font-family);
  font-size: clamp(14px, 1.5vw, 16px);
  font-weight: 600;
  color: var(--color-white);
  background-color: var(--color-black);
  border: none;
  border-radius: 50px;
  padding: var(--space-3) var(--space-7);
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.dialog-btn:hover {
  background-color: var(--color-red);
  transform: scale(1.02);
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

  /* Mobile dropdown: overlay from top, below header */
  .dropdown-menu {
    position: fixed;
    top: 56px; /* Below header */
    left: 0;
    right: 0;
    width: 100%;
    height: auto;
    padding: var(--space-5) var(--space-4);
    gap: var(--space-2);
    justify-content: flex-start;
    border-radius: 0 0 var(--space-2) var(--space-2); /* Rounded bottom corners */
    z-index: 200; /* Above overlay */
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
    display: flex;
    justify-content: center; /* Center only on mobile */
  }

  /* Mobile: simplified footer */
  .footer-contents {
    flex-direction: column;
    align-items: center;
    gap: var(--space-4);
  }

  /* Hide "More ways to explore" on mobile - links in hamburger menu */
  .footer-more-info {
    display: none;
  }

  /* Center HAII LAB and "Learn more" */
  .footer-logos {
    align-items: center;
    padding-top: 0;
  }

  .footer-learn-about {
    justify-content: center;
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
