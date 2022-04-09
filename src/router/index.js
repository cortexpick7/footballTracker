import { createRouter, createWebHistory } from 'vue-router'
import Matches from '../views/Matches.vue'

const routes = [
  {
    path: '/',
    name: 'Matches',
    component: Matches
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
