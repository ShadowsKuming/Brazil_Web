<script setup>
// News & Events: "hero carousel" style
// Requirements implemented:
// - One large centered card (focus)
// - Left/right cards partially visible as "ghost" (opacity/scale/blur)
// - Autoplay looping forever (seamless via clones)
// - Click card -> details (Markdown)
// - Pause on hover/touch; supports reduced motion

import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import MarkdownIt from 'markdown-it'
import { newsItems } from '@/content/news'

const md = new MarkdownIt({ html: false, linkify: true, breaks: true })

// Detail view
const selected = ref(null)
const detailsHtml = computed(() => (selected.value ? md.render(selected.value.detailsMd || '') : ''))

function openItem(item) {
  selected.value = item
  pause()
}
function goBack() {
  selected.value = null
  resume()
}

// Carousel setup
const track = ref(null)
const isPaused = ref(false)

// Autoplay config
const AUTOPLAY_MS = 3200
const TRANSITION_MS = 620

// We use clones for seamless looping: [last, ...items, first]
const itemsWithClones = computed(() => {
  if (newsItems.length === 0) return []
  const first = newsItems[0]
  const last = newsItems[newsItems.length - 1]
  return [last, ...newsItems, first]
})

// Index in the "withClones" array.
// Start at 1 => first real item.
const idx = ref(1)

// Motion preference
const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false

let timer = null

function pause() {
  isPaused.value = true
}
function resume() {
  if (reduceMotion) return
  isPaused.value = false
}

function stopAutoplay() {
  if (timer) clearInterval(timer)
  timer = null
}

function startAutoplay() {
  if (reduceMotion) return
  stopAutoplay()
  timer = setInterval(() => {
    if (!isPaused.value && !selected.value) next()
  }, AUTOPLAY_MS)
}

function setTransform(animate = true) {
  const el = track.value
  if (!el) return
  el.style.transition = animate ? `transform ${TRANSITION_MS}ms ease` : 'none'
  el.style.transform = `translateX(${-idx.value * 100}%)`
}

// Move
function next() {
  idx.value += 1
  setTransform(true)
}

function prev() {
  idx.value -= 1
  setTransform(true)
}

// After transition ends, if we are on clones, jump to corresponding real index without animation.
function onTransitionEnd() {
  const n = newsItems.length
  if (n === 0) return

  // If moved to the last clone (at end), jump to first real
  if (idx.value === n + 1) {
    idx.value = 1
    setTransform(false)
  }

  // If moved to the first clone (at start), jump to last real
  if (idx.value === 0) {
    idx.value = n
    setTransform(false)
  }
}

onMounted(() => {
  // Initial position
  setTransform(false)
  startAutoplay()

  // Keyboard (optional, nice for desktop)
  const onKey = (e) => {
    if (selected.value) return
    if (e.key === 'ArrowRight') next()
    if (e.key === 'ArrowLeft') prev()
  }
  window.addEventListener('keydown', onKey)

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKey)
  })
})

onBeforeUnmount(() => {
  stopAutoplay()
})
</script>

