// 加载 views 目录下的所有 vue 文件，排除 components 目录下的 vue 文件
const _routes = import.meta.glob(['@/modules/Management/views/**/*.vue', '!@/modules/Management/views/**/components/**/*.vue'])

export default Object.assign(_routes, {
  layout: () => import('@/modules/Management/layout/Layout.vue'),
})
