<template>
  <div class="lesson-view">
    <!-- 三栏布局容器 -->
    <div class="lesson-container">
      <!-- 左侧课程目录 -->
      <div class="course-sidebar">
        <!-- 课程头部信息 -->
        <div class="course-header">
          <div class="course-logo">
            <el-icon size="24" color="#1890ff">
              <Cpu />
            </el-icon>
            <span class="brand-name">BIMOWU</span>
            <span class="course-tag">课程</span>
          </div>
          
          <h2 class="course-title">{{ course?.title || '玩转 Trae AI 编程' }}</h2>
          
          <!-- 购买按钮 -->
          <el-button 
            type="primary" 
            class="purchase-btn"
            @click="handlePurchase"
          >
            ¥49.9 立即购买
          </el-button>
          
          <!-- 展开/收起按钮 -->
          <div class="expand-toggle">
            <el-icon>
              <Operation />
            </el-icon>
          </div>
        </div>

        <!-- 课程目录列表 -->
        <div class="course-catalog">
          <div 
            v-for="(chapter, chapterIndex) in courseChapters" 
            :key="chapter.id"
            class="chapter-item"
          >
            <div 
              class="chapter-header"
              @click="toggleChapter(chapterIndex)"
            >
              <div class="chapter-info">
                <span class="chapter-number">{{ chapterIndex + 1 }}</span>
                <span class="chapter-title">{{ chapter.title }}</span>
              </div>
              
              <div class="chapter-meta">
                <span class="chapter-duration">{{ chapter.duration }}</span>
                <el-icon class="expand-icon" :class="{ expanded: chapter.expanded }">
                  <ArrowDown />
                </el-icon>
              </div>
            </div>
            
            <!-- 章节下的课时列表 -->
            <div class="lessons-list" v-show="chapter.expanded">
              <div 
                v-for="(lesson, lessonIndex) in chapter.lessons"
                :key="lesson.id"
                class="lesson-item"
                :class="{ 
                  current: lesson.id === currentLessonId,
                  completed: lesson.completed 
                }"
                @click="selectLesson(lesson)"
              >
                <div class="lesson-info">
                  <span class="lesson-number">{{ lessonIndex + 1 }}</span>
                  <span class="lesson-title">{{ lesson.title }}</span>
                </div>
                <div class="lesson-meta">
                  <span class="lesson-duration">{{ lesson.duration }}</span>
                  <el-icon v-if="lesson.completed" color="#52c41a" size="16">
                    <CircleCheck />
                  </el-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 中间内容区域 -->
      <div class="main-content">
        <div class="content-body">
          <h1 class="content-title">{{ currentContent.title }}</h1>
          
          <div class="content-text" v-html="currentContent.content"></div>
        </div>
      </div>

      <!-- 右侧导航栏 -->
      <div class="nav-sidebar">
        <div class="nav-header">
          <h3>课程导航</h3>
        </div>
        
        <div class="nav-links">
          <a href="#" class="nav-link active">为什么是 Trae?</a>
          <a href="#" class="nav-link">你能学到什么?</a>
          <a href="#" class="nav-link">适合什么样的你?</a>
          <a href="#" class="nav-link">你将获得什么?</a>
          <a href="#" class="nav-link">写在最后</a>
        </div>
        
        <!-- 学习进度 -->
        <div class="progress-section">
          <div class="progress-header">
            <span>学习进度</span>
            <span class="progress-percent">15%</span>
          </div>
          <el-progress :percentage="15" :show-text="false" />
        </div>
        
        <!-- 学习工具 -->
        <div class="tools-section">
          <h4>学习工具</h4>
          <div class="tool-buttons">
            <el-button size="small" class="tool-btn">
              <el-icon><Edit /></el-icon>
              笔记
            </el-button>
            <el-button size="small" class="tool-btn">
              <el-icon><ChatDotRound /></el-icon>
              讨论
            </el-button>
            <el-button size="small" class="tool-btn">
              <el-icon><Download /></el-icon>
              资料
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { 
  Cpu,
  Operation,
  ArrowDown,
  CircleCheck,
  Edit,
  ChatDotRound,
  Download
} from '@element-plus/icons-vue'
import type { Course, CourseLesson, CourseChapter } from '@/types/course'
import { courses } from '@/data/mockData'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 课程数据
const course = ref<Course | null>(null)
const currentLessonId = ref<string>('')

