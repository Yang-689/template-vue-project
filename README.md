# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

# 项目基础模版重构

## Eslint

[Anthony's ESLint config preset](https://github.com/antfu/eslint-config)

# 提交规范

🌱 Angular Commit Type 对照表

1. 功能 & 修复

feat: 新功能
👉 示例：feat(auth): add login with Google

fix: 修复 bug
👉 示例：fix(user): resolve avatar upload issue

2. 代码质量 & 优化

refactor: 代码重构（不影响功能逻辑）
👉 示例：refactor(api): simplify request wrapper

perf: 性能优化
👉 示例：perf(list): improve rendering speed for large data

3. 文档 & 样式

docs: 文档修改（README、注释等）
👉 示例：docs(readme): update installation guide

style: 代码样式修改（空格、格式化、分号等，不影响功能）
👉 示例：style: format code with prettier

4. 工具 & 配置

chore: 构建过程或辅助工具的变动（依赖管理、脚手架、CI 配置等）
👉 示例：chore: add eslint and husky

build: 构建系统或依赖变动（webpack、rollup、vite 配置等）
👉 示例：build(vite): update vite config for production

ci: CI/CD 配置相关修改
👉 示例：ci(github): add workflow for testing

5. 测试

test: 测试用例相关的修改
👉 示例：test(user): add unit test for login

6. 其他常见扩展（非官方，但很多团队用）

init: 项目初始化（部分团队扩展的 type，Angular 官方没有）
👉 示例：init: initial commit

revert: 回滚某次提交
👉 示例：revert: "feat(auth): add login with Google"

# 动态路由加载和权限控制

支持基于菜单权限的“按需动态注册路由”。登录后，根据用户的 `menus` 属性，在导航守卫内使用 `router.addRoute` 动态挂载页面，从而避免在未授权前暴露所有路由。同时通过 `import.meta.glob` 做组件自动映射，并支持排除 `components` 目录下的子组件。

## 流程概览

- 登录成功后进入全局前置守卫 `router.beforeEach`
- 若目标路径不在白名单且用户已登录：
  - 校验 `userStore.verifyMenuPermission(to.path)` 是否有权限
  - 若尚未注册该路由，则执行 `await addDynamicRoute(to.path)`
  - 注册完成后通过 `return { path: to.path, replace: true }` 触发重新匹配，避免被 404 抢占
- 无权限则跳转 `/404`

## 关键实现

- 组件自动映射（在 `@/modules/Management/router/index.ts`）

```ts
// 排除 views/**/components/** 下的所有 .vue 文件
const _routes = import.meta.glob([
  '@/modules/Management/views/**/*.vue',
  '!@/modules/Management/views/**/components/**/*.vue',
])

export default Object.assign(_routes, {
  layout: () => import('@/modules/Management/layout/Layout.vue'),
})
```

- 导航守卫与动态路由添加（在 `@/router/index.ts`）

```ts
router.beforeEach(async (to, _from) => {
  if (!userStore.isLogin) {
    if (to.path !== '/login')
      return '/login'
    return true
  }

  if (userStore.isLogin && !whiteList.includes(to.path)) {
    if (userStore.verifyMenuPermission(to.path)) {
      if (!hasRoute({ path: to.path })) {
        await addDynamicRoute(to.path)
        return { path: to.path, replace: true } // 关键：避免被 404 抢占
      }
    }
    else {
      if (to.path === '/404')
        return true
      return '/404'
    }
  }
  return true
})
```

- 父子路由递归注册与组件加载（核心片段）

```ts
async function addDynamicRoute(path: string) {
  const menuItem = userStore.menus.find(m => m.path === path)
  const { module, componentPath } = parseRoutePath(path)
  const moduleName = module.charAt(0).toUpperCase() + module.slice(1)

  // 先确保父级（Layout）存在
  if (menuItem?.parent) {
    await addDynamicRoute(menuItem.parent)
  }

  const component = await loadDynamicComponent(menuItem)
  if (!component) {
    console.warn(`组件文件不存在: ${module}/views/${componentPath}`)
    return
  }

  if (!menuItem.parent && menuItem.component === 'Layout') {
    if (hasRoute({ name: moduleName }))
      return
    router.addRoute({ path, name: moduleName, component })
  }
  else {
    router.addRoute(moduleName, { path, name: path, component })
  }
}

async function loadDynamicComponent(menuItem: MenuItem) {
  let { module, componentPath } = parseRoutePath(menuItem.path)
  module = module.charAt(0).toUpperCase() + module.slice(1)
  const routesMap = (await _dynamicRoutes[module]?.()).default

  if (!menuItem.parent && menuItem.component === 'Layout') {
    return routesMap.layout
  }

  return (
    routesMap[`/src/modules/${module}/views/${componentPath}.vue`]
    || routesMap[`/src/modules/${module}/views/${componentPath}/index.vue`]
  )
}
```

- 404 通配路由应静态放在最后：

```ts
{
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: () => import('@/views/NotFound.vue'),
}
```

## 菜单数据要求（简述）

后端或本地需提供 `menus: MenuItem[]`，至少包含：

- `path`: 页面访问路径（如 `/Management/gis/layer`）
- `component`: 当为顶级模块使用 `'Layout'`，子页面为相对 `views` 的实际组件路径（不含前缀 `@/modules/.../views/`）
- `parent`: 可选，父级路由的 `path`

路径对应的页面文件需位于：

- `src/modules/<Module>/views/<component>.vue`
- 或 `src/modules/<Module>/views/<component>/index.vue`

其中 `<Module>` 为模块名首字母大写（如 `Management`）。

## 使用示例

- 新增页面：`src/modules/Management/views/gis/layer.vue`
- 菜单项：

```json
{
  "path": "/Management/gis/layer",
  "component": "gis/layer",
  "parent": "/Management",
  "title": "图层管理"
}
```

- 顶级模块（Layout）对应菜单：

```json
{
  "path": "/Management",
  "component": "Layout",
  "title": "后台管理"
}
```

## 常见问题

- 访问动态路由被 404 截取：确保在添加后使用 `return { path: to.path, replace: true }` 重新匹配。
- 组件未找到：检查文件是否在 `views` 下，且命名与 `menus` 的 `component` 一致（或放置 `index.vue`）。
- 父级未存在：`addDynamicRoute` 会递归确保父级（`Layout`）先注册。
- 路径别名：`@` 已在 `vite.config.ts` 配置为 `src`，需保持一致。
