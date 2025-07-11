<template>
  <div class="progress-view">
    <div class="progress-container">
      <!-- 页面头部 -->
      <div class="progress-header">
        <!-- 学习进度装饰元素 -->
        <div class="header-decorations">
          <div class="decoration-item progress-icon icon-1">📊</div>
          <div class="decoration-item progress-icon icon-2">🎯</div>

          <div class="decoration-item milestone-bubble bubble-1">里程碑</div>
          <div class="decoration-item milestone-bubble bubble-2">成就解锁</div>
        </div>

        <div class="header-content">
          <div class="header-left">
            <h1 class="page-title">学习进度</h1>
            <p class="page-subtitle">跟踪您的学习历程，见证每一步成长</p>
          </div>
          <div class="header-right">
            <div class="study-streak">
              <div class="streak-icon">
                <el-icon><Trophy /></el-icon>
              </div>
              <div class="streak-info">
                <div class="streak-number">{{ studyStreak }}</div>
                <div class="streak-label">连续学习天数</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 学习目标管理 -->
      <div class="goals-section">
        <div class="goals-header">
          <div class="goals-info">
            <h2>当前学习目标</h2>
            <p>制定目标，追踪进度，保持学习动力</p>
          </div>
          <div class="goals-actions">
            <el-button @click="viewGoalHistory">目标历史</el-button>
            <el-button type="primary" @click="createNewGoal">
              <el-icon><Plus /></el-icon>
              新建目标
            </el-button>
          </div>
        </div>

        <div class="current-goals">
          <div v-for="goal in learningGoals" :key="goal.id" class="goal-card">
            <div class="goal-status" :class="goal.status">
              <el-icon v-if="goal.status === 'completed'"><SuccessFilled /></el-icon>
              <el-icon v-else-if="goal.status === 'overdue'"><WarningFilled /></el-icon>
              <el-icon v-else><Clock /></el-icon>
            </div>
            <div class="goal-content">
              <div class="goal-header">
                <h3 class="goal-title">{{ goal.title }}</h3>
                <div class="goal-deadline">{{ getDaysUntilDeadline(goal.endDate) }}</div>
              </div>
              <p class="goal-description">{{ goal.description }}</p>
              <div class="goal-progress">
                <div class="progress-info">
                  <span>进度：{{ goal.completedTasks }}/{{ goal.totalTasks }} 任务</span>
                  <span class="progress-percent"
                    >{{ Math.round((goal.completedTasks / goal.totalTasks) * 100) }}%</span
                  >
                </div>
                <el-progress
                  :percentage="Math.round((goal.completedTasks / goal.totalTasks) * 100)"
                  :stroke-width="8"
                  :color="getProgressColor(goal.status)"
                />
              </div>
            </div>
            <div class="goal-actions">
              <el-button size="small" @click="viewGoalDetail(goal.id)">详情</el-button>
              <el-button size="small" type="primary" @click="updateGoalProgress(goal.id)"
                >更新</el-button
              >
            </div>
          </div>

          <div v-if="learningGoals.length === 0" class="empty-goals">
            <el-empty description="还没有设置学习目标" :image-size="100">
              <el-button type="primary" @click="createNewGoal">创建第一个目标</el-button>
            </el-empty>
          </div>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="main-content">
        <!-- 左侧内容 -->
        <div class="content-left">
          <!-- 学习计划管理 -->
          <div class="section study-plans-section">
            <div class="section-header">
              <h2 class="section-title">学习计划</h2>
              <div class="section-actions">
                <el-button text @click="viewPlanTemplates">计划模板</el-button>
                <el-button type="primary" @click="createStudyPlan">
                  <el-icon><Plus /></el-icon>
                  制定计划
                </el-button>
              </div>
            </div>

            <div class="study-plans-list">
              <div v-for="plan in studyPlans" :key="plan.id" class="plan-card">
                <div class="plan-header">
                  <div class="plan-status-badge" :class="plan.status">
                    {{ plan.statusText }}
                  </div>
                  <div class="plan-period">{{ plan.period }}</div>
                </div>

                <div class="plan-content">
                  <h3 class="plan-title">{{ plan.title }}</h3>
                  <p class="plan-description">{{ plan.description }}</p>

                  <div class="plan-progress">
                    <div class="progress-stats">
                      <span>进度：{{ plan.completedTasks }}/{{ plan.totalTasks }}</span>
                      <span class="progress-percent"
                        >{{ Math.round((plan.completedTasks / plan.totalTasks) * 100) }}%</span
                      >
                    </div>
                    <el-progress
                      :percentage="Math.round((plan.completedTasks / plan.totalTasks) * 100)"
                      :stroke-width="6"
                    />
                  </div>

                  <div class="plan-tasks-preview">
                    <div class="tasks-header">
                      <span>近期任务</span>
                      <el-button text size="small" @click="viewPlanDetail(plan.id)"
                        >查看全部</el-button
                      >
                    </div>
                    <div class="tasks-list">
                      <div
                        v-for="task in plan.upcomingTasks?.slice(0, 3)"
                        :key="task.id"
                        class="task-item"
                      >
                        <el-checkbox
                          v-model="task.completed"
                          @change="updateTaskStatus(plan.id, task.id, $event)"
                        />
                        <span class="task-title">{{ task.title }}</span>
                        <span class="task-deadline" :class="{ overdue: isOverdue(task.deadline) }">
                          {{ formatRelativeTime(task.deadline) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="plan-actions">
                  <el-button size="small" @click="viewPlanDetail(plan.id)">详情</el-button>
                  <el-button size="small" @click="editPlan(plan.id)">编辑</el-button>
                  <el-button size="small" type="primary" @click="executeNextTask(plan.id)"
                    >执行任务</el-button
                  >
                </div>
              </div>

              <div v-if="studyPlans.length === 0" class="empty-plans">
                <el-empty description="还没有制定学习计划" :image-size="100">
                  <el-button type="primary" @click="createStudyPlan">制定第一个计划</el-button>
                </el-empty>
              </div>
            </div>
          </div>

          <!-- 课程管理 -->
          <div class="section courses-management-section">
            <div class="section-header">
              <h2 class="section-title">课程管理</h2>
              <div class="section-tabs">
                <el-button-group size="small">
                  <el-button
                    :type="courseTab === 'learning' ? 'primary' : ''"
                    @click="courseTab = 'learning'"
                  >
                    正在学习 ({{ learningCourses.length }})
                  </el-button>
                  <el-button
                    :type="courseTab === 'completed' ? 'primary' : ''"
                    @click="courseTab = 'completed'"
                  >
                    已完成 ({{ completedCourses }})
                  </el-button>
                </el-button-group>
              </div>
            </div>

            <div class="courses-grid">
              <div v-for="course in displayCourses" :key="course.id" class="course-card-compact">
                <div class="course-thumbnail">
                  <img :src="course.image" :alt="course.title" />
                  <div v-if="courseTab === 'learning'" class="progress-badge">
                    {{ course.progress }}%
                  </div>
                  <div v-else class="completed-badge">
                    <el-icon><SuccessFilled /></el-icon>
                  </div>
                </div>

                <div class="course-details">
                  <h4 class="course-title">{{ course.title }}</h4>
                  <div class="course-meta">
                    <span class="instructor">{{ course.instructor.name }}</span>
                    <span class="last-study">
                      最后学习：{{ formatDate(course.lastStudyTime) }}
                    </span>
                  </div>

                  <div v-if="courseTab === 'learning'" class="course-progress">
                    <el-progress :percentage="course.progress" :stroke-width="4" />
                    <span class="progress-text">
                      {{ course.completedLessons }}/{{ course.totalLessons }}
                    </span>
                  </div>

                  <div v-else class="completion-info">
                    <div class="completion-date">
                      <el-icon><Calendar /></el-icon>
                      完成于 {{ formatDate(course.completedDate) }}
                    </div>
                    <div class="study-stats">
                      <span>学时：{{ course.totalStudyTime }}h</span>
                      <span>评分：{{ course.rating }}/5</span>
                    </div>
                  </div>
                </div>

                <div class="course-actions">
                  <el-button
                    v-if="courseTab === 'learning'"
                    type="primary"
                    size="small"
                    @click="continueLearning(course)"
                  >
                    继续学习
                  </el-button>
                  <el-button v-else size="small" @click="reviewCourse(course.id)"> 复习 </el-button>
                  <el-button size="small" @click="viewCourseDetail(course.id)">详情</el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 学习日历 -->
          <div class="section calendar-section">
            <div class="section-header">
              <h2 class="section-title">学习日历</h2>
              <div class="calendar-controls">
                <el-button-group size="small">
                  <el-button
                    :type="calendarView === 'month' ? 'primary' : ''"
                    @click="calendarView = 'month'"
                    >月</el-button
                  >
                  <el-button
                    :type="calendarView === 'year' ? 'primary' : ''"
                    @click="calendarView = 'year'"
                    >年</el-button
                  >
                </el-button-group>
              </div>
            </div>

            <div class="calendar-container">
              <div v-if="calendarView === 'year'" class="yearly-calendar">
                <div class="calendar-heatmap">
                  <div class="heatmap-header">
                    <h4>2024年学习活跃度</h4>
                    <div class="heatmap-stats">
                      <span>总学习 {{ yearlyStats.totalDays }}天</span>
                      <span>最长连续 {{ yearlyStats.maxStreak }}天</span>
                    </div>
                  </div>

                  <div class="heatmap-container">
                    <div class="heatmap-months">
                      <div v-for="month in months" :key="month" class="month-label">
                        {{ month }}
                      </div>
                    </div>

                    <div class="heatmap-content">
                      <div class="heatmap-weekdays">
                        <div class="weekday-label">一</div>
                        <div class="weekday-label">二</div>
                        <div class="weekday-label">三</div>
                        <div class="weekday-label">四</div>
                        <div class="weekday-label">五</div>
                        <div class="weekday-label">六</div>
                        <div class="weekday-label">日</div>
                      </div>

                      <div class="heatmap-grid">
                        <div
                          v-for="(day, index) in yearlyData"
                          :key="index"
                          class="heatmap-day"
                          :class="getHeatmapClass(day.studyTime)"
                          :title="`${formatHeatmapDate(day.date)}: ${day.studyTime}分钟`"
                          @click="selectHeatmapDay(day)"
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div class="heatmap-legend">
                    <span class="legend-label">学习时长</span>
                    <div class="legend-colors">
                      <span class="legend-text">少</span>
                      <div class="legend-color level-0" title="无学习"></div>
                      <div class="legend-color level-1" title="1-30分钟"></div>
                      <div class="legend-color level-2" title="31-60分钟"></div>
                      <div class="legend-color level-3" title="61-120分钟"></div>
                      <div class="legend-color level-4" title="120分钟以上"></div>
                      <span class="legend-text">多</span>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="monthly-calendar">
                <el-calendar v-model="selectedDate" class="study-calendar">
                  <template #date-cell="{ data }">
                    <div class="calendar-day">
                      <span class="day-number">{{ data.day.split('-').slice(-1)[0] }}</span>
                      <div v-if="getDayStudyData(data.day)" class="study-indicator">
                        <div
                          class="study-dot"
                          :class="getStudyLevel(getDayStudyData(data.day)?.studyTime || 0)"
                        ></div>
                        <span class="study-time"
                          >{{ getDayStudyData(data.day)?.studyTime || 0 }}min</span
                        >
                      </div>
                    </div>
                  </template>
                </el-calendar>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧侧边栏 -->
        <div class="content-right">
          <!-- 成就系统 -->
          <div class="section achievements-section">
            <div class="section-header">
              <h2 class="section-title">成就徽章</h2>
              <el-button text type="primary" @click="viewAllAchievements">查看全部</el-button>
            </div>

            <div class="achievements-grid">
              <div
                v-for="achievement in recentAchievements"
                :key="achievement.id"
                class="achievement-card"
                :class="{ unlocked: achievement.unlocked }"
              >
                <div class="achievement-icon">
                  <el-icon>
                    <component :is="achievement.icon" />
                  </el-icon>
                </div>
                <div class="achievement-info">
                  <h4 class="achievement-title">{{ achievement.title }}</h4>
                  <p class="achievement-desc">{{ achievement.description }}</p>
                  <div v-if="!achievement.unlocked" class="achievement-progress">
                    <el-progress
                      :percentage="achievement.progress"
                      :show-text="false"
                      :stroke-width="4"
                      size="small"
                    />
                    <span class="progress-text"
                      >{{ achievement.current }}/{{ achievement.target }}</span
                    >
                  </div>
                  <div v-else class="achievement-date">
                    {{ formatDate(achievement.unlockedAt) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 学习统计 -->
          <div class="section stats-section">
            <div class="section-header">
              <h2 class="section-title">本周统计</h2>
            </div>

            <div class="stats-chart">
              <div class="chart-header">
                <span class="chart-title">每日学习时长</span>
                <span class="chart-total">总计 {{ weeklyTotal }}小时</span>
              </div>

              <div class="weekly-chart">
                <div v-for="(day, index) in weeklyData" :key="index" class="chart-bar">
                  <div
                    class="bar-fill"
                    :style="{ height: `${(day.studyTime / maxDailyTime) * 100}%` }"
                  ></div>
                  <span class="bar-label">{{ day.day }}</span>
                  <span class="bar-time">{{ day.studyTime }}h</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 学习排行榜 -->
          <div class="section leaderboard-section">
            <div class="section-header">
              <h2 class="section-title">本月排行</h2>
              <el-button text type="primary" @click="viewFullLeaderboard">查看排行榜</el-button>
            </div>

            <div class="leaderboard-list">
              <div
                v-for="(user, index) in leaderboard"
                :key="user.id"
                class="leaderboard-item"
                :class="{ 'is-current-user': user.id === currentUserId }"
              >
                <div class="rank-number">{{ index + 1 }}</div>
                <div class="user-avatar">
                  <img :src="user.avatar" :alt="user.name" />
                </div>
                <div class="user-info">
                  <span class="user-name">{{ user.name }}</span>
                  <span class="study-time">{{ user.monthlyStudyTime }}h</span>
                </div>
                <div v-if="index < 3" class="rank-badge">
                  <el-icon><Trophy /></el-icon>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  Trophy,
  Timer,
  Medal,
  Reading,
  Stamp,
  Plus,
  Calendar,
  Clock,
  SuccessFilled,
  WarningFilled,
} from '@element-plus/icons-vue'
const router = useRouter()

// 响应式数据
const studyStreak = ref(7)
const totalStudyTime = ref(156) // 分钟
const completedCourses = ref(3)
const certificates = ref(2)
const selectedDate = ref(new Date())
const calendarView = ref('month')
const currentUserId = ref('1')
const courseTab = ref('learning')

// 学习目标数据
const learningGoals = ref([
  {
    id: '1',
    title: '掌握Vue3核心技术',
    description: '深入学习Vue3的组合式API、响应式系统等核心概念',
    status: 'active',
    startDate: '2024-12-01',
    endDate: '2025-01-31',
    completedTasks: 8,
    totalTasks: 15,
  },
  {
    id: '2',
    title: '完成AI开发项目',
    description: '通过实战项目掌握AI Agent开发技能',
    status: 'planning',
    startDate: '2024-12-15',
    endDate: '2025-02-15',
    completedTasks: 3,
    totalTasks: 12,
  },
])

// 学习计划数据
const studyPlans = ref([
  {
    id: '1',
    title: '前端技术栈学习计划',
    description: '系统性学习Vue3、TypeScript、Vite等现代前端技术',
    status: 'active',
    statusText: '进行中',
    period: '2024.12 - 2025.02',
    completedTasks: 12,
    totalTasks: 20,
    upcomingTasks: [
      {
        id: '1',
        title: '学习Vue3组合式API',
        completed: true,
        deadline: '2024-12-30',
      },
      {
        id: '2',
        title: '掌握TypeScript类型系统',
        completed: false,
        deadline: '2025-01-05',
      },
      {
        id: '3',
        title: '实践Pinia状态管理',
        completed: false,
        deadline: '2025-01-10',
      },
    ],
  },
  {
    id: '2',
    title: 'AI开发技能提升',
    description: '学习机器学习基础、深度学习框架及实际应用',
    status: 'planning',
    statusText: '规划中',
    period: '2025.01 - 2025.03',
    completedTasks: 2,
    totalTasks: 15,
    upcomingTasks: [
      {
        id: '4',
        title: '学习Python基础',
        completed: true,
        deadline: '2024-12-25',
      },
      {
        id: '5',
        title: '了解机器学习概念',
        completed: false,
        deadline: '2025-01-08',
      },
    ],
  },
])

// 已完成课程数据
const completedCoursesData = ref([
  {
    id: 'c1',
    title: 'JavaScript进阶教程',
    instructor: { name: '李四' },
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    completedDate: '2024-12-15',
    totalStudyTime: 25,
    rating: 4.8,
    totalLessons: 30,
    completedLessons: 30,
  },
  {
    id: 'c2',
    title: 'React Hooks 深入解析',
    instructor: { name: '王五' },
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    completedDate: '2024-11-28',
    totalStudyTime: 18,
    rating: 4.5,
    totalLessons: 20,
    completedLessons: 20,
  },
])

// 正在学习的课程（Mock数据）
const learningCourses = ref([
  {
    id: '1',
    title: 'Vue3 从零到一开发整站',
    instructor: { name: '张三' },
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    progress: 65,
    completedLessons: 16,
    totalLessons: 25,
    lastStudyTime: '2024-12-28',
  },
  {
    id: '2',
    title: 'AI Agent 开发实战',
    instructor: { name: '王五' },
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    progress: 30,
    completedLessons: 8,
    totalLessons: 20,
    lastStudyTime: '2024-12-27',
  },
])

// 成就数据
const recentAchievements = ref([
  {
    id: '1',
    title: '初学者',
    description: '完成第一门课程',
    icon: 'Reading',
    unlocked: true,
    unlockedAt: '2024-12-20',
    progress: 100,
    current: 1,
    target: 1,
  },
  {
    id: '2',
    title: '连续学习',
    description: '连续学习7天',
    icon: 'Trophy',
    unlocked: true,
    unlockedAt: '2024-12-25',
    progress: 100,
    current: 7,
    target: 7,
  },
  {
    id: '3',
    title: '知识探索者',
    description: '完成5门课程',
    icon: 'Medal',
    unlocked: false,
    progress: 60,
    current: 3,
    target: 5,
  },
  {
    id: '4',
    title: '学习达人',
    description: '累计学习100小时',
    icon: 'Timer',
    unlocked: false,
    progress: 45,
    current: 45,
    target: 100,
  },
])

// 本周学习数据
const weeklyData = ref([
  { day: '周一', studyTime: 2.5 },
  { day: '周二', studyTime: 1.8 },
  { day: '周三', studyTime: 3.2 },
  { day: '周四', studyTime: 2.1 },
  { day: '周五', studyTime: 1.5 },
  { day: '周六', studyTime: 4.0 },
  { day: '周日', studyTime: 2.8 },
])

// 排行榜数据
const leaderboard = ref([
  {
    id: '2',
    name: '学习达人',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    monthlyStudyTime: 89,
  },
  {
    id: '1',
    name: '演示用户',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    monthlyStudyTime: 76,
  },
  {
    id: '3',
    name: '编程小白',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    monthlyStudyTime: 68,
  },
  {
    id: '4',
    name: '技术极客',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    monthlyStudyTime: 52,
  },
])

// 年度学习数据（简化版热力图数据）
const yearlyData = ref(
  Array.from({ length: 365 }, (_, i) => ({
    date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
    studyTime: Math.floor(Math.random() * 180), // 0-180分钟
  })),
)

// 年度统计数据
const yearlyStats = ref({
  totalDays: 156,
  maxStreak: 25,
})

// 月份标签
const months = ref([
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
])

// 计算属性
const weeklyTotal = computed(() => {
  return weeklyData.value.reduce((sum, day) => sum + day.studyTime, 0).toFixed(1)
})

const maxDailyTime = computed(() => {
  return Math.max(...weeklyData.value.map((day) => day.studyTime))
})

// 根据课程选项卡显示不同课程
const displayCourses = computed(() => {
  if (courseTab.value === 'learning') {
    return learningCourses.value
  } else {
    // 为已完成课程添加必需的属性，使其与正在学习课程兼容
    return completedCoursesData.value.map((course) => ({
      ...course,
      progress: 100, // 已完成课程进度为100%
      lastStudyTime: course.completedDate,
    }))
  }
})

// 方法
const formatStudyTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}小时${mins}分钟`
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const getHeatmapClass = (studyTime: number) => {
  if (studyTime === 0) return 'level-0'
  if (studyTime <= 30) return 'level-1'
  if (studyTime <= 60) return 'level-2'
  if (studyTime <= 120) return 'level-3'
  return 'level-4'
}

const getDayStudyData = (date: string) => {
  // 简化的日期数据查找
  const randomTime = Math.floor(Math.random() * 120)
  return randomTime > 0 ? { studyTime: randomTime } : null
}

const getStudyLevel = (studyTime: number) => {
  if (studyTime <= 30) return 'low'
  if (studyTime <= 60) return 'medium'
  return 'high'
}

const continueLearning = (course: any) => {
  router.push(`/course/${course.id}`)
}

const viewCourseDetail = (courseId: string) => {
  router.push(`/course/${courseId}`)
}

const viewAllCourses = () => {
  router.push('/courses')
}

const exploreCoursesm = () => {
  router.push('/courses')
}

const viewAllAchievements = () => {
  // 暂时显示提示
  console.log('查看全部成就')
}

const viewFullLeaderboard = () => {
  // 暂时显示提示
  console.log('查看完整排行榜')
}

const formatHeatmapDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const selectHeatmapDay = (day: { date: string; studyTime: number }) => {
  console.log('选择日期:', day.date, '学习时长:', day.studyTime)
}

// 学习目标相关方法
const viewGoalHistory = () => {
  console.log('查看目标历史')
}

const createNewGoal = () => {
  console.log('创建新目标')
}

const getDaysUntilDeadline = (endDate: string) => {
  const today = new Date()
  const deadline = new Date(endDate)
  const diffTime = deadline.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return '已过期'
  if (diffDays === 0) return '今天截止'
  if (diffDays === 1) return '明天截止'
  return `${diffDays}天后截止`
}

const getProgressColor = (status: string) => {
  switch (status) {
    case 'completed':
      return '#67c23a'
    case 'overdue':
      return '#f56c6c'
    default:
      return '#409eff'
  }
}

const viewGoalDetail = (goalId: string) => {
  console.log('查看目标详情:', goalId)
}

const updateGoalProgress = (goalId: string) => {
  console.log('更新目标进度:', goalId)
}

// 学习计划相关方法
const viewPlanTemplates = () => {
  console.log('查看计划模板')
}

const createStudyPlan = () => {
  console.log('创建学习计划')
}

const viewPlanDetail = (planId: string) => {
  console.log('查看计划详情:', planId)
}

const editPlan = (planId: string) => {
  console.log('编辑计划:', planId)
}

const executeNextTask = (planId: string) => {
  console.log('执行下一个任务:', planId)
}

const updateTaskStatus = (planId: string, taskId: string, completed: boolean) => {
  console.log('更新任务状态:', planId, taskId, completed)
}

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return `${Math.abs(diffDays)}天前`
  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '明天'
  return `${diffDays}天后`
}

const isOverdue = (dateString: string) => {
  return new Date(dateString) < new Date()
}

// 课程管理相关方法
const reviewCourse = (courseId: string) => {
  console.log('复习课程:', courseId)
}

onMounted(() => {
  // 初始化数据
})
</script>

<style scoped lang="scss">
.progress-view {
  min-height: calc(100vh - 64px);
  background: var(--background-light);

  .progress-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 24px;
  }
}

.progress-header {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 50px 40px;
  margin-bottom: 32px;
  color: white;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);

  // 进度主题装饰背景
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background:
      radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.06) 0%, transparent 50%);
    animation: progressFloat 24s ease-in-out infinite;
    z-index: 1;
    will-change: transform;
  }

  // 数据网格背景
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
    background-size: 30px 30px;
    z-index: 1;
  }

  // 学习进度装饰元素
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
      opacity: 0.75;

      &.progress-icon {
        width: 32px;
        height: 32px;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255, 255, 255, 0.18);
        font-size: 18px;
        will-change: transform;

        &.icon-1 {
          top: 28%;
          left: 40%;
          animation: progressPulse 4s ease-in-out infinite;
        }

        &.icon-2 {
          bottom: 30%;
          left: 45%;
          animation: progressPulse 5s ease-in-out infinite 1s;
        }
      }

      &.milestone-bubble {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        padding: 10px 16px;
        font-size: 14px;
        font-weight: 600;
        backdrop-filter: blur(15px);
        will-change: transform;

        &.bubble-1 {
          top: 22%;
          left: 50%;
          transform: rotate(-3deg);
          animation: milestoneFloat 7s ease-in-out infinite;
        }

        &.bubble-2 {
          bottom: 25%;
          left: 52%;
          transform: rotate(2deg);
          animation: milestoneFloat 8s ease-in-out infinite 1.5s;
        }
      }
    }
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 10;

    .header-left {
      .page-title {
        font-size: 40px;
        font-weight: 700;
        margin-bottom: 12px;
        background: linear-gradient(45deg, #fff, #e3f2fd);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        letter-spacing: -0.5px;
        line-height: 1.2;
      }

      .page-subtitle {
        font-size: 18px;
        opacity: 0.95;
        margin: 0;
        font-weight: 500;
        line-height: 1.4;
      }
    }

    .header-right {
      .study-streak {
        display: flex;
        align-items: center;
        gap: 16px;
        background: rgba(255, 255, 255, 0.1);
        padding: 20px;
        border-radius: 12px;
        backdrop-filter: blur(10px);

        .streak-icon {
          font-size: 32px;
          color: #ffd700;
        }

        .streak-info {
          .streak-number {
            font-size: 28px;
            font-weight: 700;
            line-height: 1;
          }

          .streak-label {
            font-size: 14px;
            opacity: 0.9;
          }
        }
      }
    }
  }
}

.overview-section {
  margin-bottom: 32px;

  .overview-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;

    .overview-card {
      background: white;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      display: flex;
      align-items: center;
      gap: 20px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      }

      .card-icon {
        width: 64px;
        height: 64px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        color: white;
      }

      .card-content {
        flex: 1;

        .card-number {
          font-size: 32px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1;
          margin-bottom: 4px;
        }

        .card-label {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }

        .card-trend {
          font-size: 12px;
          color: var(--success-color);
          font-weight: 500;
        }
      }

      &.total-time .card-icon {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      &.completed-courses .card-icon {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }

      &.learning-courses .card-icon {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }

      &.certificates .card-icon {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      }
    }
  }
}

.main-content {
  display: flex;
  gap: 32px;

  .content-left {
    flex: 2;
  }

  .content-right {
    flex: 1;
    max-width: 400px;
  }
}

.section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .section-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--text-primary);
    }
  }
}

// 学习目标管理区域
.goals-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  .goals-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .goals-info {
      h2 {
        font-size: 24px;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 8px;
      }

      p {
        color: var(--text-secondary);
        margin: 0;
        font-size: 14px;
      }
    }

    .goals-actions {
      display: flex;
      gap: 12px;
    }
  }

  .current-goals {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 24px;

    .goal-card {
      background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%);
      border: 2px solid transparent;
      border-radius: 16px;
      padding: 24px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
        border-color: rgba(102, 126, 234, 0.2);
      }

      .goal-status {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;

        &.active {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
        }

        &.completed {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          color: white;
        }

        &.overdue {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
          color: white;
        }
      }

      .goal-content {
        .goal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;

          .goal-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary);
            margin: 0;
            line-height: 1.3;
          }

          .goal-deadline {
            font-size: 12px;
            color: var(--text-secondary);
            background: var(--background-light);
            padding: 4px 8px;
            border-radius: 6px;
            white-space: nowrap;
            margin-left: 16px;
          }
        }

        .goal-description {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .goal-progress {
          .progress-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            font-size: 14px;

            .progress-percent {
              font-weight: 600;
              color: var(--primary-color);
            }
          }
        }
      }

      .goal-actions {
        margin-top: 20px;
        display: flex;
        gap: 8px;
      }
    }

    .empty-goals {
      grid-column: 1 / -1;
      text-align: center;
      padding: 40px 20px;
    }
  }
}

// 学习计划区域
.study-plans-section {
  .study-plans-list {
    .plan-card {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 20px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        border-color: var(--primary-color);
      }

      .plan-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        .plan-status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;

          &.active {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
          }

          &.planning {
            background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
            color: #8b4513;
          }

          &.completed {
            background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
            color: #2e8b57;
          }
        }

        .plan-period {
          font-size: 12px;
          color: var(--text-secondary);
          background: var(--background-light);
          padding: 4px 8px;
          border-radius: 6px;
        }
      }

      .plan-content {
        .plan-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .plan-description {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 16px;
        }

        .plan-progress {
          margin-bottom: 20px;

          .progress-stats {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            font-size: 14px;

            .progress-percent {
              font-weight: 600;
              color: var(--primary-color);
            }
          }
        }

        .plan-tasks-preview {
          .tasks-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            font-size: 14px;
            font-weight: 500;
            color: var(--text-primary);
          }

          .tasks-list {
            .task-item {
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 8px 0;
              border-bottom: 1px solid var(--border-light);

              &:last-child {
                border-bottom: none;
              }

              .task-title {
                flex: 1;
                font-size: 13px;
                color: var(--text-primary);
              }

              .task-deadline {
                font-size: 12px;
                color: var(--text-secondary);

                &.overdue {
                  color: var(--error-color);
                  font-weight: 500;
                }
              }
            }
          }
        }
      }

      .plan-actions {
        display: flex;
        gap: 8px;
        padding-top: 16px;
        border-top: 1px solid var(--border-light);
      }
    }

    .empty-plans {
      text-align: center;
      padding: 40px 20px;
    }
  }
}

// 课程管理区域
.courses-management-section {
  .section-tabs {
    display: flex;
    gap: 8px;
  }

  .courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;

    .course-card-compact {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        border-color: var(--primary-color);
      }

      .course-thumbnail {
        position: relative;
        height: 160px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        &:hover img {
          transform: scale(1.05);
        }

        .progress-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4px 8px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .completed-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          color: white;
          padding: 4px 8px;
          border-radius: 20px;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }

      .course-info {
        padding: 16px;

        .course-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .course-instructor {
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 12px;
        }

        .course-stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: var(--text-secondary);
          margin-bottom: 12px;

          .stats-item {
            display: flex;
            align-items: center;
            gap: 4px;
          }
        }

        .course-progress {
          margin-bottom: 12px;

          .progress-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
            font-size: 12px;
            color: var(--text-secondary);
          }
        }

        .course-actions {
          display: flex;
          gap: 8px;
        }
      }
    }
  }
}

.learning-courses-list {
  .learning-course-card {
    display: flex;
    gap: 20px;
    padding: 20px;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    margin-bottom: 16px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      border-color: var(--primary-color);
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.15);
    }

    .course-image {
      position: relative;
      width: 120px;
      height: 80px;
      border-radius: 8px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .progress-overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        .progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 12px;
          font-weight: 600;
          color: var(--primary-color);
        }
      }
    }

    .course-info {
      flex: 1;

      .course-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 4px;
      }

      .course-instructor {
        font-size: 14px;
        color: var(--text-secondary);
        margin-bottom: 12px;
      }

      .progress-info {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;

        .progress-bar {
          flex: 1;
        }

        .progress-label {
          font-size: 12px;
          color: var(--text-secondary);
        }
      }

      .course-actions {
        display: flex;
        gap: 12px;
      }
    }
  }

  .empty-learning {
    text-align: center;
    padding: 60px 0;
  }
}

.calendar-section {
  .calendar-controls {
    .el-button-group {
      border-radius: 8px;
      overflow: hidden;
    }
  }

  .yearly-calendar {
    .calendar-heatmap {
      padding: 24px;
      background: white;
      border-radius: 12px;

      .heatmap-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;

        h4 {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .heatmap-stats {
          display: flex;
          gap: 24px;

          span {
            font-size: 14px;
            color: var(--text-secondary);
          }
        }
      }

      .heatmap-container {
        .heatmap-months {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 8px;
          margin-bottom: 8px;

          .month-label {
            font-size: 12px;
            color: var(--text-secondary);
            text-align: center;
          }
        }

        .heatmap-content {
          display: flex;
          gap: 8px;

          .heatmap-weekdays {
            display: flex;
            flex-direction: column;
            gap: 2px;
            margin-right: 8px;

            .weekday-label {
              width: 20px;
              height: 12px;
              font-size: 10px;
              color: var(--text-secondary);
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }
      }

      .heatmap-grid {
        display: grid;
        grid-template-columns: repeat(53, 1fr);
        grid-template-rows: repeat(7, 1fr);
        gap: 2px;
        margin-bottom: 16px;

        .heatmap-day {
          width: 12px;
          height: 12px;
          border-radius: 2px;
          background: #ebedf0;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            transform: scale(1.2);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          }

          &.level-0 {
            background: #ebedf0;
          }
          &.level-1 {
            background: #c6e48b;
          }
          &.level-2 {
            background: #7bc96f;
          }
          &.level-3 {
            background: #239a3b;
          }
          &.level-4 {
            background: #196127;
          }
        }
      }

      .heatmap-legend {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        font-size: 12px;
        color: var(--text-secondary);
        margin-top: 16px;

        .legend-label {
          font-weight: 500;
        }

        .legend-colors {
          display: flex;
          align-items: center;
          gap: 8px;

          .legend-text {
            font-size: 11px;
            color: var(--text-secondary);
          }

          .legend-color {
            width: 12px;
            height: 12px;
            border-radius: 2px;
            border: 1px solid rgba(0, 0, 0, 0.1);

            &.level-0 {
              background: #ebedf0;
            }
            &.level-1 {
              background: #c6e48b;
            }
            &.level-2 {
              background: #7bc96f;
            }
            &.level-3 {
              background: #239a3b;
            }
            &.level-4 {
              background: #196127;
            }
          }
        }
      }
    }
  }

  .monthly-calendar {
    :deep(.el-calendar) {
      .el-calendar__header {
        padding: 12px 20px;
        border-bottom: 1px solid var(--border-color);
      }

      .el-calendar__body {
        padding: 12px;
      }

      .el-calendar-day {
        padding: 8px;

        .calendar-day {
          .day-number {
            font-weight: 500;
          }

          .study-indicator {
            margin-top: 4px;
            display: flex;
            align-items: center;
            gap: 4px;

            .study-dot {
              width: 6px;
              height: 6px;
              border-radius: 50%;

              &.low {
                background: #c6e48b;
              }
              &.medium {
                background: #7bc96f;
              }
              &.high {
                background: #239a3b;
              }
            }

            .study-time {
              font-size: 10px;
              color: var(--text-secondary);
            }
          }
        }
      }
    }
  }
}

.achievements-section {
  .achievements-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .achievement-card {
      display: flex;
      gap: 16px;
      padding: 16px;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      transition: all 0.3s ease;

      &.unlocked {
        border-color: var(--success-color);
        background: linear-gradient(135deg, rgba(76, 175, 80, 0.05), rgba(76, 175, 80, 0.02));
      }

      .achievement-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 20px;
        flex-shrink: 0;
      }

      .achievement-info {
        flex: 1;

        .achievement-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .achievement-desc {
          font-size: 12px;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }

        .achievement-progress {
          display: flex;
          align-items: center;
          gap: 8px;

          .progress-text {
            font-size: 11px;
            color: var(--text-secondary);
          }
        }

        .achievement-date {
          font-size: 11px;
          color: var(--success-color);
          font-weight: 500;
        }
      }
    }
  }
}

.stats-section {
  .stats-chart {
    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      .chart-title {
        font-size: 14px;
        color: var(--text-secondary);
      }

      .chart-total {
        font-size: 14px;
        font-weight: 600;
        color: var(--primary-color);
      }
    }

    .weekly-chart {
      display: flex;
      justify-content: space-between;
      align-items: end;
      height: 120px;
      gap: 8px;

      .chart-bar {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;

        .bar-fill {
          width: 100%;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          border-radius: 4px 4px 0 0;
          min-height: 4px;
          transition: height 0.3s ease;
        }

        .bar-label {
          font-size: 10px;
          color: var(--text-secondary);
        }

        .bar-time {
          font-size: 10px;
          font-weight: 600;
          color: var(--text-primary);
        }
      }
    }
  }
}

.leaderboard-section {
  .leaderboard-list {
    .leaderboard-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 8px;
      transition: all 0.3s ease;

      &.is-current-user {
        background: linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(255, 140, 66, 0.05));
        border: 1px solid var(--primary-color);
      }

      &:hover {
        background: var(--background-light);
      }

      .rank-number {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--background-light);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 600;
        color: var(--text-primary);
      }

      .user-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .user-info {
        flex: 1;

        .user-name {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
        }

        .study-time {
          font-size: 12px;
          color: var(--text-secondary);
        }
      }

      .rank-badge {
        color: #ffd700;
        font-size: 16px;
      }
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .progress-view {
    .main-content {
      flex-direction: column;

      .content-right {
        max-width: none;
      }
    }

    .goals-section {
      .current-goals {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }

    .courses-management-section {
      .courses-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      }
    }
  }
}

@media (max-width: 768px) {
  .progress-view {
    .progress-container {
      padding: 16px;
    }

    .progress-header {
      padding: 24px;

      .header-content {
        flex-direction: column;
        gap: 20px;
        text-align: center;
      }
    }

    .overview-section {
      .overview-cards {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;

        .overview-card {
          padding: 20px;
          flex-direction: column;
          text-align: center;

          .card-icon {
            margin-bottom: 12px;
          }
        }
      }
    }

    .goals-section {
      padding: 24px;

      .goals-header {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;

        .goals-actions {
          justify-content: center;
        }
      }

      .current-goals {
        .goal-card {
          padding: 20px;

          .goal-status {
            position: static;
            width: auto;
            height: auto;
            margin-bottom: 12px;
            align-self: flex-start;
          }

          .goal-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;

            .goal-deadline {
              margin-left: 0;
            }
          }
        }
      }
    }

    .study-plans-section,
    .courses-management-section {
      .section-header {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;

        .section-tabs {
          justify-content: center;
        }
      }
    }

    .courses-management-section {
      .courses-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }

    .learning-courses-list {
      .learning-course-card {
        flex-direction: column;

        .course-image {
          width: 100%;
          height: 120px;
        }
      }
    }

    .yearly-calendar {
      .heatmap-container {
        overflow-x: auto;
        padding-bottom: 12px;

        .heatmap-grid {
          min-width: 600px;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .progress-view {
    .progress-container {
      padding: 12px;
    }

    .section {
      padding: 20px;
      margin-bottom: 20px;
    }

    .overview-section {
      .overview-cards {
        grid-template-columns: 1fr;
        gap: 12px;

        .overview-card {
          padding: 16px;
        }
      }
    }

    .goals-section {
      padding: 20px;

      .current-goals {
        gap: 16px;

        .goal-card {
          padding: 16px;
        }
      }
    }

    .courses-management-section {
      .courses-grid {
        .course-card-compact {
          .course-thumbnail {
            height: 120px;
          }

          .course-info {
            padding: 12px;
          }
        }
      }
    }
  }
}
</style>
