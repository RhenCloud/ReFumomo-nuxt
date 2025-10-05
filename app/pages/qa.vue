<script setup lang="ts">
import { getPageConfig } from "../config";
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

// 页面配置
const pageConfig = getPageConfig("qa");

// 设置页面元数据
definePageMeta({
    title: pageConfig.title,
});

// 分散动画相关
const qaRef = ref<HTMLElement>();
const qaListRef = ref<HTMLDivElement>();
const showDisperse = ref(false);
const scrollProgress = ref(0);
const atBottom = ref(false);

// 检测是否为移动设备
const isMobile = ref(false);

// 获取URL参数和路由
const route = useRoute();
const router = useRouter();

// 滚动处理
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
    if (atBottom.value && event.deltaY > 0) {
        event.preventDefault();
    }
};

// 响应式调整
const handleResize = () => {
    isMobile.value = window.innerWidth < 768;
};

// 生命周期钩子
onMounted(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("resize", handleResize);
    handleResize();
});

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("wheel", handleWheel);
    window.removeEventListener("resize", handleResize);
});

// 监听路由变化
watch(
    () => route.query.page,
    (newPage, oldPage) => {
        if (newPage !== oldPage) {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    }
);

// Q&A数据
const qaList = [
    {
        question: "为什么叫RhenCloud？",
        answer: "Rhen来自第75号元素 铼Rhenium 的词根，原义莱茵河，Cloud只是为了让域名短一些（",
    },
];
</script>

<template>
    <div>
        <main class="flex flex-col items-center min-h-screen qa-page pt-24" :class="{ dispersed: showDisperse }">
            <section
                ref="qaRef"
                class="bg-white rounded-3xl shadow-lg p-12 max-w-4xl w-full mb-12 component-card"
                style="box-shadow: 0 4px 24px rgba(139, 90, 140, 0.08)"
            >
                <h1 class="text-primary text-4xl mb-8 text-center font-fumofumo">{{ pageConfig.title }}</h1>

                <!-- Q&A内容 -->
                <div ref="qaListRef" v-for="(qa, index) in qaList" :key="index" class="mb-6">
                    <h3 class="text-2xl font-bold text-primary mb-2">{{ qa.question }}</h3>
                    <p class="text-lg text-gray-700">{{ qa.answer }}</p>
                </div>

                <!-- class="fixed bottom-24 left-1/2 transform -translate-x-1/2 sm:bottom-28 md:bottom-32 lg:bottom-36" -->
                <div v-if="atBottom" class="fixed left-1/2 transform -translate-x-1/2">
                    <button
                        @click="router.push('/')"
                        class="bg-primary text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-opacity-80 hover:scale-130 no-underline cursor-pointer"
                    >
                        回家
                    </button>
                </div>
            </section>

            <!-- 滚动进度条 -->
            <div class="fixed bottom-8 right-8 bg-white p-4 rounded-lg shadow-lg flex items-center">
                <div class="w-32 h-2 bg-gray-200 rounded-full overflow-hidden mr-3">
                    <div
                        class="h-full transition-all duration-150 ease-out rounded-full"
                        :class="atBottom ? 'bg-green-500' : 'bg-primary'"
                        :style="{ width: scrollProgress + '%' }"
                    ></div>
                </div>
                <div class="text-xs text-muted">
                    {{ Math.round(scrollProgress) }}%
                    <span v-if="atBottom" class="text-green-600 ml-1">✓ 已到底部</span>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
/* Q&A页面特定样式 */
.qa-page .hover\:shadow-lg:hover {
    box-shadow: 0 8px 20px rgba(139, 90, 140, 0.15);
}

.qa-page {
    transition: all 1s ease-out;
}

.component-card {
    transition: all 1s ease-out;
}

/* 移动设备适配 */
@media (max-width: 768px) {
    .qa-page {
        padding-top: 6rem;
    }

    .component-card {
        padding: 1.5rem;
    }
}
</style>
