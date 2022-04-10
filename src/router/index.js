import { createRouter, createWebHistory } from 'vue-router'
import Matches from '../views/Matches.vue'
import Teams from '../views/Teams.vue'

const routes = [
  {
    path: '/',
    name: 'Matches',
    component: Matches
  },
  {
    path: '/teams',
    name: 'Teams',
    component: Teams
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
