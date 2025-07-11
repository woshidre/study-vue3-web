<template>
  <div class="profile-view">
    <div class="profile-container">
      <!-- 用户档案头部 -->
      <div class="profile-header">
        <!-- 个人成长装饰元素 -->
        <div class="header-decorations">
          <div class="decoration-item growth-icon icon-1">📈</div>
          <div class="decoration-item growth-icon icon-2">🎯</div>

          <div class="decoration-item achievement-bubble bubble-1">学习达人</div>
          <div class="decoration-item achievement-bubble bubble-2">持续成长</div>
        </div>

        <div class="user-info-section">
          <div class="user-avatar-area">
            <div class="avatar-container">
              <img :src="userStore.user?.avatar || '/placeholder-avatar.jpg'" alt="用户头像" />
              <div class="status-indicator online"></div>
            </div>
          </div>

          <div class="user-details">
            <h1 class="user-name">{{ userStore.user?.name || '演示用户' }}</h1>
            <p class="user-title">{{ userStore.user?.title || '学习者' }}</p>
            <div class="user-meta">
              <div class="meta-item">
                <el-icon><Calendar /></el-icon>
                <span>加入时间：{{ formatDate(userStore.user?.joinDate || '2024-01-01') }}</span>
              </div>
              <div class="meta-item">
                <el-icon><Location /></el-icon>
                <span>{{ userStore.user?.location || '北京' }}</span>
              </div>
            </div>
            <div class="user-bio">
              {{ userStore.user?.bio || '热爱学习，持续成长的终身学习者' }}
            </div>
          </div>

          <!-- 学习成果展示 -->
          <div class="achievement-showcase">
            <div class="stats-cards">
              <div class="stat-card primary">
                <div class="stat-icon">
                  <el-icon><Reading /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ userStats.completedCourses }}</div>
                  <div class="stat-label">完成课程</div>
                </div>
              </div>

              <div class="stat-card secondary">
                <div class="stat-icon">
                  <el-icon><Timer /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ userStats.totalStudyTime }}</div>
                  <div class="stat-label">学习时长(小时)</div>
                </div>
              </div>

              <div class="stat-card success">
                <div class="stat-icon">
                  <el-icon><Medal /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ userStats.certificates }}</div>
                  <div class="stat-label">获得证书</div>
                </div>
              </div>

              <div class="stat-card warning">
                <div class="stat-icon">
                  <el-icon><EditPen /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ userStats.studyNotes }}</div>
                  <div class="stat-label">学习笔记</div>
                </div>
              </div>
            </div>

            <div class="quick-actions">
              <el-button type="primary" size="large" @click="continueLearning">
                <el-icon><Reading /></el-icon>
                继续学习
              </el-button>
              <el-button size="large" @click="viewLearningProgress">
                <el-icon><TrendCharts /></el-icon>
                学习分析
              </el-button>
              <el-button size="large" @click="editProfile">
                <el-icon><Setting /></el-icon>
                编辑资料
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="profile-content">
        <!-- 学习历程 -->
        <div class="content-section">
          <div class="section-header">
            <h2>最近活动</h2>
            <el-button text type="primary" @click="viewAllActivities">查看全部</el-button>
          </div>

          <div class="recent-activities">
            <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
              <div class="activity-icon" :class="activity.type">
                <el-icon>
                  <component :is="activity.icon" />
                </el-icon>
              </div>
              <div class="activity-content">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-desc">{{ activity.description }}</div>
                <div class="activity-time">{{ formatTime(activity.time) }}</div>
              </div>
              <div class="activity-badge" v-if="activity.badge">
                <el-tag :type="activity.badge.type" size="small">{{ activity.badge.text }}</el-tag>
              </div>
            </div>
          </div>
        </div>

        <!-- 成就亮点 -->
        <div class="content-section">
          <div class="section-header">
            <h2>成就亮点</h2>
            <el-button text type="primary" @click="viewAllAchievements">查看全部</el-button>
          </div>

          <div class="achievement-highlights">
            <div
              v-for="achievement in highlightAchievements"
              :key="achievement.id"
              class="achievement-card"
            >
              <div class="achievement-icon">
                <el-icon>
                  <component :is="achievement.icon" />
                </el-icon>
              </div>
              <div class="achievement-info">
                <h4>{{ achievement.title }}</h4>
                <p>{{ achievement.description }}</p>
                <div class="achievement-date">{{ formatDate(achievement.unlockedAt) }}</div>
              </div>
              <div class="achievement-level">
                <el-tag
                  :type="
                    achievement.level === 'gold'
                      ? 'warning'
                      : achievement.level === 'silver'
                        ? 'info'
                        : 'success'
                  "
                >
                  {{ achievement.levelText }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>

        <!-- 学习轨迹 -->
        <div class="content-section">
          <div class="section-header">
            <h2>学习轨迹</h2>
          </div>

          <div class="learning-timeline">
            <div v-for="item in learningTimeline" :key="item.id" class="timeline-item">
              <div class="timeline-dot" :class="item.type"></div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <h4>{{ item.title }}</h4>
                  <span class="timeline-date">{{ formatDate(item.date) }}</span>
                </div>
                <p>{{ item.description }}</p>
                <div class="timeline-stats" v-if="item.stats">
                  <span v-for="stat in item.stats" :key="stat.label" class="stat-item">
                    {{ stat.label }}: {{ stat.value }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import {
  Calendar,
  Location,
  Reading,
  Timer,
  Medal,
  EditPen,
  Setting,
  TrendCharts,
  Trophy,
  Star,
  DocumentChecked,
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 用户统计数据
const userStats = ref({
  completedCourses: 12,
  totalStudyTime: 156,
  certificates: 8,
  studyNotes: 24,
})

// 最近活动
const recentActivities = ref([
  {
    id: '1',
    type: 'course',
    icon: 'Reading',
    title: '完成课程《Vue3 实战开发》',
    description: '恭喜您完成了Vue3框架的系统学习',
    time: '2024-12-28 10:30',
    badge: { type: 'success', text: '已完成' },
  },
  {
    id: '2',
    type: 'achievement',
    icon: 'Trophy',
    title: '获得成就"连续学习者"',
    description: '连续学习7天，养成良好学习习惯',
    time: '2024-12-27 20:15',
    badge: { type: 'warning', text: '新成就' },
  },
  {
    id: '3',
    type: 'certificate',
    icon: 'Medal',
    title: '获得结业证书',
    description: '《JavaScript高级编程》课程结业证书',
    time: '2024-12-26 16:45',
    badge: { type: 'success', text: '证书' },
  },
  {
    id: '4',
    type: 'note',
    icon: 'EditPen',
    title: '发布学习笔记',
    description: '《React Hooks 最佳实践》学习总结',
    time: '2024-12-25 14:20',
  },
])

// 成就亮点
const highlightAchievements = ref([
  {
    id: '1',
    icon: 'Trophy',
    title: '学习达人',
    description: '累计学习超过100小时',
    unlockedAt: '2024-12-20',
    level: 'gold',
    levelText: '金牌',
  },
  {
    id: '2',
    icon: 'Star',
    title: '知识探索者',
    description: '完成5个不同领域的课程',
    unlockedAt: '2024-12-15',
    level: 'silver',
    levelText: '银牌',
  },
  {
    id: '3',
    icon: 'DocumentChecked',
    title: '笔记专家',
    description: '发布学习笔记超过20篇',
    unlockedAt: '2024-12-10',
    level: 'bronze',
    levelText: '铜牌',
  },
])

// 学习轨迹
const learningTimeline = ref([
  {
    id: '1',
    type: 'milestone',
    title: '前端开发进阶',
    description: '完成Vue.js生态系统的全面学习',
    date: '2024-12-28',
    stats: [
      { label: '完成课程', value: '3门' },
      { label: '学习时长', value: '45小时' },
    ],
  },
  {
    id: '2',
    type: 'course',
    title: 'React 开发实战',
    description: '掌握React hooks和状态管理',
    date: '2024-12-15',
    stats: [
      { label: '课程进度', value: '100%' },
      { label: '实战项目', value: '2个' },
    ],
  },
  {
    id: '3',
    type: 'start',
    title: '开始前端学习之旅',
    description: '注册学习平台，开始系统性学习',
    date: '2024-10-01',
  },
])

// 方法
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const formatTime = (timeString: string) => {
  return new Date(timeString).toLocaleString('zh-CN')
}

const continueLearning = () => {
  router.push('/courses')
}

const viewLearningProgress = () => {
  router.push('/progress')
}

const editProfile = () => {
  router.push('/settings')
}

const viewAllActivities = () => {
  ElMessage.info('查看全部活动功能开发中...')
}

const viewAllAchievements = () => {
  router.push('/progress')
}

onMounted(() => {
  // 初始化用户数据
  if (userStore.user) {
    // 可以根据实际用户数据更新统计信息
  }
})
</script>

<style scoped lang="scss">
.profile-view {
  min-height: calc(100vh - 64px);
  background: var(--background-light);

  .profile-container {
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: 24px;
  }
}

.profile-header {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 50px 40px;
  margin-bottom: 32px;
  color: white;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);

  // 个人成长主题装饰背景
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background:
      radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.06) 0%, transparent 50%);
    animation: profileFloat 18s ease-in-out infinite;
    z-index: 1;
    will-change: transform;
  }

  // 成长轨迹网格
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    z-index: 1;
  }

  // 个人成长装饰元素
  .header-decorations {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    pointer-events: none;

    .decoration-item {
      position: absolute;
      opacity: 0.7;

      &.growth-icon {
        width: 35px;
        height: 35px;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255, 255, 255, 0.15);
        font-size: 18px;
        will-change: transform;

        &.icon-1 {
          top: 25%;
          left: 45%;
          animation: growthPulse 4s ease-in-out infinite;
        }

        &.icon-2 {
          bottom: 30%;
          left: 40%;
          animation: growthPulse 5s ease-in-out infinite 1s;
        }
      }

      &.achievement-bubble {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 10px;
        padding: 8px 14px;
        font-size: 13px;
        font-weight: 500;
        backdrop-filter: blur(12px);
        will-change: transform;

        &.bubble-1 {
          top: 20%;
          left: 50%;
          transform: rotate(-3deg);
          animation: achievementFloat 6s ease-in-out infinite;
        }

        &.bubble-2 {
          bottom: 25%;
          left: 55%;
          transform: rotate(2deg);
          animation: achievementFloat 7s ease-in-out infinite 1.5s;
        }
      }
    }
  }

  .user-info-section {
    display: flex;
    gap: 32px;
    align-items: flex-start;
    position: relative;
    z-index: 10;

    .user-avatar-area {
      .avatar-container {
        position: relative;

        img {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid rgba(255, 255, 255, 0.2);
        }

        .status-indicator {
          position: absolute;
          bottom: 8px;
          right: 8px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid white;

          &.online {
            background: #4caf50;
          }
        }
      }
    }

    .user-details {
      flex: 1;

      .user-name {
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 8px;
        background: linear-gradient(45deg, #fff, #e3f2fd);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .user-title {
        font-size: 18px;
        opacity: 0.9;
        margin-bottom: 16px;
      }

      .user-meta {
        display: flex;
        gap: 24px;
        margin-bottom: 16px;

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          opacity: 0.8;
        }
      }

      .user-bio {
        font-size: 16px;
        line-height: 1.6;
        opacity: 0.9;
        max-width: 600px;
      }
    }

    .achievement-showcase {
      .stats-cards {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        margin-bottom: 24px;

        .stat-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;

          .stat-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
          }

          &.primary .stat-icon {
            background: linear-gradient(135deg, #ff6b35, #ff8c42);
          }

          &.secondary .stat-icon {
            background: linear-gradient(135deg, #4facfe, #00f2fe);
          }

          &.success .stat-icon {
            background: linear-gradient(135deg, #43e97b, #38f9d7);
          }

          &.warning .stat-icon {
            background: linear-gradient(135deg, #fa709a, #fee140);
          }

          .stat-content {
            .stat-number {
              font-size: 24px;
              font-weight: 700;
              line-height: 1;
              margin-bottom: 4px;
            }

            .stat-label {
              font-size: 12px;
              opacity: 0.8;
            }
          }
        }
      }

      .quick-actions {
        display: flex;
        gap: 12px;

        .el-button {
          border-radius: 24px;
          padding: 12px 24px;
          font-weight: 500;
        }
      }
    }
  }
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 24px;

  .content-section {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      h2 {
        font-size: 20px;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
      }
    }
  }
}