// 当前内容数据
const currentContent = ref({
  title: '大家好！我是智贝豆',
  content: `
    <p>在软件开发被 AI 深度重塑的今天，一场特时的革命正在改变我们编程的方式。当我们还在讨论 AI 是否会取代程序员时，聪明的开发者们已经满怀地，未来的核心竞争力，不再是百以缓夜地"撸码"，而是学会如何与 AI 高效协作，将 AI 变为自己能力的延伸。</p>
    
    <h3>你是否曾经历过这样的场景？</h3>
    <ul>
      <li>😰 面对一个新项目，需要花费数小时搭建基础架构</li>
      <li>🤔 为了实现一个看似简单的功能，却要查阅大量文档和示例</li>
      <li>😅 面对新技术或新语言，感觉无从下手，望而却步</li>
      <li>📋 在重复性的 CRUD 代码中消耗创造力</li>
      <li>🎯 想要快速验证一个想法，却被技术实现的复杂度阻碍步</li>
    </ul>
    
    <p>如果你的答案是"是"，那么这本小册将彻底改变你的开发体验。</p>
    
    <h2>为什么是 Trae?</h2>
    
    <p>我们正处在软件开发范式被彻底重塑的时代，AI 不再是简单的"代码补全工具"，而是能够自主思考和执行任务的"开发伙伴"。</p>
  `
})

// 计算属性：处理章节数据
const courseChapters = computed(() => {
  if (!course.value?.chapters) return []
  
  return course.value.chapters.map(chapter => ({
    ...chapter,
    expanded: true // 默认展开所有章节
  }))
})

onMounted(() => {
  loadLessonData()
})

const loadLessonData = () => {
  const courseId = route.params.courseId as string
  const lessonId = route.params.lessonId as string
  
  course.value = courses.find(c => c.id === courseId) || null
  currentLessonId.value = lessonId
  
  // 根据lessonId加载对应的课程内容
  if (course.value && lessonId) {
    const lesson = findLessonById(lessonId)
    if (lesson) {
      currentContent.value = {
        title: lesson.title,
        content: lesson.content || generateDefaultContent(lesson)
      }
    }
  } else if (course.value?.chapters?.[0]?.lessons?.[0]) {
    // 如果没有指定课时，默认显示第一个课时
    const firstLesson = course.value.chapters[0].lessons[0]
    currentContent.value = {
      title: firstLesson.title,
      content: firstLesson.content || generateDefaultContent(firstLesson)
    }
    currentLessonId.value = firstLesson.id
  }
}

// 根据ID查找课时
const findLessonById = (lessonId: string) => {
  if (!course.value?.chapters) return null
  
  for (const chapter of course.value.chapters) {
    const lesson = chapter.lessons.find(l => l.id === lessonId)
    if (lesson) return lesson
  }
  return null
}

// 购买按钮处理
const handlePurchase = () => {
  console.log('购买课程')
  // 这里可以添加购买逻辑
}

// 章节展开/收起
const toggleChapter = (index: number) => {
  const chapters = courseChapters.value
  if (chapters[index]) {
    chapters[index].expanded = !chapters[index].expanded
  }
}

// 选择课时
const selectLesson = (lesson: CourseLesson) => {
  if (!lesson.locked) {
    currentLessonId.value = lesson.id
    
    // 更新当前内容
    currentContent.value = {
      title: lesson.title,
      content: lesson.content || generateDefaultContent(lesson)
    }
    
    // 更新学习进度（如果用户已登录）
    if (userStore.isLoggedIn && course.value) {
      userStore.updateLearningProgress(course.value.id, lesson.id, 50) // 开始学习时设置50%进度
    }
    
    router.push(`/course/${course.value?.id}/lesson/${lesson.id}`)
  }
}

// 生成默认内容
const generateDefaultContent = (lesson: CourseLesson) => {
  if (lesson.type === 'video') {
    return `
      <div class="video-content">
        <div class="video-placeholder">
          <div class="video-icon">📹</div>
          <h3>${lesson.title}</h3>
          <p>视频时长：${lesson.duration}</p>
          <p>这是一个视频课程，内容包含实际的视频播放功能。</p>
        </div>
      </div>
    `
  } else if (lesson.type === 'document') {
    return `
      <div class="document-content">
        <h2>${lesson.title}</h2>
        <p>这是一个文档课程，时长：${lesson.duration}</p>
        <p>在实际项目中，这里会显示详细的文档内容、代码示例和实践指导。</p>
        
        <h3>学习要点</h3>
        <ul>
          <li>理解核心概念和原理</li>
          <li>掌握实际应用场景</li>
          <li>学会解决常见问题</li>
        </ul>
      </div>
    `
  }
  
  return `
    <div class="lesson-content">
      <h2>${lesson.title}</h2>
      <p>课程时长：${lesson.duration}</p>
      <p>这里是课程的详细内容...</p>
    </div>
  `
}
</script>

