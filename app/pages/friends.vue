<script setup lang="ts">
import { getPageConfig } from "../config";

// 页面配置
const pageConfig = getPageConfig("friends");

// 设置页面元数据
definePageMeta({
    title: pageConfig.title,
});

// 分散动画相关
const friendsSectionRef = ref(null);
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
const friendsPerPage = 10; // 每页最多显示10个网站

// 表单相关响应式变量
const showApplyForm = ref(false);
const isSubmitting = ref(false);
const showSuccessMessage = ref(false); // 新增成功提示控制

// 友链申请表单数据
const friendRequest = ref({
    siteName: "",
    siteUrl: "",
    description: "",
    email: "",
    avatar: "",
});

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

        // 延迟导航到项目页
        setTimeout(() => {
            navigateTo("/projects");
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
    () => {
        // 平滑滚动到页面顶部
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }
);

// 网站数据类型
interface Friend {
    title: string;
    description: string;
    avatar: string;
    url: string;
}

// 网站数据
const friends: Friend[] = [
    {
        title: "鈴奈咲桜のBlog",
        description: "愛することを忘れないで",
        avatar: "https://q2.qlogo.cn/headimg_dl?dst_uin=2731443459&spec=5",
        url: "https://blog.sakura.ink",
    },
    {
        title: "示例友链2",
        description: "示例描述2",
        avatar: "/favicon.ico",
        url: "https://www.example2.com",
    },
];

// 计算分页数据
const allFriends = friends; // 所有友链
const totalItems = computed(() => allFriends.length);
const totalPages = computed(() => Math.ceil(totalItems.value / friendsPerPage));
const startIndex = computed(() => (currentPage.value - 1) * friendsPerPage);
const endIndex = computed(() => startIndex.value + friendsPerPage);
const displayedFriends = computed(() => allFriends.slice(startIndex.value, endIndex.value));

// 表单提交处理
async function submitFriendRequest() {
    if (isSubmitting.value) return; // 防止重复提交
    isSubmitting.value = true;

    try {
        // 发送申请信息到服务器
        const response = await fetch("/api/friend-request", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(friendRequest.value),
        });

        if (response.ok) {
            // 提交成功，重置表单
            showApplyForm.value = false;
            showSuccessMessage.value = true;
            resetForm();

            // 3秒后隐藏成功消息
            setTimeout(() => {
                showSuccessMessage.value = false;
            }, 3000);
        } else {
            const responseData = await response.json();
            alert("提交失败: " + responseData.message);
        }
    } catch (error) {
        console.error("提交失败:", error);
        alert("提交失败，请检查网络连接后重试");
    } finally {
        isSubmitting.value = false;
    }
}

function resetForm() {
    friendRequest.value = {
        siteName: "",
        siteUrl: "",
        description: "",
        email: "",
        avatar: "",
    };
}
</script>

