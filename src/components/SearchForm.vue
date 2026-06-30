<script setup>
import { reactive, ref } from 'vue'

const emit = defineEmits(['search'])
const formRef = ref()
const form = reactive({
  subject: '物理', score: undefined, rank: undefined, schoolType: '不限',
  city: '不限', direction: '', jointOnly: false,
})
const directions = ['计算机', '护理', '铁路', '电力', '财经', '学前教育', '建筑', '机械', '旅游']
const rules = {
  score: [{ validator: (_rule, _value, callback) => form.score || form.rank ? callback() : callback(new Error('分数和位次至少填写一项')), trigger: 'blur' }],
}

async function submit() {
  if (!await formRef.value.validate().catch(() => false)) return
  emit('search', { ...form })
}
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" class="search-form" label-position="top" @submit.prevent="submit">
    <div class="form-grid">
      <el-form-item label="首选科目">
        <el-select v-model="form.subject" class="w-full"><el-option label="物理" value="物理" /><el-option label="历史" value="历史" /></el-select>
      </el-form-item>
      <el-form-item label="高考分数" prop="score">
        <el-input-number v-model="form.score" :min="0" :max="750" controls-position="right" placeholder="请输入分数" />
      </el-form-item>
      <el-form-item label="全省位次（优先）">
        <el-input-number v-model="form.rank" :min="1" controls-position="right" placeholder="请输入位次" />
      </el-form-item>
      <el-form-item label="院校性质">
        <el-select v-model="form.schoolType" class="w-full"><el-option label="不限" value="不限" /><el-option label="公办" value="公办" /><el-option label="民办" value="民办" /></el-select>
      </el-form-item>
      <el-form-item label="城市">
        <el-select v-model="form.city" class="w-full"><el-option label="不限" value="不限" /><el-option label="武汉" value="武汉" /><el-option label="省内其他" value="省内其他" /></el-select>
      </el-form-item>
      <el-form-item label="专业方向">
        <el-select v-model="form.direction" clearable class="w-full" placeholder="不限">
          <el-option v-for="item in directions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="培养类型">
        <el-checkbox v-model="form.jointOnly">只看专本联合培养</el-checkbox>
      </el-form-item>
    </div>
    <div class="submit-row"><el-button type="primary" size="large" native-type="submit">生成推荐</el-button><span>优先使用位次；未填写时按 2026 一分一段表换算，缺少可靠记录时请直接填写位次。</span></div>
  </el-form>
</template>

<style scoped>
.form-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px 18px; }
:deep(.el-input-number) { width: 100%; }
.submit-row { display: flex; align-items: center; gap: 14px; }.submit-row span { color: #818b9e; font-size: 13px; }
@media (max-width: 900px) { .form-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .form-grid { grid-template-columns: 1fr; }.submit-row { align-items: flex-start; flex-direction: column; } }
</style>
