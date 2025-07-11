<template>
  <div class="courses-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="container">
        <div class="header-content">
          <h1 class="page-title">全部课程</h1>
          <p class="page-subtitle">发现适合你的学习内容，开启技能提升之旅</p>
        </div>
        
        <!-- 搜索栏 -->
        <div class="search-section">
          <el-input
            v-model="searchQuery"
            placeholder="搜索课程、讲师或技能关键词..."
            class="search-input"
            size="large"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-section">
      <div class="container">
        <div class="filter-tabs">
          <div class="filter-group">
            <span class="filter-label">分类：</span>
            <div class="filter-options">
              <button
                v-for="category in categories"
                :key="category.key"
                class="filter-btn"
                :class="{ active: selectedCategory === category.key }"
                @click="setCategory(category.key)"
              >
                {{ category.label }}
              </button>
            </div>
          </div>
          
          <div class="filter-group">
            <span class="filter-label">难度：</span>
            <div class="filter-options">
              <button
                v-for="level in levels"
                :key="level.key"
                class="filter-btn"
                :class="{ active: selectedLevel === level.key }"
                @click="setLevel(level.key)"
              >
                {{ level.label }}
              </button>
            </div>
          </div>
          
          <div class="filter-group">
            <span class="filter-label">排序：</span>
            <el-select v-model="sortBy" class="sort-select" @change="handleSort">
              <el-option label="最新发布" value="newest" />
              <el-option label="最受欢迎" value="popular" />
              <el-option label="评分最高" value="rating" />
              <el-option label="价格从低到高" value="price-asc" />
              <el-option label="价格从高到低" value="price-desc" />
            </el-select>
          </div>
        </div>
      </div>
    </div>

    <!-- 课程列表 -->
    <div class="courses-section">
      <div class="container">
        <!-- 结果统计 -->
        <div class="results-info">
          <span>找到 {{ filteredCourses.length }} 门课程</span>
          <div class="view-toggle">
            <el-button-group>
              <el-button
                :type="viewMode === 'grid' ? 'primary' : 'default'"
                @click="viewMode = 'grid'"
              >
                <el-icon><Grid /></el-icon>
              </el-button>
              <el-button
                :type="viewMode === 'list' ? 'primary' : 'default'"
                @click="viewMode = 'list'"
              >
                <el-icon><List /></el-icon>
              </el-button>
            </el-button-group>
          </div>
        </div>

        <!-- 网格视图 -->
        <div v-if="viewMode === 'grid'" class="courses-grid">
          <div
            v-for="course in paginatedCourses"
            :key="course.id"
            class="course-card"
            @click="gotoCourse(course.id)"
          >
            <div class="course-image">
              <img :src="course.image" :alt="course.title" />
              <div v-if="course.badge" class="course-badge">{{ course.badge }}</div>
            </div>
            
            <div class="course-content">
              <div class="course-header">
                <h3 class="course-title">{{ course.title }}</h3>
                <div class="course-meta">
                  <span class="course-level">{{ course.difficulty }}</span>
                  <span class="course-students">{{ course.studentsCount }}人学习</span>
                </div>
              </div>
              
              <p class="course-description">{{ course.description }}</p>
              
              <div class="course-footer">
                <div class="instructor-info">
                  <img 
                    :src="course.instructor.avatar" 
                    :alt="course.instructor.name"
                    class="instructor-avatar"
                  />
                  <span class="instructor-name">{{ course.instructor.name }}</span>
                </div>
                
                <div class="course-rating">
                  <el-rate
                    v-model="course.rating"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value}"
                  />
                  <span class="review-count">({{ course.reviewCount }})</span>
                </div>
                
                <div class="course-price">
                  <span v-if="course.originalPrice" class="original-price">¥{{ course.originalPrice }}</span>
                  <span class="current-price">¥{{ course.price }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 列表视图 -->
        <div v-else class="courses-list">
          <div
            v-for="course in paginatedCourses"
            :key="course.id"
            class="course-list-item"
            @click="gotoCourse(course.id)"
          >
            <div class="course-image">
              <img :src="course.image" :alt="course.title" />
              <div v-if="course.badge" class="course-badge">{{ course.badge }}</div>
            </div>
            
            <div class="course-info">
              <div class="course-header">
                <h3 class="course-title">{{ course.title }}</h3>
                <div class="course-meta">
                  <span class="course-level">{{ course.difficulty }}</span>
                  <span class="course-duration">{{ course.duration }}</span>
                  <span class="course-students">{{ course.studentsCount }}人学习</span>
                </div>
              </div>
              
              <p class="course-description">{{ course.description }}</p>
              
              <div class="course-skills">
                <el-tag
                  v-for="skill in course.skills.slice(0, 4)"
                  :key="skill"
                  size="small"
                  type="info"
                >
                  {{ skill }}
                </el-tag>
              </div>
              
              <div class="course-instructor">
                <img 
                  :src="course.instructor.avatar" 
                  :alt="course.instructor.name"
                  class="instructor-avatar"
                />
                <span class="instructor-name">{{ course.instructor.name }}</span>
                <span class="instructor-title">{{ course.instructor.title }}</span>
              </div>
            </div>
            
            <div class="course-actions">
              <div class="course-rating">
                <el-rate
                  v-model="course.rating"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}"
                />
                <span class="review-count">({{ course.reviewCount }})</span>
              </div>
              
              <div class="course-price">
                <span v-if="course.originalPrice" class="original-price">¥{{ course.originalPrice }}</span>
                <span class="current-price">¥{{ course.price }}</span>
              </div>
              
              <el-button type="primary" size="large" class="enroll-btn">
                立即学习
              </el-button>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination-section">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[12, 24, 48]"
            :total="filteredCourses.length"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Search, Grid, List } from '@element-plus/icons-vue'
