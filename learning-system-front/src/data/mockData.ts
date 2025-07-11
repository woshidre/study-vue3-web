import type { Instructor, Course, LearningPath, CourseCategory } from '@/types/course'

// Mock 讲师数据
export const mockInstructors: Instructor[] = [
  {
    id: '1',
    name: '张三',
    title: '高级前端架构师',
    description:
      '10年前端开发经验，精通Vue.js生态系统，曾在腾讯、阿里巴巴等知名互联网公司担任技术专家。',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    coursesCount: 15,
    studentsCount: 25000,
    specialties: ['Vue.js', 'React', 'TypeScript', '前端架构'],
    experience: 10,
  },
  {
    id: '2',
    name: '李四',
    title: '全栈工程师',
    description: '专注于Node.js和微服务架构设计，拥有丰富的大型项目开发经验。',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    coursesCount: 12,
    studentsCount: 18000,
    specialties: ['Node.js', '微服务', 'Docker', 'Kubernetes'],
    experience: 8,
  },
  {
    id: '3',
    name: '王五',
    title: 'AI算法专家',
    description: '深度学习和自然语言处理领域专家，发表多篇顶级会议论文。',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    coursesCount: 8,
    studentsCount: 12000,
    specialties: ['机器学习', '深度学习', 'Python', 'TensorFlow'],
    experience: 12,
  },
  {
    id: '4',
    name: '赵六',
    title: '移动端架构师',
    description: 'React Native和Flutter跨平台开发专家，曾主导多个千万级用户的移动应用开发。',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    coursesCount: 10,
    studentsCount: 15000,
    specialties: ['React Native', 'Flutter', 'iOS', 'Android'],
    experience: 9,
  },
]

