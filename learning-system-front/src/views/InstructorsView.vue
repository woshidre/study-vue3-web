<template>
  <div class="instructors-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="container">
        <div class="header-content">
          <h1 class="page-title">名师团队</h1>
          <p class="page-subtitle">汇聚行业顶尖专家，为你提供最专业的技术指导</p>
        </div>
      </div>
    </div>

    <!-- 讲师列表 -->
    <div class="instructors-section">
      <div class="container">
        <div class="instructors-grid">
          <div
            v-for="instructor in instructors"
            :key="instructor.id"
            class="instructor-card"
            @click="viewInstructorDetail(instructor.id)"
          >
            <div class="instructor-avatar">
              <img :src="instructor.avatar" :alt="instructor.name" />
            </div>
            
            <div class="instructor-info">
              <h3 class="instructor-name">{{ instructor.name }}</h3>
              <p class="instructor-title">{{ instructor.title }}</p>
              <p class="instructor-description">{{ instructor.description }}</p>
              
              <div class="instructor-stats">
                <div class="stat-item">
                  <span class="stat-number">{{ instructor.experience }}</span>
                  <span class="stat-label">年经验</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ instructor.coursesCount }}</span>
                  <span class="stat-label">门课程</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ formatStudentCount(instructor.studentsCount) }}</span>
                  <span class="stat-label">学员</span>
                </div>
              </div>
              
              <div class="instructor-specialties">
                <h4>擅长领域</h4>
                <div class="specialties-list">
                  <el-tag
                    v-for="specialty in instructor.specialties"
                    :key="specialty"
                    size="small"
                    type="info"
                  >
                    {{ specialty }}
                  </el-tag>
                </div>
              </div>
              
              <div class="instructor-actions">
                <el-button type="primary" @click.stop="viewCourses(instructor.id)">
                  查看课程 ({{ instructor.coursesCount }})
                </el-button>
                <el-button @click.stop="followInstructor(instructor.id)">
                  <el-icon><Plus /></el-icon>
                  关注
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 讲师详情对话框 -->
    <el-dialog
      v-model="showInstructorDetail"
      :title="selectedInstructor?.name"
      width="800px"
      align-center
    >
      <div v-if="selectedInstructor" class="instructor-detail">
        <div class="instructor-profile">
          <div class="profile-left">
            <img 
              :src="selectedInstructor.avatar" 
              :alt="selectedInstructor.name"
              class="profile-avatar"
            />
            <h3 class="profile-name">{{ selectedInstructor.name }}</h3>
            <p class="profile-title">{{ selectedInstructor.title }}</p>
            
            <div class="profile-stats">
              <div class="stat-row">
                <span class="stat-label">工作经验：</span>
                <span class="stat-value">{{ selectedInstructor.experience }} 年</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">课程数量：</span>
                <span class="stat-value">{{ selectedInstructor.coursesCount }} 门</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">学员总数：</span>
                <span class="stat-value">{{ selectedInstructor.studentsCount.toLocaleString() }} 人</span>
              </div>
            </div>
          </div>
          
          <div class="profile-right">
            <div class="profile-section">
              <h4>个人简介</h4>
              <p>{{ selectedInstructor.description }}</p>
            </div>
            
            <div class="profile-section">
              <h4>专业技能</h4>
              <div class="skills-grid">
                <el-tag
                  v-for="specialty in selectedInstructor.specialties"
                  :key="specialty"
                  size="large"
                  type="primary"
                  effect="light"
                >
                  {{ specialty }}
                </el-tag>
              </div>
            </div>
            
            <div class="profile-section">
              <h4>相关课程</h4>
              <div class="instructor-courses">
                <div
                  v-for="course in getInstructorCourses(selectedInstructor.id)"
                  :key="course.id"
                  class="course-item"
                  @click="gotoCourse(course.id)"
                >
                  <img :src="course.image" :alt="course.title" class="course-image" />
                  <div class="course-info">
                    <h5 class="course-title">{{ course.title }}</h5>
                    <div class="course-meta">
                      <span class="course-price">¥{{ course.price }}</span>
                      <span class="course-students">{{ course.studentsCount }}人学习</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showInstructorDetail = false">关闭</el-button>
          <el-button type="primary" @click="followInstructor(selectedInstructor?.id)">
            关注讲师
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { Instructor, Course } from '@/types/course'
import { mockInstructors, courses } from '@/data/mockData'

const router = useRouter()

// 状态管理
const instructors = ref<Instructor[]>(mockInstructors)
const showInstructorDetail = ref(false)
const selectedInstructor = ref<Instructor | null>(null)

// 格式化学员数量
const formatStudentCount = (count: number) => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + 'w'
  }
  return count.toString()
}

// 获取讲师的课程
const getInstructorCourses = (instructorId: string) => {
  return courses.filter(course => course.instructor.id === instructorId)
}

// 事件处理
const viewInstructorDetail = (instructorId: string) => {
  selectedInstructor.value = instructors.value.find(i => i.id === instructorId) || null
  showInstructorDetail.value = true
}

const viewCourses = (instructorId: string) => {
  router.push(`/courses?instructor=${instructorId}`)
}

const followInstructor = (instructorId?: string) => {
  if (!instructorId) return
  ElMessage.success('关注成功！')
  // 这里可以添加关注逻辑
}

