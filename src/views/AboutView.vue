<script setup>
// People page (List -> Details) using runtime JSON + Markdown bios.
// After build, update these without rebuilding:
// - dist/content/people.json
// - dist/content/people/*.md
// - dist/md-assets/people/*.png

import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: false,
  linkify: false,
  breaks: true,
})

// 1 = Project Leads, 2 = PhD Students, 3 = Volunteers
const selection = ref(1)

// data
const loading = ref(true)
const errorMsg = ref('')
const people = ref([])

// selected person (null => list view)
const selected = ref(null)
const bioHtml = ref('')

// contact dialog
const showContactDialog = ref(false)
const contactForm = ref({
  senderName: '',
  senderPronouns: '',
  subject: '',
  message: '',
})

function openContactDialog() {
  contactForm.value = { senderName: '', senderPronouns: '', subject: '', message: '' }
  showContactDialog.value = true
}

function closeContactDialog() {
  showContactDialog.value = false
}

function sendContactEmail() {
  const f = contactForm.value
  if (!f.senderName.trim() || !f.message.trim()) return

  const pronouns = f.senderPronouns.trim() ? ` (${f.senderPronouns.trim()})` : ''
  const subject = f.subject.trim() || `Message from ${f.senderName.trim()}`
  const body = `${f.message.trim()}\n\n—\n${f.senderName.trim()}${pronouns}`

  const mailto = `mailto:${selected.value.links.email}`
    + `?subject=${encodeURIComponent(subject)}`
    + `&body=${encodeURIComponent(body)}`

  window.open(mailto, '_blank')
  closeContactDialog()
}

// cache markdown by path
const mdCache = ref(new Map())

const route = useRoute()

// base path (supports GitHub Pages subpath)
const BASE = import.meta.env.BASE_URL || '/'

