# 数据字段说明

当前 CSV 由 `scripts/import-real-data.mjs` 从用户提供的真实数据目录保守转换生成。原始文件不会被修改；转换报告见 `import_report.json`。

历史投档线只保留格式完整、专业组代码与 2026 计划直接匹配的记录；最低位次仅在同年一分一段表存在可靠的精确分数记录时换算。缺失值不会使用猜测代码或邻近分数填充。

## plans_2026.csv

- `year`：招生年份；`subject`：首选科目（物理/历史）。
- `school_code`、`school_name`、`group_code`：院校及专业组标识。
- `school_type`、`city`：院校性质和城市。
- `major_name`、`direction`：专业名称及归类方向；同一专业组可占多行。
- `plan_count`、`tuition`：招生人数和每年学费。
- `joint_program`、`partner_school`：是否专本联合培养及衔接本科院校。
- `remarks`：身体、单科、性别、合作办学等限制说明。

## scores_2025.csv / scores_2024.csv / scores_2023.csv

- `year`、`subject`、`school_code`、`school_name`、`group_code`：历史投档记录标识。
- `min_score`、`min_rank`：该专业组最低投档分和最低投档位次。
- `remarks`：数据来源或特殊情况说明。

## ranks_2026_physics.csv / ranks_2026_history.csv

- `score`：分数；`rank_from`、`rank_to`：该分数对应的位次区间。
- `count`：该分数段人数；`remarks`：数据说明。

## schools.csv

- `school_code`、`school_name`、`school_type`、`city`、`region`：院校基础信息。
- `featured_majors`：用于搜索和筛选的特色专业关键词，以 `|` 分隔。
- `joint_program`：是否存在专本联合培养示例项目。
- `website`、`remarks`：官网和补充说明。

## 重新导入

默认从项目同级的 `高职高专普通批次` 目录读取：

```powershell
npm.cmd run import:data
```

也可以指定其他源目录：

```powershell
node scripts/import-real-data.mjs "D:\path\to\data"
```
