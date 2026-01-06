import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  // ✅ GitHub Pages friendly (no 404 on refresh)
  history: createWebHashHistory(import.meta.env.BASE_URL),

  routes: [
    { 
      path: '/', 
      name: 'home', 
      component: HomeView,
      meta: {title: 'Brazil Research | Home' }, 
    },
    {
      path: '/prototypes',
      name: 'prototypes',
      component: () => import('../views/Prototypes.vue'),
      meta: {title: 'Brazil Research | Prototypes' },
    },
    {
      path: '/people',
      name: 'people',
      component: () => import('../views/AboutView.vue'),
      meta: {title: 'Brazil Research | People' },
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
      meta: {title: 'Brazil Research | Contact' },
    },
    {
      path: '/news',
      name: 'news',
      component: () => import('../views/NewsEvents.vue'),
      meta: {title: 'Brazil Research | News & Events' },
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('@/views/ProjectsView.vue'),
      meta: {title: 'Brazil Research | Projects' },
    },
  ],
})

router.afterEach((to) => {
  const baseTitle = 'Brazil Research Lab'
  document.title = to.meta.title || baseTitle
})


export default router
