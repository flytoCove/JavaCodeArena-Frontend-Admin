<template>
  <el-container class="layout-container">
    <el-header class="el-header">
      <el-dropdown placement="bottom-end">
        <span class="el-dropdown__box">
          <div><strong>当前用户：</strong>{{ loginUser.nickName }}</div>
          <el-icon>
            <ArrowDownBold />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :icon="SwitchButton">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-header>

    <el-main class="layout-bottom-box">
      <div class="left">
        <el-aside width="150px" class="el-aside">
          <el-menu class="el-menu" router>
            <el-menu-item index="/jcode/layout/cuser">
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </el-menu-item>
            <el-menu-item index="/jcode/layout/question">
              <el-icon><Document /></el-icon>
              <span>题目管理</span>
            </el-menu-item>
            <el-menu-item index="/jcode/layout/exam">
              <el-icon><TrophyBase /></el-icon>
              <span>竞赛管理</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
      </div>
      <!-- <div class="right">
        <router-view />
      </div> -->
      <div class="right">
        <RouterView />
      </div>
    </el-main>
  </el-container>
</template>

<script setup>
import { Document,TrophyBase,User, ArrowDownBold, SwitchButton } from '@element-plus/icons-vue'
import { reactive } from 'vue'
import { getUserInfoService,logoutService } from '@/apis/sysuser'
const loginUser = reactive({
  nickName: ''
})

async function getUserInfo() {
  const userInfo = await getUserInfoService()
  loginUser.nickName = userInfo.data.nickName
}
getUserInfo()

</script>

<style lang="scss" scoped>
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
    background: radial-gradient(circle at 20% 30%, rgba(178, 153, 255, 0.1) 0%, transparent 30%),
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
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15), 0 0 40px rgba(120, 180, 255, 0.2);
      
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
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15), 0 0 40px rgba(120, 180, 255, 0.2);
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
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15), 0 0 40px rgba(120, 180, 255, 0.2);
    
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
      background: radial-gradient(circle at 20% 30%, rgba(74, 144, 226, 0.1) 0%, transparent 30%),
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
}
</style>