<style scoped lang="scss">
.lesson-view {
  min-height: 100vh;
  background: #f5f7fa;
}

.lesson-container {
  display: flex;
  height: 100vh;
}

// 左侧课程目录
.course-sidebar {
  width: 320px;
  background: white;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;

  .course-header {
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;
    
    .course-logo {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      
      .brand-name {
        font-size: 18px;
        font-weight: 600;
        color: #1890ff;
        margin-left: 8px;
      }
      
      .course-tag {
        background: #f0f8ff;
        color: #1890ff;
        font-size: 12px;
        padding: 2px 8px;
        border-radius: 12px;
        margin-left: 8px;
      }
    }
    
    .course-title {
      font-size: 16px;
      font-weight: 600;
      color: #262626;
      margin: 0 0 16px 0;
      line-height: 1.4;
    }
    
    .purchase-btn {
      width: 100%;
      height: 40px;
      background: #1890ff;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 16px;
      
      &:hover {
        background: #40a9ff;
      }
    }
    
    .expand-toggle {
      text-align: center;
      color: #8c8c8c;
      cursor: pointer;
      
      &:hover {
        color: #1890ff;
      }
    }
  }
  
  .course-catalog {
    flex: 1;
    overflow-y: auto;
    
    .chapter-item {
      border-bottom: 1px solid #f0f0f0;
      
      .chapter-header {
        padding: 16px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        transition: background-color 0.2s;
        
        &:hover {
          background: #f5f5f5;
        }
        
        .chapter-info {
          display: flex;
          align-items: center;
          flex: 1;
          
          .chapter-number {
            width: 24px;
            height: 24px;
            background: #f0f0f0;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 600;
            color: #595959;
            margin-right: 12px;
          }
          
          .chapter-title {
            font-size: 14px;
            color: #262626;
            font-weight: 500;
          }
        }
        
        .chapter-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          
          .chapter-duration {
            font-size: 12px;
            color: #8c8c8c;
          }
          
          .expand-icon {
            color: #bfbfbf;
            transition: transform 0.2s;
            
            &.expanded {
              transform: rotate(180deg);
            }
          }
        }
      }
      
      .lessons-list {
        background: #fafafa;
        
        .lesson-item {
          padding: 12px 20px 12px 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: background-color 0.2s;
          border-bottom: 1px solid #f0f0f0;
          
          &:hover {
            background: #f0f0f0;
          }
          
          &.current {
            background: #e6f7ff;
            border-left: 3px solid #1890ff;
            
            .lesson-title {
              color: #1890ff;
              font-weight: 600;
            }
          }
          
          &.completed {
            .lesson-title {
              color: #52c41a;
            }
          }
          
          .lesson-info {
            display: flex;
            align-items: center;
            flex: 1;
            
            .lesson-number {
              font-size: 12px;
              color: #8c8c8c;
              margin-right: 8px;
              min-width: 16px;
            }
            
            .lesson-title {
              font-size: 13px;
              color: #595959;
              line-height: 1.4;
            }
          }
          
          .lesson-meta {
            display: flex;
            align-items: center;
            gap: 8px;
            
            .lesson-duration {
              font-size: 12px;
              color: #bfbfbf;
            }
          }
        }
      }
    }
  }
}

