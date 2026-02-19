import { watch } from 'vue'

// Module-level timer map, persists across component re-renders
const scheduledTimers = new Map()

function toDate(val) {
  if (!val) return null
  if (val instanceof Date) return val
  if (typeof val.toDate === 'function') return val.toDate()
  if (typeof val === 'number') return new Date(val)
  return null
}

function formatDateTime(date) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today.getTime() + 86400000)
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  const h = date.getHours()
  const m = date.getMinutes()
  const timeStr = `${getPeriod(h)}${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, '0')}`

  if (target.getTime() === today.getTime()) return `今天 ${timeStr}`
  if (target.getTime() === tomorrow.getTime()) return `明天 ${timeStr}`
  return `${date.getMonth() + 1}月${date.getDate()}日 ${timeStr}`
}

function getPeriod(h) {
  if (h <= 5) return '凌晨'
  if (h <= 11) return '上午'
  if (h === 12) return '中午'
  if (h <= 17) return '下午'
  if (h <= 20) return '傍晚'
  return '晚上'
}

async function showNotification(todo) {
  const reg = await navigator.serviceWorker?.ready
  if (!reg) return

  const dueAt = toDate(todo.dueAt)
  const body = dueAt ? `截止：${formatDateTime(dueAt)}` : '提醒時間到了！'

  reg.showNotification(todo.text, {
    body,
    icon: '/icons/icon-192.png',
    tag: todo.id,
    data: { url: '/' }
  })
}

function scheduleTodo(todo) {
  const remindAt = toDate(todo.remindAt)
  if (!remindAt) return

  const delay = remindAt.getTime() - Date.now()
  if (delay <= 0) return

  const handle = setTimeout(() => {
    showNotification(todo)
    scheduledTimers.delete(todo.id)
  }, delay)

  scheduledTimers.set(todo.id, handle)
}

function rescheduleAll(todos) {
  // Cancel all existing timers
  scheduledTimers.forEach(handle => clearTimeout(handle))
  scheduledTimers.clear()

  const now = Date.now()
  for (const todo of todos) {
    if (todo.completed) continue
    const remindAt = toDate(todo.remindAt)
    if (!remindAt || remindAt.getTime() <= now) continue
    scheduleTodo(todo)
  }
}

export function useNotifications(sortedTodos) {
  async function requestPermission() {
    if (!('Notification' in window)) return
    if (Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }

  // Re-schedule whenever todos change
  watch(sortedTodos, (todos) => {
    if (Notification.permission === 'granted') {
      rescheduleAll(todos)
    }
  }, { immediate: true })

  return { requestPermission }
}

export { toDate, formatDateTime }