.recent-activities {
  .activity-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 0;
    border-bottom: 1px solid var(--border-color);

    &:last-child {
      border-bottom: none;
    }

    .activity-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;

      &.course {
        background: linear-gradient(135deg, #667eea, #764ba2);
      }

      &.achievement {
        background: linear-gradient(135deg, #f093fb, #f5576c);
      }

      &.certificate {
        background: linear-gradient(135deg, #4facfe, #00f2fe);
      }

      &.note {
        background: linear-gradient(135deg, #43e97b, #38f9d7);
      }
    }

    .activity-content {
      flex: 1;

      .activity-title {
        font-size: 16px;
        font-weight: 500;
        color: var(--text-primary);
        margin-bottom: 4px;
      }

      .activity-desc {
        font-size: 14px;
        color: var(--text-secondary);
        margin-bottom: 4px;
      }

      .activity-time {
        font-size: 12px;
        color: var(--text-light);
      }
    }

    .activity-badge {
      flex-shrink: 0;
    }
  }
}

.achievement-highlights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;

  .achievement-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    transition: all 0.3s ease;

    &:hover {
      border-color: var(--primary-color);
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .achievement-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, #ffd700, #ffed4e);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #b8860b;
      font-size: 20px;
    }

    .achievement-info {
      flex: 1;

      h4 {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 4px;
      }

      p {
        font-size: 14px;
        color: var(--text-secondary);
        margin-bottom: 8px;
      }

      .achievement-date {
        font-size: 12px;
        color: var(--text-light);
      }
    }
  }
}

