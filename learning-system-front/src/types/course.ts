// 讲师接口
export interface Instructor {
  id: string
  name: string
  title: string
  description: string
  avatar: string
  coursesCount: number
  studentsCount: number
  specialties: string[]
  experience: number // 年数
}

// 课程课时接口
export interface CourseLesson {
  id: string
  title: string
  duration: string
  type: 'video' | 'document' | 'quiz'
  completed: boolean
  locked: boolean
  videoUrl?: string
  content?: string
}

// 课程章节接口
export interface CourseChapter {
  id: string
  title: string
  duration: string
  expanded?: boolean
  lessons: CourseLesson[]
}

// 课程评价接口
export interface CourseReview {
  id: string
  user: {
    name: string
    avatar: string
  }
  rating: number
  date: Date
  content: string
}

// 课程接口
export interface Course {
  id: string
  title: string
  description: string
  detailedDescription?: string
  image: string
  price: number
  originalPrice?: number
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  difficulty?: string
  badge?: string
  instructor: Instructor
  studentsCount: number
  rating: number
  reviewCount: number
  duration: string // 课时
  totalLessons?: number
  chaptersCount?: number
  chapters?: CourseChapter[]
  skills: string[]
  requirements: string[]
  features: string[]
  learningGoals?: string[]
  targetAudience?: string[]
  reviews?: CourseReview[]
  progress?: number
  createdAt: string
  updatedAt: string
  isHot?: boolean
  isNew?: boolean
}

// 学习路径接口
export interface LearningPath {
  id: string
  title: string
  description: string
  image: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  courses: Course[]
  totalDuration: number
  studentsCount: number
  rating: number
  price: number
  originalPrice?: number
  instructor: Instructor
  skills: string[]
  createdAt: string
}

// 课程分类接口
export interface CourseCategory {
  id: string
  title: string
  description: string
  icon: string
  path: string
  coursesCount: number
  studentsCount: number
}

// 学习进度接口
export interface LearningProgress {
  courseId: number
  userId: number
  completedChapters: number[]
  currentChapter: number
  progress: number // 0-100
  lastStudiedAt: string
  totalStudyTime: number // 分钟
}



// API响应接口
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 分页接口
export interface Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: Pagination
} 