import * as XLSX from 'xlsx'

const DATA_FILES = {
  plans: 'plans_2026.csv',
  scores2025: 'scores_2025.csv',
  scores2024: 'scores_2024.csv',
  scores2023: 'scores_2023.csv',
  ranksPhysics: 'ranks_2026_physics.csv',
  ranksHistory: 'ranks_2026_history.csv',
  schools: 'schools.csv',
}

let dataPromise

export function getDataUrl(fileName) {
  return `${import.meta.env.BASE_URL}data/${fileName}`
}

export async function loadCsv(fileName) {
  const response = await fetch(getDataUrl(fileName))
  if (!response.ok) throw new Error(`数据加载失败：${fileName} (${response.status})`)
  const buffer = await response.arrayBuffer()
  const csvText = new TextDecoder('utf-8').decode(buffer).replace(/^\uFEFF/, '')
  const workbook = XLSX.read(csvText, { type: 'string' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  return XLSX.utils.sheet_to_json(sheet, { defval: '' })
}

export function loadAllData() {
  if (!dataPromise) {
    dataPromise = Promise.all(
      Object.entries(DATA_FILES).map(async ([key, file]) => [key, await loadCsv(file)]),
    ).then(Object.fromEntries)
  }
  return dataPromise
}

export function resetDataCache() {
  dataPromise = undefined
}
