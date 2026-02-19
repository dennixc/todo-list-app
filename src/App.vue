<template>
  <div class="app" :class="{ dark: isDark }">
    <!-- Header -->
    <header class="app-header">
      <div class="header-top">
        <h1 class="app-title">提醒事項</h1>
        <button class="theme-btn" @click="toggleTheme" :aria-label="isDark ? '切換淺色' : '切換深色'">
          <svg v-if="isDark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
      </div>
      <!-- Search -->
      <div class="search-wrap">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          v-model="searchQuery"
          class="search-input"
          placeholder="搜尋"
          autocomplete="off"
        />
      </div>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="loading-wrap">
      <div class="spinner"></div>
    </div>

    <!-- Error -->
    <div v-if="error" class="error-toast">{{ error }}</div>

    <!-- List -->
    <main class="main-content">
      <TodoList
        :grouped-todos="groupedTodos"
        :loading="loading"
        :search-query="searchQuery"
        @toggle="toggleTodo"
        @edit="handleEdit"
        @delete="deleteTodo"
        @reorder="handleReorder"
      />
    </main>

    <!-- Add Bar -->
    <AddTodoBar @add="addTodo" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFirestore } from './composables/useFirestore.js'
import TodoList from './components/TodoList.vue'
import AddTodoBar from './components/AddTodoBar.vue'

const { todos, sortedTodos, groupedTodos, loading, error, addTodo, toggleTodo, editTodo, deleteTodo, updateOrder } = useFirestore()

const isDark = ref(false)
const searchQuery = ref('')

function toggleTheme() {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  isDark.value = localStorage.getItem('theme') === 'dark'
})

function handleEdit(id, newText) {
  editTodo(id, newText)
}

async function handleReorder(orderedIds) {
  // Only reorder within same completion group
  // orderedIds is the DOM order after drag
  // We need to map back only incomplete todos' order values
  const incompleteInOrder = orderedIds
    .map(id => todos.value.find(t => t.id === id))
    .filter(t => t && !t.completed)
  await updateOrder(incompleteInOrder.map(t => t.id))
}
</script>
