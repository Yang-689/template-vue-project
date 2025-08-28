<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/store'

const title = ref('欢迎来到首页')
const description = ref('这是一个使用Vue 3 + TypeScript + Vue Router构建的项目')
const userStore = useUserStore()
</script>

<template>
  <div class="home">
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>

    <div class="features">
      <h2>项目特性</h2>
      <ul>
        <li>Vue 3 Composition API</li>
        <li>TypeScript 支持</li>
        <li>Vue Router 路由管理</li>
        <li>Element Plus UI组件库</li>
        <li>Vite 构建工具</li>
        <li>ESLint 代码规范</li>
      </ul>
    </div>

    <div class="actions">
      <el-button type="primary" @click="$router.push('/about')">
        了解更多
      </el-button>
      <el-button @click="$router.push('/user')">
        用户中心
      </el-button>
      <el-button @click="userStore.logout()">
        退出登录
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

h1 {
  color: #42b883;
  margin-bottom: 1rem;
}

.description {
  color: #666;
  margin-bottom: 2rem;
}

.features {
  margin: 2rem 0;
  text-align: left;
}

.features h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.features ul {
  list-style: none;
  padding: 0;
}

.features li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
  color: #666;
}

.features li:before {
  content: '✓';
  color: #42b883;
  font-weight: bold;
  margin-right: 0.5rem;
}

.actions {
  margin-top: 2rem;
}

.actions .el-button {
  margin: 0 0.5rem;
}
</style>