// 中间主内容区域
.main-content {
  flex: 1;
  background: white;
  overflow-y: auto;
  
  .content-body {
    padding: 40px 60px;
    max-width: 800px;
    
    .content-title {
      font-size: 32px;
      font-weight: 600;
      color: #262626;
      margin: 0 0 32px 0;
      line-height: 1.3;
    }
    
    .content-text {
      font-size: 16px;
      line-height: 1.8;
      color: #595959;
      
      h2 {
        font-size: 24px;
        font-weight: 600;
        color: #262626;
        margin: 40px 0 20px 0;
        line-height: 1.4;
      }
      
      h3 {
        font-size: 20px;
        font-weight: 600;
        color: #262626;
        margin: 32px 0 16px 0;
      }
      
      p {
        margin: 0 0 20px 0;
        text-align: justify;
      }
      
      ul, ol {
        margin: 20px 0;
        padding-left: 28px;
        
        li {
          margin: 12px 0;
          line-height: 1.6;
          
          strong {
            color: #262626;
            font-weight: 600;
          }
        }
      }
      
      blockquote {
        background: #f6f8fa;
        border-left: 4px solid #1890ff;
        margin: 32px 0;
        padding: 20px 24px;
        
        p {
          margin: 0;
          font-style: italic;
          color: #262626;
        }
      }
      
      code {
        background: #f6f8fa;
        padding: 3px 8px;
        border-radius: 4px;
        font-family: 'Monaco', 'Menlo', monospace;
        font-size: 14px;
        color: #e96900;
      }
      
      pre {
        background: #f6f8fa;
        padding: 20px;
        border-radius: 8px;
        overflow-x: auto;
        margin: 24px 0;
        
        code {
          background: none;
          padding: 0;
          color: #262626;
        }
      }
      
      // 视频内容样式
      .video-content {
        .video-placeholder {
          text-align: center;
          padding: 60px 40px;
          background: #f8f9fa;
          border-radius: 12px;
          border: 2px dashed #d9d9d9;
          margin: 40px 0;
          
          .video-icon {
            font-size: 48px;
            margin-bottom: 20px;
          }
          
          h3 {
            margin: 0 0 16px 0;
            color: #262626;
          }
          
          p {
            color: #8c8c8c;
            margin: 8px 0;
          }
        }
      }
      
      // 文档内容样式
      .document-content {
        .learning-points {
          background: #f0f8ff;
          border: 1px solid #b3d8ff;
          border-radius: 8px;
          padding: 24px;
          margin: 32px 0;
          
          h3 {
            color: #1890ff;
            margin-top: 0;
          }
        }
      }
      
      // 课程内容样式
      .lesson-content {
        .course-info {
          background: #f6f8fa;
          border-radius: 8px;
          padding: 20px;
          margin: 24px 0;
          border-left: 4px solid #52c41a;
          
          p {
            margin: 0;
            color: #595959;
          }
        }
      }
    }
  }
}

// 右侧导航栏
.nav-sidebar {
  width: 280px;
  background: white;
  border-left: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  
  .nav-header {
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;
    
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #262626;
    }
  }
  
  .nav-links {
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;
    
    .nav-link {
      display: block;
      padding: 12px 0;
      font-size: 14px;
      color: #8c8c8c;
      text-decoration: none;
      transition: color 0.2s;
      border-left: 3px solid transparent;
      padding-left: 16px;
      margin-left: -16px;
      
      &:hover {
        color: #1890ff;
      }
      
      &.active {
        color: #1890ff;
        border-left-color: #1890ff;
        background: #f0f8ff;
        font-weight: 500;
      }
    }
  }
  
  .progress-section {
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;
    
    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      
      span {
        font-size: 14px;
        color: #262626;
        font-weight: 500;
      }
      
      .progress-percent {
        color: #1890ff;
        font-weight: 600;
      }
    }
    
    :deep(.el-progress-bar__outer) {
      background-color: #f0f0f0;
    }
    
    :deep(.el-progress-bar__inner) {
      background-color: #1890ff;
    }
  }
  
  .tools-section {
    padding: 20px;
    
    h4 {
      margin: 0 0 16px 0;
      font-size: 14px;
      font-weight: 600;
      color: #262626;
    }
    
    .tool-buttons {
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      .tool-btn {
        justify-content: flex-start;
        background: #f8f9fa;
        border: 1px solid #e4e7ed;
        color: #595959;
        
        &:hover {
          background: #e6f7ff;
          border-color: #1890ff;
          color: #1890ff;
        }
        
        .el-icon {
          margin-right: 8px;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 1400px) {
  .nav-sidebar {
    width: 240px;
  }
  
  .course-sidebar {
    width: 280px;
  }
}

@media (max-width: 1200px) {
  .lesson-container {
    flex-direction: column;
    height: auto;
    
    .course-sidebar,
    .nav-sidebar {
      width: 100%;
      height: auto;
    }
    
    .main-content {
      min-height: 60vh;
    }
  }
}

@media (max-width: 768px) {
  .main-content .content-body {
    padding: 20px;
  }
  
  .course-sidebar .course-header,
  .nav-sidebar .nav-header {
    padding: 16px;
  }
}
</style> 