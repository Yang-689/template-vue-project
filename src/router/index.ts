import type { RouteRecordRaw } from 'vue-router'
import type { MenuItem } from './../store/user'
import { createRouter, createWebHistory } from 'vue-router'
import pinia, { useUserStore } from '@/store'

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '首页',
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '登录',
    },
  },
  // 404 页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '页面未找到',
    },
  },
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 动态路由
const _dynamicRoutes = {
  Management: () => import('@/modules/Management/router'),
}

// #region Permission 权限控制
const userStore = useUserStore(pinia)
const whiteList = ['/', '/home', '/login', '/404']

router.beforeEach(async (to, _from) => {
  // 如果用户未登录，去的不是登录页，则跳转到登录页；如果去的登录页，则放行
  if (!userStore.isLogin) {
    if (to.path !== '/login') {
      return '/login'
    }
    return true
  }

  // 如果用户已登录，去的是登录页，则跳转到首页
  // 白名单放行
  if (userStore.isLogin && !whiteList.includes(to.path)) {
    if (userStore.verifyMenuPermission(to.path)) {
      if (!hasRoute({ path: to.path })) {
        await addDynamicRoute(to.path)

        console.log('🕸️routes', router.getRoutes())

        // 重新触发一次当前地址的匹配，避免被通配 404 抢占
        // return to.path
        return { path: to.path, replace: true }
      }
    }
    else {
      // 没有权限，跳转到404页面
      if (to.path === '/404') {
        return true
      }
      return '/404'
    }

    if (to.path === '/login') {
      return '/'
    }
  }

  return true
})

// 全局后置钩子
router.afterEach((to, from) => {
  // 路由切换后的操作，比如埋点统计
  console.log(`路由从 ${from.path} 跳转到 ${to.path}`)
})
// #endregion

export default router

function hasRoute({ path, name }: { path?: string, name?: string }) {
  if (name) {
    return router.hasRoute(name)
  }
  if (path) {
    const routes = router.getRoutes()
    return routes.some(route => route.path === path)
  }
  return false
}

async function addDynamicRoute(path: string) {
  const menuItem = userStore.menus.find(menu => menu.path === path)
  const { module, componentPath } = parseRoutePath(path)
  const moduleName = module.charAt(0).toUpperCase() + module.slice(1)

  if (menuItem?.parent) {
    await addDynamicRoute(menuItem.parent)
  }

  const component = await loadDynamicComponent(menuItem)

  if (!component) {
    console.warn(`🐛组件文件不存在: ${module}/views/${componentPath}`)
    return
  }

  // 添加路由
  if (!menuItem.parent && menuItem.component === 'Layout') {
    if (hasRoute({ name: moduleName }))
      return

    router.addRoute({
      path,
      name: moduleName,
      component,
    })
  }
  else {
    router.addRoute(moduleName, {
      path,
      name: path,
      component,
    })
  }
}

function parseRoutePath(path: string) {
  // '/Management/gis/layer' 为例，取出 Management 和 /gis/layer 两个部分
  const pathArr = path.split('/')
  const module = pathArr[1]
  const componentPath = pathArr.slice(2).join('/')
  return { module, componentPath }
}

async function loadDynamicComponent(menuItem: MenuItem) {
  let { module, componentPath } = parseRoutePath(menuItem.path)
  // module 首字母大写 为了匹配moduled文件夹的名称
  module = module.charAt(0).toUpperCase() + module.slice(1)
  const routesMap = (await _dynamicRoutes[module as keyof typeof _dynamicRoutes]?.()).default

  // 如果菜单项没有父级，且组件为 Layout，则返回 Layout 组件
  if (!menuItem.parent && menuItem.component === 'Layout') {
    return routesMap.layout
  }

  const component = routesMap[`/src/modules/${module}/views/${componentPath}.vue`] || routesMap[`/src/modules/${module}/views/${componentPath}/index.vue`]
  return component
}