<template>
  <div class="news-page">
    <!-- LIST / CAROUSEL -->
    <section v-if="!selected" class="hero">
      <div class="hero-head">
        <h1 class="hero-title">NEWS & EVENTS</h1>
        <p class="hero-sub">Featured updates, announcements, and events.</p>
      </div>

      <div
        class="carousel"
        @mouseenter="pause"
        @mouseleave="resume"
        @touchstart="pause"
        @touchend="resume"
      >
        <!-- Fade edges to make side cards feel like "ghost" -->
        <div class="edge-fade left"></div>
        <div class="edge-fade right"></div>

        <div class="viewport">
          <div ref="track" class="track" @transitionend="onTransitionEnd">
            <article
              v-for="(item, i) in itemsWithClones"
              :key="`${item.id}-${i}`"
              class="slide"
              :class="{
                active: i === idx,
                leftGhost: i === idx - 1,
                rightGhost: i === idx + 1
              }"
              @click="openItem(item)"
            >
              <div class="card">
                <img class="cover" :src="item.cover" :alt="item.title" />
                <div class="meta">
                  <div class="topline">
                    <span class="source">{{ item.source }}</span>
                    <span class="dot">•</span>
                    <span class="date">{{ item.date }}</span>
                  </div>
                  <div class="title">{{ item.title }}</div>
                  <div class="excerpt">{{ item.excerpt }}</div>
                </div>
              </div>
            </article>
          </div>
        </div>

        <!-- Controls (optional; remove if you don't want) -->
        <button class="nav prev" type="button" aria-label="Previous" @click="prev">‹</button>
        <button class="nav next" type="button" aria-label="Next" @click="next">›</button>
      </div>

      <div class="hint">Auto-loops. Hover/touch to pause. Click to read details.</div>
    </section>

    <!-- DETAILS -->
    <section v-else class="details">
      <div class="details-header">
        <div class="back" @click="goBack">← Back</div>
      </div>

      <div class="details-hero">
        <img class="details-cover" :src="selected.cover" :alt="selected.title" />
        <div class="details-meta">
          <div class="details-topline">
            <span class="source">{{ selected.source }}</span>
            <span class="dot">•</span>
            <span class="date">{{ selected.date }}</span>
          </div>
          <div class="details-title">{{ selected.title }}</div>
          <div class="details-excerpt">{{ selected.excerpt }}</div>
        </div>
      </div>

      <div class="markdown" v-html="detailsHtml"></div>
    </section>
  </div>
</template>

<style scoped>
/* ===== Page ===== */
.news-page {
  width: 100%;
  box-sizing: border-box;
  padding: clamp(18px, 5vw, 56px) clamp(14px, 3.85vw, 56px);
}

.hero-head {
  max-width: 1100px;
  margin: 0 auto 18px auto;
}
.hero-title {
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: clamp(22px, 3vw, 34px);
  font-weight: 800;
  margin: 0 0 8px 0;
}
.hero-sub {
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  margin: 0;
  opacity: 0.7;
  line-height: 1.6;
}

/* ===== Carousel ===== */
.carousel {
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
  padding: 8px 0 10px 0;
}

.viewport {
  overflow: hidden;
}

/*
We make each slide take 100% of the viewport width,
but the "card" inside is narrower (e.g. 78%),
so left/right slides become partially visible ("ghost").
*/
.track {
  display: flex;
  transform: translateX(-100%);
  will-change: transform;
}

.slide {
  flex: 0 0 100%;
  display: flex;
  justify-content: center;
  pointer-events: auto;
}

/* Card sizing: main big, side ghost by class */
.card {
  width: min(78%, 860px);
  background: #f7f7f7;
  cursor: pointer;
  transition: transform 420ms ease, opacity 420ms ease, filter 420ms ease;
  transform-origin: center;
}

/* Main active card */
.slide.active .card {
  transform: scale(1);
  opacity: 1;
  filter: blur(0px);
}

/* Ghost cards: only the immediate neighbors look ghosty */
.slide.leftGhost .card,
.slide.rightGhost .card {
  transform: scale(0.94);
  opacity: 0.35;
  filter: blur(1.2px);
}

/* Non-neighbor slides: keep invisible to avoid weird flashes */
.slide:not(.active):not(.leftGhost):not(.rightGhost) .card {
  opacity: 0;
  filter: blur(2px);
  transform: scale(0.92);
}

.cover {
  width: 100%;
  height: clamp(260px, 36vw, 430px); /* big image */
  object-fit: cover;
  display: block;
}

.meta {
  padding: 16px 18px 20px 18px;
}

.topline {
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0.75;
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: 12px;
  margin-bottom: 10px;
}
.title {
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-weight: 800;
  font-size: clamp(16px, 1.6vw, 22px);
  line-height: 1.2;
  margin-bottom: 10px;
}
.excerpt {
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.65;
  opacity: 0.75;
  max-width: 60ch;
}

/* Edge fade (gives "virtual ghost" feeling even nicer) */
.edge-fade {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 16%;
  pointer-events: none;
  z-index: 3;
}
.edge-fade.left {
  left: 0;
  background: linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0));
}
.edge-fade.right {
  right: 0;
  background: linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0));
}

/* Nav arrows */
.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 42px;
  height: 42px;
  border: none;
  background: rgba(0,0,0,0.08);
  cursor: pointer;
  z-index: 5;
  font-size: 26px;
  line-height: 42px;
  border-radius: 999px;
}
.nav:hover {
  background: rgba(0,0,0,0.14);
}
.nav.prev { left: 8px; }
.nav.next { right: 8px; }

.hint {
  max-width: 1100px;
  margin: 12px auto 0 auto;
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: 12px;
  opacity: 0.65;
}

/* ===== Details ===== */
.details {
  max-width: 1100px;
  margin: 0 auto;
}
.details-header {
  margin-bottom: 14px;
}
.back {
  cursor: pointer;
  color: #dd3528;
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
}

.details-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(14px, 2vw, 24px);
  align-items: start;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0,0,0,0.08);
  margin-bottom: 18px;
}
.details-cover {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}
.details-meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.details-topline {
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0.75;
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: 12px;
}
.details-title {
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-weight: 900;
  font-size: clamp(20px, 2.2vw, 30px);
  line-height: 1.15;
}
.details-excerpt {
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.7;
  opacity: 0.75;
}

/* Markdown */
.markdown {
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  color: #111;
}
.markdown :deep(h1),
.markdown :deep(h2),
.markdown :deep(h3) {
  margin: 16px 0 10px;
  line-height: 1.2;
}
.markdown :deep(p) {
  margin: 0 0 12px 0;
  line-height: 1.75;
}
.markdown :deep(ul),
.markdown :deep(ol) {
  margin: 0 0 12px 0;
  padding-left: 18px;
}
.markdown :deep(li) {
  margin: 6px 0;
  line-height: 1.7;
}
.markdown :deep(a) {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* Responsive */
@media (max-width: 900px) {
  .card { width: 90%; }
  .details-hero { grid-template-columns: 1fr; }
  .nav { display: none; } /* optional */
}
</style>
