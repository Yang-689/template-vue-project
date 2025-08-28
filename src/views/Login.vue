<script setup lang="ts">
import { useUserStore } from '@/store'

const userStore = useUserStore()

// console.log(userStore)
</script>

<template>
  <div>
    <el-button @click="userStore.login()">
      登录
    </el-button>
  </div>
</template>
