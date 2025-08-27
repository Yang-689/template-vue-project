<script setup lang="ts">
import { computed } from 'vue'

interface SvgIconProps {
  name: string
  color?: string
  size?: string | number
}

defineOptions({
  name: 'SvgIcon',
})

const props = defineProps<SvgIconProps>()
const symbolId = computed(() => `#icon-${props.name}`)
const sizeValue = computed(() => {
  const raw = props.size
  if (raw === undefined || raw === null || String(raw).trim() === '')
    return undefined
  const v = String(raw).trim()
  if (/^\d+(?:\.\d+)?$/.test(v))
    return `${v}px`
  if (/^\d+(?:\.\d+)?(?:px|rem|em|%)$/.test(v))
    return v
  return v
})
</script>

<template>
  <svg aria-hidden="true" class="svg-icon" :color="color" :style="{ width: sizeValue, height: sizeValue }">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<style>
.svg-icon {
  width: 1em;
  height: 1em;
}
</style>
