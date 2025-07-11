<template>
  <div class="course-detail-page">
    <!-- 加载状态 -->
    <div v-if="!course" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>
    
    <!-- 课程内容 -->
    <div v-else>
    <!-- 课程头部信息 -->
    <div class="course-header">
      <div class="course-header-content">
        <div class="course-main-info">
          <div class="course-image">
            <img :src="course?.image" :alt="course?.title" />
            <div class="play-button" @click="startLearning">
              <el-icon size="40"><VideoPlay /></el-icon>
            </div>
          </div>
          <div class="course-info">
            <div class="course-meta">
              <el-tag type="warning" size="large">{{ course?.category }}</el-tag>
              <span class="difficulty">{{ course?.difficulty }}</span>
            </div>
            <h1 class="course-title">{{ course?.title }}</h1>
            <p class="course-description">{{ course?.description }}</p>
            
            <!-- 课程统计信息 -->
            <div class="course-stats">
              <div class="stat-item">
                <el-icon><User /></el-icon>
                <span>{{ course?.studentsCount }}人学习</span>
              </div>
              <div class="stat-item">
                <el-icon><Clock /></el-icon>
                <span>{{ course?.duration }}课时</span>
              </div>
              <div class="stat-item">
                <el-icon><Star /></el-icon>
                <span>{{ course?.rating }}分</span>
              </div>
            </div>

            <!-- 讲师信息 -->
            <div class="instructor-info">
              <img :src="course?.instructor?.avatar" :alt="course?.instructor?.name" class="instructor-avatar" />
              <div class="instructor-details">
                <h3>{{ course?.instructor?.name }}</h3>
                <p>{{ course?.instructor?.title }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 价格和购买区域 -->
        <div class="course-purchase">
          <div class="price-section">
            <div class="current-price">
              <span class="currency">¥</span>
              <span class="price">{{ course?.price }}</span>
            </div>
            <div class="original-price" v-if="course?.originalPrice">
              ¥{{ course?.originalPrice }}
            </div>
          </div>
          
          <div class="action-buttons">
            <el-button 
              type="primary" 
              size="large" 
              class="start-learning-btn"
              @click="startLearning"
            >
              <el-icon><VideoPlay /></el-icon>
              立即学习
            </el-button>
            <el-button 
              size="large" 
              class="add-to-cart-btn"
              @click="addToCart"
            >
              <el-icon><ShoppingCart /></el-icon>
              加入购物车
            </el-button>
          </div>

          <!-- 学习进度 -->
          <div class="learning-progress" v-if="course?.progress !== undefined">
            <div class="progress-info">
              <span>学习进度</span>
              <span>{{ course.progress }}%</span>
            </div>
            <el-progress :percentage="course.progress" color="#ff6b35" />
          </div>
        </div>
      </div>
    </div>

    <!-- 课程内容导航 -->
    <div class="course-content">
      <div class="content-container">
        <el-tabs v-model="activeTab" class="course-tabs">
          <el-tab-pane label="课程大纲" name="outline">
            <div class="course-outline">
              <div class="outline-header">
                <h3>课程目录</h3>
                <p>共{{ course?.chapters?.length }}章节 {{ course?.totalLessons }}课时</p>
              </div>
              
              <div class="chapters-list">
                <div 
                  v-for="(chapter, index) in course?.chapters" 
                  :key="chapter.id"
                  class="chapter-item"
                >
                  <div class="chapter-header" @click="toggleChapter(index)">
                    <div class="chapter-info">
                      <el-icon class="chapter-icon">
                        <Folder v-if="!chapter.expanded" />
                        <FolderOpened v-else />
                      </el-icon>
                      <span class="chapter-title">第{{ index + 1 }}章 {{ chapter.title }}</span>
                      <span class="chapter-duration">{{ chapter.duration }}</span>
                    </div>
                    <el-icon class="expand-icon" :class="{ expanded: chapter.expanded }">
                      <ArrowDown />
                    </el-icon>
                  </div>
                  
                  <div class="lessons-list" v-show="chapter.expanded">
                    <div 
                      v-for="(lesson, lessonIndex) in chapter.lessons"
                      :key="lesson.id"
                      class="lesson-item"
                      @click="playLesson(lesson)"
                    >
                      <div class="lesson-info">
                        <el-icon class="lesson-icon">
                          <VideoPlay v-if="lesson.type === 'video'" />
                          <Document v-else />
                        </el-icon>
                        <span class="lesson-title">{{ lessonIndex + 1 }}. {{ lesson.title }}</span>
                        <span class="lesson-duration">{{ lesson.duration }}</span>
                      </div>
                      <div class="lesson-status">
                        <el-icon v-if="lesson.completed" color="#67C23A">
                          <CircleCheck />
                        </el-icon>
                        <el-icon v-else-if="lesson.locked" color="#C0C4CC">
                          <Lock />
                        </el-icon>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="课程介绍" name="introduction">
            <div class="course-introduction">
              <div class="intro-section">
                <h3>你将学到什么</h3>
                <ul class="learning-goals">
                  <li v-for="goal in course?.learningGoals" :key="goal">
                    <el-icon color="#67C23A"><Check /></el-icon>
                    {{ goal }}
                  </li>
                </ul>
              </div>

              <div class="intro-section">
                <h3>课程详情</h3>
                <div class="course-details" v-html="course?.detailedDescription"></div>
              </div>

              <div class="intro-section">
                <h3>适合人群</h3>
                <ul class="target-audience">
                  <li v-for="audience in course?.targetAudience" :key="audience">
                    <el-icon color="#409EFF"><User /></el-icon>
                    {{ audience }}
                  </li>
                </ul>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="学员评价" name="reviews">
            <div class="course-reviews">
              <div class="reviews-summary">
                <div class="rating-overview">
                  <div class="overall-rating">
                    <span class="rating-score">{{ course?.rating }}</span>
                                      <div class="rating-stars">
                    <el-rate :model-value="course?.rating || 0" disabled show-score text-color="#ff9900" />
                  </div>
                  </div>
                  <div class="rating-distribution">
                    <div v-for="(count, star) in ratingDistribution" :key="star" class="rating-bar">
                      <span>{{ star }}星</span>
                      <el-progress :percentage="(count / totalReviews) * 100" :show-text="false" />
                      <span>{{ count }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="reviews-list">
                <div v-for="review in course?.reviews" :key="review.id" class="review-item">
                  <div class="review-header">
                    <img :src="review.user.avatar" :alt="review.user.name" class="reviewer-avatar" />
                    <div class="reviewer-info">
                      <h4>{{ review.user.name }}</h4>
                      <div class="review-meta">
                        <el-rate :model-value="review.rating" disabled size="small" />
                        <span class="review-date">{{ formatDate(review.date) }}</span>
                      </div>
                    </div>
                  </div>
                  <p class="review-content">{{ review.content }}</p>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 推荐课程 -->
    <div class="recommended-courses">
      <div class="content-container">
        <h3>相关推荐课程</h3>
        <div class="courses-grid">
          <div 
            v-for="relatedCourse in relatedCourses" 
            :key="relatedCourse.id"
            class="course-card"
            @click="goToCourse(relatedCourse.id)"
          >
            <img :src="relatedCourse.image" :alt="relatedCourse.title" />
            <div class="card-content">
              <h4>{{ relatedCourse.title }}</h4>
              <p>{{ relatedCourse.instructor.name }}</p>
              <div class="card-footer">
                <span class="price">¥{{ relatedCourse.price }}</span>
                <span class="students">{{ relatedCourse.studentsCount }}人学习</span>
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
import { useRoute, useRouter } from 'vue-router'
import { 
  VideoPlay, 
  User, 
  Clock, 
  Star, 
  ShoppingCart, 
  Folder, 
  FolderOpened,
  ArrowDown,
  Document,
  CircleCheck,
  Lock,
  Check
} from '@element-plus/icons-vue'
import type { Course } from '@/types/course'
import { courses } from '@/data/mockData'

const route = useRoute()
const router = useRouter()

const activeTab = ref('outline')
const course = ref<Course | null>(null)
const relatedCourses = ref<Course[]>([])

// 评分分布数据
const ratingDistribution = ref({
  5: 156,
  4: 89,
  3: 23,
  2: 8,
  1: 2
})

const totalReviews = computed(() => {
  return Object.values(ratingDistribution.value).reduce((total, count) => total + count, 0)
})

onMounted(() => {
  loadCourseData()
  loadRelatedCourses()
})

const loadCourseData = () => {
  const courseId = route.params.id as string
  course.value = courses.find(c => c.id === courseId) || null
  
  // 为课程添加章节数据
  if (course.value) {
    course.value.chapters = [
      {
        id: '1',
        title: 'Vue3基础入门',
        duration: '45分钟',
        expanded: true,
        lessons: [
          { id: '1-1', title: 'Vue3简介和新特性', duration: '10分钟', type: 'video', completed: true, locked: false },
          { id: '1-2', title: '环境搭建和项目初始化', duration: '15分钟', type: 'video', completed: true, locked: false },
          { id: '1-3', title: '响应式系统原理', duration: '20分钟', type: 'video', completed: false, locked: false }
        ]
      },
      {
        id: '2',
        title: 'Composition API详解',
        duration: '90分钟',
        expanded: false,
        lessons: [
          { id: '2-1', title: 'setup函数基础', duration: '25分钟', type: 'video', completed: false, locked: false },
          { id: '2-2', title: 'ref和reactive', duration: '30分钟', type: 'video', completed: false, locked: false },
          { id: '2-3', title: '计算属性和侦听器', duration: '35分钟', type: 'video', completed: false, locked: true }
        ]
      },
      {
        id: '3',
        title: '组件开发进阶',
        duration: '120分钟',
        expanded: false,
        lessons: [
          { id: '3-1', title: '组件通信方案', duration: '40分钟', type: 'video', completed: false, locked: true },
          { id: '3-2', title: '插槽和作用域插槽', duration: '30分钟', type: 'video', completed: false, locked: true },
          { id: '3-3', title: '动态组件和异步组件', duration: '25分钟', type: 'video', completed: false, locked: true },
          { id: '3-4', title: '项目实战练习', duration: '25分钟', type: 'document', completed: false, locked: true }
        ]
      }
    ]
    
    // 添加学习目标
    course.value.learningGoals = [
      '掌握Vue3的核心概念和新特性',
      '熟练使用Composition API进行开发',
      '理解Vue3的响应式系统原理',
      '能够独立开发Vue3项目',
      '掌握组件开发的最佳实践'
    ]
    
    // 添加详细描述
    course.value.detailedDescription = `
      <p>本课程将从零开始，带你系统学习Vue3框架的核心知识。课程内容涵盖了Vue3的基础概念、Composition API、响应式系统、组件开发等核心内容。</p>
      <p>通过本课程的学习，你将能够：</p>
      <ul>
        <li>深入理解Vue3的设计思想和核心概念</li>
        <li>熟练掌握Composition API的使用方法</li>
        <li>学会如何构建可维护的Vue3应用</li>
        <li>掌握Vue3项目的最佳实践</li>
      </ul>
    `
    
    // 添加目标受众
    course.value.targetAudience = [
      '有JavaScript基础的开发者',
      '希望学习Vue3框架的前端工程师',
      '想要提升前端技能的开发者',
      '对现代前端框架感兴趣的学习者'
    ]
    
    // 添加评价数据
    course.value.reviews = [
      {
        id: '1',
        user: { name: '小明', avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png' },
        rating: 5,
        date: new Date('2024-01-15'),
        content: '老师讲得很好，内容很详细，对Vue3的理解有了很大提升！'
      },
      {
        id: '2',
        user: { name: '张三', avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png' },
        rating: 5,
        date: new Date('2024-01-10'),
        content: '课程内容很实用，跟着老师的节奏学习效果很好。'
      },
      {
        id: '3',
        user: { name: '李四', avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png' },
        rating: 4,
        date: new Date('2024-01-08'),
        content: '整体不错，就是有些地方讲得稍微快了一点。'
      }
    ]
  }
}

const loadRelatedCourses = () => {
  // 加载相关推荐课程
  relatedCourses.value = courses.slice(0, 4)
}

const toggleChapter = (index: number) => {
  if (course.value?.chapters) {
    course.value.chapters[index].expanded = !course.value.chapters[index].expanded
  }
}

const playLesson = (lesson: any) => {
  if (!lesson.locked) {
    router.push(`/course/${course.value?.id}/lesson/${lesson.id}`)
  }
}

const startLearning = () => {
  if (course.value?.chapters?.[0]?.lessons?.[0]) {
    const firstLesson = course.value.chapters[0].lessons[0]
    router.push(`/course/${course.value.id}/lesson/${firstLesson.id}`)
  }
}

const addToCart = () => {
  console.log('添加到购物车:', course.value?.title)
  // 这里可以添加购物车逻辑
}

const goToCourse = (courseId: string) => {
  router.push(`/course/${courseId}`)
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-CN')
}
</script>

<style scoped lang="scss">
.course-detail-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  
  .loading-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
  }
}

.course-header {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  padding: 40px 0;
  
  .course-header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    gap: 40px;
    align-items: flex-start;
  }
}

.course-main-info {
  flex: 1;
  display: flex;
  gap: 30px;
  
  .course-image {
    position: relative;
    width: 300px;
    height: 200px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .play-button {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60px;
      height: 60px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: white;
        transform: translate(-50%, -50%) scale(1.1);
      }
      
      .el-icon {
        color: #ff6b35;
      }
    }
  }
  
  .course-info {
    flex: 1;
    
    .course-meta {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;
      
      .difficulty {
        background: rgba(255, 255, 255, 0.2);
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 14px;
      }
    }
    
    .course-title {
      font-size: 32px;
      font-weight: bold;
      margin: 0 0 15px 0;
      line-height: 1.3;
    }
    
    .course-description {
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 25px;
      opacity: 0.9;
    }
    
    .course-stats {
      display: flex;
      gap: 30px;
      margin-bottom: 25px;
      
      .stat-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        
        .el-icon {
          opacity: 0.8;
        }
      }
    }
    
    .instructor-info {
      display: flex;
      align-items: center;
      gap: 15px;
      
      .instructor-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 3px solid rgba(255, 255, 255, 0.3);
      }
      
      .instructor-details {
        h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }
        
        p {
          margin: 5px 0 0 0;
          opacity: 0.8;
          font-size: 14px;
        }
      }
    }
  }
}

