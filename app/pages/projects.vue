<script setup lang="ts">
import { getPageConfig } from "../config";
import { ref, onMounted, onUnmounted } from "vue";

// 页面配置
const pageConfig = getPageConfig("projects");

// 设置页面元数据
definePageMeta({
    title: pageConfig.title,
});

// 分散动画相关
const projectsSectionRef = ref(null);
const paginationRef = ref(null);
const showDisperse = ref(false);
const scrollProgress = ref(0);
const atBottom = ref(false);

// 检测是否为移动设备
const isMobile = ref(false);

// 获取URL参数和路由
const route = useRoute();
const router = useRouter();
const currentPage = computed(() => parseInt((route.query.page as string) || "1"));
const projectsPerPage = 10; // 每页最多显示5行项目

const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    // 计算滚动进度
    const maxScroll = docHeight - windowHeight;
    scrollProgress.value = Math.min((scrollTop / maxScroll) * 100, 100);

    // 检查是否滚动到底部
    const isAtBottom = scrollTop + windowHeight >= docHeight - 10;
    atBottom.value = isAtBottom;
};

// 处理滚轮事件
const handleWheel = (event: WheelEvent) => {
    // 只有当已经到达底部并且再次向下滚动时才触发分散动画
    if (atBottom.value && event.deltaY > 0 && !showDisperse.value) {
        event.preventDefault();
        showDisperse.value = true;

        // 延迟导航到首页
        setTimeout(() => {
            navigateTo("/website");
        }, 1000);
    }
};

onMounted(() => {
    // 检测移动设备
    isMobile.value =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth < 768;

    // 监听窗口大小变化
    const handleResize = () => {
        isMobile.value = window.innerWidth < 768;
    };
    window.addEventListener("resize", handleResize);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("wheel", handleWheel, { passive: false });

    onUnmounted(() => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("wheel", handleWheel);
        window.removeEventListener("resize", handleResize);
    });
});

