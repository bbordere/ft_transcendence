import { createRouter, createWebHistory } from 'vue-router'

// import Home from '@/views/Home.vue'
// import verif from '@/views/Verif.vue'
// import inscription from '@/views/Auth.vue'
// import profile from '@/views/Profile.vue'
// import pong from '@/views/pong.vue'
// import import('@/views/Auth2f.vue'), from '@/views/Auth2f.vue'
// import notFound from '@/views/NotFound.vue'
// import chat from '@/views/Chat.vue';


export default createRouter({
  history: createWebHistory(),
  routes: [
    {
		path: '/',
		component: () => import('@/views/Home.vue'),
    },
	{
		path: '/verif',
		component: () => import('@/views/Verif.vue'),
	},
	{
		path: '/auth',
		component: () => import('@/views/Auth.vue'),
	},
	{
		path: '/profile',
		component: () => import('@/views/Profile.vue'),
	},
	{
		path: '/pong',
		component: () => import('@/views/Pong.vue'),
	},
    {
		path: '/auth/42/login',
		component: () => import('@/views/Auth.vue'),
		beforeEnter(to, from, next) {
			window.location.href = "http://" + import.meta.env.VITE_HOST + ":3000/auth/42/login";
		}
	},
    {
		path: '/auth/logout',
		component: () => import('@/views/Auth.vue'),
		beforeEnter(to, from, next) {
			window.location.href = "http://" + import.meta.env.VITE_HOST + ":3000/auth/logout";
		}
	},
	{
		path: '/auth/login',
		component: () => import('@/views/Auth.vue'),
		beforeEnter(to, from, next) {
			window.location.href = "http://" + import.meta.env.VITE_HOST + ":3000/auth/login";
		}
	},
	{		
		path: '/auth/2fa/home',
		component: () => import('@/views/Auth2f.vue'),
	},
	{		
		path: '/auth/2fa/off',
		component: () => import('@/views/Verif.vue'),
	},
	{
		path: '/auth/2fa/verif',
		component: () => import('@/views/Verif.vue'),
	},
	{
		path: '/auth/2fa/generate',
		component: () => import('@/views/Auth2f.vue'),
		beforeEnter(to, from, next) {
			window.location.href = "http://" + import.meta.env.VITE_HOST + ":3000/auth/2fa/generate";
		}
	},
	{
		path: '/:pathMatch(.*)',
		redirect: "/notfound"
	},
	{
		path: '/notfound',
		name: 'PageNotFound',
		component: () => import('@/views/NotFound.vue'),
	},
  ],
})
