<template>
  <div class="add-exam-component-box">
    <div class="add-exam-component">
      <!-- 竞赛信息模块 -->
      <div class="exam-base-info-box glass-card">
        <div class="card-header">
          <h2 class="title">{{ type === 'edit' ? '编辑竞赛' : '添加竞赛' }}</h2>
          <p class="subtitle">请完善竞赛信息，用于组织线上编程竞赛</p>
        </div>
        <div class="exam-base-info">
          <div class="group-box">
            <div class="group-item">
              <div class="item-label required">竞赛名称</div>
              <div>
                <el-input v-model="formExam.title" style="width:420px" placeholder="请填写竞赛名称" class="custom-input"></el-input>
              </div>
            </div>
          </div>
          <div class="group-box">
            <div class="group-item">
              <div class="item-label required">竞赛周期</div>
              <div>
                <el-date-picker v-model="formExam.examDate" :disabledDate="disabledDate" type="datetimerange"
                  start-placeholder="竞赛开始时间" end-placeholder="竞赛结束时间" value-format="YYYY-MM-DD HH:mm:ss" 
                  class="custom-date-picker" />
              </div>
            </div>
          </div>
          <div class="group-box">
            <div class="group-item">
              <el-button class="exam-base-info-button" type="primary" plain @click="saveBaseInfo">保存基本信息</el-button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 添加竞赛题目（卡片高度自适应，最大高度 400px，超出滚动） -->
      <div class="exam-select-question-box glass-card">
        <div class="card-header" style="border-bottom: none; padding-bottom: 0;">
          <h2 class="title" style="font-size: 18px;">竞赛题目列表</h2>
          <p class="subtitle">已选题目将在竞赛中供选手作答</p>
        </div>
        <div class="question-header">
          <el-button class="exam-add-question" :icon="Plus" type="primary" plain @click="addQuestion()">
            添加题目
          </el-button>
        </div>
        <!-- 表格容器，用于滚动 -->
        <div class="table-scroll-container">
          <el-table :data="formExam.examQuestionList" class="custom-table" style="width: 100%">
            <el-table-column prop="questionId" width="180px" label="题目ID" />
            <el-table-column prop="title" :show-overflow-tooltip="true" label="题目标题" />
            <el-table-column prop="difficulty" width="100px" label="题目难度">
              <template #default="{ row }">
                <el-tag :type="row.difficulty === 1 ? 'success' : row.difficulty === 2 ? 'warning' : 'danger'" size="small">
                  {{ row.difficulty === 1 ? '简单' : row.difficulty === 2 ? '中等' : '困难' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100px">
              <template #default="{ row }">
                <el-button type="primary" link @click="deleteExamQuestion(formExam.examId, row.questionId)">
                  删除
                </el-button>
              </template>
            </el-table-column>
            <!-- 自定义空状态 -->
            <template #empty>
              <el-empty description="暂无题目，请点击上方按钮添加" :image-size="100" />
            </template>
          </el-table>
        </div>
      </div>

      <!-- 题目配置模块 题目列表勾选加序号 -->
      <el-dialog v-model="dialogVisible" title="选择竞赛题目" width="60%" destroy-on-close class="question-dialog" @close="handleDialogClose">
        <div class="exam-list-box">
          <el-form :inline="true" class="search-form">
            <el-form-item label="题目难度">
              <selector v-model="params.difficulty" placeholder="请选择难度" style="width: 120px;"></selector>
            </el-form-item>
            <el-form-item label="题目名称">
              <el-input v-model="params.title" placeholder="请输入题目标题" clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSearch" plain>搜索</el-button>
              <el-button @click="onReset" plain>重置</el-button>
            </el-form-item>
          </el-form>
          
          <!-- 题目列表 -->
          <el-table :data="questionList" @selection-change="handleSelectionChange" class="custom-table">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="questionId" label="题目ID" width="120" />
            <el-table-column prop="title" label="题目标题" show-overflow-tooltip />
            <el-table-column prop="difficulty" label="题目难度" width="100">
              <template #default="{ row }">
                <el-tag :type="row.difficulty === 1 ? 'success' : row.difficulty === 2 ? 'warning' : 'danger'" size="small">
                  {{ row.difficulty === 1 ? '简单' : row.difficulty === 2 ? '中等' : '困难' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 分页区域 -->
          <div class="pagination-wrapper">
            <el-pagination background size="small" layout="total, sizes, prev, pager, next, jumper" :total="total"
              v-model:current-page="params.pageNum" v-model:page-size="params.pageSize"
              :page-sizes="[5, 10, 15, 20]" @size-change="handleSizeChange"
              @current-change="handleCurrentChange" />
            <el-button class="submit-btn" type="primary" @click="submitSelectQuestion">确认选择</el-button>
          </div>
        </div>
      </el-dialog>

      <!-- 提交任务区域 -->
      <div class="submit-box glass-card">
        <el-button @click="goBack" plain>取消</el-button>
        <el-button type="primary" @click="publishExam" :loading="publishing">发布竞赛</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
// 此处代码与您之前保持一致，完全不变
import { examAddService, addExamQuestionService, getExamDetailService, editExamService, delExamQuestionService, publishExamService } from "@/apis/exam"
import { getQuestionListService } from "@/apis/question"
import Selector from "@/components/QuestionSelector.vue"
import router from '@/router'
import { reactive, ref } from "vue"
import { Plus } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router';
import { ElMessage } from "element-plus"

const type = useRoute().query.type
const formExam = reactive({
  examId: '',
  title: '',
  examDate: '',
  examQuestionList: []
})

const params = reactive({
  pageNum: 1,
  pageSize: 10,
  difficulty: '',
  title: ''
})

const publishing = ref(false)

function goBack() {
  router.go(-1)
}

function disabledDate(time) {
  return time.getTime() < Date.now() - 8.64e7
}

async function saveBaseInfo() {
  if (!formExam.title) {
    ElMessage.warning('请输入竞赛名称')
    return
  }
  if (!formExam.examDate || formExam.examDate.length !== 2) {
    ElMessage.warning('请选择竞赛周期')
    return
  }
  
  const fd = new FormData()
  for (let key in formExam) {
    if (key === 'examDate') {
      fd.append('startTime', formExam.examDate[0]);
      fd.append('endTime', formExam.examDate[1]);
    } else if (key !== 'startTime' && key !== 'endTime' && key !== 'examQuestionList') {
      fd.append(key, formExam[key])
    }
  }
  try {
    if (formExam.examId) {
      await editExamService(fd)
      ElMessage.success('基本信息更新成功')
    } else {
      const addRes = await examAddService(fd)
      formExam.examId = addRes.data
      ElMessage.success('基本信息保存成功')
    }
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const questionList = ref([])
const total = ref(0)
async function getQuestionList() {
  const result = await getQuestionListService(params)
  questionList.value = result.rows
  total.value = result.total
}

const dialogVisible = ref(false)
// 添加题目：打开对话框
function addQuestion() {
  if (!formExam.examId) {
    ElMessage.warning('请先保存竞赛基本信息')
    return
  }
  // 重置分页和搜索条件
  params.pageNum = 1
  params.pageSize = 10
  params.title = ''
  params.difficulty = ''
  // 构造排除ID字符串（已选题目ID用分号拼接）
  const excludeIdStr = formExam.examQuestionList.map(q => q.questionId).join(';')
  params.excludeIdStr = excludeIdStr || undefined // 无已选时传undefined
  getQuestionList()
  dialogVisible.value = true
}

function handleSizeChange() {
  params.pageNum = 1
  getQuestionList()
}

function handleCurrentChange() {
  getQuestionList()
}

function onSearch() {
  params.pageNum = 1
  getQuestionList()
}

function onReset() {
  params.pageNum = 1
  params.pageSize = 10
  params.title = ''
  params.difficulty = ''
  getQuestionList()
}



// 可选：对话框关闭时清除排除条件，避免影响后续使用
function handleDialogClose() {
  delete params.excludeIdStr
}

async function publishExam() {
  if (!formExam.examId) {
    ElMessage.warning('请先保存竞赛基本信息')
    return
  }
  publishing.value = true
  try {
    await publishExamService(formExam.examId)
    ElMessage.success('发布成功')
    router.push("/jcode/layout/exam")
  } catch (error) {
    ElMessage.error('发布失败')
    publishing.value = false
  }
}

const selectedQuestions = ref([])

function handleSelectionChange(selection) {
  selectedQuestions.value = selection
}

async function submitSelectQuestion() {
  if (!selectedQuestions.value.length) {
    ElMessage.warning('请至少选择一道题目')
    return
  }
  
  const questionIdSet = selectedQuestions.value.map(item => item.questionId)
  const examQ = {
    examId: formExam.examId,
    questionIdSet: questionIdSet
  }
  
  try {
    await addExamQuestionService(examQ);
    await getExamDetailById(formExam.examId)
    dialogVisible.value = false
    ElMessage.success('竞赛题目添加成功')
  } catch (error) {
    ElMessage.error('添加失败')
  }
}

async function getExamDetail() {
  const examId = useRoute().query.examId
  if (examId) {
    formExam.examId = examId
    await getExamDetailById(examId)
  }
}
getExamDetail()

async function deleteExamQuestion(examId, questionId) {
  try {
    await delExamQuestionService(examId, questionId)
    await getExamDetailById(examId)
    ElMessage.success('竞赛题目删除成功')
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

async function getExamDetailById(examId) {
  const examDetail = await getExamDetailService(examId)
  formExam.examQuestionList = []
  Object.assign(formExam, examDetail.data)
  formExam.examDate = [examDetail.data.startTime, examDetail.data.endTime]
}
</script>


<style lang="scss" scoped>
.add-exam-component-box {
  width: 100%;
  min-height: 100%;
  padding: 12px 16px 18px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: linear-gradient(135deg, #e8e0ff 0%, #d0e6ff 50%, #ffe6f2 100%);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:
      radial-gradient(circle at 20% 30%, rgba(178, 153, 255, 0.1) 0%, transparent 30%),
      radial-gradient(circle at 80% 70%, rgba(128, 207, 255, 0.1) 0%, transparent 30%),
      radial-gradient(circle at 40% 80%, rgba(255, 179, 217, 0.1) 0%, transparent 30%);
    pointer-events: none;
    z-index: 0;
  }
}

.add-exam-component {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  z-index: 1;
}

// 毛玻璃卡片（与 AddQuestion.vue 风格一致）
.glass-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(22px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 22px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12), 0 0 40px rgba(120, 180, 255, 0.18);
  padding: 22px 22px 18px;
}

// 卡片头部
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

.exam-base-info-box,
.exam-select-question-box,
.submit-box {
  @extend .glass-card;
}

// 竞赛题目列表卡片 - 设置最大高度，内部滚动
.exam-select-question-box {
  display: flex;
  flex-direction: column;
  max-height: 400px; // 卡片最大高度，超出后内部滚动
  overflow: hidden; // 隐藏溢出，由内部容器滚动

  .card-header {
    flex-shrink: 0; // 防止压缩
  }

  .question-header {
    flex-shrink: 0;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
  }

  .table-scroll-container {
    flex: 1;
    overflow-y: auto;
    min-height: 0; // 保证 flex 子项可滚动
    margin-right: -2px; // 微调滚动条占位
  }
}

.group-box {
  margin-bottom: 20px;

  .group-item {
    display: flex;
    align-items: center;

    .item-label {
      width: 100px;
      font-size: 14px;
      color: #4a90e2;
      position: relative;
      padding-left: 14px;

      &.required::before {
        content: '*';
        position: absolute;
        left: 0;
        color: #ff4d4f;
        font-size: 16px;
      }
    }

    .exam-base-info-button {
      margin-left: 100px;
      width: 120px;
    }
  }
}

// 自定义输入框（与 AddQuestion.vue 一致）
:deep(.custom-input) {
  .el-input__wrapper {
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.72);
    box-shadow: inset 0 0 0 1px rgba(200, 210, 230, 0.35);
    
    &:hover, &.is-focus {
      border-color: #32c5ff;
      background: rgba(255, 255, 255, 0.9);
    }
    
    .el-input__inner {
      color: #4a90e2;
      
      &::placeholder {
        color: rgba(74, 144, 226, 0.5);
      }
    }
  }
}

:deep(.custom-date-picker) {
  .el-input__wrapper {
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.72);
    box-shadow: inset 0 0 0 1px rgba(200, 210, 230, 0.35);
    
    &:hover, &.is-focus {
      border-color: #32c5ff;
      background: rgba(255, 255, 255, 0.9);
    }
    
    .el-input__inner {
      color: #4a90e2;
    }
  }
}

// 自定义表格（透明毛玻璃风格）
:deep(.custom-table) {
  background: transparent !important;
  border-radius: 12px;
  overflow: hidden;

  .el-table__header {
    th {
      background: rgba(255, 255, 255, 0.2) !important;
      color: #4a90e2;
      font-weight: 500;
      border-bottom: 1px solid rgba(200, 210, 230, 0.35);
    }
  }

  .el-table__row {
    background: transparent !important;
    
    td {
      background: transparent !important;
      border-bottom: 1px solid rgba(200, 210, 230, 0.2);
      color: #4a90e2;
    }
    
    &:hover td {
      background: rgba(255, 255, 255, 0.15) !important;
    }
  }

  &::before {
    display: none;
  }

  // 空状态样式
  .el-table__empty-block {
    background: transparent;
  }
  .el-empty__description p {
    color: #4a90e2;
  }
}

// 对话框样式（与 AddQuestion.vue 风格融合）
.question-dialog {
  :deep(.el-dialog) {
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(22px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 22px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    
    .el-dialog__header {
      border-bottom: 1px solid rgba(200, 210, 230, 0.35);
      padding: 16px 24px;
      
      .el-dialog__title {
        color: #4a90e2;
        font-weight: 500;
      }
      
      .el-dialog__close {
        color: #4a90e2;
        
        &:hover {
          color: #32c5ff;
        }
      }
    }
    
    .el-dialog__body {
      padding: 20px 24px;
    }
  }
}

.exam-list-box {
  background: transparent;

  .search-form {
    margin-bottom: 20px;
    
    :deep(.el-form-item__label) {
      color: #4a90e2;
    }
    
    :deep(.el-input__wrapper) {
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.72);
      box-shadow: inset 0 0 0 1px rgba(200, 210, 230, 0.35);
      
      &:hover, &.is-focus {
        border-color: #32c5ff;
        background: rgba(255, 255, 255, 0.9);
      }
      
      .el-input__inner {
        color: #4a90e2;
      }
    }
  }
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .submit-btn {
    border-radius: 20px;
    padding: 8px 24px;
    background: linear-gradient(135deg, #32c5ff, #8a6eff);
    border: none;
    color: white;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(50, 197, 255, 0.3);
    }
  }
}

.submit-box {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 16px;
  margin-top: 16px;
  
  .el-button {
    min-width: 100px;
    border-radius: 18px;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
  }
}

// 夜间模式
@media (prefers-color-scheme: dark) {
  .add-exam-component-box {
    background: linear-gradient(135deg, #0e1a2b 0%, #11233a 50%, #0d1c31 100%);

    &::before {
      background:
        radial-gradient(circle at 20% 30%, rgba(74, 144, 226, 0.1) 0%, transparent 30%),
        radial-gradient(circle at 80% 70%, rgba(50, 197, 255, 0.1) 0%, transparent 30%),
        radial-gradient(circle at 40% 80%, rgba(255, 102, 178, 0.1) 0%, transparent 30%);
    }
  }
  
  .glass-card {
    background: rgba(20, 35, 55, 0.75);
    border-color: rgba(255, 255, 255, 0.08);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 40px rgba(50, 90, 160, 0.4);
  }
  
  .card-header {
    .title {
      color: #c9dcff;
    }
    .subtitle {
      color: #9faed1;
    }
  }
  
  .item-label {
    color: #c9dcff !important;
  }
  
  :deep(.custom-input),
  :deep(.custom-date-picker),
  :deep(.search-form .el-input__wrapper) {
    .el-input__wrapper {
      background: rgba(15, 25, 45, 0.75);
      box-shadow: inset 0 0 0 1px rgba(90, 110, 150, 0.55);
      
      .el-input__inner {
        color: #c9dcff;
      }
    }
  }
  
  :deep(.custom-table) {
    .el-table__header th {
      background: rgba(20, 35, 55, 0.6) !important;
      color: #c9dcff;
    }
    .el-table__row td {
      color: #c9dcff;
    }
  }
  
  .question-dialog :deep(.el-dialog) {
    background: rgba(20, 35, 55, 0.95);
    .el-dialog__title,
    .el-dialog__close {
      color: #c9dcff;
    }
  }
}
</style>