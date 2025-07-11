<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { mockBanners, mockCategories, courses, mockInstructors } from '@/data/mockData'

import {
  TrendCharts,
  User,
  Setting,
  Reading,
  Star,
  Medal,
  ChatDotSquare,
  VideoPlay,
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 显示登录对话框方法
const showLoginDialog = () => {
  // 这里可以触发全局登录对话框，或者跳转到登录页面
  router.push('/login')
}

// 使用Mock数据
const bannerList = ref(mockBanners)
const categoriesList = ref(mockCategories)
const coursesList = ref(courses)
const instructorsList = ref(mockInstructors)

// 学习路径数据
const learningPaths = ref([
  {
    id: 1,
    name: '前端开发入门',
    level: '初级',
    coursesCount: 8,
    link: '/learning-paths/frontend-basic',
  },
  {
    id: 2,
    name: 'Vue.js 进阶',
    level: '中级',
    coursesCount: 12,
    link: '/learning-paths/vue-advanced',
  },
  { id: 3, name: '全栈开发', level: '高级', coursesCount: 20, link: '/learning-paths/fullstack' },
  { id: 4, name: '移动端开发', level: '中级', coursesCount: 15, link: '/learning-paths/mobile' },
  { id: 5, name: 'AI/机器学习', level: '高级', coursesCount: 18, link: '/learning-paths/ai-ml' },
])

// 课程标签
const courseTabs = ref([
  { id: 'all', name: '全部' },
  { id: 'frontend', name: '前端' },
  { id: 'backend', name: '后端' },
  { id: 'ai', name: 'AI/大数据' },
  { id: 'mobile', name: '移动开发' },
])

const activeTab = ref('all')

const filteredCourses = computed(() => {
  if (activeTab.value === 'all') {
    return coursesList.value
  }
  return coursesList.value.filter((course) => course.category === activeTab.value)
})

const goToCategory = (path: string) => {
  router.push(path)
}

const goToCourse = (courseId: string) => {
  router.push(`/course/${courseId}`)
}

const goToLink = (link: string) => {
  // 临时显示提示，等对应页面创建后再启用路由跳转
  console.log('点击链接:', link)
  // router.push(link)
}

// 继续学习功能
const continueLearning = (course: { courseId: string; lessonId: string }) => {
  router.push(`/course/${course.courseId}/lesson/${course.lessonId}`)
}

// 获取今日学习目标
const dailyGoal = computed(() => {
  return userStore.user?.learningGoals?.find((goal) => goal.type === 'daily') || null
})

// 获取单位文本
const getUnitText = (unit: string) => {
  const unitMap: Record<string, string> = {
    minutes: '分钟',
    lessons: '课时',
    courses: '门课程',
  }
  return unitMap[unit] || unit
}
</script>

<template>
  <div class="home-view">
    <!-- 轮播图区域 - 三栏布局 -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-layout">
          <!-- 左侧导航栏 -->
          <aside class="left-sidebar">
            <div class="sidebar-section">
              <h3 class="sidebar-title">课程分类</h3>
              <ul class="category-nav">
                <li
                  v-for="category in categoriesList.slice(0, 6)"
                  :key="category.id"
                  class="category-nav-item"
                >
                  <router-link :to="category.path" class="category-link">
                    <el-icon class="category-icon">
                      <component :is="category.icon" />
                    </el-icon>
                    <span class="category-name">{{ category.title }}</span>
                    <span class="category-count">{{ category.coursesCount }}</span>
                  </router-link>
                </li>
              </ul>
            </div>

            <div class="sidebar-section">
              <h3 class="sidebar-title">学习路径</h3>
              <ul class="learning-paths-nav">
                <li v-for="path in learningPaths.slice(0, 4)" :key="path.id" class="path-nav-item">
                  <router-link :to="path.link" class="path-link">
                    <div class="path-info">
                      <span class="path-name">{{ path.name }}</span>
                      <span class="path-level">{{ path.level }}</span>
                    </div>
                    <span class="path-courses">{{ path.coursesCount }}门</span>
                  </router-link>
                </li>
              </ul>
            </div>
          </aside>

          <!-- 中间轮播图 -->
          <div class="center-carousel">
            <el-carousel height="300px" :interval="5000" arrow="hover" indicator-position="inside">
              <el-carousel-item v-for="item in bannerList" :key="item.id">
                <div class="banner-item" @click="goToLink(item.link)">
                  <img :src="item.image" :alt="item.title" class="banner-image-full" />
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>

          <!-- 右侧用户快速跳转面板 -->
          <aside class="right-sidebar">
            <!-- 已登录状态 -->
            <div v-if="userStore.isLoggedIn" class="user-panel">
              <div class="user-welcome">
                <div class="user-avatar">
                  <img :src="userStore.user?.avatar" :alt="userStore.user?.name" />
                </div>
                <div class="user-info">
                  <span class="user-name">{{ userStore.user?.name }}</span>
                  <span class="user-level">学习达人</span>
                </div>
              </div>

              <!-- 继续学习区域 -->
              <div class="continue-learning-panel">
                <h4 class="panel-title">继续学习</h4>
                <div v-if="userStore.user?.recentLearning?.length" class="recent-courses">
                  <div
                    v-for="course in userStore.user.recentLearning.slice(0, 2)"
                    :key="course.courseId"
                    class="recent-course-item"
                    @click="continueLearning(course)"
                  >
                    <div class="course-thumbnail">
                      <img :src="course.courseImage" :alt="course.courseTitle" />
                      <div class="play-overlay">
                        <el-icon><VideoPlay /></el-icon>
                      </div>
                    </div>
                    <div class="course-details">
                      <h5 class="course-title">{{ course.courseTitle }}</h5>
                      <p class="lesson-title">{{ course.lessonTitle }}</p>
                      <div class="course-progress">
                        <el-progress
                          :percentage="course.progress"
                          :show-text="false"
                          stroke-width="4"
                          color="#ff6b35"
                        />
                        <span class="progress-text"
                          >{{ course.completedLessons }}/{{ course.totalLessons }}课时</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="no-recent-learning">
                  <p>还没有学习记录</p>
                  <el-button type="primary" size="small" @click="router.push('/courses')">
                    开始学习
                  </el-button>
                </div>
              </div>

              <!-- 今日学习目标 -->
              <div class="daily-goal-panel">
                <h4 class="panel-title">今日目标</h4>
                <div v-if="dailyGoal" class="goal-content">
                  <div class="goal-progress">
                    <div class="goal-ring">
                      <el-progress
                        type="circle"
                        :percentage="(dailyGoal.current / dailyGoal.target) * 100"
                        :width="60"
                        :stroke-width="6"
                        color="#67C23A"
                      />
                    </div>
                    <div class="goal-details">
                      <div class="goal-text">
                        <span class="current">{{ dailyGoal.current }}</span>
                        <span class="separator">/</span>
                        <span class="target">{{ dailyGoal.target }}</span>
                        <span class="unit">{{ getUnitText(dailyGoal.unit) }}</span>
                      </div>
                      <p class="goal-title">{{ dailyGoal.title }}</p>
                    </div>
                  </div>
                  <div class="streak-info">
                    <span class="streak-icon">🔥</span>
                    <span class="streak-text"
                      >连续学习
                      {{ userStore.user?.learningProgress?.consecutiveDays || 0 }} 天</span
                    >
                  </div>
                </div>
              </div>

              <!-- 学习成就 -->
              <div class="achievements-panel">
                <h4 class="panel-title">学习成就</h4>
                <div class="achievements-grid">
                  <div
                    v-for="achievement in userStore.user?.achievements?.slice(0, 3)"
                    :key="achievement.id"
                    class="achievement-item"
                    :class="{ earned: achievement.earnedDate }"
                  >
                    <div class="achievement-icon">{{ achievement.icon }}</div>
                    <div class="achievement-info">
                      <span class="achievement-title">{{ achievement.title }}</span>
                      <div
                        v-if="achievement.progress && achievement.target"
                        class="achievement-progress"
                      >
                        <el-progress
                          :percentage="(achievement.progress / achievement.target) * 100"
                          :show-text="false"
                          stroke-width="3"
                          color="#F56C6C"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 快速操作 -->
              <div class="quick-actions-panel">
                <div class="action-buttons">
                  <router-link to="/progress" class="action-btn">
                    <el-icon><TrendCharts /></el-icon>
                    <span>学习进度</span>
                  </router-link>
                  <router-link to="/profile" class="action-btn">
                    <el-icon><User /></el-icon>
                    <span>个人中心</span>
                  </router-link>
                  <router-link to="/courses" class="action-btn">
                    <el-icon><Reading /></el-icon>
                    <span>全部课程</span>
                  </router-link>
                  <router-link to="/settings" class="action-btn">
                    <el-icon><Setting /></el-icon>
                    <span>设置</span>
                  </router-link>
                </div>
              </div>
            </div>

            <!-- 未登录状态 -->
            <div v-else class="login-panel">
              <div class="login-prompt">
                <h3>欢迎来到学习系统</h3>
                <p>登录后享受个性化学习体验</p>
                <el-button type="primary" size="large" @click="showLoginDialog">立即登录</el-button>
              </div>

              <div class="feature-list">
                <h4 class="panel-title">登录后您可以</h4>
                <ul class="features">
                  <li class="feature-item">
                    <el-icon><TrendCharts /></el-icon>
                    <span>追踪学习进度</span>
                  </li>
                  <li class="feature-item">
                    <el-icon><Star /></el-icon>
                    <span>收藏喜欢的课程</span>
                  </li>
                  <li class="feature-item">
                    <el-icon><Medal /></el-icon>
                    <span>获得学习证书</span>
                  </li>
                  <li class="feature-item">
                    <el-icon><ChatDotSquare /></el-icon>
                    <span>与讲师互动交流</span>
                  </li>
                </ul>
              </div>

              <div class="popular-courses">
                <h4 class="panel-title">热门推荐</h4>
                <div class="popular-list">
                  <div
                    v-for="course in coursesList.slice(0, 3)"
                    :key="course.id"
                    class="popular-item"
                    @click="goToCourse(course.id)"
                  >
                    <img :src="course.image" :alt="course.title" class="popular-image" />
                    <div class="popular-info">
                      <h5 class="popular-title">{{ course.title }}</h5>
                      <p class="popular-price">¥{{ course.price }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <!-- 学习分类导航 -->
    <section class="categories-section">
      <div class="container">
        <h2 class="section-title">免费学习</h2>
        <div class="categories-grid">
          <div
            v-for="category in categoriesList"
            :key="category.id"
            class="category-item"
            @click="goToCategory(category.path)"
          >
            <div class="category-icon">
              <component :is="category.icon" />
            </div>
            <h3 class="category-title">{{ category.title }}</h3>
            <p class="category-desc">{{ category.description }}</p>
            <div class="category-stats">
              <span>{{ category.coursesCount }}门课程</span>
              <span>{{ category.studentsCount }}人学习</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 推荐课程 -->
    <section class="courses-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">为你推荐</h2>
          <div class="section-tabs">
            <span
              v-for="tab in courseTabs"
              :key="tab.id"
              class="tab-item"
              :class="{ active: activeTab === tab.id }"
              @click="activeTab = tab.id"
            >
              {{ tab.name }}
            </span>
          </div>
        </div>
        <div class="courses-grid">
          <div
            v-for="course in filteredCourses"
            :key="course.id"
            class="course-card"
            @click="goToCourse(course.id)"
          >
            <div class="course-image">
              <img :src="course.image" :alt="course.title" />
              <div class="course-badge" v-if="course.badge">{{ course.badge }}</div>
            </div>
            <div class="course-content">
              <h3 class="course-title">{{ course.title }}</h3>
              <p class="course-desc">{{ course.description }}</p>
              <div class="course-instructor">
                <img
                  :src="course.instructor.avatar"
                  :alt="course.instructor.name"
                  class="instructor-avatar"
                />
                <span class="instructor-name">{{ course.instructor.name }}</span>
              </div>
              <div class="course-footer">
                <div class="course-price">
                  <span class="current-price">¥{{ course.price }}</span>
                  <span class="original-price" v-if="course.originalPrice"
                    >¥{{ course.originalPrice }}</span
                  >
                </div>
                <div class="course-stats">
                  <span class="students-count">{{ course.studentsCount }}人已学</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 名师介绍 -->
    <section class="instructors-section">
      <div class="container">
        <h2 class="section-title text-center">名师介绍</h2>
        <div class="instructors-grid">
          <div v-for="instructor in instructorsList" :key="instructor.id" class="instructor-card">
            <div class="instructor-avatar">
              <img :src="instructor.avatar" :alt="instructor.name" />
            </div>
            <div class="instructor-info">
              <h3 class="instructor-name">{{ instructor.name }}</h3>
              <p class="instructor-title">{{ instructor.title }}</p>
              <p class="instructor-desc">{{ instructor.description }}</p>
              <div class="instructor-stats">
                <span class="stat-item">{{ instructor.coursesCount }}门课程</span>
                <span class="stat-item">{{ instructor.studentsCount }}学员</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.home-view {
  // 首页使用统一的宽屏容器样式
  .container {
    max-width: var(--container-max-width) !important;
    margin: 0 auto !important;
    padding: 0 var(--container-padding) !important;
  }

  .hero-section {
    background: var(--background-light);

    .hero-layout {
      display: grid;
      grid-template-columns: 280px 1fr 320px; /* 压缩两侧边栏，为宽屏轮播图提供更多展示空间 */
      gap: 24px;
      padding: 24px;
      min-height: 300px;
      max-width: var(--container-max-width); /* 使用统一的宽屏容器宽度 */
      margin: 0 auto;
    }

    .left-sidebar,
    .right-sidebar {
      background: var(--bg-primary);
      border-radius: 12px;
      padding: 12px;
      border: 1px solid var(--border-primary);
      height: fit-content;
      max-height: 400px;
      overflow-y: auto;
    }

    .center-carousel {
      /* 中间轮播图占据中间位置 */
    }

    .banner-item {
      height: 300px;
      border-radius: 12px;
      margin: 0 8px;
      overflow: hidden;
      cursor: pointer;
      transition: transform var(--transition-base);

      &:hover {
        transform: scale(1.02);
      }

      .banner-image-full {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 12px;
      }
    }

    .sidebar-section {
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }

      .sidebar-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 8px;
      }
    }

    .category-nav {
      list-style: none;
      padding: 0;
      margin: 0;

      .category-nav-item {
        margin-bottom: 4px;

        .category-link {
          display: flex;
          align-items: center;
          padding: 6px 8px;
          border-radius: 6px;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.2s ease;

          &:hover {
            background-color: var(--bg-secondary);
            color: var(--text-primary);
          }

          .category-icon {
            font-size: 16px;
            margin-right: 6px;
            color: var(--primary);
          }

          .category-name {
            font-size: 13px;
            font-weight: 500;
            flex: 1;
          }

          .category-count {
            font-size: 11px;
            color: var(--text-tertiary);
            background-color: var(--bg-secondary);
            padding: 1px 4px;
            border-radius: 6px;
          }
        }
      }
    }

    .learning-paths-nav {
      list-style: none;
      padding: 0;
      margin: 0;

      .path-nav-item {
        margin-bottom: 4px;

        .path-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 8px;
          border-radius: 6px;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.2s ease;

          &:hover {
            background-color: var(--bg-secondary);
            color: var(--text-primary);
          }

          .path-info {
            .path-name {
              font-size: 13px;
              font-weight: 500;
              margin-bottom: 1px;
              display: block;
            }
            .path-level {
              font-size: 11px;
              color: var(--primary);
            }
          }

          .path-courses {
            font-size: 11px;
            color: var(--text-tertiary);
          }
        }
      }
    }

    .user-panel {
      .user-welcome {
        display: flex;
        align-items: center;
        margin-bottom: 16px;

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 10px;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 8px;

          .user-name {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);
          }
          .user-level {
            font-size: 11px;
            color: var(--primary);
            background: var(--bg-secondary);
            padding: 2px 6px;
            border-radius: 10px;
          }
        }
      }

      .quick-actions-panel {
        margin-bottom: 16px;

        .panel-title {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--text-primary);
        }

        .action-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;

          .action-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 8px 6px;
            border-radius: 6px;
            color: var(--text-secondary);
            text-decoration: none;
            transition: all 0.2s ease;
            font-size: 12px;

            &:hover {
              background-color: var(--bg-secondary);
              color: var(--text-primary);
            }

            .el-icon {
              font-size: 16px;
              margin-bottom: 4px;
              color: var(--primary);
            }

            span {
              font-size: 11px;
            }
          }
        }
      }

      .learning-progress {
        .panel-title {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--text-primary);
        }

        .progress-info {
          .progress-bar {
            width: 100%;
            height: 6px;
            background-color: var(--bg-secondary);
            border-radius: 3px;
            overflow: hidden;
            margin-bottom: 6px;

            .progress-fill {
              height: 100%;
              background: linear-gradient(to right, var(--primary), var(--secondary));
              border-radius: 3px;
            }
          }

          .progress-text {
            font-size: 11px;
            color: var(--text-tertiary);
          }
        }
      }

      // 继续学习面板
      .continue-learning-panel {
        margin-bottom: 16px;

        .panel-title {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--text-primary);
        }

        .recent-courses {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .recent-course-item {
          display: flex;
          gap: 8px;
          padding: 8px;
          background: var(--bg-secondary);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            background: var(--background-light);
            transform: translateY(-1px);
          }

          .course-thumbnail {
            position: relative;
            width: 40px;
            height: 30px;
            border-radius: 4px;
            overflow: hidden;
            flex-shrink: 0;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .play-overlay {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              opacity: 0;
              transition: opacity 0.2s ease;

              .el-icon {
                color: white;
                font-size: 12px;
              }
            }

            &:hover .play-overlay {
              opacity: 1;
            }
          }

          .course-details {
            flex: 1;
            min-width: 0;

            .course-title {
              font-size: 12px;
              font-weight: 600;
              margin: 0 0 2px 0;
              color: var(--text-primary);
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .lesson-title {
              font-size: 10px;
              color: var(--text-secondary);
              margin: 0 0 4px 0;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .course-progress {
              display: flex;
              align-items: center;
              gap: 4px;

              :deep(.el-progress) {
                flex: 1;
                .el-progress-bar__outer {
                  height: 3px;
                  background-color: var(--border-light);
                }
              }

              .progress-text {
                font-size: 9px;
                color: var(--text-secondary);
                white-space: nowrap;
              }
            }
          }
        }

        .no-recent-learning {
          text-align: center;
          padding: 16px;
          color: var(--text-secondary);

          p {
            margin: 0 0 8px 0;
            font-size: 12px;
          }
        }
      }

      // 今日学习目标面板
      .daily-goal-panel {
        margin-bottom: 16px;

        .panel-title {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--text-primary);
        }

        .goal-content {
          .goal-progress {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;

            .goal-ring {
              flex-shrink: 0;
            }

            .goal-details {
              flex: 1;

              .goal-text {
                display: flex;
                align-items: baseline;
                gap: 2px;
                margin-bottom: 2px;

                .current {
                  font-size: 16px;
                  font-weight: bold;
                  color: var(--primary-color);
                }

                .separator {
                  font-size: 12px;
                  color: var(--text-secondary);
                }

                .target {
                  font-size: 12px;
                  color: var(--text-secondary);
                }

                .unit {
                  font-size: 10px;
                  color: var(--text-secondary);
                }
              }

              .goal-title {
                font-size: 10px;
                color: var(--text-secondary);
                margin: 0;
              }
            }
          }

          .streak-info {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 6px 8px;
            background: linear-gradient(135deg, #ff9a56 0%, #ff6b35 100%);
            border-radius: 4px;
            color: white;

            .streak-icon {
              font-size: 12px;
            }

            .streak-text {
              font-size: 10px;
              font-weight: 500;
            }
          }
        }
      }

      // 学习成就面板
      .achievements-panel {
        margin-bottom: 16px;

        .panel-title {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--text-primary);
        }

        .achievements-grid {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .achievement-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 8px;
          background: var(--bg-secondary);
          border-radius: 4px;
          opacity: 0.6;
          transition: all 0.2s ease;

          &.earned {
            opacity: 1;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;

            .achievement-icon {
              filter: none;
            }

            .achievement-title {
              color: white;
            }
          }

          .achievement-icon {
            font-size: 16px;
            filter: grayscale(1);
          }

          .achievement-info {
            flex: 1;
            min-width: 0;

            .achievement-title {
              font-size: 11px;
              font-weight: 500;
              margin-bottom: 2px;
              color: var(--text-primary);
            }

            .achievement-progress {
              :deep(.el-progress-bar__outer) {
                height: 2px;
                background-color: rgba(255, 255, 255, 0.3);
              }
            }
          }
        }
      }
    }

    .login-panel {
      .login-prompt {
        text-align: center;
        padding: 20px 12px;

        h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--text-primary);
        }
        p {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 16px;
        }
        .el-button {
          padding: 10px 20px;
          font-size: 14px;
          border-radius: 20px;
        }
      }

      .feature-list {
        .panel-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
          color: var(--text-primary);
        }

        .features {
          list-style: none;
          padding: 0;
          margin: 0;

          .feature-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px;

            .el-icon {
              font-size: 20px;
              margin-right: 12px;
              color: var(--primary-color);
            }

            span {
              font-size: 16px;
              color: var(--text-primary);
            }
          }
        }
      }

      .popular-courses {
        .panel-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
          color: var(--text-primary);
        }

        .popular-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;

          .popular-item {
            cursor: pointer;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid var(--border-color);
            transition: all 0.3s ease;

            &:hover {
              transform: translateY(-4px);
              box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
            }

            .popular-image {
              width: 100%;
              height: 100px;
              object-fit: cover;
            }

            .popular-info {
              padding: 12px;

              .popular-title {
                font-size: 14px;
                font-weight: 500;
                color: var(--text-primary);
                margin-bottom: 4px;
              }
              .popular-price {
                font-size: 16px;
                font-weight: 600;
                color: var(--primary-color);
              }
            }
          }
        }
      }
    }
  }

  .categories-section {
    padding: 80px 0;

    .section-title {
      text-align: center;
      font-size: 32px;
      font-weight: 600;
      margin-bottom: 48px;
      color: var(--text-primary);
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;

      .category-item {
        background: var(--background-color);
        border-radius: 16px;
        padding: 32px 24px;
        text-align: center;
        border: 1px solid var(--border-color);
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(255, 107, 53, 0.15);
          border-color: var(--primary-color);
        }

        .category-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: white;
          font-size: 28px;
        }

        .category-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--text-primary);
        }

        .category-desc {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 12px;
        }

        .category-stats {
          display: flex;
          justify-content: center;
          gap: 16px;
          font-size: 12px;
          color: var(--text-light);
        }
      }
    }
  }

  .courses-section {
    padding: 80px 0;
    background: var(--background-light);

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 48px;

      .section-title {
        font-size: 32px;
        font-weight: 600;
        color: var(--text-primary);
      }

      .section-tabs {
        display: flex;
        gap: 24px;

        .tab-item {
          padding: 8px 16px;
          font-size: 16px;
          color: var(--text-secondary);
          cursor: pointer;
          border-radius: 20px;
          transition: all 0.3s ease;

          &:hover,
          &.active {
            color: var(--primary-color);
            background: rgba(255, 107, 53, 0.1);
          }
        }
      }
    }

    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;

      .course-card {
        background: var(--background-color);
        border-radius: 16px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 1px solid var(--border-color);

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        }

        .course-image {
          position: relative;
          height: 180px;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .course-badge {
            position: absolute;
            top: 12px;
            left: 12px;
            background: var(--primary-color);
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
          }
        }

        .course-content {
          padding: 20px;

          .course-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 8px;
            color: var(--text-primary);
            line-height: 1.4;
          }

          .course-desc {
            font-size: 14px;
            color: var(--text-secondary);
            margin-bottom: 16px;
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .course-instructor {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 16px;

            .instructor-avatar {
              width: 24px;
              height: 24px;
              border-radius: 50%;
              object-fit: cover;
            }

            .instructor-name {
              font-size: 14px;
              color: var(--text-secondary);
            }
          }

          .course-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .course-price {
              .current-price {
                font-size: 20px;
                font-weight: 600;
                color: var(--primary-color);
                margin-right: 8px;
              }

              .original-price {
                font-size: 14px;
                color: var(--text-light);
                text-decoration: line-through;
              }
            }

            .course-stats {
              .students-count {
                font-size: 12px;
                color: var(--text-light);
              }
            }
          }
        }
      }
    }
  }

  .instructors-section {
    padding: 80px 0;

    .section-title {
      font-size: 32px;
      font-weight: 600;
      margin-bottom: 48px;
      color: var(--text-primary);
    }

    .instructors-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;

      .instructor-card {
        background: var(--background-color);
        border-radius: 16px;
        padding: 24px;
        text-align: center;
        border: 1px solid var(--border-color);
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        }

        .instructor-avatar {
          margin-bottom: 16px;

          img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
          }
        }

        .instructor-info {
          .instructor-name {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 4px;
            color: var(--text-primary);
          }

          .instructor-title {
            font-size: 14px;
            color: var(--primary-color);
            margin-bottom: 12px;
            font-weight: 500;
          }

          .instructor-desc {
            font-size: 14px;
            color: var(--text-secondary);
            line-height: 1.5;
            margin-bottom: 16px;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .instructor-stats {
            display: flex;
            justify-content: center;
            gap: 16px;

            .stat-item {
              font-size: 12px;
              color: var(--text-light);
            }
          }
        }
      }
    }
  }
}

