// import './assets/main.css';
import './assets/font.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// 설치했던 fontawesome-svg-core와 vue-fontawesome

import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
// 이렇게하면 모든 아이콘들을 불러올 수 있다.

library.add(fas, far, fab);
// 불러온 아이콘을 라이브러리에 담습니다.
// Create the app instance
const app = createApp(App)

// Register FontAwesome globally
app.component('font-awesome-icon', FontAwesomeIcon);

// Use Pinia and router
app.use(createPinia())
app.use(router)

// Mount the app
app.mount('#app')