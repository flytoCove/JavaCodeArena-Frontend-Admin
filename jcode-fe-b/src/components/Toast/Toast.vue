<template>
  <!-- 这里的 Transition 负责进场离场动画 -->
  <transition name="toast-anim">
    <div v-if="visible" class="toast-wrapper" :class="type">
      <!-- 错误图标 -->
      <svg v-if="type === 'error'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      
      <!-- 成功图标 -->
      <svg v-if="type === 'success'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      
      <!-- 警告/信息图标 -->
      <svg v-if="type === 'info'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>

      <span class="toast-text">{{ msg }}</span>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const msg = ref('')
const type = ref('error')
let timer = null

// 暴露给 index.js 调用的方法
const open = (message, toastType = 'error', duration = 3000) => {
  if (timer) clearTimeout(timer)
  
  msg.value = message
  type.value = toastType
  visible.value = true

  timer = setTimeout(() => {
    visible.value = false
  }, duration)
}

// 必须使用 defineExpose 才能被 createVNode 获取到
defineExpose({ open })
</script>

<style scoped>
/* --- 样式直接复用之前写好的高级毛玻璃风格 --- */
.toast-wrapper {
  position: fixed; /* 改为 fixed，相对于浏览器窗口 */
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  
  display: flex;
  align-items: center;
  gap: 10px;
  
  padding: 12px 24px;
  border-radius: 50px;
  
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    
  font-size: 15px;
  font-weight: 600;
  color: #333;
  min-width: fit-content;
  white-space: nowrap;
  pointer-events: none;
}

.toast-wrapper.error {
  color: #d32f2f;
  background: rgba(255, 240, 240, 0.9);
  border-color: rgba(255, 200, 200, 0.5);
  box-shadow: 0 8px 25px rgba(255, 50, 50, 0.15);
}

.toast-wrapper.success {
  color: #2e7d32;
  background: rgba(240, 255, 244, 0.9);
  border-color: rgba(200, 255, 210, 0.5);
  box-shadow: 0 8px 25px rgba(50, 200, 100, 0.15);
}

.toast-wrapper.info {
  color: #0288d1;
  background: rgba(240, 248, 255, 0.9);
  border-color: rgba(200, 230, 255, 0.5);
  box-shadow: 0 8px 25px rgba(50, 150, 255, 0.15);
}

/* 动画 */
.toast-anim-enter-active,
.toast-anim-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.toast-anim-enter-from,
.toast-anim-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px) scale(0.9);
}
</style>