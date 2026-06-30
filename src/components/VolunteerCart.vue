<script setup>
import { VOLUNTEER_LIMIT } from '../utils/storage'
defineProps({ count: { type: Number, default: 0 } })
</script>

<template>
  <div class="cart"><span>已选志愿</span><strong>{{ count }} / {{ VOLUNTEER_LIMIT }}</strong></div>
</template>

<style scoped>
.cart { display: flex; justify-content: space-between; border-radius: 12px; background: #eef3ff; padding: 14px 16px; color: #2f53ca; }
</style>
