<template>
  <div class="settings-view">
    <div class="settings-container">
      <!-- 页面头部 -->
      <div class="settings-header">
        <div class="header-content">
          <div class="header-left">
            <h1 class="page-title">账号设置</h1>
            <p class="page-subtitle">管理个人信息、账号安全和系统偏好</p>
          </div>
          <div class="header-right">
            <div class="user-card">
              <div class="user-avatar">
                <img :src="profileForm.avatar" alt="用户头像" />
              </div>
              <div class="user-info">
                <div class="user-name">{{ profileForm.displayName }}</div>
                <div class="user-email">{{ userStore.user?.email }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 设置导航标签 -->
      <div class="settings-tabs">
        <el-tabs v-model="activeTab" class="settings-tab-container">
          <el-tab-pane label="个人资料" name="profile">
            <template #label>
              <div class="tab-label">
                <el-icon><User /></el-icon>
                <span>个人资料</span>
              </div>
            </template>
          </el-tab-pane>

          <el-tab-pane label="账号安全" name="security">
            <template #label>
              <div class="tab-label">
                <el-icon><Lock /></el-icon>
                <span>账号安全</span>
              </div>
            </template>
          </el-tab-pane>

          <el-tab-pane label="偏好设置" name="preferences">
            <template #label>
              <div class="tab-label">
                <el-icon><Setting /></el-icon>
                <span>偏好设置</span>
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 设置内容 -->
      <div class="settings-content">
        <!-- 个人资料标签页 -->
        <div v-if="activeTab === 'profile'" class="tab-content profile-content">
          <div class="content-header">
            <h2>个人资料管理</h2>
            <p>编辑您的个人信息，这些信息将在个人中心页面展示</p>
          </div>

          <div class="profile-sections">
            <!-- 基本信息卡片 -->
            <div class="info-card">
              <div class="card-header">
                <h3>基本信息</h3>
                <p>管理您的显示名称、头像和个人简介</p>
              </div>

              <div class="card-content">
                <el-form :model="profileForm" label-width="100px" class="profile-form">
                  <el-form-item label="头像">
                    <div class="avatar-setting">
                      <div class="avatar-preview">
                        <img :src="profileForm.avatar" alt="头像" />
                      </div>
                      <div class="avatar-actions">
                        <el-button size="small" @click="uploadAvatar">更换头像</el-button>
                        <el-button size="small" type="danger" text @click="removeAvatar"
                          >移除</el-button
                        >
                      </div>
                    </div>
                  </el-form-item>

                  <el-form-item label="显示名称">
                    <el-input v-model="profileForm.displayName" placeholder="请输入显示名称" />
                  </el-form-item>

                  <el-form-item label="个人简介">
                    <el-input
                      v-model="profileForm.bio"
                      type="textarea"
                      :rows="3"
                      placeholder="介绍一下自己吧..."
                    />
                  </el-form-item>

                  <el-form-item label="个人网站">
                    <el-input v-model="profileForm.website" placeholder="https://..." />
                  </el-form-item>

                  <el-form-item label="所在地区">
                    <el-select v-model="profileForm.location" placeholder="选择地区">
                      <el-option label="北京" value="beijing" />
                      <el-option label="上海" value="shanghai" />
                      <el-option label="广州" value="guangzhou" />
                      <el-option label="深圳" value="shenzhen" />
                      <el-option label="其他" value="other" />
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>
            </div>

            <!-- 详细信息卡片 -->
            <div class="info-card">
              <div class="card-header">
                <h3>详细信息</h3>
                <p>完善您的详细信息，帮助其他人更好地了解您</p>
              </div>

              <div class="card-content">
                <el-form :model="profileForm" label-width="100px" class="profile-form">
                  <el-form-item label="职业">
                    <el-input v-model="profileForm.occupation" placeholder="您的职业" />
                  </el-form-item>

                  <el-form-item label="公司">
                    <el-input v-model="profileForm.company" placeholder="您的公司" />
                  </el-form-item>

                  <el-form-item label="技能标签">
                    <el-tag
                      v-for="skill in profileForm.skills"
                      :key="skill"
                      closable
                      @close="removeSkill(skill)"
                      class="skill-tag"
                    >
                      {{ skill }}
                    </el-tag>
                    <el-input
                      v-if="inputVisible"
                      ref="InputRef"
                      v-model="inputValue"
                      class="skill-input"
                      size="small"
                      @keyup.enter="handleInputConfirm"
                      @blur="handleInputConfirm"
                    />
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">
                      + 添加技能
                    </el-button>
                  </el-form-item>

                  <el-form-item label="社交链接">
                    <div class="social-links">
                      <el-input v-model="profileForm.github" placeholder="GitHub 用户名">
                        <template #prepend>GitHub</template>
                      </el-input>
                      <el-input v-model="profileForm.weibo" placeholder="微博 ID">
                        <template #prepend>微博</template>
                      </el-input>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
            </div>

            <div class="form-actions">
              <el-button type="primary" size="large" @click="saveProfile">保存更改</el-button>
              <el-button size="large" @click="resetProfile">重置</el-button>
            </div>
          </div>
        </div>

        <!-- 账号安全标签页 -->
        <div v-else-if="activeTab === 'security'" class="tab-content security-content">
          <div class="content-header">
            <h2>账号安全中心</h2>
            <p>保护您的账号安全，管理登录信息和安全设置</p>
          </div>

          <div class="security-sections">
            <!-- 登录信息 -->
            <div class="security-card">
              <div class="card-header">
                <h3>登录信息</h3>
                <p>管理您的登录凭据</p>
              </div>

              <div class="security-items">
                <div class="security-item">
                  <div class="item-icon">
                    <el-icon><Lock /></el-icon>
                  </div>
                  <div class="item-info">
                    <h4>登录密码</h4>
                    <p>建议定期更新密码以保护账号安全</p>
                  </div>
                  <div class="item-actions">
                    <el-button @click="changePassword">修改密码</el-button>
                  </div>
                </div>

                <div class="security-item">
                  <div class="item-icon">
                    <el-icon><Phone /></el-icon>
                  </div>
                  <div class="item-info">
                    <h4>手机号码</h4>
                    <p>{{ userStore.user?.phone || '未绑定手机号' }}</p>
                  </div>
                  <div class="item-actions">
                    <el-button v-if="!userStore.user?.phone" type="primary">绑定手机</el-button>
                    <el-button v-else>更换手机</el-button>
                  </div>
                </div>

                <div class="security-item">
                  <div class="item-icon">
                    <el-icon><Message /></el-icon>
                  </div>
                  <div class="item-info">
                    <h4>邮箱地址</h4>
                    <p>{{ userStore.user?.email || '未绑定邮箱' }}</p>
                  </div>
                  <div class="item-actions">
                    <el-button v-if="!userStore.user?.email" type="primary">绑定邮箱</el-button>
                    <el-button v-else>更换邮箱</el-button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 安全设置 -->
            <div class="security-card">
              <div class="card-header">
                <h3>安全设置</h3>
                <p>提升账号安全等级</p>
              </div>

              <div class="security-items">
                <div class="security-item">
                  <div class="item-icon">
                    <el-icon><Lock /></el-icon>
                  </div>
                  <div class="item-info">
                    <h4>两步验证</h4>
                    <p>{{ twoFactorEnabled ? '已启用' : '未启用' }} - 为账号添加额外安全保护</p>
                  </div>
                  <div class="item-actions">
                    <el-switch v-model="twoFactorEnabled" @change="toggleTwoFactor" />
                  </div>
                </div>

                <div class="security-item">
                  <div class="item-icon">
                    <el-icon><Monitor /></el-icon>
                  </div>
                  <div class="item-info">
                    <h4>登录设备管理</h4>
                    <p>查看和管理已登录的设备</p>
                  </div>
                  <div class="item-actions">
                    <el-button @click="manageDevices">管理设备</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 偏好设置标签页 -->
        <div v-else-if="activeTab === 'preferences'" class="tab-content preferences-content">
          <div class="content-header">
            <h2>偏好设置</h2>
            <p>自定义您的使用体验和通知偏好</p>
          </div>

          <div class="preferences-sections">
            <!-- 界面设置 -->
            <div class="preference-card">
              <div class="card-header">
                <h3>界面设置</h3>
                <p>个性化您的界面体验</p>
              </div>

              <div class="preference-items">
                <div class="preference-item">
                  <div class="item-info">
                    <h4>主题模式</h4>
                    <p>选择您喜欢的界面主题</p>
                  </div>
                  <div class="item-control">
                    <el-radio-group v-model="preferences.theme">
                      <el-radio value="light">浅色</el-radio>
                      <el-radio value="dark">深色</el-radio>
                      <el-radio value="auto">跟随系统</el-radio>
                    </el-radio-group>
                  </div>
                </div>

                <div class="preference-item">
                  <div class="item-info">
                    <h4>字体大小</h4>
                    <p>调整界面字体大小</p>
                  </div>
                  <div class="item-control">
                    <el-radio-group v-model="preferences.fontSize">
                      <el-radio value="small">小</el-radio>
                      <el-radio value="medium">中</el-radio>
                      <el-radio value="large">大</el-radio>
                    </el-radio-group>
                  </div>
                </div>

                <div class="preference-item">
                  <div class="item-info">
                    <h4>动画效果</h4>
                    <p>启用或关闭界面动画</p>
                  </div>
                  <div class="item-control">
                    <el-switch v-model="preferences.animations" />
                  </div>
                </div>
              </div>
            </div>

            <!-- 通知设置 -->
            <div class="preference-card">
              <div class="card-header">
                <h3>通知设置</h3>
                <p>选择您希望接收的通知类型</p>
              </div>

              <div class="notification-groups">
                <div class="notification-group">
                  <h4>学习通知</h4>
                  <div class="notification-items">
                    <div class="notification-item">
                      <div class="item-info">
                        <span>课程更新提醒</span>
                        <small>当您关注的课程有新内容时通知您</small>
                      </div>
                      <el-switch v-model="notifications.courseUpdates" />
                    </div>

                    <div class="notification-item">
                      <div class="item-info">
                        <span>学习计划提醒</span>
                        <small>根据您的学习计划发送提醒</small>
                      </div>
                      <el-switch v-model="notifications.studyReminders" />
                    </div>

                    <div class="notification-item">
                      <div class="item-info">
                        <span>成就解锁通知</span>
                        <small>获得新成就时通知您</small>
                      </div>
                      <el-switch v-model="notifications.achievements" />
                    </div>
                  </div>
                </div>

                <div class="notification-group">
                  <h4>系统通知</h4>
                  <div class="notification-items">
                    <div class="notification-item">
                      <div class="item-info">
                        <span>系统更新</span>
                        <small>重要系统更新和维护通知</small>
                      </div>
                      <el-switch v-model="notifications.systemUpdates" />
                    </div>

                    <div class="notification-item">
                      <div class="item-info">
                        <span>营销推广</span>
                        <small>课程推荐和优惠活动通知</small>
                      </div>
                      <el-switch v-model="notifications.marketing" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <el-button type="primary" size="large" @click="savePreferences">保存设置</el-button>
              <el-button size="large" @click="resetPreferences">重置</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useUserStore } from '@/stores/user'
