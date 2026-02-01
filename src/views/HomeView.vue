<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const activeSection = ref(null)
let observer = null
let isScrolling = false // Flag to disable scroll spy during programmatic scroll

// Smooth scroll with overshoot easing
function smoothScrollTo(targetY, duration = 1000) {
  const startY = window.scrollY
  const distance = targetY - startY
  let startTime = null

  // Ease out back - overshoots then settles
  function easeOutBack(t) {
    const c1 = 1.70158
    const c3 = c1 + 1
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
  }

  function step(currentTime) {
    if (!startTime) startTime = currentTime
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = easeOutBack(progress)

    window.scrollTo(0, startY + distance * eased)

    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      isScrolling = false
    }
  }

  requestAnimationFrame(step)
}

// Navigate to section
function go(id) {
  isScrolling = true // Disable scroll spy
  activeSection.value = id // Immediately expand the button

  const el = document.getElementById(id)
  if (el) {
    const targetY = el.getBoundingClientRect().top + window.scrollY
    smoothScrollTo(targetY, 900)
  }
}

// Set up Intersection Observer to detect visible sections
function setupScrollSpy() {
  const sections = ['purpose', 'objectives', 'sdg', 'timeline', 'callphd']

  observer = new IntersectionObserver(
    (entries) => {
      if (isScrolling) return // Skip updates during programmatic scroll

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '-20% 0px -40% 0px'
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
      <button
        class="floating-nav-btn"
        :class="{ expanded: activeSection === 'callphd' }"
        @click="go('callphd')"
      >
        <span class="btn-letter">C</span>
        <span class="btn-text">CALL FOR PHD</span>
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

    <!-- Section 3: Objectives -->
    <section id="objectives" class="objectives-section">
      <div class="objectives-content">
        <div class="section-number-wrapper">
          <span class="section-number">02</span>
        </div>
        <div class="section-main">
          <div class="section-header">
            <h2 class="section-title">OBJECTIVES</h2>
            <div class="section-line"></div>
          </div>

          <!-- Objective items - 3 column layout with separator lines -->
          <div class="objectives-list">
            <div class="objective-item">
              <span class="objective-num">01</span>
              <h3 class="objective-title">Capacity-Building</h3>
              <p class="objective-desc">Train 20 gender-balanced PhDs (5 UK, 15 Brazil, 50% women) in child-focused inclusive AI co-design methodologies.</p>
            </div>
            <hr class="objective-line">
            <div class="objective-item">
              <span class="objective-num">02</span>
              <h3 class="objective-title">Prototyping</h3>
              <p class="objective-desc">Develop 5 child-centred AI prototypes tailored to Brazilian rural/urban and neurodiverse learners.</p>
            </div>
            <hr class="objective-line">
            <div class="objective-item">
              <span class="objective-num">03</span>
              <h3 class="objective-title">Co-Design</h3>
              <p class="objective-desc">Co-design educational materials integrating child-AI interaction frameworks.</p>
            </div>
            <hr class="objective-line">
          </div>
        </div>
      </div>
    </section>

    <!-- Section 4: SDG Contributions -->
    <section id="sdg" class="sdg-section">
      <div class="sdg-content">
        <div class="section-number-wrapper">
          <span class="section-number sdg-number">03</span>
        </div>
        <div class="section-main">
          <div class="section-header">
            <h2 class="section-title sdg-title">SDG CONTRIBUTIONS</h2>
            <div class="section-line sdg-line"></div>
          </div>

          <!-- SDG items -->
          <div class="sdg-list">
            <div class="sdg-item">
              <div class="sdg-item-header">
                <span class="sdg-bullet">•</span>
                <h3 class="sdg-item-title">Inclusive Educational Tools</h3>
                <span class="sdg-tag">SDG 4</span>
              </div>
              <p class="sdg-item-desc">Prototypes and training enhance access to quality, age-appropriate learning tools for rural/neurodiverse children.</p>
            </div>

            <div class="sdg-item">
              <div class="sdg-item-header">
                <span class="sdg-bullet">•</span>
                <h3 class="sdg-item-title">Gender Equity in STEM</h3>
                <span class="sdg-tag">SDG 5</span>
              </div>
              <p class="sdg-item-desc">50% female participation and girl-focused co-design address STEM gender gaps.</p>
            </div>

            <div class="sdg-item">
              <div class="sdg-item-header">
                <span class="sdg-bullet">•</span>
                <h3 class="sdg-item-title">Equity for Marginalised Groups</h3>
                <span class="sdg-tag">SDG 10</span>
              </div>
              <p class="sdg-item-desc">Focus on underserved Brazilian communities ensures reduced inequalities in educational technology access.</p>
            </div>

            <div class="sdg-item">
              <div class="sdg-item-header">
                <span class="sdg-bullet">•</span>
                <h3 class="sdg-item-title">UK-Brazil Research Partnership</h3>
                <span class="sdg-tag">SDG 17</span>
              </div>
              <p class="sdg-item-desc">BiIDS and multi-HEI South-UK Brazil research collaboration.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 5: Timeline -->
    <section id="timeline" class="timeline-section">
      <!-- Desktop: Use image -->
      <img class="section-image timeline-desktop" alt="04 Timeline" src="@/assets/layouts/homepages/TIMELINE.png">

      <!-- Mobile: Simplified timeline -->
      <div class="timeline-mobile">
        <div class="timeline-content">
          <div class="section-number-wrapper">
            <span class="section-number">04</span>
          </div>
          <div class="section-main">
            <div class="section-header">
              <h2 class="section-title">TIMELINE</h2>
              <div class="section-line"></div>
            </div>

            <div class="timeline-steps">
              <div class="timeline-step-mobile">
                <span class="step-label">Phase 1</span>
                <h3 class="step-title">Programme Inauguration & Team Establishment</h3>
                <p class="step-desc">Recruit 20 gender-balanced PhD researchers (5 UK, 15 Brazil; 50% female). Establish 5 cross-national teams aligned with thematic projects. Deliver training on Brazilian child psychology and ethical research protocols.</p>
              </div>
              <div class="timeline-step-mobile">
                <span class="step-label">Phase 2</span>
                <h3 class="step-title">Field Investigation & Prototype Blueprint</h3>
                <p class="step-desc">Conduct user-centric field research with marginalised children in Rio Grande do Sul. Develop 5 preliminary prototype blueprints with contextual research reports.</p>
              </div>
              <div class="timeline-step-mobile">
                <span class="step-label">Phase 3</span>
                <h3 class="step-title">UK-Brazil Exchange & Prototype Refinement</h3>
                <p class="step-desc">Facilitate academic exchange at UFRGS, Porto Alegre. Organise workshops on inclusive co-design and adaptive AI. Host hybrid prototype showcase at Newcastle University and UFRGS.</p>
              </div>
              <div class="timeline-step-mobile">
                <span class="step-label">Phase 4</span>
                <h3 class="step-title">Evaluation & Prioritisation</h3>
                <p class="step-desc">Conduct multi-stakeholder evaluation with educators, policymakers, and children. Prioritise top 3 prototypes for full-scale development.</p>
              </div>
              <div class="timeline-step-mobile">
                <span class="step-label">Phase 5</span>
                <h3 class="step-title">Development & Empirical Validation</h3>
                <p class="step-desc">Develop functional prototypes for resource-constrained contexts. Conduct empirical validation with marginalised Brazilian children to measure usability and educational efficacy.</p>
              </div>
              <div class="timeline-step-mobile">
                <span class="step-label">Phase 6</span>
                <h3 class="step-title">Knowledge Dissemination & Curriculum Co-Development</h3>
                <p class="step-desc">Submit findings to peer-reviewed journals. Co-develop educational materials with Brazilian educators. Launch open-access digital repository for programme resources.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 6: Call for PhD -->
    <section id="callphd" class="callphd-section">
      <div class="callphd-content">
        <div class="section-number-wrapper">
          <span class="section-number">05</span>
        </div>
        <div class="section-main">
          <div class="section-header">
            <h2 class="section-title">CALL FOR PHD</h2>
            <div class="section-line"></div>
          </div>

          <!-- Intro -->
          <div class="callphd-intro">
            <h3 class="callphd-subtitle">Join Our Brazilian PhD Cohort</h3>
            <p class="callphd-text">
              We are seeking <strong>15 Brazilian PhD students</strong> to join five collaborative research projects
              (3 students per project). Our goal is to assemble diverse cross-national teams that drive innovative,
              inclusive AI co-design, supporting marginalised children in Brazil and advancing educational equity.
            </p>
          </div>

          <!-- Why Join Us -->
          <div class="callphd-reasons">
            <h3 class="reasons-title">Why Join Us?</h3>
            <div class="reasons-grid">
              <div class="reason-item">
                <h4 class="reason-name">Cross-National Collaboration</h4>
                <p class="reason-desc">Work with UK researchers and leading experts in inclusive AI design. Build interdisciplinary and cross-cultural research skills.</p>
              </div>
              <div class="reason-item">
                <h4 class="reason-name">Hands-On AI Research</h4>
                <p class="reason-desc">Co-design AI educational tools for marginalised children. Gain practical skills in user-centric design and field research.</p>
              </div>
              <div class="reason-item">
                <h4 class="reason-name">Shape Research Directions</h4>
                <p class="reason-desc">Lead theme-specific research using your local insights. Refine project goals that match your interests and expertise.</p>
              </div>
              <div class="reason-item">
                <h4 class="reason-name">International Networks</h4>
                <p class="reason-desc">Access academic exchanges, workshops, and partnerships with UFRGS and Newcastle University.</p>
              </div>
              <div class="reason-item">
                <h4 class="reason-name">Real Impact</h4>
                <p class="reason-desc">Contribute to SDGs 4, 5, and 10. Create life-changing solutions for educational equity.</p>
              </div>
              <div class="reason-item">
                <h4 class="reason-name">Professional Skills</h4>
                <p class="reason-desc">Training in child psychology, ethical research practices, and inclusive AI co-design methodologies.</p>
              </div>
            </div>
          </div>

          <!-- CTA -->
          <div class="callphd-cta">
            <p class="cta-text">Interested? Contact the project sponsor for details before applying.</p>
            <a href="mailto:Lei.Shi@newcastle.ac.uk" class="cta-btn">Get in Touch</a>
          </div>
        </div>
      </div>
    </section>

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
  width: clamp(1200px,90vw,1500px);
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
  height: clamp(40px, 6vw, 80px);
  width: auto;
}

.logo-ufrgs {
  height: clamp(70px, 11vw, 160px);
  width: auto;
}

/* ============================================
   SECTION 3: OBJECTIVES
   ============================================ */
.objectives-section {
  width: 100%;
  padding: clamp(30px,6vw,100px) clamp(40px, 8vw, 200px);
  background-color: var(--color-white);
}

.objectives-content {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
}

/* Objectives list - 3 column grid */
.objectives-list {
  max-width: 1500px;
  margin: clamp(46px, 6vw, 70px) auto;
  padding: 0 clamp(40px, 5vw, 80px);
  display: flex;
  flex-direction: column;
  gap: clamp(24px, 3vw, 36px);
}

.objective-item {
  display: grid;
  grid-template-columns: auto auto 1fr;
  align-items: baseline;
  gap: clamp(104px, 12vw, 192px)
}

.objective-num {
  font-family: var(--font-family);
  font-size: clamp(16px, 1.6vw, 20px);
  font-weight: 400;
  color: var(--color-black);
  font-weight: 500;
  color: #DD3528;
}

.objective-title {
  font-family: var(--font-family);
  font-size: clamp(16px, 1.6vw, 22px);
  font-weight: 600;
  color: var(--color-black);
  white-space: nowrap;
  width: clamp(140px,14vw,185px);
}

.objective-desc {
  font-family: var(--font-family);
  font-size: clamp(14px, 1.4vw, 18px);
  font-weight: 400;
  color: var(--color-black);
  line-height: 1.5;
  text-align: left;
}

.objective-line {
  border: none;
  border-top: 1px solid var(--color-black);
  margin: 0;
  width: 100%;
}

/* ============================================
   SECTION 4: SDG CONTRIBUTIONS
   ============================================ */
.sdg-section {
  width: 100%;
  padding: clamp(30px, 6vw, 100px) clamp(40px, 8vw, 200px);
  background-color: var(--color-black);
}

.sdg-content {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
}

/* Override colors for dark background */
.sdg-number {
  color: #DD352833; /* Lighter semi-transparent red for dark bg */
}

.sdg-title {
  color: var(--color-white);
}

.sdg-line {
  background-color: var(--color-white);
}

/* SDG list */
.sdg-list {
  max-width: 1500px;
  margin: clamp(46px, 6vw, 70px) auto;
  padding: 0 clamp(40px, 5vw, 80px);
  display: flex;
  flex-direction: column;
  gap: clamp(24px, 3vw, 36px);
}

.sdg-item {
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 1vw, 12px);
}

.sdg-item-header {
  display: flex;
  align-items: baseline;
  gap: clamp(8px, 1vw, 16px);
}

.sdg-bullet {
  font-size: clamp(18px, 2vw, 24px);
  color: var(--color-white);
  line-height: 1;
}

.sdg-item-title {
  font-family: var(--font-family);
  font-size: clamp(18px, 1.8vw, 26px);
  font-weight: 600;
  color: var(--color-white);
  flex: 1;
}

.sdg-tag {
  font-family: var(--font-family);
  font-size: clamp(14px, 1.4vw, 18px);
  font-weight: 600;
  color: var(--color-red);
  white-space: nowrap;
}

.sdg-item-desc {
  font-family: var(--font-family);
  font-size: clamp(14px, 1.4vw, 18px);
  font-weight: 400;
  color: var(--color-white);
  line-height: 1.5;
  /* padding-left: clamp(26px, 3vw, 40px);  */
  /* Align with title after bullet */
}

/* ============================================
   SECTION 5: TIMELINE
   ============================================ */
.timeline-section {
  width: 100%;
  background-color: var(--color-white);
}

/* Desktop: show image, hide mobile version */
.timeline-desktop {
  display: block;
}

.timeline-mobile {
  display: none;
}

/* Mobile timeline styles */
.timeline-mobile .timeline-content {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
}

.timeline-steps {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  padding: var(--space-4) var(--space-4);
  margin-top: var(--space-5);
  margin-left: var(--space-4);
  position: relative;
  border-left: 2px solid var(--color-black);
}

/* Filled dot at the top of timeline */
.timeline-steps::before {
  content: '';
  position: absolute;
  left: -6px;
  top: -5px;
  width: 10px;
  height: 10px;
  background-color: var(--color-black);
  border-radius: 50%;
}

/* Filled dot at the bottom of timeline */
.timeline-steps::after {
  content: '';
  position: absolute;
  left: -6px;
  bottom: -5px;
  width: 10px;
  height: 10px;
  background-color: var(--color-black);
  border-radius: 50%;
}

.timeline-step-mobile {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding-left: var(--space-4);
  position: relative;
}

/* Empty dot (circle outline) */
.timeline-step-mobile::before {
  content: '';
  position: absolute;
  left: -7px;
  top: 22px;
  width: 10px;
  height: 10px;
  background-color: var(--color-white);
  border: 2px solid var(--color-black);
  border-radius: 50%;
}

.step-label {
  font-family: var(--font-family);
  font-size: clamp(28px, 8vw, 32px);
  font-weight: 600;
  color: var(--color-black);
}

.step-title {
  font-family: var(--font-family);
  font-size: clamp(16px, 4.5vw, 20px);
  font-weight: 600;
  color: var(--color-black);
  line-height: 1.3;
}

.step-desc {
  font-family: var(--font-family);
  font-size: clamp(14px, 4vw, 16px);
  font-weight: 400;
  color: var(--color-black);
  line-height: 1.5;
}

/* ============================================
   SECTION 6: CALL FOR PHD
   ============================================ */
.callphd-section {
  width: 100%;
  padding: clamp(30px, 6vw, 100px) clamp(40px, 8vw, 200px);
  background-color: var(--color-white);
}

.callphd-content {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
}

/* Intro */
.callphd-intro {
  max-width: 1500px;
  margin: clamp(46px, 6vw, 70px) auto clamp(32px, 4vw, 48px);
  padding: 0 clamp(40px, 5vw, 80px);
}

.callphd-subtitle {
  font-family: var(--font-family);
  font-size: clamp(24px, 2.5vw, 36px);
  font-weight: 600;
  color: var(--color-black);
  margin-bottom: clamp(12px, 1.5vw, 20px);
}

.callphd-text {
  font-family: var(--font-family);
  font-size: clamp(16px, 1.6vw, 22px);
  font-weight: 400;
  color: var(--color-black);
  line-height: 1.6;
}

/* Why Join Us */
.callphd-reasons {
  max-width: 1500px;
  margin: 0 auto clamp(40px, 5vw, 60px);
  padding: 0 clamp(40px, 5vw, 80px);
}

.reasons-title {
  font-family: var(--font-family);
  font-size: clamp(20px, 2vw, 28px);
  font-weight: 600;
  color: var(--color-black);
  margin-bottom: clamp(24px, 3vw, 40px);
}

.reasons-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(24px, 3vw, 40px);
}