.course-purchase {
  width: 300px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 30px;
  
  .price-section {
    text-align: center;
    margin-bottom: 25px;
    
    .current-price {
      .currency {
        font-size: 20px;
        vertical-align: top;
      }
      
      .price {
        font-size: 36px;
        font-weight: bold;
      }
    }
    
    .original-price {
      font-size: 16px;
      opacity: 0.7;
      text-decoration: line-through;
      margin-top: 5px;
    }
  }
  
  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 25px;
    
    .el-button {
      height: 48px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 8px;
      
      &.start-learning-btn {
        background: white;
        color: #ff6b35;
        border: none;
        
        &:hover {
          background: #f0f0f0;
        }
      }
      
      &.add-to-cart-btn {
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
        
        &:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      }
    }
  }
  
  .learning-progress {
    .progress-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 14px;
    }
  }
}

.course-content {
  background: white;
  
  .content-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
  }
  
  .course-tabs {
    :deep(.el-tabs__header) {
      margin-bottom: 30px;
      
      .el-tabs__nav-wrap {
        &::after {
          background-color: #e4e7ed;
        }
      }
      
      .el-tabs__item {
        font-size: 16px;
        font-weight: 600;
        color: #606266;
        
        &.is-active {
          color: #ff6b35;
        }
      }
      
      .el-tabs__active-bar {
        background-color: #ff6b35;
      }
    }
  }
}

