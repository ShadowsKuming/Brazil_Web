<script setup>
// Prototypes page (List -> Details) with Markdown rendering.
// Engineering notes:
// - Avoid storing detail text in multiple refs; use a single "selected" object.
// - Render Markdown safely: html:false disables raw HTML injection.
// - Use :deep() selectors because v-html bypasses scoped CSS scoping.

import { ref, computed } from 'vue'
import MarkdownIt from 'markdown-it'
import { prototypes } from '@/content/prototypes'

// Markdown renderer
const md = new MarkdownIt({
  html: false,     // Safer: disallow raw HTML in markdown
  linkify: true,   // Auto-detect links
  breaks: true,    // Treat line breaks as <br> (helps with quick formatting)
})

// Selected prototype (null => list view)
const selected = ref(null)

function goDetails(p) {
  selected.value = p
}

function goBack() {
  selected.value = null
}

// Render selected markdown -> HTML
const detailsHtml = computed(() => {
  if (!selected.value) return ''
  return md.render(selected.value.detailsMd || '')
})
</script>

<template>
  <div class="prototypes">
    <!-- LIST VIEW -->
    <section v-if="!selected" class="prototypes-list">
      <div class="prototypes-title">
        <img src="@/assets/special_fonts/prototypes/prototypes.png" alt="Prototypes" />
      </div>

      <div class="prototypes-content">
        <article v-for="p in prototypes" :key="p.id" class="prototype-item">
          <img class="prototype-item-image" :src="p.image" :alt="p.name" />

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

      <img class="prototype-details-image" :src="selected.image" :alt="selected.name" />

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
  color: red;
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
/* Because v-html injects plain HTML nodes, use :deep() under scoped CSS. */
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
