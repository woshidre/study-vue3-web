<template>
  <div class="learning-paths-view">
    <!-- 页面头部 -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">AI大模型前沿知识</h1>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">19</span>
              <span class="stat-label">门课程</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">126</span>
              <span class="stat-label">小时</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">22.7w</span>
              <span class="stat-label">人学习</span>
            </div>
          </div>
          <p class="hero-description">
            ChatGPT 爆火，AI 大模型涌现，整个 AI 行业蓬勃发展，为了跟上时代节拍，整理了 200+ 份专业资料，把控AI一线资讯全栈技术趋势。
          </p>
        </div>
      </div>
    </section>

    <!-- 课程列表 -->
    <section class="courses-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">学习资源</h2>
          <div class="filter-tabs">
            <span 
              v-for="filter in filterTabs" 
              :key="filter.id"
              class="filter-tab"
              :class="{ active: activeFilter === filter.id }"
              @click="activeFilter = filter.id"
            >
              {{ filter.name }}
            </span>
          </div>
        </div>

        <div class="courses-list">
          <div 
            v-for="course in filteredPathCourses" 
            :key="course.id"
            class="course-item"
            @click="goToCourse(course.id)"
          >
            <div class="course-avatar">
              <img :src="course.instructor.avatar" :alt="course.instructor.name" />
            </div>
            <div class="course-content">
              <div class="course-header">
                <h3 class="course-title">{{ course.title }}</h3>
                <div class="course-meta">
                  <span class="course-date">{{ formatDate(course.createdAt) }}</span>
                  <span class="course-views">{{ course.studentsCount }}次观看</span>
                </div>
              </div>
              <p class="course-description">{{ course.description }}</p>
              <div class="course-instructor-info">
                <span class="instructor-name">{{ course.instructor.name }}</span>
                <span class="instructor-title">{{ course.instructor.title }}</span>
              </div>
              <div class="course-tags">
                <span 
                  v-for="skill in course.skills.slice(0, 3)" 
                  :key="skill"
                  class="course-tag"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
            <div class="course-actions">
              <el-button type="primary" class="learn-btn">
                免费学习
              </el-button>
            </div>
          </div>
        </div>

        <!-- 加载更多 -->
        <div class="load-more" v-if="hasMore">
          <el-button @click="loadMoreCourses" :loading="loading">
            加载更多
          </el-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { courses, mockLearningPaths } from '@/data/mockData'

const router = useRouter()

// 筛选标签
const filterTabs = ref([
  { id: 'all', name: '全部' },
  { id: 'ai', name: 'AI大模型' },
  { id: 'frontend', name: '前端开发' },
  { id: 'backend', name: '后端开发' },
  { id: 'mobile', name: '移动开发' }
])

const activeFilter = ref('all')
const loading = ref(false)
const hasMore = ref(true)

// 模拟学习路径中的课程数据
const pathCourses = ref([
      ...courses,
  // 添加更多AI相关课程
  {
    id: '5',
    title: 'MCP & A2A 前沿实战',
    description: '掌握 AI "通讯员"，加速构建智能应用。深入学习 MCP 协议的设计理念、核心特性，以及在实际项目中的应用。',
    image: '/placeholder-course.jpg',
    price: 89,
    originalPrice: 199,
    category: 'ai',
    level: 'advanced' as const,
    badge: '热门',
    instructor: courses[2].instructor,
    studentsCount: 15600,
    rating: 4.9,
    reviewCount: 892,
    duration: '15课时',
    chaptersCount: 8,
    chapters: [],
    skills: ['MCP协议', 'AI通信', 'Agent开发', 'API集成'],
    requirements: ['AI基础概念', 'Python编程'],
    features: ['实战项目', '源码下载', '专家答疑'],
    createdAt: '2024-02-10',
    updatedAt: '2024-02-12',
    isHot: true
  },
  {
    id: '6',
    title: '程序员的AI工具链',
    description: '程序员必备的AI工具，从GPT到Copilot的编程辅助工具，提升开发效率的最佳实践。',
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    price: 0,
    category: 'ai',
    level: 'beginner' as const,
    instructor: courses[2].instructor,
    studentsCount: 28900,
    rating: 4.7,
    reviewCount: 1256,
    duration: '12课时',
    chaptersCount: 6,
    chapters: [],
    skills: ['AI工具', 'GitHub Copilot', 'ChatGPT', '效率提升'],
    requirements: ['编程基础'],
    features: ['免费课程', '工具推荐', '实用技巧'],
    createdAt: '2024-01-28',
    updatedAt: '2024-02-01'
  },
  {
    id: '7',
    title: 'DeepSeek及其应用实践',
    description: 'DeepSeek 模型架构解析，了解国产大模型的技术特点和实际应用场景。',
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    price: 199,
    category: 'ai',
    level: 'intermediate' as const,
    instructor: courses[2].instructor,
    studentsCount: 8900,
    rating: 4.8,
    reviewCount: 456,
    duration: '13课时',
    chaptersCount: 7,
    chapters: [],
    skills: ['DeepSeek', '大模型', '模型部署', 'AI应用'],
    requirements: ['机器学习基础', 'Python编程'],
    features: ['模型实战', '部署指南', '案例分析'],
    createdAt: '2024-02-05',
    updatedAt: '2024-02-08'
  }
])