.course-outline {
  .outline-header {
    margin-bottom: 30px;
    
    h3 {
      margin: 0 0 10px 0;
      font-size: 24px;
      color: #303133;
    }
    
    p {
      margin: 0;
      color: #909399;
      font-size: 14px;
    }
  }
  
  .chapters-list {
    .chapter-item {
      border: 1px solid #e4e7ed;
      border-radius: 8px;
      margin-bottom: 16px;
      overflow: hidden;
      
      .chapter-header {
        padding: 20px;
        background: #f8f9fa;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: background-color 0.3s ease;
        
        &:hover {
          background: #ecf5ff;
        }
        
        .chapter-info {
          display: flex;
          align-items: center;
          gap: 12px;
          
          .chapter-icon {
            color: #ff6b35;
            font-size: 18px;
          }
          
          .chapter-title {
            font-size: 16px;
            font-weight: 600;
            color: #303133;
          }
          
          .chapter-duration {
            color: #909399;
            font-size: 14px;
          }
        }
        
        .expand-icon {
          transition: transform 0.3s ease;
          
          &.expanded {
            transform: rotate(180deg);
          }
        }
      }
      
      .lessons-list {
        .lesson-item {
          padding: 16px 20px;
          border-top: 1px solid #e4e7ed;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background-color 0.3s ease;
          
          &:hover {
            background: #f8f9fa;
          }
          
          .lesson-info {
            display: flex;
            align-items: center;
            gap: 12px;
            
            .lesson-icon {
              color: #909399;
              font-size: 16px;
            }
            
            .lesson-title {
              color: #303133;
              font-size: 14px;
            }
            
            .lesson-duration {
              color: #909399;
              font-size: 12px;
            }
          }
          
          .lesson-status {
            .el-icon {
              font-size: 18px;
            }
          }
        }
      }
    }
  }
}

