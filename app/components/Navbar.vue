<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { siteConfig } from '../config/index'

interface Props {
  currentPage?: string
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: ''
})

const isMenuOpen = ref(false)
const route = useRoute()

const toggleMobileMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

// 监听路由变化关闭菜单
watch(() => route.path, () => {
  closeMenu()
})

let clickOutsideHandler: ((e: Event) => void) | null = null
let escapeHandler: ((e: KeyboardEvent) => void) | null = null

onMounted(() => {
  // 监听点击外部区域关闭菜单
  clickOutsideHandler = (e: Event) => {
    const target = e.target as HTMLElement
    if (!target.closest('#nav-toggle') && !target.closest('#nav-menu')) {
      closeMenu()
    }
  }
  
  document.addEventListener('click', clickOutsideHandler)
  
  // 监听 ESC 键关闭菜单
  escapeHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeMenu()
    }
  }
  
  document.addEventListener('keydown', escapeHandler)
})

onUnmounted(() => {
  if (clickOutsideHandler) {
    document.removeEventListener('click', clickOutsideHandler)
  }
  if (escapeHandler) {
    document.removeEventListener('keydown', escapeHandler)
  }
})
</script>

<template>
  <div>
    <!-- 导航栏 -->
    <nav id="navbar" class="fixed top-0 left-0 w-full backdrop-blur-md border-b z-50 py-2 transition-opacity duration-700 ease-in bg-white/90 border-primary/10">
      <div class="max-w-screen-xl mx-auto px-8 flex justify-between items-center">
        <NuxtLink to="/" class="text-3xl font-bold font-fumofumo transition-all duration-300 hover:text-pink-400 hover:scale-105 text-primary">
          {{ siteConfig.site.title }}
        </NuxtLink>

        <!-- 汉堡菜单按钮 (移动端) -->
        <button 
          class="md:hidden flex flex-col bg-transparent border-none cursor-pointer p-3 relative z-50 w-10 h-10 justify-center items-center" 
          id="nav-toggle"
          :class="{ 'nav-toggle-active': isMenuOpen }"
          @click="toggleMobileMenu"
          aria-label="切换菜单"
        >
          <span class="w-6 h-0.5 my-0.5 rounded transition-all duration-300 bg-primary"></span>
          <span class="w-6 h-0.5 my-0.5 rounded transition-all duration-300 bg-primary"></span>
          <span class="w-6 h-0.5 my-0.5 rounded transition-all duration-300 bg-primary"></span>
        </button>

        <!-- 桌面端菜单 -->
        <ul class="hidden md:flex list-none m-0 p-0 gap-8">
          <li v-for="item in siteConfig.navigation.slice(1)" :key="item.key">
            <NuxtLink 
              :to="item.href" 
              class="no-underline font-medium transition-all duration-300 relative py-2 px-4 rounded-full nav-link hover:-translate-y-0.5"
              :class="currentPage === item.key ? 'bg-primary/10 text-primary' : 'text-muted hover:text-primary'"
            >
              {{ item.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>

    <!-- 移动端菜单遮罩 -->
    <div 
      v-if="isMenuOpen"
      class="fixed inset-0 bg-black/20 z-30 md:hidden transition-opacity duration-300"
      @click="closeMenu"
    ></div>

    <!-- 移动端菜单 -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 -translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-4 scale-95"
    >
      <div 
        v-if="isMenuOpen"
        class="fixed top-16 right-4 w-48 bg-white/95 backdrop-blur-md shadow-lg border border-primary/10 rounded-lg z-50 py-3 px-3 md:hidden"
      >
        <ul class="list-none m-0 p-0 flex flex-col gap-1">
          <li v-for="item in siteConfig.navigation.slice(1)" :key="item.key" class="w-full">
            <NuxtLink 
              :to="item.href" 
              class="no-underline font-medium transition-all duration-300 relative py-2 px-3 rounded-md block hover:bg-primary/10 text-center text-sm"
              :class="currentPage === item.key ? 'bg-primary/10 text-primary' : 'text-muted hover:text-primary'"
              @click="closeMenu"
            >
              {{ item.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<style>
/* 汉堡菜单动画效果 */
#nav-toggle {
  transition: all 0.3s ease;
}

#nav-toggle:hover {
  background-color: rgba(139, 90, 140, 0.1);
  border-radius: 6px;
}

.nav-toggle-active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.nav-toggle-active span:nth-child(2) {
  opacity: 0;
  transform: translateX(20px);
}

.nav-toggle-active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* 导航链接hover效果 */
.nav-link:hover {
  color: #8b5a8c !important;
}

/* 移动端菜单项样式 */
@media (max-width: 768px) {
  .mobile-menu .nav-link {
    display: block;
    width: 100%;
    text-align: center;
    padding: 10px 16px;
    border-radius: 8px;
    margin: 2px 0;
    transition: all 0.3s ease;
    font-weight: 500;
    font-size: 14px;
  }
  
  .mobile-menu .nav-link:hover {
    background-color: rgba(139, 90, 140, 0.1);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(139, 90, 140, 0.1);
  }
  
  .mobile-menu .nav-link.router-link-active {
    background-color: rgba(139, 90, 140, 0.15);
    color: #8b5a8c;
  }
}
</style>
