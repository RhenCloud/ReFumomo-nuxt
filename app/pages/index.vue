<script setup lang="ts">
import { siteConfig, getPageConfig } from "../config";

// 页面配置
const pageConfig = getPageConfig("home");

// 设置页面元数据
definePageMeta({
    title: pageConfig.title,
});

// 动画状态
const logoRef = ref<HTMLElement>();
const subtitleRef = ref<HTMLElement>();
const contentRef = ref<HTMLElement>();
const mainRef = ref<HTMLElement>();

// 分散动画状态
const isScattering = ref(false);
const scatterProgress = ref(0);

// 移动端检测
const isMobile = ref(false);

// 路由导航
const router = useRouter();

onMounted(() => {
    // 检测移动设备
    const checkMobile = () => {
        const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isMobileWidth = window.innerWidth <= 768;
        isMobile.value = isMobileUA || isMobileWidth;
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // 触发动画序列
    setTimeout(() => {
        if (logoRef.value) logoRef.value.classList.add("bounce-in");
    }, 200);

    setTimeout(() => {
        if (subtitleRef.value) subtitleRef.value.classList.add("fade-in");
    }, 500);

    setTimeout(() => {
        if (contentRef.value) contentRef.value.classList.add("fade-in-delayed");
    }, 800);

    // 添加滚轮事件监听（仅在非移动端）
    const handleWheel = (e: WheelEvent) => {
        // 只有向下滚动且还没开始分散动画时才触发
        if (e.deltaY > 0 && !isScattering.value) {
            e.preventDefault();
            startScatterAnimation();
        }
    };

    // 绑定滚轮事件（仅在非移动端）
    if (!isMobile.value) {
        document.addEventListener("wheel", handleWheel, { passive: false });
    }

    // 清理函数
    onUnmounted(() => {
        document.removeEventListener("wheel", handleWheel);
        window.removeEventListener("resize", checkMobile);
    });
});

// 开始分散动画
const startScatterAnimation = () => {
    isScattering.value = true;

    // 为每个组件添加分散动画类
    if (logoRef.value) {
        logoRef.value.classList.add("scatter-up");
    }

    if (subtitleRef.value) {
        subtitleRef.value.classList.add("scatter-down");
    }

    if (contentRef.value) {
        const cards = contentRef.value.querySelectorAll(".feature-card");
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add(`scatter-card-${index % 3}`);
            }, index * 100);
        });
    }

    // 1.5秒后导航到文章页
    setTimeout(() => {
        router.push("/articles");
    }, 1500);
};
</script>

<template>
    <div>
        <!-- 加载动画组件 -->
        <!-- TODO: 需要创建Loading组件 -->

        <!-- 主要内容 -->
        <main
            class="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 p-8 relative"
            id="main-content"
        >
            <div class="max-w-screen-xl mx-auto text-center pt-36">
                <h1
                    ref="logoRef"
                    class="text-6xl font-bold text-primary mb-4 font-fumofumo opacity-0 logo"
                    style="transform: scale(0.5) translateY(-3rem); text-shadow: 2px 2px 10px rgba(139, 90, 140, 0.3)"
                >
                    Hi, I'm {{ siteConfig.personal.name }}
                </h1>

                <p
                    ref="subtitleRef"
                    class="text-2xl text-muted mb-12 opacity-0 subtitle"
                    style="transform: translateY(2rem)"
                >
                    {{ siteConfig.site.subtitle }}
                </p>

                <div
                    ref="contentRef"
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 opacity-0 content"
                    style="transform: translateY(3rem)"
                >
                    <div
                        v-for="(feature, index) in siteConfig.home.features"
                        :key="feature.title"
                        :class="`feature-card backdrop-blur-sm bg-white/70 rounded-3xl p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:scale-105`"
                        style="box-shadow: 0 8px 25px rgba(139, 90, 140, 0.15)"
                    >
                        <h2 class="text-2xl text-primary mb-4">{{ feature.title }}</h2>
                        <p class="text-muted leading-relaxed">{{ feature.description }}</p>
                    </div>
                </div>
            </div>

            <!-- 滚动提示 -->
            <div
                v-if="!isScattering && !isMobile"
                class="fixed bottom-8 left-1/2 transform -translate-x-1/2 text-center opacity-70 hover:opacity-100 transition-opacity duration-300"
            >
                <div class="animate-bounce">
                    <i class="fas fa-mouse text-2xl text-primary mb-2 block"></i>
                    <p class="text-sm text-muted">向下滚动进入文章页</p>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
/* 分散动画样式 */
.scatter-up {
    animation: scatterUp 1.5s ease-in-out forwards;
}

.scatter-down {
    animation: scatterDown 1.5s ease-in-out forwards;
}

.scatter-card-0 {
    animation: scatterLeft 1.5s ease-in-out forwards;
}

.scatter-card-1 {
    animation: scatterCenter 1.5s ease-in-out forwards;
}

.scatter-card-2 {
    animation: scatterRight 1.5s ease-in-out forwards;
}

@keyframes scatterUp {
    0% {
        transform: scale(1) translateY(0);
        opacity: 1;
    }
    100% {
        transform: scale(0.3) translateY(-100vh);
        opacity: 0;
    }
}

@keyframes scatterDown {
    0% {
        transform: scale(1) translateY(0);
        opacity: 1;
    }
    100% {
        transform: scale(0.3) translateY(100vh);
        opacity: 0;
    }
}

@keyframes scatterLeft {
    0% {
        transform: scale(1) translateX(0) translateY(0) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: scale(0.3) translateX(-100vw) translateY(50vh) rotate(-45deg);
        opacity: 0;
    }
}

@keyframes scatterCenter {
    0% {
        transform: scale(1) translateX(0) translateY(0) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: scale(0.3) translateX(0) translateY(-100vh) rotate(180deg);
        opacity: 0;
    }
}

@keyframes scatterRight {
    0% {
        transform: scale(1) translateX(0) translateY(0) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: scale(0.3) translateX(100vw) translateY(50vh) rotate(45deg);
        opacity: 0;
    }
}

/* 为组件添加过渡效果 */
.feature-card {
    transition: all 0.3s ease;
}
</style>
