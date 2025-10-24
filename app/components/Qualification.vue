<script setup lang="ts">
import { siteConfig } from '../config'

// 从 siteConfig.personal.social.github 中解析 GitHub 用户名
const githubUrl = siteConfig?.personal?.social?.github || ''
const githubUsername = githubUrl.replace(/\/$/, '').split('/').pop() || ''

const iconModules = import.meta.glob('./icones/*.vue', { eager: true }) as Record<string, any>

// 处理组件信息，从文件名提取显示名称和组件实例
const techIcons = Object.entries(iconModules).map(([path, module]) => {
  const fileName = path.split('/').pop()?.replace('.vue', '') || ''
  // 从组件名称中提取显示名称（去掉 Logos 前缀）
  const displayName = fileName.replace(/^Logos/, '').replace(/Icon$/, '')
  return {
    name: displayName,
    component: module.default || module
  }
})

// 个人履历组件
interface Education {
  title: string
  period: string
  school: string
  courses: string
}

interface Skill {
  category: string
  technologies: { name: string; color: string }[]
}

interface WorkExperience {
  position: string
  period: string
  company: string
  responsibilities: string[]
  isActive: boolean
}

interface Project {
  title: string
  description: string
  technologies: { name: string; color: string }[]
  bgColor: string
  borderColor: string
}

interface Award {
  title: string
  subtitle: string
  icon: string
  bgColor: string
  borderColor: string
  iconColor: string
}

const education: Education[] = [
  {
    title: '虚拟现实技术应用',
    period: '2024 - 2027',
    school: '深圳信息职业技术大学',
    courses: '主修课程：虚拟现实引擎、C#'
  }
]

const skills: Skill[] = [
  {
    category: '前端开发',
    technologies: [
      { name: 'Astro', color: 'bg-orange-100 text-orange-800' },
      { name: 'Vue', color: 'bg-blue-100 text-blue-800' }
    ]
  },
  {
    category: '虚拟现实',
    technologies: [
      { name: 'Unity', color: 'bg-blue-100 text-blue-800' },
      { name: 'C#', color: 'bg-orange-100 text-orange-800' }
    ]
  },
  {
    category: '后端开发',
    technologies: [
      { name: 'C#', color: 'bg-purple-100 text-purple-800' },
      { name: 'Node.js', color: 'bg-green-100 text-green-800' }
    ]
  },
  {
    category: '数据库',
    technologies: [
      { name: 'MySQL', color: 'bg-gray-100 text-gray-800' },
      { name: 'Redis', color: 'bg-red-100 text-red-800' }
    ]
  }
]

const workExperience: WorkExperience[] = [
  {
    position: '前端开发实习生',
    period: '2024.06 - 2024.09',
    company: '某某科技有限公司',
    responsibilities: [
      '参与公司主要产品的前端开发，使用Vue.js构建用户界面',
      '优化页面性能，提升用户体验',
      '与后端团队协作，完成API对接'
    ],
    isActive: true
  },
  {
    position: '全栈开发实习生',
    period: '2023.07 - 2023.09',
    company: '某某互联网公司',
    responsibilities: [
      '独立开发小程序功能模块',
      '参与后端API设计和开发',
      '学习并应用敏捷开发流程'
    ],
    isActive: false
  }
]

const projects: Project[] = [
  {
    title: '个人主页',
    description: '基于Nuxt的静态个人主页，支持RSS订阅博客文章、项目展示',
    technologies: [
      { name: 'Nuxt', color: 'bg-blue-100 text-blue-800' },
      { name: 'Tailwind', color: 'bg-orange-100 text-orange-800' }
    ],
    bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    borderColor: 'border-blue-100'
  },
  {
    title: '在线学习平台',
    description: '课程管理和在线学习系统，包含视频播放和进度追踪',
    technologies: [
      { name: 'C#', color: 'bg-purple-100 text-purple-800' },
      { name: '.NET Core', color: 'bg-blue-100 text-blue-800' },
      { name: 'MySQL', color: 'bg-gray-100 text-gray-800' }
    ],
    bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
    borderColor: 'border-green-100'
  }
]

const awards: Award[] = [
  {
    title: '优秀学生',
    subtitle: '2022-2023学年',
    icon: 'fas fa-medal',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-500'
  },
  {
    title: '编程竞赛三等奖',
    subtitle: '2023年',
    icon: 'fas fa-code',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-500'
  },
  {
    title: 'JLPT-N2证书',
    subtitle: '日语能力测试N2级',
    icon: 'fas fa-certificate',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-500'
  }
]
</script>

