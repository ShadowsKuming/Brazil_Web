<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({ html: false, linkify: true, breaks: true })

const projects = ref([])
const mdCache = ref(new Map())
const loading = ref(true)
const errorMsg = ref('')
const selected = ref(null) // selected project object, null = grid view

const router = useRouter()
const BASE = import.meta.env.BASE_URL || '/'

function withBase(path) {
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

const detailHtml = ref('')

async function openProject(p) {
  selected.value = p
  try {
    const raw = await ensureMarkdownLoaded(p)
    detailHtml.value = md.render(raw || '')
  } catch (e) {
    detailHtml.value = '<p>Failed to load project details.</p>'
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function goBack() {
  selected.value = null
  detailHtml.value = ''
}

function goToPerson(personId) {
  if (!personId) return
  router.push({ path: '/people', query: { id: personId } })
}

onMounted(async () => {
  try {
    loading.value = true
    errorMsg.value = ''
    const data = await fetchJson('content/projects.json')
    projects.value = Array.isArray(data) ? data : []
  } catch (e) {
    errorMsg.value = e?.message || String(e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="projects-page">
    <!-- Page Header -->
    <header class="page-header">
      <div class="header-title-row">
        <h1 class="header-title">PROJECTS</h1>
        <div class="header-line"></div>
      </div>
      <p class="header-desc">
        Explore our five collaborative research projects, each led by cross-national teams
        developing inclusive AI prototypes for marginalised children in Brazil.
      </p>
    </header>

    <div v-if="loading" class="state">Loading…</div>
    <div v-else-if="errorMsg" class="state error">{{ errorMsg }}</div>

    <!-- Grid View -->
    <div v-else-if="!selected" class="grid">
      <div
        v-for="p in projects"
        :key="p.id"
        class="card"
        @click="openProject(p)"
      >
        <div class="card-image">
          <img :src="withBase(p.coverImage)" :alt="p.provisionalTitle" />
        </div>
        <div class="card-body">
          <h2 class="card-title">{{ p.provisionalTitle }}</h2>
          <p class="card-name">
            <span class="name-link" @click.stop="goToPerson(p.personId)">{{ p.name }}</span>
          </p>
          <div class="card-pills">
            <span v-for="k in (p.keywords || [])" :key="k" class="pill">{{ k }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail View -->
    <div v-else class="detail">
      <button class="back-btn" @click="goBack">← Back to Projects</button>

      <div class="detail-header">
        <div class="detail-image">
          <img :src="withBase(selected.coverImage)" :alt="selected.provisionalTitle" />
        </div>
        <div class="detail-info">
          <h2 class="detail-title">{{ selected.provisionalTitle }}</h2>
          <p class="detail-name">
            <span class="name-link" @click="goToPerson(selected.personId)">{{ selected.name }}</span>
          </p>
          <div class="detail-pills">
            <a
              v-for="k in (selected.keywords || [])"
              :key="k"
              :href="`https://www.google.com/search?q=${encodeURIComponent(k)}`"
              target="_blank"
              rel="noopener noreferrer"
              class="pill pill-link"
            >{{ k }}</a>
          </div>
        </div>
      </div>

      <div class="detail-content markdown" v-html="detailHtml"></div>
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
   GRID VIEW
   ============================================ */
.grid {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(20px, 2.5vw, 36px);
}

.card {
  background: var(--color-gray-light);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-image {
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background-color: #e8e8e8;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card:hover .card-image img {
  transform: scale(1.03);
}

.card-body {
  padding: clamp(16px, 2vw, 28px);
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 1vw, 12px);
}

.card-title {
  font-family: var(--font-family);
  font-size: clamp(15px, 1.3vw, 20px);
  font-weight: 600;
  color: var(--color-black);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-name {
  font-family: var(--font-family);
  font-size: clamp(13px, 1vw, 16px);
  font-weight: 500;
  color: rgba(0, 0, 0, 0.6);
}

/* Clickable name link */
.name-link {
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-color: transparent;
  transition: text-decoration-color 0.2s ease, color 0.2s ease;
}

.name-link:hover {
  color: var(--color-red);
  text-decoration-color: var(--color-red);
}

.card-pills {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(4px, 0.5vw, 8px);
}

/* ============================================
   PILLS (shared)
   ============================================ */
.pill {
  display: inline-flex;
  align-items: center;
  padding: clamp(4px, 0.4vw, 6px) clamp(10px, 1vw, 14px);
  border-radius: 999px;
  border: 1.5px solid var(--color-black);
  background: transparent;
  font-family: var(--font-family);
  font-weight: 600;
  font-size: clamp(10px, 0.8vw, 12px);
  color: var(--color-black);
  letter-spacing: 0.3px;
  text-decoration: none;
}

.pill-link {
  cursor: pointer;
  transition: all 0.2s ease;
}

.pill-link:hover {
  background: var(--color-black);
  color: var(--color-white);
  transform: translateY(-1px);
}

/* ============================================
   DETAIL VIEW
   ============================================ */
.detail {
  max-width: 1100px;
  margin: 0 auto;
}

.back-btn {
  font-family: var(--font-family);
  font-size: clamp(14px, 1.2vw, 16px);
  font-weight: 500;
  color: var(--color-black);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-bottom: clamp(24px, 3vw, 40px);
  transition: color 0.2s ease;
}

.back-btn:hover {
  color: var(--color-red);
}

.detail-header {
  display: flex;
  gap: clamp(24px, 3vw, 48px);
  margin-bottom: clamp(32px, 4vw, 56px);
}

.detail-image {
  flex-shrink: 0;
  width: clamp(240px, 30vw, 400px);
  aspect-ratio: 16 / 10;
  border-radius: 8px;
  overflow: hidden;
  background-color: #e8e8e8;
}

.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(12px, 1.5vw, 20px);
}

.detail-title {
  font-family: var(--font-family);
  font-size: clamp(20px, 2.2vw, 32px);
  font-weight: 600;
  color: var(--color-black);
  line-height: 1.25;
}

.detail-name {
  font-family: var(--font-family);
  font-size: clamp(14px, 1.2vw, 18px);
  font-weight: 500;
  color: rgba(0, 0, 0, 0.6);
}

.detail-pills {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(6px, 0.8vw, 10px);
}

/* ============================================
   MARKDOWN CONTENT
   ============================================ */
.detail-content {
  padding-top: clamp(24px, 3vw, 40px);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
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
   RESPONSIVE - TABLET (max-width: 1024px)
   ============================================ */
@media (max-width: 1024px) {
  .projects-page {
    padding: var(--space-7) var(--space-6);
  }

  .grid {
    grid-template-columns: repeat(2, 1fr);
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

  .grid {
    grid-template-columns: 1fr;
    gap: var(--space-5);
  }

  .card-body {
    padding: var(--space-4);
  }

  .card-title {
    font-size: clamp(16px, 4.5vw, 20px);
  }

  .detail-header {
    flex-direction: column;
    gap: var(--space-4);
  }

  .detail-image {
    width: 100%;
  }

  .detail-title {
    font-size: clamp(18px, 5vw, 24px);
  }

  .markdown {
    font-size: clamp(14px, 4vw, 16px);
  }
}
</style>
