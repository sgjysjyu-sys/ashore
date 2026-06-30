# 湖北专科志愿智能推荐

面向湖北普通高考高职高专普通批考生的静态志愿填报辅助工具。根据 2026 招生计划、近三年最低投档位次和一分一段数据生成冲、稳、保、兜底参考，并支持本地志愿清单和 Excel 导出。

## 本地运行

```powershell
npm.cmd install
npm.cmd run dev
```

## 构建

```powershell
npm.cmd run build
```

构建产物位于 `dist/`，应用使用 Hash 路由，可部署到静态托管平台。

## 代码结构

```text
src/
  pages/          五个业务页面
  components/     查询、推荐、院校、清单和免责声明组件
  utils/          数据读取、推荐算法、本地存储和 Excel 导出
public/data/      浏览器运行时读取的 CSV 静态数据
```

## 真实数据

网站数据由用户提供的真实招生计划、投档线和一分一段表生成。执行：

```powershell
npm.cmd run import:data
```

导入采用保守规则：只保留湖北省内专科批计划；历史投档线必须与 2026 专业组代码直接匹配；位次必须能在对应年份一分一段表中精确换算。详细字段和重新导入方式见 [`public/data/README.md`](public/data/README.md)，质量统计见 `public/data/import_report.json`。

即使使用真实公开数据，推荐仍仅供参考，最终必须以官方平台、招生杂志、省招办及高校招生章程为准。
