// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import type { RouteRecordName } from 'vue-router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

async function isLogged() {
	const res = await fetch("http://" + import.meta.env.VITE_HOST + ":3000/auth", {method: "post", credentials: "include"});
	console.log(res.status);
	return ((res.status != 401));
}

library.add(faGear, faRightFromBracket);
const app = createApp(App)
router.beforeEach(async (to, from, next) => {
	const clearPages: RouteRecordName[] = ["/auth", "/auth/42/login", "/auth/login"]
	if (clearPages.includes(to.path))
		next();
	else{
		await isLogged() ? next() : next('/auth');
	}
})
app.component('font-awesome-icon', FontAwesomeIcon)
app.config.globalProperties.$redirect = (page) => {router.push(page)}
app.use(router).mount('#app')
