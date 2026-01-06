<script setup>
// Prototypes page (List -> Details) using runtime JSON + Markdown.
// After build, you can update content by editing files in:
// - dist/content/prototypes.json
// - dist/content/prototypes/*.md
// without rebuilding the app.

import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import MarkdownIt from 'markdown-it'

// Markdown renderer (safe: no raw HTML)
const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
})

/** Deployment base (supports GitHub Pages subpath) */
const BASE = import.meta.env.BASE_URL || '/'

function withBase(path) {
  // Accept both "content/xx" and "/content/xx"
  const cleaned = String(path || '').replace(/^\//, '')
  return BASE.replace(/\/?$/, '/') + cleaned
}

async function fetchJson(path) {
  const url = withBase(path)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to load JSON: ${url} (${res.status})`)

  // Helpful guard: if server returned HTML fallback, catch early
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

/** State */
const loading = ref(true)
const errorMsg = ref('')
const prototypes = ref([])        // list loaded from JSON
const selected = ref(null)        // selected prototype object
const mdCache = ref(new Map())    // key: detailsMdPath, value: markdown text
const detailsHtml = ref('')       // rendered HTML

function resolveAsset(path) {
  // images stored in public/ => runtime URL
  return withBase(path)
}

async function ensureMarkdownLoaded(p) {
  if (!p?.detailsMdPath) return ''
  if (mdCache.value.has(p.detailsMdPath)) return mdCache.value.get(p.detailsMdPath)

  const text = await fetchText(p.detailsMdPath)
  mdCache.value.set(p.detailsMdPath, text)
  return text
}

async function goDetails(p) {
  try {
    errorMsg.value = ''
    selected.value = p
    console.log('[details] id=', p.id, 'mdPath=', p.detailsMdPath)
    const raw = await ensureMarkdownLoaded(p)
    console.log('[details] md length=', raw?.length)
    detailsHtml.value = md.render(raw || '')
    // optional: scroll to top when entering details
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (e) {
    console.error(e)
    errorMsg.value = e?.message || String(e)
  }
}



function goBack() {
  selected.value = null
  detailsHtml.value = ''
}

/** Load list on mount */
onMounted(async () => {
  try {
    loading.value = true
    errorMsg.value = ''

    const data = await fetchJson('content/prototypes.json')
    prototypes.value = Array.isArray(data) ? data : []
  } catch (e) {
    errorMsg.value = e?.message || String(e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="prototypes">
    <div v-if="loading" class="state">Loading…</div>
    <div v-else-if="errorMsg" class="state error">{{ errorMsg }}</div>

    <!-- LIST VIEW -->
    <section v-else-if="!selected" class="prototypes-list">
      <div class="prototypes-title">
        <img src="@/assets/special_fonts/prototypes/prototypes.png" alt="Prototypes" />
      </div>

      <div class="prototypes-content">
        <article v-for="p in prototypes" :key="p.id" class="prototype-item">
          <img class="prototype-item-image" :src="resolveAsset(p.image)" :alt="p.name" />

          <div class="prototype-item-title">
            <div class="proto-date">{{ p.date }}</div>
            <div class="proto-name">{{ p.name }}</div>
          </div>

          <div class="prototype-item-content">
            <div class="prototype-item-abstract">{{ p.abstract }}</div>
            <div class="prototype-item-readmore" @click="goDetails(p)"></div>
          </div>
        </article>
      </div>
    </section>

    <!-- DETAILS VIEW -->
    <section v-else class="prototype-details">
      <div class="prototype-details-header">
        <div class="prototype-details-title">
          <div class="details-date">{{ selected.date }}</div>
          <div class="details-name">{{ selected.name }}</div>
        </div>

        <div class="prototype-details-back" @click="goBack">← Back to Prototypes</div>
      </div>

      <img class="prototype-details-image" :src="resolveAsset(selected.image)" :alt="selected.name" />

      <!-- Markdown output -->
      <div class="prototype-details-content markdown" v-html="detailsHtml"></div>
    </section>
  </div>
</template>

<style scoped>
/* ===== Page layout ===== */
.prototypes {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.state {
  width: 100%;
  max-width: 1100px;
  padding: 18px;
  box-sizing: border-box;
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: 14px;
  color: rgba(0,0,0,0.65);
}
.state.error {
  color: #dd3528;
}

/* ===== List title ===== */
.prototypes-title {
  width: 100%;
  margin-top: 5vw;
  margin-bottom: 5vw;
  padding-left: 7vw;
  display: flex;
  justify-content: flex-start;
}

.prototypes-title img {
  width: 27vw;
  height: auto;
  display: block;
}

/* ===== Grid list ===== */
.prototypes-content {
  padding: 2vw 1vw;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.8vw;
}

.prototype-item {
  display: flex;
  flex-direction: column;
}

.prototype-item-image {
  width: 43vw;
  height: 30.5vw;
  object-fit: cover;
  display: block;
}

.prototype-item-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 1vw;
  margin-bottom: 1vw;
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
}

.proto-date {
  opacity: 0.75;
}

.prototype-item-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5vw;
  padding-bottom: 2.5vw;
}

.prototype-item-abstract {
  width: 23.1vw;
  font-family: 'Reddit Sans', sans-serif;
  font-weight: 400;
  font-size: 1vw;
  line-height: 1.55;
}

/* "Read More" masked button */
.prototype-item-readmore {
  width: 5vw;
  height: 1.5vw;
  background-color: #000000;
  transition: background-color 0.3s ease, transform 0.2s ease;

  mask-image: url('@/assets/special_fonts/prototypes/Read More.png');
  mask-repeat: no-repeat;
  mask-size: contain;
  mask-position: center;
}
.prototype-item-readmore:hover {
  cursor: pointer;
  background-color: #dd3528;
  transform: scale(1.02);
}

/* ===== Details view ===== */
.prototype-details {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: clamp(16px, 2vw, 32px) clamp(16px, 5vw, 72px);
  box-sizing: border-box;
}

.prototype-details-header {
  width: 100%;
  max-width: 1100px;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 18px;
}

.prototype-details-title {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
}

.details-date {
  opacity: 0.7;
  font-size: 14px;
}

.details-name {
  font-size: clamp(20px, 2vw, 28px);
  font-weight: 600;
}

.prototype-details-back {
  cursor: pointer;
  color: black;
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
}
.prototype-details-back:hover {
  color: #dd3528;
}

.prototype-details-image {
  width: 100%;
  max-width: 1100px;
  height: auto;
  object-fit: cover;
  display: block;
  margin-bottom: 18px;
}

/* ===== Markdown typography ===== */
.markdown {
  width: 100%;
  max-width: 1100px;
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  color: #111;
}

.markdown :deep(h1),
.markdown :deep(h2),
.markdown :deep(h3) {
  margin: 18px 0 10px;
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

/* ===== Responsive: 2 columns -> 1 column ===== */
@media (max-width: 900px) {
  .prototypes-content {
    grid-template-columns: 1fr;
  }

  .prototype-item-image {
    width: 90vw;
    height: 64vw;
  }

  .prototype-item-abstract {
    width: 65vw;
    font-size: 14px;
  }

  .prototype-item-readmore {
    width: 96px;
    height: 26px;
  }
}
</style>
