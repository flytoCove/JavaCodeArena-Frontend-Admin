<template>
  <div class="home-page">
    <div class="hero">
      <div class="hero-left">
        <h1 class="hero-title">Java Code Arena 管理平台</h1>
        <p class="hero-subtitle">
          统一管理用户、题目与竞赛配置。这里是一个默认首页示例，用于展示信息与快捷入口（无后端交互）。
        </p>

        <div class="hero-actions">
          <el-button class="btn-primary" type="primary" @click="go('/jcode/layout/question')">进入题目管理</el-button>
          <el-button class="btn-ghost" @click="go('/jcode/layout/exam')">进入竞赛管理</el-button>
        </div>
      </div>

      <div class="hero-right">
        <div class="badge">
          <div class="badge-title">今日概览</div>
          <div class="badge-grid">
            <div class="mini">
              <div class="mini-k">题目总数</div>
              <div class="mini-v">128</div>
            </div>
            <div class="mini">
              <div class="mini-k">竞赛场次</div>
              <div class="mini-v">12</div>
            </div>
            <div class="mini">
              <div class="mini-k">活跃用户</div>
              <div class="mini-v">346</div>
            </div>
            <div class="mini">
              <div class="mini-k">评测队列</div>
              <div class="mini-v">7</div>
            </div>
          </div>
          <div class="badge-tip">以上为静态展示数据，可按需替换为真实接口。</div>
        </div>
      </div>
    </div>

    <div class="grid">
      <section class="card">
        <div class="card-h">
          <div class="card-title">平台介绍</div>
          <div class="card-desc">一些你可以放在首页的说明文字</div>
        </div>
        <div class="card-b">
          <ul class="list">
            <li><span class="dot"></span> 题目：支持难度、时空限制、富文本描述与默认代码模板</li>
            <li><span class="dot"></span> 竞赛：可按场次配置题目、时间与参赛规则</li>
            <li><span class="dot"></span> 用户：统一账号体系，支持登录态与权限校验</li>
            <li><span class="dot"></span> 风格：毛玻璃 + 渐变背景，与登录页/布局保持一致</li>
          </ul>
        </div>
      </section>

      <section class="card">
        <div class="card-h">
          <div class="card-title">快捷入口</div>
          <div class="card-desc">常用功能一键直达</div>
        </div>
        <div class="card-b">
          <div class="quick">
            <button class="quick-item" @click="go('/jcode/layout/question')">
              <div class="qi-title">题目管理</div>
              <div class="qi-desc">新增/编辑/删除题目</div>
            </button>
            <button class="quick-item" @click="go('/jcode/layout/exam')">
              <div class="qi-title">竞赛管理</div>
              <div class="qi-desc">创建与配置竞赛</div>
            </button>
            <button class="quick-item" @click="go('/jcode/layout/cuser')">
              <div class="qi-title">用户管理</div>
              <div class="qi-desc">查看与管理用户信息</div>
            </button>
          </div>
        </div>
      </section>

      <section class="card wide">
        <div class="card-h">
          <div class="card-title">更新日志（示例）</div>
          <div class="card-desc">可用于展示最近改动、公告、值班信息等</div>
        </div>
        <div class="card-b">
          <div class="timeline">
            <div class="tl-item">
              <div class="tl-dot"></div>
              <div class="tl-content">
                <div class="tl-title">新增独立“添加题目”页面</div>
                <div class="tl-desc">富文本支持预览，代码区 Tabs 切换，更像后台表单页。</div>
              </div>
              <div class="tl-time">Today</div>
            </div>
            <div class="tl-item">
              <div class="tl-dot"></div>
              <div class="tl-content">
                <div class="tl-title">删除操作增加二次确认</div>
                <div class="tl-desc">避免误删，提升操作安全性。</div>
              </div>
              <div class="tl-time">Yesterday</div>
            </div>
            <div class="tl-item">
              <div class="tl-dot"></div>
              <div class="tl-content">
                <div class="tl-title">整体布局毛玻璃统一</div>
                <div class="tl-desc">更一致的渐变背景与卡片视觉。</div>
              </div>
              <div class="tl-time">Last week</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import router from '@/router'

function go(path) {
  router.push(path)
}
</script>

<style scoped lang="scss">
.home-page {
  width: 100%;
  min-height: 100%;
  padding: 16px 20px;
  box-sizing: border-box;
}

.hero {
  display: grid;
  grid-template-columns: 1.25fr 0.75fr;
  gap: 16px;
  margin-bottom: 16px;
}

.hero-left,
.hero-right {
  border-radius: 22px;
  backdrop-filter: blur(22px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.12),
    0 0 40px rgba(120, 180, 255, 0.16);
  background: rgba(255, 255, 255, 0.55);
}

.hero-left {
  padding: 22px 22px 18px;
  background:
    linear-gradient(135deg, rgba(178, 153, 255, 0.22), rgba(128, 207, 255, 0.18), rgba(255, 179, 217, 0.18)),
    rgba(255, 255, 255, 0.48);
}

.hero-title {
  margin: 0 0 8px;
  color: #2d5a8a;
  font-weight: 700;
  font-size: 22px;
  letter-spacing: 0.2px;
}

.hero-subtitle {
  margin: 0 0 14px;
  color: rgba(45, 90, 138, 0.8);
  line-height: 1.7;
  font-size: 13px;
}

