import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { registerDirectives } from './directives/animations'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/css/main.css'
import './assets/css/variables.css'
import './assets/css/utilities.css'
import './assets/css/responsive.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
registerDirectives(app)
app.mount('#app')