// Mock 课程数据
export const courses: Course[] = [
  {
    id: '1',
    title: 'Vue3 从零到一开发整站',
    description:
      '基于Vue3和组合式API的现代前端开发实战，带你从零开始构建完整的Web应用。课程涵盖Vue3核心特性、路由管理、状态管理、UI组件库等内容。',
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    price: 199,
    originalPrice: 399,
    category: '前端开发',
    level: 'intermediate',
    difficulty: '中级',
    badge: '热门',
    instructor: mockInstructors[0],
    studentsCount: 2845,
    rating: 4.8,
    reviewCount: 324,
    duration: '25课时',
    totalLessons: 25,
    chaptersCount: 5,
    skills: ['Vue3', 'TypeScript', 'Vite', 'Element Plus', 'Pinia'],
    requirements: ['HTML/CSS基础', 'JavaScript ES6+', '有一定编程经验'],
    features: ['25+个实战案例', '源码+笔记下载', '微信群答疑', '就业指导'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    isHot: true,
    chapters: [
      {
        id: '1-1',
        title: '开篇',
        duration: '7分26秒',
        lessons: [
          {
            id: '1-1-1',
            title: '大家好！我是智贝豆',
            duration: '7分26秒',
            type: 'document',
            completed: false,
            locked: false,
            content: `
              <h1>大家好！我是智贝豆</h1>
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
            `,
          },
        ],
      },
      {
        id: '1-2',
        title: '基础篇 | Trae 双版本安装配置指南',
        duration: '13分18秒',
        lessons: [
          {
            id: '1-2-1',
            title: 'Trae 安装与环境配置',
            duration: '8分45秒',
            type: 'video',
            completed: false,
            locked: false,
            videoUrl: '/videos/trae-installation.mp4',
            content: `
              <h2>Trae 安装与环境配置</h2>
              <p>本节课程将详细介绍如何安装和配置 Trae 开发环境...</p>
            `,
          },
          {
            id: '1-2-2',
            title: '项目初始化与基本配置',
            duration: '4分33秒',
            type: 'video',
            completed: false,
            locked: false,
            videoUrl: '/videos/project-setup.mp4',
          },
        ],
      },
      {
        id: '1-3',
        title: '基础篇 | Node.js 开发环境安装与配置',
        duration: '9分29秒',
        lessons: [
          {
            id: '1-3-1',
            title: 'Node.js 环境搭建',
            duration: '6分15秒',
            type: 'video',
            completed: false,
            locked: false,
          },
          {
            id: '1-3-2',
            title: 'npm 包管理器使用',
            duration: '3分14秒',
            type: 'video',
            completed: false,
            locked: false,
          },
        ],
      },
      {
        id: '1-4',
        title: '基础篇 | Agent: Trae 的核心能力',
        duration: '20分38秒',
        lessons: [
          {
            id: '1-4-1',
            title: 'Agent 概念详解',
            duration: '8分22秒',
            type: 'video',
            completed: false,
            locked: false,
          },
          {
            id: '1-4-2',
            title: 'Trae Agent 实战示例',
            duration: '12分16秒',
            type: 'video',
            completed: false,
            locked: false,
          },
        ],
      },
      {
        id: '1-5',
        title: '基础篇 | Cue: 不止于 Tab 补全',
        duration: '13分46秒',
        lessons: [
          {
            id: '1-5-1',
            title: 'Cue 功能介绍',
            duration: '7分28秒',
            type: 'video',
            completed: false,
            locked: false,
          },
          {
            id: '1-5-2',
            title: '高级补全技巧',
            duration: '6分18秒',
            type: 'video',
            completed: false,
            locked: false,
          },
        ],
      },
      {
        id: '1-6',
        title: '基础篇 | 内联聊天: 你的贴身 AI 编码助手',
        duration: '7分36秒',
        lessons: [
          {
            id: '1-6-1',
            title: '内联聊天功能详解',
            duration: '7分36秒',
            type: 'video',
            completed: false,
            locked: false,
          },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'Node.js 全栈开发',
    description:
      '掌握服务端JavaScript开发，学习Express框架、数据库操作、API设计等后端开发核心技能。',
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    price: 299,
    category: '后端开发',
    level: 'intermediate',
    difficulty: '中级',
    instructor: mockInstructors[1],
    studentsCount: 1923,
    rating: 4.7,
    reviewCount: 245,
    duration: '32课时',
    totalLessons: 32,
    chaptersCount: 8,
    skills: ['Node.js', 'Express', 'MongoDB', 'RESTful API'],
    requirements: ['JavaScript基础', '了解HTTP协议'],
    features: ['实战项目', '代码示例', '在线答疑'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    chapters: [
      {
        id: '2-1',
        title: 'Node.js 基础',
        duration: '45分钟',
        lessons: [
          {
            id: '2-1-1',
            title: 'Node.js 简介与安装',
            duration: '15分钟',
            type: 'video',
            completed: false,
            locked: false,
          },
          {
            id: '2-1-2',
            title: '模块系统与 NPM',
            duration: '20分钟',
            type: 'video',
            completed: false,
            locked: false,
          },
          {
            id: '2-1-3',
            title: '异步编程基础',
            duration: '10分钟',
            type: 'video',
            completed: false,
            locked: false,
          },
        ],
      },
      {
        id: '2-2',
        title: 'Express 框架',
        duration: '60分钟',
        lessons: [
          {
            id: '2-2-1',
            title: 'Express 快速入门',
            duration: '25分钟',
            type: 'video',
            completed: false,
            locked: false,
          },
          {
            id: '2-2-2',
            title: '路由与中间件',
            duration: '35分钟',
            type: 'video',
            completed: false,
            locked: false,
          },
        ],
      },
    ],
  },
  {
    id: '3',
    title: 'AI 大模型应用开发',
    description: '从零开始学习大语言模型应用开发，掌握ChatGPT、Claude等AI工具的使用和集成开发。',
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    price: 399,
    originalPrice: 699,
    category: 'AI人工智能',
    level: 'advanced',
    difficulty: '高级',
    badge: '新课',
    instructor: mockInstructors[2],
    studentsCount: 856,
    rating: 4.9,
    reviewCount: 128,
    duration: '45课时',
    totalLessons: 45,
    chaptersCount: 10,
    skills: ['Python', 'OpenAI API', '机器学习', '自然语言处理'],
    requirements: ['Python基础', '机器学习概念'],
    features: ['最新技术', 'API实战', '项目作品'],
    createdAt: '2024-02-01',
    updatedAt: '2024-02-05',
    isNew: true,
    chapters: [
      {
        id: '3-1',
        title: 'AI 基础概念',
        duration: '90分钟',
        lessons: [
          {
            id: '3-1-1',
            title: '人工智能发展史',
            duration: '30分钟',
            type: 'video',
            completed: false,
            locked: false,
          },
          {
            id: '3-1-2',
            title: '大语言模型原理',
            duration: '45分钟',
            type: 'video',
            completed: false,
            locked: false,
          },
          {
            id: '3-1-3',
            title: 'Transformer 架构解析',
            duration: '15分钟',
            type: 'document',
            completed: false,
            locked: false,
          },
        ],
      },
      {
        id: '3-2',
        title: 'OpenAI API 实战',
        duration: '120分钟',
        lessons: [
          {
            id: '3-2-1',
            title: 'API 接口介绍',
            duration: '30分钟',
            type: 'video',
            completed: false,
            locked: false,
          },
          {
            id: '3-2-2',
            title: '文本生成实战',
            duration: '45分钟',
            type: 'video',
            completed: false,
            locked: false,
          },
          {
            id: '3-2-3',
            title: '智能对话系统开发',
            duration: '45分钟',
            type: 'video',
            completed: false,
            locked: false,
          },
        ],
      },
    ],
  },
  {
    id: '4',
    title: 'React Native 移动开发',
    description: '使用React Native开发跨平台移动应用，一套代码同时支持iOS和Android平台。',
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    price: 259,
    category: '移动开发',
    level: 'intermediate',
    difficulty: '中级',
    instructor: mockInstructors[3],
    studentsCount: 1456,
    rating: 4.6,
    reviewCount: 189,
    duration: '28课时',
    totalLessons: 28,
    chaptersCount: 7,
    skills: ['React Native', 'Redux', '原生模块', '性能优化'],
    requirements: ['React基础', 'JavaScript ES6+'],
    features: ['真机调试', '上架指导', '性能优化'],
    createdAt: '2024-01-25',
    updatedAt: '2024-01-30',
    chapters: [
      {
        id: '4-1',
        title: 'React Native 基础',
        duration: '75分钟',
        lessons: [
          {
            id: '4-1-1',
            title: '环境搭建与项目创建',
            duration: '25分钟',
            type: 'video',
            completed: false,
            locked: false,
          },
          {
            id: '4-1-2',
            title: '组件与样式',
            duration: '30分钟',
            type: 'video',
            completed: false,
            locked: false,
          },
          {
            id: '4-1-3',
            title: '导航与路由',
            duration: '20分钟',
            type: 'video',
            completed: false,
            locked: false,
          },
        ],
      },
      {
        id: '4-2',
        title: '状态管理与数据',
        duration: '90分钟',
        lessons: [
          {
            id: '4-2-1',
            title: 'Redux 状态管理',
            duration: '45分钟',
            type: 'video',
            completed: false,
            locked: false,
          },
          {
            id: '4-2-2',
            title: '网络请求与API',
            duration: '45分钟',
            type: 'video',
            completed: false,
            locked: false,
          },
        ],
      },
    ],
  },
]

// Mock 课程分类数据
export const mockCategories: CourseCategory[] = [
  {
    id: '1',
    title: 'PAG 低手升级',
    description: '零基础小白的PAG小技巧，快速入门图形编程',
    icon: 'Monitor',
    path: '/category/pag',
    coursesCount: 12,
    studentsCount: 5600,
  },
  {
    id: '2',
    title: 'AI Agent 开发入门',
    description: '大模型 AI Agent 开发实践，掌握智能助手开发',
    icon: 'Cpu',
    path: '/category/ai',
    coursesCount: 8,
    studentsCount: 3200,
  },
  {
    id: '3',
    title: '软件架构师',
    description: '软件架构师精修课程，提升系统设计能力',
    icon: 'Setting',
    path: '/category/architecture',
    coursesCount: 15,
    studentsCount: 8900,
  },
  {
    id: '4',
    title: 'MCP 实战',
    description: 'MCP 协议深度解析，掌握模型通信协议',
    icon: 'Connection',
    path: '/category/mcp',
    coursesCount: 6,
    studentsCount: 2100,
  },
]

// Mock 学习路径数据
export const mockLearningPaths: LearningPath[] = [
  {
    id: '1',
    title: 'AI大模型前沿知识',
    description: 'ChatGPT、AI Agent及深度学习的完整学习路径，从基础概念到实战应用。',
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    category: 'ai',
    level: 'intermediate',
    courses: [courses[2], courses[0]], // AI课程 + Vue3课程
    totalDuration: 819, // 所有课程总时长
    studentsCount: 1560,
    rating: 4.8,
    price: 599,
    originalPrice: 998,
    instructor: mockInstructors[2],
    skills: ['AI开发', 'Python', '机器学习', 'Web开发'],
    createdAt: '2024-02-01',
  },
  {
    id: '2',
    title: '全栈工程师养成',
    description: '从前端到后端的完整技术栈学习，成为独当一面的全栈开发者。',
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    category: 'fullstack',
    level: 'advanced',
    courses: [courses[0], courses[1]], // Vue3 + Node.js
    totalDuration: 655,
    studentsCount: 2340,
    rating: 4.7,
    price: 459,
    originalPrice: 698,
    instructor: mockInstructors[1],
    skills: ['前端开发', '后端开发', '数据库', '部署运维'],
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    title: '移动开发专家',
    description: '掌握移动端开发技术，包括原生开发和跨平台开发解决方案。',
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    category: 'mobile',
    level: 'intermediate',
    courses: [courses[3]], // React Native
    totalDuration: 320,
    studentsCount: 890,
    rating: 4.6,
    price: 299,
    originalPrice: 459,
    instructor: mockInstructors[3],
    skills: ['移动开发', '跨平台', 'React Native', 'Flutter'],
    createdAt: '2024-01-25',
  },
]

// Mock 轮播图数据 - 基于用户提供的宽屏图片优化
export const mockBanners = [
  {
    id: 1,
    title: '100+ 小时热门好课免费学',
    image: '/banners/ai-course-banner.png', // AI大模型|软考|Java|Go|架构|云原生
    link: '/courses?category=ai',
  },
  {
    id: 2,
    title: 'AI时代企业产品能力建设培养项目',
    image: '/banners/ai-enterprise-banner.png', // 用AI重构产品增长新曲线
    link: '/courses?category=ai-enterprise',
  },
  {
    id: 3,
    title: 'MCP实战课程',
    image: '/banners/mcp-course-banner.png', // 4个实战项目实现MCP从入门到进阶
    link: '/courses?category=mcp',
  },
  {
    id: 4,
    title: '大模型安全实战课',
    image: '/banners/security-course-banner.png', // 从认知到防御，全方位建设大模型安全防线
    link: '/courses?category=security',
  },
]
