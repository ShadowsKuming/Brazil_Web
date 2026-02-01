<script setup>
function go(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="homepage">

    <!-- Section 1: Hero -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="text-semibold-italic">/Bridging</span> <span class="text-regular">Contexts:</span><br>
          <span class="text-extralight">Inclusive AI Co-Design and<br>
          PhD Research Exchange<br>
          Between </span><span class="text-semibold-italic">the UK</span><span class="text-extralight"> and </span><span class="text-semibold-italic brazil">Brazil</span><span class="text-extralight">.</span>
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
      <button class="floating-nav-btn" @click="go('purpose')">
        <span class="btn-letter">P</span>
        <span class="btn-text">PURPOSE</span>
      </button>
      <button class="floating-nav-btn" @click="go('objectives')">
        <span class="btn-letter">O</span>
        <span class="btn-text">OBJECTIVES</span>
      </button>
      <button class="floating-nav-btn" @click="go('sdg')">
        <span class="btn-letter">S</span>
        <span class="btn-text">SDG</span>
      </button>
      <button class="floating-nav-btn" @click="go('timeline')">
        <span class="btn-letter">T</span>
        <span class="btn-text">TIMELINE</span>
      </button>
    </nav>

    <!-- Remaining sections (temporary - still using images) -->
    <img id="purpose" class="section-image" alt="01 Purpose" src="@/assets/layouts/homepages/02 PURPOSE.png">
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
    padding: var(--space-6) var(--space-4);
  }

  .hero-title {
    font-size: clamp(24px, 6vw, 32px);
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

  /* Expand on hover/touch */
  .floating-nav-btn:hover,
  .floating-nav-btn:focus,
  .floating-nav-btn:active {
    width: auto;
    background-color: var(--color-red);
  }

  .floating-nav-btn:hover .btn-text,
  .floating-nav-btn:focus .btn-text,
  .floating-nav-btn:active .btn-text {
    opacity: 1;
    max-width: 120px;
    padding-right: 16px;
  }
}
</style>
