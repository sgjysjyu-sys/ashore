import fs from 'node:fs'
import path from 'node:path'
import * as XLSX from 'xlsx'

XLSX.set_fs(fs)

const SOURCE_DIR = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(process.cwd(), '..', '\u9ad8\u804c\u9ad8\u4e13\u666e\u901a\u6279\u6b21')
const OUTPUT_DIR = path.resolve(process.cwd(), 'public', 'data')

const P = {
  year: '\u5e74\u4efd', source: '\u751f\u6e90\u5730', batch: '\u6279\u6b21', subject: '\u79d1\u7c7b',
  planCategory: '\u8ba1\u5212\u7c7b\u522b', schoolCode: '\u9662\u6821\u4ee3\u7801', schoolName: '\u9662\u6821\u540d\u79f0',
  groupCode: '\u9662\u6821\u4e13\u4e1a\u7ec4\u4ee3\u7801', majorName: '\u4e13\u4e1a\u540d\u79f0', majorFullName: '\u4e13\u4e1a\u5168\u79f0',
  majorRemarks: '\u4e13\u4e1a\u5907\u6ce8', selection: '\u9009\u79d1\u8981\u6c42', level: '\u4e13\u4e1a\u5c42\u6b21',
  planCount: '\u8ba1\u5212\u4eba\u6570', tuition: '\u5b66\u8d39', groupMajors: '\u7ec4\u5185\u4e13\u4e1a',
  province: '\u6240\u5728\u7701', city: '\u57ce\u5e02', schoolTags: '\u9662\u6821\u6807\u7b7e', schoolType: '\u516c\u79c1\u6027\u8d28',
  charter: '\u62db\u751f\u7ae0\u7a0b', category: '\u95e8\u7c7b', majorCategory: '\u4e13\u4e1a\u7c7b',
}
const H = {
  groupCode: '\u9662\u6821\u4e13\u4e1a\u7ec4\u4ee3\u53f7', groupName: '\u9662\u6821\u4e13\u4e1a\u7ec4\u540d\u79f0',
  minScore: '\u6295\u6863\u6700\u4f4e\u5206',
}
const R = { score: '\u5206\u6570', count: '\u6bb5\u5185\u4eba\u6570', cumulative: '\u7d2f\u8ba1\u4eba\u6570' }

const PLAN_HEADERS = ['year', 'subject', 'school_code', 'school_name', 'group_code', 'school_type', 'city', 'major_name', 'direction', 'plan_count', 'tuition', 'joint_program', 'partner_school', 'remarks']
const SCORE_HEADERS = ['year', 'subject', 'school_code', 'school_name', 'group_code', 'min_score', 'min_rank', 'remarks']
const RANK_HEADERS = ['year', 'subject', 'score', 'rank_from', 'rank_to', 'count', 'remarks']
const SCHOOL_HEADERS = ['school_code', 'school_name', 'school_type', 'city', 'region', 'featured_majors', 'joint_program', 'website', 'remarks']

function text(value) { return String(value ?? '').replace(/^\uFEFF/, '').trim() }
function number(value) { const parsed = Number(value); return Number.isFinite(parsed) ? parsed : undefined }
function findDirectory(fragment) {
  return fs.readdirSync(SOURCE_DIR, { withFileTypes: true }).find((item) => item.isDirectory() && item.name.includes(fragment))?.name
}
function readCsv(file) {
  const content = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '')
  const workbook = XLSX.read(content, { type: 'string' })
  return XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: '' })
}
function writeCsv(fileName, headers, rows) {
  const values = [headers, ...rows.map((row) => headers.map((header) => row[header] ?? ''))]
  const sheet = XLSX.utils.aoa_to_sheet(values)
  fs.writeFileSync(path.join(OUTPUT_DIR, fileName), `\uFEFF${XLSX.utils.sheet_to_csv(sheet)}`, 'utf8')
}
function unique(values) { return [...new Set(values.filter(Boolean))] }
function validGroupCode(value) { return /^[A-Z]\d{5}$/.test(text(value)) }

