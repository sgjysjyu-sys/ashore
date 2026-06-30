<script setup>
defineProps({ rows: { type: Array, default: () => [] } })
defineEmits(['add'])
</script>

<template>
  <el-table :data="rows" empty-text="暂无推荐数据" stripe border>
    <el-table-column fixed prop="category" label="类型" width="90"><template #default="scope"><el-tag :type="scope.row.categoryType">{{ scope.row.category }}</el-tag></template></el-table-column>
    <el-table-column prop="schoolName" label="院校" min-width="180" />
    <el-table-column prop="schoolCode" label="院校代码" width="105" />
    <el-table-column prop="groupCode" label="专业组" width="110" />
    <el-table-column prop="city" label="城市" width="85" />
    <el-table-column prop="schoolType" label="性质" width="80" />
    <el-table-column prop="majors" label="专业方向" min-width="220" />
    <el-table-column label="2025 分/位次" width="145"><template #default="scope">{{ scope.row.history[2025]?.min_score || '-' }} / {{ scope.row.history[2025]?.min_rank || '-' }}</template></el-table-column>
    <el-table-column label="2024 分/位次" width="145"><template #default="scope">{{ scope.row.history[2024]?.min_score || '-' }} / {{ scope.row.history[2024]?.min_rank || '-' }}</template></el-table-column>
    <el-table-column label="2023 分/位次" width="145"><template #default="scope">{{ scope.row.history[2023]?.min_score || '-' }} / {{ scope.row.history[2023]?.min_rank || '-' }}</template></el-table-column>
    <el-table-column prop="planCount" label="2026计划" width="95" />
    <el-table-column label="学费" width="105"><template #default="scope">{{ scope.row.tuition.toLocaleString() }}</template></el-table-column>
    <el-table-column label="风险标签" min-width="190"><template #default="scope"><div class="risk-cell"><el-tag v-for="risk in scope.row.risks" :key="risk" type="danger" effect="plain" size="small">{{ risk }}</el-tag><span v-if="!scope.row.risks.length">无</span></div></template></el-table-column>
    <el-table-column prop="recommendReason" label="推荐理由" min-width="260" show-overflow-tooltip />
    <el-table-column fixed="right" label="操作" width="105"><template #default="scope"><el-button type="primary" link @click="$emit('add', scope.row)">加入志愿</el-button></template></el-table-column>
  </el-table>
</template>

<style scoped>.risk-cell { display: flex; flex-wrap: wrap; gap: 4px; }</style>
