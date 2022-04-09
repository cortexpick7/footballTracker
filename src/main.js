import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import axios from 'axios'
import './assets/styles/style.scss'
import 'animate.css'

createApp(App).use(router, axios).mount('#app')
