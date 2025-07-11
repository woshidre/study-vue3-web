<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  mockBanners, 
  mockCategories, 
  courses, 
  mockInstructors 
} from '@/data/mockData'

const router = useRouter()

// 使用Mock数据
const bannerList = ref(mockBanners)
const categoriesList = ref(mockCategories)
const coursesList = ref(courses)
const instructorsList = ref(mockInstructors)

// 课程标签
const courseTabs = ref([
  { id: 'all', name: '全部' },
  { id: 'frontend', name: '前端' },
  { id: 'backend', name: '后端' },
  { id: 'ai', name: 'AI/大数据' },
  { id: 'mobile', name: '移动开发' }
])

const activeTab = ref('all')

const filteredCourses = computed(() => {
  if (activeTab.value === 'all') {
    return coursesList.value
  }
  return coursesList.value.filter(course => course.category === activeTab.value)
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
</script>

<template>
  <div class="home-view">
    <!-- 轮播图区域 -->
    <section class="hero-section">
      <div class="container">
        <el-carousel height="400px" :interval="5000" arrow="hover">
          <el-carousel-item v-for="item in bannerList" :key="item.id">
            <div class="banner-item" :style="{ background: item.gradient }">
              <div class="banner-content">
                <div class="banner-text">
                  <h1 class="banner-title">{{ item.title }}</h1>
                  <p class="banner-subtitle">{{ item.subtitle }}</p>
                  <div class="banner-price">
                    <span class="current-price">{{ item.price }}</span>
                    <span class="original-price">{{ item.originalPrice }}</span>
                  </div>
                  <el-button type="primary" size="large" class="banner-btn" @click="goToLink(item.link)">
                    立即购买
                  </el-button>
                </div>
                <div class="banner-image">
                  <img :src="item.image" :alt="item.title" />
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
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
                <img :src="course.instructor.avatar" :alt="course.instructor.name" class="instructor-avatar" />
                <span class="instructor-name">{{ course.instructor.name }}</span>
              </div>
              <div class="course-footer">
                <div class="course-price">
                  <span class="current-price">¥{{ course.price }}</span>
                  <span class="original-price" v-if="course.originalPrice">¥{{ course.originalPrice }}</span>
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
          <div 
            v-for="instructor in instructorsList" 
            :key="instructor.id"
            class="instructor-card"
          >
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
  .hero-section {
    background: var(--background-light);
    
    .banner-item {
      height: 400px;
      border-radius: 12px;
      margin: 0 8px;
      overflow: hidden;
      
      .banner-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 100%;
        padding: 60px;
        
        .banner-text {
          flex: 1;
          color: white;
          
          .banner-title {
            font-size: 48px;
            font-weight: 700;
            margin-bottom: 16px;
            line-height: 1.2;
          }
          
          .banner-subtitle {
            font-size: 18px;
            margin-bottom: 24px;
            opacity: 0.9;
          }
          
          .banner-price {
            margin-bottom: 32px;
            
            .current-price {
              font-size: 36px;
              font-weight: 700;
              color: #ffd700;
              margin-right: 12px;
            }
            
            .original-price {
              font-size: 18px;
              text-decoration: line-through;
              opacity: 0.7;
            }
          }
          
          .banner-btn {
            padding: 16px 32px;
            font-size: 16px;
            border-radius: 25px;
          }
        }
        
        .banner-image {
          flex-shrink: 0;
          margin-left: 40px;
          
          img {
            width: 300px;
            height: 200px;
            object-fit: cover;
            border-radius: 12px;
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
          
          &:hover, &.active {
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

// 响应式设计
@media (max-width: 768px) {
  .home-view {
    .hero-section {
      .banner-item {
        .banner-content {
          flex-direction: column;
          text-align: center;
          padding: 40px 20px;
          
          .banner-text {
            .banner-title {
              font-size: 32px;
            }
            
            .banner-subtitle {
              font-size: 16px;
            }
            
            .banner-price {
              .current-price {
                font-size: 28px;
              }
            }
          }
          
          .banner-image {
            margin-left: 0;
            margin-top: 20px;
            
            img {
              width: 200px;
              height: 140px;
            }
          }
        }
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
</style>
