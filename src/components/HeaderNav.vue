<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const open = ref(false)
const navItems = [
  { name: 'home', label: '首页' },
  { name: 'recommend', label: '志愿推荐' },
  { name: 'schools', label: '院校库' },
  { name: 'joint-program', label: '专本联合培养' },
  { name: 'volunteers', label: '志愿清单' },
]

watch(() => route.fullPath, () => { open.value = false })
</script>

<template>
  <header class="header">
    <div class="nav-wrap">
      <RouterLink :to="{ name: 'home' }" class="brand" aria-label="返回首页">
        <span class="brand-mark">鄂</span>
        <span><strong>湖北专科志愿参考</strong><small>公开数据 · 理性填报</small></span>
      </RouterLink>
      <button class="menu-button" type="button" :aria-expanded="open" aria-label="打开导航菜单" @click="open = !open">
        <span></span><span></span><span></span>
      </button>
      <nav :class="['nav-links', { open }]" aria-label="主导航">
        <RouterLink v-for="item in navItems" :key="item.name" :to="{ name: item.name }">
          {{ item.label }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header { position: sticky; top: 0; z-index: 50; border-bottom: 1px solid rgba(221, 227, 239, .9); background: rgba(255, 255, 255, .94); backdrop-filter: blur(12px); }
.nav-wrap { position: relative; display: flex; width: min(100% - 32px, 1200px); min-height: 72px; margin: auto; align-items: center; justify-content: space-between; gap: 28px; }
.brand { display: flex; align-items: center; gap: 11px; flex-shrink: 0; }
.brand-mark { display: grid; width: 40px; height: 40px; place-items: center; border-radius: 12px; background: linear-gradient(135deg, #315be8, #6848d8); color: #fff; font-weight: 800; }
.brand strong, .brand small { display: block; }
.brand strong { color: #15213e; font-size: 16px; }
.brand small { margin-top: 2px; color: #8992a5; font-size: 11px; }
.nav-links { display: flex; align-items: center; gap: 4px; }
.nav-links a { border-radius: 9px; padding: 9px 13px; color: #536078; font-size: 14px; font-weight: 600; transition: .2s; }
.nav-links a:hover, .nav-links a.router-link-active { background: #eef2ff; color: #3156d9; }
.menu-button { display: none; width: 42px; height: 42px; border: 0; border-radius: 9px; background: #f1f4fa; padding: 10px; }
.menu-button span { display: block; height: 2px; margin: 4px 0; border-radius: 2px; background: #34425d; }
@media (max-width: 820px) {
  .nav-wrap { width: min(100% - 24px, 1200px); min-height: 64px; }
  .menu-button { display: block; }
  .nav-links { position: absolute; top: 58px; right: 0; left: 0; display: none; flex-direction: column; align-items: stretch; border: 1px solid #e3e8f2; border-radius: 14px; background: #fff; padding: 8px; box-shadow: 0 16px 40px rgba(31, 46, 78, .14); }
  .nav-links.open { display: flex; }
  .nav-links a { padding: 12px 14px; }
}
</style>