const gotoCourse = (courseId: string) => {
  showInstructorDetail.value = false
  router.push(`/course/${courseId}`)
}
</script>

<style scoped lang="scss">
.instructors-view {
  min-height: 100vh;
  background: #f5f7fa;
}

// 页面头部
.page-header {
  background: linear-gradient(135deg, #fa8c16 0%, #ffa940 100%);
  color: white;
  padding: 80px 0;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .header-content {
    text-align: center;
    
    .page-title {
      font-size: 48px;
      font-weight: 700;
      margin: 0 0 20px 0;
    }
    
    .page-subtitle {
      font-size: 20px;
      margin: 0;
      opacity: 0.9;
    }
  }
}

// 讲师区域
.instructors-section {
  padding: 60px 0;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
}

// 讲师网格
.instructors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
  gap: 32px;
  
  .instructor-card {
    background: white;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
    cursor: pointer;
    display: flex;
    align-items: flex-start;
    gap: 24px;
    
    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    }
    
    .instructor-avatar {
      img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid #f0f0f0;
      }
    }
    
    .instructor-info {
      flex: 1;
      
      .instructor-name {
        font-size: 24px;
        font-weight: 600;
        color: #262626;
        margin: 0 0 8px 0;
      }
      
      .instructor-title {
        font-size: 16px;
        color: #fa8c16;
        font-weight: 500;
        margin: 0 0 16px 0;
      }
      
      .instructor-description {
        font-size: 14px;
        color: #595959;
        line-height: 1.6;
        margin: 0 0 24px 0;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .instructor-stats {
        display: flex;
        gap: 32px;
        margin-bottom: 24px;
        
        .stat-item {
          text-align: center;
          
          .stat-number {
            display: block;
            font-size: 20px;
            font-weight: 600;
            color: #fa8c16;
            margin-bottom: 4px;
          }
          
          .stat-label {
            font-size: 12px;
            color: #8c8c8c;
          }
        }
      }
      
      .instructor-specialties {
        margin-bottom: 24px;
        
        h4 {
          font-size: 14px;
          color: #262626;
          margin: 0 0 12px 0;
        }
        
        .specialties-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          
          .el-tag {
            margin: 0;
          }
        }
      }
      
      .instructor-actions {
        display: flex;
        gap: 12px;
        
        .el-button {
          flex: 1;
        }
      }
    }
  }
}

// 讲师详情对话框
.instructor-detail {
  .instructor-profile {
    display: flex;
    gap: 32px;
    
    .profile-left {
      width: 200px;
      flex-shrink: 0;
      text-align: center;
      
      .profile-avatar {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        object-fit: cover;
        margin-bottom: 20px;
        border: 4px solid #f0f0f0;
      }
      
      .profile-name {
        font-size: 20px;
        font-weight: 600;
        color: #262626;
        margin: 0 0 8px 0;
      }
      
      .profile-title {
        font-size: 14px;
        color: #fa8c16;
        margin: 0 0 24px 0;
      }
      
      .profile-stats {
        .stat-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
          
          .stat-label {
            font-size: 14px;
            color: #8c8c8c;
          }
          
          .stat-value {
            font-size: 14px;
            font-weight: 500;
            color: #262626;
          }
        }
      }
    }
    
    .profile-right {
      flex: 1;
      
      .profile-section {
        margin-bottom: 32px;
        
        h4 {
          font-size: 16px;
          font-weight: 600;
          color: #262626;
          margin: 0 0 16px 0;
          padding-bottom: 8px;
          border-bottom: 2px solid #fa8c16;
        }
        
        p {
          font-size: 14px;
          color: #595959;
          line-height: 1.6;
          margin: 0;
        }
        
        .skills-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        
        .instructor-courses {
          display: flex;
          flex-direction: column;
          gap: 16px;
          
          .course-item {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px;
            background: #f8f9fa;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            
            &:hover {
              background: #e6f7ff;
            }
            
            .course-image {
              width: 80px;
              height: 60px;
              border-radius: 6px;
              object-fit: cover;
            }
            
            .course-info {
              flex: 1;
              
              .course-title {
                font-size: 14px;
                font-weight: 500;
                color: #262626;
                margin: 0 0 8px 0;
                line-height: 1.4;
              }
              
              .course-meta {
                display: flex;
                gap: 16px;
                font-size: 12px;
                color: #8c8c8c;
                
                .course-price {
                  color: #fa8c16;
                  font-weight: 500;
                }
              }
            }
          }
        }
      }
    }
  }
}

.dialog-footer {
  text-align: right;
}

// 响应式设计
@media (max-width: 1024px) {
  .instructors-grid {
    grid-template-columns: 1fr;
  }
  
  .instructor-profile {
    flex-direction: column !important;
    
    .profile-left {
      width: 100% !important;
    }
  }
}

@media (max-width: 768px) {
  .instructor-card {
    flex-direction: column !important;
    text-align: center;
    
    .instructor-avatar img {
      width: 100px !important;
      height: 100px !important;
    }
    
    .instructor-stats {
      justify-content: center;
    }
  }
  
  .page-header {
    padding: 40px 0 !important;
    
    .page-title {
      font-size: 32px !important;
    }
    
    .page-subtitle {
      font-size: 16px !important;
    }
  }
}
</style> 