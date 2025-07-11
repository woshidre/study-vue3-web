<template>
  <div class="page-layout">
    <!-- 页面头部 -->
    <header class="page-header">
      <AppHeader />
    </header>

    <!-- 主要内容区域 -->
    <main class="page-main" :class="{ 'no-container': isPageWithHero }">
      <div v-if="!isPageWithHero" class="container">
        <router-view />
      </div>
      <router-view v-else />
    </main>

    <!-- 漂浮侧边栏 -->
    <FloatingSidebar />

    <!-- 页面底部 -->
    <footer class="page-footer" v-if="showFooter">
      <div class="container">
        <div class="footer-content">
          <div class="footer-info">
            <h3 class="heading-4">学习系统</h3>
            <p class="text-small text-secondary">打造最优质的在线学习体验</p>
          </div>
          <div class="footer-links">
            <div class="link-group">
              <h4 class="text-label">学习资源</h4>
              <ul class="link-list">
                <li><router-link to="/courses" class="link-subtle">课程中心</router-link></li>
                <li>
                  <router-link to="/learning-paths" class="link-subtle">学习路径</router-link>
                </li>
                <li><router-link to="/instructors" class="link-subtle">讲师介绍</router-link></li>
              </ul>
            </div>
            <div class="link-group">
              <h4 class="text-label">用户服务</h4>
              <ul class="link-list">
                <li><router-link to="/profile" class="link-subtle">个人中心</router-link></li>
                <li><router-link to="/progress" class="link-subtle">学习进度</router-link></li>
                <li><router-link to="/settings" class="link-subtle">账号设置</router-link></li>
              </ul>
            </div>
            <div class="link-group">
              <h4 class="text-label">帮助支持</h4>
              <ul class="link-list">
                <li><a href="#" class="link-subtle">帮助中心</a></li>
                <li><a href="#" class="link-subtle">联系客服</a></li>
                <li><a href="#" class="link-subtle">意见反馈</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p class="text-small text-tertiary">© 2024 学习系统. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './AppHeader.vue'
import FloatingSidebar from './FloatingSidebar.vue'

const route = useRoute()

// 判断是否为有头图的页面
const isPageWithHero = computed(() => {
  const heroPages = [
    '/',
    '/home',
    '/courses',
    '/instructors',
    '/paths',
    '/learning-paths',
    '/course-detail',
  ]
  return heroPages.includes(route.path) || route.path.startsWith('/course/')
})

// 控制是否显示底部
const showFooter = computed(() => {
  // 在某些页面可能不需要显示底部
  const hideFooterRoutes = ['/lesson']
  return !hideFooterRoutes.includes(route.path)
})
</script>

<style scoped lang="scss">
// 使用设计系统中定义的页面布局样式
.page-layout {
  // 基础样式已在 layout.scss 中定义
}

.page-header {
  // 基础样式已在 layout.scss 中定义
}

.page-main {
  // 基础样式已在 layout.scss 中定义
  background: var(--bg-secondary);

  &.no-container {
    padding: 0;
    max-width: none;
    margin-top: 64px; // 为固定的header留出空间
  }
}

.page-footer {
  // 基础样式已在 layout.scss 中定义

  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-8);
  }

  .footer-info {
    flex: 1;
    max-width: 300px;

    h3 {
      color: var(--text-primary);
      margin-bottom: var(--space-2);
    }

    p {
      margin: 0;
    }
  }

  .footer-links {
    display: flex;
    gap: var(--space-12);
    flex: 2;
    justify-content: flex-end;

    .link-group {
      h4 {
        margin-bottom: var(--space-3);
        color: var(--text-primary);
      }

      .link-list {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          margin-bottom: var(--space-2);

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }

  .footer-bottom {
    padding-top: var(--space-6);
    border-top: 1px solid var(--border-primary);
    text-align: center;

    p {
      margin: 0;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .page-footer {
    .footer-content {
      flex-direction: column;
      gap: var(--space-8);
    }

    .footer-info {
      max-width: none;
      text-align: center;
    }

    .footer-links {
      flex-direction: column;
      gap: var(--space-6);
      align-items: center;

      .link-group {
        text-align: center;
      }
    }
  }
}

@media (max-width: 480px) {
  .page-footer {
    .footer-links {
      .link-group {
        h4 {
          margin-bottom: var(--space-2);
        }
      }
    }
  }
}
</style>