// 监听路由变化，切换页码时滚动到顶部
watch(
    () => route.query.page,
    (newPage, oldPage) => {
        if (newPage !== oldPage) {
            // 平滑滚动到页面顶部
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    }
);

// 项目数据类型
interface Project {
    title: string;
    description: string;
    demoUrl: string;
    githubUrl: string;
    demoText: string;
    isPlaceholder?: boolean;
}

// 项目数据
const projects: Project[] = [
    {
        title: "ILP",
        description: "跨平台、多网站、模块化的小说下载器",
        demoUrl: "#",
        githubUrl: "https://github.com/RhenCloud/ILP",
        demoText: "暂无预览",
    },
    {
        title: "ILP-C++",
        description: "跨平台、多网站、模块化的小说下载器",
        demoUrl: "#",
        githubUrl: "https://github.com/RhenCloud/ILP-Cpp",
        demoText: "暂无预览",
    },
];

// 计算分页数据
const allProjects = projects; // 所有项目
const totalItems = computed(() => allProjects.length);
const totalPages = computed(() => Math.ceil(totalItems.value / projectsPerPage));
const startIndex = computed(() => (currentPage.value - 1) * projectsPerPage);
const endIndex = computed(() => startIndex.value + projectsPerPage);

// 显示的项目列表（包含"更多项目"占位符）
const displayedProjects = computed((): Project[] => {
    const currentProjects = allProjects.slice(startIndex.value, endIndex.value);

    // 如果是最后一页，且当前页项目数少于每页限制，添加"更多项目"占位符
    if (currentPage.value === totalPages.value && currentProjects.length < projectsPerPage) {
        return [
            ...currentProjects,
            {
                title: "💡 更多项目",
                description: "敬请期待更多精彩的项目作品",
                demoUrl: "#",
                githubUrl: "#",
                demoText: "🚧 开发中",
                isPlaceholder: true,
            },
        ];
    }

    return currentProjects;
});
</script>

<template>
    <div>
        <main class="flex flex-col items-center min-h-screen projects-page pt-24" :class="{ dispersed: showDisperse }">
            <section
                ref="projectsSectionRef"
                class="bg-white rounded-3xl shadow-lg p-12 max-w-4xl w-full mb-12 component-card"
                style="box-shadow: 0 4px 24px rgba(139, 90, 140, 0.08)"
            >
                <h1 class="text-primary text-4xl mb-2 text-center font-fumofumo">{{ pageConfig.title }}</h1>
                <p v-if="'description' in pageConfig" class="text-muted text-xl text-center mb-8">
                    {{ pageConfig.description }}
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- 项目卡片 -->
                    <div
                        v-for="project in displayedProjects"
                        :key="project.title"
                        :class="
                            project.isPlaceholder
                                ? 'bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg'
                                : 'bg-gradient-to-br from-gray-50 to-pink-50 rounded-2xl p-6 border border-gray-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg'
                        "
                    >
                        <div class="text-center mb-4">
                            <h3 class="text-primary text-xl mb-2 font-fumofumo">{{ project.title }}</h3>
                            <p class="text-muted text-base leading-relaxed">{{ project.description }}</p>
                        </div>

                        <div class="flex justify-center items-center gap-3 mt-4">
                            <!-- 占位符项目的特殊按钮 -->
                            <div
                                v-if="project.isPlaceholder"
                                class="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
                            >
                                {{ project.demoText }}
                            </div>

                            <!-- 正常项目的按钮 -->
                            <template v-else>
                                <!-- 预览项目按钮 -->
                                <a
                                    :href="project.demoUrl"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="text-primary px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-opacity-90 hover:scale-110 hover:-translate-y-1 hover:shadow-lg no-underline"
                                >
                                    {{ project.demoText }}
                                </a>

                                <!-- GitHub图标按钮 -->
                                <a
                                    :href="project.githubUrl"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="text-primary p-2 rounded-lg transition-all duration-300 hover:shadow-xl hover:scale-110 hover:-translate-y-1 no-underline flex items-center justify-center"
                                    title="查看源代码"
                                >
                                    <i class="fab fa-github text-xl"></i>
                                </a>
                            </template>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 分页导航 -->
            <section
                ref="paginationRef"
                v-if="totalPages > 1"
                class="bg-white rounded-2xl shadow-lg p-6 max-w-4xl w-full mb-12 component-card"
                style="box-shadow: 0 4px 24px rgba(139, 90, 140, 0.08)"
            >
                <div class="flex justify-center items-center gap-2">
                    <!-- 上一页按钮 -->
                    <NuxtLink
                        v-if="currentPage > 1"
                        :to="`/projects?page=${currentPage - 1}`"
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
                                :to="`/projects?page=${pageNum}`"
                                class="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-200 hover:scale-105 no-underline"
                            >
                                {{ pageNum }}
                            </NuxtLink>
                        </template>
                    </div>

                    <!-- 下一页按钮 -->
                    <NuxtLink
                        v-if="currentPage < totalPages"
                        :to="`/projects?page=${currentPage + 1}`"
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
                    第 {{ currentPage }} 页，共 {{ totalPages }} 页 · 共 {{ totalItems }} 个项目
                </div>
            </section>

            <!-- 滚动提示和进度指示器 -->
            <div
                v-if="!showDisperse && !isMobile"
                class="fixed bottom-8 right-8 text-center opacity-70 hover:opacity-100 transition-opacity duration-300"
            >
                <div class="mb-4" :class="atBottom ? 'animate-pulse' : 'animate-bounce'">
                    <i
                        class="text-2xl mb-2 block"
                        :class="atBottom ? 'fas fa-arrow-down text-green-500' : 'fas fa-mouse text-primary'"
                    ></i>
                    <p class="text-sm text-muted">
                        {{ atBottom ? "再向下滚动进入网站页" : "滚动到底部" }}
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
/* 项目页面特定样式 */
.projects-page .hover\:shadow-lg:hover {
    box-shadow: 0 8px 20px rgba(139, 90, 140, 0.15);
}

.projects-page {
    transition: all 1s ease-out;
}

.component-card {
    transition: all 1s ease-out;
}

/* 分散动画样式 */
.projects-page.dispersed .component-card {
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
</style>
