import { createVNode, render } from 'vue'
import ToastComponent from './Toast.vue'

// 1. 创建一个容器 div，不用加到 body，因为 render 会处理
const div = document.createElement('div')
div.setAttribute('id', 'toast-container')
document.body.appendChild(div)

// 2. 创建虚拟节点
const vnode = createVNode(ToastComponent)

// 3. 将虚拟节点渲染到 div 中
render(vnode, div)

// 4. 导出封装好的方法
// vnode.component.exposed 包含了 Toast.vue 中 defineExpose 出来的方法
const show = (msg, type = 'info', duration = 3000) => {
  vnode.component?.exposed?.open(msg, type, duration)
}

const Toast = {
  show,
  success: (msg) => show(msg, 'success'),
  error: (msg) => show(msg, 'error'),
  info: (msg) => show(msg, 'info')
}

export default Toast