import type { Course } from '@/types/course'
import { courses } from '@/data/mockData'

const router = useRouter()
const route = useRoute()

// 搜索和筛选状态
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedLevel = ref('all')
const sortBy = ref('newest')
const viewMode = ref<'grid' | 'list'>('grid')

// 分页状态
const currentPage = ref(1)
const pageSize = ref(12)

// 筛选选项
const categories = [
  { key: 'all', label: '全部' },
  { key: '前端开发', label: '前端开发' },
  { key: '后端开发', label: '后端开发' },
  { key: 'AI人工智能', label: 'AI人工智能' },
  { key: '移动开发', label: '移动开发' },
  { key: '架构设计', label: '架构设计' }
]

const levels = [
  { key: 'all', label: '全部' },
  { key: '初级', label: '初级' },
  { key: '中级', label: '中级' },
  { key: '高级', label: '高级' }
]

// 课程数据
const allCourses = ref<Course[]>([])

// 计算筛选后的课程
const filteredCourses = computed(() => {
  let result = [...allCourses.value]

  // 搜索筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(course =>
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query) ||
      course.instructor.name.toLowerCase().includes(query) ||
      course.skills.some(skill => skill.toLowerCase().includes(query))
    )
  }

  // 分类筛选
  if (selectedCategory.value !== 'all') {
    result = result.filter(course => course.category === selectedCategory.value)
  }

  // 难度筛选
  if (selectedLevel.value !== 'all') {
    result = result.filter(course => course.difficulty === selectedLevel.value)
  }

  // 排序
  switch (sortBy.value) {
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    case 'popular':
      result.sort((a, b) => b.studentsCount - a.studentsCount)
      break
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
    case 'price-asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.price - a.price)
      break
  }

  return result
})

// 计算分页后的课程
const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredCourses.value.slice(start, end)
})

// 事件处理
const handleSearch = () => {
  currentPage.value = 1
}

const setCategory = (category: string) => {
  selectedCategory.value = category
  currentPage.value = 1
}

const setLevel = (level: string) => {
  selectedLevel.value = level
  currentPage.value = 1
}

const handleSort = () => {
  currentPage.value = 1
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
}

const gotoCourse = (courseId: string) => {
  router.push(`/course/${courseId}`)
}

// 监听路由参数变化
watch(() => route.query, (newQuery) => {
  if (newQuery.search) {
    searchQuery.value = String(newQuery.search)
  }
  if (newQuery.instructor) {
    // 根据讲师ID筛选课程
    selectedCategory.value = 'all'
  }
}, { immediate: true })

onMounted(() => {
  allCourses.value = courses
  
  // 初始化搜索参数
  if (route.query.search) {
    searchQuery.value = String(route.query.search)
  }
})
</script>

<style scoped lang="scss">
.courses-view {
  min-height: 100vh;
  background: #f5f7fa;
}

// 页面头部
.page-header {
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  color: white;
  padding: 60px 0;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .header-content {
    text-align: center;
    margin-bottom: 40px;
    
    .page-title {
      font-size: 42px;
      font-weight: 700;
      margin: 0 0 16px 0;
    }
    
    .page-subtitle {
      font-size: 18px;
      margin: 0;
      opacity: 0.9;
    }
  }
  
  .search-section {
    max-width: 600px;
    margin: 0 auto;
    
    .search-input {
      :deep(.el-input__wrapper) {
        background: white;
        border-radius: 24px;
        padding: 0 20px;
        height: 48px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      }
      
      :deep(.el-input__inner) {
        font-size: 16px;
      }
    }
  }
}

