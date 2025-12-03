<template>
  <div class="login-page">
    <!-- 动态 Logo -->
    <div class="logo-wrapper">
      <svg class="logo" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#b299ff" />
            <stop offset="50%" stop-color="#80cfff" />
            <stop offset="100%" stop-color="#ffb3d9" />
          </linearGradient>

          <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1a1aff" />
            <stop offset="50%" stop-color="#115f99" />
            <stop offset="100%" stop-color="#99114d" />
          </linearGradient>
        </defs>

        <!-- 固定圆圈 -->
        <circle cx="100" cy="100" r="60" stroke="url(#grad)" stroke-width="8" fill="none" />
        <!-- 动态旋转圆 -->
        <circle
          class="circle-animate"
          cx="100"
          cy="100"
          r="60"
          stroke="#b299ff"
          stroke-width="8"
          stroke-dasharray="360"
          stroke-linecap="round"
          fill="none"
        />

        <!-- 光晕脉冲 -->
        <circle
          class="glow-circle"
          cx="100"
          cy="100"
          r="70"
          stroke="url(#glowGrad)"
          stroke-width="6"
          fill="none"
        />

        <!-- Logo文字 -->
        <text
          x="50%"
          y="54%"
          text-anchor="middle"
          fill="url(#grad)"
          font-size="28"
          font-weight="600"
        >
          Code
        </text>
      </svg>
    </div>

    <!-- 登录卡片 -->
    <div class="login-card" ref="cardRef">
      <h2 class="title">Java Code Arena 管理平台</h2>
      <form @submit.prevent="submit" class="form-wrapper">
        <!-- 账号输入框 (使用 placeholder) -->
        <div class="form-item"
        :class="{ 'has-error': errors.userAccount, 'shake-anim': shake.userAccount }"> 
          <!-- 账号框也使用 placeholder="账号" -->
          <input v-model="form.userAccount" placeholder="账号" type="text" />

          <!-- 👇 错误提示文字 -->
          <transition name="fade-slide">
            <span class="error-msg" v-if="errors.userAccount">{{ errors.userAccount }}</span>
          </transition>
        </div>

        <!-- 密码输入框带小眼睛 (使用 placeholder) -->
        <div class="form-item password-wrapper" :class="{ 'has-error': errors.password, 'shake-anim': shake.password }">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="form.password"
            placeholder="密码"
          />
          <span class="toggle-eye" @click="showPassword = !showPassword">
            <svg
              v-if="!showPassword"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4a90e2"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4a90e2"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M17.94 17.94A10.05 10.05 0 0 1 12 20c-7 0-11-8-11-8a21.56 21.56 0 0 1 5.06-6.94" />
              <path d="M1 1l22 22" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </span>

          <!-- 👇 错误提示文字 -->
          <transition name="fade-slide">
            <span class="error-msg" v-if="errors.password">{{ errors.password }}</span>
          </transition>
        </div>

        <button type="submit" class="login-btn">登 录</button>
      </form>
    </div>

    <!-- 背景粒子 -->
    <canvas ref="canvasRef" class="bg"></canvas>
  </div>
</template>


<!-- 与后端交互部分 -->
<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { loginService } from '@/apis/sysuser'
import router from '@/router'
import { setToken } from '@/utils/cookie'
import Toast from '@/components/Toast'

const canvasRef = ref(null)
const cardRef = ref(null)
let rafId = null

const form = reactive({
  userAccount: '',
  password: '',
})


// 👇 1. 新增：定义错误信息对象
const errors = reactive({
  userAccount: '',
  password: '',
})

// 👇 2. 新增：定义一个控制抖动动画的变量
const shake = reactive({
  userAccount: false,
  password: false,
})

// 辅助函数：触发抖动效果
const triggerShake = (field) => {
  shake[field] = true
  setTimeout(() => {
    shake[field] = false
  }, 500) // 0.5s 后移除抖动类，保证下次还能触发
}

const showPassword = ref(false)


