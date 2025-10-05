<script setup lang="ts">
import { siteConfig, getPageConfig } from "../config";

// 页面配置
const pageConfig = getPageConfig("articles");

// 设置页面元数据
definePageMeta({
    title: pageConfig.title,
});

// RSS数据接口
interface RSSItem {
    title: string;
    link: string;
    pubDate: string;
    description: string;
}

// 获取URL参数
const route = useRoute();
const router = useRouter();
const currentPage = computed(() => parseInt((route.query.page as string) || "1"));
const postsPerPage = siteConfig.articles.postsPerPage;

// 响应式数据
const allItems = ref<RSSItem[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

// 分散动画状态
const isScattering = ref(false);
const headerRef = ref<HTMLElement>();
const articlesRef = ref<HTMLElement>();
const paginationRef = ref<HTMLElement>();
const scrollProgress = ref(0);
const hasReachedBottom = ref(false); // 是否已经到达底部

// 检测是否为移动设备
const isMobile = ref(false);

// 获取RSS数据
const fetchRSSData = async () => {
    try {
        isLoading.value = true;
        error.value = null;

        // 调用服务器端 API 获取 RSS 数据
        const response = await $fetch<{ items: RSSItem[]; total: number; error?: string }>("/api/rss");

        if (response.error) {
            throw new Error(response.error);
        }

        allItems.value = response.items || [];
    } catch (e) {
        console.error("RSS获取失败:", e);
        error.value = e instanceof Error ? e.message : "文章加载失败";
        allItems.value = [];
    } finally {
        isLoading.value = false;
    }
};

// 计算分页数据
const totalItems = computed(() => allItems.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / postsPerPage));
const startIndex = computed(() => (currentPage.value - 1) * postsPerPage);
const endIndex = computed(() => startIndex.value + postsPerPage);
const items = computed(() => allItems.value.slice(startIndex.value, endIndex.value));

// 格式化日期
const formatDate = (dateString: string) => {
    if (!dateString) return "未知日期";
    return new Date(dateString).toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};

// 页面加载时获取数据
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

    fetchRSSData();

    // 更新滚动进度
    const updateScrollProgress = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const totalScrollable = documentHeight - windowHeight;

        if (totalScrollable > 0) {
            scrollProgress.value = Math.min(100, (scrollTop / totalScrollable) * 100);
        }

        // 检查是否到达底部
        const distanceFromBottom = documentHeight - (scrollTop + windowHeight);
        const isAtBottom = distanceFromBottom <= 50;

        // 如果到达底部，标记为已到达
        if (isAtBottom && !hasReachedBottom.value) {
            hasReachedBottom.value = true;
        }
    };

    // 添加滚轮事件监听
    const handleWheel = (e: WheelEvent) => {
        // 检查是否已经滚动到页面底部
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // 计算距离底部的距离（允许50px的误差）
        const distanceFromBottom = documentHeight - (scrollTop + windowHeight);
        const isAtBottom = distanceFromBottom <= 50;

        // 只有向下滚动、已经到达过底部且还没开始分散动画时才触发
        if (e.deltaY > 0 && hasReachedBottom.value && isAtBottom && !isScattering.value) {
            e.preventDefault();
            startScatterAnimation();
        }
    };

    // 绑定事件
    document.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", updateScrollProgress, { passive: true });

    // 清理函数
    onUnmounted(() => {
        document.removeEventListener("wheel", handleWheel);
        window.removeEventListener("scroll", updateScrollProgress);
        window.removeEventListener("resize", handleResize);
    });
});

// 开始分散动画
const startScatterAnimation = () => {
    isScattering.value = true;

    // 为各个组件添加分散动画类
    if (headerRef.value) {
        headerRef.value.classList.add("scatter-up");
    }

    if (articlesRef.value) {
        const articles = articlesRef.value.querySelectorAll(".article-card");
        articles.forEach((article, index) => {
            setTimeout(() => {
                article.classList.add(`scatter-article-${index % 4}`);
            }, index * 80);
        });
    }

    if (paginationRef.value) {
        setTimeout(() => {
            paginationRef.value?.classList.add("scatter-down");
        }, 400);
    }

    // 2秒后导航到关于页
    setTimeout(() => {
        router.push("/about");
    }, 2000);
};

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
</script>

