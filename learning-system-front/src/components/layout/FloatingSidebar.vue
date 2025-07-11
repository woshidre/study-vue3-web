<template>
  <div
    class="floating-sidebar"
    :class="{ 'is-hidden': isHidden }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 快捷导航按钮组 -->
    <div class="quick-nav-buttons">
      <el-tooltip
        v-for="item in quickNavItems"
        :key="item.path"
        :content="item.name"
        placement="left"
        effect="dark"
      >
        <router-link :to="item.path" class="nav-button">
          <el-icon class="nav-icon">
            <component :is="item.icon" />
          </el-icon>
        </router-link>
      </el-tooltip>

      <!-- 分隔线 -->
      <div class="nav-divider"></div>

      <!-- 用户专区（仅登录后显示） -->
      <template v-if="userStore.isLoggedIn">
        <el-tooltip
          v-for="item in userNavItems"
          :key="item.path"
          :content="item.name"
          placement="left"
          effect="dark"
        >
          <router-link :to="item.path" class="nav-button">
            <el-icon class="nav-icon">
              <component :is="item.icon" />
            </el-icon>
            <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
          </router-link>
        </el-tooltip>

        <!-- 分隔线 -->
        <div class="nav-divider"></div>
      </template>

      <!-- 快捷操作 -->
      <el-tooltip content="搜索" placement="left" effect="dark">
        <button class="nav-button action-button" @click="openSearch">
          <el-icon class="nav-icon"><Search /></el-icon>
        </button>
      </el-tooltip>

      <el-tooltip content="回到顶部" placement="left" effect="dark">
        <button class="nav-button action-button" @click="scrollToTop">
          <el-icon class="nav-icon"><Top /></el-icon>
        </button>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  HomeFilled,
  Reading,
  User,
  DataAnalysis,
  Search,
  Top,
  TrendCharts,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 侧边栏状态
const isHidden = ref(false)

// 鼠标交互定时器
const hideTimer = ref<number | null>(null)

// 快速导航项 - 精简版
const quickNavItems = computed(() => [
  { name: '首页', path: '/', icon: HomeFilled },
  { name: '课程', path: '/courses', icon: Reading },
  { name: '学习路径', path: '/learning-paths', icon: TrendCharts },
])

// 用户专区导航项 - 精简版
const userNavItems = computed(() => [
  {
    name: '学习进度',
    path: '/progress',
    icon: DataAnalysis,
    badge: '3',
  },
  {
    name: '个人中心',
    path: '/profile',
    icon: User,
    badge: null,
  },
])

// 鼠标进入事件
const handleMouseEnter = () => {
  clearHideTimer()
  isHidden.value = false
}

// 鼠标离开事件
const handleMouseLeave = () => {
  startHideTimer()
}

// 开始隐藏计时器
const startHideTimer = () => {
  clearHideTimer()
  hideTimer.value = window.setTimeout(() => {
    isHidden.value = true
  }, 3000) // 3秒后自动隐藏
}

// 清除隐藏计时器
const clearHideTimer = () => {
  if (hideTimer.value) {
    clearTimeout(hideTimer.value)
    hideTimer.value = null
  }
}

// 快捷操作
const openSearch = () => {
  ElMessage.info('搜索功能')
  // 这里可以触发全局搜索组件
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

// 页面滚动处理
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop

  // 滚动时自动显示侧边栏
  if (scrollTop > 200) {
    isHidden.value = false
    clearHideTimer()
    startHideTimer()
  }
}

// 生命周期
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // 初始化时启动隐藏计时器
  startHideTimer()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  clearHideTimer()
})
</script>

<style scoped lang="scss">
.floating-sidebar {
  position: fixed;
  top: 50%;
  right: var(--space-3);
  transform: translateY(-50%);
  z-index: var(--z-modal); // 提升层级，确保显示
  transition: all var(--transition-base);
  opacity: 0.85;

  &:hover {
    opacity: 1;
    transform: translateY(-50%) scale(1.03);
  }

  &.is-hidden {
    transform: translateY(-50%) translateX(calc(100% + var(--space-3)));
    opacity: 0;
    pointer-events: none;
  }
}