const submit = async () => {

// 重置错误信息
  errors.userAccount = ''
  errors.password = ''
  let isValid = true

  // 校验账号
  if (!form.userAccount) {
    errors.userAccount = '请输入账号'
    triggerShake('userAccount')
    isValid = false
  }

  // 校验密码
  if (!form.password) {
    errors.password = '请输入密码'
    triggerShake('password')
    isValid = false
  }

  // 如果校验不通过，直接返回，不弹窗
  if (!isValid) return

  try {
    const data = await loginService(form)
    console.log('提交返回：', data)
    // code == 1000 标识登录成功
    if(data.code == 1000){
        Toast.success('登录成功')
        router.push("/jcode/system")
        setToken(data.data)
    }
    else {
        if(data.code = 2000){
            Toast.error(data.msg)
        }
        if(data.code = 3102){
            Toast.error(data.msg)
        }
        if(data.code = 3103){
            Toast.error(data.msg)
        } 
    }
    
  } catch (err) {
    Toast.error('网络连接异常，请检查网络')
  }
}



onMounted(() => {
  // 粒子背景
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  let w = (canvas.width = window.innerWidth)
  let h = (canvas.height = window.innerHeight)

  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 3 + 1,
    dx: (Math.random() - 0.5) * 0.6,
    dy: (Math.random() - 0.5) * 0.6,
  }))

  const onResize = () => {
    w = canvas.width = window.innerWidth
    h = canvas.height = window.innerHeight
  }
  window.addEventListener('resize', onResize)

  function animate() {
    ctx.clearRect(0, 0, w, h)

    particles.forEach((p) => {
      p.x += p.dx
      p.y += p.dy
      if (p.x < 0 || p.x > w) p.dx *= -1
      if (p.y < 0 || p.y > h) p.dy *= -1

      ctx.beginPath()
      ctx.fillStyle = 'rgba(150, 200, 255, 0.5)'
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fill()
    })

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 100) {
          ctx.strokeStyle = 'rgba(150,200,255,' + (1 - dist / 100) * 0.25 + ')'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
    }

    rafId = requestAnimationFrame(animate)
  }
  animate()

  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize)
    if (rafId) cancelAnimationFrame(rafId)
  })

  // 卡片鼠标交互 3D
  const card = cardRef.value
  if (!card) return
  const handleMouseMove = (e) => {
    const { innerWidth: w, innerHeight: h } = window
    const x = e.clientX - w / 2
    const y = e.clientY - h / 2
    const rotateX = (y / h) * 15
    const rotateY = -(x / w) * 15
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`
  }
  const handleMouseLeave = () => {
    card.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)`
  }
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseleave', handleMouseLeave)
  onBeforeUnmount(() => {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseleave', handleMouseLeave)
  })
})
</script>

<style scoped>
.login-page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #e8e0ff 0%, #d0e6ff 50%, #ffe6f2 100%);
  position: relative;
}

/* 粒子背景 */
.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* 动态 Logo */
.logo-wrapper {
  position: absolute;
  top: 60px;
  width: 200px;
  z-index: 3;
  animation: float 4s ease-in-out infinite;
  pointer-events: none; 
}

.logo {
  width: 200px;
  height: 200px;
}

.circle-animate {
  animation: rotate 4s linear infinite;
  stroke-dashoffset: 360;
}

@keyframes rotate {
  0% { stroke-dashoffset: 360; }
  100% { stroke-dashoffset: 0; }
}

@keyframes float {
  0% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
  100% { transform: translateY(0); }
}

