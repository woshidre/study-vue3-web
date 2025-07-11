import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户信息接口
export interface User {
  id: string
  username: string
  email: string
  avatar: string
  name: string
  joinDate: string
  learningProgress: {
    completedCourses: number
    totalStudyTime: number
    certificates: number
  }
  preferences: {
    language: string
    notifications: boolean
    darkMode: boolean
  }
}

// 学习进度接口
export interface LearningProgress {
  courseId: string
  lessonId: string
  progress: number
  completedLessons: string[]
  lastStudyTime: string
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref<User | null>(null)
  const isLoggedIn = ref(false)
  const learningProgressMap = ref<Map<string, LearningProgress>>(new Map())
  
  // Mock用户数据
  const mockUsers = [
    {
      id: '1',
      username: 'demo',
      email: 'demo@example.com',
      password: '123456', // 实际项目中不应该明文存储密码
      avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      name: '演示用户',
      joinDate: '2024-01-01',
      learningProgress: {
        completedCourses: 3,
        totalStudyTime: 150,
        certificates: 2
      },
      preferences: {
        language: 'zh-CN',
        notifications: true,
        darkMode: false
      }
    }
  ]

  // 登录
  const login = async (username: string, password: string) => {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const foundUser = mockUsers.find(u => 
        (u.username === username || u.email === username) && u.password === password
      )
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser
        user.value = userWithoutPassword
        isLoggedIn.value = true
        
        // 保存到localStorage
        localStorage.setItem('user', JSON.stringify(userWithoutPassword))
        localStorage.setItem('isLoggedIn', 'true')
        
        return { success: true, message: '登录成功' }
      } else {
        return { success: false, message: '用户名或密码错误' }
      }
    } catch (error) {
      return { success: false, message: '登录失败，请稍后重试' }
    }
  }

  // 注册
  const register = async (userData: {
    username: string
    email: string
    password: string
    confirmPassword: string
    name: string
  }) => {
    try {
      // 验证
      if (userData.password !== userData.confirmPassword) {
        return { success: false, message: '两次密码输入不一致' }
      }
      
      if (mockUsers.find(u => u.username === userData.username)) {
        return { success: false, message: '用户名已存在' }
      }
      
      if (mockUsers.find(u => u.email === userData.email)) {
        return { success: false, message: '邮箱已注册' }
      }
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newUser = {
        id: String(Date.now()),
        username: userData.username,
        email: userData.email,
        password: userData.password,
        avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        name: userData.name,
        joinDate: new Date().toISOString().split('T')[0],
        learningProgress: {
          completedCourses: 0,
          totalStudyTime: 0,
          certificates: 0
        },
        preferences: {
          language: 'zh-CN',
          notifications: true,
          darkMode: false
        }
      }
      
      mockUsers.push(newUser)
      
      return { success: true, message: '注册成功，请登录' }
    } catch (error) {
      return { success: false, message: '注册失败，请稍后重试' }
    }
  }

  // 退出登录
  const logout = () => {
    user.value = null
    isLoggedIn.value = false
    learningProgressMap.value.clear()
    
    localStorage.removeItem('user')
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('learningProgress')
  }

  // 更新用户信息
  const updateProfile = async (profileData: Partial<User>) => {
    try {
      if (!user.value) return { success: false, message: '用户未登录' }
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      user.value = { ...user.value, ...profileData }
      
      // 更新localStorage
      localStorage.setItem('user', JSON.stringify(user.value))
      
      return { success: true, message: '资料更新成功' }
    } catch (error) {
      return { success: false, message: '更新失败，请稍后重试' }
    }
  }

  // 更新学习进度
  const updateLearningProgress = (courseId: string, lessonId: string, progress: number) => {
    if (!user.value) return
    
    const currentProgress = learningProgressMap.value.get(courseId) || {
      courseId,
      lessonId,
      progress: 0,
      completedLessons: [],
      lastStudyTime: new Date().toISOString()
    }
    
    const updatedProgress: LearningProgress = {
      ...currentProgress,
      lessonId,
      progress: Math.max(currentProgress.progress, progress),
      lastStudyTime: new Date().toISOString()
    }
    
    // 如果课程完成，添加到已完成列表
    if (progress >= 100 && !updatedProgress.completedLessons.includes(lessonId)) {
      updatedProgress.completedLessons.push(lessonId)
    }
    
    learningProgressMap.value.set(courseId, updatedProgress)
    
    // 保存到localStorage
    const progressObj = Object.fromEntries(learningProgressMap.value)
    localStorage.setItem('learningProgress', JSON.stringify(progressObj))
  }

  // 获取课程学习进度
  const getCourseProgress = (courseId: string): LearningProgress | null => {
    return learningProgressMap.value.get(courseId) || null
  }

  // 初始化用户状态（从localStorage恢复）
  const initializeAuth = () => {
    try {
      const savedUser = localStorage.getItem('user')
      const savedLoginStatus = localStorage.getItem('isLoggedIn')
      const savedProgress = localStorage.getItem('learningProgress')
      
      if (savedUser && savedLoginStatus === 'true') {
        user.value = JSON.parse(savedUser)
        isLoggedIn.value = true
      }
      
      if (savedProgress) {
        const progressObj = JSON.parse(savedProgress)
        learningProgressMap.value = new Map(Object.entries(progressObj))
      }
    } catch (error) {
      console.error('初始化用户状态失败:', error)
      logout() // 清空可能损坏的数据
    }
  }

  // 计算用户统计信息
  const getUserStats = () => {
    if (!user.value) return null
    
    const totalProgress = Array.from(learningProgressMap.value.values())
    const totalCompletedLessons = totalProgress.reduce(
      (sum, progress) => sum + progress.completedLessons.length, 
      0
    )
    
    return {
      completedCourses: user.value.learningProgress.completedCourses,
      totalStudyTime: user.value.learningProgress.totalStudyTime,
      certificates: user.value.learningProgress.certificates,
      totalCompletedLessons,
      activeCourses: learningProgressMap.value.size
    }
  }

  return {
    // 状态
    user,
    isLoggedIn,
    
    // 方法
    login,
    register,
    logout,
    updateProfile,
    updateLearningProgress,
    getCourseProgress,
    initializeAuth,
    getUserStats
  }
}) 