// 筛选栏
.filter-section {
  background: white;
  border-bottom: 1px solid #e4e7ed;
  padding: 20px 0;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .filter-tabs {
    display: flex;
    align-items: center;
    gap: 40px;
    flex-wrap: wrap;
    
    .filter-group {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .filter-label {
        font-size: 14px;
        color: #595959;
        font-weight: 500;
        white-space: nowrap;
      }
      
      .filter-options {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        
        .filter-btn {
          padding: 6px 16px;
          border: 1px solid #d9d9d9;
          background: white;
          color: #595959;
          border-radius: 20px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          
          &:hover {
            border-color: #1890ff;
            color: #1890ff;
          }
          
          &.active {
            background: #1890ff;
            border-color: #1890ff;
            color: white;
          }
        }
      }
      
      .sort-select {
        width: 140px;
      }
    }
  }
}

// 课程区域
.courses-section {
  padding: 40px 0;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .results-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    
    span {
      font-size: 16px;
      color: #595959;
    }
  }
}

// 网格视图
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
  
  .course-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
    cursor: pointer;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .course-image {
      position: relative;
      aspect-ratio: 16/9;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .course-badge {
        position: absolute;
        top: 12px;
        right: 12px;
        background: #ff4d4f;
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
      }
    }
    
    .course-content {
      padding: 20px;
      
      .course-header {
        margin-bottom: 12px;
        
        .course-title {
          font-size: 16px;
          font-weight: 600;
          color: #262626;
          margin: 0 0 8px 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .course-meta {
          display: flex;
          gap: 12px;
          font-size: 12px;
          color: #8c8c8c;
          
          .course-level {
            background: #f0f0f0;
            padding: 2px 6px;
            border-radius: 4px;
          }
        }
      }
      
      .course-description {
        font-size: 14px;
        color: #595959;
        line-height: 1.5;
        margin: 0 0 16px 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .course-footer {
        .instructor-info {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          
          .instructor-avatar {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            margin-right: 8px;
          }
          
          .instructor-name {
            font-size: 14px;
            color: #595959;
          }
        }
        
        .course-rating {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          
          :deep(.el-rate) {
            height: auto;
          }
          
          .review-count {
            font-size: 12px;
            color: #8c8c8c;
            margin-left: 8px;
          }
        }
        
        .course-price {
          display: flex;
          align-items: center;
          gap: 8px;
          
          .original-price {
            font-size: 14px;
            color: #8c8c8c;
            text-decoration: line-through;
          }
          
          .current-price {
            font-size: 18px;
            font-weight: 600;
            color: #ff4d4f;
          }
        }
      }
    }
  }
}

// 列表视图
.courses-list {
  margin-bottom: 40px;
  
  .course-list-item {
    background: white;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    gap: 24px;
    
    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }
    
    .course-image {
      position: relative;
      width: 200px;
      aspect-ratio: 16/9;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .course-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        background: #ff4d4f;
        color: white;
        padding: 4px 8px;
        border-radius: 8px;
        font-size: 12px;
      }
    }
    
    .course-info {
      flex: 1;
      
      .course-header {
        margin-bottom: 12px;
        
        .course-title {
          font-size: 20px;
          font-weight: 600;
          color: #262626;
          margin: 0 0 8px 0;
        }
        
        .course-meta {
          display: flex;
          gap: 16px;
          font-size: 14px;
          color: #8c8c8c;
          
          .course-level {
            background: #f0f0f0;
            padding: 2px 8px;
            border-radius: 4px;
          }
        }
      }
      
      .course-description {
        font-size: 14px;
        color: #595959;
        line-height: 1.6;
        margin: 0 0 16px 0;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .course-skills {
        margin-bottom: 16px;
        
        .el-tag {
          margin-right: 8px;
          margin-bottom: 4px;
        }
      }
      
      .course-instructor {
        display: flex;
        align-items: center;
        
        .instructor-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          margin-right: 12px;
        }
        
        .instructor-name {
          font-size: 14px;
          font-weight: 500;
          color: #262626;
          margin-right: 8px;
        }
        
        .instructor-title {
          font-size: 12px;
          color: #8c8c8c;
        }
      }
    }
    
    .course-actions {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: space-between;
      min-width: 200px;
      
      .course-rating {
        display: flex;
        align-items: center;
        
        .review-count {
          font-size: 12px;
          color: #8c8c8c;
          margin-left: 8px;
        }
      }
      
      .course-price {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
        
        .original-price {
          font-size: 14px;
          color: #8c8c8c;
          text-decoration: line-through;
        }
        
        .current-price {
          font-size: 24px;
          font-weight: 600;
          color: #ff4d4f;
        }
      }
      
      .enroll-btn {
        width: 120px;
      }
    }
  }
}

// 分页
.pagination-section {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

// 响应式设计
@media (max-width: 768px) {
  .filter-tabs {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 16px !important;
  }
  
  .courses-grid {
    grid-template-columns: 1fr;
  }
  
  .course-list-item {
    flex-direction: column !important;
    
    .course-image {
      width: 100% !important;
    }
    
    .course-actions {
      flex-direction: row !important;
      align-items: center !important;
      min-width: auto !important;
    }
  }
  
  .results-info {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 16px;
  }
}
</style> 