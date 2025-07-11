<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <!-- Logo -->
        <div class="logo">
          <router-link to="/" class="logo-link">
            <span class="logo-text">BIMOWU</span>
          </router-link>
        </div>

        <!-- 导航菜单 -->
        <nav class="nav-menu">
          <router-link to="/" class="nav-item">首页</router-link>
          <router-link to="/courses" class="nav-item">课程</router-link>
          <router-link to="/paths" class="nav-item">学习路径</router-link>
          <router-link to="/instructors" class="nav-item">讲师</router-link>
        </nav>

        <!-- 搜索框 -->
        <div class="search-box">
          <el-input
            v-model="searchQuery"
            placeholder="搜索课程、讲师或技能"
            prefix-icon="Search"
            @keyup.enter="handleSearch"
          />
        </div>

        <!-- 用户操作区域 -->
        <div class="user-actions">
          <!-- 未登录状态 -->
          <template v-if="!userStore.isLoggedIn">
            <el-button type="primary" class="login-btn" @click="showLoginDialog = true">
              登录
            </el-button>
            <el-button class="register-btn" @click="showRegisterDialog = true"> 注册 </el-button>
          </template>

          <!-- 已登录状态 -->
          <template v-else>
            <el-dropdown @command="handleUserCommand">
              <div class="user-profile">
                <img
                  :src="userStore.user?.avatar"
                  :alt="userStore.user?.name"
                  class="user-avatar"
                />
                <span class="user-name">{{ userStore.user?.name }}</span>
                <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                  <el-dropdown-item command="progress">学习进度</el-dropdown-item>
                  <el-dropdown-item command="settings">设置</el-dropdown-item>
                  <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </div>

        <!-- 登录对话框 -->
        <el-dialog v-model="showLoginDialog" title="用户登录" width="400px" align-center>
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="80px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="loginForm.username" placeholder="请输入用户名或邮箱" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                show-password
                @keyup.enter="handleLogin"
              />
            </el-form-item>
          </el-form>

          <div class="login-tips">
            <p>演示账号：demo，密码：123456</p>
          </div>

          <template #footer>
            <div class="dialog-footer">
              <el-button @click="showLoginDialog = false">取消</el-button>
              <el-button type="primary" :loading="loginLoading" @click="handleLogin">
                登录
              </el-button>
            </div>
          </template>
        </el-dialog>

        <!-- 注册对话框 -->
        <el-dialog v-model="showRegisterDialog" title="用户注册" width="400px" align-center>
          <el-form
            ref="registerFormRef"
            :model="registerForm"
            :rules="registerRules"
            label-width="80px"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="registerForm.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input v-model="registerForm.name" placeholder="请输入真实姓名" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="registerForm.email" placeholder="请输入邮箱地址" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="registerForm.password"
                type="password"
                placeholder="请输入密码"
                show-password
              />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                show-password
                @keyup.enter="handleRegister"
              />
            </el-form-item>
          </el-form>

          <template #footer>
            <div class="dialog-footer">
              <el-button @click="showRegisterDialog = false">取消</el-button>
              <el-button type="primary" :loading="registerLoading" @click="handleRegister">
                注册
              </el-button>
            </div>
          </template>
        </el-dialog>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessage, ElForm } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 搜索状态
const searchQuery = ref('')

// 对话框状态
const showLoginDialog = ref(false)
const showRegisterDialog = ref(false)
const loginLoading = ref(false)
const registerLoading = ref(false)

// 表单引用
const loginFormRef = ref<InstanceType<typeof ElForm>>()
const registerFormRef = ref<InstanceType<typeof ElForm>>()

// 登录表单
const loginForm = reactive({
  username: '',
  password: '',
})

