import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Verif from '@/views/Verif.vue'
import inscription from '@/views/Auth.vue'
import profile from '@/views/Profile.vue'
import pong from '@/views/pong.vue'

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
    },
    {
		path: '/auth',
		component: inscription
	},
	{
		path: '/profile',
		component: profile
	},
	{
		path: '/pong',
		component: pong
	},
    {
		path: '/auth/42/login',
		component: inscription,
		beforeEnter(to, from, next) {
			window.location.href = "http://" + import.meta.env.VITE_HOST + ":3000/auth/42/login";
		}
	},
    {
		path: '/auth/logout',
		component: inscription,
		beforeEnter(to, from, next) {
			window.location.href = "http://" + import.meta.env.VITE_HOST + ":3000/auth/logout";
		}
	},
	{
		path: '/auth/login',
		component: inscription,
		beforeEnter(to, from, next) {
			window.location.href = "http://" + import.meta.env.VITE_HOST + ":3000/auth/login";
		}
	},
  ],
})
