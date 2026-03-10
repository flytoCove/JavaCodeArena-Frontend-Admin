<template>
  <div class="add-question-page">
    <div class="add-question-card">
      <div class="card-header">
        <h2 class="title">添加题目</h2>
        <p class="subtitle">请完善题目信息，用于评测与比赛出题</p>
      </div>

      <el-form
        ref="formRef"
        :model="formQuestion"
        label-width="120px"
        class="add-question-form"
      >

        <!-- 题目信息 -->
        <div class="form-vertical">

          <el-form-item label="题目标题:">
            <el-input
              v-model="formQuestion.title"
              placeholder="请输入题目标题"
              clearable
            />
          </el-form-item>

          <el-form-item label="题目难度:">
            <QuestionSelector
              v-model="formQuestion.difficulty"
              placeholder="请选择题目难度"
              style="width: 100%"
            />
          </el-form-item>

          <el-form-item label="时间限制:">
            <el-input
              v-model="formQuestion.timeLimit"
              placeholder="请输入时间限制（单位毫秒）"
              clearable
            />
          </el-form-item>

          <el-form-item label="空间限制:">
            <el-input
              v-model="formQuestion.spaceLimit"
              placeholder="请输入空间限制（单位字节）"
              clearable
            />
          </el-form-item>

          <!-- 题目用例 -->
          <el-form-item label="题目用例:">
            <el-input
              v-model="formQuestion.questionCase"
              placeholder="请输入题目用例"
              clearable
            />
          </el-form-item>

        </div>

        <!-- 题目内容 -->
        <el-form-item label="题目内容:">
          <div class="panel">
            <div class="panel-header">
              <div class="panel-title">题目描述</div>
              <el-segmented
                v-model="contentMode"
                :options="contentModeOptions"
                size="small"
              />
            </div>

            <div class="panel-body">
              <div v-show="contentMode === 'edit'" class="rich-editor">
                <QuillEditor
                  v-model:content="formQuestion.content"
                  content-type="html"
                  theme="snow"
                  placeholder="请输入题目内容"
                />
              </div>

              <div v-show="contentMode === 'preview'" class="rich-preview">
                <div
                  v-if="formQuestion.content"
                  class="preview-html"
                  v-html="formQuestion.content"
                ></div>

                <div v-else class="empty-hint">
                  暂无内容，可切回“编辑”开始编写
                </div>
              </div>
            </div>
          </div>
        </el-form-item>

        <!-- 代码区域 -->
        <el-form-item label="代码区域:" class="code-area">
          <div class="panel code-panel">

            <div class="panel-header">
              <div class="panel-title">代码编辑</div>
              <div class="panel-desc">
                默认代码与 main 函数分开维护，便于评测拼装
              </div>
            </div>

            <div class="panel-body">
              <el-tabs v-model="codeTab" class="code-tabs">

                <el-tab-pane label="默认代码块" name="defaultCode">
                  <div class="code-editor-wrap">
                    <CodeEditor
                      ref="defaultCodeRef"
                      @update:value="handleEditorContent"
                    />
                  </div>
                </el-tab-pane>

                <el-tab-pane label="main 函数" name="mainFuc">
                  <div class="code-editor-wrap">
                    <CodeEditor
                      ref="mainFucRef"
                      @update:value="handleEditorMainFunc"
                    />
                  </div>
                </el-tab-pane>

              </el-tabs>
            </div>

          </div>
        </el-form-item>

        <!-- 按钮 -->
        <div class="form-footer">
          <el-button @click="onCancel" class="btn-cancel">取 消</el-button>

          <el-button
            type="primary"
            class="btn-submit"
            :loading="submitting"
            @click="onSubmit"
          >
            发 布
          </el-button>
        </div>

      </el-form>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import QuestionSelector from './QuestionSelector.vue'
import { addQuestionService } from '@/apis/question'
import router from '@/router'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import CodeEditor from './CodeEditor.vue'

const formRef = ref()
const submitting = ref(false)
const codeTab = ref('defaultCode')
const contentMode = ref('edit')
const contentModeOptions = [
  { label: '编辑', value: 'edit' },
  { label: '预览', value: 'preview' },
]