.course-introduction {
  .intro-section {
    margin-bottom: 40px;
    
    h3 {
      margin: 0 0 20px 0;
      font-size: 20px;
      color: #303133;
    }
    
    .learning-goals,
    .target-audience {
      list-style: none;
      padding: 0;
      margin: 0;
      
      li {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;
        
        &:last-child {
          border-bottom: none;
        }
      }
    }
    
    .course-details {
      line-height: 1.8;
      color: #606266;
      
      :deep(p) {
        margin-bottom: 16px;
      }
      
      :deep(ul) {
        padding-left: 20px;
        
        li {
          margin-bottom: 8px;
        }
      }
    }
  }
}

.course-reviews {
  .reviews-summary {
    margin-bottom: 40px;
    
    .rating-overview {
      display: flex;
      gap: 40px;
      align-items: center;
      
      .overall-rating {
        text-align: center;
        
        .rating-score {
          font-size: 48px;
          font-weight: bold;
          color: #ff6b35;
          display: block;
          margin-bottom: 10px;
        }
        
        .rating-stars {
          :deep(.el-rate) {
            .el-rate__icon {
              font-size: 20px;
            }
          }
        }
      }
      
      .rating-distribution {
        flex: 1;
        
        .rating-bar {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 10px;
          
          span:first-child {
            width: 40px;
            font-size: 14px;
            color: #606266;
          }
          
          .el-progress {
            flex: 1;
            
            :deep(.el-progress-bar__outer) {
              background-color: #f0f0f0;
            }
            
            :deep(.el-progress-bar__inner) {
              background-color: #ff6b35;
            }
          }
          
          span:last-child {
            width: 30px;
            text-align: right;
            font-size: 14px;
            color: #909399;
          }
        }
      }
    }
  }
  
  .reviews-list {
    .review-item {
      padding: 24px;
      border: 1px solid #e4e7ed;
      border-radius: 8px;
      margin-bottom: 16px;
      
      .review-header {
        display: flex;
        gap: 15px;
        margin-bottom: 15px;
        
        .reviewer-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
        }
        
        .reviewer-info {
          h4 {
            margin: 0 0 8px 0;
            font-size: 16px;
            color: #303133;
          }
          
          .review-meta {
            display: flex;
            align-items: center;
            gap: 15px;
            
            .review-date {
              color: #909399;
              font-size: 12px;
            }
          }
        }
      }
      
      .review-content {
        margin: 0;
        line-height: 1.6;
        color: #606266;
      }
    }
  }
}

