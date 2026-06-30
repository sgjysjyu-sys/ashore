<script setup>
defineProps({ rows: { type: Array, default: () => [] } })
</script>

<template>
  <el-table :data="rows" empty-text="暂无院校数据" stripe>
    <el-table-column prop="school_name" label="院校名称" min-width="190" />
    <el-table-column prop="school_type" label="性质" width="90" />
    <el-table-column prop="city" label="城市" width="100" />
    <el-table-column prop="featured_majors" label="特色方向" min-width="220" />
  </el-table>
</template>
