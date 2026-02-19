<template>
  <div class="add-bar">
    <div v-if="!isExpanded" class="add-placeholder" @click="expand">
      <span class="add-plus">+</span>
      <span class="add-label">新增提醒事項</span>
    </div>
    <div v-else class="add-expanded">
      <input
        ref="inputRef"
        v-model="text"
        class="add-input"
        placeholder="新增提醒事項..."
        autocomplete="off"
        @keyup.enter="submit"
        @keyup.escape="collapse"
      />
      <button class="add-done-btn" @click="submit">完成</button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const emit = defineEmits(['add'])

const isExpanded = ref(false)
const text = ref('')
const inputRef = ref(null)

function expand() {
  isExpanded.value = true
  nextTick(() => inputRef.value?.focus())
}
function collapse() {
  isExpanded.value = false
  text.value = ''
}
function submit() {
  if (text.value.trim()) {
    emit('add', text.value.trim())
    text.value = ''
    inputRef.value?.focus()
  }
}
</script>