// 注册表单
const registerForm = reactive({
  username: '',
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

// 表单验证规则
const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
}

const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为3-20位', trigger: 'blur' },
  ],
  name: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email' as const, message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== registerForm.password) {
          callback(new Error('两次密码输入不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

// 搜索处理
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/courses?search=${encodeURIComponent(searchQuery.value)}`)
  }
}

// 登录处理
const handleLogin = async () => {
  if (!loginFormRef.value) return

  const valid = await loginFormRef.value.validate().catch(() => false)
  if (!valid) return

  loginLoading.value = true

  try {
    const result = await userStore.login(loginForm.username, loginForm.password)

    if (result.success) {
      ElMessage.success(result.message)
      showLoginDialog.value = false
      // 重置表单
      loginForm.username = ''
      loginForm.password = ''
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    ElMessage.error('登录过程中出现错误')
  } finally {
    loginLoading.value = false
  }
}

// 注册处理
const handleRegister = async () => {
  if (!registerFormRef.value) return

  const valid = await registerFormRef.value.validate().catch(() => false)
  if (!valid) return

  registerLoading.value = true

  try {
    const result = await userStore.register(registerForm)

    if (result.success) {
      ElMessage.success(result.message)
      showRegisterDialog.value = false
      // 重置表单
      Object.assign(registerForm, {
        username: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      })
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    ElMessage.error('注册过程中出现错误')
  } finally {
    registerLoading.value = false
  }
}

// 用户下拉菜单处理
const handleUserCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'progress':
      router.push('/progress')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      userStore.logout()
      ElMessage.success('已退出登录')
      break
  }
}

// 初始化
onMounted(() => {
  userStore.initializeAuth()
})
</script>

<style scoped lang="scss">
.app-header {
  background: var(--background-color);
  border-bottom: 1px solid var(--border-color);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 64px;

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
  }

  .logo {
    flex-shrink: 0;

    .logo-link {
      text-decoration: none;

      .logo-text {
        font-size: 24px;
        font-weight: 700;
        color: var(--primary-color);
      }
    }
  }

  .nav-menu {
    display: flex;
    align-items: center;
    gap: 32px;
    margin-left: 48px;

    .nav-item {
      text-decoration: none;
      color: var(--text-primary);
      font-weight: 500;
      padding: 8px 0;
      position: relative;
      transition: color 0.3s ease;

      &:hover,
      &.router-link-active {
        color: var(--primary-color);
      }

      &.router-link-active::after {
        content: '';
        position: absolute;
        bottom: -16px;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--primary-color);
      }
    }
  }

  .search-box {
    flex: 1;
    max-width: 400px;
    margin: 0 32px;

    :deep(.el-input) {
      .el-input__wrapper {
        border-radius: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }
    }
  }

  .user-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;

    .login-btn {
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      border: none;
      border-radius: 20px;
      padding: 8px 20px;
    }

    .register-btn {
      border: 1px solid var(--primary-color);
      color: var(--primary-color);
      border-radius: 20px;
      padding: 8px 20px;
      background: transparent;

      &:hover {
        background: var(--primary-color);
        color: white;
      }
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 20px;
      transition: background-color 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.05);
      }

      .user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
      }

      .user-name {
        font-size: 14px;
        font-weight: 500;
        color: var(--text-primary);
      }

      .dropdown-icon {
        font-size: 12px;
        color: var(--text-secondary);
      }
    }
  }
}

// 对话框样式
.login-tips {
  margin: 16px 0;
  padding: 12px;
  background: #f0f8ff;
  border-radius: 6px;
  border-left: 4px solid var(--primary-color);

  p {
    margin: 0;
    font-size: 13px;
    color: #666;
  }
}

.dialog-footer {
  text-align: right;
}

// 响应式设计
@media (max-width: 768px) {
  .app-header {
    .header-content {
      padding: 0 16px;
    }

    .nav-menu {
      display: none;
    }

    .search-box {
      max-width: 200px;
      margin: 0 16px;
    }

    .user-actions {
      .login-btn,
      .register-btn {
        padding: 6px 12px;
        font-size: 12px;
      }
    }
  }
}
</style>
