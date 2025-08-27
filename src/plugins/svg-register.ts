import type { App, Plugin } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'
import 'virtual:svg-icons-register'

const registerSvgIcon: Plugin = {
  install(app: App) {
    app.component('svg-icon', SvgIcon)
  },
}

export default registerSvgIcon
