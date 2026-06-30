<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import VolunteerCart from '../components/VolunteerCart.vue'
import { clearVolunteers, loadVolunteers, moveVolunteer, removeVolunteer, VOLUNTEER_LIMIT } from '../utils/storage'
import { exportVolunteerList } from '../utils/exportExcel'

const items = ref(loadVolunteers())
function remove(index) { items.value = removeVolunteer(index); ElMessage.success('已删除') }
function move(index, offset) { items.value = moveVolunteer(index, offset) }
async function clearAll() {
  if (!items.value.length) return
  await ElMessageBox.confirm('确定清空全部志愿吗？此操作不可撤销。', '清空志愿清单', { type: 'warning' })
  clearVolunteers(); items.value = []; ElMessage.success('已清空')
}
function exportFile() {
  if (!items.value.length) return ElMessage.warning('请先添加志愿')
  exportVolunteerList(items.value); ElMessage.success('Excel 草表已生成')
}
</script>

<template>
  <section><header class="page-heading"><h1>志愿清单</h1><p>调整院校专业组顺序并导出 Excel 草表，最多保存 {{ VOLUNTEER_LIMIT }} 条。</p></header>
    <div class="toolbar"><VolunteerCart :count="items.length" /><div><el-button :disabled="!items.length" @click="clearAll">清空</el-button><el-button type="primary" :disabled="!items.length" @click="exportFile">导出 Excel</el-button></div></div>
    <div v-if="items.length" class="surface-card list-wrap"><el-table :data="items" stripe><el-table-column type="index" label="顺序" width="70" /><el-table-column prop="schoolName" label="院校" min-width="180" /><el-table-column prop="groupCode" label="专业组" width="110" /><el-table-column prop="majors" label="专业方向" min-width="210" /><el-table-column prop="category" label="类型" width="90" /><el-table-column label="风险" min-width="160"><template #default="scope">{{ scope.row.risks?.join('、') || '无' }}</template></el-table-column><el-table-column fixed="right" label="操作" width="190"><template #default="scope"><el-button link :disabled="scope.$index === 0" @click="move(scope.$index, -1)">上移</el-button><el-button link :disabled="scope.$index === items.length - 1" @click="move(scope.$index, 1)">下移</el-button><el-button type="danger" link @click="remove(scope.$index)">删除</el-button></template></el-table-column></el-table></div>
    <div v-else class="surface-card empty-card"><el-empty description="暂未添加院校专业组"><RouterLink :to="{ name: 'recommend' }"><el-button type="primary">前往志愿推荐</el-button></RouterLink></el-empty></div>
    <p class="storage-note">清单仅保存在当前浏览器的 localStorage 中，不上传个人信息。更换设备或清理浏览器数据后将无法恢复。</p>
  </section>
</template>

<style scoped>.toolbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 18px; }.toolbar :deep(.cart) { min-width: 200px; }.list-wrap { overflow: hidden; }.empty-card { padding: 22px; }.storage-note { margin-top: 15px; color: #8791a4; font-size: 13px; line-height: 1.6; }@media (max-width: 600px) { .toolbar { align-items: stretch; flex-direction: column; }.toolbar > div:last-child { display: flex; }.toolbar > div:last-child button { flex: 1; } }</style>
