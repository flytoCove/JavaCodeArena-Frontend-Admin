<template>
  <el-container class="layout-container">
    <el-header class="el-header">
      <!-- 顶部导航菜单 - 修改为透明背景 -->
      <el-menu class="header-menu" mode="horizontal" router :background-color="'transparent'" :border-bottom="false">
        <el-menu-item index="/jcode/layout/home">
          <el-icon><House /></el-icon>
          <span>主页</span>
          <span class="custom-underline"></span>
        </el-menu-item>
        <el-menu-item index="/jcode/layout/cuser">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
          <!-- 添加自定义下划线元素 -->
          <span class="custom-underline"></span>
        </el-menu-item>
        <el-menu-item index="/jcode/layout/question">
          <el-icon><Document /></el-icon>
          <span>题目管理</span>
          <span class="custom-underline"></span>
        </el-menu-item>
        <el-menu-item index="/jcode/layout/exam">
          <el-icon><TrophyBase /></el-icon>
          <span>竞赛管理</span>
          <span class="custom-underline"></span>
        </el-menu-item>
      </el-menu>

      <!-- 右侧用户信息下拉菜单 -->
      <el-dropdown placement="bottom-end">
        <span class="el-dropdown__box">
          <div><strong>当前用户：</strong>{{ loginUser.nickName }}</div>
          <el-icon>
            <ArrowDownBold />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-header>

    <!-- 移除了左侧边栏，只保留主内容区 -->
    <el-main class="layout-main-box">
      <RouterView />
    </el-main>
  </el-container>
</template>

<script setup>
import { Document, TrophyBase, User, ArrowDownBold, SwitchButton, House } from '@element-plus/icons-vue'
import { reactive } from 'vue'
import { getUserInfoService, logoutService } from '@/apis/sysuser'
import { ElMessageBox, ElMessage } from 'element-plus'
import { removeToken } from '@/utils/cookie'
import router from '@/router'
const loginUser = reactive({
  nickName: '',
})

async function getUserInfo() {
  const userInfo = await getUserInfoService()
  loginUser.nickName = userInfo.data.nickName
}
getUserInfo()

async function logout() {
  // 确认弹窗
  await ElMessageBox.confirm(
    '确认退出?', 
    '温馨提示', 
    {
    confirmButtonText: '确认',
    cancelButtonText: '取消', 
    type: 'warning',
    })

  // 用户确认后执行退出
  await logoutService()
  removeToken()

  // 成功提示
  ElMessage.success('退出成功')

  // 跳转
  router.push('/jcode/login')
}

</script>

<style lang="scss" scoped>

/* 建议的布局样式 */
.header-menu {
  flex: 1; /* 撑开剩余空间 */
  border-bottom: none; /* 去除原本 menu 的下边框，避免与 header 边框重复 */
  
  // 确保菜单项与header背景一致
  :deep(.el-menu--horizontal) {
    background-color: transparent !important;
    border-bottom: none !important;
  }
  
  // 修改菜单项样式，使其与毛玻璃效果融合
  :deep(.el-menu-item) {
    position: relative;
    background-color: transparent !important;
    color: #4a90e2;
    border-bottom: none !important;
    transition: all 0.3s ease;
    overflow: visible;
    
    // 自定义下划线样式
    .custom-underline {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 3px;
      background: linear-gradient(90deg, #32c5ff, #8a6eff);
      border-radius: 3px 3px 0 0;
      transition: width 0.3s ease;
      opacity: 0;
      box-shadow: 0 0 10px rgba(50, 197, 255, 0.5);
    }
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.2) !important;
      color: #32c5ff;
      
      // 悬停时显示半透明的下划线
      .custom-underline {
        width: 30px;
        opacity: 0.5;
      }
    }
    
    // 激活状态样式
    &.is-active {
      color: #32c5ff;
      background-color: rgba(255, 255, 255, 0.1) !important;
      
      .custom-underline {
        width: 40px;
        opacity: 1;
        animation: underlinePulse 2s infinite;
      }
      
      // 添加光晕效果
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, rgba(50, 197, 255, 0.2), transparent 70%);
        pointer-events: none;
        border-radius: 22px;
      }
    }
  }
  
  // 为图标添加动画效果
  :deep(.el-icon) {
    transition: transform 0.3s ease;
  }
  
  :deep(.el-menu-item:hover .el-icon) {
    transform: translateY(-2px);
  }
  
  :deep(.el-menu-item.is-active .el-icon) {
    color: #32c5ff;
    filter: drop-shadow(0 0 5px rgba(50, 197, 255, 0.5));
  }
}

