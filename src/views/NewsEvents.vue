<script setup>
// News & Events: premium hero carousel
// - One focused center card
// - Ghost neighbors (blur + dim + scale + edge mask)
// - Smooth continuous autoplay (RAF), seamless loop via clones + no-flash index reset
// - Subtle parallax on cover image (desktop)
// - Click -> details (markdown fetched at runtime)
// - Pause on hover/touch; respects reduced motion

import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({ html: false, linkify: true, breaks: true })

/* -----------------------------
   Runtime data (JSON + MD)
-------------------------------- */
const loading = ref(true)
const errorMsg = ref('')
const newsItems = ref([])
const mdCache = ref(new Map())

const BASE = import.meta.env.BASE_URL || '/'

function withBase(path) {
  const cleaned = String(path || '').replace(/^\//, '')
  return BASE.replace(/\/?$/, '/') + cleaned
}
function resolveAsset(path) {
  return withBase(path)
}
async function fetchJson(path) {
  const url = withBase(path)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to load JSON: ${url} (${res.status})`)
  const ct = res.headers.get('content-type') || ''
  if (!ct.includes('application/json')) {
    const text = await res.text()
    throw new Error(`Expected JSON but got "${ct}". First chars: ${text.slice(0, 60)}`)
  }
  return await res.json()
}
async function fetchText(path) {
  const url = withBase(path)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to load Markdown: ${url} (${res.status})`)
  return await res.text()
}
async function ensureDetailsLoaded(item) {
  if (!item?.detailsMdPath) return ''
  if (mdCache.value.has(item.detailsMdPath)) return mdCache.value.get(item.detailsMdPath)
  const text = await fetchText(item.detailsMdPath)
  mdCache.value.set(item.detailsMdPath, text)
  return text
}

/* -----------------------------
   Detail view
-------------------------------- */
const selected = ref(null)
const detailsHtml = ref('')