import { User, Lock, Setting, Phone, Message, Monitor } from '@element-plus/icons-vue'
import type { ElInput } from 'element-plus'

const userStore = useUserStore()

// 当前激活的标签页
const activeTab = ref('profile')

// 个人资料表单
const profileForm = ref({
  avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
  displayName: '演示用户',
  bio: '热爱学习的程序员，专注于前端技术研发',
  website: 'https://example.com',
  location: 'beijing',
  occupation: '前端工程师',
  company: '科技公司',
  skills: ['Vue.js', 'TypeScript', 'Node.js'],
  github: 'username',
  weibo: 'username',
})

// 安全设置
const twoFactorEnabled = ref(false)

// 偏好设置
const preferences = ref({
  theme: 'light',
  fontSize: 'medium',
  animations: true,
})

// 通知设置
const notifications = ref({
  courseUpdates: true,
  studyReminders: true,
  achievements: true,
  systemUpdates: true,
  marketing: false,
})

// 技能标签输入
const inputVisible = ref(false)
const inputValue = ref('')
const InputRef = ref<InstanceType<typeof ElInput>>()

// 方法
const uploadAvatar = () => {
  console.log('上传头像')
}

const removeAvatar = () => {
  console.log('移除头像')
}

const saveProfile = () => {
  console.log('保存个人资料')
}

