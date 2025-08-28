import { createApp } from 'vue'
import App from '@/App.vue'
import registerSvgIcon from '@/plugins/svg-register'
import router from '@/router'
import pinia from '@/store'
import '@/style.css'

const app = createApp(App)

// 注册路由
app.use(router)
// 注册svg图标组件
app.use(registerSvgIcon)
// 注册pinia
app.use(pinia)

app.mount('#app')
