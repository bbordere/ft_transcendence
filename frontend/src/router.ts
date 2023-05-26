import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Verif from '@/views/Verif.vue'
import inscription from '@/views/Auth.vue'
import profile from '@/views/profile.vue'
import pong from '@/views/pong.vue'

async function isLogged() {
	const res = await fetch("http://localhost:3000/auth", {method: "post"});
	return ((res.status != 401));
}

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
		path: '/',
		component: Home,
		async beforeEnter(to, from, next) {
			if (await isLogged() === false){
				next('/auth');
			}
			else
				next();
		}
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
			window.location.href = "http://localhost:3000/auth/42/login";
		}
	},
  ],
})
