<script setup>
// People page (List -> Details) with category filter + Markdown bios.
// Engineering notes:
// - Use a single selected object instead of multiple refs.
// - Render Markdown safely: html:false.
// - Use :deep() for styling v-html content under scoped CSS.

import { computed, ref } from 'vue'
import MarkdownIt from 'markdown-it'
import { people } from '@/content/people'

const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
})

// 1 = Project Leads, 2 = PhD Students
const selection = ref(1)

// Current selected person (null => list view)
const selected = ref(null)

const filteredPeople = computed(() => {
  const group = selection.value === 1 ? 'Project Lead' : 'PhD Student'
  return people.filter((p) => p.group === group)
})

function openPerson(p) {
  selected.value = p
}

function goBack() {
  selected.value = null
}

const bioHtml = computed(() => {
  if (!selected.value) return ''
  return md.render(selected.value.bioMd || '')
})
</script>

<template>
  <div class="people-page">
    <!-- LEFT NAV -->
    <aside class="people-nav">
      <img class="people-title" src="@/assets/special_fonts/people/people.png" alt="People" />

      <div
        class="people-menu menu-leads"
        :class="{ active: selection === 1 }"
        @click="selection = 1; selected = null"
      ></div>

      <div
        class="people-menu menu-phd"
        :class="{ active: selection === 2 }"
        @click="selection = 2; selected = null"
      ></div>
    </aside>

    <!-- RIGHT CONTENT -->
    <main class="people-content">
      <!-- LIST VIEW -->
      <section v-if="!selected" class="people-grid">
        <article
          v-for="p in filteredPeople"
          :key="p.id"
          class="person-card"
          @click="openPerson(p)"
        >
          <img class="person-photo" :src="p.image" :alt="p.name" />

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
          <img class="details-photo" :src="selected.image" :alt="selected.name" />

          <div class="details-titleblock">
            <div class="details-name">{{ selected.name }}</div>
            <div class="details-sub">
              <div class="details-role">{{ selected.title }}</div>
              <div class="details-aff">{{ selected.affiliation }}</div>
            </div>
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

          <a
            v-if="selected.links?.email"
            class="details-email"
            :href="`mailto:${selected.links.email}`"
          >
            {{ selected.links.email }}
          </a>
        </div>
      </section>
    </main>
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
  top: 110px; /* plays nicely with your sticky header */
  align-self: start;
}

.people-title {
  width: clamp(140px, 15.8vw, 220px);
  padding-bottom: clamp(16px, 4vw, 32px);
  display: block;
}

.people-menu {
  width: clamp(180px, 14.7vw, 240px);
  padding: clamp(14px, 1.8vw, 20px) 0;
  background-color: #000;
  transition: background-color 0.25s ease, transform 0.2s ease;
}

.menu-leads {
  mask-image: url('@/assets/special_fonts/people/Project Leads.png');
  mask-repeat: no-repeat;
  mask-size: contain;
  mask-position: left center;
}

.menu-phd {
  mask-image: url('@/assets/special_fonts/people/PHD students.png');
  mask-repeat: no-repeat;
  mask-size: contain;
  mask-position: left center;
}

.people-menu:hover {
  cursor: pointer;
  background-color: #dd3528;
  transform: scale(1.01);
}

.people-menu.active {
  background-color: #dd3528;
}

/* ===== Right content ===== */
.people-content {
  width: 100%;
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
  color: #ffffff;
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
}
.details-back:hover {
  color: #dd3528;
}

.details-top {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 18px;
  align-items: start;
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
  justify-content: center;
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

/* Markdown typography */
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

/* Details footer links (like your screenshot) */
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

.details-email {
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
  text-decoration: none;
}

.details-email:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* ===== Responsive ===== */
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
    grid-template-columns: 1fr;
  }

  .details-photo {
    width: 220px;
    height: 220px;
  }

  .details-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
