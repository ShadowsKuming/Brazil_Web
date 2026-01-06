<script setup>
// Projects.vue (runtime content loading)
// - Reads public/content/projects.json (no rebuild needed for content edits)
// - Loads each project's markdown file via fetch() and caches it
// - Supports GitHub Pages base path via import.meta.env.BASE_URL

import { computed, onMounted, ref, watch } from 'vue'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({ html: false, linkify: true, breaks: true })

const index = ref(0)
const projects = ref([]) // loaded from JSON
const mdCache = ref(new Map()) // key: detailsMdPath, value: markdown text
const loading = ref(true)
const errorMsg = ref('')

// IMPORTANT: supports subpath deploy (e.g., GitHub Pages /repo-name/)
const BASE = import.meta.env.BASE_URL || '/'

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
  if (i < 0) index.value = projects.value.length - 1
  else if (i >= projects.value.length) index.value = 0
  else index.value = i
}

function next() {
  go(index.value + 1)
}
function prev() {
  go(index.value - 1)
}

onMounted(async () => {
  try {
    loading.value = true
    errorMsg.value = ''

    // 1) Load JSON metadata
    const data = await fetchJson('content/projects.json')
    projects.value = Array.isArray(data) ? data : []

    // 2) Render first project
    index.value = 0
    await renderCurrent()
  } catch (e) {
    errorMsg.value = e?.message || String(e)
  } finally {
    loading.value = false
  }
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
    <div v-if="loading" class="state">Loading…</div>
    <div v-else-if="errorMsg" class="state error">{{ errorMsg }}</div>

    <div v-else class="slider">
      <button class="nav prev" type="button" aria-label="Previous" @click="prev">‹</button>

      <div class="viewport">
        <div class="track" :style="{ transform: `translateX(${-index * 100}%)` }">
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
                  <span v-for="k in (p.keywords || [])" :key="k" class="pill">{{ k }}</span>
                </div>
              </div>

              <!-- Only the current panel uses v-html to avoid rendering 5 markdown blocks at once -->
              <div v-if="current && current.id === p.id" class="content markdown" v-html="currentHtml"></div>
              <div v-else class="content placeholder"> </div>
            </div>
          </section>
        </div>
      </div>

      <button class="nav next" type="button" aria-label="Next" @click="next">›</button>
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
.projects-page {
  width: 100%;
  box-sizing: border-box;
  padding: clamp(18px, 4vw, 48px) clamp(14px, 3.85vw, 56px);
}

.state {
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: 14px;
  color: rgba(0,0,0,0.65);
}
.state.error {
  color: #dd3528;
}

/* Slider skeleton */
.slider {
  position: relative;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 48px 1fr 48px;
  align-items: center;
  gap: 10px;
}

.viewport {
  overflow: hidden;
}

.track {
  display: flex;
  width: 100%;
  transition: transform 520ms ease;
  will-change: transform;
}

.panel {
  flex: 0 0 100%;
  display: flex;
  justify-content: center;
}

/* Card layout (match screenshot + better large-screen readability) */
.card {
  width: min(80vw, 1100px);
  background: #f7f7f7;
  padding: clamp(22px, 3vw, 36px);
  box-sizing: border-box;
}

/* Info rows */
.row {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 14px;
  align-items: baseline;
  margin-bottom: 12px;
}

.row.small {
  margin-bottom: 10px;
}

.label {
  color: rgba(0, 0, 0, 0.45);
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: clamp(13px, 0.95vw, 15px);
  line-height: 1.4;
}

.title {
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-weight: 800;
  font-size: clamp(22px, 2.6vw, 36px);
  line-height: 1.15;
}

.value {
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-weight: 600;
  font-size: clamp(14px, 1.2vw, 18px);
}

/* Keywords */
.keywords .pills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pill {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(0, 0, 0, 0.28);
  background: transparent;
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-weight: 700;
  font-size: clamp(11px, 0.85vw, 12px);
  letter-spacing: 0.3px;
}

/* Markdown */
.content {
  margin-top: 16px;
}
.placeholder {
  height: 1px; /* keep spacing stable for non-active panels */
}

.markdown {
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  color: rgba(0, 0, 0, 0.85);
  font-size: clamp(15px, 1.1vw, 18px);
  line-height: 1.9;
}

.markdown :deep(h1) {
  font-size: clamp(20px, 2vw, 28px);
  font-weight: 900;
  margin: 20px 0 12px;
  line-height: 1.2;
}

.markdown :deep(h2) {
  font-size: clamp(18px, 1.6vw, 24px);
  font-weight: 800;
  margin: 22px 0 12px;
  line-height: 1.25;
}

.markdown :deep(h3) {
  font-size: clamp(16px, 1.4vw, 20px);
  font-weight: 700;
  margin: 18px 0 10px;
  line-height: 1.25;
}

.markdown :deep(p) {
  margin: 0 0 14px 0;
  line-height: 1.9;
}

.markdown :deep(ul),
.markdown :deep(ol) {
  margin: 0 0 14px 0;
  padding-left: 18px;
}

.markdown :deep(li) {
  margin: 6px 0;
  line-height: 1.85;
}

/* Nav buttons */
.nav {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.08);
  cursor: pointer;
  font-size: 26px;
  line-height: 44px;
}
.nav:hover {
  background: rgba(0, 0, 0, 0.14);
}

/* Dots */
.dots {
  max-width: 1100px;
  margin: 14px auto 0 auto;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  border: none;
  background: rgba(0, 0, 0, 0.22);
  cursor: pointer;
}
.dot.active {
  background: #dd3528;
}

/* Responsive */
@media (max-width: 720px) {
  .slider {
    grid-template-columns: 1fr;
  }
  .nav {
    display: none;
  }
  .row {
    grid-template-columns: 1fr;
    gap: 6px;
  }
  .card {
    width: 100%;
    padding: 18px;
  }
}
</style>
