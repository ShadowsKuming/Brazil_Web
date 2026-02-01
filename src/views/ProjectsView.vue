<script setup>
// Projects.vue (runtime content loading)
// - Reads public/content/projects.json (no rebuild needed for content edits)
// - Loads each project's markdown file via fetch() and caches it
// - Supports GitHub Pages base path via import.meta.env.BASE_URL

import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({ html: false, linkify: true, breaks: true })

const index = ref(0)
const projects = ref([]) // loaded from JSON
const mdCache = ref(new Map()) // key: detailsMdPath, value: markdown text
const loading = ref(true)
const errorMsg = ref('')
const viewportRef = ref(null)
const isScrolling = ref(false)
const isPaused = ref(false)
let autoScrollInterval = null
const AUTO_SCROLL_DELAY = 5000 // 5 seconds per project

// IMPORTANT: supports subpath deploy (e.g., GitHub Pages /repo-name/)
const BASE = import.meta.env.BASE_URL || '/'

const isMobile = ref(false)

function checkIsMobile() {
  const mobile = window.matchMedia('(max-width: 768px)').matches
  if (mobile && autoScrollInterval) stopAutoScroll()
  if (!mobile && !autoScrollInterval) startAutoScroll()
  isMobile.value = mobile
}

function withBase(path) {
  // Accept both "content/xx" and "/content/xx"
  const cleaned = String(path || '').replace(/^\//, '')
  return BASE.replace(/\/?$/, '/') + cleaned
}

async function fetchJson(path) {
  const res = await fetch(withBase(path))
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`)
  return await res.json()
}



async function fetchText(path) {
  const res = await fetch(withBase(path))
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`)
  return await res.text()
}

async function ensureMarkdownLoaded(p) {
  if (!p?.detailsMdPath) return ''
  if (mdCache.value.has(p.detailsMdPath)) return mdCache.value.get(p.detailsMdPath)

  const text = await fetchText(p.detailsMdPath)
  mdCache.value.set(p.detailsMdPath, text)
  return text
}

const current = computed(() => projects.value[index.value] || null)

const currentHtml = ref('') // rendered html for current markdown

async function renderCurrent() {
  const p = current.value
  if (!p) {
    currentHtml.value = ''
    return
  }
  const raw = await ensureMarkdownLoaded(p)
  currentHtml.value = md.render(raw || '')
}

function go(i) {
  if (!projects.value.length) return
  if (i < 0) i = projects.value.length - 1
  else if (i >= projects.value.length) i = 0

  index.value = i

  const viewport = viewportRef.value
  if (!viewport) return

  const panels = viewport.querySelectorAll('.panel')
  const target = panels[i]
  if (!target) return

  isScrolling.value = true
  viewport.scrollTo({ left: target.offsetLeft, behavior: 'smooth' })
  setTimeout(() => (isScrolling.value = false), 600)
}

// Handle scroll to update index based on scroll position
function onScroll() {
  if (isScrolling.value || !viewportRef.value) return

  const viewport = viewportRef.value
  const panels = viewport.querySelectorAll('.panel')
  if (!panels.length) return

  const left = viewport.scrollLeft

  let best = 0
  let bestDist = Infinity

  panels.forEach((el, i) => {
    const dist = Math.abs(el.offsetLeft - left)
    if (dist < bestDist) {
      bestDist = dist
      best = i
    }
  })

  if (best !== index.value) index.value = best
}

// Auto-scroll functions
function startAutoScroll() {
  if (autoScrollInterval) return
  autoScrollInterval = setInterval(() => {
    if (!isPaused.value && projects.value.length > 0) {
      const nextIndex = (index.value + 1) % projects.value.length
      go(nextIndex)
    }
  }, AUTO_SCROLL_DELAY)
}

function stopAutoScroll() {
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval)
    autoScrollInterval = null
  }
}

function pauseAutoScroll() {
  isPaused.value = true
}

function resumeAutoScroll() {
  isPaused.value = false
}

onMounted(async () => {
  try {
    loading.value = true
    errorMsg.value = ''

    const data = await fetchJson('content/projects.json')
    projects.value = Array.isArray(data) ? data : []

    index.value = 0
    await renderCurrent()

    checkIsMobile()
    if (!isMobile.value) startAutoScroll()
  } catch (e) {
    errorMsg.value = e?.message || String(e)
  } finally {
    loading.value = false
  }
})

onMounted(() => {
  window.addEventListener('resize', checkIsMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkIsMobile)
  stopAutoScroll()
})


// when index changes, load+render the new project's markdown
watch(index, async () => {
  try {
    await renderCurrent()
  } catch (e) {
    errorMsg.value = e?.message || String(e)
  }
})
</script>

