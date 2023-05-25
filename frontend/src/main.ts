// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.config.globalProperties.$redirect = (page) => {router.push(page)}
app.use(router).mount('#app')
