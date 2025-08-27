import { createApp } from 'vue'
import App from '@/App.vue'
import registerSvgIcon from '@/plugins/svg-register'
import '@/style.css'

const app = createApp(App)
app.use(registerSvgIcon)
app.mount('#app')
