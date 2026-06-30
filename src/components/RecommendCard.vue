<script setup>
defineProps({ item: { type: Object, required: true } })
defineEmits(['add'])
</script>

<template>
  <article class="recommend-card surface-card">
    <div class="card-top"><div><el-tag :type="item.categoryType || 'primary'">{{ item.category || '待评估' }}</el-tag><span class="code">{{ item.groupCode }}</span></div><el-button type="primary" plain @click="$emit('add', item)">加入志愿</el-button></div>
    <h3>{{ item.schoolName }}</h3>
    <p>{{ item.majors }}</p>
    <div class="meta"><span>{{ item.city }}</span><span>{{ item.schoolType }}</span><span>院校代码 {{ item.schoolCode }}</span><span>计划 {{ item.planCount }} 人</span><span>学费 {{ item.tuition.toLocaleString() }} 元/年</span></div>
    <div v-if="item.risks.length" class="risks"><el-tag v-for="risk in item.risks" :key="risk" type="danger" effect="plain" size="small">{{ risk }}</el-tag></div>
    <p class="reason">{{ item.recommendReason }}</p>
  </article>
</template>

<style scoped>
.recommend-card { padding: 20px; }
.recommend-card h3 { margin: 14px 0 8px; font-size: 18px; }
.recommend-card p { min-height: 44px; margin: 0; color: #68748a; line-height: 1.6; }
.card-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.code { margin-left: 9px; color: #8791a3; font-size: 13px; }
.meta { display: flex; flex-wrap: wrap; gap: 8px 16px; margin-top: 16px; color: #59677f; font-size: 13px; }
.risks { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }.recommend-card .reason { min-height: auto; margin-top: 12px; color: #7b6341; font-size: 13px; }
</style>
