<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { loadAllData } from '../utils/dataLoader'

const loading = ref(true)
const schools = ref([])
const selected = ref()
const detailOpen = ref(false)
const page = ref(1)
const pageSize = 8
const filters = reactive({ keyword: '', city: '不限', type: '不限', direction: '', jointOnly: false })
const directions = ['计算机', '护理', '铁路', '电力', '财经', '学前教育', '建筑', '机械', '旅游']
const filtered = computed(() => schools.value.filter((item) => {
  const haystack = `${item.school_name} ${item.featured_majors}`
  return (!filters.keyword || haystack.includes(filters.keyword))
    && (filters.city === '不限' || (filters.city === '武汉' ? item.city === '武汉' : item.city !== '武汉'))
    && (filters.type === '不限' || item.school_type === filters.type)
    && (!filters.direction || haystack.includes(filters.direction))
    && (!filters.jointOnly || String(item.joint_program) === '是')
}))
const pageRows = computed(() => filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize))

onMounted(async () => {
  try { schools.value = (await loadAllData()).schools }
  catch (error) { ElMessage.error(error.message) }
  finally { loading.value = false }
})
function showDetail(row) { selected.value = row; detailOpen.value = true }
</script>

<template>
  <section><header class="page-heading"><h1>院校库</h1><p>搜索和筛选湖北省内专科院校，查看院校性质、城市及特色专业方向。</p></header>
    <div class="surface-card filter-panel"><el-input v-model="filters.keyword" clearable placeholder="搜索学校名称" @input="page = 1" /><el-select v-model="filters.city" @change="page = 1"><el-option v-for="v in ['不限','武汉','省内其他']" :key="v" :label="v" :value="v" /></el-select><el-select v-model="filters.type" @change="page = 1"><el-option v-for="v in ['不限','公办','民办']" :key="v" :label="v" :value="v" /></el-select><el-select v-model="filters.direction" clearable placeholder="专业方向" @change="page = 1"><el-option v-for="v in directions" :key="v" :label="v" :value="v" /></el-select><el-checkbox v-model="filters.jointOnly" @change="page = 1">专本联合培养</el-checkbox></div>
    <div class="surface-card table-wrap" v-loading="loading"><el-table :data="pageRows" stripe><el-table-column prop="school_name" label="院校名称" min-width="190" /><el-table-column prop="school_type" label="性质" width="90" /><el-table-column prop="city" label="城市" width="100" /><el-table-column prop="featured_majors" label="特色专业方向" min-width="220" /><el-table-column label="联合培养" width="105"><template #default="scope">{{ scope.row.joint_program || '否' }}</template></el-table-column><el-table-column label="操作" width="100"><template #default="scope"><el-button type="primary" link @click="showDetail(scope.row)">查看详情</el-button></template></el-table-column></el-table><p class="data-note">共 {{ filtered.length }} 所；当前为示例数据，正式使用前请替换并核验。</p></div>
    <el-pagination v-if="filtered.length > pageSize" v-model:current-page="page" class="pagination" background layout="prev, pager, next" :page-size="pageSize" :total="filtered.length" />
    <el-dialog v-model="detailOpen" title="院校详情" width="min(92vw, 560px)"><template v-if="selected"><el-descriptions :column="1" border><el-descriptions-item label="院校名称">{{ selected.school_name }}</el-descriptions-item><el-descriptions-item label="院校代码">{{ selected.school_code }}</el-descriptions-item><el-descriptions-item label="性质 / 城市">{{ selected.school_type }} / {{ selected.city }}</el-descriptions-item><el-descriptions-item label="特色方向">{{ selected.featured_majors }}</el-descriptions-item><el-descriptions-item label="专本联合培养">{{ selected.joint_program || '否' }}</el-descriptions-item><el-descriptions-item label="说明">{{ selected.remarks || '请以学校招生章程为准' }}</el-descriptions-item></el-descriptions></template></el-dialog>
  </section>
</template>

<style scoped>.filter-panel { display: grid; grid-template-columns: 1.5fr repeat(3, 1fr) auto; align-items: center; gap: 12px; margin-bottom: 18px; padding: 18px; }.table-wrap { overflow: hidden; }.data-note { margin: 0; border-top: 1px solid #edf0f4; padding: 14px 18px; color: #8791a4; font-size: 13px; }.pagination { justify-content: center; margin-top: 24px; }@media (max-width: 800px) { .filter-panel { grid-template-columns: 1fr 1fr; } }@media (max-width: 520px) { .filter-panel { grid-template-columns: 1fr; } }</style>
