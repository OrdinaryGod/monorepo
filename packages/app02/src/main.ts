import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { useHttp } from "@monorepo/shared";

console.log(useHttp());

const app = createApp(App)

app.use(router)

app.mount('#app')