.hero-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-primary {
  border-radius: 18px;
  background: linear-gradient(135deg, #7ac9ff, #b1e5ff);
  border: none;
  box-shadow: 0 10px 18px rgba(122, 201, 255, 0.24);
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
}
.btn-primary:hover {
  transform: translateY(-2px);
  filter: saturate(1.06) brightness(1.02);
  box-shadow:
    0 14px 26px rgba(122, 201, 255, 0.34),
    0 0 18px rgba(178, 153, 255, 0.2);
}

.btn-ghost {
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(200, 210, 230, 0.4);
}

.hero-right {
  padding: 16px;
}

.badge {
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(200, 210, 230, 0.35);
  background: rgba(255, 255, 255, 0.68);
}

.badge-title {
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 700;
  color: #355a8a;
  background: linear-gradient(135deg, rgba(178, 153, 255, 0.18), rgba(128, 207, 255, 0.18));
  border-bottom: 1px solid rgba(200, 210, 230, 0.35);
}

.badge-grid {
  padding: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.mini {
  border-radius: 14px;
  padding: 10px 10px;
  background: rgba(255, 255, 255, 0.75);
  box-shadow: inset 0 0 0 1px rgba(200, 210, 230, 0.35);
}
.mini-k {
  font-size: 12px;
  color: rgba(53, 90, 138, 0.78);
}
.mini-v {
  margin-top: 4px;
  font-size: 18px;
  font-weight: 700;
  color: #2d5a8a;
}

.badge-tip {
  padding: 0 12px 12px;
  color: rgba(53, 90, 138, 0.72);
  font-size: 12px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.card {
  border-radius: 22px;
  backdrop-filter: blur(22px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.12),
    0 0 40px rgba(120, 180, 255, 0.14);
  background: rgba(255, 255, 255, 0.55);
  overflow: hidden;
}

.card-h {
  padding: 12px 14px;
  background: linear-gradient(135deg, rgba(178, 153, 255, 0.16), rgba(128, 207, 255, 0.14));
  border-bottom: 1px solid rgba(200, 210, 230, 0.35);
}
.card-title {
  font-size: 13px;
  font-weight: 700;
  color: #355a8a;
}
.card-desc {
  margin-top: 2px;
  font-size: 12px;
  color: rgba(53, 90, 138, 0.72);
}
.card-b {
  padding: 14px;
}

.card.wide {
  grid-column: 1 / -1;
}

.list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
  color: rgba(44, 62, 80, 0.85);
  line-height: 1.7;
  font-size: 13px;
}
.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 99px;
  margin-right: 10px;
  background: linear-gradient(135deg, #32c5ff, #8a6eff);
  box-shadow: 0 0 12px rgba(50, 197, 255, 0.25);
  transform: translateY(1px);
}

.quick {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}
.quick-item {
  width: 100%;
  text-align: left;
  border: none;
  cursor: pointer;
  padding: 12px 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.75);
  box-shadow: inset 0 0 0 1px rgba(200, 210, 230, 0.35);
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
}
.quick-item:hover {
  transform: translateY(-2px);
  filter: saturate(1.04) brightness(1.02);
  box-shadow:
    0 14px 26px rgba(122, 201, 255, 0.18),
    inset 0 0 0 1px rgba(200, 210, 230, 0.35);
}
.qi-title {
  font-weight: 700;
  color: #2d5a8a;
  font-size: 13px;
}
.qi-desc {
  margin-top: 2px;
  color: rgba(53, 90, 138, 0.72);
  font-size: 12px;
}

.timeline {
  display: grid;
  gap: 10px;
}
.tl-item {
  display: grid;
  grid-template-columns: 12px 1fr auto;
  gap: 10px;
  align-items: start;
  padding: 12px 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.75);
  box-shadow: inset 0 0 0 1px rgba(200, 210, 230, 0.35);
}
.tl-dot {
  width: 10px;
  height: 10px;
  border-radius: 99px;
  margin-top: 4px;
  background: linear-gradient(135deg, #32c5ff, #8a6eff);
  box-shadow: 0 0 14px rgba(50, 197, 255, 0.22);
}
.tl-title {
  font-weight: 700;
  color: #2d5a8a;
  font-size: 13px;
}
.tl-desc {
  margin-top: 2px;
  color: rgba(53, 90, 138, 0.72);
  font-size: 12px;
  line-height: 1.65;
}
.tl-time {
  color: rgba(53, 90, 138, 0.62);
  font-size: 12px;
  white-space: nowrap;
}

@media (max-width: 992px) {
  .hero {
    grid-template-columns: 1fr;
  }
  .grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-color-scheme: dark) {
  .hero-left,
  .hero-right,
  .card {
    background: rgba(20, 35, 55, 0.7);
    border-color: rgba(255, 255, 255, 0.08);
    box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.5),
      0 0 40px rgba(50, 90, 160, 0.35);
  }

  .hero-title {
    color: rgba(201, 220, 255, 0.95);
  }
  .hero-subtitle {
    color: rgba(201, 220, 255, 0.72);
  }
  .btn-ghost {
    background: rgba(10, 18, 34, 0.6);
    border-color: rgba(90, 110, 150, 0.55);
    color: rgba(201, 220, 255, 0.9);
  }

  .badge,
  .mini,
  .quick-item,
  .tl-item {
    background: rgba(10, 18, 34, 0.82);
    border-color: rgba(90, 110, 150, 0.45);
    box-shadow: inset 0 0 0 1px rgba(90, 110, 150, 0.6);
  }

  .card-title,
  .badge-title,
  .qi-title,
  .tl-title,
  .mini-v {
    color: rgba(201, 220, 255, 0.92);
  }
  .card-desc,
  .badge-tip,
  .qi-desc,
  .tl-desc,
  .tl-time,
  .mini-k {
    color: rgba(201, 220, 255, 0.7);
  }
  .list {
    color: rgba(201, 220, 255, 0.78);
  }
}
</style>

