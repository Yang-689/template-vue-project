import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, markRaw, ref } from 'vue'
import router from '@/router'
import data from '../../.mock/menus'

export interface MenuItem {
  path: string
  parent?: string | null
  children?: MenuItem[]
  [key: string]: any
}

const _menus = flattenWithParent(data.management.data)

export const useUserStore = defineStore('user', () => {
  const userId = ref('996')
  const token = useLocalStorage<string>('token', '')
  const menus = markRaw<any[]>(_menus)

  const isLogin = computed(() => !!token.value)

  const login = () => {
    token.value = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const route = router.currentRoute.value
    const redirect = (route.redirectedFrom?.path as string) || '/'
    router.push({ path: redirect })
  }

  const logout = () => {
    token.value = ''
    // 清除路由缓存
    router.replace({ path: '/login' })
  }

  // 验证菜单权限
  const verifyMenuPermission = (path: string): boolean => {
    if (menus.length === 0)
      return false

    return menus.find(menu => menu.path === path)
  }

  return {
    userId,
    token,
    menus,
    isLogin,
    login,
    logout,
    verifyMenuPermission,
  }
})

/**
 * 将树形菜单拍平成一维数组：
 * - 移除 children
 * - 新增 parent 字段，值为父节点的 path；顶级项为 null
 */
export function flattenWithParent(items: MenuItem[]): MenuItem[] {
  const result: MenuItem[] = []

  function dfs(nodes: MenuItem[], parentPath: string | null) {
    for (const node of nodes) {
      const { children, ...rest } = node
      const flatNode = {
        ...rest,
        parent: parentPath,
      }
      result.push(flatNode)

      if (children && children.length > 0) {
        dfs(children, node.path)
      }
    }
  }

  dfs(items, null)
  return result
}