const directionRules = [
  ['\u8ba1\u7b97\u673a', /\u8ba1\u7b97\u673a|\u8f6f\u4ef6|\u4eba\u5de5\u667a\u80fd|\u5927\u6570\u636e\u6280\u672f|\u4e91\u8ba1\u7b97|\u4fe1\u606f\u5b89\u5168/],
  ['\u62a4\u7406', /\u62a4\u7406|\u52a9\u4ea7/],
  ['\u94c1\u8def', /\u94c1\u9053|\u94c1\u8def|\u8f68\u9053\u4ea4\u901a|\u52a8\u8f66/],
  ['\u7535\u529b', /\u7535\u529b|\u53d1\u7535|\u8f93\u914d\u7535|\u4f9b\u7528\u7535|\u7535\u6c14/],
  ['\u8d22\u7ecf', /\u4f1a\u8ba1|\u8d22\u52a1|\u91d1\u878d|\u7ecf\u6d4e|\u5546\u52a1|\u8d38\u6613|\u5ba1\u8ba1|\u7a0e\u52a1/],
  ['\u5b66\u524d\u6559\u80b2', /\u5b66\u524d\u6559\u80b2/],
  ['\u5efa\u7b51', /\u5efa\u7b51|\u5de5\u7a0b\u9020\u4ef7|\u5efa\u8bbe\u5de5\u7a0b/],
  ['\u673a\u68b0', /\u673a\u68b0|\u673a\u7535|\u6570\u63a7|\u6a21\u5177|\u5de5\u4e1a\u673a\u5668\u4eba/],
  ['\u65c5\u6e38', /\u65c5\u6e38|\u9152\u5e97|\u5bfc\u6e38/],
]
function classifyDirection(value) {
  const source = text(value)
  return unique(directionRules.filter(([, pattern]) => pattern.test(source)).map(([name]) => name)).join('|') || '\u5176\u4ed6'
}
function extractPartner(value) {
  return text(value).match(/\u4e0e([^\uff1b;,\uff0c\uff08\uff09()]+?)(?:\u8054\u5408\u57f9\u517b|\u5408\u4f5c)/)?.[1]?.trim() || ''
}

if (!fs.existsSync(SOURCE_DIR)) throw new Error(`\u627e\u4e0d\u5230\u771f\u5b9e\u6570\u636e\u76ee\u5f55: ${SOURCE_DIR}`)
fs.mkdirSync(OUTPUT_DIR, { recursive: true })

const workbookName = fs.readdirSync(SOURCE_DIR).find((name) => name.endsWith('.xlsx'))
if (!workbookName) throw new Error('\u771f\u5b9e\u6570\u636e\u76ee\u5f55\u4e2d\u6ca1\u6709 xlsx \u62db\u751f\u8ba1\u5212')
const workbook = XLSX.readFile(path.join(SOURCE_DIR, workbookName), { dense: true })
const planSourceRows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { range: 1, defval: '' })
const targetPlanRows = planSourceRows.filter((row) =>
  text(row[P.year]) === '2026'
  && text(row[P.source]) === '\u6e56\u5317'
  && text(row[P.batch]) === '\u4e13\u79d1\u6279'
  && text(row[P.level]) === '\u4e13\u79d1'
  && text(row[P.province]) === '\u6e56\u5317'
  && ['\u7269\u7406', '\u5386\u53f2'].includes(text(row[P.subject]))
  && validGroupCode(row[P.groupCode])
  && (number(row[P.planCount]) || 0) > 0,
)

const planRows = targetPlanRows.map((row) => {
  const context = [row[P.majorFullName], row[P.majorName], row[P.majorRemarks], row[P.groupMajors], row[P.category], row[P.majorCategory]].map(text).join(' ')
  const remarks = text(row[P.majorRemarks])
  const joint = text(row[P.planCategory]) === '\u4e13\u672c\u8054\u5408\u57f9\u517b' || context.includes('\u4e13\u672c\u8054\u5408\u57f9\u517b')
  return {
    year: 2026, subject: text(row[P.subject]), school_code: text(row[P.schoolCode]), school_name: text(row[P.schoolName]),
    group_code: text(row[P.groupCode]), school_type: text(row[P.schoolType]), city: text(row[P.city]),
    major_name: text(row[P.majorName]), direction: classifyDirection(context), plan_count: number(row[P.planCount]) || 0,
    tuition: number(row[P.tuition]) || 0, joint_program: joint ? '\u662f' : '\u5426',
    partner_school: joint ? extractPartner(remarks) : '', remarks,
  }
})

