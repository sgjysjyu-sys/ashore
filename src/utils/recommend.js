export const RECOMMEND_CATEGORIES = ['冲一冲', '稳一稳', '保一保', '兜底']

const CATEGORY_META = {
  '冲一冲': { type: 'warning', order: 1 },
  '稳一稳': { type: 'primary', order: 2 },
  '保一保': { type: 'success', order: 3 },
  '兜底': { type: 'info', order: 4 },
}

const numberValue = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

const text = (value) => String(value ?? '').trim()

export function scoreToRank(score, subject, rankRows) {
  const target = numberValue(score)
  if (target === undefined || !rankRows?.length) return undefined
  const exact = rankRows.find((row) =>
    (!row.subject || text(row.subject) === subject)
    && numberValue(row.score) === target
    && !text(row.remarks).includes('异常'),
  )
  return exact ? (numberValue(exact.rank_to) ?? numberValue(exact.rank_from)) : undefined
}

export function classifyByRank(userRank, referenceRank) {
  const delta = (referenceRank - userRank) / userRank
  if (delta < -0.2) return undefined
  if (delta < -0.05) return '冲一冲'
  if (delta <= 0.05) return '稳一稳'
  if (delta <= 0.25) return '保一保'
  return '兜底'
}

function createScoreMap(rows) {
  return new Map(rows.map((row) => [`${text(row.subject)}:${text(row.group_code)}`, row]))
}

function buildRisks(item) {
  const risks = []
  const context = `${item.majors} ${item.remarks}`
  if (item.schoolType === '民办') risks.push('民办院校')
  if (item.tuition >= 10000) risks.push('学费较高')
  if (/中外合作/.test(context)) risks.push('中外合作')
  if (/校企合作/.test(context)) risks.push('校企合作')
  if (item.planCount <= 5) risks.push('招生计划较少')
  if (/身体|体检|色盲|色弱|视力/.test(context)) risks.push('身体条件限制')
  if (/单科|英语成绩|数学成绩/.test(context)) risks.push('单科成绩限制')
  if (/男生|女生|性别/.test(context)) risks.push('性别限制')
  if (item.historyCount < 3) risks.push('历史数据不足')
  return risks
}

function groupPlans(rows, subject) {
  const groups = new Map()
  rows.filter((row) => text(row.subject) === subject).forEach((row) => {
    const key = text(row.group_code)
    const current = groups.get(key)
    if (current) {
      current.majors.push(text(row.major_name))
      current.directions.push(text(row.direction))
      current.planCount += numberValue(row.plan_count) || 0
      current.tuition = Math.max(current.tuition, numberValue(row.tuition) || 0)
      current.jointProgram ||= ['是', 'true', '1'].includes(text(row.joint_program).toLowerCase())
      current.remarks.push(text(row.remarks))
    } else {
      groups.set(key, {
        schoolCode: text(row.school_code), schoolName: text(row.school_name), groupCode: key,
        schoolType: text(row.school_type), city: text(row.city), subject,
        majors: [text(row.major_name)], directions: [text(row.direction)],
        planCount: numberValue(row.plan_count) || 0, tuition: numberValue(row.tuition) || 0,
        jointProgram: ['是', 'true', '1'].includes(text(row.joint_program).toLowerCase()),
        remarks: [text(row.remarks)],
      })
    }
  })
  return [...groups.values()]
}

export function generateRecommendations(data, preferences) {
  const rankRows = preferences.subject === '物理' ? data.ranksPhysics : data.ranksHistory
  const enteredRank = numberValue(preferences.rank)
  const userRank = enteredRank || scoreToRank(preferences.score, preferences.subject, rankRows)
  if (!userRank) throw new Error('该分数缺少可靠的一分一段记录，请直接输入全省位次。')

  const scoreMaps = {
    2025: createScoreMap(data.scores2025),
    2024: createScoreMap(data.scores2024),
    2023: createScoreMap(data.scores2023),
  }
  const direction = text(preferences.direction)
  const candidates = groupPlans(data.plans, preferences.subject)
    .filter((item) => preferences.schoolType === '不限' || item.schoolType === preferences.schoolType)
    .filter((item) => preferences.city === '不限' || (preferences.city === '武汉' ? item.city === '武汉' : item.city !== '武汉'))
    .filter((item) => !preferences.jointOnly || item.jointProgram)
    .filter((item) => !direction || `${item.majors.join(' ')} ${item.directions.join(' ')} ${item.remarks.join(' ')}`.includes(direction))
    .map((item) => {
      const key = `${item.subject}:${item.groupCode}`
      const history = {
        2025: scoreMaps[2025].get(key), 2024: scoreMaps[2024].get(key), 2023: scoreMaps[2023].get(key),
      }
      const referenceYear = [2025, 2024, 2023].find((year) => numberValue(history[year]?.min_rank))
      const referenceRank = referenceYear ? numberValue(history[referenceYear].min_rank) : undefined
      const category = referenceRank ? classifyByRank(userRank, referenceRank) : undefined
      const historyCount = Object.values(history).filter((row) => numberValue(row?.min_rank)).length
      const result = {
        ...item,
        majors: [...new Set(item.majors.filter(Boolean))].join('、'),
        directions: [...new Set(item.directions.filter(Boolean))].join('、'),
        remarks: item.remarks.filter(Boolean).join('；'),
        history, historyCount, referenceYear, referenceRank, category,
      }
      result.risks = buildRisks(result)
      result.categoryType = CATEGORY_META[category]?.type || 'info'
      result.recommendReason = referenceRank
        ? `以 ${referenceYear} 年最低位次 ${referenceRank.toLocaleString()} 为主要参考，与考生位次差异为 ${Math.abs((referenceRank - userRank) / userRank * 100).toFixed(1)}%。`
        : '缺少近三年最低投档位次，仅展示招生计划，不作分层判断。'
      return result
    })
  const missingHistoryCount = candidates.filter((item) => !item.referenceRank).length
  const items = candidates
    .filter((item) => item.category)
    .sort((a, b) => CATEGORY_META[a.category].order - CATEGORY_META[b.category].order || a.referenceRank - b.referenceRank)

  return { userRank, rankSource: enteredRank ? '用户输入' : '按 2026 一分一段表换算', items, missingHistoryCount }
}
