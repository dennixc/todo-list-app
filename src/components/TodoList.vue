<template>
  <div class="list-container">
    <!-- 未完成 -->
    <ul ref="incompleteListRef" class="todo-list">
      <TodoItem
        v-for="todo in filteredIncomplete"
        :key="todo.id"
        :todo="todo"
        @toggle="$emit('toggle', $event)"
        @edit="(id, text) => $emit('edit', id, text)"
        @delete="$emit('delete', $event)"
      />
    </ul>

    <!-- 已過期 -->
    <template v-if="filteredOverdue.length > 0">
      <div class="section-header">
        <span class="section-dot"></span>已過期
      </div>
      <ul class="todo-list">
        <TodoItem
          v-for="todo in filteredOverdue"
          :key="todo.id"
          :todo="todo"
          @toggle="$emit('toggle', $event)"
          @edit="(id, text) => $emit('edit', id, text)"
          @delete="$emit('delete', $event)"
        />
      </ul>
    </template>

    <!-- 已完成 -->
    <ul v-if="filteredCompleted.length > 0" class="todo-list">
      <TodoItem
        v-for="todo in filteredCompleted"
        :key="todo.id"
        :todo="todo"
        @toggle="$emit('toggle', $event)"
        @edit="(id, text) => $emit('edit', id, text)"
        @delete="$emit('delete', $event)"
      />
    </ul>

    <p v-if="totalVisible === 0 && !loading" class="empty-hint">
      {{ searchQuery ? '找不到符合的任務' : '暫無待辦事項' }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Sortable from 'sortablejs'
import TodoItem from './TodoItem.vue'

const props = defineProps({
  groupedTodos: { type: Object, required: true },
  loading: { type: Boolean, default: false },
  searchQuery: { type: String, default: '' }
})
const emit = defineEmits(['toggle', 'edit', 'delete', 'reorder'])

function filterByQuery(list) {
  if (!props.searchQuery) return list
  const q = props.searchQuery.toLowerCase()
  return list.filter(t => t.text.toLowerCase().includes(q))
}

const filteredIncomplete = computed(() => filterByQuery(props.groupedTodos.incomplete))
const filteredOverdue = computed(() => filterByQuery(props.groupedTodos.overdue))
const filteredCompleted = computed(() => filterByQuery(props.groupedTodos.completed))

const totalVisible = computed(
  () => filteredIncomplete.value.length + filteredOverdue.value.length + filteredCompleted.value.length
)

const incompleteListRef = ref(null)
let sortableInstance = null

onMounted(() => {
  sortableInstance = Sortable.create(incompleteListRef.value, {
    animation: 150,
    handle: '.drag-handle',
    ghostClass: 'sortable-ghost',
    onEnd() {
      const ids = [...incompleteListRef.value.querySelectorAll('li')].map(el => el.dataset.id)
      emit('reorder', ids)
    }
  })
})

onUnmounted(() => {
  sortableInstance?.destroy()
})
</script>
