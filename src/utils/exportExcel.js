import * as XLSX from 'xlsx'

export function exportVolunteerList(items, fileName = '湖北高考志愿草表.xlsx') {
  const workbook = XLSX.utils.book_new()
  const rows = (Array.isArray(items) ? items : []).map((item, index) => ({
    '志愿顺序': index + 1,
    '首选科目': item.subject,
    '院校名称': item.schoolName,
    '院校代码': item.schoolCode,
    '专业组代码': item.groupCode,
    '城市': item.city,
    '院校性质': item.schoolType,
    '专业方向': item.majors,
    '推荐类型': item.category,
    '2026招生人数': item.planCount,
    '学费（元/年）': item.tuition,
    '风险提示': item.risks?.join('、') || '无',
    '备注': '仅供参考，请以官方招生资料为准',
  }))
  const worksheet = XLSX.utils.json_to_sheet(rows)
  worksheet['!cols'] = [8, 10, 24, 12, 14, 10, 10, 28, 10, 14, 14, 28, 36].map((wch) => ({ wch }))
  XLSX.utils.book_append_sheet(workbook, worksheet, '志愿草表')
  XLSX.writeFile(workbook, fileName)
}
