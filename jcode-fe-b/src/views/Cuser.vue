<template>
  <!-- 表单 -->
  <div style="display: flex; justify-content: flex-start">
    <el-form inline="true" style="margin-bottom: 0">
      <el-form-item label="" style="margin-bottom: 0.1; margin-right: 10px">
        <el-input v-model="params.userId" placeholder="输入要搜索的用户ID" />
      </el-form-item>
      <el-form-item label="" style="margin-bottom: 0.1; margin-right: 10px">
        <el-input v-model="params.nickName" placeholder="输入要搜索的用户昵称" />
      </el-form-item>
      <el-form-item>
        <el-button :icon="Search" @click="onSearch" plain></el-button>
        <el-button :icon="Refresh" @click="onReset" plain type="info"></el-button>
      </el-form-item>
    </el-form>
  </div>
  <!-- 表格 -->
  <el-table height="580px" :data="userList">
    <el-table-column prop="userId" label="用户ID" width="180px" />
    <el-table-column prop="nickName" label="用户昵称" width="150px" />
    <el-table-column prop="sex" width="70px" label="性别">
      <template #default="{ row }">
        <div v-if="row.sex === 1" style="color: #3ec8ff">男</div>
        <div v-if="row.sex === 2" style="color: #fd4c40">女</div>
      </template>
    </el-table-column>
    <el-table-column prop="phone" width="120px" label="手机号" />
    <el-table-column prop="email" label="邮箱" />
    <!-- <el-table-column prop="wechat" width="120px" label="微信号" /> -->
    <!-- <el-table-column label="学校/专业" width="150px"> 
      <template #default="{ row }">
        <span class="block-span"> 学校: {{ row.schoolName }}</span>
        <span class="block-span"> 专业: {{ row.majorName }}</span>
      </template>
    </el-table-column> -->
    <el-table-column label="学校" width="150px" prop="schoolName" />
    <el-table-column label="专业" width="150px" prop="majorName" />
    <!-- <el-table-column prop="introduce" label="个人介绍" /> -->
    <el-table-column prop="status" width="90px" label="用户状态">
      <template #default="{ row }">
        <el-tag type="success" v-if="row.status">正常</el-tag>
        <el-tag type="error" v-else>拉黑</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="80px" fixed="right">
      <template #default="{ row }">
        <el-button
          class="red"
          v-if="row.status === 1"
          type="text"
          plain
          @click="onUpdateUserStatus(row.userId, 0)"
          >拉黑</el-button
        >
        <el-button
          v-if="row.status === 0"
          type="text"
          plain
          @click="onUpdateUserStatus(row.userId, 1)"
          >解禁</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页区域 -->
  <el-pagination
    background
    size="small"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    v-model:current-page="params.pageNum"
    v-model:page-size="params.pageSize"
    :page-sizes="[5, 10, 15, 20]"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script setup>
import { Search ,Refresh} from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { getUserListService, updateStatusService } from '@/apis/cuser'

const params = reactive({
  pageNum: 1,
  pageSize: 10,
  userId: '',
  nickName: '',
})

const userList = ref([])
const total = ref(0)

async function getUserList() {
  const ref = await getUserListService(params)
  userList.value = ref.rows
  total.value = ref.total
}
getUserList()

function onSearch() {
  params.pageNum = 1
  getUserList()
}

function onReset() {
  params.pageNum = 1
  params.pageSize = 10
  params.userId = ''
  params.nickName = ''
  getUserList()
}

function handleSizeChange(newSize) {
  params.pageNum = 1
  getUserList()
}

function handleCurrentChange(newPage) {
  getUserList()
}

const updateStatusParams = reactive({
  userId: '',
  status: '',
})

async function onUpdateUserStatus(userId, status) {
  updateStatusParams.userId = userId
  updateStatusParams.status = status
  await updateStatusService(updateStatusParams)
  getUserList()
}
</script>
