import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { useHttp, useIsEqual } from "@monorepo/shared";

console.log(useHttp());

const obj = {
    name: 'tom',
    likeSports: ['football']
}

const obj2 = {
    name: 'tom',
    likeFoods: ['fish']
}

console.log(useIsEqual(obj.name, obj2.name));


const app = createApp(App)

app.use(router)

app.mount('#app')