function withBase(path) {
  const cleaned = String(path || '').replace(/^\//, '')
  return BASE.replace(/\/?$/, '/') + cleaned
}

function resolveAsset(path) {
  // for images stored in public/
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

const groupMap = { 1: 'Project Lead', 2: 'PhD Student', 3: 'Volunteer' }

const filteredPeople = computed(() => {
  const group = groupMap[selection.value]
  return people.value.filter((p) => p.group === group)
})

async function ensureBioLoaded(p) {
  if (!p?.bioMdPath) return ''
  if (mdCache.value.has(p.bioMdPath)) return mdCache.value.get(p.bioMdPath)

  const text = await fetchText(p.bioMdPath)
  mdCache.value.set(p.bioMdPath, text)
  return text
}

async function openPerson(p) {
  try {
    errorMsg.value = ''
    selected.value = p

    const raw = await ensureBioLoaded(p)
    bioHtml.value = md.render(raw || '')

    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (e) {
    errorMsg.value = e?.message || String(e)
  }
}

function goBack() {
  selected.value = null
  bioHtml.value = ''
}

function switchGroup(v) {
  selection.value = v
  selected.value = null
  bioHtml.value = ''
}

onMounted(async () => {
  try {
    loading.value = true
    errorMsg.value = ''

    const data = await fetchJson('content/people.json')
    people.value = Array.isArray(data) ? data : []

    // Deep link: if ?id=phd-3 is in URL, open that person directly
    const targetId = route.query.id
    if (targetId) {
      const person = people.value.find((p) => p.id === targetId)
      if (person) {
        // Switch to the correct group tab
        const groupToTab = { 'Project Lead': 1, 'PhD Student': 2, 'Research Assistant': 3 }
        selection.value = groupToTab[person.group] || 1
        await openPerson(person)
      }
    }
  } catch (e) {
    errorMsg.value = e?.message || String(e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="people-page">
    <!-- LEFT NAV -->
    <aside class="people-nav">
      <h1 class="people-title">PEOPLE</h1>

      <div
        class="people-menu"
        :class="{ active: selection === 1 }"
        @click="switchGroup(1)"
      >Project Leads</div>

      <div
        class="people-menu"
        :class="{ active: selection === 2 }"
        @click="switchGroup(2)"
      >PhD Students</div>

      <div
        class="people-menu"
        :class="{ active: selection === 3 }"
        @click="switchGroup(3)"
      >Research Assistants</div>
    </aside>

    <!-- RIGHT CONTENT -->
    <main class="people-content">
      <div v-if="loading" class="state">Loading…</div>
      <div v-else-if="errorMsg" class="state error">{{ errorMsg }}</div>

      <!-- EMPTY STATE -->
      <div v-else-if="!selected && filteredPeople.length === 0" class="state empty">
        Coming soon.
      </div>

      <!-- LIST VIEW -->
      <section v-else-if="!selected" class="people-grid">
        <article
          v-for="p in filteredPeople"
          :key="p.id"
          class="person-card"
          @click="openPerson(p)"
        >
          <img class="person-photo" :src="resolveAsset(p.image)" :alt="p.name" />

          <div class="person-meta">
            <div class="person-name">{{ p.name }}</div>
            <div class="person-sub">
              <span class="person-title">{{ p.title }}</span>
              <span class="dot">•</span>
              <span class="person-aff">{{ p.affiliation }}</span>
            </div>
          </div>
        </article>
      </section>

      <!-- DETAILS VIEW -->
      <section v-else class="person-details">
        <div class="details-header">
          <div class="details-back" @click="goBack">← Back</div>
        </div>

        <div class="details-top">
          <img class="details-photo" :src="resolveAsset(selected.image)" :alt="selected.name" />

          <div class="details-titleblock">
            <div class="details-name">{{ selected.name }}</div>
            <div class="details-sub">
              <div class="details-role">{{ selected.title }}</div>
              <div class="details-aff">{{ selected.affiliation }}</div>
            </div>
            <button
              v-if="selected.links?.email"
              class="contact-btn"
              @click="openContactDialog"
            >
              CONTACT
            </button>
          </div>
        </div>

        <div class="details-body markdown" v-html="bioHtml"></div>

        <div class="details-footer">
          <div class="details-links">
            <a
              v-if="selected.links?.website"
              class="details-link"
              :href="selected.links.website"
              target="_blank"
              rel="noreferrer"
            >
              PERSONAL WEBSITE ↗
            </a>

            <a
              v-if="selected.links?.linkedin"
              class="details-link"
              :href="selected.links.linkedin"
              target="_blank"
              rel="noreferrer"
            >
              LINKEDIN ↗
            </a>
          </div>

        </div>
      </section>
    </main>

    <!-- Contact Dialog -->
    <div v-if="showContactDialog" class="contact-overlay" @click="closeContactDialog">
      <div class="contact-dialog" @click.stop>
        <button class="contact-dialog-close" @click="closeContactDialog">&times;</button>

        <div class="contact-dialog-content">
          <h2 class="contact-dialog-title">Get in Touch</h2>
          <div class="contact-dialog-line"></div>
          <p class="contact-dialog-recipient">
            To: <strong>{{ selected.name }}</strong>
            <span class="contact-dialog-recipient-email">{{ selected.links.email }}</span>
          </p>

          <form class="contact-form" @submit.prevent="sendContactEmail">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="sender-name">Your Name *</label>
                <input
                  id="sender-name"
                  v-model="contactForm.senderName"
                  class="form-input"
                  type="text"
                  placeholder="Full name"
                  required
                />
              </div>
              <div class="form-group form-group-small">
                <label class="form-label" for="sender-pronouns">Pronouns</label>
                <input
                  id="sender-pronouns"
                  v-model="contactForm.senderPronouns"
                  class="form-input"
                  type="text"
                  placeholder="e.g. he/him"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="contact-subject">Subject</label>
              <input
                id="contact-subject"
                v-model="contactForm.subject"
                class="form-input"
                type="text"
                placeholder="What is this about?"
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="contact-message">Message *</label>
              <textarea
                id="contact-message"
                v-model="contactForm.message"
                class="form-textarea"
                placeholder="Write your message here..."
                rows="5"
                required
              ></textarea>
            </div>

            <button class="contact-dialog-btn" type="submit">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== Layout ===== */
.people-page {
  width: 100%;
  height: auto;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: clamp(16px, 2.5vw, 40px);
  padding: clamp(18px, 5vw, 56px) clamp(14px, 3.85vw, 56px);
  box-sizing: border-box;
}

/* ===== Left nav ===== */
.people-nav {
  position: sticky;
  top: 110px;
  align-self: start;
}

.people-title {
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 700;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding-bottom: clamp(16px, 4vw, 32px);
  margin: 0;
}

.people-menu {
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: clamp(18px, 1.8vw, 24px);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #000;
  padding: clamp(4px, 0.5vw, 6px) 0;
  cursor: pointer;
  transition: color 0.25s ease, transform 0.2s ease;
}

.people-menu:hover {
  color: #dd3528;
  transform: scale(1.01);
}

.people-menu.active {
  color: #dd3528;
}

/* ===== Right content ===== */
.people-content {
  width: 100%;
}

.state {
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: 14px;
  color: rgba(0,0,0,0.65);
}
.state.error {
  color: #dd3528;
}
.state.empty {
  font-size: clamp(16px, 1.4vw, 20px);
  color: rgba(0, 0, 0, 0.4);
  padding: clamp(40px, 5vw, 80px) 0;
}

/* ===== Grid cards ===== */
.people-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(260px, 1fr));
  gap: clamp(14px, 1vw, 18px);
}

.person-card {
  background: #f7f7f7;
  padding: clamp(22px, 3.2vw, 44px) clamp(18px, 2.2vw, 32px);
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.person-card:hover {
  transform: translateY(-2px);
  background: #f2f2f2;
}

.person-photo {
  width: clamp(140px, 14.9vw, 190px);
  height: clamp(140px, 14.9vw, 190px);
  object-fit: cover;
  display: block;
  margin-bottom: clamp(18px, 3vw, 28px);
}

.person-meta {
  width: 100%;
}

.person-name {
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-weight: 600;
  font-size: clamp(14px, 1.2vw, 18px);
  margin-bottom: 6px;
}

.person-sub {
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-weight: 400;
  font-size: 12px;
  opacity: 0.7;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dot {
  opacity: 0.45;
}

/* ===== Details ===== */
.person-details {
  max-width: 860px;
}

.details-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
}

.details-back {
  cursor: pointer;
  color: #111;
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
}
.details-back:hover {
  color: #dd3528;
}

.details-top {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 18px;
  align-items: stretch;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  margin-bottom: 18px;
}

.details-photo {
  width: 180px;
  height: 180px;
  object-fit: cover;
  display: block;
  background: #eee;
}

.details-titleblock {
  display: flex;
  flex-direction: column;
}

.details-name {
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-weight: 700;
  font-size: 20px;
  margin-bottom: 6px;
}

.details-sub {
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: 12px;
  opacity: 0.7;
  line-height: 1.5;
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

/* Footer */
.details-footer {
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
}

.details-links {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.details-link {
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: 12px;
  color: #111;
  text-decoration: none;
}

.details-link:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* Contact Button */
.contact-btn {
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background-color: #000;
  border: none;
  border-radius: 50px;
  padding: 8px 24px;
  margin-top: auto;
  align-self: flex-start;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}
.contact-btn:hover {
  background-color: #dd3528;
  transform: scale(1.02);
}

/* Contact Dialog */
.contact-overlay {
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
  padding: 16px;
  overflow-y: auto;
}

.contact-dialog {
  position: relative;
  background-color: #fff;
  border-radius: clamp(16px, 4vw, 24px);
  max-width: 520px;
  width: 100%;
  padding: clamp(28px, 4vw, 40px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: contactDialogIn 0.3s ease;
  margin: auto;
}

@keyframes contactDialogIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.contact-dialog-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  font-size: 28px;
  color: #000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}
.contact-dialog-close:hover {
  color: #dd3528;
}

.contact-dialog-content {
  text-align: center;
}

.contact-dialog-title {
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: clamp(22px, 3.5vw, 28px);
  font-weight: 600;
  color: #000;
  margin: 0 0 12px;
}

.contact-dialog-line {
  width: 60px;
  height: 3px;
  background-color: #dd3528;
  margin: 0 auto 16px;
}

.contact-dialog-recipient {
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: 14px;
  color: #333;
  margin: 0 0 20px;
}

.contact-dialog-recipient-email {
  display: block;
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

/* Form */
.contact-form {
  text-align: left;
}

.form-row {
  display: flex;
  gap: 12px;
}

.form-group {
  margin-bottom: 14px;
  flex: 1;
}

.form-group-small {
  flex: 0 0 120px;
}

.form-label {
  display: block;
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 6px;
}

.form-input,
.form-textarea {
  width: 100%;
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: 14px;
  color: #111;
  background: #f7f7f7;
  border: 1.5px solid transparent;
  border-radius: 8px;
  padding: 10px 14px;
  box-sizing: border-box;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #000;
  background: #fff;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #bbb;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.contact-dialog-btn {
  display: inline-block;
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background-color: #000;
  border: none;
  border-radius: 50px;
  padding: 12px 32px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-top: 4px;
}
.contact-dialog-btn:hover {
  background-color: #dd3528;
  transform: scale(1.02);
}
/* Center the send button */
.contact-form {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.contact-form .contact-dialog-btn {
  align-self: center;
}

/* Responsive */
@media (max-width: 980px) {
  .people-page {
    grid-template-columns: 1fr;
  }
  .people-nav {
    position: static;
  }
  .people-grid {
    grid-template-columns: 1fr;
  }
  .details-top {
    grid-template-columns: 220px 1fr;
  }
  .details-photo {
    width: 220px;
    height: 220px;
  }
  .details-footer {
    flex-direction: column;
    align-items: flex-start;
  }
  .contact-btn {
    align-self: flex-start;
  }
}
</style>