<template>
    <div>
        <main class="flex flex-col items-center min-h-screen articles-page pt-24 relative">
            <section
                ref="headerRef"
                class="bg-white rounded-3xl shadow-lg p-12 max-w-4xl w-full flex flex-col mb-12"
                style="box-shadow: 0 4px 24px rgba(139, 90, 140, 0.08)"
            >
                <h1 class="text-primary text-4xl mb-2 text-center font-fumofumo">
                    {{ siteConfig.articles.pageTitle }}
                </h1>
                <p class="text-muted text-xl text-center mb-8">{{ siteConfig.articles.pageDescription }}</p>

                <!-- 文章来源说明与订阅地址 -->
                <div class="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 mb-8 border border-pink-100">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div class="flex items-center gap-2">
                            <span class="text-2xl"></span>
                            <span class="text-primary text-sm">{{ siteConfig.articles.sourceDescription }}</span>
                        </div>
                        <div class="flex items-center gap-4">
                            <a
                                href="https://blog.sakura.ink"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="flex items-center gap-2 bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-opacity-90 hover:scale-105 no-underline"
                            >
                                <i class="fas fa-external-link-alt"></i>
                                <span>访问博客</span>
                            </a>
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                class="flex items-center gap-2 bg-orange-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-orange-600 hover:scale-105 no-underline"
                            >
                                <i class="fas fa-rss"></i>
                                <span>RSS订阅</span>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- 加载状态 -->
                <div v-if="isLoading" class="text-center text-primary py-12 text-lg">
                    <i class="fas fa-spinner fa-spin mr-2"></i>
                    正在加载文章...
                </div>

                <!-- 错误状态 -->
                <div v-else-if="error" class="text-center py-12">
                    <div class="text-red-500 text-lg mb-4">
                        <i class="fas fa-exclamation-triangle mr-2"></i>
                        {{ error }}
                    </div>
                    <button
                        @click="fetchRSSData"
                        class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                        <i class="fas fa-redo mr-2"></i>
                        重新加载
                    </button>
                </div>

                <!-- 文章列表 -->
                <div ref="articlesRef" v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <template v-if="items.length > 0">
                        <article
                            v-for="item in items"
                            :key="item.link"
                            class="article-card bg-gradient-to-br from-gray-50 to-pink-50 rounded-2xl border border-gray-200 transition-all duration-200 hover:-translate-y-1 overflow-hidden hover:shadow-lg"
                        >
                            <a
                                :href="item.link"
                                target="_blank"
                                rel="noopener"
                                class="block p-6 no-underline text-inherit h-full relative"
                            >
                                <h3 class="text-primary text-xl font-semibold mb-3 leading-snug font-fumofumo">
                                    {{ item.title }}
                                </h3>
                                <p class="text-muted text-sm leading-relaxed mb-10 line-clamp-3 overflow-hidden">
                                    {{ item.description || "暂无简介" }}
                                </p>
                                <time class="absolute text-gray-400 text-xs font-normal bottom-4 right-6">
                                    {{ formatDate(item.pubDate) }}
                                </time>
                            </a>
                        </article>
                    </template>
                    <div v-else class="col-span-full text-center text-primary py-12 text-lg">暂无文章</div>
                </div>
            </section>

            <!-- 分页导航 -->
            <section
                ref="paginationRef"
                v-if="totalPages > 1"
                class="bg-white rounded-2xl shadow-lg p-6 max-w-4xl w-full mb-12"
                style="box-shadow: 0 4px 24px rgba(139, 90, 140, 0.08)"
            >
                <div class="flex justify-center items-center gap-2">
                    <!-- 上一页按钮 -->
                    <NuxtLink
                        v-if="currentPage > 1"
                        :to="`/articles?page=${currentPage - 1}`"
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
                                :to="`/articles?page=${pageNum}`"
                                class="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-200 hover:scale-105 no-underline"
                            >
                                {{ pageNum }}
                            </NuxtLink>
                        </template>
                    </div>

                    <!-- 下一页按钮 -->
                    <NuxtLink
                        v-if="currentPage < totalPages"
                        :to="`/articles?page=${currentPage + 1}`"
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
                    第 {{ currentPage }} 页，共 {{ totalPages }} 页 · 共 {{ totalItems }} 篇文章
                </div>
            </section>

            <!-- 滚动提示和进度指示器 -->
            <div
                v-if="!isScattering && !isLoading && !isMobile"
                class="fixed bottom-8 right-8 text-center opacity-70 hover:opacity-100 transition-opacity duration-300"
            >
                <div class="mb-4" :class="hasReachedBottom ? 'animate-pulse' : 'animate-bounce'">
                    <i
                        class="text-2xl mb-2 block"
                        :class="hasReachedBottom ? 'fas fa-arrow-down text-green-500' : 'fas fa-mouse text-primary'"
                    ></i>
                    <p class="text-sm text-muted">
                        {{ hasReachedBottom ? "再向下滚动进入关于页" : "滚动到底部" }}
                    </p>
                </div>

                <!-- 滚动进度条 -->
                <div class="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        class="h-full transition-all duration-150 ease-out rounded-full"
                        :class="hasReachedBottom ? 'bg-green-500' : 'bg-primary'"
                        :style="{ width: scrollProgress + '%' }"
                    ></div>
                </div>
                <div class="text-xs text-muted mt-1">
                    {{ Math.round(scrollProgress) }}%
                    <span v-if="hasReachedBottom" class="text-green-600 ml-1">✓ 已到底部</span>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
