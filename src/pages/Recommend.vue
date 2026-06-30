<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import SearchForm from '../components/SearchForm.vue'
import RecommendCard from '../components/RecommendCard.vue'
import RecommendTable from '../components/RecommendTable.vue'
import VolunteerCart from '../components/VolunteerCart.vue'
import { loadAllData } from '../utils/dataLoader'
import { generateRecommendations, RECOMMEND_CATEGORIES } from '../utils/recommend'
import { addVolunteer, loadVolunteers } from '../utils/storage'

const searched = ref(false)
const loading = ref(false)
const result = ref({ userRank: undefined, rankSource: '', items: [], missingHistoryCount: 0 })
const activeCategory = ref('全部')
const page = ref(1)
const pageSize = 10
const volunteerCount = ref(loadVolunteers().length)
const categoryCounts = computed(() => Object.fromEntries(RECOMMEND_CATEGORIES.map((name) => [name, result.value.items.filter((item) => item.category === name).length])))
const filtered = computed(() => activeCategory.value === '全部' ? result.value.items : result.value.items.filter((item) => item.category === activeCategory.value))
const pageRows = computed(() => filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize))

async function search(preferences) {
  loading.value = true
  try {
    result.value = generateRecommendations(await loadAllData(), preferences)
    searched.value = true
    activeCategory.value = '全部'
    page.value = 1
    if (!result.value.items.length) ElMessage.warning('当前筛选条件下没有可分层的推荐结果，请适当放宽条件。')
  } catch (error) {
    ElMessage.error(error.message || '推荐数据加载失败')
  } finally { loading.value = false }
}

function add(item) {
  const outcome = addVolunteer(item)
  volunteerCount.value = outcome.items.length
  outcome.ok ? ElMessage.success('已加入志愿清单') : ElMessage.warning(outcome.reason)
}

function syncCount(event) { volunteerCount.value = event.detail?.length ?? loadVolunteers().length }
onMounted(() => window.addEventListener('volunteers-changed', syncCount))
onBeforeUnmount(() => window.removeEventListener('volunteers-changed', syncCount))
</script>

<template>
  <section>
    <header class="page-heading"><h1>志愿推荐</h1><p>结合 2026 招生计划和近三年最低投档位次，生成冲、稳、保、兜底分层参考。</p></header>
    <div class="surface-card search-panel" v-loading="loading"><SearchForm @search="search" /></div>
    <div v-if="searched" class="results">
      <div class="result-heading"><div><h2>推荐结果</h2><p>参考位次：{{ result.userRank?.toLocaleString() }}（{{ result.rankSource }}）</p></div><VolunteerCart :count="volunteerCount" /></div>
      <el-alert v-if="result.missingHistoryCount" class="coverage-alert" type="warning" :closable="false" show-icon :title="`${result.missingHistoryCount} 个符合筛选条件的专业组因缺少可靠历史位次，未参与冲稳保分层。`" />
      <div class="summary-grid">
        <button v-for="name in RECOMMEND_CATEGORIES" :key="name" :class="['summary-card', { active: activeCategory === name }]" @click="activeCategory = name; page = 1"><span>{{ name }}</span><strong>{{ categoryCounts[name] }}</strong></button>
      </div>
      <div class="filter-row"><el-radio-group v-model="activeCategory" @change="page = 1"><el-radio-button label="全部" value="全部" /><el-radio-button v-for="name in RECOMMEND_CATEGORIES" :key="name" :label="name" :value="name" /></el-radio-group><span>共 {{ filtered.length }} 条</span></div>
      <div class="desktop-table surface-card"><RecommendTable :rows="pageRows" @add="add" /></div>
      <div class="mobile-cards"><RecommendCard v-for="item in pageRows" :key="item.subject + item.groupCode" :item="item" @add="add" /></div>
      <el-pagination v-if="filtered.length > pageSize" v-model:current-page="page" class="pagination" background layout="prev, pager, next" :page-size="pageSize" :total="filtered.length" />
    </div>
    <el-empty v-else description="填写信息后生成推荐结果" />
  </section>
</template>

<style scoped>
.search-panel { padding: 26px; }.results { margin-top: 30px; }.result-heading { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 18px; }.result-heading h2 { margin: 0; font-size: 23px; }.result-heading p { margin: 5px 0 0; color: #778297; font-size: 13px; }.result-heading :deep(.cart) { min-width: 180px; gap: 18px; }.coverage-alert { margin-bottom: 18px; }.summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 22px; }.summary-card { display: flex; align-items: center; justify-content: space-between; border: 1px solid #e3e8f2; border-radius: 13px; background: #fff; padding: 17px; color: #526078; cursor: pointer; }.summary-card strong { font-size: 25px; color: #2e51c7; }.summary-card.active { border-color: #6b82dc; box-shadow: 0 0 0 2px #e7ebff; }.filter-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 14px; color: #798397; font-size: 13px; }.desktop-table { overflow: hidden; }.mobile-cards { display: none; gap: 12px; }.pagination { justify-content: center; margin-top: 24px; }
@media (max-width: 760px) { .result-heading { align-items: stretch; flex-direction: column; }.summary-grid { grid-template-columns: repeat(2, 1fr); }.filter-row { align-items: flex-start; flex-direction: column; }.filter-row :deep(.el-radio-group) { display: flex; flex-wrap: wrap; }.desktop-table { display: none; }.mobile-cards { display: grid; } }
</style>
