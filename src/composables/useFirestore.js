import { ref, computed, onUnmounted } from 'vue'
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore'
import { db } from '../firebase.js'

export function useFirestore() {
  const todos = ref([])
  const loading = ref(true)
  const error = ref(null)

  // 排序：未完成在上（按 order），已完成在下（按 completedAt 倒序）
  const sortedTodos = computed(() => {
    return [...todos.value].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }
      if (!a.completed) {
        const orderA = a.order ?? 0
        const orderB = b.order ?? 0
        return orderA - orderB
      } else {
        const timeA = a.completedAt?.toDate?.() ?? a.completedAt ?? new Date(0)
        const timeB = b.completedAt?.toDate?.() ?? b.completedAt ?? new Date(0)
        return timeB - timeA
      }
    })
  })

  // 即時同步
  const q = query(collection(db, 'todos'), orderBy('createdAt', 'desc'))
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      todos.value = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }))
      loading.value = false
    },
    (err) => {
      console.error('❌ Firestore 錯誤:', err)
      error.value = '載入資料失敗，請檢查網路連線'
      loading.value = false
    }
  )

  onUnmounted(() => unsubscribe())

  async function addTodo(text) {
    if (!text.trim()) return
    const incompleteTodos = todos.value.filter(t => !t.completed)
    const maxOrder = incompleteTodos.length > 0
      ? Math.max(...incompleteTodos.map(t => t.order ?? 0))
      : -1

    await addDoc(collection(db, 'todos'), {
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
      order: maxOrder + 1,
      completedAt: null
    })
  }

  async function toggleTodo(id) {
    const todo = todos.value.find(t => t.id === id)
    if (!todo) return

    const newCompleted = !todo.completed
    const updateData = {
      completed: newCompleted,
      completedAt: newCompleted ? new Date() : null
    }

    if (!newCompleted) {
      const incompleteTodos = todos.value.filter(t => !t.completed)
      const maxOrder = incompleteTodos.length > 0
        ? Math.max(...incompleteTodos.map(t => t.order ?? 0))
        : -1
      updateData.order = maxOrder + 1
    }

    await updateDoc(doc(db, 'todos', id), updateData)
  }

  async function editTodo(id, newText) {
    if (!newText.trim()) return
    await updateDoc(doc(db, 'todos', id), { text: newText.trim() })
  }

  async function deleteTodo(id) {
    await deleteDoc(doc(db, 'todos', id))
  }

  async function updateOrder(orderedIds) {
    const promises = orderedIds.map((id, index) =>
      updateDoc(doc(db, 'todos', id), { order: index })
    )
    await Promise.all(promises)
  }

  return {
    todos,
    sortedTodos,
    loading,
    error,
    addTodo,
    toggleTodo,
    editTodo,
    deleteTodo,
    updateOrder
  }
}