.quick-nav-buttons {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  background: rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-lg);
  padding: var(--space-2);
  box-shadow:
    0 6px 24px rgba(31, 38, 135, 0.12),
    0 3px 12px rgba(31, 38, 135, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
  min-width: fit-content;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.08) 0%,
      rgba(255, 255, 255, 0.03) 100%
    );
    border-radius: var(--radius-lg);
    pointer-events: none;
  }
}

.nav-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.4);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  text-decoration: none;
  color: var(--text-secondary);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
    border-radius: var(--radius-lg);
    opacity: 0;
    transition: opacity var(--transition-fast);
  }

  &:hover {
    background: rgba(255, 107, 53, 0.9);
    color: white;
    transform: translateX(-4px) scale(1.08);
    box-shadow:
      0 6px 20px rgba(255, 107, 53, 0.25),
      0 3px 10px rgba(255, 107, 53, 0.15);
    border-color: rgba(255, 255, 255, 0.4);

    &::before {
      opacity: 1;
    }
  }

  &.router-link-active {
    background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-light) 100%);
    color: white;
    box-shadow: 0 4px 16px rgba(255, 107, 53, 0.4);

    .nav-icon {
      color: white;
    }

    &::before {
      opacity: 1;
    }
  }

  &.action-button {
    background: rgba(102, 126, 234, 0.2);

    &:hover {
      background: rgba(102, 126, 234, 0.9);
      box-shadow:
        0 8px 24px rgba(102, 126, 234, 0.3),
        0 4px 12px rgba(102, 126, 234, 0.2);
    }
  }
}

.nav-icon {
  font-size: 18px;
  transition: color var(--transition-fast);
}

.nav-badge {
  position: absolute;
  top: -1px;
  right: -1px;
  background: var(--color-error);
  color: white;
  font-size: 9px;
  font-weight: var(--font-bold);
  padding: 1px 4px;
  border-radius: var(--radius-full);
  min-width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.nav-divider {
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  margin: var(--space-1) 0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 1px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.08) 50%,
      rgba(0, 0, 0, 0) 100%
    );
  }
}

// 响应式设计 - 优化后的精简版
@media (max-width: 1200px) {
  .floating-sidebar {
    right: var(--space-2);

    &.is-hidden {
      transform: translateY(-50%) translateX(calc(100% + var(--space-2)));
    }
  }

  .nav-button {
    width: 34px;
    height: 34px;
  }

  .nav-icon {
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .floating-sidebar {
    right: var(--space-2);
    opacity: 0.9;
  }

  .quick-nav-buttons {
    padding: calc(var(--space-2) - 2px);
    gap: 2px;
  }

  .nav-button {
    width: 32px;
    height: 32px;
  }

  .nav-icon {
    font-size: 15px;
  }

  .nav-badge {
    min-width: 12px;
    height: 12px;
    font-size: 8px;
  }
}

@media (max-width: 480px) {
  .floating-sidebar {
    right: var(--space-1);

    &.is-hidden {
      transform: translateY(-50%) translateX(calc(100% + var(--space-1)));
    }
  }

  .nav-button {
    width: 30px;
    height: 30px;
  }

  .nav-icon {
    font-size: 14px;
  }
}

// 暗模式适配
@media (prefers-color-scheme: dark) {
  .floating-sidebar {
    .quick-nav-buttons {
      background: rgba(30, 30, 30, 0.9);
      border-color: rgba(255, 255, 255, 0.1);
      box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.5),
        0 4px 16px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);

      &::before {
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.05) 0%,
          rgba(255, 255, 255, 0.02) 100%
        );
      }
    }

    .nav-button {
      background: rgba(255, 255, 255, 0.1);
      color: var(--text-inverse);
      border-color: rgba(255, 255, 255, 0.05);

      &.action-button {
        background: rgba(102, 126, 234, 0.2);
      }
    }

    .nav-divider {
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.2) 50%,
        rgba(255, 255, 255, 0) 100%
      );

      &::after {
        background: linear-gradient(
          90deg,
          rgba(0, 0, 0, 0) 0%,
          rgba(0, 0, 0, 0.3) 50%,
          rgba(0, 0, 0, 0) 100%
        );
      }
    }
  }
}
</style>
