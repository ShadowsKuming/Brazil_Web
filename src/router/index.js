import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  // ✅ GitHub Pages friendly (no 404 on refresh)
  history: createWebHashHistory(import.meta.env.BASE_URL),

  routes: [
    { path: '/', name: 'home', component: HomeView },
    {
      path: '/prototypes',
      name: 'prototypes',
      component: () => import('../views/Prototypes.vue'),
    },
    {
      path: '/people',
      name: 'people',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
    },
    {
      path: '/news',
      name: 'news',
      component: () => import('../views/NewsEvents.vue'),
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('@/views/ProjectsView.vue'),
    },
  ],
})

export default router
