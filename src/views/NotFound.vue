<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}

function goBack() {
  router.go(-1)
}
</script>

<template>
  <div class="not-found">
    <div class="error-container">
      <div class="error-code">
        404
      </div>
      <h1>页面未找到</h1>
      <p>抱歉，您访问的页面不存在或已被移除。</p>

      <div class="error-actions">
        <el-button type="primary" @click="goHome">
          返回首页
        </el-button>
        <el-button @click="goBack">
          返回上页
        </el-button>
      </div>

      <div class="suggestions">
        <h3>您可以尝试：</h3>
        <ul>
          <li>检查URL是否正确</li>
          <li>使用导航菜单浏览其他页面</li>
          <li>联系管理员获取帮助</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.error-container {
  text-align: center;
  max-width: 600px;
  padding: 2rem;
}

.error-code {
  font-size: 8rem;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.3);
  line-height: 1;
  margin-bottom: 1rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: white;
}

p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.8);
}

.error-actions {
  margin-bottom: 2rem;
}

.error-actions .el-button {
  margin: 0 0.5rem;
}

.suggestions {
  text-align: left;
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.suggestions h3 {
  margin-bottom: 1rem;
  color: white;
}

.suggestions ul {
  list-style: none;
  padding: 0;
}

.suggestions li {
  padding: 0.5rem 0;
  color: rgba(255, 255, 255, 0.8);
  position: relative;
  padding-left: 1.5rem;
}

.suggestions li:before {
  content: '→';
  position: absolute;
  left: 0;
  color: #42b883;
  font-weight: bold;
}
</style>
