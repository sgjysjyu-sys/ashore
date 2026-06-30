<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { loadAllData } from '../utils/dataLoader'

const loading = ref(true)
const programs = ref([])
const filters = reactive({ subject: '不限', score: undefined, rank: undefined, school: '', major: '' })
const filtered = computed(() => programs.value.filter((item) => (
  (filters.subject === '不限' || item.subject === filters.subject)
  && (!filters.school || item.school_name.includes(filters.school))
  && (!filters.major || `${item.major_name} ${item.direction}`.includes(filters.major))
  && (!filters.score || !item.min_score || Number(item.min_score) <= filters.score)
  && (!filters.rank || !item.min_rank || Number(item.min_rank) >= filters.rank)
)))

onMounted(async () => {
  try {
    const data = await loadAllData()
    const scoreMap = new Map(data.scores2025.map((row) => [`${row.subject}:${row.group_code}`, row]))
    programs.value = data.plans.filter((row) => String(row.joint_program) === '是').map((row) => ({
      ...row, ...(scoreMap.get(`${row.subject}:${row.group_code}`) || {}),
    }))
  } catch (error) { ElMessage.error(error.message) }
  finally { loading.value = false }
})
</script>

<template>
  <section><header class="page-heading"><h1>专本联合培养</h1><p>单独筛选湖北省内专本联合培养项目，按科目、成绩、位次、学校和专业缩小范围。</p></header><el-alert title="项目和衔接政策可能调整，最终必须以 2026 官方招生计划及高校招生章程为准。" type="warning" :closable="false" show-icon />
    <div class="surface-card filters"><el-select v-model="filters.subject" placeholder="首选科目"><el-option v-for="v in ['不限','物理','历史']" :key="v" :label="v" :value="v" /></el-select><el-input-number v-model="filters.score" :min="0" :max="750" controls-position="right" placeholder="分数" /><el-input-number v-model="filters.rank" :min="1" controls-position="right" placeholder="位次" /><el-input v-model="filters.school" clearable placeholder="学校名称" /><el-input v-model="filters.major" clearable placeholder="专业名称" /></div>
    <div class="program-grid" v-loading="loading"><article v-for="item in filtered" :key="item.subject + item.group_code + item.major_name" class="surface-card"><div class="program-top"><el-tag>专本联合培养</el-tag><span>{{ item.subject }}</span></div><h2>{{ item.major_name }}</h2><dl><div><dt>高职院校</dt><dd>{{ item.school_name }}</dd></div><div><dt>衔接本科</dt><dd>{{ item.partner_school || '见官方计划' }}</dd></div><div><dt>专业组代码</dt><dd>{{ item.group_code }}</dd></div><div><dt>2025 分 / 位次</dt><dd>{{ item.min_score || '-' }} / {{ item.min_rank || '-' }}</dd></div><div><dt>2026 计划</dt><dd>{{ item.plan_count }} 人</dd></div></dl><p>{{ item.remarks || '具体培养方式以招生章程为准' }}</p></article><el-empty v-if="!loading && !filtered.length" description="没有符合条件的联合培养项目" /></div>
  </section>
</template>

<style scoped>.filters { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-top: 20px; padding: 18px; }.filters :deep(.el-input-number) { width: 100%; }.program-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(310px, 1fr)); gap: 18px; margin-top: 24px; }.program-grid article { padding: 24px; }.program-top { display: flex; align-items: center; justify-content: space-between; color: #6d7890; font-size: 13px; }.program-grid h2 { margin: 15px 0; font-size: 20px; }dl { margin: 0; }dl div { display: flex; justify-content: space-between; gap: 16px; border-top: 1px solid #edf0f5; padding: 10px 0; }dt { color: #7b869a; }dd { margin: 0; text-align: right; font-weight: 600; }.program-grid p { margin: 12px 0 0; color: #9a6b22; font-size: 13px; line-height: 1.6; }@media (max-width: 900px) { .filters { grid-template-columns: 1fr 1fr; } }@media (max-width: 520px) { .filters { grid-template-columns: 1fr; } }</style>
