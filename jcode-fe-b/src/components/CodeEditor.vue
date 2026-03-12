<template>
  <div ref="editorform" class="ace-editor"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue"
import ace from "ace-builds"

import "ace-builds/src-noconflict/mode-java"
import "ace-builds/src-noconflict/theme-eclipse"
import "ace-builds/src-noconflict/ext-language_tools"

// 接收 v-model:value
const props = defineProps({
  value: {
    type: String,
    default: ""
  }
})

const emit = defineEmits(["update:value"])

const editorform = ref(null)

let editor = null

// 编辑器配置
const options = {
  theme: `ace/theme/eclipse`,
  mode: `ace/mode/java`,
  maxLines: 20,
  minLines: 10,
  fontSize: 15
}

// 初始化编辑器
onMounted(() => {

  editor = ace.edit(editorform.value, options)

  editor.setOptions({
    enableBasicAutocompletion: true
  })

  // 设置初始值
  editor.setValue(props.value || "", -1)

  // 内容变化同步给父组件
  editor.getSession().on("change", () => {
    emit("update:value", editor.getValue())
  })
})


// 监听 value 变化（编辑题目回显关键）
watch(
  () => props.value,
  (newVal) => {
    if (editor && newVal !== editor.getValue()) {
      editor.setValue(newVal || "", -1)
    }
  }
)


// 销毁
onBeforeUnmount(() => {
  if (editor) {
    editor.destroy()
    editor = null
  }
})

</script>

<style scoped>
.ace-editor {
  margin-top: 10px;
  width: 100%;
  height: 350px;
}
</style>