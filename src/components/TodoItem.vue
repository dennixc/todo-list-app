<template>
  <li
    class="todo-item"
    :class="{ 'completed': todo.completed, 'swiped': isSwiped }"
    :data-id="todo.id"
    @touchstart.passive="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <!-- Swipe delete background -->
    <div class="delete-bg">
      <span class="delete-label">刪除</span>
    </div>

    <!-- Main content -->
    <div
      class="item-content"
      :style="swipeStyle"
    >
      <!-- Checkbox -->
      <button
        class="checkbox-btn"
        :class="{ 'checked': todo.completed }"
        @click="$emit('toggle', todo.id)"
        :aria-label="todo.completed ? '標記未完成' : '標記完成'"
      >
        <svg v-if="todo.completed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </button>

      <!-- Text (editable inline) -->
      <div class="todo-text-wrap">
        <span
          v-if="!isEditing"
          class="todo-text"
          :class="{ 'completed-text': todo.completed }"
          @click="startEdit"
        >{{ todo.text }}</span>
        <input
          v-else
          ref="editInputRef"
          v-model="editText"
          class="edit-input"
          @blur="submitEdit"
          @keyup.enter="submitEdit"
          @keyup.escape="cancelEdit"
        />
      </div>

      <!-- Drag handle (desktop) -->
      <div class="drag-handle" title="拖曳排序">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/>
          <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
          <circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>
        </svg>
      </div>
    </div>
  </li>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const props = defineProps({
  todo: { type: Object, required: true }
})
const emit = defineEmits(['toggle', 'edit', 'delete'])

// Inline edit
const isEditing = ref(false)
const editText = ref('')
const editInputRef = ref(null)

function startEdit() {
  if (props.todo.completed) return
  isEditing.value = true
  editText.value = props.todo.text
  nextTick(() => editInputRef.value?.focus())
}
function submitEdit() {
  if (editText.value.trim() && editText.value.trim() !== props.todo.text) {
    emit('edit', props.todo.id, editText.value.trim())
  }
  isEditing.value = false
}
function cancelEdit() {
  isEditing.value = false
}

// Swipe-to-delete (mobile)
const isSwiped = ref(false)
const swipeX = ref(0)
let touchStartX = 0
let touchStartY = 0
let isSwipeGesture = false

const swipeStyle = ref({})

function onTouchStart(e) {
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
  isSwipeGesture = false
  swipeX.value = 0
}
function onTouchMove(e) {
  const dx = e.touches[0].clientX - touchStartX
  const dy = e.touches[0].clientY - touchStartY
  if (!isSwipeGesture && Math.abs(dy) > Math.abs(dx)) return

  if (dx < -10) {
    isSwipeGesture = true
    e.preventDefault()
    const clamped = Math.max(dx, -80)
    swipeX.value = clamped
    swipeStyle.value = { transform: `translateX(${clamped}px)` }
  }
}
function onTouchEnd() {
  if (swipeX.value < -60) {
    isSwiped.value = true
    swipeStyle.value = { transform: 'translateX(-80px)' }
    setTimeout(() => {
      emit('delete', props.todo.id)
      isSwiped.value = false
      swipeStyle.value = {}
    }, 300)
  } else {
    swipeX.value = 0
    swipeStyle.value = {}
  }
}
</script>
