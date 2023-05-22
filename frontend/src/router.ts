import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Verif from '@/views/Verif.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/verif',
      component: Verif
    }
  ],
})
