/// <reference types="vite/client" />
/// <reference types="vite-plugin-svg-icons/client" />
declare module 'virtual:svg-icons-register' {
  const content: unknown
  export default content
}

export {}

interface GlobalConfig {
  GlobalParam: {
    baseAPI: string
  }
}

declare global {
  interface Window {
    config: GlobalConfig
  }
}