const formQuestion = reactive({
  questionId: '',
  title: '',
  difficulty: '',
  content: '',
  questionCase: '',
  timeLimit: '',
  spaceLimit: '',
  defaultCode: '',
  mainFuc: '',
})

const defaultCodeRef = ref()
const mainFucRef = ref()

function validate() {
  let msg = ''
  if (!formQuestion.title) {
    msg = '请添加题目标题'
  } else if (formQuestion.difficulty === '') {
    msg = '请选择题目难度'
  } else if (!formQuestion.timeLimit) {
    msg = '请输入时间限制'
  } else if (!formQuestion.spaceLimit) {
    msg = '请输入空间限制'
  } else if (!formQuestion.content) {
    msg = '请输入题目内容信息'
  } else if (!formQuestion.questionCase) {
    msg = '请输入题目用例名称'
  } else if (!formQuestion.defaultCode) {
    msg = '请输入默认代码'
  } else if (!formQuestion.mainFuc) {
    msg = '请输入 main 函数'
  }
  return msg
}

async function onSubmit() {
  if (submitting.value) return

  const errorMessage = validate()
  if (errorMessage) {
    ElMessage.error(errorMessage)
    return
  }

  submitting.value = true
  try {
    const fd = new FormData()
    for (const key in formQuestion) {
      fd.append(key, formQuestion[key] ?? '')
    }
    await addQuestionService(fd)
    ElMessage.success('添加成功')
    router.push('/jcode/layout/question')
  } finally {
    submitting.value = false
  }
}

function onCancel() {
  router.push('/jcode/layout/question')
}

function handleEditorContent(content) {
  formQuestion.defaultCode = content
}

function handleEditorMainFunc(content) {
  formQuestion.mainFuc = content
}
</script>

<style lang="scss" scoped>
.add-question-page {
  width: 100%;
  min-height: 100%;
  padding: 12px 16px 18px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.add-question-card {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 22px 22px 18px;
  border-radius: 22px;
  backdrop-filter: blur(22px) saturate(180%);
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.12),
    0 0 40px rgba(120, 180, 255, 0.18);
}

.card-header {
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(200, 210, 230, 0.35);

  .title {
    font-size: 20px;
    font-weight: 600;
    color: #4a90e2;
    margin: 0 0 6px;
  }

  .subtitle {
    margin: 0;
    font-size: 13px;
    color: #7f8fa6;
  }
}

.grid {
  margin-bottom: 10px;
}

.add-question-form {
  :deep(.el-form-item) {
    margin-bottom: 14px;
  }

  :deep(.el-form-item__label) {
    color: #4a4a4a;
    font-weight: 500;
  }

  :deep(.el-input__wrapper) {
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.72);
    box-shadow: inset 0 0 0 1px rgba(200, 210, 230, 0.35);
  }
}

.panel {
  width: 100%;
  border-radius: 18px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(200, 210, 230, 0.35);
  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.06),
    0 0 28px rgba(120, 180, 255, 0.1);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: linear-gradient(135deg, rgba(178, 153, 255, 0.18), rgba(128, 207, 255, 0.18));
  border-bottom: 1px solid rgba(200, 210, 230, 0.35);
}

.panel-title {
  font-size: 13px;
  font-weight: 600;
  color: #355a8a;
  letter-spacing: 0.2px;
}

.panel-desc {
  font-size: 12px;
  color: rgba(53, 90, 138, 0.75);
}

.panel-body {
  padding: 12px;
}

.rich-editor {
  border-radius: 14px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: inset 0 0 0 1px rgba(200, 210, 230, 0.5);
}

.rich-preview {
  min-height: 280px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: inset 0 0 0 1px rgba(200, 210, 230, 0.5);
  padding: 12px;
  box-sizing: border-box;
}

.preview-html {
  color: #2c3e50;
  line-height: 1.75;
  word-break: break-word;

  :deep(pre) {
    padding: 10px 12px;
    border-radius: 12px;
    background: rgba(10, 20, 40, 0.06);
    overflow: auto;
  }

  :deep(code) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }
}

.empty-hint {
  color: rgba(53, 90, 138, 0.7);
  font-size: 13px;
}

.code-area :deep(.el-form-item__content) {
  width: 100%;
}

.code-panel {
  width: 100%;
}