.recommended-courses {
  background: #f8f9fa;
  padding: 60px 0;
  
  .content-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    
    h3 {
      margin: 0 0 30px 0;
      font-size: 24px;
      color: #303133;
    }
  }
  
  .courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    
    .course-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      }
      
      img {
        width: 100%;
        height: 160px;
        object-fit: cover;
      }
      
      .card-content {
        padding: 20px;
        
        h4 {
          margin: 0 0 10px 0;
          font-size: 16px;
          color: #303133;
          font-weight: 600;
          line-height: 1.4;
        }
        
        p {
          margin: 0 0 15px 0;
          color: #909399;
          font-size: 14px;
        }
        
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .price {
            color: #ff6b35;
            font-size: 18px;
            font-weight: bold;
          }
          
          .students {
            color: #909399;
            font-size: 12px;
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .course-header {
    .course-header-content {
      flex-direction: column;
      gap: 30px;
    }
    
    .course-main-info {
      flex-direction: column;
      gap: 20px;
      
      .course-image {
        width: 100%;
        max-width: 300px;
        margin: 0 auto;
      }
    }
    
    .course-purchase {
      width: 100%;
    }
  }
  
  .rating-overview {
    flex-direction: column !important;
    gap: 20px !important;
  }
  
  .courses-grid {
    grid-template-columns: 1fr !important;
  }
}
</style> 