<template>
  <div class="projects-page">
    <!-- Page Header -->
    <header class="page-header">
      <div class="header-title-row">
        <h1 class="header-title">PROJECT PROPOSALS</h1>
      </div>
      <p class="header-desc">
        Explore our five collaborative research projects, each led by cross-national teams
        developing inclusive AI prototypes for marginalised children in Brazil.
      </p>
    </header>

    <div v-if="loading" class="state">Loading…</div>
    <div v-else-if="errorMsg" class="state error">{{ errorMsg }}</div>

    <div
      v-else
      class="slider"
      @mouseenter="pauseAutoScroll"
      @mouseleave="resumeAutoScroll"
      @touchstart="pauseAutoScroll"
      @touchend="resumeAutoScroll"
    >
      <div class="viewport" ref="viewportRef" @scroll="onScroll">
        <div class="track">
          <section v-for="p in projects" :key="p.id" class="panel">
            <div class="card">
              <div class="row">
                <div class="label">Provisional Title:</div>
                <div class="title">{{ p.provisionalTitle }}</div>
              </div>

              <div class="row small">
                <div class="label">Name:</div>
                <div class="value">{{ p.name }}</div>
              </div>

              <div class="row small keywords">
                <div class="label">Key Words:</div>
                <div class="pills">
                  <a
                    v-for="k in (p.keywords || [])"
                    :key="k"
                    :href="`https://www.google.com/search?q=${encodeURIComponent(k)}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="pill"
                  >{{ k }}</a>
                </div>
              </div>

              <!-- Only the current panel uses v-html to avoid rendering 5 markdown blocks at once -->
              <div v-if="current && current.id === p.id" class="content markdown" v-html="currentHtml"></div>
              <div v-else class="content placeholder"> </div>
            </div>
          </section>
        </div>
      </div>
    </div>

    <div v-if="!loading && !errorMsg" class="dots">
      <button
        v-for="(p, i) in projects"
        :key="p.id"
        type="button"
        class="dot"
        :class="{ active: i === index }"
        @click="go(i)"
        aria-label="Go to project"
      />
    </div>
  </div>
</template>

<style scoped>
/* ============================================
   PAGE LAYOUT
   ============================================ */
.projects-page {
  width: 100%;
  box-sizing: border-box;
  padding: clamp(30px, 6vw, 100px) clamp(40px, 8vw, 200px);
  background-color: var(--color-white);
}

/* ============================================
   PAGE HEADER
   ============================================ */
.page-header {
  max-width: 1400px;
  margin: 0 auto clamp(40px, 5vw, 80px);
}

.header-title-row {
  display: flex;
  align-items: center;
  gap: clamp(16px, 2vw, 32px);
  margin-bottom: clamp(16px, 2vw, 24px);
}

.header-title {
  font-family: 'Inter', sans-serif;
  font-size: clamp(22px, 3.2vw, 35px);
  font-weight: 600;
  color: var(--color-black);
  text-transform: uppercase;
  line-height: 1;
  letter-spacing: 0;
  flex-shrink: 0;
}

.header-line {
  flex: 1;
  height: 1px;
  background-color: var(--color-black);
}

.header-desc {
  font-family: var(--font-family);
  font-size: clamp(16px, 1.6vw, 20px);
  font-weight: 400;
  color: var(--color-black);
  line-height: 1.5;
  max-width: 800px;
}

/* ============================================
   LOADING / ERROR STATES
   ============================================ */
.state {
  font-family: var(--font-family);
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  text-align: center;
  padding: var(--space-6);
}

.state.error {
  color: var(--color-red);
}

/* ============================================
   SLIDER
   ============================================ */
.slider {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
}