const currentGroups = new Map()
for (const row of planRows) {
  const key = `${row.subject}:${row.group_code}`
  if (!currentGroups.has(key)) currentGroups.set(key, { ...row, directions: [], joint: false })
  const group = currentGroups.get(key)
  group.directions.push(...row.direction.split('|'))
  group.joint ||= row.joint_program === '\u662f'
}

const schoolGroups = new Map()
for (const row of planRows) {
  if (!schoolGroups.has(row.school_code)) schoolGroups.set(row.school_code, { ...row, directions: [], joint: false })
  const school = schoolGroups.get(row.school_code)
  school.directions.push(...row.direction.split('|'))
  school.joint ||= row.joint_program === '\u662f'
}
const schoolRows = [...schoolGroups.values()].map((row) => ({
  school_code: row.school_code, school_name: row.school_name, school_type: row.school_type, city: row.city,
  region: row.city === '\u6b66\u6c49' ? '\u6b66\u6c49' : '\u7701\u5185\u5176\u4ed6',
  featured_majors: unique(row.directions.filter((item) => item !== '\u5176\u4ed6')).join('|'),
  joint_program: row.joint ? '\u662f' : '\u5426', website: '', remarks: '\u6570\u636e\u6765\u81ea2026\u5e74\u62db\u751f\u8ba1\u5212',
}))

const rankDirectory = findDirectory('\u4e00\u5206\u4e00\u6bb5')
const scoreDirectory = findDirectory('\u6295\u6863\u7ebf')
if (!rankDirectory || !scoreDirectory) throw new Error('\u7f3a\u5c11\u4e00\u5206\u4e00\u6bb5\u8868\u6216\u6295\u6863\u7ebf\u76ee\u5f55')

const rankMaps = {}
const rankOutputs = {}
const rankQuality = {}
for (const year of [2023, 2024, 2025, 2026]) {
  rankMaps[year] = {}
  for (const subject of ['\u7269\u7406', '\u5386\u53f2']) {
    const file = fs.readdirSync(path.join(SOURCE_DIR, rankDirectory)).find((name) => name.startsWith(`${year}_${subject}_`))
    const rawRows = readCsv(path.join(SOURCE_DIR, rankDirectory, file))
      .map((row) => ({ score: number(row[R.score]), count: number(row[R.count]), cumulative: number(row[R.cumulative]) }))
      .filter((row) => row.score !== undefined && row.count !== undefined && row.cumulative !== undefined)
      .sort((a, b) => b.score - a.score)
    let anomalies = 0
    const normalized = rawRows.map((row, index) => {
      const previous = rawRows[index - 1]
      const next = rawRows[index + 1]
      const suspicious = (previous && row.cumulative < previous.cumulative) || (next && next.cumulative < row.cumulative)
      if (suspicious) anomalies += 1
      return { year, subject, score: row.score, rank_from: Math.max(1, row.cumulative - row.count + 1), rank_to: row.cumulative, count: row.count, remarks: suspicious ? '\u539f\u59cb\u7d2f\u8ba1\u4eba\u6570\u5b58\u5728\u5355\u8c03\u6027\u5f02\u5e38\uff0c\u8bf7\u590d\u6838' : '\u771f\u5b9e\u4e00\u5206\u4e00\u6bb5\u6570\u636e' }
    })
    rankMaps[year][subject] = new Map(normalized.filter((row) => !row.remarks.includes('\u5f02\u5e38')).map((row) => [row.score, row]))
    rankOutputs[`${year}:${subject}`] = normalized
    rankQuality[`${year}_${subject}`] = { sourceRows: rawRows.length, anomalousRowsExcludedFromConversion: anomalies }
  }
}