/* 登录卡片 3D + 毛玻璃 */
.login-card {
  width: 300px;
  padding: 26px;
  border-radius: 22px;
  backdrop-filter: blur(22px) saturate(180%);
  background: rgba(255, 255, 255, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.15),
    0 0 40px rgba(120, 180, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  transform: perspective(800px) rotateX(0deg) rotateY(0deg) scale(1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* 标题 */
.title {
  text-align: center;
  font-size: 20px;
  margin-bottom: 18px;
  color: #4a90e2;
  font-weight: 600;
}

/* 输入框容器 */
.form-item {
  margin-bottom: 16px;
  width: 240px; /* <--- 关键修改：设置统一的宽度 240px，与登录按钮对齐 */
  animation: inputFloat 5s infinite ease-in-out;
}
.form-item input {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 14px;
  background: #c9dcf5;
  outline: none;
  font-size: 15px;
  transition: 0.3s ease;
  /* animation: inputFloat 5s infinite ease-in-out; */
  /* 确保 input 框在父容器中占满 100% 宽度 */
  box-sizing: border-box; 
}
@keyframes inputFloat {
  0% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
  100% { transform: translateY(0); }
}
.form-item input:focus {
  background: #e3f1ff;
  box-shadow: 0 0 8px rgba(150, 200, 255, 0.6);
}

/* 密码框包裹 */
.password-wrapper {
  position: relative;
  /* width: 240px; 已经在 .form-item 中设置 */
}
/* 解决对齐问题的核心：在密码框中，输入框的宽度需要减去小眼睛的宽度 */
.password-wrapper input {
  /* 100% 是指父容器 .password-wrapper 的 240px 宽度 */
  /* 小眼睛占用约 20px (SVG) + 10px (右边距) = 30px 左右 */
  /* 留出小眼睛的位置。这里使用 calc 更加精确，或者直接用 padding-right */
  padding-right: 36px; 
}

/* 小眼睛 */
.toggle-eye {
  position: absolute;
  right: 12px; /* 调整到更靠近右侧，与输入框 padding 配合 */
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

/* 登录按钮 */
.login-btn {
  width: 240px; /* 保持宽度一致 */
  padding: 12px;
  border: none;
  border-radius: 20px;
  background: linear-gradient(135deg, #7ac9ff, #b1e5ff);
  color: white;
  font-size: 17px;
  cursor: pointer;
  transition: 0.25s;
  display: block;
  margin: 0 auto;
  box-shadow: 0 6px 14px rgba(120, 180, 255, 0.32);
}
.login-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(100, 170, 255, 0.45);
}

/* 夜间模式 */
@media (prefers-color-scheme: dark) {
  .login-page {
    background: linear-gradient(135deg, #0e1a2b 0%, #11233a 50%, #0d1c31 100%);
  }
  .login-card {
    background: rgba(20, 35, 55, 0.65);
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.45);
  }
  .title { color: #c9dcff; }
  .form-item input { background: #bacdec; color: black; }
  .login-btn {
    background: linear-gradient(135deg, #4d8eff, #76adff);
    box-shadow: 0 6px 14px rgba(50, 90, 160, 0.5);
  }
}

/* 光晕扩散动画 */
.glow-circle {
  stroke-opacity: 0.3;
  filter: blur(10px);
  animation:
    glowRotate 6s linear infinite,
    glowPulse 2.5s ease-in-out infinite;
}
@keyframes glowRotate {
  0% { transform: rotate(0deg); transform-origin: center; }
  100% { transform: rotate(360deg); transform-origin: center; }
}
@keyframes glowPulse {
  0%,100% { stroke-opacity: 0.3; r:70; }
  50% { stroke-opacity: 0.6; r:75; }
}


/* --- 👇 新增的校验样式 👇 --- */

/* 错误状态下的输入框 */
.form-item.has-error input {
  background: #ffe6e6; /* 浅红背景 */
  box-shadow: 0 0 0 1px #ff4d4d; /* 红框 */
}

/* 错误提示文字 */
.error-msg {
  position: absolute;
  bottom: -20px; /* 浮在输入框下方 */
  left: 4px;
  font-size: 12px;
  color: #ff4d4d;
  font-weight: 500;
  pointer-events: none;
}

/* 这里的 margin-bottom 需要稍微加大一点，避免提示字盖住下面的元素，或者保持原样也行 */
.form-item {
  position: relative; /* 确保 absolute 定位是相对于 form-item */
  margin-bottom: 24px; /* 原来是 16px，增加一点空间给提示文字 */
}

/* 提示文字出现的动画 (Vue transition) */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* 抖动动画 Class */
.shake-anim {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

/* 抖动关键帧 */
@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

/* 修复：确保之前定义的 inputFloat 动画不要和 shake 冲突 */
/* 如果你之前把 inputFloat 加在了 .form-item 上，当 shake 触发时，animation 属性会被覆盖。
   为了共存，我们只在没有 shake-anim 类的时候执行浮动，或者简单点，出错时不浮动只抖动。 */
.form-item:not(.shake-anim) {
  animation: inputFloat 5s infinite ease-in-out;
}

</style>