/* 分散动画样式 */
.scatter-up {
    animation: scatterUp 2s ease-in-out forwards;
}

.scatter-down {
    animation: scatterDown 2s ease-in-out forwards;
}

.scatter-article-0 {
    animation: scatterTopLeft 1.8s ease-in-out forwards;
}

.scatter-article-1 {
    animation: scatterTopRight 1.8s ease-in-out forwards;
}

.scatter-article-2 {
    animation: scatterBottomLeft 1.8s ease-in-out forwards;
}

.scatter-article-3 {
    animation: scatterBottomRight 1.8s ease-in-out forwards;
}

@keyframes scatterUp {
    0% {
        transform: scale(1) translateY(0) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: scale(0.2) translateY(-120vh) rotate(-180deg);
        opacity: 0;
    }
}

@keyframes scatterDown {
    0% {
        transform: scale(1) translateY(0) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: scale(0.2) translateY(120vh) rotate(180deg);
        opacity: 0;
    }
}

@keyframes scatterTopLeft {
    0% {
        transform: scale(1) translate(0, 0) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: scale(0.3) translate(-120vw, -80vh) rotate(-90deg);
        opacity: 0;
    }
}

@keyframes scatterTopRight {
    0% {
        transform: scale(1) translate(0, 0) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: scale(0.3) translate(120vw, -80vh) rotate(90deg);
        opacity: 0;
    }
}

@keyframes scatterBottomLeft {
    0% {
        transform: scale(1) translate(0, 0) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: scale(0.3) translate(-120vw, 80vh) rotate(-270deg);
        opacity: 0;
    }
}

@keyframes scatterBottomRight {
    0% {
        transform: scale(1) translate(0, 0) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: scale(0.3) translate(120vw, 80vh) rotate(270deg);
        opacity: 0;
    }
}

/* 文章页面特定样式 */
.articles-page .hover\:shadow-lg:hover {
    box-shadow: 0 8px 25px rgba(139, 90, 140, 0.15);
}

/* 为文章卡片添加过渡效果 */
.article-card {
    transition: all 0.3s ease;
}
</style>