// 响应式设计 - 针对紧凑型轮播图布局优化
@media (max-width: 1800px) {
  .home-view {
    .hero-section {
      .hero-layout {
        grid-template-columns: 260px 1fr 300px; /* 大屏幕保持紧凑比例 */
        gap: 20px;
        padding: 20px;
        min-height: 280px;
      }
    }
  }
}

@media (max-width: 1400px) {
  .home-view {
    .container {
      max-width: 1600px !important;
    }

    .hero-section {
      .hero-layout {
        grid-template-columns: 240px 1fr 280px; /* 中等屏幕进一步压缩 */
        gap: 18px;
        padding: 18px;
        min-height: 260px;
      }
    }
  }
}

@media (max-width: 1200px) {
  .home-view {
    .container {
      max-width: 1200px !important;
    }

    .hero-section {
      .hero-layout {
        grid-template-columns: 220px 1fr 260px; /* 较小屏幕维持紧凑布局 */
        gap: 16px;
        padding: 16px;
        min-height: 240px;
      }

      .left-sidebar,
      .right-sidebar {
        padding: 10px;
        max-height: 240px;
      }
    }
  }
}

@media (max-width: 1024px) {
  .home-view {
    .hero-section {
      .hero-layout {
        display: block;
        padding: 16px;
      }

      .left-sidebar,
      .right-sidebar {
        margin-bottom: 16px;
        max-height: none;
      }
    }

    .categories-section,
    .courses-section,
    .instructors-section {
      padding: 40px 0;

      .section-title {
        font-size: 24px;
        margin-bottom: 32px;
      }
    }

    .courses-section {
      .section-header {
        flex-direction: column;
        gap: 16px;

        .section-tabs {
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .home-view {
    .hero-section {
      .hero-layout {
        padding: 12px;
      }

      .left-sidebar,
      .right-sidebar {
        padding: 12px;
      }

      .banner-item {
        .banner-content {
          flex-direction: column;
          text-align: center;
          padding: 30px 16px;

          .banner-text {
            .banner-title {
              font-size: 28px;
              margin-bottom: 12px;
            }

            .banner-subtitle {
              font-size: 14px;
              margin-bottom: 16px;
            }

            .banner-price {
              margin-bottom: 24px;

              .current-price {
                font-size: 24px;
              }

              .original-price {
                font-size: 14px;
              }
            }

            .banner-btn {
              padding: 12px 24px;
              font-size: 14px;
            }
          }

          .banner-image {
            margin-left: 0;
            margin-top: 16px;

            img {
              width: 180px;
              height: 120px;
            }
          }
        }
      }
    }

    .categories-section,
    .courses-section,
    .instructors-section {
      padding: 32px 0;

      .section-title {
        font-size: 20px;
        margin-bottom: 24px;
      }
    }

    .courses-section {
      .section-header {
        flex-direction: column;
        gap: 12px;

        .section-tabs {
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;

          .tab-item {
            padding: 6px 12px;
            font-size: 14px;
          }
        }
      }

      .courses-grid {
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 16px;
      }
    }

    .categories-section {
      .categories-grid {
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 16px;
      }
    }

    .instructors-section {
      .instructors-grid {
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 16px;
      }
    }
  }
}

// 超小屏幕优化
@media (max-width: 480px) {
  .home-view {
    .hero-section {
      .hero-layout {
        padding: 8px;
      }

      .left-sidebar,
      .right-sidebar {
        padding: 12px;

        .sidebar-title {
          font-size: 14px;
        }

        .category-nav-item .category-link {
          padding: 6px 8px;

          .category-name {
            font-size: 12px;
          }

          .category-count {
            font-size: 10px;
          }
        }

        .path-nav-item .path-link {
          padding: 6px 8px;

          .path-name {
            font-size: 12px;
          }

          .path-level {
            font-size: 10px;
          }
        }
      }

      .banner-item {
        .banner-content {
          padding: 20px 12px;

          .banner-text {
            .banner-title {
              font-size: 24px;
            }

            .banner-subtitle {
              font-size: 12px;
            }
          }
        }
      }
    }

    .categories-section,
    .courses-section,
    .instructors-section {
      padding: 24px 0;

      .section-title {
        font-size: 18px;
        margin-bottom: 20px;
      }
    }

    .courses-section {
      .courses-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }
    }

    .categories-section {
      .categories-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }
    }

    .instructors-section {
      .instructors-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }
    }
  }
}
</style>