.code-tabs {
  :deep(.el-tabs__header) {
    margin: 0 0 10px;
  }
  :deep(.el-tabs__nav-wrap::after) {
    height: 1px;
    background-color: rgba(200, 210, 230, 0.45);
  }
}

.code-editor-wrap {
  border-radius: 14px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: inset 0 0 0 1px rgba(200, 210, 230, 0.5);
  min-height: 360px;
}

/* 兼容 CodeEditor 内部高度由子组件控制的情况 */
.code-editor-wrap :deep(*) {
  box-sizing: border-box;
}

/* 让 Quill 更圆润一些 */
.rich-editor :deep(.ql-toolbar.ql-snow) {
  border: none;
  border-bottom: 1px solid rgba(200, 210, 230, 0.55);
  background: rgba(255, 255, 255, 0.85);
}

.rich-editor :deep(.ql-container.ql-snow) {
  border: none;
  min-height: 280px;
}

.rich-editor :deep(.ql-editor) {
  padding: 12px 14px;
  font-size: 14px;
  line-height: 1.75;
}

.form-footer {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 992px) {
  .add-question-card {
    padding: 18px 16px 14px;
    border-radius: 18px;
  }

  .add-question-form {
    :deep(.el-form-item) {
      margin-bottom: 12px;
    }
  }
}

.btn-cancel {
  border-radius: 18px;
}

.btn-submit {
  min-width: 120px;
  border-radius: 18px;
  background: linear-gradient(135deg, #7ac9ff, #b1e5ff);
  border: none;
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
  box-shadow: 0 10px 18px rgba(122, 201, 255, 0.22);
}

.btn-submit:hover {
  transform: translateY(-2px);
  filter: saturate(1.08) brightness(1.03);
  box-shadow:
    0 14px 26px rgba(122, 201, 255, 0.34),
    0 0 18px rgba(178, 153, 255, 0.22);
}

.btn-submit:active {
  transform: translateY(0);
  box-shadow: 0 10px 18px rgba(122, 201, 255, 0.22);
}

.btn-submit:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 3px rgba(50, 197, 255, 0.28),
    0 14px 26px rgba(122, 201, 255, 0.34);
}

@media (prefers-color-scheme: dark) {
  .add-question-card {
    background: rgba(20, 35, 55, 0.75);
    border-color: rgba(255, 255, 255, 0.08);
    box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.5),
      0 0 40px rgba(50, 90, 160, 0.4);
  }

  .card-header {
    .title {
      color: #c9dcff;
    }

    .subtitle {
      color: #9faed1;
    }
  }

  .add-question-form {
    :deep(.el-form-item__label) {
      color: rgba(201, 220, 255, 0.9);
    }

    :deep(.el-input__wrapper) {
      background: rgba(15, 25, 45, 0.75);
      box-shadow: inset 0 0 0 1px rgba(90, 110, 150, 0.55);
    }
  }

  .panel {
    background: rgba(15, 25, 45, 0.72);
    border-color: rgba(90, 110, 150, 0.45);
    box-shadow:
      0 10px 26px rgba(0, 0, 0, 0.35),
      0 0 34px rgba(50, 90, 160, 0.26);
  }

  .panel-header {
    background: linear-gradient(135deg, rgba(74, 144, 226, 0.22), rgba(138, 110, 255, 0.18));
    border-bottom-color: rgba(90, 110, 150, 0.45);
  }

  .panel-title {
    color: rgba(201, 220, 255, 0.92);
  }

  .panel-desc {
    color: rgba(201, 220, 255, 0.68);
  }

  .rich-editor,
  .rich-preview,
  .code-editor-wrap {
    background: rgba(10, 18, 34, 0.88);
    box-shadow: inset 0 0 0 1px rgba(90, 110, 150, 0.6);
  }

  .preview-html {
    color: rgba(230, 240, 255, 0.92);

    :deep(pre) {
      background: rgba(255, 255, 255, 0.06);
    }
  }

  .empty-hint {
    color: rgba(201, 220, 255, 0.7);
  }

  .rich-editor :deep(.ql-toolbar.ql-snow) {
    background: rgba(10, 18, 34, 0.82);
    border-bottom-color: rgba(90, 110, 150, 0.55);
  }
}
.form-vertical {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.code-area {
  margin-top: 10px;
}
</style>