<template>
  <section class="bg-white rounded-3xl shadow-lg p-8 w-full mb-12"
           style="box-shadow: 0 4px 24px rgba(139,90,140,0.08);">
    <h2 class="text-3xl font-bold text-primary mb-8 text-center font-fumofumo">个人履历（以下功能可以在配置文件中开或关）</h2>
    
    <!-- GitHub 热力图 -->
    <div v-if="siteConfig.qualificationSections.githubHeatmap" class="mb-8">
      <h3 class="text-xl font-semibold text-primary mb-4 flex items-center">
        <i class="fab fa-github mr-2"></i>
        GitHub 活动
      </h3>
      <div class="flex justify-center">
        <img
          v-if="githubUsername"
          :src="`https://ghchart.rshah.org/${githubUsername}`"
          :alt="`GitHub contributions for ${githubUsername}`"
          class="w-full max-w-4xl"
        />
        <p v-else class="text-sm text-gray-500">未配置 GitHub 用户名</p>
      </div>
    </div>

    <!-- 技能专长 -->
    <div v-if="siteConfig.qualificationSections.skills" class="mb-8">
      <h3 class="text-xl font-semibold text-primary mb-4 flex items-center">
        <i class="fas fa-code mr-2"></i>
        技能专长
      </h3>
      <div class="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
        <div v-for="icon in techIcons" :key="icon.name"
             class="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors group">
          <component :is="icon.component" class="w-12 h-12 mb-2" />
          <span class="text-xs text-gray-600 text-center">{{ icon.name }}</span>
        </div>
      </div>
    </div>

    <!-- 教育背景 -->
    <div v-if="siteConfig.qualificationSections.education" class="mb-8">
      <h3 class="text-xl font-semibold text-primary mb-4 flex items-center">
        <i class="fas fa-code mr-2"></i>
          教育背景
        </h3>
        <div class="space-y-4">
          <div v-for="edu in education" :key="edu.title" 
               class="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4">
            <div class="flex justify-between items-start mb-2">
              <h4 class="font-semibold text-gray-800">{{ edu.title }}</h4>
              <span class="text-sm text-gray-500">{{ edu.period }}</span>
            </div>
            <p class="text-gray-600 text-sm">{{ edu.school }}</p>
            <p class="text-gray-600 text-sm mt-1">{{ edu.courses }}</p>
          </div>
        </div>
      </div>



    <!-- 工作经历 -->
    <div v-if="siteConfig.qualificationSections.workExperience" class="mt-8">
      <h3 class="text-xl font-semibold text-primary mb-6 flex items-center">
        <i class="fas fa-briefcase mr-2"></i>
        工作经历
      </h3>
      <div class="space-y-6">
        <div v-for="work in workExperience" :key="work.position"
             :class="`pl-6 relative ${work.isActive ? 'border-l-4 border-primary' : 'border-l-4 border-gray-300'}`">
          <div :class="`absolute w-3 h-3 rounded-full -left-2 top-2 ${work.isActive ? 'bg-primary' : 'bg-gray-300'}`"></div>
          <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
            <h4 class="font-semibold text-gray-800">{{ work.position }}</h4>
            <span class="text-sm text-gray-500">{{ work.period }}</span>
          </div>
          <p class="text-gray-600 text-sm mb-2">{{ work.company }}</p>
          <ul class="text-gray-600 text-sm space-y-1">
            <li v-for="responsibility in work.responsibilities" :key="responsibility">
              • {{ responsibility }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 项目经历 -->
    <div v-if="siteConfig.qualificationSections.projects" class="mt-8">
      <h3 class="text-xl font-semibold text-primary mb-6 flex items-center">
        <i class="fas fa-rocket mr-2"></i>
        主要项目
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="project in projects" :key="project.title"
             :class="`${project.bgColor} rounded-lg p-4 border ${project.borderColor}`">
          <h4 class="font-semibold text-gray-800 mb-2">{{ project.title }}</h4>
          <p class="text-gray-600 text-sm mb-3">{{ project.description }}</p>
          <div class="flex gap-2 flex-wrap">
            <span v-for="tech in project.technologies" :key="tech.name"
                  :class="`px-2 py-1 text-xs rounded ${tech.color}`">
              {{ tech.name }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 获得荣誉 -->
    <div v-if="siteConfig.qualificationSections.awards" class="mt-8">
      <h3 class="text-xl font-semibold text-primary mb-6 flex items-center">
        <i class="fas fa-trophy mr-2"></i>
        获得荣誉
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="award in awards" :key="award.title"
             :class="`text-center ${award.bgColor} rounded-lg p-4 border ${award.borderColor}`">
          <i :class="`${award.icon} ${award.iconColor} text-2xl mb-2`"></i>
          <h4 class="font-semibold text-gray-800 text-sm">{{ award.title }}</h4>
          <p class="text-gray-600 text-xs">{{ award.subtitle }}</p>
        </div>
      </div>
    </div>

  </section>
</template>

<style scoped>
/* 组件特定样式 */
</style>