const resetProfile = () => {
  console.log('重置个人资料')
}

const removeSkill = (skill: string) => {
  const index = profileForm.value.skills.indexOf(skill)
  if (index > -1) {
    profileForm.value.skills.splice(index, 1)
  }
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value && !profileForm.value.skills.includes(inputValue.value)) {
    profileForm.value.skills.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}

const changePassword = () => {
  console.log('修改密码')
}

const toggleTwoFactor = () => {
  console.log('切换两步验证')
}

const manageDevices = () => {
  console.log('管理设备')
}

const savePreferences = () => {
  console.log('保存偏好设置')
}

const resetPreferences = () => {
  console.log('重置偏好设置')
}
</script>

<style scoped lang="scss">
.settings-view {
  min-height: calc(100vh - 64px);
  background: var(--background-light);

  .settings-container {
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: 24px;
  }
}

.settings-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  color: white;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-left {
      .page-title {
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 8px;
        background: linear-gradient(45deg, #fff, #e3f2fd);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .page-subtitle {
        font-size: 16px;
        opacity: 0.9;
        margin: 0;
      }
    }

    .header-right {
      .user-card {
        display: flex;
        align-items: center;
        gap: 16px;
        background: rgba(255, 255, 255, 0.1);
        padding: 16px;
        border-radius: 12px;
        backdrop-filter: blur(10px);

        .user-avatar img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 3px solid rgba(255, 255, 255, 0.2);
        }

        .user-info {
          .user-name {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 4px;
          }

          .user-email {
            font-size: 14px;
            opacity: 0.8;
          }
        }
      }
    }
  }
}