.viewport {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scroll-snap-stop: always;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.viewport::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.track {
  display: flex;
  width: 100%;
  flex: 0 0 auto;
}

.panel {
  flex: 0 0 100%;
  display: flex;
  justify-content: center;
  scroll-snap-align: start;
}

/* ============================================
   PROJECT CARD
   ============================================ */
.card {
  width: 100%;
  max-width: 1100px;
  background: var(--color-gray-light);
  padding: clamp(24px, 3vw, 48px);
  box-sizing: border-box;
  border-radius: 8px;
}

/* Info rows */
.row {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: clamp(12px, 1.5vw, 20px);
  align-items: baseline;
  margin-bottom: clamp(12px, 1.5vw, 16px);
}

.row.small {
  margin-bottom: clamp(10px, 1.2vw, 14px);
}

.label {
  color: rgba(0, 0, 0, 0.5);
  font-family: var(--font-family);
  font-size: clamp(13px, 1vw, 15px);
  font-weight: 500;
  line-height: 1.4;
}

.title {
  font-family: var(--font-family);
  font-weight: 600;
  font-size: clamp(20px, 2.2vw, 32px);
  line-height: 1.2;
  color: var(--color-black);
}

.value {
  font-family: var(--font-family);
  font-weight: 600;
  font-size: clamp(14px, 1.2vw, 18px);
  color: var(--color-black);
}

/* Keywords pills */
.keywords .pills {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(8px, 1vw, 12px);
}

.pill {
  display: inline-flex;
  align-items: center;
  padding: clamp(6px, 0.6vw, 8px) clamp(12px, 1.2vw, 16px);
  border-radius: 999px;
  border: 1.5px solid var(--color-black);
  background: transparent;
  font-family: var(--font-family);
  font-weight: 600;
  font-size: clamp(11px, 0.9vw, 13px);
  color: var(--color-black);
  letter-spacing: 0.3px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pill:hover {
  background: var(--color-black);
  color: var(--color-white);
  transform: translateY(-1px);
}

/* ============================================
   MARKDOWN CONTENT
   ============================================ */
.content {
  margin-top: clamp(20px, 2.5vw, 32px);
  padding-top: clamp(20px, 2.5vw, 32px);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.placeholder {
  height: 1px;
}

.markdown {
  font-family: var(--font-family);
  color: var(--color-black);
  font-size: clamp(15px, 1.1vw, 18px);
  line-height: 1.8;
}

.markdown :deep(h1) {
  font-size: clamp(20px, 2vw, 28px);
  font-weight: 600;
  margin: clamp(24px, 3vw, 32px) 0 clamp(12px, 1.5vw, 16px);
  line-height: 1.2;
  color: var(--color-black);
}

.markdown :deep(h2) {
  font-size: clamp(18px, 1.6vw, 24px);
  font-weight: 600;
  margin: clamp(20px, 2.5vw, 28px) 0 clamp(10px, 1.2vw, 14px);
  line-height: 1.25;
  color: var(--color-black);
}

.markdown :deep(h3) {
  font-size: clamp(16px, 1.4vw, 20px);
  font-weight: 600;
  margin: clamp(16px, 2vw, 24px) 0 clamp(8px, 1vw, 12px);
  line-height: 1.25;
  color: var(--color-black);
}

.markdown :deep(p) {
  margin: 0 0 clamp(12px, 1.5vw, 16px) 0;
  line-height: 1.8;
}

.markdown :deep(ul),
.markdown :deep(ol) {
  margin: 0 0 clamp(12px, 1.5vw, 16px) 0;
  padding-left: clamp(16px, 2vw, 24px);
}

.markdown :deep(li) {
  margin: clamp(4px, 0.5vw, 8px) 0;
  line-height: 1.7;
}

.markdown :deep(a) {
  color: var(--color-red);
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.markdown :deep(a:hover) {
  opacity: 0.8;
}

.markdown :deep(strong) {
  font-weight: 600;
}

/* ============================================
   DOTS PAGINATION
   ============================================ */
.dots {
  max-width: 1400px;
  margin: clamp(20px, 2.5vw, 32px) auto 0;
  display: flex;
  justify-content: center;
  gap: clamp(8px, 1vw, 12px);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  border: none;
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot:hover {
  background: rgba(0, 0, 0, 0.4);
  transform: scale(1.2);
}

.dot.active {
  background: var(--color-red);
  transform: scale(1.2);
}

/* ============================================
   RESPONSIVE - TABLET (max-width: 1024px)
   ============================================ */
@media (max-width: 1024px) {
  .projects-page {
    padding: var(--space-7) var(--space-6);
  }
}

/* ============================================
   RESPONSIVE - MOBILE (max-width: 768px)
   ============================================ */
@media (max-width: 768px) {
  .projects-page {
    padding: var(--space-6) var(--space-4);
  }

  .page-header {
    margin-bottom: var(--space-6);
  }

  .header-title {
    font-size: clamp(20px, 5.5vw, 28px);
  }

  .header-desc {
    font-size: clamp(14px, 4vw, 16px);
  }

  .card {
    padding: var(--space-5);
    border-radius: 6px;
  }

  .row {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }

  .label {
    font-size: clamp(12px, 3.5vw, 14px);
  }

  .title {
    font-size: clamp(18px, 5vw, 24px);
  }

  .value {
    font-size: clamp(14px, 4vw, 16px);
  }

  .pill {
    font-size: clamp(10px, 3vw, 12px);
    padding: 5px 10px;
  }

  .content {
    margin-top: var(--space-4);
    padding-top: var(--space-4);
  }

  .markdown {
    font-size: clamp(14px, 4vw, 16px);
  }

  .dots {
    margin-top: var(--space-5);
  }

  .dot {
    width: 8px;
    height: 8px;
  }
}
</style>
