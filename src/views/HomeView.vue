<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const activeSection = ref(null)
let observer = null

// Navigate to section
function go(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Set up Intersection Observer to detect visible sections
function setupScrollSpy() {
  const sections = ['purpose', 'objectives', 'sdg', 'timeline']

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      })
    },
    {
      threshold: 0.3,
      rootMargin: '-10% 0px -50% 0px'
    }
  )

  sections.forEach((id) => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })
}

onMounted(() => {
  setupScrollSpy()
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>

<template>
  <div class="homepage">

    <!-- Section 1: Hero -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">
          <!-- Line 1: /Bridging Contexts: (large on mobile) -->
          <span class="title-line-1">
            <span class="text-semibold-italic">/Bridging</span> <span class="text-regular">Contexts:</span>
          </span>
          <br class="desktop-break">
          <!-- Middle: description (normal size, flows naturally on mobile) -->
          <span class="title-middle">
            <span class="text-extralight">Inclusive AI Co-Design and<br class="desktop-break">
            PhD Research Exchange<br class="desktop-break">
            Between </span>
          </span>
          <!-- Line 3: the UK and Brazil. (large on mobile) -->
          <span class="title-line-3">
            <span class="text-semibold-italic">the UK</span><span class="text-extralight"> and </span><span class="text-semibold-italic brazil">Brazil</span><span class="text-extralight">.</span>
          </span>
        </h1>

        <nav class="hero-nav">
          <button class="nav-pill" @click="go('purpose')">PURPOSE</button>
          <button class="nav-pill" @click="go('objectives')">OBJECTIVES</button>
          <button class="nav-pill" @click="go('sdg')">SDG CONTRIBUTIONS</button>
          <button class="nav-pill" @click="go('timeline')">TIMELINE</button>
        </nav>
      </div>
    </section>

    <!-- Mobile Floating Nav (visible only on mobile) -->
    <nav class="floating-nav">
      <button
        class="floating-nav-btn"
        :class="{ expanded: activeSection === 'purpose' }"
        @click="go('purpose')"
      >
        <span class="btn-letter">P</span>
        <span class="btn-text">PURPOSE</span>
      </button>
      <button
        class="floating-nav-btn"
        :class="{ expanded: activeSection === 'objectives' }"
        @click="go('objectives')"
      >
        <span class="btn-letter">O</span>
        <span class="btn-text">OBJECTIVES</span>
      </button>
      <button
        class="floating-nav-btn"
        :class="{ expanded: activeSection === 'sdg' }"
        @click="go('sdg')"
      >
        <span class="btn-letter">S</span>
        <span class="btn-text">SDG</span>
      </button>
      <button
        class="floating-nav-btn"
        :class="{ expanded: activeSection === 'timeline' }"
        @click="go('timeline')"
      >
        <span class="btn-letter">T</span>
        <span class="btn-text">TIMELINE</span>
      </button>
    </nav>

    <!-- Section 2: Purpose -->
    <section id="purpose" class="purpose-section">
      <div class="purpose-content">
        <div class="section-number-wrapper">
          <span class="section-number">01</span>
        </div>
        <div class="section-main">
          <div class="section-header">
            <h2 class="section-title">PURPOSE</h2>
            <div class="section-line"></div>
          </div>
          <p class="section-text">
            Funded by the British Council, this project aims to tackle educational
            inequalities by enhancing Brazilian postgraduate researchers' capacity
            in inclusive AI design. It further seeks to cultivate cross-national
            collaboration between UK and Brazilian PhD researchers, co-develop
            ethics (fairness, equity, inclusion), and establish sustained partnerships
            to drive progress toward equitable education systems.
          </p>
          <div class="purpose-logos">
            <img src="@/assets/logos/newcastle.png" alt="Newcastle University" class="logo-newcastle">
            <img src="@/assets/logos/ufrgs.png" alt="UFRGS" class="logo-ufrgs">
          </div>
        </div>
      </div>
    </section>

    <!-- Remaining sections (temporary - still using images) -->
    <img id="objectives" class="section-image" alt="02 Objectives" src="@/assets/layouts/homepages/03 OBJECTIVES.png">
    <img id="sdg" class="section-image section-image--dark" alt="03 SDG Contributions" src="@/assets/layouts/homepages/04 SDG CONTRIBUTIONS.png">
    <img id="timeline" class="section-image" alt="04 Timeline" src="@/assets/layouts/homepages/TIMELINE.png">

  </div>
</template>

<style scoped>
/* ============================================
   HOMEPAGE LAYOUT
   ============================================ */
.homepage {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ============================================
   SECTION 1: HERO
   ============================================ */
.hero {
  width: 100%;
  padding: clamp(60px, 10vw, 150px) clamp(40px, 12vw, 200px);
  background-color: var(--color-white);
  display: flex;
  justify-content: center;
}

.hero-content {
  display: inline-block;
}

.hero-title {
  font-family: var(--font-family);
  font-size: clamp(28px, 4.5vw, 72px);
  line-height: 1.1;
  color: var(--color-black);
  margin-bottom: clamp(24px, 3vw, 40px);
}

/* /Bridging - SemiBold Italic */
.hero-title .text-semibold-italic {
  font-weight: 600;
  font-style: italic;
}

/* Contexts: - Regular */
.hero-title .text-regular {
  font-weight: 400;
  font-style: normal;
}

/* Inclusive...Between...and... - ExtraLight */
.hero-title .text-extralight {
  font-weight: 200;
  font-style: normal;
}

/* the UK, Brazil - ExtraLight Italic */
.hero-title .text-extralight-italic {
  font-weight: 200;
  font-style: italic;
}

/* Brazil - red strikethrough */
.hero-title .brazil {
  /* text-decoration: line-through; */
  text-decoration-color: var(--color-red);
  text-decoration-thickness: 3px;
}

/* Title line wrappers - inline by default (desktop) */
.title-line-1,
.title-middle,
.title-line-3 {
  display: inline;
}

/* Nav Pills */
.hero-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between; /* Spread: first aligns left, last aligns right */
  width: 100%; /* Takes full width of parent (same as title) */
}

.nav-pill {
  font-family: var(--font-family);
  font-size: clamp(12px, 1.2vw, 16px);
  font-weight: 600;
  color: var(--color-black);
  background: transparent;
  border: 1.5px solid var(--color-black);
  border-radius: 50px;
  padding: clamp(6px, 0.5vw, 10px) clamp(16px, 1.5vw, 24px);
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-pill:hover {
  color: var(--color-red);
  border-color: var(--color-red);
  transform: scale(1.02);
}

/* ============================================
   TEMPORARY: Image sections (to be replaced)
   ============================================ */
.section-image {
  width: 100%;
  height: auto;
  display: block;
  background-color: var(--color-white);
  padding: 5vw;
}

.section-image--dark {
  background-color: var(--color-black);
  padding: 0;
}

/* ============================================
   SECTION 2: PURPOSE
   ============================================ */
.purpose-section {
  width: 100%;
  padding: 0 clamp(40px, 8vw, 200px);
  background-color: var(--color-white);
}

.purpose-content {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
}

/* 01 number - large, semi-transparent red, positioned behind */
.section-number-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.section-number {
  font-family: var(--font-family);
  font-size: clamp(85px, 10vw, 160px);
  font-weight: 400;
  font-style: italic;
  color: #DD35284D; /* Semi-transparent red */
  line-height: 1;
}

/* Main content sits on top of 01 */
.section-main {
  position: relative;
  z-index: 2;
  padding-left: clamp(20px, 2.5vw, 100px); /* Offset to align with 01 */
  padding-top: clamp(70px, 7vw, 120px); /* Push down to overlap nicely */
}


/* PURPOSE title with horizontal line */
.section-header {
  display: flex;
  align-items: center;
  gap: clamp(16px, 2vw, 32px);
  margin-bottom: clamp(24px, 3vw, 40px);
}

.section-title {
  font-family: 'Inter', sans-serif;
  font-size: clamp(22px, 3.2vw, 35px);
  font-weight: 600;
  color: var(--color-black);
  text-transform: uppercase;
  line-height: 1;
  letter-spacing: 0;
  flex-shrink: 0;
}

.section-line {
  flex: 1;
  height: 1px;
  background-color: var(--color-black);
}

.section-text {
  font-family: var(--font-family);
  font-size: clamp(16px, 1.8vw, 24px);
  font-weight: 400;
  color: var(--color-black);
  line-height: 1.4;
  max-width: 1500px;
  margin: clamp(46px, 6vw, 70px) auto;
  padding: 0 clamp(40px, 5vw, 80px);
}

.purpose-logos {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1500px;
  margin: 0 auto;
  padding: 0 clamp(40px, 5vw, 80px);
}

.logo-newcastle {
  height: clamp(50px, 6vw, 80px);
  width: auto;
}

.logo-ufrgs {
  height: clamp(100px, 11vw, 160px);
  width: auto;
}

/* ============================================
   TABLET STYLES (max-width: 1024px)
   ============================================ */
@media (max-width: 1024px) {
  .hero {
    padding: var(--space-7) var(--space-6);
  }
}

/* ============================================
   MOBILE STYLES (max-width: 768px)
   ============================================ */
@media (max-width: 768px) {
  .hero {
    padding: var(--space-8) var(--space-7); /* More horizontal padding */
    align-items: flex-start;
  }

  .hero-content {
    max-width: 100%;
  }

  .hero-title {
    font-size: clamp(24px, 6vw, 32px);
    line-height: 1.4;
    margin-bottom: var(--space-6);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  /* Line 1: /Bridging Contexts: - LARGE */
  .title-line-1 {
    display: block;
    font-size: clamp(32px, 8vw, 52px);
    line-height: 1.2;
    white-space: nowrap;
  }

  /* Middle: description - flows naturally */
  .title-middle {
    display: block;
    font-size: clamp(24px, 6vw, 32px);
    line-height: 1.5;
    padding: 0 clamp(8px,0.5vw,4px);
  }

  /* Line 3: the UK and Brazil. - LARGE */
  .title-line-3 {
    display: block;
    font-size: clamp(32px, 8vw, 52px);
    line-height: 1.2;
    white-space: nowrap;
  }

  /* Hide hard line breaks on mobile - let middle text flow naturally */
  .desktop-break {
    display: none;
  }

  /* PURPOSE section mobile */
  .purpose-section {
    padding: var(--space-7) var(--space-5);
  }

  .section-number {
    font-size: clamp(80px, 25vw, 120px);
  }

  .section-main {
    padding-left: var(--space-4);
  }

  .section-header {
    margin-bottom: var(--space-4);
  }

  .section-title {
    font-size: clamp(24px, 6vw, 32px);
  }

  .section-text {
    font-size: clamp(16px, 4.5vw, 20px);
    line-height: 1.5;
  }

  .purpose-logos {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-5);
  }


  .hero-nav {
    flex-direction: row;
    flex-wrap: nowrap; /* Prevent wrapping */
    gap: var(--space-3);
    overflow-x: auto; /* Enable horizontal scroll */
    padding-bottom: var(--space-2); /* Space for scrollbar */
    -webkit-overflow-scrolling: touch; /* Smooth scroll on iOS */
  }

  /* Custom scrollbar styling */
  .hero-nav::-webkit-scrollbar {
    height: 4px;
  }

  .hero-nav::-webkit-scrollbar-track {
    background: var(--color-gray);
    border-radius: 2px;
  }

  .hero-nav::-webkit-scrollbar-thumb {
    background: var(--color-black);
    border-radius: 2px;
  }

  .nav-pill {
    flex-shrink: 0; /* Prevent pills from shrinking */
    white-space: nowrap; /* Keep text on one line */
  }
}

/* ============================================
   FLOATING NAV - Mobile only
   Shows letter buttons that expand on touch
   ============================================ */
.floating-nav {
  display: none; /* Hidden on desktop */
}

@media (max-width: 768px) {
  /* Hide inline nav on mobile */
  .hero-nav {
    display: none;
  }

  /* Show floating nav on mobile */
  .floating-nav {
    display: flex;
    flex-direction: column;
    position: fixed;
    left: var(--space-3);
    top: 50%;
    transform: translateY(-50%);
    gap: var(--space-2);
    z-index: 100;
  }

  .floating-nav-btn {
    display: flex;
    align-items: center;
    gap: 0;
    width: 40px; /* Circle size */
    height: 40px;
    padding: 0;
    background-color: var(--color-black);
    color: var(--color-white);
    border: none;
    border-radius: 20px;
    cursor: pointer;
    overflow: hidden;
    transition: width 0.3s ease, background-color 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .btn-letter {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    height: 40px;
    font-family: var(--font-family);
    font-size: 16px;
    font-weight: 600;
  }

  .btn-text {
    font-family: var(--font-family);
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    opacity: 0;
    max-width: 0;
    padding-right: 0;
    transition: opacity 0.2s ease, max-width 0.3s ease, padding-right 0.3s ease;
  }

  /* Expand when active (controlled by JS) */
  .floating-nav-btn.expanded {
    width: auto;
    background-color: var(--color-red);
  }

  .floating-nav-btn.expanded .btn-text {
    opacity: 1;
    max-width: 120px;
    padding-right: 16px;
  }
}
</style>
