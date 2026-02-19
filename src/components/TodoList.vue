<template>
  <div class="list-container">
    <ul ref="listRef" class="todo-list">
      <TodoItem
        v-for="todo in filteredTodos"
        :key="todo.id"
        :todo="todo"
        @toggle="$emit('toggle', $event)"
        @edit="(id, text) => $emit('edit', id, text)"
        @delete="$emit('delete', $event)"
      />
    </ul>
    <p v-if="filteredTodos.length === 0 && !loading" class="empty-hint">
      {{ searchQuery ? '找不到符合的任務' : '暫無待辦事項' }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import Sortable from 'sortablejs'
import TodoItem from './TodoItem.vue'

const props = defineProps({
  sortedTodos: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  searchQuery: { type: String, default: '' }
})
const emit = defineEmits(['toggle', 'edit', 'delete', 'reorder'])

const filteredTodos = computed(() => {
  if (!props.searchQuery) return props.sortedTodos
  const q = props.searchQuery.toLowerCase()
  return props.sortedTodos.filter(t => t.text.toLowerCase().includes(q))
})

const listRef = ref(null)
let sortableInstance = null

onMounted(() => {
  sortableInstance = Sortable.create(listRef.value, {
    animation: 150,
    handle: '.drag-handle',
    ghostClass: 'sortable-ghost',
    onEnd(evt) {
      const ids = [...listRef.value.querySelectorAll('li')].map(el => el.dataset.id)
      emit('reorder', ids)
    }
  })
})

onUnmounted(() => {
  sortableInstance?.destroy()
})
</script>