.settings-tabs {
  margin-bottom: 32px;

  :deep(.settings-tab-container) {
    .el-tabs__header {
      margin: 0;
      border: none;
    }

    .el-tabs__nav-wrap {
      background: white;
      border-radius: 16px;
      padding: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid #f0f2f5;

      &::after {
        display: none;
      }
    }

    .el-tabs__item {
      border-radius: 12px;
      margin-right: 8px;
      padding: 12px 20px;
      font-weight: 500;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;

      &:hover:not(.is-active) {
        background: rgba(102, 126, 234, 0.1);
        color: #667eea;
        transform: translateY(-1px);
      }

      &.is-active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        transform: translateY(-2px);

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
          pointer-events: none;
        }
      }

      .tab-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;

        .el-icon {
          font-size: 16px;
        }
      }
    }
  }
}

.settings-content {
  .tab-content {
    background: white;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

    .content-header {
      margin-bottom: 32px;
      text-align: center;

      h2 {
        font-size: 24px;
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 8px;
      }

      p {
        color: #7f8c8d;
        margin: 0;
      }
    }
  }

  .profile-sections {
    .info-card {
      background: linear-gradient(135deg, #fafbfc 0%, #ffffff 100%);
      border: 1px solid #e8ecf4;
      border-radius: 16px;
      padding: 28px;
      margin-bottom: 24px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        border-color: rgba(102, 126, 234, 0.2);
      }

      .card-header {
        margin-bottom: 28px;
        position: relative;

        h3 {
          font-size: 20px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;

          &::before {
            content: '';
            width: 4px;
            height: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 2px;
          }
        }

        p {
          color: #7f8c8d;
          margin: 0;
          font-size: 14px;
          line-height: 1.5;
          margin-left: 12px;
        }
      }

      .card-content {
        .profile-form {
          :deep(.el-form-item) {
            margin-bottom: 24px;

            .el-form-item__label {
              font-weight: 500;
              color: #2c3e50;
              margin-bottom: 8px;
            }

            .el-input__wrapper {
              border-radius: 8px;
              border: 1px solid #e8ecf4;
              transition: all 0.3s ease;

              &:hover {
                border-color: #667eea;
              }

              &.is-focus {
                border-color: #667eea;
                box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
              }
            }

            .el-textarea__inner {
              border-radius: 8px;
              border: 1px solid #e8ecf4;
              transition: all 0.3s ease;
              resize: vertical;

              &:hover {
                border-color: #667eea;
              }

              &:focus {
                border-color: #667eea;
                box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
              }
            }

            .el-select {
              width: 100%;

              .el-select__wrapper {
                border-radius: 8px;
                border: 1px solid #e8ecf4;
                transition: all 0.3s ease;

                &:hover {
                  border-color: #667eea;
                }

                &.is-focused {
                  border-color: #667eea;
                  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
                }
              }
            }
          }

          .avatar-setting {
            display: flex;
            align-items: center;
            gap: 20px;
            padding: 20px;
            background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
            border-radius: 12px;
            border: 1px solid #e8ecf4;

            .avatar-preview {
              position: relative;

              img {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                object-fit: cover;
                border: 4px solid white;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              }

              &::after {
                content: '';
                position: absolute;
                inset: -2px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea, #764ba2);
                z-index: -1;
              }
            }

            .avatar-actions {
              display: flex;
              flex-direction: column;
              gap: 12px;

              .el-button {
                border-radius: 8px;
                transition: all 0.3s ease;

                &:hover {
                  transform: translateY(-1px);
                }
              }
            }
          }

          .skill-tag {
            margin-right: 8px;
            margin-bottom: 8px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 20px;
            font-weight: 500;
            transition: all 0.3s ease;

            &:hover {
              transform: translateY(-1px);
              box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            }

            .el-icon {
              margin-left: 6px;
              transition: all 0.3s ease;

              &:hover {
                transform: scale(1.2);
              }
            }
          }

          .skill-input {
            width: 140px;
            margin-right: 8px;

            :deep(.el-input__wrapper) {
              border-radius: 20px;
              border: 2px dashed #e8ecf4;
              background: #fafbfc;

              &:hover,
              &.is-focus {
                border-color: #667eea;
                background: white;
              }
            }
          }

          .button-new-tag {
            border-style: dashed;
            border-color: #e8ecf4;
            color: #7f8c8d;
            border-radius: 20px;
            background: #fafbfc;
            transition: all 0.3s ease;

            &:hover {
              border-color: #667eea;
              color: #667eea;
              background: white;
              transform: translateY(-1px);
            }
          }

          .social-links {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
        }
      }
    }
  }

  .security-sections,
  .preferences-sections {
    .security-card,
    .preference-card {
      background: linear-gradient(135deg, #fafbfc 0%, #ffffff 100%);
      border: 1px solid #e8ecf4;
      border-radius: 16px;
      padding: 28px;
      margin-bottom: 24px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        border-color: rgba(102, 126, 234, 0.2);
      }

      .card-header {
        margin-bottom: 28px;
        position: relative;

        h3 {
          font-size: 20px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;

          &::before {
            content: '';
            width: 4px;
            height: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 2px;
          }
        }

        p {
          color: #7f8c8d;
          margin: 0;
          font-size: 14px;
          line-height: 1.5;
          margin-left: 12px;
        }
      }

      .security-items,
      .preference-items {
        .security-item,
        .preference-item {
          display: flex;
          align-items: center;
          padding: 20px;
          margin-bottom: 12px;
          background: white;
          border: 1px solid #e8ecf4;
          border-radius: 12px;
          transition: all 0.3s ease;
          cursor: pointer;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
            border-color: rgba(102, 126, 234, 0.3);
          }

          &:last-child {
            margin-bottom: 0;
          }

          .item-icon {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            margin-right: 20px;
            font-size: 20px;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          }

          .item-info {
            flex: 1;

            h4 {
              font-size: 16px;
              font-weight: 600;
              color: #2c3e50;
              margin-bottom: 6px;
              line-height: 1.3;
            }

            p {
              color: #7f8c8d;
              margin: 0;
              font-size: 13px;
              line-height: 1.4;
            }
          }

          .item-actions {
            margin-left: auto;

            .el-button {
              border-radius: 8px;
              height: 36px;
              font-weight: 500;
              transition: all 0.3s ease;

              &:hover {
                transform: translateY(-1px);
              }
            }
          }

          .item-control {
            margin-left: auto;

            :deep(.el-switch) {
              .el-switch__core {
                border-radius: 20px;
                height: 24px;
                line-height: 24px;

                &::after {
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                }
              }

              &.is-checked .el-switch__core {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-color: transparent;
              }
            }
          }
        }
      }

      .notification-groups {
        .notification-group {
          margin-bottom: 24px;

          &:last-child {
            margin-bottom: 0;
          }

          h4 {
            font-size: 16px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 16px;
          }

          .notification-items {
            .notification-item {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #e9ecef;

              &:last-child {
                border-bottom: none;
              }

              .item-info {
                span {
                  font-weight: 500;
                  color: #2c3e50;
                  display: block;
                  margin-bottom: 4px;
                }

                small {
                  color: #7f8c8d;
                  font-size: 12px;
                }
              }
            }
          }
        }
      }
    }
  }

  .form-actions {
    margin-top: 40px;
    text-align: center;
    padding-top: 32px;
    border-top: 1px solid #e8ecf4;
    background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
    border-radius: 12px;
    padding: 24px;
    margin-left: -28px;
    margin-right: -28px;
    margin-bottom: -28px;

    .el-button {
      margin: 0 8px;
      min-width: 120px;
      height: 40px;
      border-radius: 10px;
      font-weight: 500;
      transition: all 0.3s ease;

      &.el-button--primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        &:active {
          transform: translateY(0);
        }
      }

      &:not(.el-button--primary) {
        background: white;
        border: 1px solid #e8ecf4;
        color: #2c3e50;

        &:hover {
          border-color: #667eea;
          color: #667eea;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .settings-container {
    padding: 16px;
  }

  .settings-header {
    padding: 24px;

    .header-content {
      flex-direction: column;
      gap: 16px;
      text-align: center;
    }
  }

  .tab-content {
    padding: 24px 16px;
  }

  .profile-form {
    .social-links {
      grid-template-columns: 1fr;
    }
  }
}
</style>
