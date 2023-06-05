// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import type { RouteRecordName } from 'vue-router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGear, faRightFromBracket, faPen, faLock } from '@fortawesome/free-solid-svg-icons'
import { createVuetify } from 'vuetify'
import VueApexCharts from "vue3-apexcharts";

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

async function isLogged() {
	const res = await fetch("http://" + import.meta.env.VITE_HOST + ":3000/auth", {method: "get", credentials: "include"});
	console.log(res.status);
	return ((res.status != 401));
}

async function isOn2FA() {
	const res = await fetch("http://" + import.meta.env.VITE_HOST + ":3000/auth/2f", {method: "get", credentials: "include"});
	console.log(res.status);
	return ((res.status != 401));	
}

library.add(faGear, faRightFromBracket, faPen, faLock);
const app = createApp(App)
router.beforeEach(async (to, from, next) => {
	const clearPages: RouteRecordName[] = ["/auth", "/auth/42/login", "/auth/login", "/auth/2fa/verif"]
	if (clearPages.includes(to.path))
		next();
	else{
		await isLogged() ? next() : next('/auth');
	}
})

const vuetify = createVuetify({
	icons: {
		defaultSet: 'mdi',
	  },	
	components,
	directives
  })

app.component('font-awesome-icon', FontAwesomeIcon)
app.component("apexchart", VueApexCharts);
app.config.globalProperties.$redirect = (page) => {router.push(page)}
app.use(vuetify).use(router).mount('#app')
