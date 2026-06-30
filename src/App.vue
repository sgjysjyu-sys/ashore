<script setup>
import { RouterView } from 'vue-router'
import HeaderNav from './components/HeaderNav.vue'
import Disclaimer from './components/Disclaimer.vue'
</script>

<template>
  <div class="app-shell">
    <HeaderNav />
    <main class="page-container">
      <RouterView />
    </main>
    <footer class="site-footer">
      <div class="content-container">
        <Disclaimer />
        <p class="copyright">湖北专科志愿参考 · 数据仅作辅助判断</p>
      </div>
    </footer>
  </div>
</template>
