<script setup lang="ts">
import { getPageConfig, siteConfig } from '../config'
import { ref, onMounted, onUnmounted } from 'vue'

// 页面配置
const pageConfig = getPageConfig('website')

// 网站状态监测配置
const statusCheckConfig = 'statusCheck' in pageConfig ? pageConfig.statusCheck : {
  enable: true,
  autoRefreshInterval: 300000,
  timeout: 10000,
  showResponseTime: true,
}

// 设置页面元数据
definePageMeta({
  title: pageConfig.title
})

// 分散动画相关
const websiteSectionRef = ref(null)
const paginationRef = ref(null)
const showDisperse = ref(false)
const scrollProgress = ref(0)
const atBottom = ref(false)

// 检测是否为移动设备
const isMobile = ref(false)

// 获取URL参数和路由
const route = useRoute()
const router = useRouter()
const currentPage = computed(() => parseInt(route.query.page as string || '1'))
const websitesPerPage = 10 // 每页最多显示10个网站

const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const windowHeight = window.innerHeight
  const docHeight = document.documentElement.scrollHeight
  
  // 计算滚动进度
  const maxScroll = docHeight - windowHeight
  scrollProgress.value = Math.min((scrollTop / maxScroll) * 100, 100)
  
  // 检查是否滚动到底部
  const isAtBottom = scrollTop + windowHeight >= docHeight - 10
  atBottom.value = isAtBottom
}

// 处理滚轮事件
const handleWheel = (event: WheelEvent) => {
  // 只有当已经到达底部并且再次向下滚动时才触发分散动画
  if (atBottom.value && event.deltaY > 0 && !showDisperse.value) {
    event.preventDefault()
    showDisperse.value = true
    
    // 延迟导航到首页
    setTimeout(() => {
      navigateTo('/')
    }, 1000)
  }
}

onMounted(() => {
  // 检测移动设备
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768
  
  // 监听窗口大小变化
  const handleResize = () => {
    isMobile.value = window.innerWidth < 768
  }
  window.addEventListener('resize', handleResize)
  
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('wheel', handleWheel, { passive: false })
  
  // 检测所有网站状态（如果开启了状态检测）
  if (statusCheckConfig.enable) {
    checkAllWebsites()
    
    // 自动重新检测（使用配置的间隔时间）
    const statusCheckInterval = setInterval(() => {
      checkAllWebsites()
    }, statusCheckConfig.autoRefreshInterval)
    
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('resize', handleResize)
      clearInterval(statusCheckInterval)
    })
  } else {
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('resize', handleResize)
    })
  }
})