const scoreQuality = {}
const scoreOutputs = { 2023: [], 2024: [], 2025: [] }
for (const year of [2023, 2024, 2025]) {
  for (const subject of ['\u7269\u7406', '\u5386\u53f2']) {
    const file = fs.readdirSync(path.join(SOURCE_DIR, scoreDirectory)).find((name) => name.startsWith(`${year}_${subject}_`))
    const rawRows = readCsv(path.join(SOURCE_DIR, scoreDirectory, file))
    let strictRows = 0
    let matchedGroups = 0
    let derivedRanks = 0
    const seen = new Set()
    for (const row of rawRows) {
      const code = text(row[H.groupCode])
      const name = text(row[H.groupName]).replace(/^\|/, '')
      const minScore = number(row[H.minScore])
      if (!validGroupCode(code) || !name.includes('\u7b2c') || !name.includes('\u7ec4') || minScore === undefined || minScore < 100 || minScore > 750) continue
      strictRows += 1
      const key = `${subject}:${code}`
      const current = currentGroups.get(key)
      if (!current || seen.has(key)) continue
      seen.add(key)
      matchedGroups += 1
      const rankRow = rankMaps[year][subject].get(minScore)
      if (rankRow) derivedRanks += 1
      scoreOutputs[year].push({
        year, subject, school_code: current.school_code, school_name: current.school_name, group_code: code,
        min_score: minScore, min_rank: rankRow?.rank_to || '',
        remarks: rankRow
          ? `\u4e13\u4e1a\u7ec4\u4ee3\u7801\u76f4\u63a5\u5339\u914d\uff1b\u4f4d\u6b21\u7531${year}\u5e74\u4e00\u5206\u4e00\u6bb5\u8868\u6362\u7b97`
          : '\u4e13\u4e1a\u7ec4\u4ee3\u7801\u76f4\u63a5\u5339\u914d\uff1b\u5bf9\u5e94\u5206\u6570\u7f3a\u5c11\u4e00\u5206\u4e00\u6bb5\u8bb0\u5f55',
      })
    }
    scoreQuality[`${year}_${subject}`] = { sourceRows: rawRows.length, strictRows, matchedCurrentGroups: matchedGroups, ranksDerived: derivedRanks }
  }
}

writeCsv('plans_2026.csv', PLAN_HEADERS, planRows)
writeCsv('scores_2025.csv', SCORE_HEADERS, scoreOutputs[2025])
writeCsv('scores_2024.csv', SCORE_HEADERS, scoreOutputs[2024])
writeCsv('scores_2023.csv', SCORE_HEADERS, scoreOutputs[2023])
writeCsv('ranks_2026_physics.csv', RANK_HEADERS, rankOutputs['2026:\u7269\u7406'])
writeCsv('ranks_2026_history.csv', RANK_HEADERS, rankOutputs['2026:\u5386\u53f2'])
writeCsv('schools.csv', SCHOOL_HEADERS, schoolRows)

const report = {
  generatedAt: new Date().toISOString(), sourceDirectory: path.basename(SOURCE_DIR), policy: '\u4fdd\u5b88\u5bfc\u5165\uff1a\u4ec5\u4f7f\u7528\u683c\u5f0f\u5b8c\u6574\u4e14\u4e0e2026\u4e13\u4e1a\u7ec4\u4ee3\u7801\u76f4\u63a5\u5339\u914d\u7684\u5386\u53f2\u8bb0\u5f55\uff0c\u4e0d\u731c\u6d4b\u4fee\u590d\u635f\u574f\u4ee3\u7801',
  plans: { sourceRows: planSourceRows.length, importedMajorRows: planRows.length, groups: currentGroups.size, schools: schoolRows.length, jointGroups: [...currentGroups.values()].filter((row) => row.joint).length },
  scores: scoreQuality, ranks: rankQuality,
}
fs.writeFileSync(path.join(OUTPUT_DIR, 'import_report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(JSON.stringify(report, null, 2))
