import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// PWA Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('✅ SW registered:', reg.scope))
      .catch(err => console.error('❌ SW failed:', err))
  })
}

createApp(App).mount('#app')