// 监听路由变化，切换页码时滚动到顶部
watch(() => route.query.page, (newPage, oldPage) => {
  if (newPage !== oldPage) {
    // 平滑滚动到页面顶部
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
})

// 网站数据类型
interface Website {
  title: string
  description: string
  url: string
  linkText: string
  status?: 'online' | 'offline' | 'checking' // 在线状态
  responseTime?: number // 响应时间（毫秒）
}

// 网站状态映射
const websiteStatus = ref<Map<string, { status: 'online' | 'offline' | 'checking', responseTime?: number }>>(new Map())

// 检测网站状态的函数
const checkWebsiteStatus = async (url: string) => {
  // 如果未开启状态检测，直接返回
  if (!statusCheckConfig.enable) {
    return
  }
  
  if (!url || url === '#') {
    websiteStatus.value.set(url, { status: 'offline' })
    return
  }
  
  websiteStatus.value.set(url, { status: 'checking' })
  
  const startTime = Date.now()
  
  try {
    // 使用代理API来检测网站状态（避免CORS问题）
    const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`, {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache',
      signal: AbortSignal.timeout(statusCheckConfig.timeout) // 使用配置的超时时间
    })
    
    const responseTime = Date.now() - startTime
    
    // 由于使用了 no-cors，我们无法获取真实状态码
    // 如果请求成功完成，我们认为网站在线
    websiteStatus.value.set(url, { 
      status: 'online',
      responseTime: responseTime
    })
  } catch (error) {
    // 如果请求失败，尝试使用备用方法
    try {
      const img = new Image()
      const imgPromise = new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        setTimeout(reject, statusCheckConfig.timeout)
      })
      
      img.src = `${url}/favicon.ico?${Date.now()}`
      
      await imgPromise
      const responseTime = Date.now() - startTime
      websiteStatus.value.set(url, { 
        status: 'online',
        responseTime: responseTime
      })
    } catch {
      websiteStatus.value.set(url, { 
        status: 'offline'
      })
    }
  }
}

// 批量检测所有网站状态
const checkAllWebsites = async () => {
  // 使用 Promise.allSettled 来并发检测，避免一个失败影响其他
  const checks = websites.map(website => checkWebsiteStatus(website.url))
  await Promise.allSettled(checks)
}

// 网站数据
const websites: Website[] = [
  {
    title: '个人主页',
    description: '这是我的个人主页，也就是本站',
    url: 'https://fumomo-nuxt.vercel.app/',
    linkText: '点击查看 →'
  },
  {
    title: '个人博客',
    description: '分享一些技术文章',
    url: 'https://blog.sakura.ink',
    linkText: '点击查看 →'
  },
  {
    title: '站点监控',
    description: '基于 UptimeRobot 接口',
    url: 'https://jk.skura.me',
    linkText: '查看站点状态 →'
  },
  {
    title: 'Minecraft 服务器文档',
    description: '服务器文档',
    url: 'https://doc.sakura.ink/',
    linkText: '点击查看 →'
  },
  {
    title: '示例网站 1',
    description: '这是一个示例网站的描述',
    url: '#',
    linkText: '示例链接 →'
  },
  {
    title: '示例网站 2',
    description: '这是另一个示例网站的描述',
    url: '#',
    linkText: '示例链接 →'
  },
  {
    title: '示例网站 3',
    description: '更多示例网站内容',
    url: '#',
    linkText: '示例链接 →'
  },
  {
    title: '示例网站 4',
    description: '展示分页功能的示例',
    url: '#',
    linkText: '示例链接 →'
  },
  {
    title: '示例网站 5',
    description: '测试分页效果',
    url: '#',
    linkText: '示例链接 →'
  },
  {
    title: '示例网站 6',
    description: '更多测试内容',
    url: '#',
    linkText: '示例链接 →'
  },
  {
    title: '示例网站 7',
    description: '第二页测试内容',
    url: '#',
    linkText: '示例链接 →'
  },
  {
    title: '示例网站 8',
    description: '继续测试分页',
    url: '#',
    linkText: '示例链接 →'
  },
  {
    title: '示例网站 9',
    description: '最后的测试内容',
    url: '#',
    linkText: '示例链接 →'
  }
]

// 计算分页数据
const allWebsites = websites // 所有网站
const totalItems = computed(() => allWebsites.length)
const totalPages = computed(() => Math.ceil(totalItems.value / websitesPerPage))
const startIndex = computed(() => (currentPage.value - 1) * websitesPerPage)
const endIndex = computed(() => startIndex.value + websitesPerPage)
const displayedWebsites = computed(() => allWebsites.slice(startIndex.value, endIndex.value))

// 获取网站状态的辅助函数
const getWebsiteStatus = (url: string) => {
  return websiteStatus.value.get(url) || { status: 'checking' }
}

// 格式化响应时间
const formatResponseTime = (time?: number) => {
  if (!time) return ''
  if (time < 1000) return `${time}ms`
  return `${(time / 1000).toFixed(2)}s`
}
</script>

<template>
  <div>
    <main class="flex flex-col items-center min-h-screen website-page pt-24" :class="{ 'dispersed': showDisperse }">
      <section ref="websiteSectionRef" class="bg-white rounded-3xl shadow-lg p-12 max-w-4xl w-full mb-12 component-card"
               style="box-shadow: 0 4px 24px rgba(139,90,140,0.08);">
        <h1 class="text-primary text-4xl mb-2 text-center font-fumofumo">{{ pageConfig.title }}</h1>
        <p v-if="'description' in pageConfig" class="text-muted text-xl text-center mb-8">{{ pageConfig.description }}</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a 
            v-for="website in displayedWebsites" 
            :key="website.title"
            :href="website.url" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="bg-gradient-to-br from-gray-50 to-pink-50 rounded-2xl p-6 text-center border border-gray-200 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer no-underline text-inherit hover:shadow-lg relative"
          >
            <!-- 状态指示器 -->
            <div v-if="statusCheckConfig.enable" class="absolute top-4 right-4 flex items-center gap-2">
              <div 
                v-if="getWebsiteStatus(website.url).status === 'checking'"
                class="flex items-center gap-1.5"
              >
                <div class="animate-spin rounded-full h-3 w-3 border-2 border-gray-300 border-t-primary"></div>
                <span class="text-xs text-gray-500">检测中</span>
              </div>
              <div 
                v-else-if="getWebsiteStatus(website.url).status === 'online'"
                class="flex items-center gap-1.5"
                :title="statusCheckConfig.showResponseTime ? `响应时间: ${formatResponseTime(getWebsiteStatus(website.url).responseTime)}` : '在线'"
              >
                <div class="relative">
                  <div class="h-3 w-3 bg-green-500 rounded-full"></div>
                  <div class="absolute inset-0 h-3 w-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <span class="text-xs text-green-600 font-medium">在线</span>
                <span v-if="statusCheckConfig.showResponseTime && getWebsiteStatus(website.url).responseTime" class="text-xs text-gray-400">
                  {{ formatResponseTime(getWebsiteStatus(website.url).responseTime) }}
                </span>
              </div>
              <div 
                v-else-if="getWebsiteStatus(website.url).status === 'offline'"
                class="flex items-center gap-1.5"
              >
                <div class="h-3 w-3 bg-red-500 rounded-full"></div>
                <span class="text-xs text-red-600 font-medium">离线</span>
              </div>
            </div>
            
            <h3 class="text-primary text-xl mb-2 font-fumofumo mt-2">{{ website.title }}</h3>
            <p class="text-muted text-base leading-relaxed m-0">{{ website.description }}</p>
            <div class="mt-3 text-sm text-primary opacity-75">{{ website.linkText }}</div>
          </a>
        </div>
      </section>
      
      <!-- 分页导航 -->
      <section 
        ref="paginationRef"
        v-if="totalPages > 1" 
        class="bg-white rounded-2xl shadow-lg p-6 max-w-4xl w-full mb-12 component-card"
        style="box-shadow: 0 4px 24px rgba(139,90,140,0.08);"
      >
        <div class="flex justify-center items-center gap-2">
          <!-- 上一页按钮 -->
          <NuxtLink 
            v-if="currentPage > 1"
            :to="`/website?page=${currentPage - 1}`"
            class="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-200 hover:scale-105 no-underline"
          >
            <i class="fas fa-chevron-left"></i>
            <span>上一页</span>
          </NuxtLink>
          <span 
            v-else
            class="flex items-center gap-2 bg-gray-50 text-gray-400 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
          >
            <i class="fas fa-chevron-left"></i>
            <span>上一页</span>
          </span>
          
          <!-- 页码显示 -->
          <div class="flex items-center gap-2 mx-4">
            <template v-for="pageNum in totalPages" :key="pageNum">
              <span 
                v-if="pageNum === currentPage"
                class="bg-primary text-white px-3 py-2 rounded-lg text-sm font-medium"
              >
                {{ pageNum }}
              </span>
              <NuxtLink 
                v-else
                :to="`/website?page=${pageNum}`"
                class="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-200 hover:scale-105 no-underline"
              >
                {{ pageNum }}
              </NuxtLink>
            </template>
          </div>
          
          <!-- 下一页按钮 -->
          <NuxtLink 
            v-if="currentPage < totalPages"
            :to="`/website?page=${currentPage + 1}`"
            class="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-200 hover:scale-105 no-underline"
          >
            <span>下一页</span>
            <i class="fas fa-chevron-right"></i>
          </NuxtLink>
          <span 
            v-else
            class="flex items-center gap-2 bg-gray-50 text-gray-400 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
          >
            <span>下一页</span>
            <i class="fas fa-chevron-right"></i>
          </span>
        </div>
        
        <!-- 分页信息 -->
        <div class="text-center mt-4 text-gray-500 text-sm">
          第 {{ currentPage }} 页，共 {{ totalPages }} 页 · 共 {{ totalItems }} 个网站
        </div>
        
        <!-- 状态统计 -->
        <div v-if="statusCheckConfig.enable" class="mt-4 pt-4 border-t border-gray-200">
          <div class="flex items-center justify-center gap-6 flex-wrap">
            <div class="flex items-center gap-2">
              <div class="h-2.5 w-2.5 bg-green-500 rounded-full"></div>
              <span class="text-sm text-gray-600">
                在线: {{ Array.from(websiteStatus.values()).filter(s => s.status === 'online').length }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <div class="h-2.5 w-2.5 bg-red-500 rounded-full"></div>
              <span class="text-sm text-gray-600">
                离线: {{ Array.from(websiteStatus.values()).filter(s => s.status === 'offline').length }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <div class="animate-spin rounded-full h-2.5 w-2.5 border-2 border-gray-300 border-t-primary"></div>
              <span class="text-sm text-gray-600">
                检测中: {{ Array.from(websiteStatus.values()).filter(s => s.status === 'checking').length }}
              </span>
            </div>
            <button
              @click="checkAllWebsites"
              class="ml-4 flex items-center gap-2 bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-90 hover:scale-105"
            >
              <i class="fas fa-sync-alt"></i>
              <span>刷新状态</span>
            </button>
          </div>
        </div>
      </section>

      <!-- 滚动提示和进度指示器 -->
      <div 
        v-if="!showDisperse && !isMobile"
        class="fixed bottom-8 right-8 text-center opacity-70 hover:opacity-100 transition-opacity duration-300"
      >
        <div 
          class="mb-4"
          :class="atBottom ? 'animate-pulse' : 'animate-bounce'"
        >
          <i 
            class="text-2xl mb-2 block"
            :class="atBottom ? 'fas fa-arrow-down text-green-500' : 'fas fa-mouse text-primary'"
          ></i>
          <p class="text-sm text-muted">
            {{ atBottom ? '再向下滚动回到首页' : '滚动到底部' }}
          </p>
        </div>
        
        <!-- 滚动进度条 -->
        <div class="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            class="h-full transition-all duration-150 ease-out rounded-full"
            :class="atBottom ? 'bg-green-500' : 'bg-primary'"
            :style="{ width: scrollProgress + '%' }"
          ></div>
        </div>
        <div class="text-xs text-muted mt-1">
          {{ Math.round(scrollProgress) }}% 
          <span v-if="atBottom" class="text-green-600 ml-1">✓ 已到底部</span>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 网站页面特定样式 */
.website-page .hover\:shadow-lg:hover {
  box-shadow: 0 8px 20px rgba(139,90,140,0.15);
}

.website-page {
  transition: all 1s ease-out;
}

.component-card {
  transition: all 1s ease-out;
}

/* 分散动画样式 */
.website-page.dispersed .component-card {
  animation: scatterCenter 1s ease-out forwards;
}

@keyframes scatterCenter {
  0% {
    transform: translateX(0) translateY(0) rotateZ(0deg) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateX(0) translateY(-100vh) rotateZ(180deg) scale(0.2);
    opacity: 0;
  }
}

/* 状态指示器动画 */
@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* 响应时间提示 */
[title] {
  cursor: help;
}

/* 刷新按钮旋转动画 */
button:active .fa-sync-alt {
  animation: spin 0.6s linear;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
