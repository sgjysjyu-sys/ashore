export const VOLUNTEER_LIMIT = 20
const STORAGE_KEY = 'hubei-gaokao-volunteers'

function notify(items) {
  window.dispatchEvent(new CustomEvent('volunteers-changed', { detail: items }))
}

export function loadVolunteers() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(value) ? value.slice(0, VOLUNTEER_LIMIT) : []
  } catch {
    return []
  }
}

export function saveVolunteers(items) {
  const safeItems = Array.isArray(items) ? items.slice(0, VOLUNTEER_LIMIT) : []
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safeItems))
  notify(safeItems)
  return safeItems
}

export function addVolunteer(item) {
  const items = loadVolunteers()
  if (items.some((current) => current.groupCode === item.groupCode && current.subject === item.subject)) {
    return { ok: false, reason: '该院校专业组已在志愿清单中', items }
  }
  if (items.length >= VOLUNTEER_LIMIT) return { ok: false, reason: `志愿清单最多添加 ${VOLUNTEER_LIMIT} 个专业组`, items }
  return { ok: true, items: saveVolunteers([...items, item]) }
}

export function removeVolunteer(index) {
  const items = loadVolunteers()
  items.splice(index, 1)
  return saveVolunteers(items)
}

export function moveVolunteer(index, offset) {
  const items = loadVolunteers()
  const target = index + offset
  if (target < 0 || target >= items.length) return items
  ;[items[index], items[target]] = [items[target], items[index]]
  return saveVolunteers(items)
}

export function clearVolunteers() {
  localStorage.removeItem(STORAGE_KEY)
  notify([])
}