// 下划线脉冲动画
@keyframes underlinePulse {
  0% {
    box-shadow: 0 0 5px rgba(50, 197, 255, 0.5);
    width: 40px;
  }
  50% {
    box-shadow: 0 0 15px rgba(50, 197, 255, 0.8);
    width: 50px;
  }
  100% {
    box-shadow: 0 0 5px rgba(50, 197, 255, 0.5);
    width: 40px;
  }
}

.layout-container {
  height: 100vh;
  // 修改背景为与Login.vue相同的渐变色
  background: linear-gradient(135deg, #e8e0ff 0%, #d0e6ff 50%, #ffe6f2 100%);
  position: relative;

  // 添加粒子效果背景（可选，如果需要更一致的效果）
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

  .layout-bottom-box {
    display: flex;
    justify-content: space-between;
    height: calc(100vh - 100px);
    overflow: hidden;
    position: relative;
    z-index: 1;

    .left {
      margin-right: 20px;
      background: rgba(255, 255, 255, 0.35); // 改为毛玻璃效果，与Login卡片一致
      backdrop-filter: blur(22px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 22px;
      display: flex;
      box-shadow:
        0 10px 30px rgba(0, 0, 0, 0.15),
        0 0 40px rgba(120, 180, 255, 0.2);

      :deep(.el-menu) {
        flex: 1;
        background: transparent;
        border: none;
        border-radius: 22px;

        .el-menu-item {
          color: #4a90e2;
          margin: 4px 8px;
          border-radius: 14px;

          &.is-active {
            color: #32c5ff;
            background: rgba(255, 255, 255, 0.5);
          }

          &:hover {
            background: rgba(255, 255, 255, 0.5);
            color: #32c5ff;
          }
        }
      }
    }

    .right {
      flex: 1;
      overflow-y: auto;
      background: rgba(255, 255, 255, 0.35); // 改为毛玻璃效果
      backdrop-filter: blur(22px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 22px;
      padding: 20px;
      box-shadow:
        0 10px 30px rgba(0, 0, 0, 0.15),
        0 0 40px rgba(120, 180, 255, 0.2);
    }
  }

  .el-aside {
    background-color: transparent; // 改为透明
    border-radius: 22px;

    &__logo {
      height: 120px;
    }

    .el-menu {
      border-right: none;
    }
  }

  // 控制 header 与下方 RouterView 的间距：改 .layout-main-box 的 padding-top
  .layout-main-box {
    padding-top: 0; /* 调大此值 = 增加 header 与内容区的距离，调小或 0 = 更紧凑 */
  }

  .el-header {
    background: rgba(255, 255, 255, 0.35); // 改为毛玻璃效果
    backdrop-filter: blur(22px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 22px;
    margin: 16px 20px;
    width: calc(100% - 40px);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 60px;
    box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.15),
      0 0 40px rgba(120, 180, 255, 0.2);

    .el-dropdown__box {
      display: flex;
      align-items: center;
      color: #4a90e2;

      .el-icon {
        color: #4a90e2;
        margin-left: 20px;
      }

      &:active,
      &:focus {
        outline: none;
      }

      &:hover {
        color: #32c5ff;
      }
    }
  }

  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}

// 夜间模式 - 与Login.vue保持一致
@media (prefers-color-scheme: dark) {
  .layout-container {
    background: linear-gradient(135deg, #0e1a2b 0%, #11233a 50%, #0d1c31 100%);

    &::before {
      background:
        radial-gradient(circle at 20% 30%, rgba(74, 144, 226, 0.1) 0%, transparent 30%),
        radial-gradient(circle at 80% 70%, rgba(50, 197, 255, 0.1) 0%, transparent 30%),
        radial-gradient(circle at 40% 80%, rgba(255, 102, 178, 0.1) 0%, transparent 30%);
    }

    .el-header,
    .left,
    .right {
      background: rgba(20, 35, 55, 0.65);
      border-color: rgba(255, 255, 255, 0.1);
    }

    .el-header {
      .el-dropdown__box {
        color: #c9dcff;

        .el-icon {
          color: #c9dcff;
        }

        &:hover {
          color: #76adff;
        }
      }
    }

    .left {
      :deep(.el-menu) {
        .el-menu-item {
          color: #c9dcff;

          &.is-active {
            color: #76adff;
            background: rgba(255, 255, 255, 0.1);
          }

          &:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #76adff;
          }
        }
      }
    }
  }
  
  // 夜间模式下的菜单项样式
  .header-menu {
    :deep(.el-menu-item) {
      color: #c9dcff !important;
      
      .custom-underline {
        background: linear-gradient(90deg, #76adff, #a688ff);
      }
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.1) !important;
        color: #76adff !important;
      }
      
      &.is-active {
        color: #76adff !important;
        
        &::before {
          background: radial-gradient(circle at center, rgba(118, 173, 255, 0.2), transparent 70%);
        }
      }
    }
  }
}

</style>