.learning-timeline {
  position: relative;
  padding-left: 24px;

  &::before {
    content: '';
    position: absolute;
    left: 8px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, var(--primary-color), var(--secondary-color));
  }

  .timeline-item {
    position: relative;
    margin-bottom: 32px;

    &:last-child {
      margin-bottom: 0;
    }

    .timeline-dot {
      position: absolute;
      left: -20px;
      top: 8px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

      &.milestone {
        background: #ffd700;
      }

      &.course {
        background: var(--primary-color);
      }

      &.start {
        background: #4caf50;
      }
    }

    .timeline-content {
      background: var(--background-light);
      border-radius: 8px;
      padding: 16px;

      .timeline-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        h4 {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .timeline-date {
          font-size: 12px;
          color: var(--text-light);
        }
      }

      p {
        font-size: 14px;
        color: var(--text-secondary);
        margin-bottom: 12px;
      }

      .timeline-stats {
        display: flex;
        gap: 16px;

        .stat-item {
          font-size: 12px;
          color: var(--text-light);
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .profile-view {
    .profile-container {
      padding: 16px;
    }

    .profile-header {
      padding: 24px;

      .user-info-section {
        flex-direction: column;
        gap: 24px;
        text-align: center;

        .achievement-showcase {
          .stats-cards {
            grid-template-columns: 1fr;
          }

          .quick-actions {
            flex-direction: column;
          }
        }
      }
    }

    .achievement-highlights {
      grid-template-columns: 1fr;
    }
  }
}
</style>