async function openItem(item) {
  try {
    // never open clones
    if (item?._isClone) return

    pause()
    selected.value = item
    const raw = await ensureDetailsLoaded(item)
    detailsHtml.value = md.render(raw || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (e) {
    errorMsg.value = e?.message || String(e)
  }
}
function goBack() {
  selected.value = null
  detailsHtml.value = ''
  resume()
}

/* -----------------------------
   Carousel (continuous autoplay)
-------------------------------- */
const track = ref(null)
const viewport = ref(null)

// clones: [lastClone, ...real, firstClone]
const itemsWithClones = computed(() => {
  const items = newsItems.value
  if (!items?.length) return []
  const first = { ...items[0], _isClone: true }
  const last = { ...items[items.length - 1], _isClone: true }
  return [last, ...items, first]
})

// We keep a float position for continuous motion.
// pos = 1 means first real item aligned.
const pos = ref(1)            // float
const idx = computed(() => Math.round(pos.value)) // nearest integer for class styling

// transition control
const TRANSITION_MS = 680

// autoplay speed (cards per second). 0.18 => ~5.5s per card.
const SPEED = 0.18

const isPaused = ref(false)
const reduceMotion =
  window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false

let rafId = null
let lastTs = 0

function pause() {
  isPaused.value = true
}
function resume() {
  if (reduceMotion) return
  isPaused.value = false
}

// Apply transform based on float pos.
// We DO NOT rely on CSS transition for autoplay; we just update every frame.
function applyTransform() {
  const el = track.value
  if (!el) return
  el.style.transition = 'none'
  el.style.transform = `translateX(${-pos.value * 100}%)`
}

// Seamless loop reset for continuous motion
function normalizeIfNeeded() {
  const n = newsItems.value.length
  if (!n) return

  // pos moves in [0, n+1] because of clones
  // if beyond end clone, wrap back
  if (pos.value > n + 1) {
    pos.value = 1 + (pos.value - (n + 1))
    applyTransform()
  }
  // if beyond start clone, wrap forward
  if (pos.value < 0) {
    pos.value = n + (pos.value - 0)
    applyTransform()
  }
}

function tick(ts) {
  if (!lastTs) lastTs = ts
  const dt = (ts - lastTs) / 1000
  lastTs = ts

  if (!reduceMotion && !isPaused.value && !selected.value) {
    pos.value += SPEED * dt
    applyTransform()
    normalizeIfNeeded()
  }

  rafId = requestAnimationFrame(tick)
}

function stopRAF() {
  if (rafId) cancelAnimationFrame(rafId)
  rafId = null
  lastTs = 0
}

function startRAF() {
  if (reduceMotion) return
  stopRAF()
  rafId = requestAnimationFrame(tick)
}

// Manual nav: snap to next/prev using a short transition (feels premium)
function snapTo(target) {
  const el = track.value
  if (!el) return
  el.style.transition = `transform ${TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
  pos.value = target
  el.style.transform = `translateX(${-pos.value * 100}%)`

  // After snap, remove transition for smooth continuous motion.
  // Also normalize if landed on clone.
  window.setTimeout(() => {
    const n = newsItems.value.length
    if (!n) return

    // if snapped onto end clone (n+1), jump to 1
    if (Math.round(pos.value) === n + 1) {
      pos.value = 1
      applyTransform()
    }
    // if snapped onto start clone (0), jump to n
    if (Math.round(pos.value) === 0) {
      pos.value = n
      applyTransform()
    }
  }, TRANSITION_MS + 10)
}

function next() {
  const n = newsItems.value.length
  if (!n) return
  pause()
  snapTo(Math.round(pos.value) + 1)
  // resume after snap
  window.setTimeout(() => resume(), TRANSITION_MS + 120)
}

function prev() {
  const n = newsItems.value.length
  if (!n) return
  pause()
  snapTo(Math.round(pos.value) - 1)
  window.setTimeout(() => resume(), TRANSITION_MS + 120)
}

/* -----------------------------
   Premium parallax (desktop)
-------------------------------- */
const mouseX = ref(0)
const mouseY = ref(0)
function onMouseMove(e) {
  const el = viewport.value
  if (!el) return
  const r = el.getBoundingClientRect()
  const nx = (e.clientX - r.left) / r.width   // 0..1
  const ny = (e.clientY - r.top) / r.height   // 0..1
  mouseX.value = nx * 2 - 1                   // -1..1
  mouseY.value = ny * 2 - 1
}
const parallaxStyle = computed(() => {
  // very subtle
  const tx = mouseX.value * 10
  const ty = mouseY.value * 6
  return {
    transform: `translate3d(${tx}px, ${ty}px, 0)`
  }
})

/* -----------------------------
   Lifecycle
-------------------------------- */
onMounted(async () => {
  try {
    loading.value = true
    errorMsg.value = ''

    const data = await fetchJson('content/news.json')
    newsItems.value = Array.isArray(data) ? data : []

    await nextTick()

    // init at first real
    pos.value = 1
    applyTransform()
    startRAF()

    // keyboard
    const onKey = (e) => {
      if (selected.value) return
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)

    onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
  } catch (e) {
    errorMsg.value = e?.message || String(e)
  } finally {
    loading.value = false
  }
})

onBeforeUnmount(() => {
  stopRAF()
})

// Touch pause/resume (avoid stuck)
let touchResumeTimer = null
function onTouchStart() {
  pause()
  if (touchResumeTimer) clearTimeout(touchResumeTimer)
  touchResumeTimer = null
}
function onTouchEnd() {
  if (touchResumeTimer) clearTimeout(touchResumeTimer)
  touchResumeTimer = setTimeout(() => resume(), 600)
}
onBeforeUnmount(() => {
  if (touchResumeTimer) clearTimeout(touchResumeTimer)
})
</script>

<template>
  <div class="news-page">
    <div v-if="loading" class="state">Loading…</div>
    <div v-else-if="errorMsg" class="state error">{{ errorMsg }}</div>

    <!-- CAROUSEL -->
    <section v-else-if="!selected" class="hero">
      <div class="hero-head">
        <h1 class="hero-title">NEWS & EVENTS</h1>
        <p class="hero-sub">Featured updates, announcements, and events.</p>
      </div>

      <div
        class="carousel"
        @mouseenter="pause"
        @mouseleave="resume"
        @mousemove="onMouseMove"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
      >
        <!-- soft edge mask -->
        <div class="edge left"></div>
        <div class="edge right"></div>

        <div ref="viewport" class="viewport">
          <div ref="track" class="track">
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
                <div class="cover-wrap">
                  <!-- parallax only affects the image, not the card -->
                  <img class="cover" :style="parallaxStyle" :src="resolveAsset(item.cover)" :alt="item.title" />
                  <div class="cover-glow"></div>
                </div>

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

        <button class="nav prev" type="button" aria-label="Previous" @click="prev">‹</button>
        <button class="nav next" type="button" aria-label="Next" @click="next">›</button>
      </div>

      <div class="hint">Continuous loop. Hover/touch to pause. Click to read details.</div>
    </section>

    <!-- DETAILS -->
    <section v-else class="details">
      <div class="details-header">
        <div class="back" @click="goBack">← Back</div>
      </div>

      <div class="details-hero">
        <img class="details-cover" :src="resolveAsset(selected.cover)" :alt="selected.title" />
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

.state {
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: 14px;
  color: rgba(0,0,0,0.65);
}
.state.error { color: #dd3528; }

.hero-head {
  max-width: 1180px;
  margin: 0 auto 18px auto;
}
.hero-title {
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: clamp(22px, 3vw, 36px);
  font-weight: 900;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
}
.hero-sub {
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  margin: 0;
  opacity: 0.7;
  line-height: 1.7;
}

/* ===== Carousel ===== */
.carousel {
  position: relative;
  max-width: 1180px;
  margin: 0 auto;
  padding: 10px 0 10px 0;
}

.viewport {
  overflow: hidden;
  border-radius: 28px; /* helps the “premium” feel */
}

.track {
  display: flex;
  transform: translateX(-100%);
  will-change: transform;
}

.slide {
  flex: 0 0 100%;
  display: flex;
  justify-content: center;
}

/* Card */
.card {
  width: min(76%, 900px);
  background: #f7f7f7;
  cursor: pointer;
  border-radius: 22px;
  overflow: hidden;
  /* premium shadow */
  box-shadow:
    0 20px 50px rgba(0,0,0,0.10),
    0 2px 10px rgba(0,0,0,0.06);
  transition: transform 520ms cubic-bezier(0.22, 1, 0.36, 1),
              opacity 520ms cubic-bezier(0.22, 1, 0.36, 1),
              filter 520ms cubic-bezier(0.22, 1, 0.36, 1);
  transform-origin: center;
}

/* Active / ghost */
.slide.active .card {
  transform: scale(1);
  opacity: 1;
  filter: blur(0px) saturate(1);
}
.slide.leftGhost .card,
.slide.rightGhost .card {
  transform: scale(0.93);
  opacity: 0.28;
  filter: blur(2.2px) saturate(0.85);
}
/* hide others */
.slide:not(.active):not(.leftGhost):not(.rightGhost) .card {
  opacity: 0;
  filter: blur(3px);
  transform: scale(0.92);
}

/* Cover */
.cover-wrap {
  position: relative;
  width: 100%;
  height: clamp(300px, 38vw, 460px);
  overflow: hidden;
  background: #eaeaea;
}

.cover {
  width: 102%;
  height: 102%;
  object-fit: cover;
  display: block;
  /* smooth parallax */
  transition: transform 200ms ease;
}

/* subtle glow vignette on image */
.cover-glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(1200px 500px at 50% 10%, rgba(255,255,255,0.25), rgba(255,255,255,0) 60%),
    linear-gradient(to bottom, rgba(0,0,0,0.00), rgba(0,0,0,0.10));
  pointer-events: none;
}

.meta {
  padding: 18px 20px 22px 20px;
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
  font-weight: 900;
  font-size: clamp(18px, 1.7vw, 24px);
  line-height: 1.15;
  margin-bottom: 10px;
  letter-spacing: -0.01em;
}
.excerpt {
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.75;
  opacity: 0.75;
  max-width: 62ch;
}

/* Premium edge mask: stronger than simple fade */
.edge {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 18%;
  pointer-events: none;
  z-index: 4;
}
.edge.left {
  left: 0;
  background: linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0));
}
.edge.right {
  right: 0;
  background: linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0));
}

/* Nav arrows */
.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border: none;
  background: rgba(0,0,0,0.08);
  cursor: pointer;
  z-index: 6;
  font-size: 28px;
  line-height: 44px;
  border-radius: 999px;
  transition: background 0.2s ease, transform 0.2s ease;
}
.nav:hover {
  background: rgba(0,0,0,0.14);
  transform: translateY(-50%) scale(1.03);
}
.nav.prev { left: 10px; }
.nav.next { right: 10px; }

.hint {
  max-width: 1180px;
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
.details-header { margin-bottom: 14px; }
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
  border-radius: 14px;
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
  .card { width: 92%; border-radius: 18px; }
  .viewport { border-radius: 18px; }
  .nav { display: none; }
  .details-hero { grid-template-columns: 1fr; }
}
</style>