const filteredPathCourses = computed(() => {
  if (activeFilter.value === 'all') {
    return pathCourses.value
  }
  return pathCourses.value.filter(course => course.category === activeFilter.value)
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) {
    return '1天前更新'
  } else if (diffDays <= 7) {
    return `${diffDays}天前更新`
  } else if (diffDays <= 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks}周前更新`
  } else {
    const months = Math.floor(diffDays / 30)
    return `${months}个月前更新`
  }
}

const goToCourse = (courseId: string) => {
  router.push(`/course/${courseId}`)
}

const loadMoreCourses = () => {
  loading.value = true
  // 模拟加载更多数据
  setTimeout(() => {
    loading.value = false
    hasMore.value = false // 模拟没有更多数据
  }, 1000)
}
</script>

<style scoped lang="scss">
.learning-paths-view {
  .hero-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 80px 0;
    
    .hero-content {
      text-align: center;
      
      .hero-title {
        font-size: 48px;
        font-weight: 700;
        margin-bottom: 32px;
        line-height: 1.2;
      }
      
      .hero-stats {
        display: flex;
        justify-content: center;
        gap: 48px;
        margin-bottom: 32px;
        
        .stat-item {
          text-align: center;
          
          .stat-number {
            display: block;
            font-size: 36px;
            font-weight: 700;
            color: #ffd700;
            line-height: 1;
          }
          
          .stat-label {
            font-size: 14px;
            opacity: 0.9;
            margin-top: 4px;
          }
        }
      }
      
      .hero-description {
        font-size: 18px;
        line-height: 1.6;
        opacity: 0.9;
        max-width: 800px;
        margin: 0 auto;
      }
    }
  }

  .courses-section {
    padding: 80px 0;
    
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
      
      .filter-tabs {
        display: flex;
        gap: 24px;
        
        .filter-tab {
          padding: 8px 16px;
          font-size: 16px;
          color: var(--text-secondary);
          cursor: pointer;
          border-radius: 20px;
          transition: all 0.3s ease;
          
          &:hover, &.active {
            color: var(--primary-color);
            background: rgba(255, 107, 53, 0.1);
          }
        }
      }
    }
    
    .courses-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
      
      .course-item {
        display: flex;
        align-items: flex-start;
        gap: 20px;
        padding: 24px;
        background: var(--background-color);
        border-radius: 16px;
        border: 1px solid var(--border-color);
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
          border-color: var(--primary-color);
        }
        
        .course-avatar {
          flex-shrink: 0;
          
          img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            object-fit: cover;
          }
        }
        
        .course-content {
          flex: 1;
          
          .course-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
            
            .course-title {
              font-size: 20px;
              font-weight: 600;
              color: var(--text-primary);
              line-height: 1.4;
              margin-right: 16px;
            }
            
            .course-meta {
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              gap: 4px;
              flex-shrink: 0;
              
              .course-date,
              .course-views {
                font-size: 12px;
                color: var(--text-light);
              }
            }
          }
          
          .course-description {
            font-size: 14px;
            color: var(--text-secondary);
            line-height: 1.5;
            margin-bottom: 12px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .course-instructor-info {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
            
            .instructor-name {
              font-size: 14px;
              font-weight: 500;
              color: var(--text-primary);
            }
            
            .instructor-title {
              font-size: 12px;
              color: var(--text-light);
            }
          }
          
          .course-tags {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            
            .course-tag {
              padding: 4px 8px;
              background: rgba(255, 107, 53, 0.1);
              color: var(--primary-color);
              border-radius: 12px;
              font-size: 12px;
              font-weight: 500;
            }
          }
        }
        
        .course-actions {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          
          .learn-btn {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            border: none;
            border-radius: 20px;
            padding: 12px 24px;
            font-size: 14px;
            font-weight: 500;
          }
        }
      }
    }
    
    .load-more {
      text-align: center;
      margin-top: 48px;
      
      .el-button {
        padding: 12px 32px;
        border-radius: 20px;
        font-size: 16px;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .learning-paths-view {
    .hero-section {
      padding: 40px 0;
      
      .hero-content {
        .hero-title {
          font-size: 32px;
          margin-bottom: 24px;
        }
        
        .hero-stats {
          gap: 24px;
          margin-bottom: 24px;
          
          .stat-item {
            .stat-number {
              font-size: 28px;
            }
          }
        }
        
        .hero-description {
          font-size: 16px;
        }
      }
    }
    
    .courses-section {
      padding: 40px 0;
      
      .section-header {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
        
        .section-title {
          font-size: 24px;
        }
        
        .filter-tabs {
          gap: 12px;
          flex-wrap: wrap;
        }
      }
      
      .courses-list {
        .course-item {
          flex-direction: column;
          text-align: center;
          
          .course-content {
            .course-header {
              flex-direction: column;
              align-items: center;
              gap: 8px;
              
              .course-meta {
                align-items: center;
              }
            }
            
            .course-instructor-info {
              justify-content: center;
            }
            
            .course-tags {
              justify-content: center;
            }
          }
        }
      }
    }
  }
}
</style> 