.reason-item {
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 1vw, 12px);
}

.reason-name {
  font-family: var(--font-family);
  font-size: clamp(16px, 1.6vw, 20px);
  font-weight: 600;
  color: var(--color-black);
}

.reason-desc {
  font-family: var(--font-family);
  font-size: clamp(14px, 1.3vw, 16px);
  font-weight: 400;
  color: var(--color-black);
  line-height: 1.5;
}

/* CTA */
.callphd-cta {
  max-width: 1500px;
  margin: 0 auto;
  padding: clamp(32px, 4vw, 48px) clamp(40px, 5vw, 80px);
  background-color: #f7f7f7;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(16px, 2vw, 32px);
}

.cta-text {
  font-family: var(--font-family);
  font-size: clamp(16px, 1.6vw, 20px);
  font-weight: 400;
  color: var(--color-black);
}

.cta-btn {
  display: inline-block;
  font-family: var(--font-family);
  font-size: clamp(14px, 1.4vw, 16px);
  font-weight: 600;
  color: var(--color-white);
  background-color: var(--color-black);
  border: none;
  border-radius: 50px;
  padding: clamp(12px, 1.5vw, 16px) clamp(24px, 3vw, 40px);
  cursor: pointer;
  white-space: nowrap;
  text-decoration: none;
  text-align: center;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.cta-btn:hover {
  background-color: var(--color-red);
  transform: scale(1.02);
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
    padding:  clamp(5px,2vw,40px);
  }

  .purpose-logos {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    padding:  clamp(5px,2vw,40px);
  }

  /* OBJECTIVES section mobile */
  .objectives-section {
    padding: var(--space-7) var(--space-5);
  }

  .objectives-list {
    padding: clamp(5px, 2vw, 40px);
    gap: var(--space-5);
  }

  .objective-item {
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    gap: var(--space-2) var(--space-3);
  }

  .objective-num {
    font-size: clamp(18px, 4.3vw, 20px);
  }

  .objective-title {
    font-size: clamp(16px, 4.5vw, 20px);
    white-space: normal;
    width: auto;
  }

  .objective-desc {
    grid-column: 1 / -1;
    font-size: clamp(16px, 4.2vw, 18px);
    text-align: left;
  }

  /* SDG section mobile */
  .sdg-section {
    padding: var(--space-7) var(--space-5);
  }

  .sdg-list {
    padding: clamp(5px, 2vw, 40px);
    gap: var(--space-5);
  }

  .sdg-item-header {
    flex-wrap: wrap;
  }

  .sdg-item-title {
    font-size: clamp(16px, 4.5vw, 20px);
  }

  .sdg-tag {
    font-size: clamp(14px, 4vw, 16px);
  }

  .sdg-item-desc {
    font-size: clamp(14px, 4vw, 16px);
    padding-left: clamp(15px, 2.8vw, 30px);
  }

  /* TIMELINE section mobile - swap visibility */
  .timeline-desktop {
    display: none;
  }

  .timeline-mobile {
    display: block;
    width: 100%;
    padding: var(--space-7) var(--space-5);
    background-color: var(--color-white);
  }

  /* CALL FOR PHD section mobile */
  .callphd-section {
    padding: var(--space-7) var(--space-5);
  }

  .callphd-intro,
  .callphd-reasons {
    padding: 0 var(--space-3);
  }

  .reasons-grid {
    grid-template-columns: 1fr;
    gap: var(--space-5);
  }

  .reason-name {
    font-size: clamp(16px, 4.5vw, 18px);
  }

  .reason-desc {
    font-size: clamp(14px, 4vw, 16px);
  }

  .callphd-cta {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
    margin-left: var(--space-3);
    margin-right: var(--space-3);
    padding: var(--space-5) var(--space-4);
  }

  .cta-btn {
    width: 100%;
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