<template>
    <div>
        <main class="flex flex-col items-center min-h-screen friends-page pt-24" :class="{ dispersed: showDisperse }">
            <section
                ref="friendsSectionRef"
                class="bg-white rounded-3xl shadow-lg p-12 max-w-4xl w-full mb-12 component-card"
                style="box-shadow: 0 4px 24px rgba(139, 90, 140, 0.08)"
            >
                <h1 class="text-primary text-4xl mb-2 text-center font-fumofumo">{{ pageConfig.title }}</h1>
                <p v-if="'description' in pageConfig" class="text-muted text-xl text-center mb-8">
                    {{ pageConfig.description }}
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <a
                        v-for="friend in displayedFriends"
                        :key="friend.title"
                        :href="friend.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="bg-gradient-to-br from-gray-50 to-pink-50 rounded-2xl p-6 border border-gray-200 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer no-underline text-inherit hover:shadow-lg flex flex-col md:flex-row gap-2 items-center md:items-start justify-center md:justify-between"
                    >
                        <div class="flex items-center">
                            <img :src="friend.avatar" alt="Friend Avatar" class="w-16 h-16 rounded-full" />
                            <div class="flex flex-col items-start ml-2">
                                <h3 class="text-primary text-xl mb-2 font-fumofumo">{{ friend.title }}</h3>
                                <p class="text-muted text-base leading-relaxed m-0">{{ friend.description }}</p>
                                <div class="mt-3 text-sm text-primary opacity-75">点击前往 -></div>
                            </div>
                        </div>
                    </a>
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
                        :to="`/friends?page=${currentPage - 1}`"
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
                                :to="`/friends?page=${pageNum}`"
                                class="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-200 hover:scale-105 no-underline"
                            >
                                {{ pageNum }}
                            </NuxtLink>
                        </template>
                    </div>

                    <!-- 下一页按钮 -->
                    <NuxtLink
                        v-if="currentPage < totalPages"
                        :to="`/friends?page=${currentPage + 1}`"
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
            </section>

            <!-- 申请友链按钮 -->
            <section
                ref="applyButtonRef"
                class="bg-white rounded-2xl shadow-lg p-6 max-w-4xl w-full mb-12 component-card flex justify-center items-center"
                style="box-shadow: 0 4px 24px rgba(139, 90, 140, 0.08)"
            >
                <div class="apply-section">
                    <button
                        class="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-opacity-90 hover:scale-105 no-underline"
                        @click="showApplyForm = true"
                    >
                        申请友链
                    </button>
                </div>
                <!-- 提交成功消息 -->
                <div v-if="showSuccessMessage" class="success-message">
                    <p>提交成功！</p>
                </div>
            </section>

            <!-- 申请友链表单弹窗 -->
            <Teleport to="body">
                <div v-if="showApplyForm" class="modal-overlay" @click="showApplyForm = false">
                    <div class="modal-content apply-form" @click.stop>
                        <h2>申请友链</h2>
                        <form @submit.prevent="submitFriendRequest">
                            <div class="form-group">
                                <label for="siteName">网站名称 *</label>
                                <input
                                    type="text"
                                    id="siteName"
                                    v-model="friendRequest.siteName"
                                    class="styled-input"
                                    placeholder="网站名称"
                                    required
                                />
                            </div>

                            <div class="form-group">
                                <label for="siteUrl">网站链接 *</label>
                                <input
                                    type="url"
                                    id="siteUrl"
                                    v-model="friendRequest.siteUrl"
                                    class="styled-input"
                                    placeholder="https://example.com（一定要添加协议头）"
                                    required
                                />
                            </div>

                            <div class="form-group">
                                <label for="description">网站描述</label>
                                <textarea
                                    id="description"
                                    v-model="friendRequest.description"
                                    class="styled-textarea"
                                    placeholder="简单介绍一下你的网站"
                                ></textarea>
                            </div>

                            <div class="form-group">
                                <label for="email">联系邮箱 *</label>
                                <input
                                    type="email"
                                    id="email"
                                    v-model="friendRequest.email"
                                    class="styled-input"
                                    placeholder="example@example.com"
                                    required
                                />
                            </div>

                            <div class="form-group">
                                <label for="avatar">头像链接</label>
                                <input
                                    type="url"
                                    id="avatar"
                                    v-model="friendRequest.avatar"
                                    class="styled-input"
                                    placeholder="https://example.com/avatar.png"
                                />
                            </div>

                            <div class="form-actions">
                                <button type="button" @click="showApplyForm = false" class="cancel-btn">取消</button>
                                <button type="submit" class="submit-btn" :disabled="isSubmitting">
                                    {{ isSubmitting ? "提交中..." : "提交申请" }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Teleport>


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
                        {{ atBottom ? "再向下滚动进入项目页" : "滚动到底部" }}
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
.friends-page .hover\:shadow-lg:hover {
    box-shadow: 0 8px 20px rgba(139, 90, 140, 0.15);
}

.friends-page {
    transition: all 1s ease-out;
}

.component-card {
    transition: all 1s ease-out;
}

/* 分散动画样式 */
.friends-page.dispersed .component-card {
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

/* 申请友链按钮美化样式 */
.styled-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    font-weight: 600;
    letter-spacing: 0.5px;
}

.styled-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.styled-button:active {
    transform: translateY(0);
}

.styled-button.cancel-btn {
    background-color: #f1f5f9;
    color: #64748b;
}

.styled-button.cancel-btn:hover {
    background-color: #e2e8f0;
}

.styled-button.submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

/* 申请表单样式 */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
}

.apply-form {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    animation: modalAppear 0.3s ease-out;
}

@keyframes modalAppear {
    from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.apply-form h2 {
    margin-top: 0;
    color: #333;
    text-align: center;
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    font-weight: 700;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #444;
}

.styled-input,
.styled-textarea {
    width: 100%;
    padding: 0.8rem 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
}

.styled-input:focus,
.styled-textarea:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.styled-textarea {
    min-height: 100px;
    resize: vertical;
}

.form-actions {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 2rem;
}

.styled-button.cancel-btn {
    background-color: #f1f5f9;
    color: #64748b;
}

.styled-button.cancel-btn:hover {
    background-color: #e2e8f0;
}

.styled-button.submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(102, 126, 234, 0.4);
}

/* 提交成功消息样式 */
.success-message {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #48bb78;
    color: white;
    padding: 1rem 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 1001;
    animation: fadeInOut 3s ease-in-out forwards;
}
@keyframes fadeInOut {
    0% {
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}

/* 移动端适配 */
@media (max-width: 768px) {
    .apply-form {
        padding: 1.5rem;
        width: 95%;
    }

    .form-actions {
        flex-direction: column;
    }

    .styled-button {
        width: 100%;
        padding: 1rem;
    }
}
</style>
