import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Verif from '@/views/Verif.vue'
import inscription from '@/views/Auth.vue'
import profile from '@/views/Profile.vue'
import pong from '@/views/pong.vue'
import auth2f from '@/views/Auth2f.vue'
import notFound from '@/views/NotFound.vue'

import chat from '@/views/Chat.vue';

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
	{		
		path: '/auth/2fa/home',
		component: auth2f,
	},
	{		
		path: '/auth/2fa/off',
		component: Verif,
	},
	{
		path: '/auth/2fa/verif',
		component: Verif,
	},
	{
		path: '/auth/2fa/generate',
		component: auth2f,
		beforeEnter(to, from, next) {
			window.location.href = "http://" + import.meta.env.VITE_HOST + ":3000/auth/2fa/generate";
		}
	},
	{
<<<<<<< HEAD
		path: '/:pathMatch(.*)',
		name: 'PageNotFound',
		component: notFound
	}
=======
		path: '/chat',
		component: chat,
	},
>>>>>>> 594585a2b100f4f04673d59d15ff3424c97cf363
  ],
})
